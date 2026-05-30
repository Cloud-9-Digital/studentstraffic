import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { JsonLd } from "@/components/shared/json-ld";
import { CardCarousel, CarouselItem } from "@/components/site/card-carousel";
import { ComparisonCard } from "@/components/site/comparison-card";
import { RecentlyViewedStrip } from "@/components/site/recently-viewed-strip";
import { UniversityPeerSection } from "@/components/site/university-peer-section";
import { UniversityReviewsSection } from "@/components/site/university-reviews-section";
import { UniversityCard } from "@/components/site/university-card";
import { UniversityAcademicsSection } from "@/components/site/university/academics-section";
import { UniversityAdmissionsSection } from "@/components/site/university/admissions-section";
import { UniversityCounsellingSection } from "@/components/site/university/counselling-section";
import {
  UniversityCitySection,
  UniversityCountrySection,
  UniversityOverviewSection,
  UniversitySnapshotSection,
} from "@/components/site/university/content-sections";
import { UniversityFaqSection } from "@/components/site/university/faq-section";
import { UniversityProgramsSection } from "@/components/site/university/programs-section";
import { UniversityRecognitionSection } from "@/components/site/university/recognition-section";
import { UniversitySectionShell } from "@/components/site/university/section-shell";
import { SectionLabel } from "@/components/site/university/shared";
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
  UNIVERSITY_SECTIONS,
  parseUniversitySlug,
} from "@/lib/university-sections";
import {
  formatProgramAnnualFee,
  hasPublishedUsdAmount,
  hasRenderableProgramAnnualFee,
} from "@/lib/utils";
import { ensureNonEmptyStaticParams } from "@/lib/static-params";

const STATIC_UNIVERSITY_SAMPLE_SIZE = 24;

export async function generateStaticParams() {
  const universities = await getUniversities();
  const sample = universities.slice(0, STATIC_UNIVERSITY_SAMPLE_SIZE);
  const params: { slug: string }[] = [];
  for (const university of sample) {
    params.push({ slug: university.slug });
    for (const section of UNIVERSITY_SECTIONS) {
      params.push({ slug: `${university.slug}-${section}` });
    }
  }
  return ensureNonEmptyStaticParams(params, { slug: "__catalog-fallback__" });
}

async function getUniversityPageData(slug: string) {

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

  const cityProfile = country
    ? await getSharedCityProfile(university.countrySlug, university.city)
    : null;

  return {
    university,
    programs,
    country,
    wdomsEntry,
    cityProfile,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const { universitySlug: slug, section } = parseUniversitySlug(rawSlug);
  const { university, country, programs } = await getUniversityPageData(slug);

  if (!university) {
    return { title: "University Not Found" };
  }

  const primaryProgram =
    programs.find((p) => p.offering.featured) ?? programs[0];
  const primaryProgramHasPublishedFee = primaryProgram
    ? hasPublishedUsdAmount(primaryProgram.offering.annualTuitionUsd)
    : false;
  const courseName = primaryProgram?.course.shortName;
  const pathSuffix = section ? `-${section}` : "";

  let title: string;
  let description: string;

  if (section === "programs") {
    title = `${university.name} Programs | ${courseName ?? "MBBS"} Courses & Duration`;
    description = `View all programs offered at ${university.name}, ${university.city} — course duration, medium of instruction, annual intake, and official program details.`;
  } else if (section === "academics") {
    title = `${university.name} Academics | Curriculum, Teaching & Clinical Training`;
    description = `Academic structure, teaching phases, clinical training, and medium of instruction at ${university.name}. Everything Indian students need to know about the curriculum.`;
  } else if (section === "admissions") {
    title = `${university.name} Admissions | How to Apply for ${courseName ?? "MBBS"}`;
    description = `Step-by-step admissions process for ${university.name} — documents required, application timeline, and important deadlines for Indian students applying for ${courseName ?? "MBBS"}.`;
  } else if (section === "eligibility") {
    title = `${university.name} Eligibility | NEET & Admission Requirements`;
    description = `Eligibility criteria for ${university.name} — NEET score requirements, age limit, academic qualifications, and other conditions for Indian students applying for ${courseName ?? "MBBS"}.`;
  } else if (section === "student-life") {
    title = `${university.name} Student Life | Campus, Culture & Indian Community`;
    description = `Campus life, student community, Indian food availability, extracurricular activities, and daily life at ${university.name}, ${university.city}.`;
  } else if (section === "fees") {
    title = courseName
      ? `${university.name} ${courseName} Fee Structure | Tuition & Hostel Costs`
      : `${university.name} Fee Structure | Tuition & Hostel Costs`;
    description = `Detailed year-wise fee breakdown for ${university.name}${courseName ? ` ${courseName}` : ""} — annual tuition, hostel costs, and total program cost in USD. Verified fee data for ${university.city}.`;
  } else if (section === "recognition") {
    title = `${university.name} Recognition | NMC, WHO & International Accreditation`;
    description = `Is ${university.name} recognised by NMC, WHO, and listed in WDOMS? View complete accreditation status, recognition badges, and official verification links.`;
  } else if (section === "hostel") {
    title = `${university.name} Hostel | Accommodation, Food & Student Life`;
    description = `Hostel facilities, Indian food availability, campus lifestyle, and safety at ${university.name}, ${university.city}. Everything Indian students need to know before applying.`;
  } else if (section === "country") {
    title = `${university.name} | About ${country?.name ?? "the Country"} — Study Abroad Guide`;
    description = `Learn about studying ${courseName ?? "medicine"} in ${country?.name ?? "this country"} — climate, culture, safety, currency, and why Indian students choose ${country?.name ?? "this destination"} for medical education.`;
  } else if (section === "city") {
    title = `${university.name} | About ${university.city} — City Guide for Students`;
    description = `Everything Indian students need to know about living in ${university.city} — cost of living, safety, transport, food, and student life near ${university.name}.`;
  } else if (section === "faq") {
    title = `${university.name} FAQ | Common Questions from Indian Students`;
    description = `Answers to the most common questions Indian students ask about ${university.name} — admissions, fees, recognition, hostel, and more.`;
  } else {
    title = primaryProgram
      ? `${university.name} | ${courseName} ${
          primaryProgramHasPublishedFee ? "Fees, " : ""
        }Admissions & Course Details`
      : `${university.name} | University Details`;
    description =
      primaryProgram && country
        ? `${university.summary} Compare ${courseName} ${
            primaryProgramHasPublishedFee ? "annual tuition, " : ""
          }medium of instruction, intake, and student support in ${university.city}, ${country.name}.`
        : university.summary;
  }

  return buildIndexableMetadata({
    title,
    description,
    path: `/university/${university.slug}${pathSuffix}`,
    keywords: [
      university.name,
      primaryProgram
        ? `${courseName} at ${university.name}`
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
  await connection();
  const { slug: rawSlug } = await params;
  const { universitySlug: slug, section } = parseUniversitySlug(rawSlug);

  const { university, programs, country, wdomsEntry, cityProfile } =
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
  const path = section
    ? `/university/${university.slug}-${section}`
    : `/university/${university.slug}`;
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
      <UniversitySectionShell
        initialSection={section}
        universitySlug={university.slug}
        university={university}
        programs={programs}
        primaryProgram={primaryProgram}
        country={country}
        wdomsEntry={wdomsEntry}
        countryContent={countryContent}
        countryAdvisory={countryAdvisory}
        universityAdvisory={universityAdvisory}
        cityMedia={cityMedia}
        countryMedia={countryMedia}
        cityProfile={cityProfile}
        coverImage={coverImage}
        logoUrl={university.logoUrl ?? undefined}
        logoInitials={getUniversityInitials(university.name)}
        primaryProgramFeeDisplay={primaryProgramFeeDisplay}
        primaryProgramHasPublishedFee={primaryProgramHasPublishedFee}
        primaryProgramHasRenderableFee={primaryProgramHasRenderableFee}
        primaryProgramDurationYears={primaryProgram?.offering.durationYears}
        primaryProgramShortName={primaryProgram?.course.shortName}
        lastVerifiedAt={pageReviewedAt}
      >
        {/* Overview content — server-rendered, shown when no section is active */}
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

          <RecentlyViewedStrip currentSlug={university.slug} />
        </div>
      </UniversitySectionShell>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}

async function getSharedCityProfileForUniversity(countrySlug: string, city: string) {
  "use cache";
  cacheTag(`city-profile:${countrySlug}:${city.toLowerCase()}`);

  return getSharedCityProfile(countrySlug, city);
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
