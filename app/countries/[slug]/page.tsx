import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { BookOpen, ChevronRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CountryAccommodationSection } from "@/components/site/country/country-accommodation-section";
import { CountryCostSection } from "@/components/site/country/country-cost-section";
import { CountryFaqSection } from "@/components/site/country/country-faq-section";
import { CountryFinalCta } from "@/components/site/country/country-final-cta";
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
import { catalogReviewedAt } from "@/lib/content-governance";
import {
  getCountries,
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
import { getCountryRegulatoryAdvisory } from "@/lib/data/regulatory-advisories";
import { getCountryFlagCode } from "@/lib/university-media";
import { formatCurrencyUsd, formatProgramMedium, hasPublishedUsdAmount } from "@/lib/utils";
import { ensureNonEmptyStaticParams } from "@/lib/static-params";

// Generic fallback used by getCountryHeroImage() when a country has no
// dedicated hero photo yet — matches the constant in lib/country-media.ts.
// When the hero resolves to this exact image we swap in a branded gradient
// treatment instead of showing an unrelated stock photo (see AGENTS.md image
// rules: no generic/irrelevant imagery on the hero).
const GENERIC_COUNTRY_HERO_IMAGE_URL = "/images/home/country-options.jpg";

export async function generateStaticParams() {
  const countries = await getCountries();
  return ensureNonEmptyStaticParams(
    countries.map((country) => ({ slug: country.slug })),
    { slug: "__country-fallback__" },
  );
}

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
  const { country, programs } = await getCountryPageData(slug);

  if (!country) {
    return { title: "Country Not Found" };
  }

  const primaryCourse = programs[0]?.course.shortName;
  const title = primaryCourse
    ? `Study ${primaryCourse} in ${country.name} | Universities, Fees, Cities & Teaching`
    : `Study in ${country.name} | Universities, Fees, Cities & Teaching`;
  const description = primaryCourse
    ? `Compare ${primaryCourse} universities in ${country.name} by fees, city, teaching medium, and NMC recognition. Intake details and student support context for Indian students.`
    : `Compare universities in ${country.name} by fees, city, and teaching medium. Intake details and student support context for Indian students.`;

  return buildIndexableMetadata({
    title,
    description,
    path: `/countries/${country.slug}`,
    keywords: [
      `study in ${country.name}`,
      primaryCourse ? `${primaryCourse} in ${country.name}` : undefined,
      primaryCourse ? `${primaryCourse} ${country.name} fees` : undefined,
      `${country.name} universities`,
      `${country.name} medical university`,
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
  const countryPageDescription = primaryProgram
    ? `Explore ${country.name} as a study destination for ${primaryProgram.course.shortName} with universities, fee range, city spread, teaching language, and intake context.`
    : `Explore ${country.name} as a study destination with universities, fee range, city spread, teaching language, and intake context.`;
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

  const uniqueCities = [...new Set(programs.map((p) => p.university.city))];
  const uniqueUniversitySlugs = new Set(programs.map((p) => p.university.slug));
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

  const editorialCopy = getCountryEditorialCopy({
    slug: country.slug,
    summary: country.summary,
    whyStudentsChooseIt: country.whyStudentsChooseIt,
  });
  const countryContent = getCountryContent(country.slug);
  const countryAdvisory = getCountryRegulatoryAdvisory(country.slug);
  const heroLeadDisplay = truncateToSentence(editorialCopy.heroLead, 200);
  const climateSummary = truncateToSentence(country.climate, 40);
  const overviewLeadShort = truncateToSentence(editorialCopy.overviewLead, 260);

  const studyFields = buildStudyFields(programs);
  const { universities: popularUniversities, totalCount: totalUniversityCount } =
    buildPopularUniversities(programs, 6);

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
        currencyCode={country.currencyCode}
        climateSummary={climateSummary}
        leadText={heroLeadDisplay}
        heroImage={heroImage}
        isBrandedFallback={isBrandedHeroFallback}
        stats={{
          universities: uniqueUniversitySlugs.size,
          cities: uniqueCities.length,
          studyFields: studyFields.length,
        }}
        primaryHref={heroPrimaryHref}
        guideSlot={
          primaryProgram && curatedLandingPageHref ? (
            <Suspense
              fallback={
                <div
                  aria-hidden="true"
                  className="h-12 w-44 rounded-xl border border-white/20 bg-white/5"
                />
              }
            >
              <CountryHeroGuideLink
                landingPagePromise={landingPagePromise}
                href={curatedLandingPageHref}
                courseLabel={primaryProgram.course.shortName}
              />
            </Suspense>
          ) : undefined
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
          <CountryScholarshipsSection countryName={country.name} scholarshipInfo={countryContent.scholarshipInfo} />
        ) : null}

        <CountryVisaSection countryName={country.name} countrySlug={country.slug} />

        <CountryStudentLifeSection countryName={country.name} />

        <CountryFaqSection countryName={country.name} faqs={faqs} />

        <Suspense fallback={null}>
          <CountryRelatedBlogPost countrySlug={country.slug} />
        </Suspense>

        <CountryFinalCta
          countryName={country.name}
          countrySlug={country.slug}
          courseSlug={primaryProgram?.course.slug}
          primaryHref={heroPrimaryHref}
        />
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

async function CountryHeroGuideLink({
  landingPagePromise,
  href,
  courseLabel,
}: {
  landingPagePromise: Promise<Awaited<ReturnType<typeof getLandingPageBySlug>>>;
  href: string;
  courseLabel: string;
}) {
  const landingPage = await landingPagePromise;

  if (!landingPage) {
    return null;
  }

  return (
    <Button
      asChild
      size="lg"
      variant="outline"
      className="!bg-transparent !text-white !border-white/30 hover:!bg-white/20 hover:!text-white hover:!border-white/50"
    >
      <Link href={href}>Open {courseLabel} guide</Link>
    </Button>
  );
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
        <div className="mt-10 max-w-sm">
          <DeferredCurrencyConverter
            rate={exchangeRate.rate}
            localCurrency={currencyCode}
            date={exchangeRate.date}
          />
        </div>
      ) : null}

      {recommendedBudgetGuide ? (
        <div className="mt-6 max-w-sm rounded-[1.4rem] border border-border/70 bg-[#fff9f2] p-5">
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

function getCountryEditorialCopy({
  slug,
  summary,
  whyStudentsChooseIt,
}: {
  slug: string;
  summary: string;
  whyStudentsChooseIt: string;
}) {
  const overrides: Record<string, { heroLead: string; overviewLead: string }> = {
    russia: {
      heroLead:
        "Russia remains one of the most established destinations for Indian students looking for large public medical universities, long-running MBBS infrastructure, and multiple cities with mature study ecosystems.",
      overviewLead:
        "The country-level story is about scale: more institutions, more city variation, and clearer differences between legacy public universities and smaller private options.",
    },
    vietnam: {
      heroLead:
        "Vietnam is a closer-to-home option for students comparing a smaller set of urban medical universities and shorter travel from India.",
      overviewLead:
        "The most useful comparison points are city, teaching language support, and whether the full course structure fits your India-return plans.",
    },
    georgia: {
      heroLead:
        "Georgia attracts students who prioritise English-medium delivery, compact urban study environments, and universities that can feel easier to navigate for first-time international families.",
      overviewLead:
        "The country view matters here because teaching language, city experience, and student support can differ noticeably even when headline fees look similar.",
    },
    kyrgyzstan: {
      heroLead:
        "Kyrgyzstan is usually evaluated for affordability first, but the real differences appear in hostel access, city infrastructure, academic support, and how each university handles international students.",
      overviewLead:
        "This destination makes the most sense when you compare beyond the lowest fee and look at whether the city, campus setup, and support model suit the student.",
    },
    uzbekistan: {
      heroLead:
        "Uzbekistan may still look affordable on paper, but Indian students now need much tighter due diligence after the 1 April 2026 NMC alert and Embassy-reported concerns on standards, training, and agent-led admissions.",
      overviewLead:
        "The real question is no longer just fees. It is whether the exact university, branch, teaching medium, clinical training, and internship pathway stay aligned with FMGL 2021 and the India-return licensing route.",
    },
  };

  const override = overrides[slug];

  return {
    heroLead: override?.heroLead ?? summary,
    overviewLead:
      override?.overviewLead ??
      `${whyStudentsChooseIt} Country-level guidance is most useful when it helps you understand the structure of the destination before you move into university-level differences.`,
  };
}
