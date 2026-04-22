"use client";

import { useActionState, useId, useMemo, useRef } from "react";
import { City } from "country-state-city";
import { ChevronDown, Loader2 } from "lucide-react";

import {
  type SeminarLeadFormState,
  submitSeminarLeadAction,
} from "../_actions/submit-seminar-lead";
import { EVENTS } from "../_data";
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

const initialState: SeminarLeadFormState = {};

type Props = {
  sourcePath: string;
  ctaVariant: string;
  submitLabel?: string;
  defaultEvent?: string;
};

export function SeminarLeadForm({
  sourcePath,
  ctaVariant,
  submitLabel = "Reserve my free seat →",
  defaultEvent,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    submitSeminarLeadAction,
    initialState
  );
  const fieldPrefix = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const hasTrackedSubmitRef = useRef(false);

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

      {/* Full name */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-name`}>Full name</Label>
        <Input
          id={`${fieldPrefix}-name`}
          name="fullName"
          placeholder="Your name"
          autoComplete="name"
          defaultValue={state.values?.fullName ?? ""}
          required
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-phone`}>Phone number</Label>
        <PhoneInputField
          id={`${fieldPrefix}-phone`}
          name="phone"
          defaultValue={state.values?.phone}
          required
        />
      </div>

      {/* Seminar event selector */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-event`}>Seminar you want to attend</Label>
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
              defaultValue={state.values?.seminarEvent ?? defaultEvent ?? ""}
              className={SELECT_CLASS}
            >
              <option value="" disabled>Select a city & date</option>
              {upcomingEvents.map((e) => (
                <option key={`${e.date}-${e.city}`} value={`${e.city} — ${e.date} at ${e.time}`}>
                  {e.city} — {e.date} · {e.time}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Home city */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}-city`}>Your city</Label>
        <div className="relative">
          <select
            id={`${fieldPrefix}-city`}
            name="city"
            required
            defaultValue={state.values?.city ?? ""}
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
            Reserving your seat for seminar…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
