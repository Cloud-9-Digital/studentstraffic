"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useState, useTransition } from "react";

import {
  submitApplicationAction,
  withdrawDraftAction,
  type ApplicationActionState,
} from "@/app/dashboard/applications/actions";
import { dashboardButton } from "@/components/dashboard/ui";
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
import { MAX_STUDENT_NOTE_LENGTH } from "@/lib/dashboard/application-model";

const initialState: ApplicationActionState = { error: null };

/** Draft-only controls: an optional note, "Submit for review", and "Withdraw draft" behind a confirmation. */
export function DraftActions({ applicationId, universityName, needsPhone = false }: { applicationId: number; universityName: string; needsPhone?: boolean }) {
  const [state, formAction, submitting] = useActionState(submitApplicationAction, initialState);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawing, startWithdraw] = useTransition();

  function withdraw() {
    setWithdrawError(null);
    startWithdraw(async () => {
      const result = await withdrawDraftAction(applicationId);
      if (result?.error) setWithdrawError(result.error);
    });
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="applicationId" value={applicationId} />
      {needsPhone ? (
        <div>
          <label htmlFor="application-phone" className="block text-sm font-medium text-[#0f1f1c]">
            Phone number for your counsellor
          </label>
          <input
            id="application-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+91 98765 43210"
            className="mt-1.5 block w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#0f1f1c] outline-none placeholder:text-[#9ca3af] focus:border-[#0f3d37] focus:ring-2 focus:ring-[#0f3d37]/15"
          />
          <p className="mt-1 text-xs text-[#9ca3af]">Include the country code. We&apos;ll also save it to your profile.</p>
        </div>
      ) : null}
      <div>
        <label htmlFor="application-note" className="block text-sm font-medium text-[#0f1f1c]">
          Anything your counsellor should know? <span className="font-normal text-[#9ca3af]">(optional)</span>
        </label>
        <textarea
          id="application-note"
          name="note"
          rows={4}
          maxLength={MAX_STUDENT_NOTE_LENGTH}
          placeholder="For example: your NEET score, preferred intake, budget, or questions about this programme."
          className="mt-1.5 block w-full resize-y rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#0f1f1c] outline-none placeholder:text-[#9ca3af] focus:border-[#0f3d37] focus:ring-2 focus:ring-[#0f3d37]/15"
        />
        <p className="mt-1 text-xs text-[#9ca3af]">Please don&apos;t include passwords or card details.</p>
      </div>

      {state.error ? <p role="alert" className="text-sm text-red-600">{state.error}</p> : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
          disabled={submitting}
        >
          Withdraw draft
        </button>
        <button type="submit" className={dashboardButton.primary} disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          Submit for review
        </button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={(next) => !withdrawing && setConfirmOpen(next)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw this draft?</AlertDialogTitle>
            <AlertDialogDescription>
              The draft for {universityName} is deleted. The university stays on your shortlist, so you can start again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {withdrawError ? <p role="alert" className="text-sm text-red-600">{withdrawError}</p> : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={withdrawing}>Keep draft</AlertDialogCancel>
            <Button type="button" variant="destructive" disabled={withdrawing} onClick={withdraw}>
              {withdrawing ? <Loader2 className="animate-spin" /> : null}
              Withdraw draft
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
