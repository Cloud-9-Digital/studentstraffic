import type { Metadata } from "next";
import { Suspense } from "react";

import { UniversitiesExplorer } from "@/components/site/universities-explorer";
import { finderPageSize } from "@/lib/constants";
import {
  getFinderOptions,
  queryFinderCardProgramsPage,
} from "@/lib/data/catalog";
import { buildNoIndexMetadata } from "@/lib/metadata";
import {
  hasFinderFilters,
  parseFinderFilters,
  parseFinderPage,
} from "@/lib/filters";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const raw = await searchParams;
  const filters = parseFinderFilters(raw);
  const pageParam = Array.isArray(raw.page) ? raw.page[0] : raw.page;
  const page = parseFinderPage(pageParam);

  const base: Metadata = {
    title: "MBBS Abroad Colleges for Indian Students | Fees, NMC Recognition",
    description:
      "Browse MBBS abroad colleges by country, fees, intake, teaching medium, and NMC recognition for Indian students.",
  };

  if (hasFinderFilters(filters) || page > 1) {
    return buildNoIndexMetadata(base, { canonicalPath: "/universities" });
  }

  return base;
}

export default function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<UniversitiesExplorerFallback />}>
      <UniversitiesExplorerSection searchParams={searchParams} />
    </Suspense>
  );
}

async function UniversitiesExplorerSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parseFinderFilters(raw);
  const pageParam = Array.isArray(raw.page) ? raw.page[0] : raw.page;
  const page = parseFinderPage(pageParam);

  // Fetch options immediately (fast - typically <100ms)
  const options = await getFinderOptions();

  // Start fetching results but don't await (allows streaming)
  const initialResultsPromise = queryFinderCardProgramsPage(filters, page, finderPageSize);

  // Stream results as they come
  const initialResults = await initialResultsPromise;

  return (
    <UniversitiesExplorer
      // Forces a fresh mount (and fresh internal state) whenever the
      // filters/page actually change. Without this, React reconciles the
      // existing UniversitiesExplorer instance across navigations (e.g.
      // home -> universities -> home -> universities with different
      // selections) and its useState(initialFilters)/useState(initialResults)
      // initializers never re-run, so the page keeps showing stale results
      // even though the URL and server-fetched props are correct.
      key={`${JSON.stringify(filters)}::${page}`}
      options={options}
      initialFilters={filters}
      initialResults={initialResults}
    />
  );
}

function UniversitiesExplorerFallback() {
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

      <div className="container-shell flex gap-2 py-3 lg:hidden">
        <div className="h-11 flex-1 rounded-xl bg-muted sm:h-12" />
        <div className="h-11 w-28 rounded-xl bg-muted sm:h-12" />
      </div>

      <section className="py-10 md:py-14">
        <div className="container-shell">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
            <div className="hidden lg:block">
              <div className="h-[500px] rounded-2xl bg-muted animate-pulse" />
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-44 rounded-full bg-muted animate-pulse" />
                  <div className="h-4 w-36 rounded-full bg-muted/70 animate-pulse" />
                </div>
                <div className="h-7 w-28 rounded-full bg-muted animate-pulse" />
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-64 rounded-2xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
