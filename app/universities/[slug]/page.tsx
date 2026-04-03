import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { JsonLd } from "@/components/shared/json-ld";
import { ResearchNextSteps } from "@/components/site/research-next-steps";
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
  getCompareIndexHref,
  getCountryHref,
} from "@/lib/routes";
import {
  getUniversityCoverImage,
  getUniversityInitials,
} from "@/lib/university-media";
import {
  formatProgramAnnualFee,
  hasPublishedUsdAmount,
  hasRenderableProgramAnnualFee,
} from "@/lib/utils";

export async function generateStaticParams() {
  const universities = await getUniversities();
  if (universities.length === 0) {
    return [{ slug: "__catalog-fallback__" }];
  }

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

  const [programs, country, wdomsEntry, allUniversities] = await Promise.all([
    getProgramsForUniversity(university.slug),
    getCountryBySlug(university.countrySlug),
    getWdomsDirectoryEntryForUniversity(university.slug),
    getUniversities(),
  ]);

  if (!country) notFound();

  const primaryProgram =
    programs.find((p) => p.offering.featured) ?? programs[0];
  const cityProfile = getSharedCityProfile(
    allUniversities,
    university.countrySlug,
    university.city,
  );
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
              <div className="space-y-5">
                {cityProfile ? (
                  <UniversityCitySection
                    cityProfile={cityProfile}
                    city={university.city}
                    countryName={country.name}
                    universityName={university.name}
                    cityMedia={cityMedia}
                  />
                ) : null}
                <UniversityCountrySection
                  country={country}
                  countryContent={countryContent}
                  countryMedia={countryMedia}
                />
              </div>
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
      <div className="py-10">
        <ResearchNextSteps
          title="Continue researching before you decide"
          description="Strong university pages should lead you into the next useful comparison, not trap you on one profile. Use these paths to validate destination fit, compare alternatives, and widen the shortlist when needed."
          items={[
            {
              href: getCountryHref(countrySlug),
              label: "Destination",
              title: `Explore ${countryName}`,
              description: `Review country-level costs, eligibility, and student-planning context around ${countryName}.`,
            },
            {
              href: getCompareIndexHref(),
              label: "Compare",
              title: "Open comparison guides",
              description: "See similar universities side by side once your shortlist starts narrowing.",
            },
            {
              href: courseSlug ? `/universities?country=${countrySlug}&course=${courseSlug}` : `/universities?country=${countrySlug}`,
              label: "Finder",
              title: courseShortName
                ? `Browse more ${courseShortName} options`
                : `Browse more universities in ${countryName}`,
              description: "Return to the finder to compare fees, city, and intake across multiple options.",
            },
            {
              href: "/students",
              label: "Students",
              title: "Talk to current students",
              description: "Add peer perspective once you have fee and recognition context from the profile.",
            },
          ]}
        />
      </div>

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
