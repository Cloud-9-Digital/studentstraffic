import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { FinderProgram } from "@/lib/data/types";
import {
  formatProgramLivingFee,
  formatProgramMedium,
  formatProgramDuration,
  getProgramFeeLines,
  hasRenderableProgramLivingFee,
} from "@/lib/utils";
import { getUniversityProgramHref } from "@/lib/routes";
import { getIntakeMonthLabels } from "@/lib/catalogue-facets";
import { programmeLevelLabels, programmeLevels, type ProgrammeLevel } from "@/lib/data/program-taxonomy";

import { ProgramsDirectory, type ProgramDirectoryRow } from "./programs-directory";
import { SectionLabel } from "./shared";

// Above this many programmes the full cards make the page very long, so the section switches
// to the compact, filterable directory.
const CARD_LIMIT = 8;

export function UniversityProgramsSection({
  programs,
}: {
  programs: FinderProgram[];
}) {
  return (
    <div id="programs" className="deferred-render scroll-mt-24 space-y-5 py-10">
      <SectionLabel>Programs at this university</SectionLabel>
      {programs.length > CARD_LIMIT ? (
        <ProgramDirectoryList programs={programs} />
      ) : (
        <ProgramOfferingsTable programs={programs} />
      )}
    </div>
  );
}

function levelRank(level: string) {
  const rank = programmeLevels.indexOf(level as ProgrammeLevel);
  return rank === -1 ? programmeLevels.length : rank;
}

function programTitle(program: FinderProgram) {
  const suffix = `, ${program.university.name}`;
  return program.offering.title.endsWith(suffix)
    ? program.offering.title.slice(0, -suffix.length)
    : program.offering.title;
}

function programFees(program: FinderProgram) {
  return getProgramFeeLines(program.offering, program.country.slug, "On request")
    .map((fee) => ({
      ...fee,
      label: fee.label === "Fee plan" ? "Tuition" : fee.label,
    }));
}

function ProgramDirectoryList({ programs }: { programs: FinderProgram[] }) {
  // Only the fields the list shows are sent to the client, not the full university/course records.
  const rows: ProgramDirectoryRow[] = programs
    .map((program, index) => {
      const level = program.course.level ?? "other";
      return {
        index,
        row: {
          slug: program.offering.slug,
          href: getUniversityProgramHref(program.offering.slug),
          title: programTitle(program),
          level,
          levelLabel: programmeLevelLabels[level as ProgrammeLevel] ?? "Other",
          fees: programFees(program),
          duration: formatProgramDuration(program.offering.durationYears),
        },
      };
    })
    .sort((a, b) => levelRank(a.row.level) - levelRank(b.row.level) || a.index - b.index)
    .map(({ row }) => row);

  const levels = [...new Set(rows.map((row) => row.level))].map((level) => ({
    level,
    label: rows.find((row) => row.level === level)!.levelLabel,
  }));

  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Open a programme for eligibility, tuition, curriculum and application planning.
      </p>
      <ProgramsDirectory rows={rows} levels={levels} />
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
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((program) => {
          const medium = formatProgramMedium(program.offering.medium, program.country.slug);
          const intake = getIntakeMonthLabels(program.offering.intakeCodes).join(", ");
          return (
          <Link
            key={program.offering.slug}
            href={getUniversityProgramHref(program.offering.slug)}
            className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-[0_14px_35px_-34px_rgba(15,61,55,0.65)] transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_38px_-28px_rgba(15,61,55,0.3)]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-sm font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
                {programTitle(program)}
              </p>
              <span className="mt-0.5 flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
                Details
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4">
              {programFees(program).map((fee) => (
                <ProgramFact key={fee.label} label={fee.label} value={fee.amount} />
              ))}
              <ProgramFact label="Duration" value={formatProgramDuration(program.offering.durationYears)} />
              {medium ? <ProgramFact label="Medium" value={medium} /> : null}
              {intake ? <ProgramFact label="Intake" value={intake} /> : null}
              {hasRenderableProgramLivingFee(program.offering) ? (
                <div className="col-span-2 rounded-xl bg-muted/40 px-3 py-2.5">
                  <ProgramFact label="Living estimate" value={formatProgramLivingFee(program.offering)} />
                </div>
              ) : null}
            </dl>
          </Link>
          );
        })}
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
