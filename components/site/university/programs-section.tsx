import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { FinderProgram } from "@/lib/data/types";
import {
  formatProgramAnnualFee,
  formatProgramLivingFee,
  formatProgramMedium,
  formatProgramDuration,
  getProgramAnnualFeeLabel,
  hasRenderableProgramLivingFee,
} from "@/lib/utils";
import { getUniversityProgramHref } from "@/lib/routes";

import { SectionLabel } from "./shared";

export function UniversityProgramsSection({
  programs,
}: {
  programs: FinderProgram[];
}) {
  return (
    <div id="programs" className="deferred-render scroll-mt-24 space-y-5 py-10">
      <div className="flex items-end justify-between gap-4">
        <SectionLabel>Programs at this university</SectionLabel>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {programs.length} {programs.length === 1 ? "programme" : "programmes"}
        </span>
      </div>
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
    <div className="space-y-4">
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Open a programme profile for eligibility, tuition, curriculum and application planning.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((program) => (
          <Link
            key={program.offering.slug}
            href={getUniversityProgramHref(program.offering.slug)}
            className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-[0_14px_35px_-34px_rgba(15,61,55,0.65)] transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_38px_-28px_rgba(15,61,55,0.3)]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-sm font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
                {program.offering.title}
              </p>
              <span className="mt-0.5 flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
                Details
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4">
              <ProgramFact
                label={getProgramAnnualFeeLabel(program.offering)}
                value={formatProgramAnnualFee(program.offering, "Fee plan on request")}
              />
              <ProgramFact label="Duration" value={formatProgramDuration(program.offering.durationYears)} />
              <ProgramFact label="Medium" value={formatProgramMedium(program.offering.medium, program.country.slug)} />
              <ProgramFact label="Intake" value={program.offering.intakeMonths.join(", ") || "Guidance available"} />
              {hasRenderableProgramLivingFee(program.offering) ? (
                <div className="col-span-2 rounded-xl bg-muted/40 px-3 py-2.5">
                  <ProgramFact label="Living estimate" value={formatProgramLivingFee(program.offering)} />
                </div>
              ) : null}
            </dl>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProgramFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.65rem] text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold leading-5 text-foreground">{value}</dd>
    </div>
  );
}
