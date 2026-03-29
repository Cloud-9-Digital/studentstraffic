"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";

import { UniversityCard } from "@/components/site/university-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getFinderSort } from "@/lib/filters";
import { buildFinderUrl } from "@/lib/filters";
import type {
  FinderFilters,
  FinderProgramsPage,
  FinderSort,
} from "@/lib/data/types";

const finderSortOptions: { value: FinderSort; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "tuition_asc", label: "Fees: Low to High" },
  { value: "tuition_desc", label: "Fees: High to Low" },
  { value: "name_asc", label: "University: A to Z" },
];

type UniversitiesResultsPanelProps = {
  filters: FinderFilters;
  results: FinderProgramsPage;
  isLoading: boolean;
  errorMessage?: string;
  currentSort?: FinderSort;
  onPageChange: (page: number) => void;
  onSortChange: (sort: FinderSort) => void;
  onClearFilters: () => void;
  onRetry: () => void;
};

function createPageNumbers(totalPages: number, currentPage: number) {
  const pageNumbers: (number | "ellipsis")[] = [];

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page += 1) {
      pageNumbers.push(page);
    }

    return pageNumbers;
  }

  const nearbyPages = new Set(
    [1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter(
      (page) => page >= 1 && page <= totalPages,
    ),
  );

  let previousPage = 0;
  for (const page of [...nearbyPages].sort((left, right) => left - right)) {
    if (previousPage && page - previousPage > 1) {
      pageNumbers.push("ellipsis");
    }

    pageNumbers.push(page);
    previousPage = page;
  }

  return pageNumbers;
}

export function UniversitiesResultsPanel({
  filters,
  results,
  isLoading,
  errorMessage,
  currentSort,
  onPageChange,
  onSortChange,
  onClearFilters,
  onRetry,
}: UniversitiesResultsPanelProps) {
  const pageNumbers = useMemo(
    () => createPageNumbers(results.totalPages, results.currentPage),
    [results.currentPage, results.totalPages],
  );
  const firstResult =
    results.totalItems === 0
      ? 0
      : (results.currentPage - 1) * results.pageSize + 1;
  const lastResult =
    results.totalItems === 0
      ? 0
      : Math.min(results.currentPage * results.pageSize, results.totalItems);
  const selectedSort = getFinderSort(currentSort);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-heading">
            {results.totalItems.toLocaleString()} universities matched
          </p>
          <p className="text-sm text-muted-foreground">
            Showing {firstResult}-{lastResult} of{" "}
            {results.totalItems.toLocaleString()}
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-end justify-end gap-2">
          {isLoading && (
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              Updating results…
            </span>
          )}
          <div className="flex flex-col items-start gap-1">
            <label
              htmlFor="finder-sort"
              className="text-xs font-medium text-muted-foreground"
            >
              Sort by
            </label>
            <div className="relative">
              <select
                id="finder-sort"
                value={selectedSort}
                onChange={(event) =>
                  onSortChange(event.target.value as FinderSort)
                }
                className="h-9 min-w-[154px] appearance-none rounded-lg border border-border bg-card px-3 py-2 pr-8 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {finderSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-base font-medium text-foreground">
              We couldn&apos;t refresh the results right now
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
            >
              Try again
            </button>
          </CardContent>
        </Card>
      )}

      {results.programs.length ? (
        <>
          <h2 className="sr-only">University results</h2>
          <div className="relative" aria-busy={isLoading}>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {results.programs.map((program, index) => (
                <UniversityCard
                  key={program.offering.slug}
                  program={program}
                  imagePriority={index < 2}
                />
              ))}
            </div>
            {isLoading && (
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-background/45 backdrop-blur-[1px]" />
            )}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-base font-medium text-foreground">
              No programs matched
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try widening the fee range or removing a filter.
            </p>
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-4 inline-block text-sm font-medium text-accent underline underline-offset-2 hover:text-accent-strong"
            >
              Clear all filters
            </button>
          </CardContent>
        </Card>
      )}

      {results.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  results.hasPreviousPage
                    ? buildFinderUrl(filters, results.currentPage - 1)
                    : undefined
                }
                disabled={!results.hasPreviousPage}
                onClick={(event) => {
                  if (!results.hasPreviousPage) {
                    return;
                  }

                  event.preventDefault();
                  onPageChange(results.currentPage - 1);
                }}
              />
            </PaginationItem>

            {pageNumbers.map((pageNumber, index) =>
              pageNumber === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href={buildFinderUrl(filters, pageNumber)}
                    isActive={pageNumber === results.currentPage}
                    onClick={(event) => {
                      event.preventDefault();
                      onPageChange(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href={
                  results.hasNextPage
                    ? buildFinderUrl(filters, results.currentPage + 1)
                    : undefined
                }
                disabled={!results.hasNextPage}
                onClick={(event) => {
                  if (!results.hasNextPage) {
                    return;
                  }

                  event.preventDefault();
                  onPageChange(results.currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
