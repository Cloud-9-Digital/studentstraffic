"use client";

import type React from "react";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  type LeadFormState,
  submitLeadAction,
} from "@/app/_actions/submit-lead";
import { useNavCountries } from "@/components/app/nav-countries-client-provider";
import { useNavCourses } from "@/components/app/nav-courses-client-provider";
import { syncLeadTrackingFields } from "@/components/site/lead-tracking";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import { trackLeadFormSubmit } from "@/lib/analytics";
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

export type LeadFormProps = {
  sourcePath: string;
  ctaVariant: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  emailRequired?: boolean;
  notes?: string;
  courseSlug?: string;
  countrySlug?: string;
  universitySlug?: string;
  embedded?: boolean;
  stacked?: boolean;
  /** When true, hides input placeholder text (labels still show the field purpose). */
  hidePlaceholders?: boolean;
  /**
   * When true, renders the NEET score and category fields (alongside email
   * and state). Only the NEET College Predictor tool sets this — every other
   * lead form no longer asks for a NEET score.
   */
  showNeetCategory?: boolean;
  /** When true, locks the phone field to +91 (India) and hides the country picker. */
  lockPhoneToIndia?: boolean;
  className?: string;
  children?: React.ReactNode;
};

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      {" "}*
    </span>
  );
}

const NEET_CATEGORIES = ["General", "EWS", "OBC-NCL", "SC", "ST", "PwD"];

export function LeadForm({
  sourcePath,
  ctaVariant,
  title = "Talk to a Students Traffic counsellor",
  description = "Leave your number and our team will call you with guidance on country options, scholarships, shortlisting, and the next admission step that fits your profile. Parents can join the call too.",
  submitLabel = "Request a free counselling call",
  emailRequired = false,
  notes,
  courseSlug,
  countrySlug,
  universitySlug,
  embedded = false,
  stacked = false,
  hidePlaceholders = false,
  showNeetCategory = false,
  lockPhoneToIndia = false,
  className,
  children,
}: LeadFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitLeadAction,
    initialState
  );
  const fieldPrefix = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtInputRef = useRef<HTMLInputElement>(null);
  const hasTrackedSubmitRef = useRef(false);
  const phoneValidRef = useRef(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // Course/country options for the visible interest selects. Sourced from the
  // same catalog data (via the nav client providers) used across the site.
  const navCourses = useNavCourses();
  const navCountries = useNavCountries();
  // Selected interest values feed the existing courseSlug/countrySlug fields
  // the server action already validates and stores. Seeded from props so any
  // caller-provided context still preselects the right option.
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(courseSlug ?? "");
  const [selectedCountrySlug, setSelectedCountrySlug] = useState(
    countrySlug ?? ""
  );

  const armStartedAt = () => {
    syncLeadTrackingFields(formRef.current);

    if (startedAtInputRef.current && startedAtInputRef.current.value === "0") {
      startedAtInputRef.current.value = String(Date.now());
    }
  };

  // Arm on mount (not just on focus/pointerdown/keydown): browser autofill
  // can populate every field without dispatching those events, so a user who
  // fills the form entirely via autofill and clicks submit would otherwise
  // have the timer armed by that same click -- making the elapsed time
  // measured at submit always ~0ms and always tripping wasSubmittedTooFast,
  // no matter how long they actually spent on the form.
  useEffect(() => {
    armStartedAt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackSubmit = () => {
    if (hasTrackedSubmitRef.current) {
      return;
    }

    hasTrackedSubmitRef.current = true;
    trackLeadFormSubmit({
      source_path: sourcePath,
      cta_variant: ctaVariant,
      course_slug: !showNeetCategory
        ? selectedCourseSlug || undefined
        : courseSlug,
      country_slug: !showNeetCategory
        ? selectedCountrySlug || undefined
        : countrySlug,
      university_slug: universitySlug,
      page_path:
        typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  };

  const emailField = (
    <div className="space-y-2">
      <Label htmlFor={`${fieldPrefix}-email`}>
        Email
        {emailRequired ? (
          <RequiredMark />
        ) : (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </Label>
          <Input
            className="h-12"
            id={`${fieldPrefix}-email`}
        name="email"
        type="email"
        placeholder={hidePlaceholders ? undefined : "you@email.com"}
        required={emailRequired}
      />
    </div>
  );

  const stateField = (
    <div className="space-y-2">
      <Label htmlFor={`${fieldPrefix}-state`}>
        State<RequiredMark />
      </Label>
      <div className="relative">
        <select
          id={`${fieldPrefix}-state`}
          name="userState"
          required
          defaultValue=""
          className="h-12 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-2 pr-9 text-sm leading-normal text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled className="text-muted-foreground">Select state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );

  const fields = (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4"
      onFocusCapture={armStartedAt}
      onPointerDownCapture={armStartedAt}
      onKeyDownCapture={armStartedAt}
      onSubmitCapture={(event) => {
        armStartedAt();

        if (!phoneValidRef.current) {
          event.preventDefault();
          setClientError("Please enter a valid phone number.");
          return;
        }

        setClientError(null);
        trackSubmit();
      }}
    >
      <input type="hidden" name="sourcePath" value={sourcePath} />
      <input type="hidden" name="ctaVariant" value={ctaVariant} />
      <input type="hidden" name="sourceUrl" />
      <input type="hidden" name="sourceQuery" defaultValue="{}" />
      <input type="hidden" name="pageTitle" />
      <input type="hidden" name="documentReferrer" />
      <input type="hidden" name="clientContext" defaultValue="{}" />
      <input type="hidden" name="notes" value={notes ?? ""} />
      {/* The NEET predictor branch doesn't render the visible interest
          selects, so it needs these hidden fallback inputs instead. Every
          other form shows the selects, which carry the courseSlug/countrySlug
          names themselves — rendering both would create duplicate fields. */}
      {showNeetCategory ? (
        <>
          <input type="hidden" name="courseSlug" value={courseSlug ?? ""} />
          <input type="hidden" name="countrySlug" value={countrySlug ?? ""} />
        </>
      ) : null}
      <input type="hidden" name="universitySlug" value={universitySlug ?? ""} />
      <input ref={startedAtInputRef} type="hidden" name="startedAt" defaultValue="0" />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className={cn(stacked ? "field-grid" : "field-grid field-grid--two")}>
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}-name`}>
            Full name<RequiredMark />
          </Label>
          <Input
            className="h-12"
            id={`${fieldPrefix}-name`}
            name="fullName"
            placeholder={hidePlaceholders ? undefined : "Student or parent name"}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}-phone`}>
            Phone number<RequiredMark />
          </Label>
          <PhoneInputField
            id={`${fieldPrefix}-phone`}
            name="phone"
            required
            className="h-12"
            placeholder={hidePlaceholders ? "" : undefined}
            lockCountry={lockPhoneToIndia}
            onValidityChange={(valid) => {
              phoneValidRef.current = valid;
            }}
          />
        </div>
      </div>

      {!showNeetCategory ? (
        <div className={cn(stacked ? "field-grid" : "field-grid field-grid--two")}>
          {emailField}
          {stateField}
        </div>
      ) : null}

      {!showNeetCategory ? (
        <div className={cn(stacked ? "field-grid" : "field-grid field-grid--two")}>
          <div className="space-y-2">
            <Label htmlFor={`${fieldPrefix}-course`}>Interested course</Label>
            <div className="relative">
              <select
                id={`${fieldPrefix}-course`}
                name="courseSlug"
                value={selectedCourseSlug}
                onChange={(event) => setSelectedCourseSlug(event.target.value)}
          className="h-12 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-2 pr-9 text-sm leading-normal text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" className="text-muted-foreground">
                  Select a course
                </option>
                {navCourses.map((course) => (
                  <option key={course.slug} value={course.slug}>
                    {course.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${fieldPrefix}-country`}>Interested country</Label>
            <div className="relative">
              <select
                id={`${fieldPrefix}-country`}
                name="countrySlug"
                value={selectedCountrySlug}
                onChange={(event) => setSelectedCountrySlug(event.target.value)}
                className="h-12 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-2 pr-9 text-sm leading-normal text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" className="text-muted-foreground">
                  Select a country
                </option>
                {navCountries.map((country) => (
                  <option key={country.slug} value={country.slug}>
                    {country.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={cn(stacked ? "field-grid" : "field-grid field-grid--two")}>
            {emailField}
            <div className="space-y-2">
              <Label htmlFor={`${fieldPrefix}-neet`}>
                NEET score<RequiredMark />
              </Label>
              <Input
                id={`${fieldPrefix}-neet`}
                name="neetScore"
                type="number"
                inputMode="numeric"
                min={0}
                max={720}
                placeholder={hidePlaceholders ? undefined : "Enter NEET score"}
                required
              />
            </div>
          </div>
          <div className={cn(stacked ? "field-grid" : "field-grid field-grid--two")}>
            <div className="space-y-2">
              <Label htmlFor={`${fieldPrefix}-neet-category`}>
                Category<RequiredMark />
              </Label>
              <div className="relative">
                <select
                  id={`${fieldPrefix}-neet-category`}
                  name="neetCategory"
                  required
                  defaultValue=""
                  className="h-12 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-2 pr-9 text-sm leading-normal text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled className="text-muted-foreground">Select category</option>
                  {NEET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            {stateField}
          </div>
        </>
      )}

      {children}

      {(clientError || state.error) && (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {clientError || state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Submitting..." : submitLabel}
      </Button>
    </form>
  );

  if (embedded) {
    return <div className={className}>{fields}</div>;
  }

  return (
    <Card
      id="lead-form"
      className={cn(
        "w-full max-w-md border-border/80 bg-card/90 shadow-xl",
        className
      )}
    >
      <CardHeader className="space-y-2.5">
        <CardTitle className="font-display text-2xl tracking-tight text-heading">
          {title}
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>{fields}</CardContent>
    </Card>
  );
}
