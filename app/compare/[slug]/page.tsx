import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, Check, PencilLine } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { ComparisonCard } from "@/components/site/comparison-card";
import { ComparisonTable } from "@/components/site/comparison-table";
import { Button } from "@/components/ui/button";
import {
  catalogReviewedAt,
  contentAuthorName,
  formatContentDate,
} from "@/lib/content-governance";
import {
  getComparisonGuideBySlug,
  getComparisonGuides,
  getComparisonGuidesForUniversity,
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
import type { FinderProgram } from "@/lib/data/types";
import { ensureNonEmptyStaticParams } from "@/lib/static-params";
// formatCurrencyUsd moved to ComparisonTable component

export async function generateStaticParams() {
  const guides = await getComparisonGuides();
  return ensureNonEmptyStaticParams(
    guides.map((guide) => ({ slug: guide.slug })),
    { slug: "__comparison-fallback__" },
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getComparisonGuideBySlug(slug);

  if (!guide) return { title: "Comparison Not Found" };

  return buildIndexableMetadata({
    title: `${guide.left.university.name} vs ${guide.right.university.name} | Fees, Fit & Admissions Guide`,
    description: `Compare ${guide.left.university.name} and ${guide.right.university.name} on MBBS fees, city, duration, NMC recognition, and admissions fit for Indian students.`,
    path: getComparisonHref(guide.slug),
    keywords: [
      `${guide.left.university.name} vs ${guide.right.university.name}`,
      `${guide.left.course.shortName} in ${guide.left.country.name}`,
      `${guide.left.course.shortName} in ${guide.right.country.name}`,
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

  if (!guide) notFound();

  const path = getComparisonHref(guide.slug);
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
    sameAs: guide.left.university.recognitionLinks.map((item) => item.url),
  });
  const rightUniversityStructuredData = getUniversityStructuredData({
    university: guide.right.university,
    country: guide.right.country,
    programs: [guide.right],
    sameAs: guide.right.university.recognitionLinks.map((item) => item.url),
  });
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "Compare", path: "/compare" },
      { name: `${guide.left.university.name} vs ${guide.right.university.name}`, path },
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

  const [leftGuides, rightGuides] = await Promise.all([
    getComparisonGuidesForUniversity(guide.left.university.slug, 6),
    getComparisonGuidesForUniversity(guide.right.university.slug, 6),
  ]);
  const finderHref = `/universities?course=${guide.left.course.slug}`;
  const relatedGuides = [...leftGuides, ...rightGuides]
    .filter((g) => g.slug !== guide.slug)
    .filter((g, i, arr) => arr.findIndex((x) => x.slug === g.slug) === i)
    .slice(0, 4);

  const leftTuition = guide.left.offering.annualTuitionUsd;
  const rightTuition = guide.right.offering.annualTuitionUsd;
  const tuitionWinner =
    leftTuition < rightTuition ? "left" : rightTuition < leftTuition ? "right" : "tie";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
        <div className="hero-grid-lines absolute inset-0 pointer-events-none" />
        <div className="hero-orb hero-orb--warm pointer-events-none absolute -right-24 -top-20 size-96 opacity-25" aria-hidden />
        <div className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-16 left-0 size-80 opacity-40" aria-hidden />

        <div className="relative mx-auto w-[min(1120px,calc(100%-2rem))] py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
            <Link href="/guides" className="transition-colors hover:text-white/70">Guides</Link>
            <span>/</span>
            <Link href="/compare" className="transition-colors hover:text-white/70">Compare</Link>
            <span>/</span>
            <span className="text-white/60">
              {guide.left.university.name} vs {guide.right.university.name}
            </span>
          </nav>

          {/* Kicker */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            {guide.left.course.shortName} · Comparison guide
          </p>

          {/* Title */}
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            <span className="text-[color:var(--heading-contrast)]">{guide.left.university.name}</span>
            <span className="mx-3 text-white">vs</span>
            <span className="text-accent">{guide.right.university.name}</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 md:text-base md:leading-8">
            A side-by-side breakdown of tuition, city, teaching medium, recognition,
            and admissions fit to help you decide which university suits you better.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <PencilLine className="size-3 shrink-0" />
              <span>By <span className="font-medium text-white/60">{contentAuthorName}</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <CalendarDays className="size-3 shrink-0" />
              <span>Updated <span className="font-medium text-white/60">{formatContentDate(catalogReviewedAt)}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Page body ────────────────────────────────────────────────────── */}
      <section className="py-10 md:py-14">
        <div className="container-shell space-y-12">

          {/* ── Head-to-head table ──────────────────────────────────────── */}
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 className="font-display text-heading text-2xl font-semibold tracking-tight">
                Head-to-head
              </h2>
              {tuitionWinner !== "tie" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--status-green)] px-2.5 py-1 text-xs font-medium text-[color:var(--status-green-fg)]">
                  <Check className="size-3 shrink-0" />
                  <span>
                    {tuitionWinner === "left"
                      ? guide.left.university.name
                      : guide.right.university.name}{" "}
                    has lower tuition
                  </span>
                </span>
              )}
            </div>

            <ComparisonTable programs={[guide.left, guide.right]} />
          </div>

          {/* ── Who should choose ───────────────────────────────────────── */}
          <div>
            <h2 className="font-display text-heading mb-6 text-2xl font-semibold tracking-tight">
              Who should choose which?
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <BestForCard
                university={guide.left.university}
                href={getUniversityHref(guide.left.university.slug)}
                colorClass="border-primary/30"
              />
              <BestForCard
                university={guide.right.university}
                href={getUniversityHref(guide.right.university.slug)}
                colorClass="border-accent/30"
              />
            </div>
          </div>

          {/* ── CTA ─────────────────────────────────────────────────────── */}
          <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface-dark">
            <div className="grid lg:grid-cols-[1fr_420px]">
              {/* Left — text */}
              <div className="flex min-w-0 flex-col justify-center gap-5 p-6 md:p-10">
                <div className="min-w-0">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                    Next step
                  </p>
                  <h2 className="font-display text-2xl font-semibold leading-snug tracking-tight text-white md:text-3xl">
                    Still deciding between these two?
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/55">
                    Use this page to weigh the tradeoffs side by side, then
                    open the university pages or browse more options if you
                    want a broader set of options.
                  </p>
                </div>
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button asChild size="sm" variant="accent" className="min-w-0 max-w-full justify-start">
                    <Link href={finderHref} className="min-w-0">
                      <span className="truncate">Browse more universities</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="min-w-0 max-w-full justify-start border border-white/20 bg-white/8 !text-white hover:bg-white/15 hover:!text-white">
                    <Link href={guide.left.university.officialWebsite} target="_blank" rel="noreferrer" className="min-w-0">
                      <span className="truncate">{guide.left.university.name}</span>
                      <ArrowUpRight className="ml-1.5 size-3.5 shrink-0" />
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="min-w-0 max-w-full justify-start border border-white/20 bg-white/8 !text-white hover:bg-white/15 hover:!text-white">
                    <Link href={guide.right.university.officialWebsite} target="_blank" rel="noreferrer" className="min-w-0">
                      <span className="truncate">{guide.right.university.name}</span>
                      <ArrowUpRight className="ml-1.5 size-3.5 shrink-0" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right — handoff */}
              <div className="min-w-0 overflow-hidden border-t border-white/10 bg-white p-6 md:p-8 lg:border-l lg:border-t-0">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-heading">
                  Want help choosing between these options?
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Explore more universities if you want a broader comparison,
                  or contact the team if you want help understanding which
                  option fits your goals better.
                </p>
                <div className="mt-6 space-y-3">
                  <Button asChild className="w-full">
                    <Link href={finderHref}>Browse more colleges</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Talk to our team</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Related comparisons ──────────────────────────────────────── */}
          {relatedGuides.length > 0 && (
            <div>
              <h2 className="font-display text-heading mb-5 text-2xl font-semibold tracking-tight">
                More comparisons
              </h2>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {relatedGuides.map((g) => (
                  <ComparisonCard key={g.slug} guide={g} />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}

function BestForCard({
  university,
  href,
  colorClass,
}: {
  university: FinderProgram["university"];
  href: string;
  colorClass: string;
}) {
  return (
    <div className={`rounded-2xl border-2 bg-card p-6 ${colorClass}`}>
      <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Best fit for
      </p>
      <h3 className="text-base font-semibold text-foreground">{university.name}</h3>
      <ul className="mt-4 space-y-2.5">
        {university.bestFitFor.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted">
              <Check className="size-2.5 text-muted-foreground" />
            </span>
            <span className="text-sm leading-6 text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
      <Button asChild variant="ghost" size="sm" className="mt-5 -ml-2 px-2">
        <Link href={href}>
          View full profile
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}
