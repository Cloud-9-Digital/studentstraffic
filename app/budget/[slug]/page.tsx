import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { UniversityCard } from "@/components/site/university-card";
import { Button } from "@/components/ui/button";
import { catalogReviewedAt } from "@/lib/content-governance";
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
import {
  getBudgetGuideHref,
  getCourseHref,
} from "@/lib/routes";
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
    title: `${guide.course.shortName} Universities Under ${formatCurrencyUsd(guide.budgetUsd)}/Year | Affordable Options`,
    description: `Compare ${guide.course.shortName} universities with annual tuition under ${formatCurrencyUsd(guide.budgetUsd)} — filtered by country, city, NMC recognition, and teaching medium.`,
    path: getBudgetGuideHref(guide.slug),
    keywords: [
      `${guide.course.shortName} under ${formatCurrencyUsd(guide.budgetUsd)} per year`,
      `affordable ${guide.course.shortName} universities abroad`,
      `${guide.course.shortName} low cost universities`,
      `${guide.course.shortName} budget universities for Indian students`,
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

  const budgetLabel = formatCurrencyUsd(guide.budgetUsd);
  const path = getBudgetGuideHref(guide.slug);
  const courseStructuredData = getCourseStructuredData(guide.course);
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "Budget guides", path: "/budget" },
      {
        name: `${guide.course.shortName} under ${budgetLabel}`,
        path,
      },
    ]),
    courseStructuredData,
    getCollectionPageStructuredData({
      path,
      name: `${guide.course.shortName} universities under ${budgetLabel}`,
      description: `Budget-focused ${guide.course.shortName} options with annual tuition under ${budgetLabel}.`,
      aboutIds: [courseStructuredData["@id"]],
      mainEntityId: getItemListStructuredDataId(path),
      dateModified: catalogReviewedAt,
      datePublished: catalogReviewedAt,
    }),
    getProgramItemListStructuredData({
      path,
      name: `${guide.course.shortName} budget options under ${budgetLabel}`,
      programs: guide.programs,
    }),
  ];

  const finderHref = `/universities?course=${guide.course.slug}&fee_max=${guide.budgetUsd}`;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(145deg,#f6efe7_0%,#fbfaf8_48%,#eef4fb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,97,0,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(45,107,100,0.10),transparent_28%)]" />
        <div className="container-shell relative py-14 md:py-18 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Budget Guide
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-heading sm:text-6xl">
              {guide.course.shortName} under {budgetLabel} per year.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
              This page keeps the shortlist inside an annual tuition ceiling of{" "}
              {budgetLabel}, so you can compare affordable options before you go
              deeper into full university details.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href={finderHref}>
                  Browse all matching universities
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={getCourseHref(guide.course.slug)}>
                  Open {guide.course.shortName} guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div className="mb-8 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Matching Universities
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
              {guide.programs.length} option{guide.programs.length === 1 ? "" : "s"} within this budget band.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              These results are limited to published programs with annual tuition
              at or below {budgetLabel}. Open any university page for hostel,
              city, recognition, and admissions details.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {guide.programs.map((program, index) => (
              <UniversityCard
                key={program.offering.slug}
                program={program}
                imagePriority={index < 2}
              />
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
