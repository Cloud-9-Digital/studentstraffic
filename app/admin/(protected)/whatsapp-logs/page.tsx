import Link from "next/link";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { leads } from "@/lib/db/schema";

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const ITEMS_PER_PAGE = 50;

type SearchParams = Promise<{
  page?: string;
  search?: string;
  status?: string;
  template?: string;
}>;

function statusTone(status: string | null) {
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

export default async function AdminWhatsappLogsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdminSession();
  const db = getDb();
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.search?.trim() || "";
  const status = params.status?.trim() || "";
  const template = params.template?.trim() || "";
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(leads.fullName, `%${search}%`),
        ilike(leads.phone, `%${search}%`),
        ilike(leads.watiLocalMessageId, `%${search}%`),
        ilike(leads.watiWhatsappMessageId, `%${search}%`)
      )
    );
  }

  if (status) {
    conditions.push(eq(leads.watiMessageStatus, status));
  }

  if (template) {
    conditions.push(eq(leads.watiTemplateName, template));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countResult] = db
    ? await db
        .select({ count: sql<number>`count(*)::int` })
        .from(leads)
        .where(whereClause)
    : [{ count: 0 }];

  const totalCount = countResult?.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const rows = db
    ? await db
        .select({
          id: leads.id,
          fullName: leads.fullName,
          phone: leads.phone,
          sourcePath: leads.sourcePath,
          watiMessageStatus: leads.watiMessageStatus,
          watiTemplateName: leads.watiTemplateName,
          watiLocalMessageId: leads.watiLocalMessageId,
          watiWhatsappMessageId: leads.watiWhatsappMessageId,
          watiLastEvent: leads.watiLastEvent,
          watiStatusUpdatedAt: leads.watiStatusUpdatedAt,
          watiMessageError: leads.watiMessageError,
          createdAt: leads.createdAt,
        })
        .from(leads)
        .where(whereClause)
        .orderBy(desc(leads.watiStatusUpdatedAt), desc(leads.createdAt))
        .limit(ITEMS_PER_PAGE)
        .offset(offset)
    : [];

  const statusOptions = db
    ? await db
        .selectDistinct({ value: leads.watiMessageStatus })
        .from(leads)
        .where(sql`${leads.watiMessageStatus} IS NOT NULL`)
        .orderBy(leads.watiMessageStatus)
    : [];

  const templateOptions = db
    ? await db
        .selectDistinct({ value: leads.watiTemplateName })
        .from(leads)
        .where(sql`${leads.watiTemplateName} IS NOT NULL`)
        .orderBy(leads.watiTemplateName)
    : [];

  const buildQueryString = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams();
    const current = {
      page: params.page,
      search: params.search,
      status: params.status,
      template: params.template,
      ...updates,
    };

    Object.entries(current).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });

    const qs = newParams.toString();
    return qs ? `?${qs}` : "";
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Messaging
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">
          WhatsApp Logs
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Template send outcomes and webhook status updates across lead flows.
        </p>
      </div>

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <input
          type="text"
          name="search"
          placeholder="Search name, phone, or message ID"
          defaultValue={search}
          className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none ring-0 transition focus:border-[#0b312b]/30"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none ring-0 transition focus:border-[#0b312b]/30"
        >
          <option value="">All statuses</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value ?? ""}>
              {option.value}
            </option>
          ))}
        </select>
        <select
          name="template"
          defaultValue={template}
          className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none ring-0 transition focus:border-[#0b312b]/30"
        >
          <option value="">All templates</option>
          {templateOptions.map((option) => (
            <option key={option.value} value={option.value ?? ""}>
              {option.value}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 rounded-xl bg-[#0b312b] px-4 text-sm font-medium text-white transition hover:bg-[#11463e]"
        >
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Template</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Message IDs</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Last event</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Updated</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="align-top hover:bg-slate-50/40">
                  <td className="px-6 py-4">
                    <Link href={`/admin/leads/${row.id}`} className="font-medium text-[#0b312b] hover:underline">
                      {row.fullName}
                    </Link>
                    <div className="mt-1 text-xs text-slate-500">{row.phone}</div>
                    <div className="mt-1 text-xs text-slate-400">{row.sourcePath}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.watiTemplateName || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(row.watiMessageStatus)}`}>
                      {row.watiMessageStatus.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <div>{row.watiLocalMessageId || "—"}</div>
                    <div className="mt-1 text-slate-400">{row.watiWhatsappMessageId || "—"}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{row.watiLastEvent || "—"}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {row.watiStatusUpdatedAt
                      ? fmtDate.format(row.watiStatusUpdatedAt)
                      : row.createdAt
                        ? fmtDate.format(row.createdAt)
                        : "—"}
                  </td>
                  <td className="max-w-xs px-6 py-4 text-xs text-red-600">
                    {row.watiMessageError || "—"}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-400">
                    No WhatsApp logs yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages} ({totalCount.toLocaleString()} total)
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={`/admin/whatsapp-logs${buildQueryString({ page: String(page - 1) })}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-[#0b312b]/20 hover:text-[#0b312b]"
              >
                Previous
              </Link>
            ) : null}
            {page < totalPages ? (
              <Link
                href={`/admin/whatsapp-logs${buildQueryString({ page: String(page + 1) })}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-[#0b312b]/20 hover:text-[#0b312b]"
              >
                Next
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
