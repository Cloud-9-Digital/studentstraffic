import type { Metadata } from "next";
import Link from "next/link";
import { X } from "lucide-react";

import { SearchResultCard } from "@/components/site/search-result-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildNoIndexMetadata } from "@/lib/metadata";
import type { SearchDocumentType } from "@/lib/data/types";
import { parseSearchFilters } from "@/lib/search/filters";
import { searchCatalog } from "@/lib/search/search";

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
}> = [
  { type: "university", title: "Universities" },
  { type: "program", title: "Programs" },
  { type: "landing_page", title: "Guides" },
  { type: "country", title: "Countries" },
  { type: "course", title: "Courses" },
];

function buildQueryHref(query: string) {
  const params = new URLSearchParams();
  params.set("q", query);
  return `/search?${params.toString()}`;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseSearchFilters(await searchParams);
  const hasQuery = Boolean(filters.q);
  const results = hasQuery ? await searchCatalog({ q: filters.q }) : [];

  const resultsByType = new Map<SearchDocumentType, typeof results>();

  for (const section of resultSections) {
    resultsByType.set(
      section.type,
      results.filter((result) => result.documentType === section.type),
    );
  }

  return (
    <section className="section-space">
      <div className="container-shell max-w-6xl space-y-6">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
            Search
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Search universities, countries, courses, and guides.
          </p>
        </div>

        <form action="/search" className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <Label htmlFor="q" className="sr-only">
              Search query
            </Label>
            <div className="relative">
              <Input
                id="q"
                name="q"
                defaultValue={filters.q}
                placeholder="Search a university, country, course, city, fee term..."
                className="h-12 pr-12 text-base md:text-base"
              />
              {hasQuery ? (
                <Link
                  href="/search"
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-2 inline-flex items-center justify-center rounded-full px-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </Link>
              ) : null}
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            variant="accent"
            className="w-full lg:w-auto"
          >
            Search
          </Button>
        </form>

        {hasQuery ? (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{results.length}</span>{" "}
              result{results.length === 1 ? "" : "s"} for "{filters.q}"
            </p>

            {results.length ? (
              <div className="space-y-8">
                {resultSections.map((section) => {
                  const sectionResults = resultsByType.get(section.type) ?? [];

                  if (!sectionResults.length) {
                    return null;
                  }

                  return (
                    <div key={section.type} className="space-y-4">
                      <div>
                        <h2 className="font-display text-2xl font-semibold tracking-tight text-heading">
                          {section.title}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {sectionResults.length} result
                          {sectionResults.length === 1 ? "" : "s"}
                        </p>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
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
              <div className="space-y-3 py-2">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-heading">
                  No results
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  Try another university name, country, course, or broader phrase.
                </p>
                <div className="space-y-2">
                  {suggestedQueries.map((query) => (
                    <Link
                      key={query}
                      href={buildQueryHref(query)}
                      className="block text-sm font-medium text-primary hover:underline"
                    >
                      {query}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 py-2">
            <p className="text-sm leading-7 text-muted-foreground">
              Search is mainly for direct lookup. Try a university name, country,
              course, city, or fee keyword.
            </p>
            <div className="space-y-2">
              {suggestedQueries.map((query) => (
                <Link
                  key={query}
                  href={buildQueryHref(query)}
                  className="block text-sm font-medium text-primary hover:underline"
                >
                  {query}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
