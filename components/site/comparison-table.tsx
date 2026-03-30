import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Plus, X } from "lucide-react";

import type { FinderProgram } from "@/lib/data/types";
import { getUniversityHref } from "@/lib/routes";
import { getUniversityInitials } from "@/lib/university-media";
import {
  formatProgramAnnualFee,
  hasPublishedUsdAmount,
} from "@/lib/utils";

function UniLogoSmall({ university }: { university: FinderProgram["university"] }) {
  const initials = getUniversityInitials(university.name);
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white shadow-sm">
      {university.logoUrl ? (
        <Image
          src={university.logoUrl}
          alt={`${university.name} logo`}
          width={32}
          height={32}
          className="h-full w-full object-contain p-0.5"
        />
      ) : (
        <span className="text-[0.55rem] font-bold text-primary">{initials}</span>
      )}
    </div>
  );
}

type Row = {
  label: string;
  values: string[];
  winnerIndexes?: number[];
};

function buildRows(programs: FinderProgram[]): Row[] {
  const hasComparableUsdFees = programs.every((program) =>
    hasPublishedUsdAmount(program.offering.annualTuitionUsd),
  );
  const tuitions = hasComparableUsdFees
    ? programs.map((p) => p.offering.annualTuitionUsd)
    : [];
  const minTuition = hasComparableUsdFees ? Math.min(...tuitions) : null;
  const tuitionWinners =
    minTuition == null
      ? []
      : tuitions.map((t, i) => (t === minTuition ? i : -1)).filter((i) => i !== -1);

  return [
    {
      label: "Annual tuition",
      values: programs.map((p) => formatProgramAnnualFee(p.offering)),
      winnerIndexes:
        hasComparableUsdFees && tuitionWinners.length < programs.length
          ? tuitionWinners
          : undefined,
    },
    {
      label: "Duration",
      values: programs.map((p) => `${p.offering.durationYears} years`),
    },
    {
      label: "City",
      values: programs.map((p) => `${p.university.city}, ${p.country.name}`),
    },
    {
      label: "University type",
      values: programs.map((p) => p.university.type),
    },
    {
      label: "Teaching medium",
      values: programs.map((p) => p.offering.medium),
    },
    {
      label: "Recognition",
      values: programs.map((p) => p.university.recognitionBadges.join(", ") || "—"),
    },
  ];
}

export function ComparisonTable({
  programs,
  removeHrefs,
  emptySlots = 0,
  addHref = "/universities",
}: {
  programs: FinderProgram[];
  removeHrefs?: Record<string, string>;
  emptySlots?: number;
  addHref?: string;
}) {
  const rows = buildRows(programs);
  const totalCols = programs.length + emptySlots;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: totalCols >= 3 ? "560px" : undefined }}>
          <thead>
            <tr className="border-b border-border">
              {/* Metric label col */}
              <th className="w-[100px] bg-muted/50 px-3 py-3 text-left align-bottom sm:w-[140px] sm:px-4">
                <span className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Metric
                </span>
              </th>

              {/* University header cols */}
              {programs.map((program, i) => (
                <th
                  key={program.university.slug}
                  className={[
                    "border-l border-border px-3 py-3 text-left align-top sm:px-4",
                    i % 2 === 0 ? "bg-primary/[0.03]" : "bg-accent/[0.03]",
                  ].join(" ")}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-1">
                      <UniLogoSmall university={program.university} />
                      {removeHrefs?.[program.university.slug] && (
                        <Link
                          href={removeHrefs[program.university.slug]}
                          aria-label={`Remove ${program.university.name}`}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-red-100 hover:text-red-600"
                        >
                          <X className="size-3" />
                        </Link>
                      )}
                    </div>
                    <Link
                      href={getUniversityHref(program.university.slug)}
                      className="group"
                    >
                      <p className="line-clamp-2 text-xs font-semibold leading-tight text-foreground group-hover:text-primary">
                        {program.university.name}
                      </p>
                      <p className="mt-0.5 flex items-center gap-0.5 text-[0.65rem] text-muted-foreground">
                        {program.university.city}
                        <ArrowUpRight className="size-2.5 opacity-0 transition-opacity group-hover:opacity-50" />
                      </p>
                    </Link>
                  </div>
                </th>
              ))}

              {/* Empty slot cols */}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <th
                  key={`empty-${i}`}
                  className="border-l border-border bg-muted/20 px-3 py-3 text-left align-top sm:px-4"
                >
                  <Link
                    href={addHref}
                    className="group flex flex-col items-center justify-center gap-2 py-2 text-muted-foreground/50 transition-colors hover:text-primary"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-current">
                      <Plus className="size-4" />
                    </span>
                    <span className="text-[0.6rem] font-medium">Add</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={row.label}
                className={[
                  "border-b border-border",
                  rowIdx % 2 === 1 ? "bg-muted/20" : "",
                ].join(" ")}
              >
                <td className="bg-muted/50 px-3 py-3 align-middle sm:px-4">
                  <span className="text-[0.65rem] font-medium leading-snug text-muted-foreground">
                    {row.label}
                  </span>
                </td>

                {row.values.map((value, colIdx) => {
                  const isWinner = row.winnerIndexes?.includes(colIdx);
                  return (
                    <td
                      key={colIdx}
                      className={[
                        "border-l border-border px-3 py-3 align-middle sm:px-4",
                        isWinner ? "bg-[color:var(--status-green)]" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-1.5">
                        {isWinner && (
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--status-green-fg)]/12">
                            <Check className="size-2.5 text-[color:var(--status-green-fg)]" />
                          </span>
                        )}
                        <span
                          className={`text-xs sm:text-sm ${isWinner ? "font-semibold text-[color:var(--status-green-fg)]" : "text-foreground"}`}
                        >
                          {value}
                        </span>
                      </div>
                    </td>
                  );
                })}

                {/* Empty cells for empty slot cols */}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <td key={`empty-${i}`} className="border-l border-border bg-muted/20 px-3 py-3" />
                ))}
              </tr>
            ))}

            {/* View profile row */}
            <tr>
              <td className="bg-muted/50 px-3 py-3 align-middle sm:px-4">
                <span className="text-[0.65rem] font-medium leading-snug text-muted-foreground">
                  Full profile
                </span>
              </td>
              {programs.map((program) => (
                <td
                  key={program.university.slug}
                  className="border-l border-border px-3 py-3 align-middle sm:px-4"
                >
                  <Link
                    href={getUniversityHref(program.university.slug)}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/25 bg-primary/6 px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/12"
                  >
                    View
                    <ArrowUpRight className="size-3" />
                  </Link>
                </td>
              ))}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <td key={`empty-${i}`} className="border-l border-border bg-muted/20 px-3 py-3" />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
