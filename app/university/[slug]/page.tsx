import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { cache, Suspense } from "react";

import { JsonLd } from "@/components/shared/json-ld";
import { CardCarousel, CarouselItem } from "@/components/site/card-carousel";
import { ComparisonCard } from "@/components/site/comparison-card";
import { RecentlyViewedStrip } from "@/components/site/recently-viewed-strip";
import { UniversityPeerSection } from "@/components/site/university-peer-section";
import { UniversityReviewsSection } from "@/components/site/university-reviews-section";
import { UniversityCard } from "@/components/site/university-card";
import { UniversityCounsellingSection } from "@/components/site/university/counselling-section";
import { UniversityOverviewSection, UniversitySnapshotSection } from "@/components/site/university/content-sections";
import { UniversityFaqSection } from "@/components/site/university/faq-section";
import { TabbedFaqSection } from "@/components/site/university/tabbed-faq-section";
import { getUniversityFaqSections } from "@/lib/data/university-faq-sections";
import { UniversityProgramsSection } from "@/components/site/university/programs-section";
import { UniversitySectionShell } from "@/components/site/university/section-shell";
import { SectionLabel } from "@/components/site/university/shared";
import { UniversityStudentLifeSection } from "@/components/site/university/student-life-section";
import { getAuthor } from "@/lib/authors";
import { catalogReviewedAt } from "@/lib/content-governance";
import { getUniversityAuthorSlug } from "@/lib/university-authors";
import {
  getComparisonGuidesForUniversity,
} from "@/lib/discovery-pages";
import {
  cityNameToSlug,
  getCountryBySlug,
  queryFinderCardProgramsPage,
  getProgramsForUniversity,
  getPublishedUniversityParams,
  getUniversityBySlug,
} from "@/lib/data/catalog";
import { getCityHref, getCountryHref, getUniversityProgramHref } from "@/lib/routes";
import { getRelatedContent } from "@/lib/data/related-content";
import { RelatedContentSection } from "@/components/site/related-content-section";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  buildUniversityMetadata,
  selectFlagshipProgram,
} from "@/lib/university-metadata";
import {
  getArticleStructuredData,
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
import { parseUniversitySlug } from "@/lib/university-sections";
import { ensureNonEmptyStaticParams } from "@/lib/static-params";

// Cap build-time enumeration so build times stay bounded as the catalog grows —
// this project uses Cache Components, where slugs outside generateStaticParams
// already render on-demand by default (dynamicParams isn't available under
// cacheComponents) and get cached by the existing cacheLife("hours")/cacheTag()
// machinery below.
// 34 published universities are featured. This modest buffer keeps the
// static build bounded while covering all featured pages plus newly promoted
// entries awaiting the next publish.
const MAX_STATIC_UNIVERSITY_PARAMS = 40;

export async function generateStaticParams() {
  const capped = await getPublishedUniversityParams(
    MAX_STATIC_UNIVERSITY_PARAMS,
  );
  const params: { slug: string }[] = [];
  for (const university of capped) {
    params.push({ slug: university.slug });
  }
  return ensureNonEmptyStaticParams(params, { slug: "__catalog-fallback__" });
}

// Redirects for the pre-2026-07-08 URL structure, where Academics/Admissions/Eligibility/Fees/
// Recognition and Country/City lived as /university/[slug]-{section} suffixes on this page. Those
// sections now live on each program's own page (or the existing /countries, /cities pages).
const LEGACY_PROGRAM_SECTION_SUFFIXES = [
  "recognition",
  "eligibility",
  "admissions",
  "academics",
  "fees",
] as const;
const LEGACY_LOCATION_SUFFIXES = ["country", "city"] as const;

function stripLegacySuffix(slug: string, suffixes: readonly string[]) {
  for (const suffix of suffixes) {
    if (slug.endsWith(`-${suffix}`)) {
      return { base: slug.slice(0, -(suffix.length + 1)), suffix };
    }
  }
  return null;
}

async function redirectLegacySectionUrl(rawSlug: string) {
  const legacyProgramMatch = stripLegacySuffix(rawSlug, LEGACY_PROGRAM_SECTION_SUFFIXES);
  if (legacyProgramMatch) {
    const university = await getUniversityBySlug(legacyProgramMatch.base);
    if (university) {
      const programs = await getProgramsForUniversity(university.slug);
      const primaryProgram = selectFlagshipProgram(programs);
      if (primaryProgram) {
        const newSection =
          legacyProgramMatch.suffix === "academics" ? null : legacyProgramMatch.suffix;
        const base = getUniversityProgramHref(primaryProgram.offering.slug);
        redirect(newSection ? `${base}-${newSection}` : base);
      }
    }
  }

  const legacyLocationMatch = stripLegacySuffix(rawSlug, LEGACY_LOCATION_SUFFIXES);
  if (legacyLocationMatch) {
    const university = await getUniversityBySlug(legacyLocationMatch.base);
    if (university) {
      if (legacyLocationMatch.suffix === "city") {
        redirect(getCityHref(cityNameToSlug(university.city)));
      }
      const country = await getCountryBySlug(university.countrySlug);
      if (country) {
        redirect(getCountryHref(country.slug));
      }
    }
  }
}

// Memoized with React's cache() so generateMetadata and the page body share
// one fetch per request instead of two independent ones. Two independent
// async data-fetch calls can resolve at different points relative to Next's
// PPR postpone/resume boundaries, which was producing "Expected the resume
// to render <div> ... instead it rendered <__next_metadata_boundary__>"
// errors and forcing a full client-render fallback on ~30% of requests
// across this and the sibling [slug]/compare templates.
const getUniversityPageData = cache(async (slug: string) => {
  const university = await getUniversityBySlug(slug);

  if (!university) {
    return {
      university: null,
      programs: [],
      country: null,
    };
  }

  const [programs, country] = await Promise.all([
    getProgramsForUniversity(university.slug),
    getCountryBySlug(university.countrySlug),
  ]);

  return {
    university,
    programs,
    country,
  };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await connection();
  const { slug: rawSlug } = await params;
  const { universitySlug: slug, section } = parseUniversitySlug(rawSlug);
  const { university, country, programs } = await getUniversityPageData(slug);

  if (!university) {
    return { title: "University Not Found" };
  }

  const pathSuffix = section ? `-${section}` : "";
  const { title, description, keywords } = buildUniversityMetadata({
    university,
    country,
    programs,
    section,
  });

  return buildIndexableMetadata({
    title,
    description,
    path: `/university/${university.slug}${pathSuffix}`,
    keywords,
  });
}

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Universities are published continuously between deployments, and only a small
  // subset is enumerated by generateStaticParams. Without a request boundary,
  // every slug outside that subset is served the build-time fallback shell,
  // which renders "not found" (this took the whole catalogue offline on
  // 2026-09-09). connection() keeps the render per request while every
  // database read below stays behind the long-lived "use cache" layer, so
  // Neon is not queried per request.
  await connection();
  const { slug: rawSlug } = await params;

  await redirectLegacySectionUrl(rawSlug);

  const { universitySlug: slug, section } = parseUniversitySlug(rawSlug);

  const { university, programs, country } = await getUniversityPageData(slug);

  if (!university) notFound();

  if (!country) notFound();

  const primaryProgram = selectFlagshipProgram(programs);
  const coverImage = getUniversityCoverImage(university);
  const pageReviewedAt = university.lastVerifiedAt || catalogReviewedAt;
  const authorSlug = getUniversityAuthorSlug(university.slug);
  const author = authorSlug ? getAuthor(authorSlug) : null;
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
    sameAs: [...new Set(university.recognitionLinks.map((item) => item.url))],
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
    getArticleStructuredData({
      path,
      headline: university.name,
      description: university.summary,
      datePublished: pageReviewedAt,
      dateModified: pageReviewedAt,
      image: coverImage?.url,
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
        coverImage={coverImage}
        logoUrl={university.logoUrl ?? undefined}
        logoInitials={getUniversityInitials(university.name)}
        primaryProgramShortName={primaryProgram?.course.shortName}
        lastVerifiedAt={pageReviewedAt}
        author={author}
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

          <UniversityStudentLifeSection university={university} />

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
              universitySlug={university.slug}
              countrySlug={country.slug}
              courseSlug={primaryProgram?.course.slug}
            />
          </div>

          {(() => {
            const faqSections = getUniversityFaqSections(university.slug);
            return faqSections ? (
              <TabbedFaqSection
                sections={faqSections}
                universityName={university.name}
                city={university.city}
                primaryProgramShortName={primaryProgram?.course.shortName}
              />
            ) : (
              <UniversityFaqSection faq={university.faq} />
            );
          })()}

          <div className="deferred-render">
            <Suspense fallback={null}>
              <UniversityRelatedSection
                universitySlug={university.slug}
                countrySlug={university.countrySlug}
                countryName={country.name}
                courseSlug={primaryProgram?.course.slug}
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

async function getUniversityRelatedData(
  universitySlug: string,
  countrySlug: string,
  courseSlug?: string,
) {
  const [comparisonGuides, countryPrograms, relatedContent] = await Promise.all([
    getComparisonGuidesForUniversity(universitySlug, 10),
    queryFinderCardProgramsPage({ country: countrySlug }, 1, 13),
    getRelatedContent({ countrySlug, courseSlug, excludeSlug: universitySlug, limit: 6 }),
  ]);

  const otherCountryPrograms = countryPrograms.programs
    .filter((program) => program.university.slug !== universitySlug)
    .slice(0, 12);

  const relatedGuides = relatedContent.filter((item) => item.type === "guide");

  return { comparisonGuides, otherCountryPrograms, relatedGuides };
}

async function UniversityRelatedSection({
  universitySlug,
  countrySlug,
  countryName,
  courseSlug,
}: {
  universitySlug: string;
  countrySlug: string;
  countryName: string;
  courseSlug?: string;
}) {
  const { comparisonGuides, otherCountryPrograms, relatedGuides } =
    await getUniversityRelatedData(universitySlug, countrySlug, courseSlug);

  if (comparisonGuides.length === 0 && otherCountryPrograms.length === 0 && relatedGuides.length === 0) {
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

      <RelatedContentSection items={relatedGuides} />
    </>
  );
}
