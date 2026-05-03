"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import type {
  IndiaMbbsFilters,
  IndiaMbbsOptions,
  IndiaMbbsSort,
} from "@/lib/data/types";
import { cn } from "@/lib/utils";

type IndiaMbbsFilterChangeOptions = {
  history?: "replace" | "push";
};

type IndiaMbbsFilterFormProps = {
  options: IndiaMbbsOptions;
  filters: IndiaMbbsFilters;
  heroMode?: boolean;
  sidebarMode?: boolean;
  onFiltersChange: (
    nextFilters: IndiaMbbsFilters,
    options?: IndiaMbbsFilterChangeOptions,
  ) => void;
};

function hasActiveFilters(filters: IndiaMbbsFilters) {
  return Object.entries(filters)
    .filter(([key]) => key !== "q" && key !== "sort" && key !== "course")
    .some(([, value]) => value !== undefined && value !== "");
}

function countActiveFilters(filters: IndiaMbbsFilters) {
  return Object.entries(filters)
    .filter(([key]) => key !== "q" && key !== "sort" && key !== "course")
    .filter(([, value]) => value !== undefined && value !== "").length;
}

function selectClassName() {
  return "flex h-11 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-3.5 py-2.5 pr-9 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-colors";
}

function SelectField({
  id,
  label,
  value,
  children,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  children: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={selectClassName()}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}

function FilterFields({
  options,
  filters,
  onFiltersChange,
}: {
  options: IndiaMbbsOptions;
  filters: IndiaMbbsFilters;
  onFiltersChange: (
    nextFilters: IndiaMbbsFilters,
    options?: IndiaMbbsFilterChangeOptions,
  ) => void;
}) {
  const isFiltered = hasActiveFilters(filters);

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="india-mbbs-search" className="text-xs font-medium">
          Search college or university
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="india-mbbs-search"
            type="text"
            value={filters.q ?? ""}
            onChange={(event) =>
              onFiltersChange(
                { ...filters, q: event.target.value || undefined },
                { history: "replace" },
              )
            }
            placeholder="KMC, DY Patil, Mangalore"
            className="flex h-11 w-full rounded-xl border border-input bg-transparent py-2.5 pl-9 pr-10 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
          {filters.q ? (
            <button
              type="button"
              onClick={() =>
                onFiltersChange(
                  { ...filters, q: undefined },
                  { history: "replace" },
                )
              }
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      <SelectField
        id="india-mbbs-course"
        label="Course"
        value={filters.course ?? ""}
        onChange={(value) =>
          onFiltersChange(
            { ...filters, course: value || undefined },
            { history: "replace" },
          )
        }
      >
        <option value="">All courses</option>
        {options.courses.map((course) => (
          <option key={course} value={course}>
            {course}
          </option>
        ))}
      </SelectField>

      <SelectField
        id="india-mbbs-state"
        label="State"
        value={filters.state ?? ""}
        onChange={(value) =>
          onFiltersChange(
            { ...filters, state: value || undefined },
            { history: "replace" },
          )
        }
      >
        <option value="">All states</option>
        {options.states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </SelectField>

      <SelectField
        id="india-mbbs-management"
        label="Management"
        value={filters.management ?? ""}
        onChange={(value) =>
          onFiltersChange(
            { ...filters, management: value || undefined },
            { history: "replace" },
          )
        }
      >
        <option value="">All management types</option>
        {options.managementTypes.map((management) => (
          <option key={management} value={management}>
            {management}
          </option>
        ))}
      </SelectField>

      {isFiltered ? (
        <button
          type="button"
          onClick={() =>
            onFiltersChange(
              { q: filters.q, course: filters.course, sort: filters.sort },
              { history: "replace" },
            )
          }
          className="inline-flex rounded-xl text-sm font-medium text-accent underline underline-offset-2 hover:text-accent-strong"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}

export function IndiaMbbsFilterForm({
  options,
  filters,
  heroMode,
  sidebarMode,
  onFiltersChange,
}: IndiaMbbsFilterFormProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.q ?? "");
  const isFiltered = hasActiveFilters(filters);
  const filterCount = countActiveFilters(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchValue.trim();
      const current = (filters.q ?? "").trim();

      if (trimmed !== current) {
        onFiltersChange(
          { ...filters, q: trimmed || undefined },
          { history: "replace" },
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, filters, onFiltersChange]);

  if (heroMode) {
    return (
      <>
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search colleges, universities, cities…"
              className="h-12 w-full rounded-xl border-0 bg-white pl-11 pr-10 text-base text-foreground shadow-lg outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white/60"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  onFiltersChange(
                    { ...filters, q: undefined },
                    { history: "replace" },
                  );
                }}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label={
              filterCount > 0
                ? `Open filters, ${filterCount} active`
                : "Open filters"
            }
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-accent-strong sm:px-4"
          >
            <SlidersHorizontal className="size-4" />
            <span>Filters</span>
            {filterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-[0.65rem] font-bold text-white">
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
                  Filter colleges
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
                options={options}
                filters={filters}
                onFiltersChange={(nextFilters, options) => {
                  onFiltersChange(nextFilters, options);
                  setSheetOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 md:p-5",
        sidebarMode ? "shadow-sm" : "",
      )}
    >
      <FilterFields
        options={options}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
    </div>
  );
}
