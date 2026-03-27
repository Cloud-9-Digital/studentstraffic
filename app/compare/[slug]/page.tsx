import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityCard } from "@/components/site/university-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  catalogReviewedAt,
  countUniqueSources,
} from "@/lib/content-governance";
import {
  getComparisonGuideBySlug,
  getComparisonGuides,
} from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCountryStructuredData,
  getCourseStructuredData,
  getStructuredDataGraph,
  getUniversityStructuredData,
  getWebPageStructuredData,
} from "@/lib/structured-data";
import { getComparisonHref, getUniversityHref } from "@/lib/routes";
import { formatCurrencyUsd } from "@/lib/utils";

export async function generateStaticParams() {
  const guides = await getComparisonGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getComparisonGuideBySlug(slug);

  if (!guide) {
    return { title: "Comparison Not Found" };
  }

  return buildIndexableMetadata({
    title: `${guide.left.university.name} vs ${guide.right.university.name} | Fees, fit & shortlist guide`,
    description: `Compare ${guide.left.university.name} and ${guide.right.university.name} on annual tuition, city, duration, recognition, and shortlist fit.`,
    path: getComparisonHref(guide.slug),
    keywords: [
      `${guide.left.university.name} vs ${guide.right.university.name}`,
      `${guide.left.course.shortName} comparison`,
      `${guide.left.university.name} fees`,
      `${guide.right.university.name} fees`,
    ],
  });
}

export default async function ComparisonGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getComparisonGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const path = getComparisonHref(guide.slug);
  const referenceCount = countUniqueSources(
    guide.left.university.recognitionLinks,
    guide.left.university.references,
    guide.right.university.recognitionLinks,
    guide.right.university.references
  );
  const leftCountryStructuredData = getCountryStructuredData(guide.left.country);
  const rightCountryStructuredData = getCountryStructuredData(guide.right.country);
  const courseStructuredData =
    guide.left.course.slug === guide.right.course.slug
      ? getCourseStructuredData(guide.left.course)
      : null;
  const leftUniversityStructuredData = getUniversityStructuredData({
    university: guide.left.university,
    country: guide.left.country,
    programs: [guide.left],
    sameAs: [
      ...guide.left.university.recognitionLinks.map((item) => item.url),
      ...guide.left.university.references.map((item) => item.url),
    ],
  });
  const rightUniversityStructuredData = getUniversityStructuredData({
    university: guide.right.university,
    country: guide.right.country,
    programs: [guide.right],
    sameAs: [
      ...guide.right.university.recognitionLinks.map((item) => item.url),
      ...guide.right.university.references.map((item) => item.url),
    ],
  });
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Compare", path: "/compare" },
      {
        name: `${guide.left.university.name} vs ${guide.right.university.name}`,
        path,
      },
    ]),
    leftCountryStructuredData,
    rightCountryStructuredData,
    courseStructuredData,
    leftUniversityStructuredData,
    rightUniversityStructuredData,
    getWebPageStructuredData({
      path,
      name: `${guide.left.university.name} vs ${guide.right.university.name}`,
      description: `Compare ${guide.left.university.name} and ${guide.right.university.name} on fees, city, fit, and student support.`,
      aboutIds: [
        leftUniversityStructuredData["@id"],
        rightUniversityStructuredData["@id"],
        courseStructuredData?.["@id"],
      ].filter(Boolean) as string[],
      dateModified: catalogReviewedAt,
      datePublished: catalogReviewedAt,
    }),
  ];

  const comparisonRows = [
    {
      label: "Annual tuition",
      left: formatCurrencyUsd(guide.left.offering.annualTuitionUsd),
      right: formatCurrencyUsd(guide.right.offering.annualTuitionUsd),
    },
    {
      label: "Duration",
      left: `${guide.left.offering.durationYears} years`,
      right: `${guide.right.offering.durationYears} years`,
    },
    {
      label: "City",
      left: `${guide.left.university.city}, ${guide.left.country.name}`,
      right: `${guide.right.university.city}, ${guide.right.country.name}`,
    },
    {
      label: "Type",
      left: guide.left.university.type,
      right: guide.right.university.type,
    },
    {
      label: "Medium",
      left: guide.left.offering.medium,
      right: guide.right.offering.medium,
    },
    {
      label: "Recognition",
      left: guide.left.university.recognitionBadges.join(", "),
      right: guide.right.university.recognitionBadges.join(", "),
    },
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="hero-panel px-6 py-8 md:px-10 md:py-10">
          <div className="max-w-5xl space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge className="border-white/12 bg-white/10 text-white">
                Comparison guide
              </Badge>
              <Badge className="border-white/12 bg-white/10 text-white">
                {guide.left.course.shortName}
              </Badge>
            </div>
            <h1 className="font-display text-heading-contrast text-5xl font-semibold tracking-tight md:text-6xl">
              {guide.left.university.name} vs {guide.right.university.name}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-white/80">
              Compare tuition, city, medium, recognition, and shortlist fit for
              two universities students often evaluate side by side.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={getUniversityHref(guide.left.university.slug)}>
                  Open {guide.left.university.name}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/18 hover:text-white">
                <Link href={getUniversityHref(guide.right.university.slug)}>
                  Open {guide.right.university.name}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <ContentTrustPanel
          lastReviewed={catalogReviewedAt}
          sourceSummary="Comparison built from official university pages, recognition references, and the Students Traffic catalog review process."
          referenceCount={referenceCount}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <UniversityCard program={guide.left} />
          <UniversityCard program={guide.right} />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableBody>
              {comparisonRows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium text-foreground">
                    {row.label}
                  </TableCell>
                  <TableCell>{row.left}</TableCell>
                  <TableCell>{row.right}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <CompareNarrativeCard
            title={`Why students shortlist ${guide.left.university.name}`}
            items={guide.left.university.bestFitFor}
            universityHref={getUniversityHref(guide.left.university.slug)}
            universityName={guide.left.university.name}
          />
          <CompareNarrativeCard
            title={`Why students shortlist ${guide.right.university.name}`}
            items={guide.right.university.bestFitFor}
            universityHref={getUniversityHref(guide.right.university.slug)}
            universityName={guide.right.university.name}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight">
              Need help deciding between these two?
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Share your budget, country preference, and shortlist priorities.
              We will help you compare these options in the context of fees,
              fit, and admissions support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={guide.left.university.officialWebsite} target="_blank" rel="noreferrer">
                  {guide.left.university.name} website
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={guide.right.university.officialWebsite} target="_blank" rel="noreferrer">
                  {guide.right.university.name} website
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <LeadForm
            sourcePath={path}
            ctaVariant="comparison_sidebar"
            title="Get a personalised comparison call"
            universitySlug={guide.left.university.slug}
            countrySlug={guide.left.country.slug}
            courseSlug={guide.left.course.slug}
          />
        </div>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}

function CompareNarrativeCard({
  title,
  items,
  universityHref,
  universityName,
}: {
  title: string;
  items: string[];
  universityHref: string;
  universityName: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="text-sm leading-7 text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
      <Button asChild variant="ghost" className="mt-4 px-0">
        <Link href={universityHref}>Open {universityName}</Link>
      </Button>
    </div>
  );
}
