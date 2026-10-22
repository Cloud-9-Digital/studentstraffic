"use client";

import { useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import type { Country } from "react-phone-number-input";

import { useResidenceCountry } from "@/components/site/use-residence-country";
import { Button } from "@/components/ui/button";
import { CountrySelect } from "@/components/ui/country-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import { trackLeadFormSubmit, trackLeadFormSuccess } from "@/lib/analytics";
import type { ChatLeadRequest } from "@/lib/chatbot/types";
import { CRM_INDIAN_STATES } from "@/lib/indian-states";

/**
 * The inline callback form.
 *
 * The model can open this form but can never collect the details itself — the
 * system prompt forbids asking for a phone number in conversation and this is
 * the only path to a lead write. That keeps contact details out of the model's
 * context entirely: they go from this form straight to /api/chat/lead.
 *
 * States come from the CRM's own verified option list, so a chat lead cannot
 * arrive with a value the CRM would silently drop. They are only asked of
 * students who live in India; everyone else just picks their country.
 */
export function ChatLeadForm({
  request,
  conversationId,
  onSubmitted,
}: {
  request: ChatLeadRequest;
  conversationId?: string;
  onSubmitted: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const phoneValidRef = useRef(true);
  const residence = useResidenceCountry();

  if (done) {
    return (
      <div className="mt-3 flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/5 p-3 text-sm text-foreground">
        <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
        <p>
          Thanks — a Students Traffic counsellor will call you. Carry on asking
          me anything in the meantime.
        </p>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!residence.country) {
      setError("Please select the country you live in.");
      return;
    }

    if (!phoneValidRef.current) {
      setError("Please enter a valid phone number.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    trackLeadFormSubmit({ ctaVariant: "chatbot" });

    try {
      const response = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: String(formData.get("fullName") ?? "").trim(),
          phone: String(formData.get("phone") ?? "").trim(),
          residenceCountry: residence.country,
          userState:
            residence.country === "IN"
              ? String(formData.get("userState") ?? "").trim()
              : undefined,
          conversationId,
          countrySlug: request.interest?.countrySlug,
          courseSlug: request.interest?.courseSlug,
          universitySlug: request.interest?.universitySlug,
          page: {
            path: window.location.pathname,
            url: window.location.href,
            title: document.title,
          },
        }),
      });

      const payload = (await response.json()) as { ok?: true; error?: string };

      if (!response.ok || payload.error) {
        setError(payload.error ?? "Something went wrong. Please try again.");
        return;
      }

      trackLeadFormSuccess({ ctaVariant: "chatbot" });
      setDone(true);
      onSubmitted();
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={residence.prime}
      onPointerDownCapture={residence.prime}
      className="mt-3 space-y-3 rounded-xl border border-border bg-muted/40 p-3"
    >
      <p className="text-xs text-muted-foreground">
        Share a few details and a counsellor will call you {request.reason}.
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="chat-lead-name" className="text-xs">
          Full name
        </Label>
        <Input
          id="chat-lead-name"
          name="fullName"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          className="h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="chat-lead-residence" className="text-xs">
          Country you live in
        </Label>
        <CountrySelect
          id="chat-lead-residence"
          name="residenceCountry"
          value={residence.country}
          onChange={(code) => {
            residence.setCountry(code);
            setError(null);
          }}
          className="h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="chat-lead-phone" className="text-xs">
          Phone number
        </Label>
        <PhoneInputField
          id="chat-lead-phone"
          name="phone"
          required
          className="h-10"
          defaultCountry={(residence.country as Country | "") || null}
          onCountryChange={residence.suggestCountry}
          onValidityChange={(valid) => {
            phoneValidRef.current = valid;
          }}
        />
      </div>

      {residence.country === "IN" ? (
        <div className="space-y-1.5">
          <Label htmlFor="chat-lead-state" className="text-xs">
            State
          </Label>
          <select
            id="chat-lead-state"
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
      ) : null}

      {error ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="h-10 w-full text-sm">
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Sending
          </>
        ) : (
          "Request a callback"
        )}
      </Button>

      <p className="text-[0.7rem] leading-snug text-muted-foreground">
        We use these details only to call you about your study-abroad plans.
      </p>
    </form>
  );
}
