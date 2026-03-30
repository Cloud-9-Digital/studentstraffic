"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

import {
  approvePeerApplicationAction,
  rejectPeerApplicationAction,
} from "@/app/_actions/review-peer-application";
import { Button } from "@/components/ui/button";

export function ApplicationReviewActions({
  applicationId,
}: {
  applicationId: number;
}) {
  const router = useRouter();
  const [isPendingApprove, startApprove] = useTransition();
  const [isPendingReject, startReject] = useTransition();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  const handleApprove = () => {
    startApprove(async () => {
      await approvePeerApplicationAction(applicationId);
      router.refresh();
    });
  };

  const handleReject = () => {
    startReject(async () => {
      await rejectPeerApplicationAction(applicationId, rejectNotes || undefined);
      router.refresh();
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
      <p className="text-sm font-semibold text-slate-700">Review decision</p>
      <p className="text-sm text-slate-500">
        Approving will automatically create a student peer profile from this
        application.
      </p>

      {!showRejectForm ? (
        <div className="flex gap-3">
          <Button
            onClick={handleApprove}
            disabled={isPendingApprove || isPendingReject}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Check className="size-4" />
            {isPendingApprove ? "Approving…" : "Approve & create profile"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowRejectForm(true)}
            disabled={isPendingApprove || isPendingReject}
            className="flex items-center gap-2 text-rose-600 border-rose-200 hover:bg-rose-50"
          >
            <X className="size-4" />
            Reject
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="rejectNotes"
              className="text-xs font-medium text-slate-600"
            >
              Reason for rejection{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="rejectNotes"
              rows={3}
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="e.g. Proof document not accessible, incomplete information..."
              className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleReject}
              disabled={isPendingReject}
              variant="destructive"
            >
              {isPendingReject ? "Rejecting…" : "Confirm rejection"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRejectForm(false)}
              disabled={isPendingReject}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
