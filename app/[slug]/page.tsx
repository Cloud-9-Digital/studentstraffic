import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { CountryFlag } from "@/components/site/country-flag";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityCard } from "@/components/site/university-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  catalogReviewedAt,
  countUniqueSources,
} from "@/lib/content-governance";
import { navDestinations } from "@/lib/constants";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getCountryStructuredData,
  getCourseStructuredData,
  getFaqStructuredData,
  getItemListStructuredDataId,
  getProgramItemListStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getLandingPageBySlug,
  getLandingPageContext,
  getLandingPageSlugs,
} from "@/lib/data/catalog";
import { getRecommendedBudgetGuideForCourse } from "@/lib/discovery-pages";
import { getBudgetGuideHref } from "@/lib/routes";

export async function generateStaticParams() {
  const slugs = await getLandingPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) return { title: "Page Not Found" };

  const context = await getLandingPageContext(page);
  const keywords = [
    page.title,
    `${page.courseSlug} in ${page.countrySlug}`,
    context.country ? `study in ${context.country.name}` : undefined,
    context.course ? `${context.course.shortName} abroad` : undefined,
    ...page.heroHighlights,
  ].filter(Boolean) as string[];

  return buildIndexableMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/${page.slug}`,
    keywords,
  });
}

export default async function LandingPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) notFound();

  const context = await getLandingPageContext(page);
  const recommendedBudgetGuide = await getRecommendedBudgetGuideForCourse(
    context.course?.slug ?? page.courseSlug
  );

  if (!context.country || !context.course) notFound();

  const country = context.country;
  const course = context.course;
  const path = `/${page.slug}`;
  const sourceCount = countUniqueSources(
    ...context.featuredPrograms.map((program) => program.university.references),
    ...context.featuredPrograms.map(
      (program) => program.university.recognitionLinks
    )
  );

  const countryCode = navDestinations.find(
    (d) => d.href === `/countries/${country.slug}`
  )?.countryCode;

  const countryStructuredData = getCountryStructuredData(country);
  const courseStructuredData = getCourseStructuredData(course);
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: page.title, path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: page.title,
      description: page.metaDescription,
      aboutIds: [countryStructuredData["@id"], courseStructuredData["@id"]],
      mainEntityId: context.featuredPrograms.length
        ? getItemListStructuredDataId(path)
        : undefined,
      datePublished: catalogReviewedAt,
      dateModified: catalogReviewedAt,
    }),
    countryStructuredData,
    courseStructuredData,
    context.featuredPrograms.length
      ? getProgramItemListStructuredData({
          path,
          name: `Featured ${page.title} programs`,
          programs: context.featuredPrograms,
        })
      : null,
    page.faq.length ? getFaqStructuredData(page.faq, path) : null,
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="section-space">
        <div className="container-shell">
          <div className="hero-panel relative overflow-hidden px-6 py-10 md:px-10 md:py-12 lg:py-0">
            {/* Subtle grid lines */}
            <div className="hero-grid-lines pointer-events-none absolute inset-0" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_340px] lg:items-stretch">
              {/* Left col */}
              <div className="py-10 md:py-12">
                {/* Breadcrumb */}
                <nav className="mb-7 flex items-center gap-1.5 text-xs text-white/50" aria-label="Breadcrumb">
                  <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
                  <ChevronRight className="size-3 shrink-0" />
                  <Link href={`/countries/${country.slug}`} className="hover:text-white/80 transition-colors capitalize">{country.name}</Link>
                  <ChevronRight className="size-3 shrink-0" />
                  <span className="text-white/70">{page.title}</span>
                </nav>

                {/* Kicker */}
                <div className="mb-5 flex items-center gap-2.5">
                  {countryCode && (
                    <CountryFlag
                      countryCode={countryCode}
                      alt={country.name}
                      width={24}
                      height={18}
                      className="rounded shadow-flag"
                    />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                    {page.kicker}
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-heading-contrast sm:text-5xl lg:text-6xl">
                  {page.title}
                </h1>

                <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
                  {page.summary}
                </p>

                {/* Highlights */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {page.heroHighlights.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-sm"
                    >
                      <CheckCircle2 className="size-3 shrink-0 text-accent" />
                      {h}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="mt-8 flex gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-accent text-white shadow-cta hover:bg-accent-strong hover:shadow-cta-hover"
                  >
                    <Link href={`/universities?country=${country.slug}&course=${course.slug}`}>
                      Explore universities
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/18 hover:text-white">
                    <Link href={`/countries/${country.slug}`}>
                      About {country.name}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right col — sticky lead form */}
              <div className="hidden border-l border-white/10 lg:flex lg:items-center lg:py-10 lg:pl-10">
                <div className="hero-glass w-full rounded-2xl p-6">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                    Free counselling
                  </p>
                  <h2 className="mb-5 font-display text-xl font-semibold text-heading-contrast">
                    Get your {course.shortName} shortlist
                  </h2>
                  <LeadForm
                    sourcePath={path}
                    ctaVariant="landing_sidebar"
                    title=""
                    countrySlug={country.slug}
                    courseSlug={course.slug}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-16">
        <div className="container-shell space-y-4">
          <ContentTrustPanel
            lastReviewed={catalogReviewedAt}
            sourceSummary="Landing pages are manually reviewed for current admissions context and curated to help students compare destination fit with more clarity."
            referenceCount={sourceCount}
          />
          {recommendedBudgetGuide ? (
            <Button asChild variant="outline">
              <Link href={getBudgetGuideHref(recommendedBudgetGuide.slug)}>
                Explore affordable {course.shortName} options
              </Link>
            </Button>
          ) : null}
        </div>
      </section>

      {/* ── Universities ─────────────────────────────────────────────────── */}
      <section className="border-b border-border py-14 md:py-20">
        <div className="container-shell">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                {course.shortName} universities in {country.name}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                Verified programs with confirmed fees, recognition context, and shortlist guidance reviewed for the current admissions cycle.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href={`/universities?country=${country.slug}&course=${course.slug}`}>
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {context.featuredPrograms.map((program) => (
              <UniversityCard key={program.offering.slug} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why this destination ─────────────────────────────────────────── */}
      <section className="border-b border-border py-14 md:py-20">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

            {/* Reasons */}
            <div>
              <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Why students choose {page.title}
              </h2>
              <div className="mt-8 space-y-5">
                {page.reasonsToChoose.map((reason, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-7 text-muted-foreground">{reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Counsellor notes */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-border p-6 md:p-7">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck className="size-4 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Counsellor notes</p>
                </div>
                <div className="space-y-4">
                  {page.editorialNotes.map((note, i) => (
                    <div key={i} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <p className="text-sm leading-6 text-muted-foreground">{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-primary px-6 py-5 md:px-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50 mb-3">
                  Why students choose {country.name}
                </p>
                <p className="text-sm leading-7 text-white/85">
                  {country.whyStudentsChooseIt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {page.faq.length > 0 && (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <div className="mb-10">
              <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Common questions about {page.title}
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {page.faq.map((item) => (
                <Card key={item.question} className="rounded-2xl border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold leading-snug text-heading">
                      {item.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="container-shell">
          <div className="overflow-hidden rounded-2xl bg-primary">
            <div className="px-8 py-12 md:px-14 md:py-16 lg:flex lg:items-center lg:justify-between lg:gap-12">
              <div className="lg:max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  Free · No obligations
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-heading-contrast md:text-4xl">
                  Not sure which {country.name} university fits your profile?
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  Our counsellors compare universities, fees, NMC recognition, and lifestyle factors — and build a personalised shortlist at no cost.
                </p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Personalised university shortlist",
                    "NMC eligibility guidance",
                    "Fee comparison across cities",
                    "Completely free, no obligations",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                      <CheckCircle2 className="size-4 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 shrink-0 lg:mt-0">
                <div className="rounded-xl border border-white/10 bg-white/8 p-6 backdrop-blur-sm lg:w-80">
                  <LeadForm
                    sourcePath={path}
                    ctaVariant="landing_bottom"
                    title=""
                    countrySlug={country.slug}
                    courseSlug={course.slug}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
