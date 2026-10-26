"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { acceptBookingAction, declineBookingAction } from "@/app/_actions/respond-to-peer-booking";
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
import { dashboardButton } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";

type Status = "idle" | "accepting" | "declining" | "accepted" | "declined";

/**
 * Accept (one click) and Decline (confirmed) for a pending call request.
 * The server action revalidates the dashboard, so the row moves out of
 * Pending on the refreshed render; the local state covers the gap.
 */
export function RequestActions({
  bookingId,
  studentName,
  fullWidth = false,
  size = "sm",
}: {
  bookingId: number;
  studentName: string;
  fullWidth?: boolean;
  size?: "sm" | "md";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstName = studentName.split(" ")[0] || "this student";

  const run = async (action: "accept" | "decline") => {
    setError(null);
    setStatus(action === "accept" ? "accepting" : "declining");
    const res = action === "accept" ? await acceptBookingAction(bookingId) : await declineBookingAction(bookingId);
    if (res.success) {
      setStatus(action === "accept" ? "accepted" : "declined");
      setConfirmOpen(false);
      toast.success(
        action === "accept"
          ? `Accepted. You can now message or call ${firstName}.`
          : `Declined ${firstName}'s request.`,
      );
    } else {
      const message = res.error ?? "Something went wrong. Please try again.";
      setError(message);
      setStatus("idle");
      toast.error(message);
    }
  };

  if (status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <Check className="size-3" /> Accepted
      </span>
    );
  }

  if (status === "declined") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f4f6] px-2.5 py-1 text-xs font-medium text-[#6b7280]">
        <X className="size-3" /> Declined
      </span>
    );
  }

  const busy = status !== "idle";
  const sizing = size === "sm" ? "px-3 py-1.5 text-xs" : "";

  return (
    <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
      <div className={cn("flex items-center gap-2", fullWidth && "w-full")}>
        <button
          type="button"
          onClick={() => void run("accept")}
          disabled={busy}
          className={cn(dashboardButton.primary, sizing, fullWidth && "flex-1")}
        >
          {status === "accepting" ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
          Accept
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={busy}
          className={cn(dashboardButton.danger, sizing, fullWidth && "flex-1")}
        >
          <X className="size-3.5" />
          Decline
        </button>
      </div>
      {error ? <p role="alert" className="text-xs text-red-600">{error}</p> : null}

      <AlertDialog open={confirmOpen} onOpenChange={(open) => status !== "declining" && setConfirmOpen(open)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{`Decline ${firstName}'s request?`}</AlertDialogTitle>
            <AlertDialogDescription>
              {firstName} will see you as not available and can&apos;t send you a new request for 7 days. You
              won&apos;t be able to message or call them unless they request again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={status === "declining"}>Keep request</AlertDialogCancel>
            <Button variant="destructive" disabled={status === "declining"} onClick={() => void run("decline")}>
              {status === "declining" ? <Loader2 className="animate-spin" /> : null}
              Decline request
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
