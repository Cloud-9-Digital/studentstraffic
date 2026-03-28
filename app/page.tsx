import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CountryFlag } from "@/components/site/country-flag";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { HeroSearch } from "@/components/site/hero-search";
import { LeadForm } from "@/components/site/lead-form";
import { SectionHeading } from "@/components/site/section-heading";
import { UniversityCard } from "@/components/site/university-card";
import { Button } from "@/components/ui/button";
import {
  catalogReviewedAt,
  governancePublishedAt,
} from "@/lib/content-governance";
import {
  getFeaturedLandingPages,
  getFeaturedPrograms,
} from "@/lib/data/catalog";
import { navDestinations } from "@/lib/constants";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getItemListStructuredDataId,
  getProgramItemListStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getLandingPageHref } from "@/lib/routes";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Study Abroad Admissions for Indian Students",
  description:
    "Explore verified universities abroad, compare fees and eligibility, and get free admissions guidance for MBBS and other medical programs.",
  path: "/",
  keywords: [
    "study abroad admissions",
    "MBBS abroad for Indian students",
    "medical universities abroad",
    "study abroad counselling",
    "compare universities abroad",
  ],
});

export default async function HomePage() {
  const [featuredPrograms, featuredGuides] = await Promise.all([
    getFeaturedPrograms(),
    getFeaturedLandingPages(),
  ]);
  const path = "/";
  const structuredDataItems = [
    getBreadcrumbStructuredData([{ name: "Home", path }]),
    getCollectionPageStructuredData({
      path,
      name: "Students Traffic Home",
      description:
        "Homepage for Students Traffic, helping Indian students compare universities abroad and start their admissions journey.",
      mainEntityId: featuredPrograms.length
        ? getItemListStructuredDataId(path)
        : undefined,
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
    featuredPrograms.length
      ? getProgramItemListStructuredData({
          path,
          name: "Featured programs on Students Traffic",
          programs: featuredPrograms,
        })
      : null,
  ];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 lg:py-32">
        <div className="container-shell text-center">
          {/* Eyebrow */}
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Study Abroad Experts
          </p>

          {/* Headline */}
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-heading">Your Global Education,</span>{" "}
            <span className="italic text-accent">Made Simple.</span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            We help Indian students explore universities across the world, compare fees and programs, and apply with confidence — with free expert guidance at every step.
          </p>

          {/* Search widget */}
          <div className="mt-10">
            <HeroSearch />
          </div>

          {/* Free counselling link */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <span>Not sure where to start?</span>
            <CounsellingDialog
              plainTrigger
              triggerClassName="font-medium text-primary underline-offset-2 hover:underline"
              triggerContent="Get free counselling"
            />
          </div>

        </div>
      </section>

      {/* ── Destinations ──────────────────────────────────────────────────── */}
      <section className="border-t border-border py-16 md:py-20">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Study Destinations"
            title="Where do you want to study?"
            description="We guide students to verified universities across some of the most popular study-abroad destinations for Indian students."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {navDestinations.map((dest) => (
              <Link
                key={dest.countryCode}
                href={dest.href}
                className="group flex items-center gap-4 rounded-xl border border-border p-5 transition-all hover:border-primary/20 hover:shadow-sm"
              >
                <CountryFlag
                  countryCode={dest.countryCode}
                  alt={dest.name}
                  width={36}
                  height={27}
                  className="flex-shrink-0 rounded-md shadow-flag"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground transition-colors group-hover:text-primary">
                    {dest.name}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {dest.description}
                  </p>
                </div>
                <ArrowRight className="size-4 flex-shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Guides ───────────────────────────────────────────────── */}
      {featuredGuides.length ? (
        <section className="border-t border-border py-16 md:py-20">
          <div className="container-shell">
            <SectionHeading
              eyebrow="Admissions Guides"
              title="Start with the route that matches your plan."
              description="These are the pages students usually need first: fees, eligibility, recognition context, and the actual admission flow."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featuredGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={getLandingPageHref(guide.courseSlug, guide.countrySlug)}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
                    {guide.kicker}
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                    {guide.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {guide.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {guide.heroHighlights.slice(0, 3).map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-accent">
                    Read the guide
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Featured Universities ─────────────────────────────────────────── */}
      <section className="border-t border-border py-16 md:py-20">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Top Universities"
            title="Programs students are applying for."
            description="Every listing shows verified fees, medium of instruction, and eligibility context for NMC and USMLE."
            aside={
              <Button asChild variant="outline">
                <Link href="/universities">View all</Link>
              </Button>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredPrograms.map((program) => (
              <UniversityCard key={program.offering.slug} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead Form ─────────────────────────────────────────────────────── */}
      <section className="border-t border-border py-16 md:py-20">
        <div className="container-shell grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left — value prop */}
          <div className="space-y-6 lg:pt-2">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Free Counselling
              </p>
              <h2 className="font-display text-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Not sure where to begin?
                <br />
                <span className="italic text-primary">We&apos;ll help.</span>
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Our counsellors help you pick the right country, compare
                universities, and navigate the application process — at no cost.
              </p>
            </div>

            <ul className="space-y-3">
              {[
                "Personalised university recommendations",
                "Fee comparison across countries",
                "Application & visa guidance",
                "Completely free — no obligations",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <LeadForm
            sourcePath="/"
            ctaVariant="home_cta"
            title="Talk to a counsellor for free"
          />
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
