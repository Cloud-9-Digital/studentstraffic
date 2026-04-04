"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import type { ReviewWithUniversity } from "@/lib/university-community";
import { FilterPanel } from "./_components/filter-panel";
import { ReviewsGrid, type ReviewSort } from "./_components/reviews-grid";
import { ReviewsHero } from "./_components/reviews-hero";
import { countActiveFilters, type ReviewFilters } from "./_components/types";

export function ReviewsMasonry({ reviews }: { reviews: ReviewWithUniversity[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const sort = (searchParams.get("sort") ?? "newest") as ReviewSort;

  const filters: ReviewFilters = {
    search: searchParams.get("q") ?? "",
    country: searchParams.get("country") ?? "",
    universitySlug: searchParams.get("university") ?? "",
    type: searchParams.get("type") ?? "",
    minRating: searchParams.get("rating") ?? "",
  };

  function buildUrl(overrides: Partial<Record<string, string>>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(overrides)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const set = (key: keyof ReviewFilters, value: string) => {
    const paramKey =
      key === "universitySlug" ? "university"
      : key === "search" ? "q"
      : key === "minRating" ? "rating"
      : key;
    // Reset university when country changes
    const extra: Record<string, string> = { [paramKey]: value };
    if (key === "country") extra.university = "";
    router.replace(buildUrl(extra), { scroll: false });
  };

  const clear = () => {
    router.replace(pathname, { scroll: false });
    setSheetOpen(false);
  };

  const countries = useMemo(
    () => [...new Set(reviews.map((r) => r.countryName))].sort(),
    [reviews]
  );

  const universities = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of reviews) {
      if (!filters.country || r.countryName === filters.country) {
        seen.set(r.universitySlug, r.universityName);
      }
    }
    return [...seen.entries()]
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [reviews, filters.country]);

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    const minRating = filters.minRating ? Number(filters.minRating) : null;
    return reviews.filter((r) => {
      if (
        q &&
        !r.reviewerName.toLowerCase().includes(q) &&
        !r.universityName.toLowerCase().includes(q)
      )
        return false;
      if (filters.country && r.countryName !== filters.country) return false;
      if (filters.universitySlug && r.universitySlug !== filters.universitySlug)
        return false;
      if (filters.type && r.reviewType !== filters.type) return false;
      if (minRating !== null && (r.starRating ?? 0) < minRating) return false;
      return true;
    });
  }, [reviews, filters]);

  const activeFilterCount = countActiveFilters(filters);

  return (
    <>
      <ReviewsHero
        filters={filters}
        countries={countries}
        universities={universities}
        activeFilterCount={activeFilterCount}
        sheetOpen={sheetOpen}
        onSearch={(v) => set("search", v)}
        onSet={set}
        onClear={clear}
        onSheetOpenChange={setSheetOpen}
      />

      <section className="py-8 md:py-12 bg-slate-50 min-h-[50vh]">
        <div className="container-shell">
          <div className="lg:grid lg:grid-cols-[240px_1fr] lg:items-start lg:gap-8">
            <aside className="hidden lg:block sticky top-20">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="mb-5 text-sm font-semibold text-slate-900">
                  Filters
                </p>
                <FilterPanel
                  filters={filters}
                  countries={countries}
                  universities={universities}
                  activeCount={activeFilterCount}
                  onSet={set}
                  onClear={clear}
                />
              </div>
            </aside>

            <ReviewsGrid
              reviews={filtered}
              totalCount={reviews.length}
              activeFilterCount={activeFilterCount}
              sort={sort}
              onSortChange={(s) =>
                router.replace(
                  buildUrl({ sort: s === "newest" ? "" : s }),
                  { scroll: false }
                )
              }
              onClearFilters={clear}
            />
          </div>
        </div>
      </section>
    </>
  );
}
