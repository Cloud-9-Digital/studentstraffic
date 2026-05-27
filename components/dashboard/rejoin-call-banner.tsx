"use client";

import { useState } from "react";
import { PhoneCall, X } from "lucide-react";

import { CallOverlay } from "@/components/site/call-overlay";

type ActiveCall = {
  id: string;
  displayName: string;
  universityName: string;
};

export function RejoinCallBanner({ call }: { call: ActiveCall }) {
  const [dismissed, setDismissed] = useState(false);
  const [rejoining, setRejoining] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-[60] flex items-center justify-between gap-3 bg-emerald-600 px-4 py-3 shadow-lg sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <span className="size-2 rounded-full bg-white animate-pulse shrink-0" />
          <p className="text-sm font-medium text-white truncate">
            Call with <span className="font-bold">{call.displayName}</span> is still active
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setRejoining(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            <PhoneCall className="size-3.5" />
            Rejoin
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="flex size-7 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Spacer so page content isn't hidden under the banner */}
      <div className="h-12" />

      {rejoining && (
        <CallOverlay
          callId={call.id}
          displayName={call.displayName}
          universityName={call.universityName}
          onClose={() => setRejoining(false)}
        />
      )}
    </>
  );
}
