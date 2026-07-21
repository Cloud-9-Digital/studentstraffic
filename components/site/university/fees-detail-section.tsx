import { CircleDollarSign, Info } from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
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
          {universityName} {course} fee structure
        </h2>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground">
          Tuition and living-cost information for {course} at {universityName}
          in {university?.city ?? "the city"}, {countryName}. The treatment
          below reflects the evidence available for each programme.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4">
        <p className="flex items-start gap-2.5 text-sm leading-6 text-amber-800">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
          Confirmed fees retain the university&apos;s published currency. Where a
          current programme fee is not public, request a tailored cost and
          funding plan instead of relying on a placeholder amount.
        </p>
      </div>

      {publishedPrograms.map((program) => (
        <ProgramFeeCard
          key={program.offering.slug}
          program={program}
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
}: {
  program: FinderProgram;
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
        </div>
      </div>

      {/* Summary cost cards */}
      {(hasAnnualFee || hasLivingFee || totalCostUsd || offering.feeStatus) && (
        <div className="grid grid-cols-1 gap-px border-b border-border bg-border sm:grid-cols-3">
          <div className="bg-card px-5 py-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Annual tuition
            </p>
            <p className="mt-1.5 text-xl font-bold text-foreground">
              {formatProgramAnnualFee(offering)}
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

      {offering.feeStatus === "on_request" ? (
        <div className="border-t border-border/60 bg-primary/[0.035] px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Tell us your intended intake and accommodation preference to receive a current tuition and full-cost plan.
            </p>
            <CounsellingDialog
              triggerContent="Get my cost plan"
              triggerVariant="default"
              triggerSize="sm"
              countrySlug={program.country.slug}
              courseSlug={program.course.slug}
              ctaVariant="programme_fee_plan"
            />
          </div>
        </div>
      ) : null}

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
