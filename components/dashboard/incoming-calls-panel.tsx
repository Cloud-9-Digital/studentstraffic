"use client";

import { useEffect, useState } from "react";
import { Loader2, PhoneCall, PhoneOff, Radio } from "lucide-react";

import { CallOverlay } from "@/components/site/call-overlay";

type IncomingPeerCallSummary = {
  id: string;
  callerName: string;
  universityName: string;
  createdAt: string | null;
  status: string;
};

type ActiveCall = {
  callId: string;
  callerName: string;
  universityName: string;
};

function CallCard({
  call,
  onAccept,
  onDecline,
}: {
  call: IncomingPeerCallSummary;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const initials = call.callerName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
      {/* subtle shimmer line */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-400 via-emerald-300 to-transparent" />

      <div className="flex items-center gap-4">
        {/* pulsing avatar */}
        <div className="relative shrink-0">
          <span
            className="absolute inset-0 animate-ping rounded-full bg-emerald-100"
            style={{ animationDuration: "1.6s" }}
          />
          <div className="relative flex size-12 items-center justify-center rounded-full bg-emerald-50 text-base font-bold text-emerald-700">
            {initials}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#0f1f1c]">{call.callerName}</p>
          <p className="truncate text-xs text-[#6b7280]">{call.universityName}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onDecline}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
        >
          <PhoneOff className="size-4 text-red-400" />
          Decline
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <PhoneCall className="size-4" />
          Accept
        </button>
      </div>
    </div>
  );
}

export function IncomingCallsPanel({
  initialCalls,
}: {
  initialCalls: IncomingPeerCallSummary[];
}) {
  const [calls, setCalls] = useState(initialCalls);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      setIsRefreshing(true);
      try {
        const res = await fetch("/api/peer-calls/incoming", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { calls?: IncomingPeerCallSummary[] };
        if (!cancelled && data.calls) setCalls(data.calls);
      } finally {
        if (!cancelled) setIsRefreshing(false);
      }
    }

    const id = window.setInterval(() => void refresh(), 8_000);
    return () => { cancelled = true; window.clearInterval(id); };
  }, []);

  async function handleDecline(callId: string) {
    setCalls((prev) => prev.filter((c) => c.id !== callId));
    await fetch(`/api/peer-calls/${callId}/end`, { method: "POST" }).catch(() => undefined);
  }

  function handleAccept(call: IncomingPeerCallSummary) {
    setCalls((prev) => prev.filter((c) => c.id !== call.id));
    setActiveCall({ callId: call.id, callerName: call.callerName, universityName: call.universityName });
  }

  return (
    <>
      <section className="rounded-xl border border-[#e5e7eb] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0f1f1c]">
              <Radio className="size-4 text-[#0f3d37]" />
              Incoming calls
            </div>
            <p className="mt-1 text-xs text-[#6b7280]">
              Keep this page open to catch live student call requests.
            </p>
          </div>
          {isRefreshing && <Loader2 className="size-4 animate-spin text-[#9ca3af]" />}
        </div>

        {calls.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-[#e5e7eb] px-4 py-6 text-center">
            <PhoneCall className="mx-auto size-5 text-[#cbd5e1]" />
            <p className="mt-2 text-sm text-[#374151]">No live calls right now</p>
            <p className="mt-1 text-xs text-[#9ca3af]">New requests appear here automatically.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {calls.map((call) => (
              <CallCard
                key={call.id}
                call={call}
                onAccept={() => handleAccept(call)}
                onDecline={() => void handleDecline(call.id)}
              />
            ))}
          </div>
        )}
      </section>

      {activeCall && (
        <CallOverlay
          callId={activeCall.callId}
          displayName={activeCall.callerName}
          universityName={activeCall.universityName}
          onClose={() => setActiveCall(null)}
        />
      )}
    </>
  );
}
