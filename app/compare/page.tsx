import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import {
  getBudgetComparisonGuides,
  getComparisonGuides,
  getCountryComparisonGuides,
  type BudgetComparisonGuide,
  type ComparisonGuide,
  type CountryComparisonGuide,
} from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import { getComparisonHref } from "@/lib/routes";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { formatCurrencyUsd, hasPublishedUsdAmount } from "@/lib/utils";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS Abroad Comparison Pages | Fees, Country and University Comparison",
  description:
    "Compare MBBS abroad countries, universities, and budget options by fees, NMC recognition, teaching medium, and admission details for Indian students.",
  path: "/compare",
});

function getFeeRangeLabel(programs: Array<ComparisonGuide["left"]>) {
  const fees = programs
    .map((program) => program.offering.annualTuitionUsd)
    .filter(hasPublishedUsdAmount);

  if (!fees.length) {
    return "Check fee details";
  }

  return `${formatCurrencyUsd(Math.min(...fees))} - ${formatCurrencyUsd(
    Math.max(...fees)
  )}`;
}

function CompareEntryCard({
  title,
  description,
  href,
  footer,
  kicker,
}: {
  title: string;
  description: string;
  href: string;
  footer: string;
  kicker: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
        {kicker}
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
        {title}
      </h2>
      <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      <div className="mt-5 border-t border-border/70 pt-4">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          {footer}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function UniversityComparisonSection({
  guides,
}: {
  guides: ComparisonGuide[];
}) {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            University Comparison
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
            University vs university pages
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            These pages are useful when a student has already narrowed down a
            few universities and wants to compare fees, city, medium, and
            recognition details before submitting an enquiry.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => (
            <CompareEntryCard
              key={guide.slug}
              kicker={guide.left.course.shortName}
              title={`${guide.left.university.name} vs ${guide.right.university.name}`}
              description={`Compare annual fees, teaching medium, city, recognition, and admission details for Indian students.`}
              href={getComparisonHref(guide.slug)}
              footer="Open comparison"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CountryComparisonSection({
  guides,
}: {
  guides: CountryComparisonGuide[];
}) {
  return (
    <section className="border-t border-border py-16 md:py-20">
      <div className="container-shell">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Country Comparison
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
            Country vs country pages
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            These pages compare the full decision level: fees, climate,
            eligibility, cost of living, and the universities currently listed
            in each country.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => (
            <CompareEntryCard
              key={guide.slug}
              kicker={`${guide.course.shortName} country comparison`}
              title={`${guide.leftCountry.name} vs ${guide.rightCountry.name}`}
              description={`Compare ${guide.course.shortName} in ${guide.leftCountry.name} and ${guide.rightCountry.name} by fees, climate, eligibility, and student living costs.`}
              href={getComparisonHref(guide.slug)}
              footer="Open comparison"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BudgetComparisonSection({
  guides,
}: {
  guides: BudgetComparisonGuide[];
}) {
  return (
    <section className="border-t border-border py-16 md:py-20">
      <div className="container-shell">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Budget Comparison
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
            Budget vs country pages
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            These pages focus on one budget band and compare which countries
            currently have more options under that fee level.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => {
            const leftFeeRange = getFeeRangeLabel(guide.leftPrograms);
            const rightFeeRange = getFeeRangeLabel(guide.rightPrograms);

            return (
              <CompareEntryCard
                key={guide.slug}
                kicker={`${guide.course.shortName} under ${formatCurrencyUsd(guide.budgetUsd)}`}
                title={`${guide.leftCountry.name} vs ${guide.rightCountry.name}`}
                description={`${guide.leftPrograms.length} option${
                  guide.leftPrograms.length === 1 ? "" : "s"
                } in ${guide.leftCountry.name} and ${guide.rightPrograms.length} option${
                  guide.rightPrograms.length === 1 ? "" : "s"
                } in ${guide.rightCountry.name}. Fee range: ${leftFeeRange} and ${rightFeeRange}.`}
                href={getComparisonHref(guide.slug)}
                footer="Open comparison"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

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
        <UniversityComparisonSection guides={sortedUniversityGuides} />
      ) : null}

      {sortedCountryGuides.length > 0 ? (
        <CountryComparisonSection guides={sortedCountryGuides} />
      ) : null}

      {sortedBudgetGuides.length > 0 ? (
        <BudgetComparisonSection guides={sortedBudgetGuides} />
      ) : null}

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
