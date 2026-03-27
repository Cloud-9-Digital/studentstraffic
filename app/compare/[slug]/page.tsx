import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Building2, Check, MapPin } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { LeadForm } from "@/components/site/lead-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getUniversityCoverImage, getUniversityInitials } from "@/lib/university-media";
import { formatCurrencyUsd } from "@/lib/utils";
import type { FinderProgram } from "@/lib/data/types";

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

  const leftTuition = guide.left.offering.annualTuitionUsd;
  const rightTuition = guide.right.offering.annualTuitionUsd;

  const comparisonRows: {
    label: string;
    left: string;
    right: string;
    winnerSide?: "left" | "right" | "tie";
  }[] = [
    {
      label: "Annual tuition",
      left: formatCurrencyUsd(leftTuition),
      right: formatCurrencyUsd(rightTuition),
      winnerSide:
        leftTuition < rightTuition
          ? "left"
          : rightTuition < leftTuition
          ? "right"
          : "tie",
    },
    {
      label: "Duration",
      left: `${guide.left.offering.durationYears} years`,
      right: `${guide.right.offering.durationYears} years`,
      winnerSide:
        guide.left.offering.durationYears === guide.right.offering.durationYears
          ? "tie"
          : undefined,
    },
    {
      label: "City",
      left: `${guide.left.university.city}, ${guide.left.country.name}`,
      right: `${guide.right.university.city}, ${guide.right.country.name}`,
    },
    {
      label: "University type",
      left: guide.left.university.type,
      right: guide.right.university.type,
    },
    {
      label: "Teaching medium",
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

        {/* ── Split hero ──────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-[2rem]" style={{ background: "linear-gradient(135deg, #0f3d37 0%, #184a43 100%)" }}>
          {/* Grid texture */}
          <div className="hero-grid-lines absolute inset-0" />
          {/* Warm orb left */}
          <div className="hero-orb hero-orb--warm absolute -left-16 top-1/2 h-56 w-56 -translate-y-1/2" />
          {/* Cool orb right */}
          <div className="hero-orb hero-orb--cool absolute -right-16 top-1/4 h-40 w-40" />

          <div className="relative z-10 grid md:grid-cols-[1fr_auto_1fr]">
            {/* Left university */}
            <UniversityHeroSide program={guide.left} side="left" />

            {/* VS divider */}
            <div className="flex flex-col items-center justify-center px-4 py-6 md:py-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm">
                <span className="font-display text-sm font-semibold tracking-widest text-white/90">VS</span>
              </div>
              {/* Vertical line — only on md+ */}
              <div className="mt-3 hidden h-full w-px bg-white/10 md:block" />
            </div>

            {/* Right university */}
            <UniversityHeroSide program={guide.right} side="right" />
          </div>

          {/* Bottom bar */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 border-t border-white/10 px-6 py-4 md:px-10">
            <Badge className="border-white/12 bg-white/10 text-white">
              Comparison guide
            </Badge>
            <Badge className="border-white/12 bg-white/10 text-white">
              {guide.left.course.shortName}
            </Badge>
            <span className="ml-auto text-xs text-white/50">
              Compare tuition · city · recognition · fit
            </span>
          </div>
        </div>

        <ContentTrustPanel
          lastReviewed={catalogReviewedAt}
          sourceSummary="Comparison pages are manually reviewed to help students compare academic fit, fee range, and city environment more clearly."
          referenceCount={referenceCount}
        />

        {/* ── Head-to-head panel ──────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto_1fr] border-b border-border">
            <CompareColumnHeader program={guide.left} side="left" />
            <div className="flex w-28 shrink-0 items-center justify-center border-x border-border bg-muted/40 px-2 py-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Metric
              </span>
            </div>
            <CompareColumnHeader program={guide.right} side="right" />
          </div>

          {/* Comparison rows */}
          {comparisonRows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-[1fr_auto_1fr] ${i < comparisonRows.length - 1 ? "border-b border-border" : ""}`}
            >
              {/* Left value */}
              <div
                className={`flex items-center px-5 py-4 ${
                  row.winnerSide === "left"
                    ? "bg-[color:var(--status-green)] text-[color:var(--status-green-fg)]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {row.winnerSide === "left" && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--status-green-fg)]/15">
                      <Check className="h-2.5 w-2.5 text-[color:var(--status-green-fg)]" />
                    </span>
                  )}
                  <span className={`text-sm ${row.winnerSide === "left" ? "font-semibold" : "text-foreground"}`}>
                    {row.left}
                  </span>
                </div>
              </div>

              {/* Centre label */}
              <div className="flex w-28 shrink-0 items-center justify-center border-x border-border bg-muted/40 px-2 py-4 text-center">
                <span className="text-[0.65rem] font-medium leading-tight text-muted-foreground">
                  {row.label}
                </span>
              </div>

              {/* Right value */}
              <div
                className={`flex items-center justify-end px-5 py-4 ${
                  row.winnerSide === "right"
                    ? "bg-[color:var(--status-green)] text-[color:var(--status-green-fg)]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm text-right ${row.winnerSide === "right" ? "font-semibold" : "text-foreground"}`}>
                    {row.right}
                  </span>
                  {row.winnerSide === "right" && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--status-green-fg)]/15">
                      <Check className="h-2.5 w-2.5 text-[color:var(--status-green-fg)]" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Footer actions */}
          <div className="grid grid-cols-2 border-t border-border">
            <div className="flex items-center justify-center border-r border-border p-4">
              <Button asChild size="sm" className="w-full max-w-[200px]">
                <Link href={getUniversityHref(guide.left.university.slug)}>
                  Open {guide.left.university.name}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center p-4">
              <Button asChild size="sm" variant="outline" className="w-full max-w-[200px]">
                <Link href={getUniversityHref(guide.right.university.slug)}>
                  Open {guide.right.university.name}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Narrative cards ─────────────────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-2">
          <NarrativeCard
            title={`Why students shortlist ${guide.left.university.name}`}
            items={guide.left.university.bestFitFor}
            universityHref={getUniversityHref(guide.left.university.slug)}
            universityName={guide.left.university.name}
            accentClass="border-l-primary"
          />
          <NarrativeCard
            title={`Why students shortlist ${guide.right.university.name}`}
            items={guide.right.university.bestFitFor}
            universityHref={getUniversityHref(guide.right.university.slug)}
            universityName={guide.right.university.name}
            accentClass="border-l-accent"
          />
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight">
              Need help deciding between these two?
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Share your budget, country preference, and shortlist priorities.
              We will help you compare these options in the context of fees,
              fit, and admissions support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href={guide.left.university.officialWebsite} target="_blank" rel="noreferrer">
                  {guide.left.university.name} website
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={guide.right.university.officialWebsite} target="_blank" rel="noreferrer">
                  {guide.right.university.name} website
                  <ArrowUpRight className="size-3.5" />
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

/* ── Sub-components ─────────────────────────────────────────────────────── */

function UniversityHeroSide({
  program,
  side,
}: {
  program: FinderProgram;
  side: "left" | "right";
}) {
  const { university, country, offering } = program;
  const initials = getUniversityInitials(university.name);
  const coverImage = getUniversityCoverImage(university);
  const href = getUniversityHref(university.slug);

  return (
    <div className={`flex flex-col gap-4 px-6 py-8 md:px-8 md:py-10 ${side === "right" ? "items-end text-right" : ""}`}>
      {/* Logo + cover thumbnail */}
      <div className={`flex items-center gap-3 ${side === "right" ? "flex-row-reverse" : ""}`}>
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/70 bg-white shadow-md">
          {university.logoUrl ? (
            <Image
              src={university.logoUrl}
              alt={`${university.name} logo`}
              width={48}
              height={48}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <span className="text-xs font-bold text-primary">{initials}</span>
          )}
        </div>
        {coverImage && (
          <div className="relative h-12 w-20 overflow-hidden rounded-lg border border-white/20">
            <Image
              src={coverImage.url}
              alt={coverImage.alt}
              fill
              className="object-cover"
              sizes="80px"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
      </div>

      {/* University name */}
      <div>
        <h2 className="font-display text-xl font-semibold leading-tight text-white md:text-2xl">
          {university.name}
        </h2>
        <div className={`mt-1.5 flex items-center gap-1.5 text-xs text-white/60 ${side === "right" ? "justify-end" : ""}`}>
          <MapPin className="h-3 w-3 shrink-0" />
          <span>{university.city}, {country.name}</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className={`flex flex-wrap gap-2 ${side === "right" ? "justify-end" : ""}`}>
        <span className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
          {formatCurrencyUsd(offering.annualTuitionUsd)}
          <span className="font-normal text-white/50">/yr</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
          <Building2 className="h-3 w-3" />
          {university.type}
        </span>
        <span className="inline-flex rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
          {offering.durationYears}yr · {offering.medium}
        </span>
      </div>

      <Link
        href={href}
        className={`inline-flex items-center gap-1 text-xs font-medium text-white/50 transition-colors hover:text-white/80 ${side === "right" ? "self-end" : ""}`}
      >
        View full profile
        <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function CompareColumnHeader({
  program,
  side,
}: {
  program: FinderProgram;
  side: "left" | "right";
}) {
  const { university } = program;
  const initials = getUniversityInitials(university.name);

  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 ${
        side === "left"
          ? "bg-primary/[0.04] border-r-0"
          : "flex-row-reverse bg-accent/[0.04] text-right"
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white shadow-sm">
        {university.logoUrl ? (
          <Image
            src={university.logoUrl}
            alt={`${university.name} logo`}
            width={32}
            height={32}
            className="h-full w-full object-contain p-0.5"
          />
        ) : (
          <span className="text-[0.6rem] font-bold text-primary">{initials}</span>
        )}
      </div>
      <div className={side === "right" ? "text-right" : ""}>
        <p className="text-sm font-semibold leading-tight text-foreground line-clamp-2">
          {university.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{university.city}</p>
      </div>
    </div>
  );
}

function NarrativeCard({
  title,
  items,
  universityHref,
  universityName,
  accentClass,
}: {
  title: string;
  items: string[];
  universityHref: string;
  universityName: string;
  accentClass: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-6 border-l-4 ${accentClass}`}>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted">
              <Check className="h-2.5 w-2.5 text-muted-foreground" />
            </span>
            <span className="text-sm leading-6 text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
      <Button asChild variant="ghost" size="sm" className="mt-5 -ml-2 px-2 text-primary hover:text-primary">
        <Link href={universityHref}>
          Open {universityName}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}
