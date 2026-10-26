"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, MessageCircle, PhoneCall } from "lucide-react";

import { cancelBookingAction } from "@/app/_actions/respond-to-peer-booking";
import { openStudentGuideConversationAction } from "@/app/_actions/guide-chat";
import { startPeerCallAction } from "@/app/_actions/start-peer-call";
import { FormSubmitButton } from "@/components/dashboard/chat/form-submit-button";
import { SectionList, dashboardButton } from "@/components/dashboard/ui";
import { CallOverlay } from "@/components/site/call-overlay";
import { cn } from "@/lib/utils";

export type BookedPeer = {
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

export type ActiveGuideCall = { callId: string; displayName: string; universityName: string };

const AVATAR_COLORS = [
  "bg-[#0f3d37] text-white",
  "bg-[#c2410c] text-white",
  "bg-violet-600 text-white",
  "bg-sky-600 text-white",
  "bg-emerald-600 text-white",
  "bg-pink-600 text-white",
];

const smallButton = "px-3 py-1.5 text-xs";

export function PeerInitials({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const color = AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  return (
    <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${color}`} aria-hidden>
      {initials}
    </div>
  );
}

/** Opens (or creates) the student's chat with this guide. */
export function MessageGuideButton({ peerId, fullWidth = false }: { peerId: number; fullWidth?: boolean }) {
  return (
    <form action={openStudentGuideConversationAction} className={fullWidth ? "w-full" : undefined}>
      <input type="hidden" name="peerId" value={peerId} />
      <input type="hidden" name="redirectPath" value="/dashboard/messages" />
      <FormSubmitButton className={cn(dashboardButton.secondary, fullWidth ? "w-full py-2.5" : smallButton)} pendingLabel="Opening…">
        <MessageCircle className="size-3.5" />
        Message
      </FormSubmitButton>
    </form>
  );
}

/** Starts a voice call with a guide and reports the call id to the parent, which shows the call overlay. */
export function CallGuideButton({
  peerId,
  universitySlug,
  displayName,
  universityName,
  label = "Call",
  onCallStart,
  fullWidth = false,
}: {
  peerId: number;
  universitySlug: string;
  displayName: string;
  universityName: string;
  label?: string;
  onCallStart: (call: ActiveGuideCall) => void;
  fullWidth?: boolean;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    if (isPending) return;
    setIsPending(true);
    setError(null);
    try {
      const result = await startPeerCallAction(peerId, universitySlug);
      if (result.callId) onCallStart({ callId: result.callId, displayName, universityName });
      else setError(result.error ?? "Unable to start the call right now.");
    } catch {
      setError("Unable to start the call right now.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void handleStart()}
        disabled={isPending}
        className={cn(dashboardButton.primary, fullWidth ? "w-full py-2.5" : smallButton)}
      >
        {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <PhoneCall className="size-3.5" />}
        {isPending ? "Calling…" : label}
      </button>
      {error && <p role="alert" className="basis-full text-xs text-red-600">{error}</p>}
    </>
  );
}

const STATUS_PILL: Record<"accepted" | "pending" | "declined" | "closed", { label: string; className: string }> = {
  accepted: { label: "Accepted", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  pending: { label: "Waiting to accept", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  declined: { label: "Not available", className: "bg-red-50 text-red-700 ring-red-200" },
  closed: { label: "Closed", className: "bg-[#f3f4f6] text-[#6b7280] ring-[#e5e7eb]" },
};

function PeerRow({
  peer,
  voiceEnabled,
  onCallStart,
}: {
  peer: BookedPeer;
  voiceEnabled: boolean;
  onCallStart: (call: ActiveGuideCall) => void;
}) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = peer.fullName.split(" ")[0];
  const course = [peer.courseName, peer.currentYearOrBatch].filter(Boolean).join(" · ");
  const isAccepted = peer.bookingStatus === "accepted" || peer.bookingStatus === "active";
  const isPendingStatus = peer.bookingStatus === "pending";
  const statusKey = isAccepted ? "accepted" : isPendingStatus ? "pending" : peer.bookingStatus === "declined" ? "declined" : "closed";
  const canCall = voiceEnabled && peer.canReceiveCalls && isAccepted;
  // Say plainly why there is no Call button, so the card never looks broken.
  const callNote = canCall
    ? null
    : isPendingStatus
      ? `You can call once ${firstName} accepts your request.`
      : !isAccepted
        ? null
        : !voiceEnabled
          ? "Voice calls are switched off right now. You can still message."
          : `${firstName} isn't taking calls right now. You can still message.`;

  async function cancel() {
    setIsCancelling(true);
    try {
      const result = await cancelBookingAction(peer.bookingId);
      if (result.error) setError(result.error);
      else router.refresh();
    } catch {
      setError("Unable to cancel. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  }

  const pill = STATUS_PILL[statusKey];
  const canMessage = isAccepted || isPendingStatus;

  return (
    <li className="px-4 py-4 sm:px-5">
      <div className="flex items-start gap-3">
        <PeerInitials name={peer.fullName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-[#0f1f1c]">{peer.fullName}</p>
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", pill.className)}>{pill.label}</span>
          </div>
          <p className="mt-0.5 text-xs text-[#4b5563]">{peer.universityName}</p>
          {course ? <p className="text-xs text-[#6b7280]">{course}</p> : null}
        </div>

        {/* Desktop: actions on the right */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {canCall && (
            <CallGuideButton
              peerId={peer.peerId}
              universitySlug={peer.universitySlug}
              displayName={peer.fullName}
              universityName={peer.universityName}
              onCallStart={onCallStart}
            />
          )}
          {canMessage && <MessageGuideButton peerId={peer.peerId} />}
        </div>
      </div>

      {callNote ? <p className="mt-3 text-xs text-[#6b7280] sm:pl-12">{callNote}</p> : null}

      {/* Mobile: full-width actions under the card */}
      {canCall || canMessage ? (
        <div className={cn("mt-3 grid gap-2 sm:hidden", canCall && canMessage ? "grid-cols-2" : "grid-cols-1")}>
          {canCall && (
            <CallGuideButton
              peerId={peer.peerId}
              universitySlug={peer.universitySlug}
              displayName={peer.fullName}
              universityName={peer.universityName}
              onCallStart={onCallStart}
              fullWidth
            />
          )}
          {canMessage && <MessageGuideButton peerId={peer.peerId} fullWidth />}
        </div>
      ) : null}

      {isPendingStatus ? (
        <button
          type="button"
          onClick={() => void cancel()}
          disabled={isCancelling}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#6b7280] underline-offset-4 hover:text-red-600 hover:underline disabled:opacity-50 sm:pl-12"
        >
          {isCancelling ? <Loader2 className="size-3 animate-spin" /> : null}
          Cancel request
        </button>
      ) : null}
      {error && <p role="alert" className="mt-2 text-xs text-red-600 sm:pl-12">{error}</p>}
    </li>
  );
}

export function BookedCallsList({
  peers,
  voiceEnabled,
}: {
  peers: BookedPeer[];
  voiceEnabled: boolean;
}) {
  const [activeCall, setActiveCall] = useState<ActiveGuideCall | null>(null);

  return (
    <>
      <SectionList>
        {peers.map((peer) => (
          <PeerRow key={peer.bookingId} peer={peer} voiceEnabled={voiceEnabled} onCallStart={setActiveCall} />
        ))}
      </SectionList>

      {activeCall && (
        <CallOverlay
          callId={activeCall.callId}
          displayName={activeCall.displayName}
          universityName={activeCall.universityName}
          onClose={() => setActiveCall(null)}
        />
      )}
    </>
  );
}
