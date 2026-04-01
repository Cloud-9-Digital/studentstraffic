import {
  CircleDollarSign,
  FlaskConical,
  GraduationCap,
  Hospital,
} from "lucide-react";

import type { FinderProgram, University } from "@/lib/data/types";
import {
  cn,
  formatUsdAmountOrTbd,
  formatProgramDuration,
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
            <span className="font-medium text-foreground">Duration</span>{" "}
            {formatProgramDuration(primaryProgram.offering.durationYears)}
          </span>
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Medium</span>{" "}
            {primaryProgram.offering.medium}
          </span>
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Intake</span>{" "}
            {primaryProgram.offering.intakeMonths.join(", ")}
          </span>
        </div>
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {phase.phase}
                    </span>
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-accent">
                      {phase.language}
                    </span>
                  </div>
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
            Year-wise cost breakdown
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

      {/* ── Clinical & support ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-6 py-3">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Clinical &amp; support
          </p>
        </div>
        <div className="divide-y divide-border/50">
          <div className="flex gap-4 px-6 py-4">
            <FlaskConical className="mt-0.5 size-4 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Clinical exposure
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {university.clinicalExposure}
              </p>
            </div>
          </div>

          {university.teachingHospitals.length > 0 && (
            <div className="flex gap-4 px-6 py-4">
              <Hospital className="mt-0.5 size-4 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Teaching hospitals
                </p>
                <ul className="mt-2 space-y-1.5">
                  {university.teachingHospitals.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/40" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {primaryProgram.offering.licenseExamSupport.length > 0 && (
            <div className="flex gap-4 px-6 py-4">
              <GraduationCap className="mt-0.5 size-4 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Licensing &amp; exam support
                </p>
                <ul className="mt-2 space-y-1.5">
                  {primaryProgram.offering.licenseExamSupport.map((item) => (
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
