"use client";

import { useActionState, useRef } from "react";

import {
  type LeadFormState,
  submitLeadAction,
} from "@/app/_actions/submit-lead";
import { syncLeadTrackingFields } from "@/components/site/lead-tracking";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";

const initialState: LeadFormState = {};

export function LeadForm({
  sourcePath,
  ctaVariant,
  title = "Request your shortlist",
  description = "Share your details and we will help you shortlist options based on budget, country preference, and admission goals.",
  courseSlug,
  countrySlug,
  universitySlug,
  embedded = false,
  simple = false,
  stacked = false,
}: {
  sourcePath: string;
  ctaVariant: string;
  title?: string;
  description?: string;
  courseSlug?: string;
  countrySlug?: string;
  universitySlug?: string;
  embedded?: boolean;
  simple?: boolean;
  stacked?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    submitLeadAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtInputRef = useRef<HTMLInputElement>(null);

  const armStartedAt = () => {
    syncLeadTrackingFields(formRef.current);

    if (startedAtInputRef.current && startedAtInputRef.current.value === "0") {
      startedAtInputRef.current.value = String(Date.now());
    }
  };

  return (
    <Card id="lead-form" className={embedded ? "border-0 bg-transparent shadow-none" : "border-border/80 bg-card/90 shadow-xl"}>
      {!embedded && (
        <CardHeader className="space-y-3">
          <CardTitle className="font-display text-heading text-3xl tracking-tight">{title}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </CardHeader>
      )}
      <CardContent className={embedded ? "p-0" : undefined}>
        <form
          ref={formRef}
          action={formAction}
          className="space-y-5"
          onFocusCapture={armStartedAt}
          onPointerDownCapture={armStartedAt}
          onKeyDownCapture={armStartedAt}
          onSubmitCapture={armStartedAt}
        >
          <input type="hidden" name="sourcePath" value={sourcePath} />
          <input type="hidden" name="ctaVariant" value={ctaVariant} />
          <input type="hidden" name="sourceUrl" />
          <input type="hidden" name="sourceQuery" defaultValue="{}" />
          <input type="hidden" name="pageTitle" />
          <input type="hidden" name="documentReferrer" />
          <input type="hidden" name="clientContext" defaultValue="{}" />
          <input type="hidden" name="courseSlug" value={courseSlug ?? ""} />
          <input type="hidden" name="countrySlug" value={countrySlug ?? ""} />
          <input type="hidden" name="universitySlug" value={universitySlug ?? ""} />
          <input ref={startedAtInputRef} type="hidden" name="startedAt" defaultValue="0" />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          <div className={stacked ? "field-grid" : "field-grid field-grid--two"}>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <PhoneInputField id="phone" name="phone" required />
            </div>
          </div>

          <div className={stacked ? "field-grid" : "field-grid field-grid--two"}>
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input id="email" name="email" type="email" placeholder="you@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userState">State</Label>
              <Input
                id="userState"
                name="userState"
                placeholder="Your state"
                autoComplete="address-level1"
                required
              />
            </div>
          </div>

          {!simple && (
            <div className="space-y-2">
              <Label htmlFor="notes">What do you need help with?</Label>
              <Textarea
                id="notes"
                name="notes"
                className="min-h-11"
                placeholder="Target country, budget, or timeline"
              />
            </div>
          )}

          {state.error ? (
            <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending ? "Saving your enquiry..." : "Get my shortlist"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
