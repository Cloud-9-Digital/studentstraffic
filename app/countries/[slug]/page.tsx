import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { BookOpen, ChevronRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CountryAccommodationSection } from "@/components/site/country/country-accommodation-section";
import { CountryCostSection, CountryCurrencySection } from "@/components/site/country/country-cost-section";
import { CountryFaqSection } from "@/components/site/country/country-faq-section";
import { CountryHero } from "@/components/site/country/country-hero";
import { CountryLifeSection } from "@/components/site/country/country-life-section";
import { CountryOverviewSection } from "@/components/site/country/country-overview-section";
import { CountryScholarshipsSection } from "@/components/site/country/country-scholarships-section";
import {
  CountryStudyFieldsSection,
  type CountryStudyField,
} from "@/components/site/country/country-study-fields-section";
import {
  CountryUniversitiesSection,
  type CountryUniversityCardData,
} from "@/components/site/country/country-universities-section";
import { CountryVisaSection } from "@/components/site/country/country-visa-section";
import { CountryStudentLifeSection } from "@/components/site/country/country-student-life-section";
import { DeferredCurrencyConverter } from "@/components/site/deferred-currency-converter";
import { RegulatoryAdvisoryPanel } from "@/components/site/regulatory-advisory-panel";
import { Button } from "@/components/ui/button";
import { CounsellingCtaButton } from "@/components/site/counselling-cta-button";
import { catalogReviewedAt } from "@/lib/content-governance";
import {
  getCountryBySlug,
  getLandingPageBySlug,
  getProgramsForCountry,
} from "@/lib/data/catalog";
import type { FinderProgram } from "@/lib/data/types";
import { and, eq, ilike } from "drizzle-orm";
import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";
import { getRecommendedBudgetGuideForCourse } from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getArticleStructuredData,
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getCountryStructuredData,
  getFaqStructuredData,
  getItemListStructuredDataId,
  getProgramItemListStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getCountryHeroImage } from "@/lib/country-media";
import { getInrExchangeRate } from "@/lib/exchange-rate";
import { getLandingPageHref } from "@/lib/routes";
import { getCountryContent } from "@/lib/data/country-content";
import { getCountryVisaContent } from "@/lib/data/country-visa";
import { getCountryRegulatoryAdvisory } from "@/lib/data/regulatory-advisories";
import { getCountryFlagCode } from "@/lib/university-media";
import { formatCurrencyUsd, formatProgramMedium, hasPublishedUsdAmount } from "@/lib/utils";

// Generic fallback used by getCountryHeroImage() when a country has no
// dedicated hero photo yet — matches the constant in lib/country-media.ts.
// When the hero resolves to this exact image we swap in a branded gradient
// treatment instead of showing an unrelated stock photo (see AGENTS.md image
// rules: no generic/irrelevant imagery on the hero).
const GENERIC_COUNTRY_HERO_IMAGE_URL = "/images/home/country-options.jpg";

async function getCountryPageData(slug: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("countries");

  const country = await getCountryBySlug(slug);

  if (!country) {
    return {
      country: null,
      programs: [],
    };
  }

  const programs = await getProgramsForCountry(country.slug);

  return {
    country,
    programs,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { country } = await getCountryPageData(slug);

  if (!country) {
    return { title: "Country Not Found" };
  }

  // Country metadata must stay destination-level even when a country's
  // published catalog is currently dominated by one stream (e.g. Georgia is ~100%
  // MBBS) or spans multiple streams (e.g. Albania covers nursing, medicine,
  // dental, and pharmacy) — do not derive title/description from
  // programs[0], which is an arbitrarily-ordered "first" program and can
  // misrepresent a multi-stream country as course-specific. The dynamic
  // fallback below only applies to a future country added before curated
  // metadata exists for it, and is intentionally generic (not course-locked)
  // for that reason.
  const title = `Study in ${country.name} | Universities, Programs & Fees`;
  const description =
    `Compare universities and programs in ${country.name} by tuition, admissions, student life, and visa process. Explore study options across the fields available in this destination.`;

  return buildIndexableMetadata({
    title,
    description,
    path: `/countries/${country.slug}`,
    keywords: [
      `study in ${country.name}`,
      `${country.name} universities`,
      `${country.name} programs`,
      `${country.name} university fees`,
    ].filter(Boolean) as string[],
  });
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { country, programs } = await getCountryPageData(slug);

  if (!country) {
    notFound();
  }
  const primaryProgram = programs[0];
  const curatedLandingPageHref = primaryProgram
    ? getLandingPageHref(primaryProgram.course.slug, country.slug)
    : null;

  const path = `/countries/${country.slug}`;
  // Structured-data (CollectionPage) description only — not rendered as
  // Structured data must use the same destination-level description as the
  // public metadata; never pull course-specific country metadata from the DB.
  const countryPageDescription =
    `Explore ${country.name} as a study destination with universities, programs, fees, admissions, visa process, and student life context.`;
  const countryStructuredData = getCountryStructuredData(country);

  const publicPrograms = programs.filter((p) => p.university.type === "Public");
  const privatePrograms = programs.filter((p) => p.university.type === "Private");
  const publicCount = publicPrograms.length;
  const privateCount = privatePrograms.length;

  const pricedPrograms = programs.filter((p) =>
    hasPublishedUsdAmount(p.offering.annualTuitionUsd)
  );
  const tuitions = pricedPrograms.map((p) => p.offering.annualTuitionUsd);
  const livings = pricedPrograms
    .map((p) => p.offering.livingUsd)
    .filter((v) => hasPublishedUsdAmount(v));
  const totals = pricedPrograms
    .filter((p) => hasPublishedUsdAmount(p.offering.livingUsd))
    .map((p) => p.offering.annualTuitionUsd + p.offering.livingUsd);
  const minTuition = tuitions.length ? Math.min(...tuitions) : null;
  const maxTuition = tuitions.length ? Math.max(...tuitions) : null;
  const minLiving = livings.length ? Math.min(...livings) : null;
  const maxLiving = livings.length ? Math.max(...livings) : null;
  const minTotal = totals.length ? Math.min(...totals) : null;
  const maxTotal = totals.length ? Math.max(...totals) : null;

  const avgPublicTuition = publicPrograms.filter((p) =>
    hasPublishedUsdAmount(p.offering.annualTuitionUsd)
  ).length
    ? Math.round(
        publicPrograms
          .filter((p) => hasPublishedUsdAmount(p.offering.annualTuitionUsd))
          .reduce((sum, p) => sum + p.offering.annualTuitionUsd, 0) /
          publicPrograms.filter((p) =>
            hasPublishedUsdAmount(p.offering.annualTuitionUsd)
          ).length
      )
    : null;
  const avgPrivateTuition = privatePrograms.filter((p) =>
    hasPublishedUsdAmount(p.offering.annualTuitionUsd)
  ).length
    ? Math.round(
        privatePrograms
          .filter((p) => hasPublishedUsdAmount(p.offering.annualTuitionUsd))
          .reduce((sum, p) => sum + p.offering.annualTuitionUsd, 0) /
          privatePrograms.filter((p) =>
            hasPublishedUsdAmount(p.offering.annualTuitionUsd)
          ).length
      )
    : null;

  const uniqueMediums = [
    ...new Set(
      programs.map((p) =>
        formatProgramMedium(p.offering.medium, p.country.slug),
      ),
    ),
  ];
  const intakeMonths = [...new Set(programs.flatMap((p) => p.offering.intakeMonths))];

  const costRange = formatUsdRange(minTuition, maxTuition);
  const livingRange = formatUsdRange(minLiving, maxLiving);
  const totalRange = formatUsdRange(minTotal, maxTotal);
  const heroPrimaryHref = primaryProgram
    ? `/universities?country=${country.slug}&course=${primaryProgram.course.slug}`
    : `/universities?country=${country.slug}`;
  const heroImage = getCountryHeroImage(country.slug);
  const isBrandedHeroFallback = heroImage.url === GENERIC_COUNTRY_HERO_IMAGE_URL;
  const flagCode = getCountryFlagCode(country.slug);

  const editorialCopy = getCountryEditorialCopy(country.name);
    const countryContent = getCountryContent(country.slug);
    const visaContent = getCountryVisaContent(country.slug);
  const countryAdvisory = getCountryRegulatoryAdvisory(country.slug);
  const heroLeadDisplay = truncateToSentence(editorialCopy.heroLead, 200);
  const overviewLeadShort = truncateToSentence(editorialCopy.overviewLead, 260);

  const studyFields = buildStudyFields(programs);
  const { universities: popularUniversities, totalCount: totalUniversityCount } =
    buildPopularUniversities(programs, 8);

  const lifeQuickFacts = (countryContent?.quickFacts ?? []).filter(
    (f) => !["region", "currency", "climate"].includes(f.label.toLowerCase()) && !/regulatory/i.test(f.label)
  );

  const landingPagePromise = curatedLandingPageHref
    ? getLandingPageBySlug(curatedLandingPageHref.slice(1))
    : Promise.resolve(null);

  const landingPageForFaq = curatedLandingPageHref ? await landingPagePromise : null;
  const faqs =
    landingPageForFaq && landingPageForFaq.faq.length
      ? landingPageForFaq.faq
      : getFallbackCountryFaqs(country.name);

  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "Countries", path: "/countries" },
      { name: country.name, path },
    ]),
    countryStructuredData,
    getCollectionPageStructuredData({
      path,
      name: `Study in ${country.name}`,
      description: countryPageDescription,
      aboutIds: [countryStructuredData["@id"]],
      mainEntityId: programs.length ? getItemListStructuredDataId(path) : undefined,
      datePublished: catalogReviewedAt,
      dateModified: catalogReviewedAt,
    }),
    getArticleStructuredData({
      path,
      headline: `Study in ${country.name}`,
      description: countryPageDescription,
      datePublished: catalogReviewedAt,
      dateModified: catalogReviewedAt,
      image: heroImage.url,
    }),
    programs.length
      ? getProgramItemListStructuredData({
          path,
          name: `${country.name} university options`,
          programs,
        })
      : null,
    faqs.length ? getFaqStructuredData(faqs, path) : null,
  ];

  return (
    <>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />

      <CountryHero
        countryName={country.name}
        flagCode={flagCode}
        region={country.region}
        leadText={heroLeadDisplay}
        heroImage={heroImage}
        isBrandedFallback={isBrandedHeroFallback}
        primaryHref={heroPrimaryHref}
        guideSlot={
          <CounsellingCtaButton
            label="Talk to an advisor"
            countrySlug={country.slug}
            courseSlug={primaryProgram?.course.slug}
            ctaVariant="country_hero"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-primary/15 bg-white px-5 text-sm font-semibold text-primary transition-colors hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          />
        }
      />

      {countryAdvisory ? (
        <section className="border-b border-border/60 bg-[#fff8f2] py-8 md:py-10">
          <div className="container-shell">
            <RegulatoryAdvisoryPanel advisory={countryAdvisory} />
          </div>
        </section>
      ) : null}

      <div className="container-shell space-y-0 divide-y divide-border/60 pb-24">
        <CountryOverviewSection
          countryName={country.name}
          overviewLead={overviewLeadShort}
          whyStudentsChooseIt={country.whyStudentsChooseIt}
          showWhyStudentsChooseIt={!countryAdvisory && Boolean(country.whyStudentsChooseIt)}
        />

        <CountryLifeSection
          countryName={country.name}
          climate={country.climate}
          quickFacts={lifeQuickFacts}
        />

        <CountryStudyFieldsSection
          countryName={country.name}
          countrySlug={country.slug}
          fields={studyFields}
        />

        <CountryUniversitiesSection
          countryName={country.name}
          countrySlug={country.slug}
          universities={popularUniversities}
          totalCount={totalUniversityCount}
          flagCode={flagCode}
        />

        <CountryCostSection
          countryName={country.name}
          costRange={costRange}
          livingRange={livingRange}
          totalRange={totalRange}
          publicCount={publicCount}
          privateCount={privateCount}
          avgPublicTuition={avgPublicTuition ? formatCurrencyUsd(avgPublicTuition) : null}
          avgPrivateTuition={avgPrivateTuition ? formatCurrencyUsd(avgPrivateTuition) : null}
          teachingMediums={uniqueMediums}
          intakeMonths={intakeMonths}
          monthlyCostOfLiving={countryContent?.costOfLiving ?? null}
        />

        <CountryCurrencySection
          countryName={country.name}
          addOnsSlot={
            <Suspense fallback={null}>
              <CountryCostAddOns
                currencyCode={country.currencyCode}
                courseSlug={primaryProgram?.course.slug}
              />
            </Suspense>
          }
        />

        {countryContent?.hostelInfo ? (
          <CountryAccommodationSection countryName={country.name} hostelInfo={countryContent.hostelInfo} />
        ) : null}

        {countryContent?.scholarshipInfo ? (
          <CountryScholarshipsSection countryName={country.name} countrySlug={country.slug} scholarshipInfo={countryContent.scholarshipInfo} />
        ) : null}

          <CountryVisaSection countryName={country.name} countrySlug={country.slug} visaContent={visaContent} />

        <CountryStudentLifeSection countryName={country.name} />

        <CountryFaqSection countryName={country.name} faqs={faqs} />

        <Suspense fallback={null}>
          <CountryRelatedBlogPost countrySlug={country.slug} />
        </Suspense>

      </div>
    </>
  );
}

const getRelatedBlogPostForCountry = unstable_cache(
  async (countrySlug: string) => {
    const db = getDb();

    if (!db) {
      return null;
    }

    const [relatedBlogPost] = await db
      .select({
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
      })
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.status, "published"),
          ilike(blogPosts.slug, `%${countrySlug}%`)
        )
      )
      .limit(1);

    return relatedBlogPost ?? null;
  },
  ["country-related-blog-post"],
  { tags: ["blog"], revalidate: 3600 }
);

async function CountryRelatedBlogPost({
  countrySlug,
}: {
  countrySlug: string;
}) {
  const relatedBlogPost = await getRelatedBlogPostForCountry(countrySlug);

  if (!relatedBlogPost) {
    return null;
  }

  return (
    <div className="py-8">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        From the blog
      </p>
      <Link
        href={`/blog/${relatedBlogPost.slug}`}
        className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
      >
        <BookOpen className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {relatedBlogPost.title}
          </p>
          {relatedBlogPost.excerpt && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {relatedBlogPost.excerpt}
            </p>
          )}
        </div>
        <ChevronRight className="ml-auto mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </Link>
    </div>
  );
}

// ── Data shaping helpers ──────────────────────────────────────────────────

function buildStudyFields(programs: FinderProgram[]): CountryStudyField[] {
  const streams = new Map<
    string,
    {
      universities: Set<string>;
      courses: Map<
        string,
        { slug: string; shortName: string; durationYears: number; universities: Set<string> }
      >;
    }
  >();

  for (const program of programs) {
    const streamKey = program.course.stream;
    if (!streams.has(streamKey)) {
      streams.set(streamKey, { universities: new Set(), courses: new Map() });
    }
    const streamEntry = streams.get(streamKey)!;
    streamEntry.universities.add(program.university.slug);

    if (!streamEntry.courses.has(program.course.slug)) {
      streamEntry.courses.set(program.course.slug, {
        slug: program.course.slug,
        shortName: program.course.shortName,
        durationYears: program.course.durationYears,
        universities: new Set(),
      });
    }
    streamEntry.courses.get(program.course.slug)!.universities.add(program.university.slug);
  }

  return [...streams.entries()]
    .map(([stream, data]) => ({
      stream,
      universityCount: data.universities.size,
      courses: [...data.courses.values()]
        .map((c) => ({
          slug: c.slug,
          shortName: c.shortName,
          durationYears: c.durationYears,
          universityCount: c.universities.size,
        }))
        .sort((a, b) => b.universityCount - a.universityCount),
    }))
    .sort((a, b) => b.universityCount - a.universityCount);
}

function buildPopularUniversities(
  programs: FinderProgram[],
  limit: number
): { universities: CountryUniversityCardData[]; totalCount: number } {
  const byUniversity = new Map<
    string,
    {
      slug: string;
      name: string;
      city: string;
      type: "Public" | "Private";
      logoUrl?: string;
      coverImageUrl?: string;
      featured: boolean;
      courses: Set<string>;
      minTuitionUsd: number | null;
    }
  >();

  for (const program of programs) {
    const university = program.university;
    if (!byUniversity.has(university.slug)) {
      byUniversity.set(university.slug, {
        slug: university.slug,
        name: university.name,
        city: university.city,
        type: university.type,
        logoUrl: university.logoUrl,
        coverImageUrl: university.coverImageUrl,
        featured: university.featured,
        courses: new Set(),
        minTuitionUsd: null,
      });
    }

    const entry = byUniversity.get(university.slug)!;
    entry.courses.add(program.course.slug);

    if (hasPublishedUsdAmount(program.offering.annualTuitionUsd)) {
      entry.minTuitionUsd =
        entry.minTuitionUsd === null
          ? program.offering.annualTuitionUsd
          : Math.min(entry.minTuitionUsd, program.offering.annualTuitionUsd);
    }
  }

  const all: CountryUniversityCardData[] = [...byUniversity.values()].map((u) => ({
    slug: u.slug,
    name: u.name,
    city: u.city,
    type: u.type,
    logoUrl: u.logoUrl,
    coverImageUrl: u.coverImageUrl,
    featured: u.featured,
    courseCount: u.courses.size,
    minTuitionUsd: u.minTuitionUsd,
  }));

  all.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.courseCount !== b.courseCount) return b.courseCount - a.courseCount;
    const aFee = a.minTuitionUsd ?? Number.POSITIVE_INFINITY;
    const bFee = b.minTuitionUsd ?? Number.POSITIVE_INFINITY;
    return aFee - bFee;
  });

  return { universities: all.slice(0, limit), totalCount: all.length };
}

// Country-agnostic, non-fabricated FAQ fallback used when no curated landing
// page (with its own researched FAQ set) exists for this country's primary
// course yet. Kept general on purpose — no country-specific facts here.
function getFallbackCountryFaqs(countryName: string) {
  return [
    {
      question: `How do I choose the right university in ${countryName}?`,
      answer: `Start with your budget, preferred course, and city — then compare shortlisted universities on fees, teaching medium, and hostel setup. Our counsellors can walk you through this comparison once you share your priorities.`,
    },
    {
      question: `What does a realistic budget for ${countryName} look like?`,
      answer: `Tuition and living costs vary by city and university type (public vs private). Use the cost ranges on this page as a starting point, and confirm the current fee schedule directly with the university before you commit.`,
    },
    {
      question: `How does Students Traffic help with admissions in ${countryName}?`,
      answer: `We help you shortlist universities that fit your profile and budget, prepare your application documents, and stay in touch through the admission and visa process.`,
    },
    {
      question: `Is there support once I land in ${countryName}?`,
      answer: `Most universities have an international student office for enrollment and local registration. We also stay reachable for any documentation or admissions questions that come up after you arrive.`,
    },
  ];
}

function truncateToSentence(text: string, maxLength: number) {
  const firstSentence = text.split(/(?<=[.!?])\s/)[0] ?? text;
  if (firstSentence.length <= maxLength) return firstSentence;

  const truncated = firstSentence.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

async function CountryCostAddOns({
  currencyCode,
  courseSlug,
}: {
  currencyCode: string;
  courseSlug?: string;
}) {
  const [exchangeRate, recommendedBudgetGuide] = await Promise.all([
    getInrExchangeRate(currencyCode),
    courseSlug ? getRecommendedBudgetGuideForCourse(courseSlug) : Promise.resolve(null),
  ]);

  if (!exchangeRate && !recommendedBudgetGuide) {
    return null;
  }

  return (
    <>
      {exchangeRate ? (
        <div className="w-full max-w-lg">
          <DeferredCurrencyConverter
            rate={exchangeRate.rate}
            localCurrency={currencyCode}
            date={exchangeRate.date}
          />
        </div>
      ) : null}

      {recommendedBudgetGuide ? (
        <div className="mt-6 w-full max-w-lg rounded-[1.4rem] border border-border/70 bg-[#fff9f2] p-5">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#a06030]">
            Budget guide available
          </p>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            A detailed breakdown of what to budget for across all years of study.
          </p>
          <Button asChild variant="outline" size="sm" className="w-full justify-between">
            <Link href={`/budget/${recommendedBudgetGuide.slug}`}>
              Explore budget guide
            </Link>
          </Button>
        </div>
      ) : null}
    </>
  );
}

function formatUsdRange(minValue: number | null, maxValue: number | null) {
  if (minValue === null || maxValue === null) return null;
  return minValue === maxValue
    ? formatCurrencyUsd(minValue)
    : `${formatCurrencyUsd(minValue)} – ${formatCurrencyUsd(maxValue)}`;
}

function getCountryEditorialCopy(countryName: string) {
  return {
    heroLead: `Explore universities and programs in ${countryName}, with practical details on admissions, fees, student life and the trade-offs between cities and institutions.`,
    overviewLead: `Use this guide to understand ${countryName} as a study destination, then compare the programs and universities that fit your goals, budget and preferred learning environment.`,
  };
}
