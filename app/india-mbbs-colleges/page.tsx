import type { Metadata } from "next";
import { Suspense } from "react";

import { JsonLd } from "@/components/shared/json-ld";
import { IndiaMbbsExplorer } from "@/components/site/india-mbbs-explorer";
import { buildIndexableMetadata, buildNoIndexMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getCountryStructuredDataId,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import {
  getIndiaMbbsFilterOptions,
  queryIndiaMbbsCollegesPage,
} from "@/lib/data/india-mbbs";
import {
  hasIndiaMbbsFilters,
  parseIndiaMbbsFilters,
  parseIndiaMbbsPage,
} from "@/lib/india-mbbs-filters";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const raw = await searchParams;
  const filters = parseIndiaMbbsFilters(raw);
  const pageParam = Array.isArray(raw.page) ? raw.page[0] : raw.page;
  const page = parseIndiaMbbsPage(pageParam);

  const base = buildIndexableMetadata({
    title: "MBBS Colleges in India 2026: Government & Private",
    description:
      "Find government and private MBBS colleges in India by state, management type and annual seats, using National Medical Commission (NMC) data.",
    path: "/india-mbbs-colleges",
    keywords: [
      "India MBBS colleges",
      "government medical colleges in India",
      "private medical colleges in India",
      "MBBS colleges by state",
      "NMC MBBS colleges",
      "MBBS colleges 2026",
      "medical colleges in India list",
    ],
  });

  if (hasIndiaMbbsFilters(filters) || page > 1) {
    return buildNoIndexMetadata(base, { canonicalPath: "/india-mbbs-colleges" });
  }

  return base;
}

export default function IndiaMbbsCollegesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <>
      <Suspense fallback={<IndiaMbbsFallback />}>
        <IndiaMbbsExplorerSection searchParams={searchParams} />
      </Suspense>
      {/* Outside the Suspense boundary so the graph is in the static shell. */}
      <JsonLd
        data={getStructuredDataGraph([
          getBreadcrumbStructuredData([
            { name: "Home", path: "/" },
            { name: "India MBBS colleges", path: "/india-mbbs-colleges" },
          ]),
          getCollectionPageStructuredData({
            path: "/india-mbbs-colleges",
            name: "MBBS colleges in India",
            description:
              "Government and private MBBS colleges in India by state, management type and seats, using NMC-sourced data.",
            aboutIds: [getCountryStructuredDataId("india")],
          }),
        ])}
      />
    </>
  );
}

async function IndiaMbbsExplorerSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parseIndiaMbbsFilters(raw);
  const pageParam = Array.isArray(raw.page) ? raw.page[0] : raw.page;
  const page = parseIndiaMbbsPage(pageParam);
  const [options, initialResults] = await Promise.all([
    getIndiaMbbsFilterOptions(),
    queryIndiaMbbsCollegesPage(filters, page, 12),
  ]);

  return (
    <IndiaMbbsExplorer
      options={options}
      initialFilters={filters}
      initialResults={initialResults}
    />
  );
}

function IndiaMbbsFallback() {
  return (
    <>
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />

        <div className="container-shell relative py-10 pb-8 md:py-16 md:pb-10">
          <div className="mb-7 space-y-3 text-center md:mb-9">
            <p aria-hidden="true" className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl">
              Browse MBBS colleges in India
            </p>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-white/60 md:text-base md:leading-7">
              Filter MBBS colleges by state, management type, seats,
              and college name.
            </p>
          </div>

          <div className="flex gap-2 lg:hidden">
            <div className="h-12 w-48 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>

      <section className="py-10 md:py-14">
        <div className="container-shell">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
            <div className="hidden lg:block">
              <div className="h-[420px] rounded-2xl bg-muted animate-pulse" />
            </div>

            <div className="space-y-6">
              <div className="h-5 w-48 rounded-full bg-muted animate-pulse" />
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-44 rounded-[28px] bg-muted animate-pulse"
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
