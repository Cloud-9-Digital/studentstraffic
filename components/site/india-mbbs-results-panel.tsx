"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { IndiaMbbsCardView } from "@/components/site/india-mbbs-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { IndiaMbbsFilters, IndiaMbbsPage, IndiaMbbsSort } from "@/lib/data/types";
import { buildIndiaMbbsUrl, getIndiaMbbsSort } from "@/lib/india-mbbs-filters";

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

const sortOptions: { value: IndiaMbbsSort; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "name_asc", label: "College name: A to Z" },
  { value: "seats_desc", label: "Seats: High to Low" },
  { value: "year_desc", label: "Newest first" },
];

type IndiaMbbsResultsPanelProps = {
  filters: IndiaMbbsFilters;
  results: IndiaMbbsPage;
  isLoading: boolean;
  errorMessage?: string;
  currentSort?: IndiaMbbsSort;
  onPageChange: (page: number) => void;
  onSortChange: (sort: IndiaMbbsSort) => void;
  onRetry: () => void;
  onClearFilters: () => void;
};

export function IndiaMbbsResultsPanel({
  filters,
  results,
  isLoading,
  errorMessage,
  currentSort,
  onPageChange,
  onSortChange,
  onRetry,
  onClearFilters,
}: IndiaMbbsResultsPanelProps) {
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
  const selectedSort = getIndiaMbbsSort(currentSort);

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm leading-none font-semibold text-heading">
            {results.totalItems.toLocaleString()} colleges
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <label
            htmlFor="india-mbbs-sort"
            className="whitespace-nowrap text-sm leading-none font-medium text-muted-foreground"
          >
            Sort by
          </label>
          <div className="relative">
            <select
              id="india-mbbs-sort"
              value={selectedSort}
              onChange={(event) =>
                onSortChange(event.target.value as IndiaMbbsSort)
              }
              disabled={isLoading}
              className="h-8 min-w-[164px] appearance-none rounded-lg border border-border/80 bg-card px-3 pr-8 text-sm font-medium text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {errorMessage ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-base font-medium text-foreground">
              We couldn&apos;t refresh the India college results
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
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-44 rounded-[28px] bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : results.colleges.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {results.colleges.map((college) => (
            <IndiaMbbsCardView key={college.slug} college={college} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-base font-medium text-foreground">
              No Indian MBBS colleges matched
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try removing a filter or searching with a shorter name.
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

      {!isLoading && results.totalPages > 1 ? (
        <>
          <p className="text-center text-sm text-muted-foreground">
            Showing {firstResult}-{lastResult} of{" "}
            {results.totalItems.toLocaleString()}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={
                    results.hasPreviousPage
                      ? buildIndiaMbbsUrl(filters, results.currentPage - 1)
                      : undefined
                  }
                  disabled={!results.hasPreviousPage}
                  onClick={(event) => {
                    if (!results.hasPreviousPage) return;
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
                      href={buildIndiaMbbsUrl(filters, pageNumber)}
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
                      ? buildIndiaMbbsUrl(filters, results.currentPage + 1)
                      : undefined
                  }
                  disabled={!results.hasNextPage}
                  onClick={(event) => {
                    if (!results.hasNextPage) return;
                    event.preventDefault();
                    onPageChange(results.currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : null}
    </div>
  );
}
