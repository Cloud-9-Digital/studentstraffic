"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Loader2,
  MapPin,
  Languages,
  GraduationCap,
  X,
  Mail,
  PhoneCall,
} from "lucide-react";

import {
  connectToPeerAction,
  type ConnectToPeerState,
} from "@/app/_actions/connect-to-peer";
import { quickConnectToPeerAction } from "@/app/_actions/quick-connect-to-peer";
import { bookPeerCallAction } from "@/app/_actions/book-peer-call";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { syncLeadTrackingFields } from "@/components/site/lead-tracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
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

// ─── Connect dialog (fallback form for users with no phone on file) ──────────

const initialConnectState: ConnectToPeerState = {};

function ConnectDialog({
  peer,
  open,
  onOpenChange,
}: {
  peer: PeerWithUniversity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState(
    connectToPeerAction,
    initialConnectState
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {state.success ? (
          <div className="p-6 text-center">
            <style>{`
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
            `}</style>
            <div className="relative mx-auto mb-5 size-20">
              <span className="absolute inset-0 rounded-full bg-primary animate-ring-out" />
              <div className="animate-pop-in flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-surface-dark-2 shadow-lg shadow-primary/20">
                <BadgeCheck className="size-10 text-primary-foreground" strokeWidth={1.75} />
              </div>
            </div>
            <h3 className="mb-1 text-base font-semibold text-foreground">Request sent!</h3>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              {firstName} will get back to you as soon as possible.
            </p>
            <div className="rounded-xl border border-border bg-muted p-4 text-left space-y-2.5 mb-5">
              <div className="flex items-start gap-2.5">
                <svg className="mt-0.5 size-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {firstName}&apos;s contact details have been sent to your WhatsApp number and email.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your contact details have been shared with {firstName} so they can reach out to you directly.
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-strong transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
              <Avatar peer={peer} size={44} />
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{peer.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{peer.universityName}</p>
              </div>
            </div>

            <DialogHeader className="mb-5">
              <DialogTitle>Connect with {firstName}</DialogTitle>
              <DialogDescription>
                Share your details and we&apos;ll unlock {firstName}&apos;s WhatsApp contact.
              </DialogDescription>
            </DialogHeader>

            <form
              ref={formRef}
              action={formAction}
              className="space-y-4"
              onFocusCapture={arm}
              onPointerDownCapture={arm}
              onKeyDownCapture={arm}
            >
              <input type="hidden" name="peerId" value={String(peer.id)} />
              <input type="hidden" name="universitySlug" value={peer.universitySlug} />
              <input type="hidden" name="sourcePath" value="/students" />
              <input type="hidden" name="sourceUrl" />
              <input type="hidden" name="sourceQuery" defaultValue="{}" />
              <input type="hidden" name="pageTitle" />
              <input type="hidden" name="documentReferrer" />
              <input type="hidden" name="clientContext" defaultValue="{}" />
              <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="0" />
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

              <div className="space-y-1.5">
                <Label htmlFor={`dialog-name-${peer.id}`} className="text-xs font-medium">Your name</Label>
                <Input id={`dialog-name-${peer.id}`} name="fullName" placeholder="Full name" required className="h-10" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`dialog-email-${peer.id}`} className="text-xs font-medium">Your email address</Label>
                <Input id={`dialog-email-${peer.id}`} name="email" type="email" placeholder="your@email.com" required className="h-10" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`dialog-phone-${peer.id}`} className="text-xs font-medium">Your WhatsApp number</Label>
                <PhoneInputField id={`dialog-phone-${peer.id}`} name="phone" required />
              </div>

              {state.error && (
                <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {state.error}
                </p>
              )}

              <Button type="submit" disabled={isPending} className="w-full bg-accent text-accent-foreground hover:bg-accent-strong">
                {isPending ? "Connecting…" : `Get ${firstName}'s contact`}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Peer profile dialog ─────────────────────────────────────────────────────

function PeerProfileDialog({
  peer,
  open,
  onOpenChange,
  isLoggedIn,
  onNeedForm,
  voiceCallsEnabled,
}: {
  peer: PeerWithUniversity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoggedIn: boolean;
  onNeedForm: () => void;
  voiceCallsEnabled: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: boolean; booked?: boolean } | null>(null);
  const firstName = peer.fullName.split(" ")[0];
  const callbackUrl = encodeURIComponent(`/students?peer=${peer.id}`);
  const location = [peer.homeCity, peer.homeState].filter(Boolean).join(", ");

  // Reset result whenever the dialog is reopened
  useEffect(() => {
    if (!open) setResult(null);
  }, [open]);

  const canStartVoiceCall = voiceCallsEnabled && peer.canReceiveCalls;

  const handleBookCallClick = () => {
    if (!canStartVoiceCall) return;
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/students?peer=${peer.id}`)}`);
      return;
    }
    startTransition(async () => {
      const res = await bookPeerCallAction(peer.id);
      if (res.success) {
        setResult({ booked: true });
      } else if (res.alreadyBooked) {
        router.push("/dashboard/calls");
        onOpenChange(false);
      } else {
        setResult({ error: res.error ?? "Unable to book the call." });
      }
    });
  };

  const handleTalkClick = () => {
    if (!peer.hasWhatsApp) return;
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }
    startTransition(async () => {
      const res = await quickConnectToPeerAction(peer.id, peer.universitySlug);
      if (res.missingPhone) {
        // User has no phone on file — fall back to the manual form
        onOpenChange(false);
        onNeedForm();
        return;
      }
      setResult(res);
    });
  };

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">Call {peer.fullName}</DialogTitle>

        {result?.success ? (
          // ── Success ────────────────────────────────────────────────────
          <div className="p-6 text-center">
            <style>{`
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
            `}</style>
            <div className="relative mx-auto mb-5 size-20">
              <span className="absolute inset-0 rounded-full bg-primary animate-ring-out" />
              <div className="animate-pop-in flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-surface-dark-2 shadow-lg shadow-primary/20">
                <BadgeCheck className="size-10 text-primary-foreground" strokeWidth={1.75} />
              </div>
            </div>
            <h3 className="mb-1 text-base font-semibold text-foreground">Request sent!</h3>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              {firstName} will get back to you as soon as possible.
            </p>
            <div className="rounded-xl border border-border bg-muted p-4 text-left space-y-2.5 mb-5">
              <div className="flex items-start gap-2.5">
                <svg className="mt-0.5 size-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {firstName}&apos;s contact details have been sent to your WhatsApp number and email.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your contact details have been shared with {firstName} so they can reach out to you directly.
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-strong transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          // ── Profile view ───────────────────────────────────────────────
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
                    <BadgeCheck className="size-[18px] shrink-0 text-[#7ccfbf]" strokeWidth={2} />
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
              {canStartVoiceCall || peer.hasWhatsApp ? (
                <>
                  {result?.error && (
                    <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      {result.error}
                    </p>
                  )}
                  {result?.booked && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800">
                      <p className="font-semibold">Call booked!</p>
                      <p className="mt-0.5">
                        {firstName} is saved in your{" "}
                        <button
                          type="button"
                          onClick={() => { router.push("/dashboard/calls"); onOpenChange(false); }}
                          className="font-semibold underline"
                        >
                          My Calls
                        </button>{" "}
                        dashboard. Start the call whenever you&apos;re ready.
                      </p>
                    </div>
                  )}
                  {canStartVoiceCall && !result?.booked ? (
                    <button
                      type="button"
                      onClick={handleBookCallClick}
                      disabled={isPending}
                      className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-strong disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isPending ? <Loader2 className="size-4 animate-spin" /> : <PhoneCall className="size-4" />}
                      {isLoggedIn
                        ? isPending ? "Booking…" : `Book a call with ${firstName}`
                        : `Sign in to book a call`}
                    </button>
                  ) : null}
                  {peer.hasWhatsApp ? (
                    <button
                      type="button"
                      onClick={handleTalkClick}
                      disabled={isPending}
                      className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-70 flex items-center justify-center gap-2 ${
                        canStartVoiceCall
                          ? "border border-border bg-background text-foreground hover:bg-muted"
                          : "bg-accent text-accent-foreground hover:bg-accent-strong"
                      }`}
                    >
                      {isPending && !canStartVoiceCall ? <Loader2 className="size-4 animate-spin" /> : null}
                      {isLoggedIn
                        ? isPending && !canStartVoiceCall ? "Connecting…" : `Request contact instead`
                        : `Sign in to request contact`}
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
                  Contact details not available
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
  const [connectOpen, setConnectOpen] = useState(false);
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
          {peer.hasWhatsApp || (voiceCallsEnabled && peer.canReceiveCalls) ? (
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="w-full rounded-xl bg-accent py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-strong group-hover:shadow-sm"
            >
              {voiceCallsEnabled && peer.canReceiveCalls ? `Call ${firstName}` : `Talk to ${firstName}`}
            </button>
          ) : (
            <p className="py-1 text-center text-[11px] text-muted-foreground">
              Contact unavailable
            </p>
          )}
        </div>
      </div>

      {/* Profile dialog handles: profile view → quick connect (logged in) OR login redirect */}
      <PeerProfileDialog
        peer={peer}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        isLoggedIn={isLoggedIn}
        onNeedForm={() => setConnectOpen(true)}
        voiceCallsEnabled={voiceCallsEnabled}
      />

      {/* Fallback form — only shown when user has no phone number on file */}
      <ConnectDialog peer={peer} open={connectOpen} onOpenChange={setConnectOpen} />
    </>
  );
}
