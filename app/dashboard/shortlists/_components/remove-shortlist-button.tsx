"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { removeShortlistItemAction } from "@/app/dashboard/shortlists/actions";
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

export function RemoveShortlistButton({
  shortlistId,
  universityName,
  hasApplication,
}: {
  shortlistId: number;
  universityName: string;
  hasApplication: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await removeShortlistItemAction(shortlistId);
      if (result.error) setError(result.error);
      else setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-200"
        aria-label={`Remove ${universityName} from shortlist`}
        title="Remove"
      >
        <Trash2 className="size-4" />
      </button>
      <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {universityName}?</AlertDialogTitle>
            <AlertDialogDescription>
              {hasApplication
                ? "It leaves your shortlist only. Your application stays in Applications."
                : "You can save it again from the university page at any time."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <Button variant="destructive" disabled={pending} onClick={confirm}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
