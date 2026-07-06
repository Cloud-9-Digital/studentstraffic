"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneCall, PhoneOff } from "lucide-react";

import { getGuideChatRealtimeClient } from "@/lib/realtime/ably-browser";
import { CallOverlay } from "@/components/site/call-overlay";

type IncomingCall = {
  id: string;
  peerName: string;
  universityName: string;
  createdAt: string | null;
  status: string;
};

function CallDialog({
  call,
  onAccept,
  onDecline,
}: {
  call: IncomingCall;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const initials = call.peerName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-xs overflow-hidden rounded-3xl bg-gradient-to-b from-[#0d3530] to-[#071a17] shadow-2xl ring-1 ring-white/10">
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent" />
        <div className="flex flex-col items-center gap-5 px-6 py-8 text-center">
          <div className="relative flex items-center justify-center">
            <span className="absolute size-24 animate-ping rounded-full bg-emerald-500/10" style={{ animationDuration: "1.6s" }} />
            <span className="absolute size-32 animate-ping rounded-full bg-emerald-500/[0.05]" style={{ animationDuration: "1.6s", animationDelay: "0.5s" }} />
            <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1d6b5f] to-[#0f3d37] shadow-lg ring-2 ring-white/10">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Your guide is calling</p>
            <p className="text-xl font-bold text-white">{call.peerName}</p>
            <p className="text-sm text-white/50">{call.universityName}</p>
          </div>
          <div className="flex w-full items-center justify-center gap-6 pt-2">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onDecline}
                className="flex size-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition hover:scale-105 hover:bg-red-600"
              >
                <PhoneOff className="size-6" />
              </button>
              <span className="text-xs text-white/40">Decline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onAccept}
                className="flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:scale-105 hover:bg-emerald-600"
              >
                <PhoneCall className="size-6" />
              </button>
              <span className="text-xs text-white/40">Join</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IncomingStudentCallsFloating({
  initialCalls,
  userId,
}: {
  initialCalls: IncomingCall[];
  userId: string;
}) {
  const [calls, setCalls] = useState<IncomingCall[]>(initialCalls);
  const [activeCall, setActiveCall] = useState<{ callId: string; peerName: string; universityName: string } | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    async function refresh() {
      try {
        const res = await fetch("/api/peer-calls/incoming-student", { cache: "no-store" });
        if (!res.ok || cancelledRef.current) return;
        const data = (await res.json()) as { calls?: IncomingCall[] };
        if (!cancelledRef.current && data.calls) setCalls(data.calls);
      } catch { /* ignore */ }
    }

    // Ably pushes a "calls.changed" event whenever a call is created, accepted,
    // or ended — we refetch once instead of polling on a timer.
    const client = getGuideChatRealtimeClient(userId);
    const channel = client?.channels.get(`peer-calls:user:${userId}`);
    const onEvent = () => void refresh();
    channel?.subscribe("calls.changed", onEvent).catch(() => undefined);

    // Safety net in case a realtime event is missed (e.g. brief disconnect).
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") void refresh();
    }
    window.addEventListener("focus", refresh);
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelledRef.current = true;
      if (channel) void channel.unsubscribe("calls.changed", onEvent);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId]);

  async function handleDecline(callId: string) {
    setCalls((prev) => prev.filter((c) => c.id !== callId));
    await fetch(`/api/peer-calls/${callId}/end`, { method: "POST" }).catch(() => undefined);
  }

  function handleAccept(call: IncomingCall) {
    setCalls((prev) => prev.filter((c) => c.id !== call.id));
    setActiveCall({ callId: call.id, peerName: call.peerName, universityName: call.universityName });
  }

  const pendingCall = activeCall ? null : calls.find((c) => c.status === "active" || c.status === "ringing");

  return (
    <>
      {pendingCall && !activeCall && (
        <CallDialog
          call={pendingCall}
          onAccept={() => handleAccept(pendingCall)}
          onDecline={() => void handleDecline(pendingCall.id)}
        />
      )}
      {activeCall && (
        <CallOverlay
          callId={activeCall.callId}
          displayName={activeCall.peerName}
          universityName={activeCall.universityName}
          onClose={() => setActiveCall(null)}
        />
      )}
    </>
  );
}
