"use client";

import Link from "next/link";
import {
  useActionState,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from "react";
import {
  Check,
  Eye,
  Loader2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  bulkDeleteLeadsAction,
  deleteLeadAction,
  type ManageLeadsState,
} from "@/app/_actions/manage-leads";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: ManageLeadsState = {
  status: "idle",
};

type LeadRow = {
  id: number;
  fullName: string;
  phone: string;
  userState: string | null;
  city: string | null;
  seminarEvent: string | null;
  interestedCountry: string | null;
  sourcePath: string;
  watiMessageStatus: string;
  watiTemplateName: string | null;
  createdAt: Date | null;
};

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function whatsappStatusTone(status: string | null) {
  switch (status) {
    case "read":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "delivered":
    case "sent":
    case "accepted":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
    case "replied":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-200";
    case "failed":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    case "skipped":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
}

function SelectionCheckbox({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex size-4 items-center justify-center rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        checked
          ? "border-primary bg-primary text-white"
          : "border-slate-300 bg-white text-transparent hover:border-primary/60"
      )}
    >
      <Check className="size-3" strokeWidth={3} />
    </button>
  );
}

function DeleteLeadButton({
  leadId,
  leadName,
  onDeleted,
  redirectTo,
  className,
  variant = "outline",
  size = "xs",
  label = "Delete",
}: {
  leadId: number;
  leadName: string;
  onDeleted?: (leadId: number) => void;
  redirectTo?: string;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  label?: string;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(deleteLeadAction, initialState);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    onDeleted?.(leadId);

    if (redirectTo) {
      router.push(redirectTo);
      router.refresh();
    }
  }, [leadId, onDeleted, redirectTo, router, state.status]);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${leadName}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="leadId" value={leadId} />
      <Button
        type="submit"
        variant={variant}
        size={size}
        disabled={pending}
        className={className}
      >
        {pending ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
        {label}
      </Button>
    </form>
  );
}

function LeadActionsMenu({
  leadId,
  leadName,
  canDelete,
  onDeleted,
}: {
  leadId: number;
  leadName: string;
  canDelete: boolean;
  onDeleted?: (leadId: number) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(`[data-lead-actions-menu="${leadId}"]`)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [leadId, open]);

  return (
    <div className="relative inline-flex" data-lead-actions-menu={leadId}>
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <MoreHorizontal className="size-3.5" />
      </Button>

      {open ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-dropdown">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Link href={`/admin/leads/${leadId}`} onClick={() => setOpen(false)}>
              <Eye className="size-4" />
              View
            </Link>
          </Button>

          {canDelete ? (
            <DeleteLeadButton
              leadId={leadId}
              leadName={leadName}
              onDeleted={(deletedLeadId) => {
                setOpen(false);
                onDeleted?.(deletedLeadId);
              }}
              variant="ghost"
              size="sm"
              label="Delete"
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function LeadsTable({
  rows,
  hasActiveFilters,
  canDelete,
}: {
  rows: LeadRow[];
  hasActiveFilters: boolean;
  canDelete: boolean;
}) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkState, bulkAction, bulkPending] = useActionState(
    bulkDeleteLeadsAction,
    initialState
  );

  useEffect(() => {
    setSelectedIds((current) =>
      current.filter((leadId) => rows.some((row) => row.id === leadId))
    );
  }, [rows]);

  useEffect(() => {
    if (bulkState.status === "success") {
      setSelectedIds([]);
    }
  }, [bulkState.status]);

  const rowIds = useMemo(() => rows.map((row) => row.id), [rows]);
  const allSelected =
    rowIds.length > 0 && rowIds.every((leadId) => selectedIds.includes(leadId));

  const toggleLead = (leadId: number, checked: boolean) => {
    setSelectedIds((current) =>
      checked
        ? Array.from(new Set([...current, leadId]))
        : current.filter((id) => id !== leadId)
    );
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? rowIds : []);
  };

  const handleDeleted = (leadId: number) => {
    setSelectedIds((current) => current.filter((id) => id !== leadId));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      {canDelete ? (
        <form
          action={bulkAction}
          className="border-b border-slate-100 px-5 py-4"
          onSubmit={(event) => {
            if (
              !window.confirm(
                `Delete ${selectedIds.length} selected lead${selectedIds.length === 1 ? "" : "s"}? This cannot be undone.`
              )
            ) {
              event.preventDefault();
            }
          }}
        >
          {selectedIds.map((leadId) => (
            <input key={leadId} type="hidden" name="leadIds" value={leadId} />
          ))}

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#0b312b]">
                {selectedIds.length > 0
                  ? `${selectedIds.length} lead${selectedIds.length === 1 ? "" : "s"} selected`
                  : "Select leads to delete in bulk"}
              </p>
              {bulkState.message ? (
                <p
                  className={`mt-1 text-xs ${
                    bulkState.status === "error"
                      ? "text-destructive"
                      : "text-emerald-700"
                  }`}
                >
                  {bulkState.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={selectedIds.length === 0 || bulkPending}
            >
              {bulkPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete selected
            </Button>
          </div>
        </form>
      ) : null}

      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {canDelete ? (
                  <th className="w-12 px-4 py-3 text-left">
                    <SelectionCheckbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                      label="Select all leads on this page"
                    />
                  </th>
                ) : null}
                <th className="w-56 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Data
                </th>
                <th className="w-36 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Source
                </th>
                <th className="w-32 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  City
                </th>
                <th className="w-40 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Event
                </th>
                <th className="w-28 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Country
                </th>
                <th className="w-36 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  WhatsApp
                </th>
                <th className="w-32 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Date
                </th>
                <th className="w-24 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50">
                  {canDelete ? (
                    <td className="px-4 py-3.5 align-top">
                      <SelectionCheckbox
                        checked={selectedIds.includes(lead.id)}
                        onCheckedChange={(checked) => toggleLead(lead.id, checked)}
                        label={`Select ${lead.fullName}`}
                      />
                    </td>
                  ) : null}
                  <td className="px-6 py-3.5">
                    <div className="min-w-0">
                      <p className="font-medium text-[#0b312b]">{lead.fullName}</p>
                      <p className="mt-1 text-xs text-slate-500">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-xs text-slate-500">
                      {lead.sourcePath}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    <span className="text-xs">
                      {lead.city || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {lead.seminarEvent ? (
                      <span className="text-xs">
                        {lead.seminarEvent.split("—")[0]?.trim()}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {lead.interestedCountry || "—"}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ${whatsappStatusTone(lead.watiMessageStatus)}`}
                      >
                        {lead.watiMessageStatus.replaceAll("_", " ")}
                      </span>
                      {lead.watiTemplateName ? (
                        <span className="text-[11px] text-slate-400">
                          {lead.watiTemplateName}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400">
                    {lead.createdAt ? fmtDate.format(lead.createdAt) : "—"}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <LeadActionsMenu
                      leadId={lead.id}
                      leadName={lead.fullName}
                      canDelete={canDelete}
                      onDeleted={handleDeleted}
                    />
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={canDelete ? 9 : 8}
                    className="px-6 py-16 text-center text-sm text-slate-400"
                  >
                    {hasActiveFilters
                      ? "No leads match your filters."
                      : "No leads yet."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {rows.map((lead) => (
          <div key={lead.id} className="px-5 py-4">
            <div className="flex items-start gap-3">
              {canDelete ? (
                <SelectionCheckbox
                  checked={selectedIds.includes(lead.id)}
                  onCheckedChange={(checked) => toggleLead(lead.id, checked)}
                  label={`Select ${lead.fullName}`}
                />
              ) : null}

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#0b312b]">{lead.fullName}</p>
                <p className="mt-0.5 text-sm text-slate-500">{lead.phone}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>{lead.city || lead.userState || "—"}</span>
                  {lead.interestedCountry ? (
                    <>
                      <span>•</span>
                      <span>{lead.interestedCountry}</span>
                    </>
                  ) : null}
                  {lead.createdAt ? (
                    <>
                      <span>•</span>
                      <span>{fmtDate.format(lead.createdAt)}</span>
                    </>
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${whatsappStatusTone(lead.watiMessageStatus)}`}
                  >
                    {lead.watiMessageStatus.replaceAll("_", " ")}
                  </span>
                  {lead.seminarEvent ? (
                    <span className="text-[11px] text-slate-400">
                      {lead.seminarEvent.split("—")[0]?.trim()}
                    </span>
                  ) : null}
                </div>
              </div>

              <LeadActionsMenu
                leadId={lead.id}
                leadName={lead.fullName}
                canDelete={canDelete}
                onDeleted={handleDeleted}
              />
            </div>
          </div>
        ))}

        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-400">
            {hasActiveFilters ? "No leads match your filters." : "No leads yet."}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function LeadDetailDeleteButton({
  leadId,
  leadName,
}: {
  leadId: number;
  leadName: string;
}) {
  return (
    <DeleteLeadButton
      leadId={leadId}
      leadName={leadName}
      redirectTo="/admin/leads"
      variant="destructive"
      size="sm"
    />
  );
}
