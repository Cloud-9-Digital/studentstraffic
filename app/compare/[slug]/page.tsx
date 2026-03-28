import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock,
  Languages,
  MapPin,
  PencilLine,
} from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { ComparisonCard } from "@/components/site/comparison-card";
import { LeadForm } from "@/components/site/lead-form";
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
  type ComparisonGuide,
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
import {
  getUniversityCoverImage,
  getUniversityInitials,
} from "@/lib/university-media";
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

  if (!guide) return { title: "Comparison Not Found" };

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
  const relatedGuides = [...leftGuides, ...rightGuides]
    .filter((g) => g.slug !== guide.slug)
    .filter((g, i, arr) => arr.findIndex((x) => x.slug === g.slug) === i)
    .slice(0, 4);

  const leftTuition = guide.left.offering.annualTuitionUsd;
  const rightTuition = guide.right.offering.annualTuitionUsd;
  const tuitionWinner =
    leftTuition < rightTuition ? "left" : rightTuition < leftTuition ? "right" : "tie";

  const rows: { label: string; left: string; right: string; winner?: "left" | "right" }[] = [
    {
      label: "Annual tuition",
      left: formatCurrencyUsd(leftTuition),
      right: formatCurrencyUsd(rightTuition),
      winner: tuitionWinner === "tie" ? undefined : tuitionWinner,
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
      left: guide.left.university.recognitionBadges.join(", ") || "—",
      right: guide.right.university.recognitionBadges.join(", ") || "—",
    },
  ];

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
            <Link href="/universities" className="transition-colors hover:text-white/70">Universities</Link>
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
            and shortlist fit to help you decide which university suits you better.
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
            <div className="mb-4 flex items-center gap-3">
              <h2 className="font-display text-heading text-2xl font-semibold tracking-tight">
                Head-to-head
              </h2>
              {tuitionWinner !== "tie" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--status-green)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--status-green-fg)]">
                  <Check className="size-3" />
                  {tuitionWinner === "left"
                    ? guide.left.university.name
                    : guide.right.university.name}{" "}
                  has lower tuition
                </span>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_160px_1fr] border-b border-border">
                {/* Left header */}
                <Link href={getUniversityHref(guide.left.university.slug)} className="group flex items-center gap-3 bg-primary/[0.04] px-6 py-4 transition-colors hover:bg-primary/[0.08]">
                  <UniLogoSmall university={guide.left.university} />
                  <div>
                    <p className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary">
                      {guide.left.university.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      {guide.left.university.city}
                      <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-60" />
                    </p>
                  </div>
                </Link>
                {/* Center header */}
                <div className="flex items-center justify-center border-x border-border bg-muted/50 px-3 py-4">
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Metric
                  </span>
                </div>
                {/* Right header */}
                <Link href={getUniversityHref(guide.right.university.slug)} className="group flex items-center justify-end gap-3 bg-accent/[0.04] px-6 py-4 transition-colors hover:bg-accent/[0.08]">
                  <div className="text-right">
                    <p className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary">
                      {guide.right.university.name}
                    </p>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-60" />
                      {guide.right.university.city}
                    </p>
                  </div>
                  <UniLogoSmall university={guide.right.university} />
                </Link>
              </div>

              {/* Data rows */}
              {rows.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1fr_160px_1fr] ${i < rows.length - 1 ? "border-b border-border" : ""} ${i % 2 === 1 ? "bg-muted/20" : ""}`}
                >
                  {/* Left value */}
                  <div className={`flex items-center px-6 py-3.5 ${row.winner === "left" ? "bg-[color:var(--status-green)]" : ""}`}>
                    <div className="flex items-center gap-2">
                      {row.winner === "left" && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--status-green-fg)]/12">
                          <Check className="size-2.5 text-[color:var(--status-green-fg)]" />
                        </span>
                      )}
                      <span className={`text-sm ${row.winner === "left" ? "font-semibold text-[color:var(--status-green-fg)]" : "text-foreground"}`}>
                        {row.left}
                      </span>
                    </div>
                  </div>

                  {/* Center label */}
                  <div className="flex items-center justify-center border-x border-border bg-muted/50 px-3 py-3.5 text-center">
                    <span className="text-[0.65rem] font-medium leading-snug text-muted-foreground">
                      {row.label}
                    </span>
                  </div>

                  {/* Right value */}
                  <div className={`flex items-center justify-end px-6 py-3.5 ${row.winner === "right" ? "bg-[color:var(--status-green)]" : ""}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm text-right ${row.winner === "right" ? "font-semibold text-[color:var(--status-green-fg)]" : "text-foreground"}`}>
                        {row.right}
                      </span>
                      {row.winner === "right" && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--status-green-fg)]/12">
                          <Check className="size-2.5 text-[color:var(--status-green-fg)]" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                    Free counselling
                  </p>
                  <h2 className="font-display text-2xl font-semibold leading-snug tracking-tight text-white md:text-3xl">
                    Still deciding between these two?
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/55">
                    Share your details and we&apos;ll help you weigh these options
                    against your shortlist and connect you with an admissions advisor.
                  </p>
                </div>
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
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

              {/* Right — form */}
              <div className="min-w-0 overflow-hidden border-t border-white/10 bg-white p-6 md:p-8 lg:border-l lg:border-t-0">
                <LeadForm
                  sourcePath={path}
                  ctaVariant="comparison_sidebar"
                  title="Get a personalised comparison call"
                  universitySlug={guide.left.university.slug}
                  countrySlug={guide.left.country.slug}
                  courseSlug={guide.left.course.slug}
                  embedded
                  stacked
                />
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

/* ── Sub-components ──────────────────────────────────────────────────────── */

function UniversityProfileCard({
  program,
  accent,
}: {
  program: FinderProgram;
  accent: "teal" | "amber";
}) {
  const { university, country, course, offering } = program;
  const href = getUniversityHref(university.slug);
  const coverImage = getUniversityCoverImage(university);
  const initials = getUniversityInitials(university.name);
  const isTeal = accent === "teal";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Cover */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="select-none font-display text-7xl font-semibold text-primary/8">
              {initials}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Accent stripe */}
        <div
          className={`absolute left-0 top-0 h-1 w-full ${isTeal ? "bg-primary" : "bg-accent"}`}
        />

        {/* Logo */}
        <div className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border-2 border-white/80 bg-white shadow-md">
          {university.logoUrl ? (
            <Image
              src={university.logoUrl}
              alt={`${university.name} logo`}
              width={44}
              height={44}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <span className="text-xs font-bold text-primary">{initials}</span>
          )}
        </div>

        {/* Type badge */}
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-black/40 px-2 py-0.5 text-[0.65rem] font-medium text-white/90 backdrop-blur-sm">
            <Building2 className="size-2.5" />
            {university.type}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-snug text-foreground">{university.name}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              <span>{university.city}, {country.name}</span>
            </div>
          </div>
          <Link
            href={href}
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/70"
          >
            View profile
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
          <StatCell icon={<CircleDollarSign className="size-3.5 text-muted-foreground" />} label="Tuition / yr" value={formatCurrencyUsd(offering.annualTuitionUsd)} />
          <StatCell icon={<Clock className="size-3.5 text-muted-foreground" />} label="Duration" value={`${offering.durationYears} years`} />
          <StatCell icon={<Languages className="size-3.5 text-muted-foreground" />} label="Medium" value={offering.medium === "English" ? "English" : "English+"} />
        </div>

        {/* Recognition */}
        {university.recognitionBadges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
            {university.recognitionBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground"
              >
                <BadgeCheck className="size-3 shrink-0 text-primary" />
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[0.6rem] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function UniLogoSmall({ university }: { university: FinderProgram["university"] }) {
  const initials = getUniversityInitials(university.name);
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white shadow-sm">
      {university.logoUrl ? (
        <Image
          src={university.logoUrl}
          alt={`${university.name} logo`}
          width={36}
          height={36}
          className="h-full w-full object-contain p-0.5"
        />
      ) : (
        <span className="text-[0.6rem] font-bold text-primary">{initials}</span>
      )}
    </div>
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
