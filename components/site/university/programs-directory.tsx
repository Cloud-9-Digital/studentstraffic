"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

import { cn } from "@/lib/utils";

export type ProgramDirectoryRow = {
  slug: string;
  href: string;
  title: string;
  level: string;
  levelLabel: string;
  /** One entry per published fee, labelled by audience where known (Indian students, NRI & international). */
  fees: { label: string; amount: string }[];
  duration: string;
};

const INITIAL_VISIBLE = 10;
const SEARCH_THRESHOLD = 15;

// Compact, filterable list for universities with many programmes. Every row stays in the
// server-rendered HTML (rows past the first page are only hidden), so crawlers and AI agents
// still see every programme link.
export function ProgramsDirectory({
  rows,
  levels,
}: {
  rows: ProgramDirectoryRow[];
  levels: { level: string; label: string }[];
}) {
  const [activeLevel, setActiveLevel] = useState("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return new Set(
      rows
        .filter((row) => activeLevel === "all" || row.level === activeLevel)
        .filter((row) => !needle || row.title.toLowerCase().includes(needle))
        .map((row) => row.slug),
    );
  }, [rows, activeLevel, query]);

  const filtering = activeLevel !== "all" || query.trim() !== "";
  // Unfiltered, only the first page shows until "Show all"; a filter or search shows every match.
  const visible = filtering || expanded
    ? matches
    : new Set(rows.slice(0, INITIAL_VISIBLE).map((row) => row.slug));

  return (
    <div className="space-y-4">
      {levels.length > 1 || rows.length > SEARCH_THRESHOLD ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {levels.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none [-webkit-overflow-scrolling:touch]">
              {[{ level: "all", label: "All" }, ...levels].map((option) => (
                <button
                  key={option.level}
                  type="button"
                  onClick={() => setActiveLevel(option.level)}
                  aria-pressed={activeLevel === option.level}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    activeLevel === option.level
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
          {rows.length > SEARCH_THRESHOLD ? (
            <label className="relative block sm:w-64">
              <span className="sr-only">Find a programme</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find a programme"
                className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
              />
            </label>
          ) : null}
        </div>
      ) : null}

      {/* One column on phones, two from md up. The 1px gap over a border-coloured background draws
          the grid lines; a filler cell keeps the last row even when the visible count is odd. */}
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
        {rows.map((row) => {
          return (
            <li key={row.slug} hidden={!visible.has(row.slug)} className="bg-card">
              <Link
                href={row.href}
                className="group flex h-full flex-col gap-3 p-4 transition-colors hover:bg-muted/30 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 text-[0.95rem] font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
                    {row.title}
                  </p>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {row.levelLabel}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {row.duration}
                  </span>
                </div>
                {/* One line per published fee, so the Indian-student and NRI/international rates read
                    side by side instead of as one ambiguous figure. */}
                {/* Stacked on phones; one row on desktop so both fees read side by side. */}
                <dl className="mt-auto flex flex-col divide-y divide-border/70 rounded-xl border border-border/70 bg-muted/30 md:flex-row md:divide-x md:divide-y-0">
                  {row.fees.map((fee) => (
                    <div key={fee.label} className="min-w-0 flex-1 px-3 py-2">
                      <dt className="truncate text-[0.7rem] text-muted-foreground">{fee.label}</dt>
                      <dd className="text-sm font-semibold text-foreground">
                        {fee.amount}
                        {/\d/.test(fee.amount) ? (
                          <span className="ml-0.5 text-xs font-normal text-muted-foreground">/ year</span>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Link>
            </li>
          );
        })}
        {visible.size % 2 === 1 ? <li aria-hidden="true" className="hidden bg-card md:block" /> : null}
      </ul>

      {matches.size === 0 ? (
        <p className="text-sm text-muted-foreground">No programme matches that search.</p>
      ) : null}

      {!filtering && rows.length > INITIAL_VISIBLE ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/40"
        >
          {expanded ? "Show fewer programmes" : "Show all programmes"}
        </button>
      ) : null}
    </div>
  );
}
