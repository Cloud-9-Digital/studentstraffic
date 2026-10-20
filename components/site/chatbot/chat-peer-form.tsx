"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { submitPeerRequestAction } from "@/app/_actions/submit-peer-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import { CRM_INDIAN_STATES } from "@/lib/indian-states";

/**
 * Asking to be introduced to a current student.
 *
 * Calls `submitPeerRequestAction` directly rather than going through a new
 * endpoint, so a request raised in the chat is the same record, with the same
 * validation, honeypot and lead pipeline, as one raised on a university page.
 * Nothing downstream needs to know the chat exists.
 *
 * As with counselling, the model can open this form but never collects the
 * details itself, so contact information never enters its context. And an
 * introduction is brokered — a student's own contact details are never shown.
 */
export function ChatPeerForm({
  universitySlug,
  universityName,
  reason,
}: {
  universitySlug: string;
  universityName: string;
  reason: string;
}) {
  const [state, formAction, pending] = useActionState(submitPeerRequestAction, {});
  const [done, setDone] = useState(false);
  const phoneValidRef = useRef(true);
  const startedAtInputRef = useRef<HTMLInputElement>(null);

  // Stamped on mount rather than during render: Date.now() is impure, and the
  // action only needs the value to exist before submit for its too-fast check.
  useEffect(() => {
    if (startedAtInputRef.current) {
      startedAtInputRef.current.value = String(Date.now());
    }
  }, []);

  // The action returns `{}` on success and `{ error }` on failure, so a
  // settled submit with no error is the confirmation.
  if (!pending && !state.error && done) {
    return (
      <div className="mt-3 flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/5 p-3 text-sm text-foreground">
        <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
        <p>
          Sent. We&rsquo;ll introduce you to a student at {universityName} —
          keep an eye on your phone.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!phoneValidRef.current) {
          event.preventDefault();
          return;
        }
        setDone(true);
      }}
      className="mt-3 space-y-3 rounded-xl border border-border bg-muted/40 p-3"
    >
      <p className="text-xs text-muted-foreground">{reason}</p>

      <input type="hidden" name="universitySlug" value={universitySlug} />
      <input type="hidden" name="sourcePath" value="/chat" />
      <input
        ref={startedAtInputRef}
        type="hidden"
        name="startedAt"
        defaultValue=""
      />
      <input type="hidden" name="pageTitle" value={`Chat — ${universityName}`} />
      {/* Honeypot: the existing action rejects a submission that fills it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="space-y-1.5">
        <Label htmlFor="chat-peer-name" className="text-xs">
          Full name
        </Label>
        <Input
          id="chat-peer-name"
          name="fullName"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          className="h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="chat-peer-phone" className="text-xs">
          Phone number
        </Label>
        <PhoneInputField
          id="chat-peer-phone"
          name="phone"
          required
          className="h-10"
          onValidityChange={(valid) => {
            phoneValidRef.current = valid;
          }}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="chat-peer-state" className="text-xs">
          State
        </Label>
        <select
          id="chat-peer-state"
          name="userState"
          required
          defaultValue=""
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option value="" disabled>
            Select your state
          </option>
          {CRM_INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {state.error ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="h-10 w-full text-sm">
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Sending
          </>
        ) : (
          "Ask for an introduction"
        )}
      </Button>
    </form>
  );
}
