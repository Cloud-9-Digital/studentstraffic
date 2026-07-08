import {
  Briefcase,
  Building2,
  CircleDollarSign,
  FlaskConical,
  GraduationCap,
  Hospital,
} from "lucide-react";

import type { FinderProgram, University } from "@/lib/data/types";
import {
  formatProgramAnnualFee,
  formatUsdAmountOrTbd,
  formatProgramLivingFee,
  formatProgramMedium,
  formatProgramDuration,
  hasRenderableProgramLivingFee,
  hasPublishedUsdAmount,
} from "@/lib/utils";

import { SectionLabel } from "./shared";

export function UniversityAcademicsSection({
  university,
  primaryProgram,
}: {
  university: University;
  primaryProgram: FinderProgram;
}) {
  const hasAnyCostData = primaryProgram.offering.yearlyCostBreakdown.some(
    (year) =>
      hasPublishedUsdAmount(year.tuitionUsd) ||
      hasPublishedUsdAmount(year.hostelUsd) ||
      hasPublishedUsdAmount(year.totalUsd),
  );
  const hasAnnualFeeSummary =
    hasPublishedUsdAmount(primaryProgram.offering.annualTuitionUsd) ||
    hasRenderableProgramLivingFee(primaryProgram.offering);

  const isMedicalStream = (
    ["medicine", "nursing", "dental", "pharmacy", "physiotherapy"] as const
  ).includes(
    primaryProgram.course.stream as
      | "medicine"
      | "nursing"
      | "dental"
      | "pharmacy"
      | "physiotherapy",
  );
  const practicalExposureLabel = isMedicalStream
    ? "Clinical exposure"
    : "Practical training & industry exposure";
  const practicalPartnersLabel = isMedicalStream
    ? "Teaching hospitals"
    : "Industry & placement partners";
  const supportSectionLabel = isMedicalStream
    ? "Clinical & support"
    : "Training & support";
  const PracticalPartnersIcon = isMedicalStream ? Hospital : Building2;
  const PracticalExposureIcon = isMedicalStream ? FlaskConical : Briefcase;

  return (
    <div id="academics" className="deferred-render scroll-mt-24 space-y-5 py-10">
      <SectionLabel>Academic structure</SectionLabel>

      {/* ── Program header ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card px-6 py-5">
        <p className="font-display text-lg font-semibold text-heading">
          {primaryProgram.offering.title}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Duration</span>
            <span className="mx-1.5 text-border">—</span>
            {formatProgramDuration(primaryProgram.offering.durationYears)}
          </span>
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Medium</span>
            <span className="mx-1.5 text-border">—</span>
            {formatProgramMedium(primaryProgram.offering.medium, university.countrySlug)}
          </span>
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Intake</span>
            <span className="mx-1.5 text-border">—</span>
            {primaryProgram.offering.intakeMonths.join(", ")}
          </span>
        </div>
        {hasAnnualFeeSummary ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Tuition fee
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {formatProgramAnnualFee(primaryProgram.offering)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Estimated hostel fee with food
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {formatProgramLivingFee(primaryProgram.offering)}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Teaching phases ─────────────────────────────────────────── */}
      {primaryProgram.offering.teachingPhases.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-muted/30 px-6 py-3">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Teaching phases
            </p>
          </div>
          <div className="divide-y divide-border">
            {primaryProgram.offering.teachingPhases.map((phase, index) => (
              <div key={phase.phase} className="flex gap-4 px-6 py-4">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[0.65rem] font-bold text-primary mt-0.5">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {phase.phase}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {phase.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Year-wise cost breakdown ─────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-6 py-3">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Tuition fee and hostel estimate
          </p>
        </div>
        {hasAnyCostData ? (
          <>
            <div className="grid grid-cols-4 gap-2 border-b border-border/60 px-6 py-2.5">
              {["Year", "Tuition", "Hostel", "Total / yr"].map((h) => (
                <span
                  key={h}
                  className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="divide-y divide-border/50">
              {primaryProgram.offering.yearlyCostBreakdown.map((year) => (
                <div
                  key={year.yearLabel}
                  className="grid grid-cols-4 gap-2 px-6 py-3.5"
                >
                  <span className="text-sm font-medium text-foreground">
                    {year.yearLabel}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatUsdAmountOrTbd(year.tuitionUsd)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatUsdAmountOrTbd(year.hostelUsd, "—")}
                  </span>
                  <span className="text-sm font-bold text-accent">
                    {formatUsdAmountOrTbd(year.totalUsd)}
                  </span>
                </div>
              ))}
            </div>
            {primaryProgram.offering.feeNotes ? (
              <div className="border-t border-border/60 bg-muted/20 px-6 py-3">
                <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                  <CircleDollarSign className="mt-0.5 size-3.5 shrink-0 text-accent" />
                  {primaryProgram.offering.feeNotes}
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <p className="px-6 py-4 text-sm text-muted-foreground">
            Year-wise cost data is not currently published for this program.
          </p>
        )}
      </div>

      {/* ── Clinical & support (medical) / Training & support (other streams) ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-6 py-3">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {supportSectionLabel}
          </p>
        </div>
        <div className="divide-y divide-border/50">
          <div className="flex gap-4 px-6 py-4">
            <PracticalExposureIcon className="mt-0.5 size-4 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {practicalExposureLabel}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {university.practicalExposure}
              </p>
            </div>
          </div>

          {university.industryPartners.length > 0 && (
            <div className="flex gap-4 px-6 py-4">
              <PracticalPartnersIcon className="mt-0.5 size-4 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {practicalPartnersLabel}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {university.industryPartners.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/40" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {primaryProgram.offering.professionalExamSupport.length > 0 && (
            <div className="flex gap-4 px-6 py-4">
              <GraduationCap className="mt-0.5 size-4 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Licensing &amp; exam support
                </p>
                <ul className="mt-2 space-y-1.5">
                  {primaryProgram.offering.professionalExamSupport.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
