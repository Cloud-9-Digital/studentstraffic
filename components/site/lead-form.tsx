"use client";

import { useActionState, useId, useRef, useState } from "react";
import { ChevronDown, Clock3, ShieldCheck, Sparkles } from "lucide-react";

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

const DESTINATION_OPTIONS = [
  "Not sure yet",
  "Russia",
  "Georgia",
  "Vietnam",
  "Kazakhstan",
  "Kyrgyzstan",
  "Uzbekistan",
  "Philippines",
] as const;

const BUDGET_OPTIONS = [
  "Under 20 lakhs",
  "20 to 30 lakhs",
  "30 to 40 lakhs",
  "40 lakhs and above",
  "Still figuring it out",
] as const;

const INTAKE_OPTIONS = [
  "2026 admission cycle",
  "2027 admission cycle",
  "As soon as possible",
  "Just researching",
] as const;

const NEET_STATUS_OPTIONS = [
  "Already qualified",
  "Appearing this year",
  "Planning to reattempt",
  "Need guidance",
] as const;

function buildPlannerNotes(input: {
  preferredDestination: string;
  budgetRange: string;
  intakePeriod: string;
  neetStatus: string;
  neetScore: string;
  studentGoals: string;
}) {
  const lines = [
    input.preferredDestination
      ? `Preferred destination: ${input.preferredDestination}`
      : null,
    input.budgetRange ? `Budget range: ${input.budgetRange}` : null,
    input.intakePeriod ? `Target intake: ${input.intakePeriod}` : null,
    input.neetStatus ? `NEET status: ${input.neetStatus}` : null,
    input.neetScore ? `NEET score: ${input.neetScore}` : null,
    input.studentGoals ? `Notes: ${input.studentGoals}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export type LeadFormProps = {
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
  qualificationMode?: "compact" | "detailed";
  contextBadge?: string;
  responsePromise?: string;
};

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
  qualificationMode = "compact",
  contextBadge,
  responsePromise = "Usually within a few hours",
}: LeadFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitLeadAction,
    initialState
  );
  const fieldPrefix = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtInputRef = useRef<HTMLInputElement>(null);
  const [preferredDestination, setPreferredDestination] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [intakePeriod, setIntakePeriod] = useState("");
  const [neetStatus, setNeetStatus] = useState("");
  const [neetScore, setNeetScore] = useState("");
  const [studentGoals, setStudentGoals] = useState("");
  const detailedMode = qualificationMode === "detailed";
  const notesValue = buildPlannerNotes({
    preferredDestination,
    budgetRange,
    intakePeriod,
    neetStatus,
    neetScore,
    studentGoals,
  });

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
      <input type="hidden" name="notes" value={notesValue} />
      <input type="hidden" name="courseSlug" value={courseSlug ?? ""} />
      <input type="hidden" name="countrySlug" value={countrySlug ?? ""} />
      <input type="hidden" name="universitySlug" value={universitySlug ?? ""} />
      <input ref={startedAtInputRef} type="hidden" name="startedAt" defaultValue="0" />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className={cn(stacked ? "field-grid" : "field-grid field-grid--two")}>
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}-name`}>Full name</Label>
          <Input
            id={`${fieldPrefix}-name`}
            name="fullName"
            placeholder="Your name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}-phone`}>Phone number</Label>
          <PhoneInputField id={`${fieldPrefix}-phone`} name="phone" required />
        </div>
      </div>

      <div className={cn(stacked ? "field-grid" : "field-grid field-grid--two")}>
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}-email`}>
            Email <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id={`${fieldPrefix}-email`}
            name="email"
            type="email"
            placeholder="you@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}-state`}>State</Label>
          <div className="relative">
            <select
              id={`${fieldPrefix}-state`}
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

      {detailedMode ? (
        <>
          <div className={cn(stacked ? "field-grid" : "field-grid field-grid--two")}>
            <div className="space-y-2">
              <Label htmlFor={`${fieldPrefix}-destination`}>
                Preferred destination
              </Label>
              <div className="relative">
                <select
                  id={`${fieldPrefix}-destination`}
                  value={preferredDestination}
                  onChange={(event) => {
                    setPreferredDestination(event.target.value);
                  }}
                  className="h-11 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">Select destination</option>
                  {DESTINATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${fieldPrefix}-budget`}>Budget range</Label>
              <div className="relative">
                <select
                  id={`${fieldPrefix}-budget`}
                  value={budgetRange}
                  onChange={(event) => {
                    setBudgetRange(event.target.value);
                  }}
                  className="h-11 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">Choose a budget</option>
                  {BUDGET_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className={cn(stacked ? "field-grid" : "field-grid field-grid--two")}>
            <div className="space-y-2">
              <Label htmlFor={`${fieldPrefix}-intake`}>Target intake</Label>
              <div className="relative">
                <select
                  id={`${fieldPrefix}-intake`}
                  value={intakePeriod}
                  onChange={(event) => {
                    setIntakePeriod(event.target.value);
                  }}
                  className="h-11 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">Select intake timing</option>
                  {INTAKE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${fieldPrefix}-neet-status`}>NEET status</Label>
              <div className="relative">
                <select
                  id={`${fieldPrefix}-neet-status`}
                  value={neetStatus}
                  onChange={(event) => {
                    setNeetStatus(event.target.value);
                  }}
                  className="h-11 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">Choose NEET status</option>
                  {NEET_STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${fieldPrefix}-neet-score`}>
              NEET score <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id={`${fieldPrefix}-neet-score`}
              inputMode="numeric"
              placeholder="Example: 312"
              value={neetScore}
              onChange={(event) => {
                setNeetScore(event.target.value);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${fieldPrefix}-goals`}>
              What do you want help with?
            </Label>
            <Textarea
              id={`${fieldPrefix}-goals`}
              placeholder="Tell us what you're comparing or worried about: budget, country choice, shortlist, NMC eligibility, hostel, admissions timeline..."
              value={studentGoals}
              onChange={(event) => {
                setStudentGoals(event.target.value);
              }}
              rows={4}
            />
          </div>
        </>
      ) : null}

      {state.error && (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Submitting..." : submitLabel}
      </Button>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1.5">
          <Clock3 className="size-3.5" />
          {responsePromise}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1.5">
          <ShieldCheck className="size-3.5" />
          No spam, no obligation
        </span>
        {detailedMode ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1.5">
            <Sparkles className="size-3.5" />
            Tailored shortlist support
          </span>
        ) : null}
      </div>
    </form>
  );

  if (embedded) {
    return fields;
  }

  return (
    <Card id="lead-form" className="border-border/80 bg-card/90 shadow-xl">
      <CardHeader className="space-y-3">
        {contextBadge ? (
          <div className="w-fit rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
            {contextBadge}
          </div>
        ) : null}
        <CardTitle className="font-display text-heading text-3xl tracking-tight">{title}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>{fields}</CardContent>
    </Card>
  );
}
