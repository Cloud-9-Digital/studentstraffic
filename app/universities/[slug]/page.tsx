import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  ExternalLink,
  GraduationCap,
  Languages,
  MapPinned,
  PencilLine,
  ShieldCheck,
  Stethoscope,
  UtensilsCrossed,
} from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CardCarousel, CarouselItem } from "@/components/site/card-carousel";
import { ComparisonCard } from "@/components/site/comparison-card";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { UniversityPeerSection } from "@/components/site/university-peer-section";
import { UniversityReviewsSection } from "@/components/site/university-reviews-section";
import { UniversityCard } from "@/components/site/university-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  catalogReviewedAt,
  contentAuthorName,
  formatContentDate,
} from "@/lib/content-governance";
import {
  getComparisonGuidesForUniversity,
} from "@/lib/discovery-pages";
import {
  getCountryBySlug,
  getProgramsForCountry,
  getProgramsForUniversity,
  getUniversities,
  getUniversityBySlug,
  getWdomsDirectoryEntryForUniversity,
} from "@/lib/data/catalog";
import type { UniversityGalleryImage } from "@/lib/data/types";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCountryStructuredData,
  getCourseStructuredData,
  getFaqStructuredData,
  getProgramItemListStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
  getUniversityStructuredData,
} from "@/lib/structured-data";
import {
  getUniversityCoverImage,
  getUniversityGalleryImages,
  getUniversityInitials,
} from "@/lib/university-media";
import {
  cn,
  formatProgramAnnualFee,
  formatCurrencyUsd,
  formatProgramDuration,
  formatUsdAmountOrTbd,
  getProgramAnnualFeeLabel,
  hasPublishedUsdAmount,
  hasRenderableProgramAnnualFee,
} from "@/lib/utils";

export async function generateStaticParams() {
  const universities = await getUniversities();
  return universities.map((university) => ({ slug: university.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const university = await getUniversityBySlug(slug);

  if (!university) {
    return { title: "University Not Found" };
  }

  const [country, programs] = await Promise.all([
    getCountryBySlug(university.countrySlug),
    getProgramsForUniversity(university.slug),
  ]);
  const primaryProgram =
    programs.find((p) => p.offering.featured) ?? programs[0];
  const primaryProgramHasPublishedFee = primaryProgram
    ? hasPublishedUsdAmount(primaryProgram.offering.annualTuitionUsd)
    : false;
  const title = primaryProgram
    ? `${university.name} | ${primaryProgram.course.shortName} ${
        primaryProgramHasPublishedFee ? "Fees, " : ""
      }Admissions & Course Details`
    : `${university.name} | University Details`;
  const description =
    primaryProgram && country
      ? `${university.summary} Compare ${primaryProgram.course.shortName} ${
          primaryProgramHasPublishedFee ? "annual tuition, " : ""
        }medium of instruction, intake, and student support in ${university.city}, ${country.name}.`
      : university.summary;

  return buildIndexableMetadata({
    title,
    description,
    path: `/universities/${university.slug}`,
    keywords: [
      university.name,
      primaryProgram
        ? `${primaryProgram.course.shortName} at ${university.name}`
        : undefined,
      country ? `${university.name} ${country.name}` : undefined,
      `${university.city} medical university`,
      ...university.recognitionBadges,
    ].filter(Boolean) as string[],
  });
}

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const university = await getUniversityBySlug(slug);

  if (!university) notFound();

  const [programs, country, wdomsEntry] = await Promise.all([
    getProgramsForUniversity(university.slug),
    getCountryBySlug(university.countrySlug),
    getWdomsDirectoryEntryForUniversity(university.slug),
  ]);

  if (!country) notFound();

  const primaryProgram =
    programs.find((p) => p.offering.featured) ?? programs[0];
  const primaryProgramHasPublishedFee = primaryProgram
    ? hasPublishedUsdAmount(primaryProgram.offering.annualTuitionUsd)
    : false;
  const primaryProgramHasRenderableFee = primaryProgram
    ? hasRenderableProgramAnnualFee(primaryProgram.offering)
    : false;
  const primaryProgramFeeDisplay = primaryProgram
    ? formatProgramAnnualFee(primaryProgram.offering)
    : null;
  const galleryImages = getUniversityGalleryImages(university);
  const coverImage = getUniversityCoverImage(university);
  const additionalGalleryImages = galleryImages.slice(1);
  const pageReviewedAt = university.lastVerifiedAt ?? catalogReviewedAt;
  const feeSourceUrls = [
    ...new Set(primaryProgram?.offering.sourceUrls ?? []),
  ];
  const extraFeeSourceUrls = feeSourceUrls.filter(
    (url) => !university.researchSources.some((source) => source.url === url),
  );

  const path = `/universities/${university.slug}`;
  const primaryCourseStructuredData = primaryProgram
    ? getCourseStructuredData(primaryProgram.course)
    : null;
  const countryStructuredData = getCountryStructuredData(country);
  const universityStructuredData = getUniversityStructuredData({
    university,
    country,
    programs,
    sameAs: [...new Set([
      ...university.recognitionLinks.map((item) => item.url),
      wdomsEntry?.schoolUrl,
    ].filter(Boolean))] as string[],
  });
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Universities", path: "/universities" },
      { name: university.name, path },
    ]),
    countryStructuredData,
    primaryCourseStructuredData,
    getWebPageStructuredData({
      path,
      name: university.name,
      description: university.summary,
      aboutIds: [
        countryStructuredData["@id"],
        primaryCourseStructuredData?.["@id"],
      ].filter(Boolean) as string[],
      mainEntityId: universityStructuredData["@id"],
      datePublished: pageReviewedAt,
      dateModified: pageReviewedAt,
    }),
    universityStructuredData,
    programs.length
      ? getProgramItemListStructuredData({
          path,
          name: `${university.name} program offerings`,
          programs,
        })
      : null,
    university.faq.length ? getFaqStructuredData(university.faq, path) : null,
  ];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
        <div className="hero-grid-lines absolute inset-0 pointer-events-none" />
        <div className="hero-orb hero-orb--warm pointer-events-none absolute -right-16 -top-20 size-96 opacity-30" aria-hidden />
        <div className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-10 left-10 size-72 opacity-50" aria-hidden />

        <div className="relative mx-auto w-[min(1380px,calc(100%-2rem))] py-12 md:py-16">
          <div className={`grid gap-8 lg:items-center lg:gap-12 xl:gap-16 ${coverImage || university.logoUrl ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]" : ""}`}>
            <div className="min-w-0 space-y-6">
              <nav className="flex items-center gap-2 text-xs text-white/50">
                <Link href="/universities" className="transition-colors hover:text-white/80">
                  Universities
                </Link>
                <span>/</span>
                <span className="text-white/70">{university.name}</span>
              </nav>

              <div className="space-y-3">
                <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                  {university.name}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/65 md:text-base md:leading-8">
                  {university.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <MapPinned className="size-4 text-white/50" />
                  <span className="text-sm font-medium text-white/80">{university.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-white/50" />
                  <span className="text-sm font-medium text-white/80">Est. {university.establishedYear}</span>
                </div>
                {primaryProgram && (
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="size-4 text-white/50" />
                    <span className="text-sm font-medium text-white/80">
                      {primaryProgramHasPublishedFee
                        ? `${formatCurrencyUsd(primaryProgram.offering.annualTuitionUsd)} / year`
                        : primaryProgramHasRenderableFee && primaryProgramFeeDisplay
                          ? `${primaryProgramFeeDisplay} / year`
                          : "Fee on official notice"}
                    </span>
                  </div>
                )}
                {primaryProgram && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="size-4 text-white/50" />
                    <span className="text-sm font-medium text-white/80">
                      {formatProgramDuration(primaryProgram.offering.durationYears)} {primaryProgram.course.shortName}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <CounsellingDialog
                  triggerContent="Get free counselling"
                  triggerVariant="accent"
                  triggerSize="default"
                />
                <Button
                  asChild
                  variant="ghost"
                  size="default"
                  className="border border-white/20 bg-white/8 !text-white hover:bg-white/15 hover:!text-white"
                >
                  <Link href="#talk-to-peers">Talk to a student</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-white/60">
                  <PencilLine className="size-3 shrink-0" />
                  <span>By <span className="font-medium text-white/65">{contentAuthorName}</span></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/60">
                  <CalendarDays className="size-3 shrink-0" />
                  <span>Updated <span className="font-medium text-white/65">{formatContentDate(pageReviewedAt)}</span></span>
                </div>
              </div>
            </div>

            <div className="min-w-0 lg:justify-self-end">
              <UniversityHeroMedia
                coverImage={coverImage}
                universityName={university.name}
                logoUrl={university.logoUrl}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <section className="py-10 md:py-14">
        <div className="container-shell">
          <div className="min-w-0 space-y-0">

              {/* At a glance */}
              {primaryProgram && (
                <div className="pb-10">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    At a glance
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <GlanceStat
                      icon={<CircleDollarSign className="size-4 text-accent" />}
                      label={getProgramAnnualFeeLabel(primaryProgram.offering)}
                      value={formatProgramAnnualFee(primaryProgram.offering)}
                    />
                    <GlanceStat
                      icon={<Clock className="size-4 text-accent" />}
                      label="Duration"
                      value={formatProgramDuration(primaryProgram.offering.durationYears)}
                    />
                    <GlanceStat
                      icon={<Languages className="size-4 text-accent" />}
                      label="Medium"
                      value={primaryProgram.offering.medium}
                    />
                    <GlanceStat
                      icon={<CalendarDays className="size-4 text-accent" />}
                      label="Intake"
                      value={primaryProgram.offering.intakeMonths.join(", ")}
                    />
                  </div>
                </div>
              )}

              {/* About */}
              <div className="space-y-6 py-10">
                <SectionLabel>About the university</SectionLabel>
                <p className="text-sm leading-8 text-foreground/80 md:text-base md:leading-9">
                  {university.campusLifestyle}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoCard
                    icon={<MapPinned className="size-4 text-accent" />}
                    title="City & location"
                    body={university.cityProfile}
                  />
                  <InfoCard
                    icon={<ShieldCheck className="size-4 text-accent" />}
                    title="Student support"
                    body={university.studentSupport}
                  />
                </div>
              </div>

              {/* Gallery */}
              {additionalGalleryImages.length > 0 && (
                <div className="deferred-render space-y-6 py-10">
                  <SectionLabel>Gallery</SectionLabel>
                  <div className="grid gap-4 md:grid-cols-2">
                    {additionalGalleryImages.map((image, index) => (
                      <figure
                        key={image.url}
                        className={cn(
                          "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
                          index === 0 && "md:col-span-2"
                        )}
                      >
                        <div
                          className={cn(
                            "relative overflow-hidden bg-muted/40",
                            index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"
                          )}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            sizes={
                              index === 0
                                ? "(max-width: 768px) 100vw, 66vw"
                                : "(max-width: 768px) 100vw, 33vw"
                            }
                            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                          />
                        </div>
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {/* Program */}
              {primaryProgram && (
                <div className="deferred-render space-y-8 py-10">
                  <SectionLabel>Program details</SectionLabel>

                  {/* Program header */}
                  <div className="section-tint rounded-[1.5rem] p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="text-sm">{primaryProgram.course.shortName}</Badge>
                      <Badge variant="outline">{primaryProgram.offering.medium}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{primaryProgram.offering.title}</p>
                  </div>

                  {/* Teaching phases */}
                  {primaryProgram.offering.teachingPhases.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Teaching phases</p>
                      <div className="divide-y divide-border overflow-hidden rounded-[1.25rem] border border-border">
                        {primaryProgram.offering.teachingPhases.map((phase, i) => (
                          <div key={phase.phase} className="flex gap-4 bg-card px-5 py-4">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white mt-0.5">
                              {i + 1}
                            </div>
                            <div className="space-y-1 pt-0.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{phase.phase}</span>
                                <span className="rounded-full border border-accent/25 bg-accent/8 px-2 py-0.5 text-xs font-medium text-accent">
                                  {phase.language}
                                </span>
                              </div>
                              <p className="text-sm leading-6 text-muted-foreground">{phase.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cost breakdown */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Year-wise cost breakdown</p>
                    {primaryProgram.offering.yearlyCostBreakdown.some(
                      (year) =>
                        hasPublishedUsdAmount(year.tuitionUsd) ||
                        hasPublishedUsdAmount(year.livingUsd) ||
                        hasPublishedUsdAmount(year.totalUsd)
                    ) ? (
                      <div className="overflow-hidden rounded-[1.25rem] border border-border">
                        {/* Header row */}
                        <div className="grid grid-cols-[2fr_2fr_2fr_2fr] gap-2 border-b border-border bg-muted/40 px-5 py-3">
                          {["Year", "Tuition", "Living", "Total / yr"].map((h) => (
                            <span key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</span>
                          ))}
                        </div>
                        {/* Data rows */}
                        {primaryProgram.offering.yearlyCostBreakdown.map((year, i) => (
                          <div
                            key={year.yearLabel}
                            className={cn(
                              "grid grid-cols-[2fr_2fr_2fr_2fr] gap-2 px-5 py-4",
                              i % 2 === 0 ? "bg-card" : "bg-muted/20"
                            )}
                          >
                            <span className="text-sm font-semibold text-foreground">{year.yearLabel}</span>
                            <span className="text-sm text-muted-foreground">{formatUsdAmountOrTbd(year.tuitionUsd)}</span>
                            <span className="text-sm text-muted-foreground">{formatUsdAmountOrTbd(year.livingUsd, "—")}</span>
                            <span className="text-sm font-bold text-accent">{formatUsdAmountOrTbd(year.totalUsd)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="section-tint rounded-[1.25rem] px-5 py-4 text-sm leading-7 text-muted-foreground">
                        Official fee publication varies by specialty and admission notice for this postgraduate track. Use the university notice to confirm tuition, hospital practice fees, and any specialty-specific charges.
                      </div>
                    )}
                  </div>

                  {(primaryProgram.offering.feeNotes ||
                    primaryProgram.offering.feeVerifiedAt ||
                    university.lastVerifiedAt ||
                    university.researchNotes ||
                    university.researchSources.length > 0 ||
                    extraFeeSourceUrls.length > 0) && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Research & verification
                      </p>
                      <div className="section-tint rounded-[1.25rem] p-5">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                          {primaryProgram.offering.feeVerifiedAt ? (
                            <span>
                              Fee checked{" "}
                              <span className="font-medium text-foreground">
                                {formatContentDate(primaryProgram.offering.feeVerifiedAt)}
                              </span>
                            </span>
                          ) : null}
                          {university.lastVerifiedAt ? (
                            <span>
                              Profile checked{" "}
                              <span className="font-medium text-foreground">
                                {formatContentDate(university.lastVerifiedAt)}
                              </span>
                            </span>
                          ) : null}
                        </div>

                        {primaryProgram.offering.feeNotes ? (
                          <p className="mt-4 text-sm leading-7 text-muted-foreground">
                            {primaryProgram.offering.feeNotes}
                          </p>
                        ) : null}

                        {university.researchNotes ? (
                          <p className="mt-4 text-sm leading-7 text-muted-foreground">
                            {university.researchNotes}
                          </p>
                        ) : null}

                        {university.researchSources.length > 0 ? (
                          <div className="mt-5">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              Official sources used
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {university.researchSources.map((source) => (
                                <a
                                  key={`${source.url}-${source.checkedAt}`}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                                >
                                  {source.label}
                                  <ExternalLink className="size-3.5" />
                                </a>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {extraFeeSourceUrls.length > 0 ? (
                          <div className="mt-5">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              Fee source pages
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {extraFeeSourceUrls.map((url) => (
                                <a
                                  key={url}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                                >
                                  Fee source
                                  <ExternalLink className="size-3.5" />
                                </a>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}

                </div>
              )}

              <div className="deferred-render py-10">
                <UniversityCounsellingSection
                  universitySlug={university.slug}
                  universityName={university.name}
                  countrySlug={country.slug}
                  countryName={country.name}
                  courseSlug={primaryProgram?.course.slug}
                  courseShortName={primaryProgram?.course.shortName}
                />
              </div>

              {/* Clinical & Student Life */}
              <div className="deferred-render space-y-6 py-10">
                <SectionLabel>Clinical &amp; student experience</SectionLabel>

                {/* Clinical exposure */}
                <div className="section-tint rounded-[1.5rem] p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="size-4 text-accent" />
                    <h3 className="text-sm font-semibold text-foreground">Clinical exposure</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{university.clinicalExposure}</p>
                  {university.teachingHospitals.length > 0 && (
                    <div className="mt-4 border-t border-border/60 pt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Teaching hospitals</p>
                      <ul className="space-y-1.5">
                        {university.teachingHospitals.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Campus / Safety / Support */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <InfoCard
                    icon={<BedDouble className="size-4 text-accent" />}
                    title="Campus environment"
                    body={university.campusLifestyle}
                  />
                  <InfoCard
                    icon={<UtensilsCrossed className="size-4 text-accent" />}
                    title="Student support"
                    body={university.studentSupport}
                  />
                  <InfoCard
                    icon={<ShieldCheck className="size-4 text-accent" />}
                    title="Safety"
                    body={university.safetyOverview}
                  />
                </div>
              </div>

              <div className="deferred-render">
                <Suspense fallback={null}>
                  <UniversityPeerSection
                    universitySlug={university.slug}
                    universityName={university.name}
                  />
                </Suspense>
              </div>

              {/* Who it's right for */}
              <div className="deferred-render space-y-6 py-10">
                <SectionLabel>Who it&apos;s right for</SectionLabel>
                <div className="grid gap-4 sm:grid-cols-3">
                  <FitCard
                    title="Why students choose it"
                    items={university.whyChoose}
                    dotClass="bg-emerald-500"
                    className="border-emerald-200/60 bg-emerald-50/60"
                  />
                  <FitCard
                    title="Things to consider"
                    items={university.thingsToConsider}
                    dotClass="bg-amber-500"
                    className="border-amber-200/60 bg-amber-50/60"
                  />
                  <FitCard
                    title="Best fit for"
                    items={university.bestFitFor}
                    dotClass="bg-accent"
                    className="border-accent/20 bg-accent/5"
                  />
                </div>
              </div>

              {/* Recognition */}
              <div className="deferred-render space-y-6 py-10">
                <SectionLabel>Recognition</SectionLabel>
                <div className="section-tint rounded-[1.5rem] p-5 sm:p-6">
                  <div className="flex flex-wrap gap-2">
                    {university.recognitionBadges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-accent/25 bg-white/80 px-4 py-1.5 text-sm font-medium text-foreground"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    Recognition should always be cross-checked against the current admissions cycle,
                    especially when students are comparing language pathway, licensing fit, and
                    long-term clinical planning.
                  </p>
                  {wdomsEntry ? (
                    <div className="mt-5 rounded-xl border border-border bg-white/80 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Official WDOMS listing
                      </p>
                      <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                        This university appears in the World Directory of Medical
                        Schools
                        {wdomsEntry.schoolName !== university.name
                          ? ` as ${wdomsEntry.schoolName}`
                          : ""}
                        . Use the official listing for directory-level
                        verification, then continue evaluating admissions,
                        teaching language, and India-return planning on this
                        page.
                      </p>
                      <div className="mt-3">
                        <a
                          href={wdomsEntry.schoolUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                        >
                          Open WDOMS listing
                          <ExternalLink className="size-4" />
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Program offerings */}
              {programs.length > 0 && (
                <div className="deferred-render space-y-6 py-10">
                  <SectionLabel>Program offerings</SectionLabel>
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    {programs.map((program) => (
                      <UniversityCard key={program.offering.slug} program={program} />
                    ))}
                  </div>
                </div>
              )}

              <div className="deferred-render">
                <Suspense fallback={null}>
                  <UniversityReviewsSection
                    universitySlug={university.slug}
                    universityName={university.name}
                  />
                </Suspense>
              </div>

              {/* FAQ */}
              {university.faq.length > 0 && (
                <div className="deferred-render space-y-6 py-10">
                  <SectionLabel>Frequently asked questions</SectionLabel>
                  <div className="space-y-2">
                    {university.faq.map((item, i) => (
                      <details
                        key={item.question}
                        open={i === 0}
                        className="group rounded-xl border border-border bg-card px-5"
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-left text-sm font-medium text-foreground marker:hidden">
                          <span>{item.question}</span>
                          <span className="mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <div className="pb-4 text-sm leading-7 text-muted-foreground">
                          {item.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              <div className="deferred-render">
                <Suspense fallback={null}>
                  <UniversityRelatedSection
                    universitySlug={university.slug}
                    countrySlug={university.countrySlug}
                    countryName={country.name}
                  />
                </Suspense>
              </div>
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}

// ── Helper components ──────────────────────────────────────────────────────────

function UniversityHeroMedia({
  coverImage,
  universityName,
  logoUrl,
}: {
  coverImage: UniversityGalleryImage | null;
  universityName: string;
  logoUrl?: string;
}) {
  if (!coverImage && !logoUrl) return null;

  return (
    <figure className="group relative mx-auto w-full max-w-[580px] overflow-hidden rounded-[2rem] border border-white/12 bg-card shadow-[0_30px_100px_-50px_rgba(7,10,19,0.9)]">
      {coverImage && (
        <div className="relative h-[320px] overflow-hidden md:h-[420px] lg:h-[560px]">
          <Image
            src={coverImage.url}
            alt={coverImage.alt}
            width={1160}
            height={1450}
            sizes="(max-width: 1024px) 100vw, (max-width: 1440px) 38vw, 580px"
            loading="eager"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,10,19,0.18),transparent_42%,rgba(7,10,19,0.08))]" />
          {logoUrl && (
            <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5">
              <UniversityLogoBadge
                name={universityName}
                logoUrl={logoUrl}
                className="size-16 border-white/80 bg-white text-surface-dark shadow-lg backdrop-blur-sm md:size-20"
              />
            </div>
          )}
        </div>
      )}
      {!coverImage && logoUrl && (
        <div className="flex items-center justify-center px-10 py-14">
          <UniversityLogoBadge
            name={universityName}
            logoUrl={logoUrl}
            className="size-28 border-white/20 bg-white text-surface-dark shadow-lg md:size-36"
          />
        </div>
      )}
    </figure>
  );
}

function UniversityCounsellingSection({
  universitySlug,
  universityName,
  countrySlug,
  countryName,
  courseSlug,
  courseShortName,
}: {
  universitySlug: string;
  universityName: string;
  countrySlug: string;
  countryName: string;
  courseSlug?: string;
  courseShortName?: string;
}) {
  return (
    <div className="section-tint rounded-[1.75rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent/80">
            Free counselling
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading">
            Need more clarity on {universityName}?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            Talk to one of our counsellors — free, no obligations.
          </p>
        </div>
        <div className="shrink-0">
          <CounsellingDialog
            triggerContent="Talk to a counsellor"
            triggerVariant="default"
            triggerSize="lg"
            triggerClassName="w-full sm:w-auto"
            countrySlug={countrySlug}
            courseSlug={courseSlug}
          />
        </div>
      </div>
    </div>
  );
}

async function UniversityRelatedSection({
  universitySlug,
  countrySlug,
  countryName,
}: {
  universitySlug: string;
  countrySlug: string;
  countryName: string;
}) {
  const [comparisonGuides, countryPrograms] = await Promise.all([
    getComparisonGuidesForUniversity(universitySlug, 10),
    getProgramsForCountry(countrySlug),
  ]);

  const otherCountryPrograms = Array.from(
    new Map(
      countryPrograms
        .filter((program) => program.university.slug !== universitySlug)
        .map((program) => [program.university.slug, program])
    ).values()
  );

  if (comparisonGuides.length === 0 && otherCountryPrograms.length === 0) {
    return null;
  }

  return (
    <>
      {comparisonGuides.length > 0 && (
        <div className="py-10">
          <CardCarousel heading="Compare with similar">
            {comparisonGuides.map((guide) => (
              <CarouselItem key={guide.slug}>
                <ComparisonCard guide={guide} />
              </CarouselItem>
            ))}
          </CardCarousel>
        </div>
      )}

      {otherCountryPrograms.length > 0 && (
        <div className="py-10">
          <CardCarousel heading={`Other universities in ${countryName}`}>
            {otherCountryPrograms.map((program) => (
              <CarouselItem key={program.university.slug}>
                <UniversityCard program={program} />
              </CarouselItem>
            ))}
          </CardCarousel>
        </div>
      )}
    </>
  );
}

function UniversityLogoBadge({
  name,
  logoUrl,
  className,
}: {
  name: string;
  logoUrl?: string;
  className?: string;
}) {
  const initials = getUniversityInitials(name);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border font-semibold",
        className
      )}
    >
      {logoUrl ? (
        <span className="flex h-full w-full items-center justify-center p-[18%]">
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            width={64}
            height={64}
            className="h-full w-full object-contain"
          />
        </span>
      ) : (
        <span className="text-sm font-bold tracking-wide">{initials}</span>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </h2>
  );
}

function GlanceStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
      {icon}
      <div className="space-y-0.5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <p className="text-sm leading-7 text-muted-foreground">{body}</p>
    </div>
  );
}

function FitCard({
  title,
  items,
  dotClass,
  className,
}: {
  title: string;
  items: string[];
  dotClass: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border p-5", className)}>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
            <span className={`mt-2 size-1.5 shrink-0 rounded-full ${dotClass}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
