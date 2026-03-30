"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Lock, MessageCircle } from "lucide-react";

import {
  connectToPeerAction,
  type ConnectToPeerState,
} from "@/app/_actions/connect-to-peer";
import { syncLeadTrackingFields } from "@/components/site/lead-tracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import type { PublicPeer } from "@/lib/university-community";

function PeerAvatar({
  peer,
  size = "md",
}: {
  peer: Pick<PublicPeer, "fullName" | "photoUrl">;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "size-12" : "size-10";
  const textSize = size === "md" ? "text-sm" : "text-xs";

  if (peer.photoUrl) {
    return (
      <div className={`${dim} relative shrink-0 overflow-hidden rounded-full border-2 border-white/30`}>
        <Image
          src={peer.photoUrl}
          alt={peer.fullName}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
    );
  }

  const color = AVATAR_COLORS[peer.fullName.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className={`${dim} ${textSize} shrink-0 flex items-center justify-center rounded-full font-bold ${color}`}>
      {getInitials(peer.fullName)}
    </div>
  );
}

const AVATAR_COLORS = [
  "bg-teal-100 text-teal-800",
  "bg-orange-100 text-orange-800",
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-green-100 text-green-800",
  "bg-rose-100 text-rose-800",
  "bg-amber-100 text-amber-800",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const initialState: ConnectToPeerState = {};

export function PeerCard({
  peer,
  universitySlug,
  universityName,
  sourcePath,
  showUniversity = false,
}: {
  peer: PublicPeer;
  universitySlug: string;
  universityName: string;
  sourcePath: string;
  showUniversity?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [state, formAction, isPending] = useActionState(
    connectToPeerAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement | null>(null);
  const startedAtRef = useRef<HTMLInputElement | null>(null);

  const firstName = peer.fullName.split(" ")[0];

  const arm = () => {
    syncLeadTrackingFields(formRef.current);
    if (startedAtRef.current && startedAtRef.current.value === "0") {
      startedAtRef.current.value = String(Date.now());
    }
  };

  const courseLabel = [peer.courseName, peer.currentYearOrBatch]
    .filter(Boolean)
    .join(" · ");

  // Success state — thank you, no contact revealed directly
  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-5 text-center">
        <PeerAvatar peer={peer} />
        <div>
          <p className="font-semibold text-white">{peer.fullName}</p>
          {courseLabel && (
            <p className="mt-0.5 text-xs text-white/70">{courseLabel}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2">
          <CheckCircle2 className="size-3.5 text-emerald-400" />
          <p className="text-xs font-medium text-white/80">Request sent!</p>
        </div>
        <p className="text-xs text-white/50 leading-relaxed">
          {firstName} will reach out to you shortly via WhatsApp or email.
        </p>
      </div>
    );
  }

  // Expanded state — form to submit before contact is revealed
  if (isExpanded) {
    return (
      <div className="rounded-2xl bg-card p-5 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <PeerAvatar peer={peer} size="sm" />
          <div>
            <p className="font-semibold text-foreground">{peer.fullName}</p>
            {courseLabel && (
              <p className="text-xs text-muted-foreground">{courseLabel}</p>
            )}
          </div>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          Share your details and {firstName} will reach out to you directly.
        </p>
        <form
          ref={formRef}
          action={formAction}
          className="space-y-3"
          onFocusCapture={arm}
          onPointerDownCapture={arm}
          onKeyDownCapture={arm}
        >
          <input type="hidden" name="peerId" value={String(peer.id)} />
          <input type="hidden" name="universitySlug" value={universitySlug} />
          <input type="hidden" name="sourcePath" value={sourcePath} />
          <input type="hidden" name="sourceUrl" />
          <input type="hidden" name="sourceQuery" defaultValue="{}" />
          <input type="hidden" name="pageTitle" />
          <input type="hidden" name="documentReferrer" />
          <input type="hidden" name="clientContext" defaultValue="{}" />
          <input
            ref={startedAtRef}
            type="hidden"
            name="startedAt"
            defaultValue="0"
          />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />
          <div className="space-y-1.5">
            <Label
              htmlFor={`peer-name-${peer.id}`}
              className="text-xs font-medium"
            >
              Your name
            </Label>
            <Input
              id={`peer-name-${peer.id}`}
              name="fullName"
              placeholder="Full name"
              required
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor={`peer-email-${peer.id}`}
              className="text-xs font-medium"
            >
              Your email
            </Label>
            <Input
              id={`peer-email-${peer.id}`}
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor={`peer-phone-${peer.id}`}
              className="text-xs font-medium"
            >
              Your WhatsApp number
            </Label>
            <PhoneInputField
              id={`peer-phone-${peer.id}`}
              name="phone"
              required
            />
          </div>
          {state.error && (
            <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {state.error}
            </p>
          )}
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              className="flex-1 bg-[#155e53] text-white hover:bg-[#0b312b]"
              disabled={isPending}
            >
              {isPending ? "Sending…" : `Connect with ${firstName}`}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Default state — contact is locked, no method revealed
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-5 text-center transition-colors hover:bg-white/15">
      <PeerAvatar peer={peer} />
      <div>
        <p className="font-semibold text-white">{peer.fullName}</p>
        {courseLabel && (
          <p className="mt-0.5 text-xs text-white/70">{courseLabel}</p>
        )}
        {showUniversity && (
          <p className="mt-1 text-xs text-white/50 leading-tight">{universityName}</p>
        )}
      </div>
      {peer.hasWhatsApp ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/25"
        >
          <Lock className="size-3" />
          Talk to {firstName}
        </button>
      ) : (
        <span className="text-xs text-white/40">Contact unavailable</span>
      )}
    </div>
  );
}
