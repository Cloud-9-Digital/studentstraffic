"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

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
  FinderCountryOption,
  FinderCourseOption,
  FinderFilters,
  ProgramOffering,
} from "@/lib/data/types";

export type FinderFilterChangeOptions = {
  history?: "replace" | "push";
};

type FinderFilterFormProps = {
  countries: FinderCountryOption[];
  courses: FinderCourseOption[];
  mediums: ProgramOffering["medium"][];
  intakes: string[];
  filters: FinderFilters;
  heroMode?: boolean;
  sidebarMode?: boolean;
  onFiltersChange: (
    nextFilters: FinderFilters,
    options?: FinderFilterChangeOptions,
  ) => void;
};

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
  return Object.entries(filters)
    .filter(([key]) => key !== "q" && key !== "sort")
    .some(([, value]) =>
      typeof value === "boolean" ? value : value !== undefined && value !== "",
    );
}

function countActiveFilters(filters: FinderFilters): number {
  return Object.entries(filters)
    .filter(([key]) => key !== "q" && key !== "sort")
    .filter(([, value]) =>
      typeof value === "boolean" ? value : value !== undefined && value !== "",
    ).length;
}

function mergeFilters(
  filters: FinderFilters,
  overrides: Partial<FinderFilters>,
): FinderFilters {
  return {
    ...filters,
    ...overrides,
  };
}

function DebouncedSearchInput({
  initialValue,
  placeholder,
  wrapperClassName,
  inputClassName,
  iconClassName,
  clearButtonClassName,
  onQueryChange,
}: {
  initialValue: string;
  placeholder: string;
  wrapperClassName?: string;
  inputClassName: string;
  iconClassName: string;
  clearButtonClassName?: string;
  onQueryChange: (nextValue?: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = value.trim();
      const current = initialValue.trim();

      if (trimmed !== current) {
        onQueryChange(trimmed || undefined);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [initialValue, onQueryChange, value]);

  return (
    <div className={cn("relative", wrapperClassName)}>
      <Search className={iconClassName} />
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className={inputClassName}
      />
      {clearButtonClassName && value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            onQueryChange(undefined);
          }}
          aria-label="Clear search"
          className={clearButtonClassName}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

const FEE_PRESETS = [
  { label: "Any", min: undefined, max: undefined },
  { label: "< $4k", min: undefined, max: 4000 },
  { label: "$4k – $6k", min: 4000, max: 6000 },
  { label: "$6k – $8k", min: 6000, max: 8000 },
  { label: "$8k+", min: 8000, max: undefined },
] as const;

function FeeRangePicker({
  filters,
  onPresetChange,
}: {
  filters: FinderFilters;
  onPresetChange: (min?: number, max?: number) => void;
}) {
  const active = FEE_PRESETS.findIndex(
    (preset) => preset.min === filters.feeMin && preset.max === filters.feeMax,
  );
  const activeIndex = active >= 0 ? active : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {FEE_PRESETS.map((preset, index) => (
        <button
          key={preset.label}
          type="button"
          onClick={() => onPresetChange(preset.min, preset.max)}
          className={cn(
            "rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
            index === activeIndex
              ? "border-primary/30 bg-primary/8 text-primary"
              : "border-border bg-muted/30 text-foreground hover:bg-muted/60",
          )}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

function FilterFields({
  countries,
  courses,
  mediums,
  intakes,
  filters,
  isFiltered,
  idPrefix = "ff",
  onNavigate,
  onFiltersChange,
}: {
  countries: FinderCountryOption[];
  courses: FinderCourseOption[];
  mediums: ProgramOffering["medium"][];
  intakes: string[];
  filters: FinderFilters;
  isFiltered: boolean;
  idPrefix?: string;
  onNavigate?: () => void;
  onFiltersChange: (
    nextFilters: FinderFilters,
    options?: FinderFilterChangeOptions,
  ) => void;
}) {
  function navigate(overrides: Partial<FinderFilters>) {
    onFiltersChange(mergeFilters(filters, overrides), { history: "replace" });
    onNavigate?.();
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor={`${idPrefix}-country`}
            className="text-xs font-medium"
          >
            Country
          </Label>
          <SelectWrapper>
            <select
              id={`${idPrefix}-country`}
              name="country"
              value={filters.country ?? ""}
              onChange={(event) =>
                navigate({ country: event.target.value || undefined })
              }
              className={selectClassName()}
            >
              <option value="">All countries</option>
              {countries.map((country) => (
                <option key={country.slug} value={country.slug}>
                  {country.name}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-course`} className="text-xs font-medium">
            Course
          </Label>
          <SelectWrapper>
            <select
              id={`${idPrefix}-course`}
              name="course"
              value={filters.course ?? ""}
              onChange={(event) =>
                navigate({ course: event.target.value || undefined })
              }
              className={selectClassName()}
            >
              <option value="">All courses</option>
              {courses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.shortName}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-medium`} className="text-xs font-medium">
            Medium
          </Label>
          <SelectWrapper>
            <select
              id={`${idPrefix}-medium`}
              name="medium"
              value={filters.medium ?? ""}
              onChange={(event) =>
                navigate({ medium: event.target.value || undefined })
              }
              className={selectClassName()}
            >
              <option value="">Any medium</option>
              {mediums.map((medium) => (
                <option key={medium} value={medium}>
                  {medium}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-intake`} className="text-xs font-medium">
            Intake
          </Label>
          <SelectWrapper>
            <select
              id={`${idPrefix}-intake`}
              name="intake"
              value={filters.intake ?? ""}
              onChange={(event) =>
                navigate({ intake: event.target.value || undefined })
              }
              className={selectClassName()}
            >
              <option value="">Any intake</option>
              {intakes.map((intake) => (
                <option key={intake} value={intake}>
                  {intake}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">University type</Label>
        <div className="flex gap-2">
          {([undefined, "Public", "Private"] as const).map((val) => (
            <button
              key={val ?? "all"}
              type="button"
              onClick={() => navigate({ universityType: val })}
              className={cn(
                "flex-1 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
                filters.universityType === val
                  ? "border-primary/30 bg-primary/8 text-primary"
                  : "border-border bg-muted/30 text-foreground hover:bg-muted/60",
              )}
            >
              {val ?? "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Annual fee (USD)</Label>
        <FeeRangePicker
          filters={filters}
          onPresetChange={(min, max) => navigate({ feeMin: min, feeMax: max })}
        />
      </div>

      {isFiltered && (
        <button
          type="button"
          onClick={() => {
            onFiltersChange(
              { q: filters.q, sort: filters.sort },
              { history: "replace" },
            );
            onNavigate?.();
          }}
          className="block w-full text-center text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-accent"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

function SidebarSearch({
  filters,
  onFiltersChange,
}: {
  filters: FinderFilters;
  onFiltersChange: (
    nextFilters: FinderFilters,
    options?: FinderFilterChangeOptions,
  ) => void;
}) {
  return (
    <DebouncedSearchInput
      key={`sidebar:${filters.q ?? ""}`}
      initialValue={filters.q ?? ""}
      placeholder="Search…"
      iconClassName="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      inputClassName="h-10 w-full rounded-xl border border-input bg-muted/30 pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      onQueryChange={(nextValue) =>
        onFiltersChange(mergeFilters(filters, { q: nextValue }), {
          history: "replace",
        })
      }
    />
  );
}

export function FinderFilterForm({
  countries,
  courses,
  mediums,
  intakes,
  filters,
  heroMode = false,
  sidebarMode = false,
  onFiltersChange,
}: FinderFilterFormProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isFiltered = hasActiveFilters(filters);
  const filterCount = countActiveFilters(filters);

  if (sidebarMode) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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

        <div className="space-y-5 p-4">
          <SidebarSearch filters={filters} onFiltersChange={onFiltersChange} />
          <FilterFields
            countries={countries}
            courses={courses}
            mediums={mediums}
            intakes={intakes}
            filters={filters}
            isFiltered={isFiltered}
            idPrefix="fs"
            onFiltersChange={onFiltersChange}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "flex w-full items-center gap-2",
          heroMode && "mx-auto w-full max-w-2xl",
        )}
      >
        <DebouncedSearchInput
          key={`hero:${filters.q ?? ""}`}
          initialValue={filters.q ?? ""}
          placeholder="Search universities, cities, countries…"
          wrapperClassName="min-w-0 flex-1"
          iconClassName={cn(
            "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2",
            heroMode ? "text-foreground/40" : "text-muted-foreground",
          )}
          inputClassName={cn(
            "h-12 w-full rounded-xl pl-11 pr-10 text-base outline-none transition-shadow",
            heroMode
              ? "border-0 bg-white text-foreground shadow-lg placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white/60"
              : "border border-input bg-card text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          )}
          clearButtonClassName="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onQueryChange={(nextValue) =>
            onFiltersChange(mergeFilters(filters, { q: nextValue }), {
              history: "replace",
            })
          }
        />

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label={
            filterCount > 0
              ? `Open filters, ${filterCount} active`
              : "Open filters"
          }
          className={cn(
            "flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors sm:px-4",
            heroMode
              ? "bg-accent text-white shadow-lg hover:bg-accent-strong"
              : cn(
                  "border shadow-sm",
                  isFiltered
                    ? "border-primary/30 bg-primary/8 text-primary"
                    : "border-border bg-card text-foreground hover:bg-muted/50",
                ),
          )}
        >
          <SlidersHorizontal className="size-4" />
          <span>Filters</span>
          {filterCount > 0 && (
            <span
              className={cn(
                "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold",
                heroMode ? "bg-white/25 text-white" : "bg-accent text-white",
              )}
            >
              {filterCount}
            </span>
          )}
        </button>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex w-screen max-w-none flex-col gap-0 p-0 sm:w-[420px] sm:max-w-[420px]"
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

          <div className="flex-1 overflow-y-auto p-5">
            {filters.q && (
              <p className="mb-4 text-xs text-muted-foreground">
                Search:{" "}
                <span className="font-medium text-foreground">{filters.q}</span>
              </p>
            )}
            <FilterFields
              countries={countries}
              courses={courses}
              mediums={mediums}
              intakes={intakes}
              filters={filters}
              isFiltered={isFiltered}
              idPrefix="fsh"
              onNavigate={() => setSheetOpen(false)}
              onFiltersChange={onFiltersChange}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
