"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Loader2,
  MapPin,
  Languages,
  GraduationCap,
  X,
  MessageSquare,
  PhoneCall,
} from "lucide-react";

import { bookPeerCallAction } from "@/app/_actions/book-peer-call";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PeerWithUniversity } from "@/lib/university-community";

// ─── Avatar ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-accent text-accent-foreground",
  "bg-primary text-primary-foreground",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function Avatar({
  peer,
  size = 56,
}: {
  peer: Pick<PeerWithUniversity, "fullName" | "photoUrl">;
  size?: number;
}) {
  const dim = `${size}px`;
  const color = AVATAR_COLORS[peer.fullName.charCodeAt(0) % AVATAR_COLORS.length];
  const textSize = size >= 96 ? "text-2xl" : size >= 80 ? "text-lg" : size >= 56 ? "text-base" : "text-sm";

  if (peer.photoUrl) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-full"
        style={{ width: dim, height: dim }}
      >
        <Image
          src={peer.photoUrl}
          alt={peer.fullName}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 flex items-center justify-center rounded-full font-bold ${color} ${textSize}`}
      style={{ width: dim, height: dim }}
    >
      {getInitials(peer.fullName)}
    </div>
  );
}

// ─── Peer profile dialog ─────────────────────────────────────────────────────

const SUCCESS_ANIMATION_STYLES = `
  @keyframes pop-in {
    0%   { transform: scale(0.4); opacity: 0; }
    65%  { transform: scale(1.18); opacity: 1; }
    100% { transform: scale(1); }
  }
  @keyframes ring-out {
    0%   { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(1.9); opacity: 0; }
  }
  .animate-pop-in { animation: pop-in 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  .animate-ring-out { animation: ring-out 0.7s ease-out forwards; }
`;

function PeerProfileDialog({
  peer,
  open,
  onOpenChange,
  isLoggedIn,
  voiceCallsEnabled,
}: {
  peer: PeerWithUniversity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoggedIn: boolean;
  voiceCallsEnabled: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"profile" | "booking-form" | "booking-success">("profile");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const firstName = peer.fullName.split(" ")[0];
  const callbackUrl = encodeURIComponent(`/students?peer=${peer.id}`);
  const location = [peer.homeCity, peer.homeState].filter(Boolean).join(", ");

  const canStartVoiceCall = voiceCallsEnabled && peer.canReceiveCalls && peer.acceptingRequests;

  const handleBookCallClick = () => {
    if (!canStartVoiceCall) return;
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/students?peer=${peer.id}`)}`);
      return;
    }
    setError(null);
    setStep("booking-form");
  };

  const handleSubmitBooking = () => {
    setError(null);
    startTransition(async () => {
      const res = await bookPeerCallAction(peer.id, message);
      if (res.success) {
        setStep("booking-success");
      } else if (res.alreadyBooked) {
        router.push("/dashboard/calls");
        onOpenChange(false);
      } else {
        setError(res.error ?? "Unable to send request. Please try again.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">Connect with {peer.fullName}</DialogTitle>

        {/* ── WhatsApp success ── */}
        {/* ── Booking success ── */}
        {step === "booking-success" && (
          <div className="p-6 text-center">
            <style>{SUCCESS_ANIMATION_STYLES}</style>
            <div className="relative mx-auto mb-5 size-20">
              <span className="absolute inset-0 rounded-full bg-primary animate-ring-out" />
              <div className="animate-pop-in flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-surface-dark-2 shadow-lg shadow-primary/20">
                <BadgeCheck className="size-10 text-primary-foreground" strokeWidth={1.75} />
              </div>
            </div>
            <h3 className="mb-1 text-base font-semibold text-foreground">Request sent!</h3>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              {firstName} has been notified. You&apos;ll get an email once they accept and can start your call.
            </p>
            <div className="rounded-xl border border-border bg-muted p-4 text-left space-y-2 mb-5">
              <p className="text-xs font-semibold text-foreground">What happens next</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                1. {firstName} reviews your request in their dashboard.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                2. Once accepted, you can call from{" "}
                <button
                  type="button"
                  onClick={() => { router.push("/dashboard/calls"); onOpenChange(false); }}
                  className="font-semibold text-accent hover:underline"
                >
                  My Calls
                </button>.
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-strong transition-colors"
            >
              Got it
            </button>
          </div>
        )}

        {/* ── Booking form ── */}
        {step === "booking-form" && (
          <div className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setStep("profile"); setError(null); }}
                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar peer={peer} size={36} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{peer.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{peer.universityName}</p>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <MessageSquare className="size-3.5 text-muted-foreground" />
                What would you like to discuss with {firstName}?
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`E.g. I'm interested in ${peer.courseName ?? "your course"} and want to know about the application process, accommodation, and life in ${peer.countryName ?? "your city"}.`}
                rows={4}
                maxLength={1000}
                className="w-full resize-none rounded-xl border border-border bg-muted px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              <p className="mt-1 text-right text-[11px] text-muted-foreground/60">{message.length}/1000</p>
            </div>

            <p className="mb-3 text-xs text-muted-foreground">Keep chat and calls here. Do not share phone numbers, emails, or social handles.</p>

            {error && (
              <p className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmitBooking}
              disabled={isPending || message.trim().length === 0}
              className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-strong disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <PhoneCall className="size-4" />}
              {isPending ? "Sending…" : `Request a call with ${firstName}`}
            </button>
          </div>
        )}

        {/* ── Profile view ── */}
        {step === "profile" && (
          <>
            {/* Dark header band */}
            <div className="relative bg-gradient-to-br from-[#0b2e2a] to-[#155e53] px-6 pt-8 pb-16">
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="ring-4 ring-white/20 ring-offset-0 rounded-full">
                  <Avatar peer={peer} size={88} />
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5">
                    <p className="text-lg font-bold text-white leading-snug">{peer.fullName}</p>

                  </div>
                  <p className="mt-0.5 text-sm text-white/70">{peer.universityName}</p>
                  <p className="text-xs text-white/50">{peer.countryName}</p>
                </div>
              </div>
            </div>

            {/* Info card — overlaps the header */}
            <div className="relative -mt-8 mx-4 rounded-2xl border border-border bg-card shadow-sm">
              {(peer.courseName || peer.currentYearOrBatch) && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 px-4 pt-4 pb-3 border-b border-border">
                  {peer.courseName && (
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                      {peer.courseName}
                    </span>
                  )}
                  {peer.currentYearOrBatch && (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {peer.currentYearOrBatch}
                    </span>
                  )}
                </div>
              )}

              <div className="divide-y divide-border">
                {location && (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <MapPin className="size-4 shrink-0 text-muted-foreground/60" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/50">From</p>
                      <p className="text-sm text-foreground">{location}</p>
                    </div>
                  </div>
                )}
                {peer.languages && peer.languages.length > 0 && (
                  <div className="flex items-start gap-3 px-4 py-3">
                    <Languages className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/50">Speaks</p>
                      <p className="text-sm text-foreground">{peer.languages.join(", ")}</p>
                    </div>
                  </div>
                )}
                {peer.courseName && (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <GraduationCap className="size-4 shrink-0 text-muted-foreground/60" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/50">Studying</p>
                      <p className="text-sm text-foreground">
                        {[peer.courseName, peer.currentYearOrBatch].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="px-4 py-5 space-y-2.5">
              {canStartVoiceCall ? (
                <>
                  {error && (
                    <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      {error}
                    </p>
                  )}
                  {canStartVoiceCall ? (
                    <button
                      type="button"
                      onClick={handleBookCallClick}
                      disabled={isPending}
                      className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-strong disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="size-4" />
                      {isLoggedIn ? `Request a call with ${firstName}` : `Sign in to request a call`}
                    </button>
                  ) : null}
                  {!isLoggedIn && (
                    <p className="text-center text-xs text-muted-foreground">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => router.push(`/register?callbackUrl=${callbackUrl}`)}
                        className="font-semibold text-accent hover:underline"
                      >
                        Register free
                      </button>
                    </p>
                  )}
                </>
              ) : (
                <p className="py-2 text-center text-sm text-muted-foreground">
                  In-app calling is not available for this guide yet
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── StudentCard ─────────────────────────────────────────────────────────────

export function StudentCard({
  peer,
  isLoggedIn = false,
  voiceCallsEnabled = false,
  autoOpen = false,
}: {
  peer: PeerWithUniversity;
  isLoggedIn?: boolean;
  voiceCallsEnabled?: boolean;
  autoOpen?: boolean;
}) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(autoOpen);
  const firstName = peer.fullName.split(" ")[0];

  // On auto-open, clean the ?peer= param from the URL so it doesn't linger
  useEffect(() => {
    if (!autoOpen) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("peer");
    const next = url.pathname + (url.search || "");
    router.replace(next, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-col rounded-2xl border border-border bg-card transition-all hover:border-accent/30 hover:shadow-sm group">

        {/* Avatar + identity */}
        <div className="flex flex-col items-center px-4 pt-6 pb-4 text-center gap-3">
          <div className="ring-[3px] ring-accent/15 ring-offset-2 rounded-full">
            <Avatar peer={peer} size={88} />
          </div>

          <div className="min-w-0 w-full space-y-0.5">
            <p className="font-semibold text-foreground text-sm leading-snug">{peer.fullName}</p>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{peer.universityName}</p>
            <p className="text-[11px] text-muted-foreground/70">{peer.countryName}</p>
          </div>

          {(peer.courseName || peer.currentYearOrBatch) && (
            <div className="flex flex-wrap items-center justify-center gap-1">
              {peer.courseName && (
                <span className="rounded-md bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                  {peer.courseName}
                </span>
              )}
              {peer.currentYearOrBatch && (
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {peer.currentYearOrBatch}
                </span>
              )}
            </div>
          )}

          {(peer.homeState || peer.homeCity) && (
            <p className="text-[11px] text-muted-foreground/70">
              {[peer.homeCity, peer.homeState].filter(Boolean).join(", ")}
            </p>
          )}

          {peer.languages && peer.languages.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1">
              {peer.languages.map((lang) => (
                <span key={lang} className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {lang}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto border-t border-border px-4 py-3.5">
          {voiceCallsEnabled && peer.canReceiveCalls && peer.acceptingRequests ? (
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="w-full rounded-xl bg-accent py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-strong group-hover:shadow-sm"
            >
              {`Call ${firstName}`}
            </button>
          ) : (
            <p className="py-1 text-center text-[11px] text-muted-foreground">
              {peer.acceptingRequests ? "In-app calling unavailable" : "Not accepting new requests"}
            </p>
          )}
        </div>
      </div>

      {/* Mount a fresh dialog for each request. */}
      {profileOpen && <PeerProfileDialog
        peer={peer}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        isLoggedIn={isLoggedIn}
        voiceCallsEnabled={voiceCallsEnabled}
      />}

    </>
  );
}
