"use client";

import { useActionState, useEffect, useId, useMemo, useRef, useState } from "react";
import { City } from "country-state-city";
import { ChevronDown, Loader2 } from "lucide-react";

import {
  type SeminarRegistrationFormState,
  submitSeminarRegistrationAction,
} from "../_actions/submit-seminar-registration";
import { EVENTS, SPEAKER_COUNTRIES } from "../../_data";

const BUDGET_RANGES = [
  { value: "20-30", label: "₹20-30 Lakhs" },
  { value: "30-40", label: "₹30-40 Lakhs" },
  { value: "40-50", label: "₹40-50 Lakhs" },
  { value: "50+", label: "₹50+ Lakhs" },
] as const;

const DOCUMENT_TYPES = [
  { value: "aadhar", label: "Aadhar Card" },
  { value: "10th", label: "10th Marks Sheet" },
  { value: "12th", label: "12th Marks Sheet" },
] as const;
import { syncLeadTrackingFields } from "@/components/site/lead-tracking";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import { trackLeadFormSubmit } from "@/lib/analytics";

const TN_CITIES = City.getCitiesOfState("IN", "TN").map((c) => c.name);

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseEventDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split(" ");
  return new Date(Number(year), MONTH_MAP[month]!, Number(day));
}

const SELECT_CLASS =
  "h-11 w-full appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

const initialState: SeminarRegistrationFormState = {};

type Props = {
  sourcePath: string;
  ctaVariant: string;
  submitLabel?: string;
  defaultEvent?: string;
};

export function SeminarRegistrationForm({
  sourcePath,
  ctaVariant,
  submitLabel = "Reserve my free seat →",
  defaultEvent,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    submitSeminarRegistrationAction,
    initialState
  );
  const fieldPrefix = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const hasTrackedSubmitRef = useRef(false);
  const values = state.values;
  const [selectedCity, setSelectedCity] = useState(values?.city ?? "");
  const [selectedEvent, setSelectedEvent] = useState(values?.seminarEvent ?? defaultEvent ?? "");
  const [selectedCountry, setSelectedCountry] = useState(values?.interestedCountry ?? "");
  const [selectedBudget, setSelectedBudget] = useState(values?.budgetRange ?? "");
  const [needsSession, setNeedsSession] = useState(values?.needsFmgeSession ?? "");
  const [selectedDocumentType, setSelectedDocumentType] = useState(values?.documentType ?? "");

  useEffect(() => {
    setSelectedCity(values?.city ?? "");
    setSelectedEvent(values?.seminarEvent ?? defaultEvent ?? "");
    setSelectedCountry(values?.interestedCountry ?? "");
    setSelectedBudget(values?.budgetRange ?? "");
    setNeedsSession(values?.needsFmgeSession ?? "");
    setSelectedDocumentType(values?.documentType ?? "");
  }, [
    defaultEvent,
    values?.budgetRange,
    values?.city,
    values?.documentType,
    values?.interestedCountry,
    values?.needsFmgeSession,
    values?.seminarEvent,
  ]);

  // Filter out events whose date has already passed
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return EVENTS.filter((e) => parseEventDate(e.date) >= today);
  }, []);

  const armStartedAt = () => {
    syncLeadTrackingFields(formRef.current);
    if (startedAtRef.current && startedAtRef.current.value === "0") {
      startedAtRef.current.value = String(Date.now());
    }
  };

  const trackSubmit = () => {
    if (hasTrackedSubmitRef.current) {
      return;
    }

    const seminarEventField = formRef.current?.elements.namedItem("seminarEvent");

    hasTrackedSubmitRef.current = true;
    trackLeadFormSubmit({
      source_path: sourcePath,
      cta_variant: ctaVariant,
      page_path:
        typeof window !== "undefined" ? window.location.pathname : undefined,
      seminar_event:
        seminarEventField instanceof HTMLSelectElement
          ? seminarEventField.value
          : undefined,
    });
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4"
      onFocusCapture={armStartedAt}
      onPointerDownCapture={armStartedAt}
      onKeyDownCapture={armStartedAt}
      onSubmitCapture={() => {
        armStartedAt();
        trackSubmit();
      }}
    >
      {/* Hidden tracking fields */}
      <input type="hidden" name="sourcePath" value={sourcePath} />
      <input type="hidden" name="ctaVariant" value={ctaVariant} />
      <input type="hidden" name="sourceUrl" />
      <input type="hidden" name="sourceQuery" defaultValue="{}" />
      <input type="hidden" name="pageTitle" />
      <input type="hidden" name="documentReferrer" />
      <input type="hidden" name="clientContext" defaultValue="{}" />
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="0" />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <p className="text-xs text-muted-foreground">
        <span className="text-destructive">*</span> Required fields
      </p>

      {/* Student name */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-student-name`}>
          Student name <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${fieldPrefix}-student-name`}
          name="studentName"
          placeholder="Full name of the student"
          autoComplete="name"
          defaultValue={values?.studentName ?? ""}
          required
        />
      </div>

      {/* Father name */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-father-name`}>
          Father's name
        </Label>
        <Input
          id={`${fieldPrefix}-father-name`}
          name="fatherName"
          placeholder="Father's full name"
          autoComplete="off"
          defaultValue={values?.fatherName ?? ""}
        />
      </div>

      {/* Student phone */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-student-phone`}>
          Student phone number <span className="text-destructive">*</span>
        </Label>
        <PhoneInputField
          id={`${fieldPrefix}-student-phone`}
          name="studentPhone"
          defaultValue={values?.studentPhone}
          required
        />
      </div>

      {/* Alternate phone */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-alternate-phone`}>Alternate phone number</Label>
        <PhoneInputField
          id={`${fieldPrefix}-alternate-phone`}
          name="alternatePhone"
          defaultValue={values?.alternatePhone}
          required={false}
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-city`}>
          Your city <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <select
            id={`${fieldPrefix}-city`}
            name="city"
            required
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="" disabled>Select your city</option>
            {TN_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Seminar event selector */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-event`}>
          Which event do you want to attend? <span className="text-destructive">*</span>
        </Label>
        {upcomingEvents.length === 0 ? (
          <p className="rounded-xl border border-input bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            All seminars have concluded. Please check back for future events.
          </p>
        ) : (
          <div className="relative">
            <select
              id={`${fieldPrefix}-event`}
              name="seminarEvent"
              required
              value={selectedEvent}
              onChange={(event) => setSelectedEvent(event.target.value)}
              className={SELECT_CLASS}
            >
              <option value="" disabled>Select a city & date</option>
              {upcomingEvents.map((e) => (
                <option key={`${e.date}-${e.city}`} value={`${e.city} — ${e.date}`}>
                  {e.city} — {e.date}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Interested Country */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-country`}>
          Which country are you interested in?
        </Label>
        <div className="relative">
          <select
            id={`${fieldPrefix}-country`}
            name="interestedCountry"
            value={selectedCountry}
            onChange={(event) => setSelectedCountry(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="" disabled>Select a country</option>
            {SPEAKER_COUNTRIES.map((c) => (
              <option key={c.countryCode} value={c.country}>
                {c.country}
              </option>
            ))}
            <option value="Other">Other / Not sure yet</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-budget`}>
          Your budget range for MBBS abroad
        </Label>
        <div className="relative">
          <select
            id={`${fieldPrefix}-budget`}
            name="budgetRange"
            value={selectedBudget}
            onChange={(event) => setSelectedBudget(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="" disabled>Select budget range</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* FMGE Session */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-fmge-session`}>
          Do you need a 1-on-1 session with an FMGE graduate?
        </Label>
        <div className="relative">
          <select
            id={`${fieldPrefix}-fmge-session`}
            name="needsFmgeSession"
            value={needsSession}
            onChange={(e) => setNeedsSession(e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="" disabled>Select an option</option>
            <option value="yes">Yes, I want a 1-on-1 session</option>
            <option value="no">No, seminar is enough for now</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-document-type`}>
          Document type
        </Label>
        <div className="relative">
          <select
            id={`${fieldPrefix}-document-type`}
            name="documentType"
            value={selectedDocumentType}
            onChange={(event) => setSelectedDocumentType(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="" disabled>Select document type</option>
            {DOCUMENT_TYPES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-document`}>
          Upload document
        </Label>
        <input
          id={`${fieldPrefix}-document`}
          name="document"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="flex h-11 w-full cursor-pointer rounded-xl border border-input bg-transparent px-4 py-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] file:mr-4 file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-ring focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="text-xs text-muted-foreground">
          PDF, JPG, or PNG format. Max size: 5MB.
        </p>
      </div>

      {/* Error */}
      {state.error && (
        <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || upcomingEvents.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c17f3b] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a86d2f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Reserving your seat…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
