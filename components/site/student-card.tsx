"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";

import {
  connectToPeerAction,
  type ConnectToPeerState,
} from "@/app/_actions/connect-to-peer";
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
import { Mail } from "lucide-react";
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
  const textSize = size >= 80 ? "text-lg" : size >= 56 ? "text-base" : "text-sm";

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

// ─── Connect dialog ─────────────────────────────────────────────────────────

const initialState: ConnectToPeerState = {};

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {state.success ? (
          // ── Success state ──────────────────────────────────────────────
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
            <h3 className="mb-1 text-base font-semibold text-foreground">
              Request sent!
            </h3>
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
          // ── Form state ─────────────────────────────────────────────────
          <div className="p-6">
            {/* Peer info at top */}
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
                <Label htmlFor={`dialog-name-${peer.id}`} className="text-xs font-medium">
                  Your name
                </Label>
                <Input
                  id={`dialog-name-${peer.id}`}
                  name="fullName"
                  placeholder="Full name"
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`dialog-email-${peer.id}`} className="text-xs font-medium">
                  Your email address
                </Label>
                <Input
                  id={`dialog-email-${peer.id}`}
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`dialog-phone-${peer.id}`} className="text-xs font-medium">
                  Your WhatsApp number
                </Label>
                <PhoneInputField
                  id={`dialog-phone-${peer.id}`}
                  name="phone"
                  required
                />
              </div>

              {state.error && (
                <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {state.error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-accent text-accent-foreground hover:bg-accent-strong"
              >
                {isPending ? "Connecting…" : `Get ${firstName}'s contact`}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── StudentCard ─────────────────────────────────────────────────────────────

export function StudentCard({ peer }: { peer: PeerWithUniversity }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const firstName = peer.fullName.split(" ")[0];

  return (
    <>
      <div className="flex flex-col rounded-2xl border border-border bg-card transition-all hover:border-accent/30 hover:shadow-sm group">

        {/* Avatar + identity */}
        <div className="flex flex-col items-center px-4 pt-6 pb-4 text-center gap-3">

          {/* Avatar with subtle accent ring */}
          <div className="ring-[3px] ring-accent/15 ring-offset-2 rounded-full">
            <Avatar peer={peer} size={88} />
          </div>

          <div className="min-w-0 w-full space-y-0.5">
            <p className="font-semibold text-foreground text-sm leading-snug">
              {peer.fullName}
            </p>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {peer.universityName}
            </p>
            <p className="text-[11px] text-muted-foreground/70">{peer.countryName}</p>
          </div>

          {/* Course + year chips */}
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

          {/* State / city */}
          {(peer.homeState || peer.homeCity) && (
            <p className="text-[11px] text-muted-foreground/70">
              {[peer.homeCity, peer.homeState].filter(Boolean).join(", ")}
            </p>
          )}

          {/* Languages */}
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

        {/* CTA — separated by border */}
        <div className="mt-auto border-t border-border px-4 py-3.5">
          {peer.hasWhatsApp ? (
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="w-full rounded-xl bg-accent py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent-strong group-hover:shadow-sm"
            >
              Talk to {firstName}
            </button>
          ) : (
            <p className="py-1 text-center text-[11px] text-muted-foreground">
              Contact unavailable
            </p>
          )}
        </div>
      </div>

      <ConnectDialog peer={peer} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
