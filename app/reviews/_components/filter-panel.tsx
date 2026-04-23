import { X } from "lucide-react";

import { sortCountryNames } from "@/lib/country-order";
import { FilterSelect } from "./filter-select";
import type { ReviewFilters } from "./types";

export function FilterPanel({
  filters,
  countries,
  universities,
  activeCount,
  onSet,
  onClear,
}: {
  filters: ReviewFilters;
  countries: string[];
  universities: { slug: string; name: string }[];
  activeCount: number;
  onSet: (key: keyof ReviewFilters, value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-5">
      <FilterSelect
        label="Country"
        value={filters.country}
        onChange={(v) => onSet("country", v)}
        options={sortCountryNames(countries).map((c) => ({ value: c, label: c }))}
        placeholder="All countries"
      />
      <FilterSelect
        label="University"
        value={filters.universitySlug}
        onChange={(v) => onSet("universitySlug", v)}
        options={universities.map((u) => ({ value: u.slug, label: u.name }))}
        placeholder="All universities"
      />
      <FilterSelect
        label="Review type"
        value={filters.type}
        onChange={(v) => onSet("type", v)}
        options={[
          { value: "youtube_video", label: "Video reviews" },
          { value: "text", label: "Written reviews" },
        ]}
        placeholder="All types"
      />
      <FilterSelect
        label="Min. star rating"
        value={filters.minRating}
        onChange={(v) => onSet("minRating", v)}
        options={[
          { value: "5", label: "5 stars" },
          { value: "4", label: "4+ stars" },
          { value: "3", label: "3+ stars" },
        ]}
        placeholder="Any rating"
      />
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
