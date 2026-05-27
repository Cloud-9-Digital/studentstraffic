"use client";

import { useState } from "react";
import { Loader2, PhoneCall, Radio } from "lucide-react";

import { startPeerCallAction } from "@/app/_actions/start-peer-call";
import { CallOverlay } from "@/components/site/call-overlay";

type BookedPeer = {
  bookingId: number;
  peerId: number;
  fullName: string;
  courseName: string | null;
  currentYearOrBatch: string | null;
  universityName: string;
  universitySlug: string;
  canReceiveCalls: boolean;
};

function PeerCallCard({
  peer,
  voiceEnabled,
  onCallStart,
}: {
  peer: BookedPeer;
  voiceEnabled: boolean;
  onCallStart: (callId: string, peer: BookedPeer) => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = peer.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const subtitle = [peer.courseName, peer.currentYearOrBatch].filter(Boolean).join(" · ") || "Student guide";

  async function handleStart() {
    if (isPending) return;
    setIsPending(true);
    setError(null);

    const result = await startPeerCallAction(peer.peerId, peer.universitySlug);

    if (result.callId) {
      onCallStart(result.callId, peer);
    } else {
      setError(result.error ?? "Unable to start the call right now.");
    }

    setIsPending(false);
  }

  const canCall = voiceEnabled && peer.canReceiveCalls;

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f0f7f5] text-base font-bold text-[#0f3d37]">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#0f1f1c]">{peer.fullName}</p>
          <p className="truncate text-xs text-[#6b7280]">{peer.universityName}</p>
          <p className="truncate text-xs text-[#9ca3af]">{subtitle}</p>
        </div>

        {canCall ? (
          <button
            type="button"
            onClick={() => void handleStart()}
            disabled={isPending}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0f3d37] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184a43] disabled:opacity-60"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <PhoneCall className="size-4" />}
            {isPending ? "Starting…" : "Start call"}
          </button>
        ) : (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-xs font-medium text-[#9ca3af]">
            <Radio className="size-3.5" />
            Offline
          </span>
        )}
      </div>

      {!peer.canReceiveCalls && (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          This guide hasn&apos;t enabled dashboard calling yet.
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function BookedCallsList({
  peers,
  voiceEnabled,
}: {
  peers: BookedPeer[];
  voiceEnabled: boolean;
}) {
  const [activeCall, setActiveCall] = useState<{
    callId: string;
    peer: BookedPeer;
  } | null>(null);

  return (
    <>
      <div className="space-y-3">
        {peers.map((peer) => (
          <PeerCallCard
            key={peer.bookingId}
            peer={peer}
            voiceEnabled={voiceEnabled}
            onCallStart={(callId, p) => setActiveCall({ callId, peer: p })}
          />
        ))}
      </div>

      {activeCall && (
        <CallOverlay
          callId={activeCall.callId}
          displayName={activeCall.peer.fullName}
          universityName={activeCall.peer.universityName}
          onClose={() => setActiveCall(null)}
        />
      )}
    </>
  );
}
