import { CalendarDays, Clock, DollarSign, Languages } from "lucide-react";

import type { FinderProgram } from "@/lib/data/types";
import {
  formatProgramAnnualFee,
  formatProgramDuration,
} from "@/lib/utils";

import { Badge, ProgramMeta, SectionLabel } from "./shared";

export function UniversityProgramsSection({
  programs,
}: {
  programs: FinderProgram[];
}) {
  return (
    <div id="programs" className="deferred-render scroll-mt-24 space-y-6 py-10">
      <SectionLabel>Programs at this university</SectionLabel>
      <ProgramOfferingsTable programs={programs} />
    </div>
  );
}

function ProgramOfferingsTable({
  programs,
}: {
  programs: FinderProgram[];
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border lg:block">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] border-b border-border bg-muted/50 px-6 py-3">
          {["Program", "Annual fee", "Duration", "Medium", "Intake"].map((label) => (
            <span
              key={label}
              className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>
        {programs.map((program, index) => (
          <div
            key={program.offering.slug}
            className="group grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 border-b border-border/50 bg-card px-6 py-4 last:border-b-0 hover:bg-muted/20 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded border border-border px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-muted-foreground">
                  {program.course.shortName}
                </span>
                {program.offering.featured && (
                  <span className="inline-flex items-center rounded border border-emerald-300/70 bg-emerald-50 px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-emerald-700">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm font-medium text-foreground leading-5">
                {program.offering.title}
              </p>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {formatProgramAnnualFee(program.offering)}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatProgramDuration(program.offering.durationYears)}
            </span>
            <span className="text-sm text-muted-foreground">
              {program.offering.medium}
            </span>
            <span className="text-sm text-muted-foreground">
              {program.offering.intakeMonths.join(", ")}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 lg:hidden">
        {programs.map((program) => (
          <div
            key={program.offering.slug}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-3">
              <span className="inline-flex items-center rounded border border-border px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-muted-foreground">
                {program.course.shortName}
              </span>
              <span className="text-[0.62rem] font-semibold uppercase tracking-wide text-muted-foreground">
                {program.offering.medium}
              </span>
              {program.offering.featured && (
                <span className="ml-auto inline-flex items-center rounded border border-emerald-300/70 bg-emerald-50 px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-emerald-700">
                  Featured
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-foreground leading-5">
                {program.offering.title}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1 rounded-xl bg-muted/40 px-3 py-2.5">
                  <span className="flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
                    <DollarSign className="size-2.5" />
                    Annual fee
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {formatProgramAnnualFee(program.offering)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-xl bg-muted/40 px-3 py-2.5">
                  <span className="flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
                    <Clock className="size-2.5" />
                    Duration
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {formatProgramDuration(program.offering.durationYears)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-xl bg-muted/40 px-3 py-2.5">
                  <span className="flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
                    <CalendarDays className="size-2.5" />
                    Intake
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {program.offering.intakeMonths.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
