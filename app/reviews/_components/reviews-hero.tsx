"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterPanel } from "./filter-panel";
import type { ReviewFilters } from "./types";

export function ReviewsHero({
  filters,
  countries,
  universities,
  activeFilterCount,
  sheetOpen,
  onSearch,
  onSet,
  onClear,
  onSheetOpenChange,
}: {
  filters: ReviewFilters;
  countries: string[];
  universities: { slug: string; name: string }[];
  activeFilterCount: number;
  sheetOpen: boolean;
  onSearch: (v: string) => void;
  onSet: (key: keyof ReviewFilters, value: string) => void;
  onClear: () => void;
  onSheetOpenChange: (open: boolean) => void;
}) {
  return (
    <div className="relative overflow-hidden bg-surface-dark">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
      <div className="hero-grid-lines absolute inset-0 pointer-events-none" />
      <div
        className="hero-orb hero-orb--warm pointer-events-none absolute -right-16 -top-20 size-96 opacity-50"
        aria-hidden
      />
      <div
        className="hero-orb hero-orb--warm pointer-events-none absolute -bottom-10 left-10 size-72 opacity-30"
        aria-hidden
      />

      <div className="container-shell relative py-10 pb-8 md:py-16 md:pb-10">
        <div className="mb-7 space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            From students, not agents
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl">
            Student reviews
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-6 text-white/60 md:text-base md:leading-7">
            Real experiences from Indian students studying MBBS abroad —
            academics, hostels, food, clinical training, and life on campus.
          </p>
        </div>

        <div className="mx-auto flex max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by name or university…"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/10 pl-11 pr-10 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25 focus:bg-white/15 transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => onSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/40 hover:text-white/70 transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
            <SheetTrigger asChild>
              <button className="lg:hidden flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-medium text-white/80 hover:bg-white/15 transition-colors shrink-0">
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#c2410c] text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl px-5 pb-8 pt-0">
              <SheetHeader className="py-4 border-b border-slate-100 mb-5">
                <SheetTitle>Filter reviews</SheetTitle>
              </SheetHeader>
              <FilterPanel
                filters={filters}
                countries={countries}
                universities={universities}
                activeCount={activeFilterCount}
                onSet={onSet}
                onClear={onClear}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
