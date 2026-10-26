"use client";

import { useState } from "react";
import { Ban, Flag, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Operation = "block" | "unblock" | "report";

const REPORT_REASONS = [
  { value: "harassment", label: "Harassment or abusive behaviour" },
  { value: "contact_sharing", label: "Asking to exchange contact details" },
  { value: "misleading_information", label: "Misleading information or payment request" },
  { value: "other", label: "Something else" },
] as const;

const SUCCESS: Record<Operation, string> = {
  report: "Report sent privately to our team.",
  block: "Conversation blocked. Neither of you can message or call.",
  unblock: "Your block has been removed.",
};

const fieldClass =
  "mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 outline-none focus:border-[#0f3d37] focus:ring-2 focus:ring-[#0f3d37]/15";

/**
 * Block and Report sit directly in the conversation header; each opens a
 * confirmation dialog before anything is sent. `compact` shows icon-only
 * buttons for the mobile header.
 */
export function ConversationSafety({
  conversationId,
  displayName,
  blockedByMe,
  onChanged,
  compact = false,
}: {
  conversationId: number;
  displayName: string;
  blockedByMe: boolean;
  onChanged: () => void;
  compact?: boolean;
}) {
  const [dialog, setDialog] = useState<"block" | "report" | null>(null);
  const [pending, setPending] = useState(false);
  const [reason, setReason] = useState<string>(REPORT_REASONS[0].value);
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  function openDialog(next: "block" | "report") {
    setError("");
    setDialog(next);
  }

  async function submit(operation: Operation) {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/dashboard/chat/conversations/${conversationId}/safety`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation, reason, details }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save. Please try again.");
      toast.success(SUCCESS[operation]);
      setDialog(null);
      if (operation === "report") setDetails("");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const headerButton = compact
    ? "flex size-9 shrink-0 items-center justify-center rounded-full text-[#5d726b] transition active:bg-[#f0f5f4]"
    : "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#eaeaea] px-3 py-1.5 text-xs font-medium text-[#374151] transition hover:bg-[#f3f4f6] focus-visible:ring-2";
  const blockLabel = blockedByMe ? "Unblock" : "Block";

  return (
    <>
      <button
        type="button"
        onClick={() => openDialog("report")}
        aria-label={`Report ${displayName}`}
        className={headerButton}
      >
        <Flag className={compact ? "size-[18px]" : "size-3.5"} />
        {!compact && "Report"}
      </button>
      <button
        type="button"
        onClick={() => openDialog("block")}
        aria-label={`${blockLabel} ${displayName}`}
        className={`${headerButton} ${blockedByMe ? "" : "text-red-600"}`}
      >
        {blockedByMe ? <ShieldCheck className={compact ? "size-[18px]" : "size-3.5"} /> : <Ban className={compact ? "size-[18px]" : "size-3.5"} />}
        {!compact && blockLabel}
      </button>

      <AlertDialog open={dialog === "block"} onOpenChange={(open) => !pending && setDialog(open ? "block" : null)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{blockedByMe ? `Unblock ${displayName}?` : `Block ${displayName}?`}</AlertDialogTitle>
            <AlertDialogDescription>
              {blockedByMe
                ? "You will be able to message and call each other again, unless they have also blocked you."
                : "Neither of you will be able to message or call, and any current call ends. You can unblock later from this conversation."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && dialog === "block" ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <Button
              variant={blockedByMe ? "default" : "destructive"}
              disabled={pending}
              onClick={() => void submit(blockedByMe ? "unblock" : "block")}
            >
              {pending ? <Loader2 className="animate-spin" /> : null}
              {blockedByMe ? "Unblock" : "Block conversation"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialog === "report"} onOpenChange={(open) => !pending && setDialog(open ? "report" : null)}>
        <AlertDialogContent className="sm:max-w-md">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void submit("report");
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{`Report ${displayName}?`}</AlertDialogTitle>
              <AlertDialogDescription>
                Your report goes privately to the Students Traffic team; {displayName} is not told. Keep
                communication on Students Traffic, and never send money or share contact details.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <label className="block text-sm font-medium text-slate-700">
              Reason
              <select value={reason} onChange={(event) => setReason(event.target.value)} className={fieldClass}>
                {REPORT_REASONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              What happened?
              <textarea
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                placeholder="Describe what happened (at least 10 characters)"
                className={`${fieldClass} resize-y`}
              />
            </label>
            {error && dialog === "report" ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
            <AlertDialogFooter>
              <AlertDialogCancel type="button" disabled={pending}>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={pending} className="bg-[#0f3d37] text-white hover:bg-[#0f3d37]/90">
                {pending ? <Loader2 className="animate-spin" /> : null}
                Send report
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
