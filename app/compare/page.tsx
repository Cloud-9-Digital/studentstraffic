import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { ComparisonDirectorySection } from "@/components/site/comparison-directory-sections";
import { Button } from "@/components/ui/button";
import {
  getBudgetComparisonGuides,
  getComparisonGuides,
  getCountryComparisonGuides,
} from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS Abroad Comparison Pages | Fees, Country and University Comparison",
  description:
    "Compare MBBS abroad countries, universities, and budget options by fees, NMC recognition, teaching medium, and admission details for Indian students.",
  path: "/compare",
});

const initialComparisonCount = 24;

export default async function CompareIndexPage() {
  const [universityGuides, countryGuides, budgetGuides] = await Promise.all([
    getComparisonGuides(),
    getCountryComparisonGuides(),
    getBudgetComparisonGuides(),
  ]);

  const sortedUniversityGuides = [...universityGuides].sort((left, right) =>
    `${left.left.university.name} ${left.right.university.name}`.localeCompare(
      `${right.left.university.name} ${right.right.university.name}`
    )
  );
  const sortedCountryGuides = [...countryGuides].sort((left, right) =>
    `${left.leftCountry.name} ${left.rightCountry.name}`.localeCompare(
      `${right.leftCountry.name} ${right.rightCountry.name}`
    )
  );
  const sortedBudgetGuides = [...budgetGuides].sort((left, right) => {
    if (left.course.slug !== right.course.slug) {
      return left.course.slug.localeCompare(right.course.slug);
    }

    if (left.budgetUsd !== right.budgetUsd) {
      return left.budgetUsd - right.budgetUsd;
    }

    return `${left.leftCountry.name} ${left.rightCountry.name}`.localeCompare(
      `${right.leftCountry.name} ${right.rightCountry.name}`
    );
  });

  const path = "/compare";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Compare", path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: "MBBS abroad comparison pages",
      description:
        "Comparison pages for countries, universities, and budget-led MBBS decisions for Indian students.",
    }),
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(145deg,#f6efe7_0%,#fbfaf8_48%,#eef4fb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,97,0,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(53,94,138,0.10),transparent_28%)]" />
        <div className="container-shell relative py-14 md:py-18 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              MBBS Abroad Comparison
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-heading sm:text-6xl">
              Compare countries, universities, and budget options in one place.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
              This section brings together detailed comparison pages for Indian
              students. You can compare one university with another, one
              country with another, or check which country has more options
              inside a specific fee range.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/universities">
                  Compare more universities
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Submit your details</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {sortedUniversityGuides.length > 0 ? (
        <ComparisonDirectorySection
          type="university"
          initialGuides={sortedUniversityGuides.slice(0, initialComparisonCount)}
          total={sortedUniversityGuides.length}
          eyebrow="University Comparison"
          title="University vs university pages"
          description="These pages are useful when a student has already narrowed down a few universities and wants to compare fees, city, medium, and recognition details before submitting an enquiry."
        />
      ) : null}

      {sortedCountryGuides.length > 0 ? (
        <ComparisonDirectorySection
          type="country"
          initialGuides={sortedCountryGuides.slice(0, initialComparisonCount)}
          total={sortedCountryGuides.length}
          eyebrow="Country Comparison"
          title="Country vs country pages"
          description="These pages compare the full decision level: fees, climate, eligibility, cost of living, and the universities currently listed in each country."
          bordered
        />
      ) : null}

      {sortedBudgetGuides.length > 0 ? (
        <ComparisonDirectorySection
          type="budget"
          initialGuides={sortedBudgetGuides.slice(0, initialComparisonCount)}
          total={sortedBudgetGuides.length}
          eyebrow="Budget Comparison"
          title="Budget vs country pages"
          description="These pages focus on one budget band and compare which countries currently have more options under that fee level."
          bordered
        />
      ) : null}

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
