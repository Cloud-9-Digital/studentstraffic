import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { SectionHeading } from "@/components/site/section-heading";
import { UniversityCard } from "@/components/site/university-card";
import { Button } from "@/components/ui/button";
import {
  catalogReviewedAt,
} from "@/lib/content-governance";
import {
  getBudgetGuideBySlug,
  getBudgetGuides,
} from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getCourseStructuredData,
  getItemListStructuredDataId,
  getProgramItemListStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getBudgetGuideHref, getUniversityHref } from "@/lib/routes";
import { formatCurrencyUsd } from "@/lib/utils";

export async function generateStaticParams() {
  const guides = await getBudgetGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getBudgetGuideBySlug(slug);

  if (!guide) {
    return { title: "Budget Guide Not Found" };
  }

  return buildIndexableMetadata({
    title: `${guide.course.shortName} universities under ${formatCurrencyUsd(guide.budgetUsd)} | Budget shortlist`,
    description: `Explore ${guide.course.shortName} university options with annual tuition under ${formatCurrencyUsd(guide.budgetUsd)} and compare them by country, city, and fit.`,
    path: getBudgetGuideHref(guide.slug),
    keywords: [
      `${guide.course.shortName} under ${guide.budgetUsd} USD`,
      `${guide.course.shortName} budget universities`,
      `${guide.course.shortName} affordable options`,
    ],
  });
}

export default async function BudgetGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getBudgetGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const path = getBudgetGuideHref(guide.slug);
  const courseStructuredData = getCourseStructuredData(guide.course);
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "Budget guides", path: "/budget" },
      {
        name: `${guide.course.shortName} under ${formatCurrencyUsd(guide.budgetUsd)}`,
        path,
      },
    ]),
    courseStructuredData,
    getCollectionPageStructuredData({
      path,
      name: `${guide.course.shortName} universities under ${formatCurrencyUsd(guide.budgetUsd)}`,
      description: `Budget-focused ${guide.course.shortName} shortlist with annual tuition under ${formatCurrencyUsd(guide.budgetUsd)}.`,
      aboutIds: [courseStructuredData["@id"]],
      mainEntityId: getItemListStructuredDataId(path),
      dateModified: catalogReviewedAt,
      datePublished: catalogReviewedAt,
    }),
    getProgramItemListStructuredData({
      path,
      name: `${guide.course.shortName} budget options under ${formatCurrencyUsd(guide.budgetUsd)}`,
      programs: guide.programs,
    }),
  ];
  const countries = [...new Set(guide.programs.map((program) => program.country.name))];
  const finderHref = `/universities?course=${guide.course.slug}&fee_max=${guide.budgetUsd}`;

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="hero-panel px-6 py-8 md:px-10 md:py-10">
          <div className="max-w-5xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
              Budget guide
            </p>
            <h1 className="font-display text-heading-contrast text-5xl font-semibold tracking-tight md:text-6xl">
              {guide.course.shortName} universities under {formatCurrencyUsd(guide.budgetUsd)}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-white/80">
              Explore current {guide.course.shortName} options with annual
              tuition at or below {formatCurrencyUsd(guide.budgetUsd)} and use
              this page as a starting point for a more affordable shortlist.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              <span>{guide.programs.length} programs</span>
              <span>{countries.length} countries</span>
              <span>Sorted by affordability and featured priority</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href={finderHref}>Explore all matching universities</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/18 hover:text-white"
              >
                <Link href="/contact">Get free counselling</Link>
              </Button>
            </div>
          </div>
        </div>

        <ContentTrustPanel
          lastReviewed={catalogReviewedAt}
        />

        <div className="space-y-8">
          <SectionHeading
            eyebrow="Affordable shortlist"
            title={`Current ${guide.course.shortName} options under ${formatCurrencyUsd(guide.budgetUsd)}`}
            description="Start with budget here, then open university pages for a deeper look at country, city, recognition, and support."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guide.programs.map((program, index) => (
              <UniversityCard
                key={program.offering.slug}
                program={program}
                imagePriority={index < 2}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {guide.programs.slice(0, 3).map((program) => (
              <Button key={program.university.slug} asChild variant="outline">
                <Link href={getUniversityHref(program.university.slug)}>
                  {program.university.name}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ))}
          </div>
          <div className="rounded-3xl border border-border bg-card px-8 py-10 md:px-10">
            <SectionHeading
              title="Want to widen the shortlist beyond this budget page?"
              description="Browse all matching universities in one place while keeping the budget filter active."
              aside={
                <Button asChild>
                  <Link href={finderHref}>Explore all matching universities</Link>
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
