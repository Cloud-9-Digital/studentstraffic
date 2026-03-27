"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type {
  Country,
  Course,
  FinderFilters,
  ProgramOffering,
} from "@/lib/data/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function selectClassName() {
  return "flex h-11 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-3.5 py-2.5 pr-9 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-colors";
}

function SelectWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function hasActiveFilters(filters: FinderFilters): boolean {
  const { q: _q, ...rest } = filters;
  return Object.values(rest).some((v) =>
    typeof v === "boolean" ? v : v !== undefined && v !== ""
  );
}

function countActiveFilters(filters: FinderFilters): number {
  const { q: _q, ...rest } = filters;
  return Object.values(rest).filter((v) =>
    typeof v === "boolean" ? v : v !== undefined && v !== ""
  ).length;
}

// ── Fee range preset picker ───────────────────────────────────────────────────

const FEE_PRESETS = [
  { label: "Any", min: undefined, max: undefined },
  { label: "< $4k", min: undefined, max: 4000 },
  { label: "$4k – $6k", min: 4000, max: 6000 },
  { label: "$6k – $8k", min: 6000, max: 8000 },
  { label: "$8k+", min: 8000, max: undefined },
] as const;

function FeeRangePicker({ feeMin, feeMax }: { feeMin?: number; feeMax?: number }) {
  const [active, setActive] = useState(() => {
    const idx = FEE_PRESETS.findIndex((p) => p.min === feeMin && p.max === feeMax);
    return idx >= 0 ? idx : 0;
  });
  const current = FEE_PRESETS[active];
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {FEE_PRESETS.map((preset, i) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
              i === active
                ? "border-primary/30 bg-primary/8 text-primary"
                : "border-border bg-muted/30 text-foreground hover:bg-muted/60"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <input type="hidden" name="fee_min" value={current.min ?? ""} />
      <input type="hidden" name="fee_max" value={current.max ?? ""} />
    </div>
  );
}

// ── Shared filter fields ──────────────────────────────────────────────────────

function FilterFields({
  countries,
  courses,
  mediums,
  intakes,
  filters,
  isFiltered,
  idPrefix = "ff",
}: {
  countries: Country[];
  courses: Course[];
  mediums: ProgramOffering["medium"][];
  intakes: string[];
  filters: FinderFilters;
  isFiltered: boolean;
  idPrefix?: string;
}) {
  return (
    <div className="space-y-5">
      {/* Dropdowns */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-country`} className="text-xs font-medium">Country</Label>
          <SelectWrapper>
            <select id={`${idPrefix}-country`} name="country" defaultValue={filters.country ?? ""} className={selectClassName()}>
              <option value="">All countries</option>
              {countries.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </SelectWrapper>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-course`} className="text-xs font-medium">Course</Label>
          <SelectWrapper>
            <select id={`${idPrefix}-course`} name="course" defaultValue={filters.course ?? ""} className={selectClassName()}>
              <option value="">All courses</option>
              {courses.map((c) => <option key={c.slug} value={c.slug}>{c.shortName}</option>)}
            </select>
          </SelectWrapper>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-medium`} className="text-xs font-medium">Medium</Label>
          <SelectWrapper>
            <select id={`${idPrefix}-medium`} name="medium" defaultValue={filters.medium ?? ""} className={selectClassName()}>
              <option value="">Any medium</option>
              {mediums.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </SelectWrapper>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-intake`} className="text-xs font-medium">Intake</Label>
          <SelectWrapper>
            <select id={`${idPrefix}-intake`} name="intake" defaultValue={filters.intake ?? ""} className={selectClassName()}>
              <option value="">Any intake</option>
              {intakes.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </SelectWrapper>
        </div>
      </div>

      {/* Fee range */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Annual fee (USD)</Label>
        <FeeRangePicker feeMin={filters.feeMin} feeMax={filters.feeMax} />
      </div>

      {/* Actions */}
      <div className="space-y-2.5">
        <Button type="submit" className="w-full gap-2">
          <Search className="size-4" />
          Apply filters
        </Button>
        {isFiltered && (
          <a
            href="/universities"
            className="block text-center text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-accent"
          >
            Clear all filters
          </a>
        )}
      </div>
    </div>
  );
}

// ── Sidebar search input ──────────────────────────────────────────────────────

function SidebarSearch({ q }: { q?: string }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        name="q"
        type="search"
        defaultValue={q ?? ""}
        placeholder="Search…"
        className="h-10 w-full rounded-xl border border-input bg-muted/30 pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function FinderFilterForm({
  countries,
  courses,
  mediums,
  intakes,
  filters,
  heroMode = false,
  sidebarMode = false,
}: {
  countries: Country[];
  courses: Course[];
  mediums: ProgramOffering["medium"][];
  intakes: string[];
  filters: FinderFilters;
  heroMode?: boolean;
  sidebarMode?: boolean;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isFiltered = hasActiveFilters(filters);
  const filterCount = countActiveFilters(filters);

  // ── Sidebar mode (desktop inline panel) ────────────────────────────────────
  if (sidebarMode) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Filters
            </span>
          </div>
          {filterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[0.65rem] font-bold text-white">
              {filterCount}
            </span>
          )}
        </div>

        {/* Form */}
        <form action="/universities" className="space-y-5 p-4">
          <SidebarSearch q={filters.q} />
          <FilterFields
            countries={countries}
            courses={courses}
            mediums={mediums}
            intakes={intakes}
            filters={filters}
            isFiltered={isFiltered}
            idPrefix="fs"
          />
        </form>
      </div>
    );
  }

  // ── Hero / default mode (search bar + filter button + sheet) ───────────────
  return (
    <>
      {/* Search + filter button row */}
      <div className={cn("flex items-center gap-2", heroMode && "mx-auto max-w-2xl")}>
        <form action="/universities" className="relative flex-1">
          {filters.country && <input type="hidden" name="country" value={filters.country} />}
          {filters.course && <input type="hidden" name="course" value={filters.course} />}
          {filters.medium && <input type="hidden" name="medium" value={filters.medium} />}
          {filters.intake && <input type="hidden" name="intake" value={filters.intake} />}
          {filters.feeMin && <input type="hidden" name="fee_min" value={filters.feeMin} />}
          {filters.feeMax && <input type="hidden" name="fee_max" value={filters.feeMax} />}

          <Search className={cn(
            "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2",
            heroMode ? "text-foreground/40" : "text-muted-foreground"
          )} />
          <input
            name="q"
            type="search"
            defaultValue={filters.q ?? ""}
            placeholder="Search universities, cities, countries…"
            className={cn(
              "h-12 w-full rounded-xl pl-11 pr-10 text-sm outline-none transition-shadow",
              heroMode
                ? "border-0 bg-white text-foreground shadow-lg placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white/60"
                : "border border-input bg-card text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            )}
          />
          {filters.q && (
            <a
              href={`/universities?${new URLSearchParams(
                Object.fromEntries(
                  Object.entries({ ...filters, q: undefined }).filter(
                    ([, v]) => v != null
                  ) as [string, string][]
                )
              ).toString()}`}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </a>
          )}
        </form>

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
            heroMode
              ? "bg-accent text-white shadow-lg hover:bg-accent-strong"
              : cn(
                  "border shadow-sm",
                  isFiltered
                    ? "border-primary/30 bg-primary/8 text-primary"
                    : "border-border bg-card text-foreground hover:bg-muted/50"
                )
          )}
        >
          <SlidersHorizontal className="size-4" />
          <span className="hidden sm:inline">Filters</span>
          {filterCount > 0 && (
            <span className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold",
              heroMode ? "bg-white/25 text-white" : "bg-accent text-white"
            )}>
              {filterCount}
            </span>
          )}
        </button>
      </div>

      {/* Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex w-[65vw] flex-col gap-0 p-0 sm:max-w-[65vw]"
        >
          <SheetHeader className="shrink-0 flex-row items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" />
              <SheetTitle className="text-sm font-semibold text-foreground">
                Filter programs
              </SheetTitle>
            </div>
            <SheetClose asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </button>
            </SheetClose>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <form
              action="/universities"
              onSubmit={() => setSheetOpen(false)}
              className="p-5"
            >
              {filters.q && <input type="hidden" name="q" value={filters.q} />}
              <FilterFields
                countries={countries}
                courses={courses}
                mediums={mediums}
                intakes={intakes}
                filters={filters}
                isFiltered={isFiltered}
                idPrefix="fsh"
              />
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
