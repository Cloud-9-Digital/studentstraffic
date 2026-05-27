"use client";

import { useState } from "react";
import { Loader2, PhoneCall } from "lucide-react";

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
  bookingStatus: string;
};

const AVATAR_COLORS = [
  "bg-[#0f3d37] text-white",
  "bg-[#c2410c] text-white",
  "bg-violet-600 text-white",
  "bg-sky-600 text-white",
  "bg-emerald-600 text-white",
  "bg-pink-600 text-white",
];

function PeerInitials({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${color}`}>
      {initials}
    </div>
  );
}

function PeerRow({
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

  const subtitle = [peer.courseName, peer.currentYearOrBatch].filter(Boolean).join(" · ");
  const isAccepted = peer.bookingStatus === "accepted" || peer.bookingStatus === "active";
  const isPendingStatus = peer.bookingStatus === "pending";
  const isDeclined = peer.bookingStatus === "declined";
  const canCall = voiceEnabled && peer.canReceiveCalls && isAccepted;

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

  const statusCell = canCall ? (
    <button
      type="button"
      onClick={() => void handleStart()}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f3d37] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#184a43] disabled:opacity-60"
    >
      {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <PhoneCall className="size-3.5" />}
      {isPending ? "Starting…" : "Start call"}
    </button>
  ) : isPendingStatus ? (
    <span className="text-xs font-medium text-amber-600">Awaiting approval</span>
  ) : isDeclined ? (
    <span className="text-xs font-medium text-red-500">Not available</span>
  ) : isAccepted ? (
    <span className="text-xs text-[#9ca3af]">Calling not enabled</span>
  ) : (
    <span className="text-xs text-[#9ca3af]">Offline</span>
  );

  return (
    <>
      {/* Mobile row */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3.5">
        <PeerInitials name={peer.fullName} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#0f1f1c]">{peer.fullName}</p>
          <p className="truncate text-xs text-[#6b7280]">{peer.universityName}</p>
        </div>
        <div className="shrink-0">{statusCell}</div>
        {error && <p className="mt-1 text-[10px] text-red-600">{error}</p>}
      </div>

      {/* Desktop row */}
      <tr className="hidden md:table-row hover:bg-[#fafafa] transition-colors">
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <PeerInitials name={peer.fullName} />
            <div className="min-w-0">
              <p className="font-semibold text-[#0f1f1c] whitespace-nowrap">{peer.fullName}</p>
              {subtitle && <p className="text-xs text-[#9ca3af]">{subtitle}</p>}
            </div>
          </div>
        </td>
        <td className="px-5 py-4 text-sm text-[#6b7280] whitespace-nowrap">{peer.universityName}</td>
        <td className="px-5 py-4">
          {statusCell}
          {error && <p className="mt-1 text-[10px] text-red-600">{error}</p>}
        </td>
      </tr>
    </>
  );
}

export function BookedCallsList({
  peers,
  voiceEnabled,
}: {
  peers: BookedPeer[];
  voiceEnabled: boolean;
}) {
  const [activeCall, setActiveCall] = useState<{ callId: string; peer: BookedPeer } | null>(null);

  return (
    <>
      {/* Mobile flat list */}
      <div className="md:hidden divide-y divide-[#f3f4f6] rounded-2xl border border-[#e5e7eb] bg-white overflow-hidden shadow-sm">
        {peers.map((peer) => (
          <PeerRow
            key={peer.bookingId}
            peer={peer}
            voiceEnabled={voiceEnabled}
            onCallStart={(callId, p) => setActiveCall({ callId, peer: p })}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-[#e5e7eb] bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Guide</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">University</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#6b7280]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {peers.map((peer) => (
              <PeerRow
                key={peer.bookingId}
                peer={peer}
                voiceEnabled={voiceEnabled}
                onCallStart={(callId, p) => setActiveCall({ callId, peer: p })}
              />
            ))}
          </tbody>
        </table>
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
