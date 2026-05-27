"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { acceptBookingAction, declineBookingAction } from "@/app/_actions/respond-to-peer-booking";

export function RequestActions({ bookingId }: { bookingId: number }) {
  const [status, setStatus] = useState<"idle" | "accepting" | "declining" | "accepted" | "declined">("idle");
  const [error, setError] = useState<string | null>(null);

  const handle = async (action: "accept" | "decline") => {
    setError(null);
    setStatus(action === "accept" ? "accepting" : "declining");

    const res = action === "accept"
      ? await acceptBookingAction(bookingId)
      : await declineBookingAction(bookingId);

    if (res.success) {
      setStatus(action === "accept" ? "accepted" : "declined");
    } else {
      setError(res.error ?? "Something went wrong.");
      setStatus("idle");
    }
  };

  if (status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <Check className="size-3" /> Accepted
      </span>
    );
  }

  if (status === "declined") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
        <X className="size-3" /> Declined
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void handle("accept")}
          disabled={status !== "idle"}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f3d37] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#184a43] disabled:opacity-60"
        >
          {status === "accepting" ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
          Accept
        </button>
        <button
          type="button"
          onClick={() => void handle("decline")}
          disabled={status !== "idle"}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-semibold text-[#6b7280] transition hover:bg-[#f9fafb] disabled:opacity-60"
        >
          {status === "declining" ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
          Decline
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
