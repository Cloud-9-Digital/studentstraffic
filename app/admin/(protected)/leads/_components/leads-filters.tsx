"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTransition } from "react";

type Props = {
  sourcePathOptions: { value: string | null }[];
  countryOptions: { value: string | null }[];
};

export function LeadsFilters({ sourcePathOptions, countryOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const sourcePath = searchParams.get("sourcePath") || "";
  const seminarEvent = searchParams.get("seminarEvent") || "";
  const interestedCountry = searchParams.get("interestedCountry") || "";

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);

    // Reset to page 1 when filters change
    params.delete("page");

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/admin/leads?${params.toString()}`);
    });
  };

  const hasActiveFilters = search || sourcePath || seminarEvent || interestedCountry;

  const clearFilters = () => {
    startTransition(() => {
      router.push("/admin/leads");
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="space-y-4">
        {/* Search and Filters in One Row */}
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px_200px]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, father's name..."
              defaultValue={search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#0b312b] focus:ring-2 focus:ring-[#0b312b]/10"
            />
            {isPending && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="size-4 animate-spin rounded-full border-2 border-slate-200 border-t-[#0b312b]" />
              </div>
            )}
          </div>

          {/* Source Path */}
          <select
            value={sourcePath}
            onChange={(e) => updateFilters({ sourcePath: e.target.value })}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0b312b] focus:ring-2 focus:ring-[#0b312b]/10"
          >
            <option value="">All sources</option>
            {sourcePathOptions.map((opt) => (
              <option key={opt.value} value={opt.value || ""}>
                {opt.value}
              </option>
            ))}
          </select>

          {/* Seminar Event */}
          <input
            type="text"
            placeholder="Event (Chennai...)"
            defaultValue={seminarEvent}
            onChange={(e) => updateFilters({ seminarEvent: e.target.value })}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#0b312b] focus:ring-2 focus:ring-[#0b312b]/10"
          />

          {/* Country */}
          <select
            value={interestedCountry}
            onChange={(e) => updateFilters({ interestedCountry: e.target.value })}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0b312b] focus:ring-2 focus:ring-[#0b312b]/10"
          >
            <option value="">All countries</option>
            {countryOptions.map((opt) => (
              <option key={opt.value} value={opt.value || ""}>
                {opt.value}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
