"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FinderFilterForm,
  type FinderFilterChangeOptions,
} from "@/components/site/finder-filter-form";
import { UniversitiesResultsPanel } from "@/components/site/universities-results-panel";
import type {
  FinderCardProgramsPage,
  FinderFilters,
  FinderOptions,
  FinderSort,
} from "@/lib/data/types";
import {
  buildFinderUrl,
  createFinderSearchParams,
  normalizeFinderFilters,
  parseFinderFilters,
  parseFinderPage,
} from "@/lib/filters";

type UniversitiesExplorerProps = {
  options: FinderOptions;
  initialFilters: FinderFilters;
  initialResults: FinderCardProgramsPage;
};

type LoadOptions = {
  history?: "replace" | "push" | "none";
};

function getResultsCacheKey(filters: FinderFilters, page: number) {
  const query = createFinderSearchParams(filters, page).toString();
  return query || "__finder_root__";
}

function getFinderApiUrl(filters: FinderFilters, page: number) {
  const query = createFinderSearchParams(filters, page).toString();
  return `/api/finder${query ? `?${query}` : ""}`;
}

export function UniversitiesExplorer({
  options,
  initialFilters,
  initialResults,
}: UniversitiesExplorerProps) {
  const normalizedInitialFilters = normalizeFinderFilters(initialFilters);
  const [filters, setFilters] = useState(normalizedInitialFilters);
  const [results, setResults] = useState<FinderCardProgramsPage>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const abortRef = useRef<AbortController | null>(null);
  const resultsSectionRef = useRef<HTMLElement | null>(null);
  const cacheRef = useRef(
    new Map<string, FinderCardProgramsPage>([
      [
        getResultsCacheKey(
          normalizedInitialFilters,
          initialResults.currentPage,
        ),
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
      nextFilters: FinderFilters,
      page: number,
      options: LoadOptions = {},
    ) => {
      const normalizedFilters = normalizeFinderFilters(nextFilters);
      const nextPage = Math.max(page, 1);
      const requestKey = getResultsCacheKey(normalizedFilters, nextPage);
      const historyMode = options.history ?? "replace";

      requestRef.current = {
        filters: normalizedFilters,
        page: nextPage,
      };

      if (historyMode !== "none") {
        const nextUrl = buildFinderUrl(normalizedFilters, nextPage);
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
        const response = await fetch(getFinderApiUrl(normalizedFilters, nextPage), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("The universities catalogue could not be refreshed.");
        }

        const nextResults = (await response.json()) as FinderCardProgramsPage;

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
            : "The universities catalogue could not be refreshed.",
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
    (nextFilters: FinderFilters, options?: FinderFilterChangeOptions) => {
      void loadResults(nextFilters, 1, {
        history: options?.history ?? "replace",
      });
    },
    [loadResults],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page === results.currentPage) {
        return;
      }

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
    void loadResults(
      { q: filters.q, sort: filters.sort },
      1,
      { history: "replace" },
    );
  }, [filters.q, filters.sort, loadResults]);

  const handleSortChange = useCallback(
    (sort: FinderSort) => {
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
      const nextFilters = parseFinderFilters(params);
      const nextPage = parseFinderPage(params.get("page") ?? undefined);

      void loadResults(nextFilters, nextPage, { history: "none" });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      abortRef.current?.abort();
    };
  }, [loadResults]);

  useEffect(() => {
    if (isLoading || errorMessage || !results.hasNextPage) {
      return;
    }

    const nextPage = results.currentPage + 1;
    const requestKey = getResultsCacheKey(filters, nextPage);
    if (cacheRef.current.has(requestKey)) {
      return;
    }

    const controller = new AbortController();

    void fetch(getFinderApiUrl(filters, nextPage), {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to prefetch finder results");
        }

        return response.json() as Promise<FinderCardProgramsPage>;
      })
      .then((nextResults) => {
        cacheRef.current.set(requestKey, nextResults);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [
    errorMessage,
    filters,
    isLoading,
    results.currentPage,
    results.hasNextPage,
  ]);

  return (
    <>
      <div className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#7ccfbf]/30 to-[#d95f38]/40" />

        <div className="container-shell relative py-3 md:py-4">
          <h1 className="whitespace-nowrap text-center font-display text-[clamp(1.65rem,7.5vw,2.5rem)] font-bold tracking-tight text-white">
            Browse universities
          </h1>
        </div>
      </div>

      <div className="container-shell py-3 lg:hidden">
        <FinderFilterForm
          countries={options.countries}
          cities={options.cities}
          levels={options.levels}
          courses={options.courses}
          mediums={options.mediums}
          intakes={options.intakes}
          filters={filters}
          heroMode
          onFiltersChange={handleFiltersChange}
        />
      </div>

      <section
        ref={resultsSectionRef}
        className="scroll-mt-20 pt-6 pb-10 md:scroll-mt-24 md:pt-10 md:pb-14"
      >
        <div className="container-shell space-y-8 md:space-y-10">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
            <aside className="hidden lg:block lg:sticky lg:top-20">
              <FinderFilterForm
                countries={options.countries}
                cities={options.cities}
                levels={options.levels}
                courses={options.courses}
                mediums={options.mediums}
                intakes={options.intakes}
                filters={filters}
                sidebarMode
                onFiltersChange={handleFiltersChange}
              />
            </aside>

            <UniversitiesResultsPanel
              filters={filters}
              results={results}
              isLoading={isLoading}
              errorMessage={errorMessage}
              currentSort={filters.sort}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              onClearFilters={handleClearFilters}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </section>
    </>
  );
}
