import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { JsonLd } from "@/components/shared/json-ld";
import { CardCarousel, CarouselItem } from "@/components/site/card-carousel";
import { ComparisonCard } from "@/components/site/comparison-card";
import { UniversityPeerSection } from "@/components/site/university-peer-section";
import { UniversityReviewsSection } from "@/components/site/university-reviews-section";
import { UniversityAdmissionsSection } from "@/components/site/university/admissions-section";
import { UniversityCard } from "@/components/site/university-card";
import { UniversityAcademicsSection } from "@/components/site/university/academics-section";
import { UniversityCounsellingSection } from "@/components/site/university/counselling-section";
import {
  UniversityCitySection,
  UniversityCountrySection,
  UniversityOverviewSection,
  UniversitySnapshotSection,
} from "@/components/site/university/content-sections";
import { UniversityFaqSection } from "@/components/site/university/faq-section";
import { UniversityHeroSection } from "@/components/site/university/hero-section";
import { UniversityProgramsSection } from "@/components/site/university/programs-section";
import { UniversityRecognitionSection } from "@/components/site/university/recognition-section";
import { SectionLabel } from "@/components/site/university/shared";
import { UniversityPageNav } from "@/components/site/university/sticky-nav";
import { UniversityStudentLifeSection } from "@/components/site/university/student-life-section";
import { catalogReviewedAt } from "@/lib/content-governance";
import {
  getComparisonGuidesForUniversity,
} from "@/lib/discovery-pages";
import {
  getCountryContent,
} from "@/lib/data/country-content";
import {
  getCountryRegulatoryAdvisory,
  getUniversityRegulatoryAdvisory,
} from "@/lib/data/regulatory-advisories";
import {
  getCountryBySlug,
  getProgramsForCountry,
  getProgramsForUniversity,
  getUniversities,
  getUniversityBySlug,
  getWdomsDirectoryEntryForUniversity,
} from "@/lib/data/catalog";
import { getSharedCityProfile } from "@/lib/data/city-content";
import { getCityMedia, getCountryMedia } from "@/lib/location-media";
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
  getUniversityInitials,
} from "@/lib/university-media";
import {
  formatProgramAnnualFee,
  hasPublishedUsdAmount,
  hasRenderableProgramAnnualFee,
} from "@/lib/utils";
import { ensureNonEmptyStaticParams } from "@/lib/static-params";

const STATIC_UNIVERSITY_SAMPLE_SIZE = 24;

export async function generateStaticParams() {
  const universities = await getUniversities();
  return ensureNonEmptyStaticParams(
    // With Cache Components enabled, we only need a non-empty sample here.
    // The rest of the catalog can be rendered on first request and cached,
    // which keeps production builds from timing out on the entire university set.
    universities
      .slice(0, STATIC_UNIVERSITY_SAMPLE_SIZE)
      .map((university) => ({ slug: university.slug })),
    { slug: "__catalog-fallback__" },
  );
}

async function getUniversityPageData(slug: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("universities");

  const university = await getUniversityBySlug(slug);

  if (!university) {
    return {
      university: null,
      programs: [],
      country: null,
      wdomsEntry: null,
    };
  }

  const [programs, country, wdomsEntry] = await Promise.all([
    getProgramsForUniversity(university.slug),
    getCountryBySlug(university.countrySlug),
    getWdomsDirectoryEntryForUniversity(university.slug),
  ]);

  return {
    university,
    programs,
    country,
    wdomsEntry,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { university, country, programs } = await getUniversityPageData(slug);

  if (!university) {
    return { title: "University Not Found" };
  }

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
  const { university, programs, country, wdomsEntry } =
    await getUniversityPageData(slug);

  if (!university) notFound();

  if (!country) notFound();

  const primaryProgram =
    programs.find((p) => p.offering.featured) ?? programs[0];
  const countryContent = getCountryContent(country.slug);
  const countryAdvisory = getCountryRegulatoryAdvisory(country.slug);
  const universityAdvisory = getUniversityRegulatoryAdvisory(
    country.slug,
    university.slug
  );
  const cityMedia = getCityMedia(university.countrySlug, university.city);
  const countryMedia = getCountryMedia(country.slug);
  const primaryProgramHasPublishedFee = primaryProgram
    ? hasPublishedUsdAmount(primaryProgram.offering.annualTuitionUsd)
    : false;
  const primaryProgramHasRenderableFee = primaryProgram
    ? hasRenderableProgramAnnualFee(primaryProgram.offering)
    : false;
  const primaryProgramFeeDisplay = primaryProgram
    ? formatProgramAnnualFee(primaryProgram.offering)
    : null;
  const coverImage = getUniversityCoverImage(university);
  const pageReviewedAt = university.lastVerifiedAt ?? catalogReviewedAt;
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
      <UniversityHeroSection
        universityName={university.name}
        universitySummary={university.summary}
        city={university.city}
        establishedYear={university.establishedYear}
        logoUrl={university.logoUrl}
        coverImage={coverImage}
        logoInitials={getUniversityInitials(university.name)}
        primaryProgramFeeDisplay={primaryProgramFeeDisplay}
        primaryProgramHasPublishedFee={primaryProgramHasPublishedFee}
        primaryProgramHasRenderableFee={primaryProgramHasRenderableFee}
        primaryProgramDurationYears={primaryProgram?.offering.durationYears}
        primaryProgramShortName={primaryProgram?.course.shortName}
      />

      <UniversityPageNav />

      <section className="py-10 md:py-14">
        <div className="container-shell">
          <div className="min-w-0 space-y-0">
            {primaryProgram ? (
              <UniversitySnapshotSection
                primaryProgram={primaryProgram}
                university={university}
                country={country}
              />
            ) : null}

            <UniversityOverviewSection university={university} country={country} />

            {programs.length > 0 ? (
              <UniversityProgramsSection programs={programs} />
            ) : null}

            {primaryProgram ? (
              <UniversityAcademicsSection
                university={university}
                primaryProgram={primaryProgram}
              />
            ) : null}

            <UniversityAdmissionsSection
              university={university}
              primaryProgram={primaryProgram}
              countryContent={countryContent}
              countryAdvisory={countryAdvisory}
              universityAdvisory={universityAdvisory}
              wdomsEntry={wdomsEntry}
            />

            <UniversityStudentLifeSection university={university} />

            <UniversityRecognitionSection
              university={university}
              wdomsEntry={wdomsEntry}
            />

            <div id="student-perspective" className="deferred-render scroll-mt-24 py-10">
              <SectionLabel>Student perspective</SectionLabel>
              <div className="mt-6 space-y-8">
                <div id="talk-to-peers" className="scroll-mt-16">
                  <Suspense fallback={null}>
                    <UniversityPeerSection
                      universitySlug={university.slug}
                      universityName={university.name}
                    />
                  </Suspense>
                </div>

                <Suspense fallback={null}>
                  <UniversityReviewsSection
                    universitySlug={university.slug}
                    universityName={university.name}
                  />
                </Suspense>
              </div>
            </div>

            <div className="deferred-render py-10">
              <UniversityCounsellingSection
                universityName={university.name}
                countrySlug={country.slug}
                courseSlug={primaryProgram?.course.slug}
              />
            </div>

            {/* Location context — kept compact, placed near end */}
            <div className="deferred-render space-y-5 py-10">
              <SectionLabel>Location context</SectionLabel>
              <Suspense fallback={<UniversityCountrySection country={country} countryContent={countryContent} countryMedia={countryMedia} />}>
                <UniversityLocationContextSection
                  country={country}
                  countryContent={countryContent}
                  countryMedia={countryMedia}
                  countrySlug={university.countrySlug}
                  city={university.city}
                  universityName={university.name}
                  cityMedia={cityMedia}
                />
              </Suspense>
            </div>

            <UniversityFaqSection faq={university.faq} />

            <div className="deferred-render">
              <Suspense fallback={null}>
                <UniversityRelatedSection
                  universitySlug={university.slug}
                  countrySlug={university.countrySlug}
                  countryName={country.name}
                  courseSlug={primaryProgram?.course.slug}
                  courseShortName={primaryProgram?.course.shortName}
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

async function getSharedCityProfileForUniversity(countrySlug: string, city: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("universities");
  cacheTag(`city-profile:${countrySlug}:${city.toLowerCase()}`);

  const universities = await getUniversities();
  return getSharedCityProfile(universities, countrySlug, city);
}

async function UniversityLocationContextSection({
  country,
  countryContent,
  countryMedia,
  countrySlug,
  city,
  universityName,
  cityMedia,
}: {
  country: Awaited<ReturnType<typeof getCountryBySlug>>;
  countryContent: ReturnType<typeof getCountryContent>;
  countryMedia: ReturnType<typeof getCountryMedia>;
  countrySlug: string;
  city: string;
  universityName: string;
  cityMedia: ReturnType<typeof getCityMedia>;
}) {
  const cityProfile = await getSharedCityProfileForUniversity(countrySlug, city);

  return (
    <div className="space-y-5">
      {cityProfile ? (
        <UniversityCitySection
          cityProfile={cityProfile}
          city={city}
          countryName={country!.name}
          universityName={universityName}
          cityMedia={cityMedia}
        />
      ) : null}
      <UniversityCountrySection
        country={country!}
        countryContent={countryContent}
        countryMedia={countryMedia}
      />
    </div>
  );
}

async function getUniversityRelatedData(universitySlug: string, countrySlug: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("comparison-guides");
  cacheTag(`university-related:${universitySlug}`);
  cacheTag(`country-programs:${countrySlug}`);

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
  ).slice(0, 12);

  return { comparisonGuides, otherCountryPrograms };
}

async function UniversityRelatedSection({
  universitySlug,
  countrySlug,
  countryName,
  courseSlug,
  courseShortName,
}: {
  universitySlug: string;
  countrySlug: string;
  countryName: string;
  courseSlug?: string;
  courseShortName?: string;
}) {
  const { comparisonGuides, otherCountryPrograms } =
    await getUniversityRelatedData(universitySlug, countrySlug);

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
