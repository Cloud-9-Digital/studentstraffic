import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchResultCard } from "@/components/site/search-result-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildNoIndexMetadata } from "@/lib/metadata";
import { getCountries, getCourses } from "@/lib/data/catalog";
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
  }
);

const documentTypes = [
  { value: "", label: "All result types" },
  { value: "program", label: "Programs" },
  { value: "university", label: "Universities" },
  { value: "landing_page", label: "Landing pages" },
  { value: "country", label: "Countries" },
  { value: "course", label: "Courses" },
] as const;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [countries, courses] = await Promise.all([getCountries(), getCourses()]);

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <SectionHeading
          eyebrow="Search"
          title="Search the university catalog with filters and structured signals."
          description="This search layer is powered by a dedicated Postgres index, so it can combine keyword relevance with country, course, and licensing filters."
        />

        <Suspense
          fallback={<SearchContentFallback countries={countries} courses={courses} />}
        >
          <SearchContent
            searchParams={searchParams}
            countries={countries}
            courses={courses}
          />
        </Suspense>
      </div>
    </section>
  );
}

async function SearchContent({
  searchParams,
  countries,
  courses,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  countries: Awaited<ReturnType<typeof getCountries>>;
  courses: Awaited<ReturnType<typeof getCourses>>;
}) {
  const filters = parseSearchFilters(await searchParams);
  const results = await searchCatalog(filters);

  return (
    <>
      <form action="/search" className="surface-outline rounded-2xl p-5 md:p-6">
        <div className="field-grid md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="space-y-2">
            <Label htmlFor="q">Search query</Label>
            <Input
              id="q"
              name="q"
              defaultValue={filters.q}
              placeholder="Kazan, MBBS Russia, NMC university, fees..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              defaultValue={filters.type ?? ""}
              className="flex h-9 w-full min-w-0 rounded-xl border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              name="country"
              defaultValue={filters.country ?? ""}
              className="flex h-9 w-full min-w-0 rounded-xl border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">All countries</option>
              {countries.map((country) => (
                <option key={country.slug} value={country.slug}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <select
              id="course"
              name="course"
              defaultValue={filters.course ?? ""}
              className="flex h-9 w-full min-w-0 rounded-xl border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">All courses</option>
              {courses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button type="submit" className="ml-auto">
            Search catalog
          </Button>
        </div>
      </form>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
          <p>
            Showing <strong className="text-foreground">{results.length}</strong>{" "}
            result{results.length === 1 ? "" : "s"}.
          </p>
          <p>Search pages stay noindex while curated destination pages stay indexable.</p>
        </CardContent>
      </Card>

      <div className="soft-grid md:grid-cols-2">
        {results.length ? (
          results.map((result) => (
            <SearchResultCard
              key={`${result.documentType}:${result.sourceSlug}`}
              result={result}
            />
          ))
        ) : (
          <Card className="md:col-span-2">
            <CardContent className="py-12 text-center text-muted-foreground">
              No results matched this search yet. Try a broader query or remove one
              of the filters.
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

function SearchContentFallback({
  countries,
  courses,
}: {
  countries: Awaited<ReturnType<typeof getCountries>>;
  courses: Awaited<ReturnType<typeof getCourses>>;
}) {
  return (
    <>
      <form action="/search" className="surface-outline rounded-2xl p-5 md:p-6">
        <div className="field-grid md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="space-y-2">
            <Label htmlFor="q">Search query</Label>
            <Input
              id="q"
              name="q"
              placeholder="Kazan, MBBS Russia, NMC university, fees..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              defaultValue=""
              className="flex h-9 w-full min-w-0 rounded-xl border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              name="country"
              defaultValue=""
              className="flex h-9 w-full min-w-0 rounded-xl border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">All countries</option>
              {countries.map((country) => (
                <option key={country.slug} value={country.slug}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <select
              id="course"
              name="course"
              defaultValue=""
              className="flex h-9 w-full min-w-0 rounded-xl border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">All courses</option>
              {courses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm font-medium text-foreground">
            <input type="checkbox" name="nmc" value="true" />
            NMC eligible
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm font-medium text-foreground">
            <input type="checkbox" name="usmle" value="true" />
            USMLE eligible
          </label>
          <Button type="submit" className="ml-auto">
            Search catalog
          </Button>
        </div>
      </form>

      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Loading search results...
        </CardContent>
      </Card>
    </>
  );
}
