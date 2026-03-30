import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, FileSearch } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { WdomsDirectorySection } from "@/components/site/wdoms-directory-section";
import { catalogReviewedAt } from "@/lib/content-governance";
import { getWdomsDirectoryEntries } from "@/lib/data/catalog";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getWdomsCountryConfig, wdomsCountryConfigs } from "@/lib/wdoms";

type RouteParams = {
  countrySlug: string;
};

function getStandaloneWdomsConfigs() {
  return wdomsCountryConfigs.filter((config) => !config.landingPageSlug);
}

export async function generateStaticParams() {
  return getStandaloneWdomsConfigs().map((config) => ({
    countrySlug: config.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { countrySlug } = await params;
  const config = getWdomsCountryConfig(countrySlug);

  if (!config || config.landingPageSlug) {
    return { title: "WDOMS Directory Not Found" };
  }

  return buildIndexableMetadata({
    title: `Medical Schools in ${config.displayName} Listed on WDOMS | Students Traffic`,
    description: `Browse the official WDOMS directory view for medical schools in ${config.displayName}, with Students Traffic guide links shown where detailed university coverage exists.`,
    path: `/wdoms/${config.slug}`,
    keywords: [
      `${config.displayName} medical schools`,
      `${config.displayName} WDOMS`,
      `medical universities in ${config.displayName}`,
      `World Directory of Medical Schools ${config.displayName}`,
    ],
  });
}

export default async function WdomsCountryDirectoryPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { countrySlug } = await params;
  const config = getWdomsCountryConfig(countrySlug);

  if (!config || config.landingPageSlug) {
    notFound();
  }

  const entries = await getWdomsDirectoryEntries(config.slug);

  if (entries.length === 0) {
    notFound();
  }

  const path = `/wdoms/${config.slug}`;
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      {
        name: `Medical Schools in ${config.displayName}`,
        path,
      },
    ]),
    getCollectionPageStructuredData({
      path,
      name: `Medical schools in ${config.displayName} listed on WDOMS`,
      description: `Official WDOMS directory coverage for medical schools in ${config.displayName}.`,
      datePublished: catalogReviewedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />

      <section className="bg-surface-dark py-12 md:py-16">
        <div className="container-shell">
          <nav
            className="mb-8 flex items-center gap-1.5 text-xs text-white/40"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white/65">
              Home
            </Link>
            <ChevronRight className="size-3 shrink-0" />
            <Link href="/guides" className="transition-colors hover:text-white/65">
              Guides
            </Link>
            <ChevronRight className="size-3 shrink-0" />
            <span className="text-white/55">{config.displayName} WDOMS directory</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              <FileSearch className="size-3.5" />
              Official directory view
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Medical schools in {config.displayName} listed on WDOMS
            </h1>
            <p className="mt-5 text-base leading-8 text-white/65">
              This page publishes the official WDOMS directory view for{" "}
              {config.displayName}. We use it to cover the full landscape
              without creating thin university pages, then add detailed Students
              Traffic guides only where we have stronger admissions, fee, and
              student-planning context.
            </p>
          </div>
        </div>
      </section>

      <WdomsDirectorySection
        entries={entries}
        countryName={config.displayName}
        title={`All ${entries.length} medical schools in ${config.displayName} listed on WDOMS`}
        intro={`This is the official World Directory of Medical Schools view for ${config.displayName}. Where Students Traffic already has a stronger university guide, you will see that internal link alongside the WDOMS record below.`}
      />
    </>
  );
}
