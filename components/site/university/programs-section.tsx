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
      <div className="hidden overflow-hidden rounded-[1.5rem] border border-border lg:block">
        <div className="grid grid-cols-[2.2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-border bg-muted/40 px-5 py-3">
          {["Program", "Annual fee", "Duration", "Medium", "Intake"].map(
            (label) => (
              <span
                key={label}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {label}
              </span>
            )
          )}
        </div>
        {programs.map((program, index) => (
          <div
            key={program.offering.slug}
            className={`grid grid-cols-[2.2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-4 ${
              index % 2 === 0 ? "bg-card" : "bg-muted/20"
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {program.course.shortName}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {program.offering.title}
              </p>
            </div>
            <span className="text-sm text-foreground">
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

      <div className="grid gap-4 lg:hidden">
        {programs.map((program) => (
          <div
            key={program.offering.slug}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{program.course.shortName}</Badge>
              <Badge variant="outline">{program.offering.medium}</Badge>
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {program.offering.title}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <ProgramMeta
                label="Annual fee"
                value={formatProgramAnnualFee(program.offering)}
              />
              <ProgramMeta
                label="Duration"
                value={formatProgramDuration(program.offering.durationYears)}
              />
              <ProgramMeta
                label="Intake"
                value={program.offering.intakeMonths.join(", ")}
              />
              <ProgramMeta label="Course" value={program.course.shortName} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
