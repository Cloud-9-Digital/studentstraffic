"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { IndiaMbbsFilterForm } from "@/components/site/india-mbbs-filter-form";
import { IndiaMbbsResultsPanel } from "@/components/site/india-mbbs-results-panel";
import type {
  IndiaMbbsFilters,
  IndiaMbbsOptions,
  IndiaMbbsPage,
} from "@/lib/data/types";
import {
  buildIndiaMbbsUrl,
  createIndiaMbbsSearchParams,
  normalizeIndiaMbbsFilters,
  parseIndiaMbbsFilters,
  parseIndiaMbbsPage,
} from "@/lib/india-mbbs-filters";

type IndiaMbbsExplorerProps = {
  options: IndiaMbbsOptions & { totalColleges: number };
  initialFilters: IndiaMbbsFilters;
  initialResults: IndiaMbbsPage;
};

function getResultsCacheKey(filters: IndiaMbbsFilters, page: number) {
  const query = createIndiaMbbsSearchParams(filters, page).toString();
  return query || "__india_mbbs_root__";
}

function getApiUrl(filters: IndiaMbbsFilters, page: number) {
  const query = createIndiaMbbsSearchParams(filters, page).toString();
  return `/api/india-mbbs-finder${query ? `?${query}` : ""}`;
}

export function IndiaMbbsExplorer({
  options,
  initialFilters,
  initialResults,
}: IndiaMbbsExplorerProps) {
  const normalizedInitialFilters = normalizeIndiaMbbsFilters(initialFilters);
  const [filters, setFilters] = useState(normalizedInitialFilters);
  const [results, setResults] = useState<IndiaMbbsPage>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const abortRef = useRef<AbortController | null>(null);
  const resultsSectionRef = useRef<HTMLElement | null>(null);
  const cacheRef = useRef(
    new Map<string, IndiaMbbsPage>([
      [
        getResultsCacheKey(normalizedInitialFilters, initialResults.currentPage),
        initialResults,
      ],
    ]),
  );
  const requestRef = useRef({
    filters: normalizedInitialFilters,
    page: initialResults.currentPage,
  });

  const loadResults = useCallback(
    async (
      nextFilters: IndiaMbbsFilters,
      page: number,
      options: { history?: "replace" | "push" | "none" } = {},
    ) => {
      const normalizedFilters = normalizeIndiaMbbsFilters(nextFilters);
      const nextPage = Math.max(page, 1);
      const requestKey = getResultsCacheKey(normalizedFilters, nextPage);
      const historyMode = options.history ?? "replace";

      requestRef.current = {
        filters: normalizedFilters,
        page: nextPage,
      };

      if (historyMode !== "none") {
        const nextUrl = buildIndiaMbbsUrl(normalizedFilters, nextPage);
        const currentUrl = `${window.location.pathname}${window.location.search}`;

        if (nextUrl !== currentUrl) {
          window.history[historyMode === "push" ? "pushState" : "replaceState"](
            null,
            "",
            nextUrl,
          );
        }
      }

      startTransition(() => {
        setFilters(normalizedFilters);
        setErrorMessage(undefined);
      });

      abortRef.current?.abort();
      abortRef.current = null;

      const cachedResults = cacheRef.current.get(requestKey);
      if (cachedResults) {
        startTransition(() => {
          setResults(cachedResults);
        });
        setIsLoading(false);
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setIsLoading(true);

      try {
        const response = await fetch(getApiUrl(normalizedFilters, nextPage), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("The Indian colleges catalogue could not be refreshed.");
        }

        const nextResults = (await response.json()) as IndiaMbbsPage;
        cacheRef.current.set(requestKey, nextResults);
        startTransition(() => {
          setResults(nextResults);
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "The Indian colleges catalogue could not be refreshed.",
        );
      } finally {
        if (!controller.signal.aborted) {
          if (abortRef.current === controller) {
            abortRef.current = null;
          }
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const handleFiltersChange = useCallback(
    (nextFilters: IndiaMbbsFilters) => {
      void loadResults(nextFilters, 1, { history: "replace" });
    },
    [loadResults],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page === results.currentPage) return;

      resultsSectionRef.current?.scrollIntoView({
        block: "start",
        behavior: "auto",
      });

      void loadResults(filters, page, { history: "push" });
    },
    [filters, loadResults, results.currentPage],
  );

  const handleRetry = useCallback(() => {
    void loadResults(requestRef.current.filters, requestRef.current.page, {
      history: "none",
    });
  }, [loadResults]);

  const handleClearFilters = useCallback(() => {
    void loadResults({ q: filters.q, course: filters.course, sort: filters.sort }, 1, {
      history: "replace",
    });
  }, [filters.q, filters.course, filters.sort, loadResults]);

  const handleSortChange = useCallback(
    (sort: IndiaMbbsFilters["sort"]) => {
      void loadResults(
        {
          ...filters,
          sort: sort === "recommended" ? undefined : sort,
        },
        1,
        { history: "replace" },
      );
    },
    [filters, loadResults],
  );

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextFilters = parseIndiaMbbsFilters(params);
      const nextPage = parseIndiaMbbsPage(params.get("page") ?? undefined);
      void loadResults(nextFilters, nextPage, { history: "none" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      abortRef.current?.abort();
    };
  }, [loadResults]);

  return (
    <>
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
        <div className="hero-grid-lines absolute inset-0 pointer-events-none" />
        <div
          className="hero-orb hero-orb--warm pointer-events-none absolute -right-16 -top-20 size-96 opacity-40"
          aria-hidden
        />
        <div
          className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-10 left-10 size-72 opacity-60"
          aria-hidden
        />

        <div className="container-shell relative py-10 pb-8 md:py-16 md:pb-10">
          <div className="mb-7 space-y-3 text-center md:mb-9">
            <h1 className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl">
              Browse MBBS colleges in India
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-white/60 md:text-base md:leading-7">
              Explore NMC-listed MBBS colleges by state, management type,
              seats, and college name.
            </p>
          </div>

          <div className="lg:hidden">
            <IndiaMbbsFilterForm
              options={options}
              filters={filters}
              heroMode
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </div>
      </div>

      <section
        ref={resultsSectionRef}
        className="scroll-mt-20 pt-6 pb-10 md:scroll-mt-24 md:pt-10 md:pb-14"
      >
        <div className="container-shell space-y-8 md:space-y-10">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
            <aside className="hidden lg:block lg:sticky lg:top-20">
              <IndiaMbbsFilterForm
                options={options}
                filters={filters}
                sidebarMode
                onFiltersChange={handleFiltersChange}
              />
            </aside>

            <div className="space-y-6">
              <IndiaMbbsResultsPanel
                filters={filters}
                results={results}
                isLoading={isLoading}
                errorMessage={errorMessage}
                currentSort={filters.sort}
                onPageChange={handlePageChange}
                onSortChange={handleSortChange}
                onRetry={handleRetry}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
