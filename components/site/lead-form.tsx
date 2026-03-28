"use client";

import { useActionState, useRef } from "react";
import { ChevronDown } from "lucide-react";

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
import { cn } from "@/lib/utils";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const initialState: LeadFormState = {};

export function LeadForm({
  sourcePath,
  ctaVariant,
  title = "Talk to an admissions expert",
  description = "Share your details and our counsellors will reach out to understand your goals and guide you through your options.",
  submitLabel = "Get free guidance",
  courseSlug,
  countrySlug,
  universitySlug,
  embedded = false,
  stacked = false,
}: {
  sourcePath: string;
  ctaVariant: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  courseSlug?: string;
  countrySlug?: string;
  universitySlug?: string;
  embedded?: boolean;
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

  const fields = (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4"
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
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className={cn(stacked ? "field-grid" : "field-grid field-grid--two")}>
        <div className="space-y-2">
          <Label htmlFor="lf-name">Full name</Label>
          <Input id="lf-name" name="fullName" placeholder="Your name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lf-phone">Phone number</Label>
          <PhoneInputField id="lf-phone" name="phone" required />
        </div>
      </div>

      <div className={cn(stacked ? "field-grid" : "field-grid field-grid--two")}>
        <div className="space-y-2">
          <Label htmlFor="lf-email">
            Email <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input id="lf-email" name="email" type="email" placeholder="you@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lf-state">State</Label>
          <div className="relative">
            <select
              id="lf-state"
              name="userState"
              required
              defaultValue=""
              className="h-11 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled className="text-muted-foreground">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {state.error && (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Submitting..." : submitLabel}
      </Button>
    </form>
  );

  if (embedded) {
    return fields;
  }

  return (
    <Card id="lead-form" className="border-border/80 bg-card/90 shadow-xl">
      <CardHeader className="space-y-3">
        <CardTitle className="font-display text-heading text-3xl tracking-tight">{title}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>{fields}</CardContent>
    </Card>
  );
}
