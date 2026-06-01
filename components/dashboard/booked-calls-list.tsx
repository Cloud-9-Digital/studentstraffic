"use client";

import { useState } from "react";
import { Loader2, MessageCircle, PhoneCall } from "lucide-react";

import { openStudentGuideConversationAction } from "@/app/_actions/guide-chat";
import { startPeerCallAction } from "@/app/_actions/start-peer-call";
import { FormSubmitButton } from "@/components/dashboard/chat/form-submit-button";
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
    <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${color}`}>
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

  const actions = canCall ? (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void handleStart()}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f3d37] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#184a43] disabled:opacity-60"
      >
        {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <PhoneCall className="size-3.5" />}
        {isPending ? "Starting…" : "Call"}
      </button>
      <form action={openStudentGuideConversationAction}>
        <input type="hidden" name="peerId" value={peer.peerId} />
        <input type="hidden" name="redirectPath" value="/dashboard/messages" />
        <FormSubmitButton
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-3.5 py-2 text-xs font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
          pendingLabel="Opening…"
        >
          <MessageCircle className="size-3.5" />
          Message
        </FormSubmitButton>
      </form>
    </div>
  ) : isPendingStatus ? (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-amber-600">Awaiting approval</span>
      <form action={openStudentGuideConversationAction}>
        <input type="hidden" name="peerId" value={peer.peerId} />
        <input type="hidden" name="redirectPath" value="/dashboard/messages" />
        <FormSubmitButton
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-3.5 py-2 text-xs font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
          pendingLabel="Opening…"
        >
          <MessageCircle className="size-3.5" />
          Message
        </FormSubmitButton>
      </form>
    </div>
  ) : isDeclined ? (
    <span className="text-xs font-medium text-red-500">Not available</span>
  ) : isAccepted ? (
    <div className="flex flex-wrap items-center gap-2">
      <form action={openStudentGuideConversationAction}>
        <input type="hidden" name="peerId" value={peer.peerId} />
        <input type="hidden" name="redirectPath" value="/dashboard/messages" />
        <FormSubmitButton
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-3.5 py-2 text-xs font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
          pendingLabel="Opening…"
        >
          <MessageCircle className="size-3.5" />
          Message
        </FormSubmitButton>
      </form>
    </div>
  ) : (
    <span className="text-xs text-[#9ca3af]">Offline</span>
  );

  return (
    <>
      {/* Mobile row */}
      <div className="md:hidden flex items-center gap-3 py-4">
        <PeerInitials name={peer.fullName} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#0f1f1c]">{peer.fullName}</p>
          <p className="truncate text-xs text-[#6b7280]">{peer.universityName}</p>
          {error && <p className="mt-1 text-[10px] text-red-600">{error}</p>}
        </div>
        <div className="shrink-0">{actions}</div>
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
          {actions}
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
      {/* Mobile: flat list, no card wrapper */}
      <div className="md:hidden divide-y divide-[#eaeaea]">
        {peers.map((peer) => (
          <PeerRow
            key={peer.bookingId}
            peer={peer}
            voiceEnabled={voiceEnabled}
            onCallStart={(callId, p) => setActiveCall({ callId, peer: p })}
          />
        ))}
      </div>

      {/* Desktop: clean table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#eaeaea]">
              <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">Guide</th>
              <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">University</th>
              <th className="pb-3 text-left text-xs font-semibold text-[#9ca3af]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaeaea]">
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
