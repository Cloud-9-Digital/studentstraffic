import type { Metadata } from "next";
import Link from "next/link";
import {
  X,
  Search as SearchIcon,
  BookOpen,
  GraduationCap,
  Globe,
  FileText,
  Building2,
  Lightbulb,
} from "lucide-react";

import { SearchResultCard } from "@/components/site/search-result-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildNoIndexMetadata } from "@/lib/metadata";
import type { SearchDocumentType } from "@/lib/data/types";
import { parseSearchFilters } from "@/lib/search/filters";
import { searchCatalogResultSet } from "@/lib/search/search";

export const metadata: Metadata = buildNoIndexMetadata(
  {
    title: "Search",
    description:
      "Search universities, programs, countries, and curated pages across the Students Traffic catalog.",
  },
  {
    canonicalPath: "/search",
  },
);

const suggestedQueries = [
  "MBBS in Russia",
  "Vietnam fees",
  "Nursing abroad",
  "Georgia universities",
  "Medical PG",
  "NMC university",
] as const;

const resultSections: Array<{
  type: SearchDocumentType;
  title: string;
  icon: typeof GraduationCap;
}> = [
  { type: "university", title: "Universities", icon: Building2 },
  { type: "program", title: "Programs", icon: GraduationCap },
  { type: "landing_page", title: "Guides", icon: BookOpen },
  { type: "blog_post", title: "Articles", icon: FileText },
  { type: "india_college", title: "India Colleges", icon: Building2 },
  { type: "country", title: "Countries", icon: Globe },
  { type: "course", title: "Courses", icon: Lightbulb },
];

function buildQueryHref(query: string) {
  const params = new URLSearchParams();
  params.set("q", query);
  return `/search?${params.toString()}`;
}

function logSearchTelemetry({
  queryLength,
  resultCount,
  latencyMs,
  cacheStatus,
}: {
  queryLength: number;
  resultCount: number;
  latencyMs: number;
  cacheStatus: "hit" | "miss";
}) {
  const shouldAlwaysLog = cacheStatus === "miss" || latencyMs >= 500;
  const shouldSample = Math.random() < 0.1;

  if (!shouldAlwaysLog && !shouldSample) {
    return;
  }

  console.info(
    "[search-observability]",
    JSON.stringify({
      route: "search",
      queryLength,
      resultCount,
      latencyMs,
      cacheStatus,
    }),
  );
}

function getMonotonicTimeMs() {
  return Number(process.hrtime.bigint() / BigInt(1_000_000));
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseSearchFilters(await searchParams);
  const hasQuery = Boolean(filters.q);
  const searchStartedAt = getMonotonicTimeMs();
  const searchResultSet = hasQuery
    ? await searchCatalogResultSet({ q: filters.q })
    : null;
  const results = searchResultSet?.results ?? [];

  if (hasQuery && searchResultSet && filters.q) {
    const latencyMs = getMonotonicTimeMs() - searchStartedAt;
    logSearchTelemetry({
      queryLength: filters.q.length,
      resultCount: results.length,
      latencyMs,
      cacheStatus:
        searchResultSet.generatedAtMs >= searchStartedAt ? "miss" : "hit",
    });
  }

  const resultsByType = new Map<SearchDocumentType, typeof results>();

  for (const section of resultSections) {
    resultsByType.set(
      section.type,
      results.filter((result) => result.documentType === section.type),
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Search Section */}
      <section className="border-b border-border/40 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-shell max-w-6xl px-4 pb-8 pt-8 md:px-6 md:pb-12 md:pt-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary md:size-16">
                <SearchIcon className="size-7 md:size-8" />
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-heading md:text-4xl lg:text-5xl">
                Find Your Perfect Path
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                Discover universities, programs, and guides across the globe
              </p>
            </div>

            <form action="/search" className="space-y-3">
              <Label htmlFor="q" className="sr-only">
                Search query
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 md:pl-5">
                  <SearchIcon className="size-5 text-muted-foreground" />
                </div>
                <Input
                  id="q"
                  name="q"
                  defaultValue={filters.q}
                  placeholder="Search universities, countries, courses..."
                  className="h-14 rounded-2xl border-border/60 bg-background pl-12 pr-12 text-base shadow-sm transition-all focus:border-primary/40 focus:shadow-md md:h-16 md:pl-14 md:text-lg"
                  autoFocus={!hasQuery}
                />
                {hasQuery ? (
                  <Link
                    href="/search"
                    aria-label="Clear search"
                    className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-2xl px-4 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="size-5" />
                  </Link>
                ) : null}
              </div>
              <Button
                type="submit"
                size="lg"
                variant="accent"
                className="h-12 w-full rounded-xl text-base font-semibold shadow-sm md:h-14 md:text-lg"
              >
                Search Now
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="section-space">
        <div className="container-shell max-w-6xl px-4 md:px-6">
          {hasQuery ? (
            <div className="space-y-8">
              {/* Results Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {results.length}
                    </span>{" "}
                    result{results.length === 1 ? "" : "s"} found
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/75">
                    Searching for &quot;{filters.q}&quot;
                  </p>
                </div>
              </div>

              {results.length ? (
                <div className="space-y-10 md:space-y-12">
                  {resultSections.map((section) => {
                    const sectionResults = resultsByType.get(section.type) ?? [];

                    if (!sectionResults.length) {
                      return null;
                    }

                    const Icon = section.icon;

                    return (
                      <div key={section.type} className="space-y-5">
                        <div className="flex items-center gap-3">
                          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="size-5" />
                          </div>
                          <div>
                            <h2 className="font-display text-xl font-semibold tracking-tight text-heading md:text-2xl">
                              {section.title}
                            </h2>
                            <p className="text-xs text-muted-foreground md:text-sm">
                              {sectionResults.length} result
                              {sectionResults.length === 1 ? "" : "s"}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
                          {sectionResults.map((result) => (
                            <SearchResultCard
                              key={`${result.documentType}:${result.sourceSlug}`}
                              result={result}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mx-auto max-w-2xl space-y-6 py-8 text-center md:py-12">
                  <div className="mx-auto inline-flex size-20 items-center justify-center rounded-3xl bg-muted/50">
                    <SearchIcon className="size-10 text-muted-foreground/50" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-heading md:text-3xl">
                      No Results Found
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                      We couldn&apos;t find anything matching &quot;{filters.q}&quot;.
                      Try a different search term or explore our popular searches below.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
                    {suggestedQueries.map((query) => (
                      <Link
                        key={query}
                        href={buildQueryHref(query)}
                        className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                      >
                        <span className="text-sm font-medium text-foreground group-hover:text-primary">
                          {query}
                        </span>
                        <SearchIcon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-8 py-4 md:py-8">
              <div className="text-center">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-heading md:text-3xl">
                  Popular Searches
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Not sure where to start? Try one of these popular searches
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
                {suggestedQueries.map((query) => (
                  <Link
                    key={query}
                    href={buildQueryHref(query)}
                    className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md md:p-6"
                  >
                    <span className="text-base font-medium text-foreground group-hover:text-primary md:text-lg">
                      {query}
                    </span>
                    <SearchIcon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
