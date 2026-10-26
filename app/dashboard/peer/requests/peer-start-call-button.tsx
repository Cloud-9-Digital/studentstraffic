"use client";

import { useState } from "react";
import { Loader2, PhoneCall } from "lucide-react";

import { startCallAsPeerAction } from "@/app/_actions/start-call-as-peer";
import { CallOverlay } from "@/components/site/call-overlay";
import { dashboardButton } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";

export function PeerStartCallButton({
  bookingId,
  studentName,
  universityName,
}: {
  bookingId: number;
  studentName: string;
  universityName: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callId, setCallId] = useState<string | null>(null);

  async function handleStart() {
    if (isPending) return;
    setIsPending(true);
    setError(null);
    const result = await startCallAsPeerAction(bookingId);
    if (result.callId) {
      setCallId(result.callId);
    } else {
      setError(result.error ?? "Unable to start the call right now.");
    }
    setIsPending(false);
  }

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={() => void handleStart()}
          disabled={isPending}
          className={cn(dashboardButton.primary, "px-3 py-1.5 text-xs")}
        >
          {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <PhoneCall className="size-3.5" />}
          {isPending ? "Starting…" : "Start call"}
        </button>
        {error && <p role="alert" className="max-w-48 text-right text-[11px] text-red-600">{error}</p>}
      </div>

      {callId && (
        <CallOverlay
          callId={callId}
          displayName={studentName}
          universityName={universityName}
          onClose={() => setCallId(null)}
        />
      )}
    </>
  );
}
