import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LeadForm } from "@/components/site/lead-form";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { SectionHeading } from "@/components/site/section-heading";
import { UniversityCard } from "@/components/site/university-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  catalogReviewedAt,
  countUniqueSources,
} from "@/lib/content-governance";
import {
  getCountries,
  getCountryBySlug,
  getLandingPageBySlug,
  getProgramsForCountry,
} from "@/lib/data/catalog";
import { getRecommendedBudgetGuideForCourse } from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/json-ld";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getCountryStructuredData,
  getItemListStructuredDataId,
  getProgramItemListStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getLandingPageHref } from "@/lib/routes";

export async function generateStaticParams() {
  const countries = await getCountries();
  return countries.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);

  if (!country) {
    return { title: "Country Not Found" };
  }

  const programs = await getProgramsForCountry(country.slug);
  const primaryCourse = programs[0]?.course.shortName;

  return buildIndexableMetadata({
    title: primaryCourse
      ? `${country.metaTitle} | ${primaryCourse} Universities, Fees & Admissions`
      : country.metaTitle,
    description: country.metaDescription,
    path: `/countries/${country.slug}`,
    keywords: [
      `study in ${country.name}`,
      primaryCourse ? `${primaryCourse} in ${country.name}` : undefined,
      `${country.name} universities`,
      `${country.name} hostel`,
      country.region,
    ].filter(Boolean) as string[],
  });
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const programs = await getProgramsForCountry(country.slug);
  const primaryProgram = programs[0];
  const curatedLandingPageHref = primaryProgram
    ? getLandingPageHref(primaryProgram.course.slug, country.slug)
    : null;
  const recommendedBudgetGuide = primaryProgram
    ? await getRecommendedBudgetGuideForCourse(primaryProgram.course.slug)
    : null;
  const sourceCount = countUniqueSources(
    ...programs.map((program) => program.university.references),
    ...programs.map((program) => program.university.recognitionLinks)
  );
  const landingPage = curatedLandingPageHref
    ? await getLandingPageBySlug(curatedLandingPageHref.slice(1))
    : null;
  const path = `/countries/${country.slug}`;
  const countryStructuredData = getCountryStructuredData(country);
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Countries", path: "/countries" },
      { name: country.name, path },
    ]),
    countryStructuredData,
    getCollectionPageStructuredData({
      path,
      name: `Study in ${country.name}`,
      description: country.metaDescription,
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
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <div className="hero-panel px-6 py-8 md:px-10 md:py-10">
          <Badge className="border-white/12 bg-white/10 text-white">
            {country.region}
          </Badge>
          <div className="mt-5 max-w-4xl space-y-5">
            <h1 className="font-display text-heading-contrast text-5xl font-semibold tracking-tight md:text-6xl">
              Study in {country.name}
            </h1>
            <p className="text-base leading-8 text-white/80">{country.summary}</p>
            <div className="flex flex-wrap gap-3 text-sm text-white/72">
              <span>Climate: {country.climate}</span>
              <span>Currency: {country.currencyCode}</span>
            </div>
          </div>
        </div>

        <ContentTrustPanel
          lastReviewed={catalogReviewedAt}
          sourceSummary="Country pages synthesize the current catalog, official university references, and destination context for Indian students."
          referenceCount={sourceCount}
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Country Context"
              title={`Why students shortlist ${country.name}`}
              description={country.whyStudentsChooseIt}
            />
            <div className="soft-grid sm:grid-cols-2 xl:grid-cols-3">
              {programs.map((program) => (
                <UniversityCard key={program.offering.slug} program={program} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <LeadForm
              sourcePath={`/countries/${country.slug}`}
              ctaVariant="country_sidebar"
              title={`Plan your ${country.name} shortlist`}
              countrySlug={country.slug}
              courseSlug={primaryProgram?.course.slug}
            />
            {landingPage && primaryProgram && curatedLandingPageHref ? (
              <Button asChild variant="outline" className="w-full">
                <Link href={curatedLandingPageHref}>
                  Open the curated {primaryProgram.course.shortName} page
                </Link>
              </Button>
            ) : null}
            {recommendedBudgetGuide ? (
              <Button asChild variant="outline" className="w-full">
                <Link href={`/budget/${recommendedBudgetGuide.slug}`}>
                  View affordable {recommendedBudgetGuide.course.shortName} options
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
