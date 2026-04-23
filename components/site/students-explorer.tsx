"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal, Users, X } from "lucide-react";

const PAGE_SIZE = 24;

import { StudentCard } from "@/components/site/student-card";
import { sortCountryNames } from "@/lib/country-order";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { PeerWithUniversity } from "@/lib/university-community";

interface Filters {
  search: string;
  country: string;
  universitySlug: string;
  course: string;
  year: string;
  state: string;
  language: string;
}

function countActive(f: Filters) {
  return [f.country, f.universitySlug, f.course, f.year, f.state, f.language].filter(Boolean).length;
}

// ─── Shared filter controls ─────────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm text-slate-700 outline-none focus:border-[#c2410c] focus:ring-1 focus:ring-[#c2410c]/20 transition-colors"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

function FilterPanel({
  filters,
  countries,
  universities,
  courses,
  years,
  states,
  languages,
  onSet,
  onClear,
}: {
  filters: Filters;
  countries: string[];
  universities: { slug: string; name: string }[];
  courses: string[];
  years: string[];
  states: string[];
  languages: string[];
  onSet: (key: keyof Filters, value: string) => void;
  onClear: () => void;
}) {
  const activeCount = countActive(filters);

  return (
    <div className="space-y-5">
      <FilterSelect
        label="Country"
        value={filters.country}
        onChange={(v) => onSet("country", v)}
        options={countries.map((c) => ({ value: c, label: c }))}
        placeholder="All countries"
      />
      <FilterSelect
        label="University"
        value={filters.universitySlug}
        onChange={(v) => onSet("universitySlug", v)}
        options={universities.map((u) => ({ value: u.slug, label: u.name }))}
        placeholder="All universities"
      />
      {courses.length > 0 && (
        <FilterSelect
          label="Course"
          value={filters.course}
          onChange={(v) => onSet("course", v)}
          options={courses.map((c) => ({ value: c, label: c }))}
          placeholder="All courses"
        />
      )}
      {years.length > 0 && (
        <FilterSelect
          label="Year / Batch"
          value={filters.year}
          onChange={(v) => onSet("year", v)}
          options={years.map((y) => ({ value: y, label: y }))}
          placeholder="All years"
        />
      )}
      {states.length > 0 && (
        <FilterSelect
          label="Home state"
          value={filters.state}
          onChange={(v) => onSet("state", v)}
          options={states.map((s) => ({ value: s, label: s }))}
          placeholder="All states"
        />
      )}
      {languages.length > 0 && (
        <FilterSelect
          label="Language"
          value={filters.language}
          onChange={(v) => onSet("language", v)}
          options={languages.map((l) => ({ value: l, label: l }))}
          placeholder="All languages"
        />
      )}
      {activeCount > 0 && (
        <button
          onClick={onClear}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <X className="size-3.5" />
          Clear {activeCount} filter{activeCount !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}

// ─── Main explorer ──────────────────────────────────────────────────────────

export function StudentsExplorer({ peers }: { peers: PeerWithUniversity[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Read state from URL
  const filters: Filters = {
    search: searchParams.get("q") ?? "",
    country: searchParams.get("country") ?? "",
    universitySlug: searchParams.get("university") ?? "",
    course: searchParams.get("course") ?? "",
    year: searchParams.get("year") ?? "",
    state: searchParams.get("state") ?? "",
    language: searchParams.get("language") ?? "",
  };
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  function buildUrl(overrides: Partial<Record<string, string>>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(overrides)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const set = (key: keyof Filters, value: string) => {
    const paramKey = key === "universitySlug" ? "university" : key === "search" ? "q" : key;
    const extra: Record<string, string> = { [paramKey]: value, page: "" };
    if (key === "country") extra.university = "";
    router.replace(buildUrl(extra), { scroll: false });
  };

  const clear = () => {
    router.replace(pathname, { scroll: false });
    setSheetOpen(false);
  };

  const setPage = (p: number) => {
    router.replace(buildUrl({ page: p === 1 ? "" : String(p) }), { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Derived filter options
  const countries = useMemo(
    () => sortCountryNames([...new Set(peers.map((p) => p.countryName))]),
    [peers]
  );

  const universities = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of peers) {
      if (!filters.country || p.countryName === filters.country) {
        seen.set(p.universitySlug, p.universityName);
      }
    }
    return [...seen.entries()]
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [peers, filters.country]);

  const courses = useMemo(
    () =>
      [...new Set(peers.map((p) => p.courseName).filter(Boolean))].sort() as string[],
    [peers]
  );

  const years = useMemo(
    () =>
      [
        ...new Set(peers.map((p) => p.currentYearOrBatch).filter(Boolean)),
      ].sort((a, b) => {
        const order = [
          "1st Year", "2nd Year", "3rd Year", "4th Year",
          "5th Year", "6th Year", "Intern", "Graduated",
        ];
        return order.indexOf(a!) - order.indexOf(b!);
      }) as string[],
    [peers]
  );

  const states = useMemo(
    () => [...new Set(peers.map((p) => p.homeState).filter(Boolean))].sort() as string[],
    [peers]
  );

  const languages = useMemo(
    () =>
      [
        ...new Set(peers.flatMap((p) => p.languages ?? [])),
      ].sort(),
    [peers]
  );

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return peers.filter((p) => {
      if (
        q &&
        !p.fullName.toLowerCase().includes(q) &&
        !p.universityName.toLowerCase().includes(q)
      )
        return false;
      if (filters.country && p.countryName !== filters.country) return false;
      if (filters.universitySlug && p.universitySlug !== filters.universitySlug)
        return false;
      if (filters.course && p.courseName !== filters.course) return false;
      if (filters.year && p.currentYearOrBatch !== filters.year) return false;
      if (filters.state && p.homeState !== filters.state) return false;
      if (filters.language && !p.languages?.includes(filters.language)) return false;
      return true;
    });
  }, [peers, filters]);

  const activeFilterCount = countActive(filters);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {/* ── Dark hero ──────────────────────────────────────────────────── */}
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
              Real students. Real answers.
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl">
              Talk to students studying abroad
            </h1>
            <p className="mx-auto max-w-lg text-sm leading-6 text-white/60 md:text-base md:leading-7">
              Connect directly on WhatsApp with Indian students already at these
              universities. Unfiltered answers from peers who&apos;ve been there.
            </p>
          </div>

          {/* Search + mobile filter button */}
          <div className="mx-auto flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => set("search", e.target.value)}
                placeholder="Search by name or university…"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/10 pl-11 pr-10 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25 focus:bg-white/15 transition-colors"
              />
              {filters.search && (
                <button
                  onClick={() => set("search", "")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/40 hover:text-white/70 transition-colors"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Mobile filter trigger */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
                  <SheetTitle>Filter students</SheetTitle>
                </SheetHeader>
                <FilterPanel
                  filters={filters}
                  countries={countries}
                  universities={universities}
                  courses={courses}
                  years={years}
                  states={states}
                  languages={languages}
                  onSet={set}
                  onClear={clear}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <section className="py-8 md:py-12 bg-slate-50 min-h-[50vh]">
        <div className="container-shell">
          <div className="lg:grid lg:grid-cols-[240px_1fr] lg:items-start lg:gap-8">

            {/* Desktop sidebar */}
            <aside className="hidden lg:block sticky top-20">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="mb-5 text-sm font-semibold text-slate-900">Filters</p>
                <FilterPanel
                  filters={filters}
                  countries={countries}
                  universities={universities}
                  courses={courses}
                  years={years}
                  states={states}
                  languages={languages}
                  onSet={set}
                  onClear={clear}
                />
              </div>
            </aside>

            {/* Results */}
            <div>
              {activeFilterCount > 0 && (
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    {`${filtered.length} of ${peers.length} students`}
                    <span className="ml-1 text-slate-400">
                      · {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
                    </span>
                  </p>
                  <button
                    onClick={clear}
                    className="text-xs font-medium text-[#c2410c] hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
                  <Users className="mx-auto mb-3 size-8 text-slate-300" />
                  <p className="font-medium text-slate-600">No students match your filters.</p>
                  <button
                    onClick={clear}
                    className="mt-2 text-sm text-[#c2410c] hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                    {paginated.map((peer) => (
                      <StudentCard key={peer.id} peer={peer} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="size-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce<(number | "…")[]>((acc, p, i, arr) => {
                          if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, i) =>
                          p === "…" ? (
                            <span key={`ellipsis-${i}`} className="px-1 text-sm text-slate-400">…</span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setPage(p)}
                              className={`flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                                p === page
                                  ? "border-[#c2410c] bg-[#c2410c] text-white"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {p}
                            </button>
                          )
                        )}

                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
