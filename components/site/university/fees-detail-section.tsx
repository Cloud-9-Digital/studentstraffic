import { CircleDollarSign, ExternalLink, Info } from "lucide-react";

import type { Country, FinderProgram, University } from "@/lib/data/types";
import {
  formatProgramAnnualFee,
  formatProgramDuration,
  formatProgramLivingFee,
  formatUsdAmountOrTbd,
  hasPublishedUsdAmount,
  hasRenderableProgramAnnualFee,
  hasRenderableProgramLivingFee,
} from "@/lib/utils";

import { SectionLabel } from "./shared";

export function UniversityFeesDetailSection({
  programs,
  universityName,
  university,
  country,
}: {
  programs: FinderProgram[];
  universityName: string;
  university?: University;
  country?: Country;
}) {
  const publishedPrograms = programs.filter((p) => p.offering.published);
  const primaryProgram = publishedPrograms[0];
  const course = primaryProgram?.course.shortName ?? "this program";
  const countryName = country?.name ?? "the country";

  return (
    <div className="space-y-6 py-10">
      <SectionLabel>Fee structure</SectionLabel>

      <div className="space-y-3">
        <h2 className="font-display text-2xl font-semibold text-heading">
          {universityName} {course} fee structure 2026
        </h2>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground">
          Complete year-wise fee breakdown for {course} at {universityName} in{" "}
          {university?.city ?? "the city"}, {countryName}. Includes annual
          tuition, hostel and food costs, and the total program cost across all
          years — all converted to USD for easy comparison with other
          universities.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4">
        <p className="flex items-start gap-2.5 text-sm leading-6 text-amber-800">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
          All fees shown in USD for comparison. Official fees are charged in the
          local currency of the university&apos;s country. Exchange rates vary —
          verify with the university before making payments.
        </p>
      </div>

      {publishedPrograms.map((program) => (
        <ProgramFeeCard
          key={program.offering.slug}
          program={program}
          universityName={universityName}
        />
      ))}

      {publishedPrograms.length === 0 && (
        <p className="rounded-2xl border border-border bg-muted/30 px-6 py-5 text-sm text-muted-foreground">
          Fee details are not yet published for this university. Contact us for
          the latest fee structure.
        </p>
      )}
    </div>
  );
}

function ProgramFeeCard({
  program,
  universityName,
}: {
  program: FinderProgram;
  universityName: string;
}) {
  const { offering } = program;
  const hasYearlyData = offering.yearlyCostBreakdown.some(
    (y) =>
      hasPublishedUsdAmount(y.tuitionUsd) ||
      hasPublishedUsdAmount(y.hostelUsd) ||
      hasPublishedUsdAmount(y.totalUsd),
  );
  const hasAnnualFee = hasRenderableProgramAnnualFee(offering);
  const hasLivingFee = hasRenderableProgramLivingFee(offering);
  const totalCostUsd =
    hasPublishedUsdAmount(offering.totalTuitionUsd) ? offering.totalTuitionUsd : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Program header */}
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-base font-semibold text-heading">
              {offering.title}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatProgramDuration(offering.durationYears)} ·{" "}
              {offering.medium} medium ·{" "}
              {offering.intakeMonths.join(", ")} intake
            </p>
          </div>
          {offering.officialProgramUrl && (
            <a
              href={offering.officialProgramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary"
            >
              Official page
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>

      {/* Summary cost cards */}
      {(hasAnnualFee || hasLivingFee || totalCostUsd) && (
        <div className="grid grid-cols-1 gap-px border-b border-border bg-border sm:grid-cols-3">
          <div className="bg-card px-5 py-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Annual tuition
            </p>
            <p className="mt-1.5 text-xl font-bold text-foreground">
              {hasAnnualFee ? formatProgramAnnualFee(offering) : "—"}
            </p>
            {offering.officialFeeCurrency &&
              offering.officialAnnualTuitionAmount ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {offering.officialFeeCurrency}{" "}
                {offering.officialAnnualTuitionAmount.toLocaleString()} official
              </p>
            ) : null}
          </div>
          <div className="bg-card px-5 py-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Hostel + food (est.)
            </p>
            <p className="mt-1.5 text-xl font-bold text-foreground">
              {hasLivingFee ? formatProgramLivingFee(offering) : "—"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">per year</p>
          </div>
          <div className="bg-card px-5 py-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Total program cost
            </p>
            <p className="mt-1.5 text-xl font-bold text-accent">
              {totalCostUsd
                ? `$${totalCostUsd.toLocaleString()}`
                : "—"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              tuition only · {offering.durationYears} years
            </p>
          </div>
        </div>
      )}

      {/* Year-wise breakdown */}
      {hasYearlyData ? (
        <>
          <div className="px-6 py-3">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Year-wise cost breakdown
            </p>
          </div>
          <div className="border-t border-border/60">
            <div className="grid grid-cols-4 gap-2 border-b border-border/60 bg-muted/20 px-6 py-2">
              {["Year", "Tuition", "Hostel", "Total / yr"].map((h) => (
                <span
                  key={h}
                  className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted-foreground"
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="divide-y divide-border/40">
              {offering.yearlyCostBreakdown.map((year) => (
                <div
                  key={year.yearLabel}
                  className="grid grid-cols-4 gap-2 px-6 py-3"
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
          </div>
        </>
      ) : null}

      {/* Fee notes */}
      {offering.feeNotes && (
        <div className="border-t border-border/60 bg-muted/20 px-6 py-3">
          <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <CircleDollarSign className="mt-0.5 size-3.5 shrink-0 text-accent" />
            {offering.feeNotes}
          </p>
        </div>
      )}

      {/* Verified date */}
      {offering.feeVerifiedAt && (
        <div className="border-t border-border/40 px-6 py-2.5">
          <p className="text-xs text-muted-foreground/70">
            Fee data last verified: {offering.feeVerifiedAt}
          </p>
        </div>
      )}
    </div>
  );
}
