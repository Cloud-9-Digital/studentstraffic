import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Building2, Globe2, Lightbulb, Map as MapIcon, TrendingUp } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { CountryFlag } from "@/components/site/country-flag";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { SectionHeading } from "@/components/site/section-heading";
import { UniversityCard } from "@/components/site/university-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { navDestinations } from "@/lib/constants";
import {
  catalogReviewedAt,
} from "@/lib/content-governance";
import {
  getCourseBySlug,
  getCourses,
  getProgramsForCourse,
} from "@/lib/data/catalog";
import { getBudgetGuidesForCourse } from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getCourseStructuredData,
  getItemListStructuredDataId,
  getProgramItemListStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getCountryHref } from "@/lib/routes";
import { ensureNonEmptyStaticParams } from "@/lib/static-params";

export async function generateStaticParams() {
  const courses = await getCourses();
  return ensureNonEmptyStaticParams(
    courses.map((course) => ({ slug: course.slug })),
    { slug: "__course-fallback__" },
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return { title: "Course Not Found" };
  }

  const programs = await getProgramsForCourse(course.slug);
  const countries = [...new Set(programs.map((program) => program.country.name))];

  return buildIndexableMetadata({
    title: `${course.metaTitle} | Countries, Universities, Fees & Eligibility`,
    description: course.metaDescription,
    path: `/courses/${course.slug}`,
    keywords: [
      `${course.shortName} abroad`,
      `study ${course.shortName} abroad`,
      `${course.shortName} fees`,
      `${course.shortName} universities`,
      ...countries.slice(0, 3).map(
        (countryName) => `${course.shortName} in ${countryName}`
      ),
    ],
  });
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const programs = await getProgramsForCourse(course.slug);
  const budgetGuides = await getBudgetGuidesForCourse(course.slug);
  const countries = Array.from(
    new Map(programs.map((program) => [program.country.slug, program.country])).values()
  );
  const finderHref = `/universities?course=${course.slug}`;
  const previewPrograms = programs.slice(0, 3);

  const path = `/courses/${course.slug}`;
  const courseStructuredData = getCourseStructuredData(course);
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "Courses", path: "/courses" },
      { name: course.shortName, path },
    ]),
    courseStructuredData,
    getCollectionPageStructuredData({
      path,
      name: `${course.shortName} abroad`,
      description: course.metaDescription,
      aboutIds: [courseStructuredData["@id"]],
      mainEntityId: programs.length ? getItemListStructuredDataId(path) : undefined,
      datePublished: catalogReviewedAt,
      dateModified: catalogReviewedAt,
    }),
    programs.length
      ? getProgramItemListStructuredData({
          path,
          name: `${course.shortName} programs`,
          programs: previewPrograms,
        })
      : null,
  ];

  return (
    <div className="flex flex-col">
      {/* ── Brand Gradient Cover ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-tr from-primary/10 via-background to-accent/5 pt-20 pb-28 md:pt-32 md:pb-40 border-b border-border/40">
        <div className="page-noise"></div>
        <div className="hero-grid-lines absolute inset-0 opacity-30 pointer-events-none"></div>
        {/* Soft radial glow to elevate typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-background/50 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="container-shell relative z-10 flex flex-col items-center text-center">
          <Badge className="mb-8 border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary shadow-sm hover:bg-primary/20 transition-colors">
            Official Course Guide
          </Badge>
          <div className="max-w-4xl w-full flex flex-col items-center">
            <h1 className="font-display text-heading text-6xl font-extrabold tracking-tight sm:text-7xl mb-6 leading-[1.05]">
              {course.shortName} <span className="text-primary font-medium italic">abroad</span>
            </h1>
            <p className="max-w-3xl text-lg md:text-xl leading-relaxed text-foreground/80 mb-10">
              {course.summary} Explore where this route is available, which
              countries students usually compare, and the next pages worth
              opening when you want a clearer path.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full sm:w-auto mt-2">
              <Button asChild size="lg">
                <Link href={finderHref}>Browse universities <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
              <CounsellingDialog
                courseSlug={course.slug}
                triggerContent="Book my free call"
                triggerVariant="outline"
                triggerSize="lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-background">
        <div className="container-shell space-y-24">

          {/* ── Clean Value Proposition Cards ───────────────────────────────── */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="group rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-accent/40 hover:-translate-y-1">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <Lightbulb className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors">
                What this page helps with
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-heading">
                Understand the route clearly
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground group-hover:text-foreground/80 transition-colors">
                Use this page to understand the course path, the kinds of
                destinations students consider, and the next decisions worth
                focusing on.
              </p>
            </div>
            <div className="group rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/40 hover:-translate-y-1">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Globe2 className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                Available destinations
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-heading">
                {countries.length} {countries.length === 1 ? "country" : "countries"}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground group-hover:text-foreground/80 transition-colors">
                These are some of the destinations where students currently find
                {` ${course.shortName} `}options in the catalog.
              </p>
            </div>
            <div className="group rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-heading/40 hover:-translate-y-1">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-heading transition-colors group-hover:bg-heading group-hover:text-background border border-border">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-heading transition-colors">
                University options
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-heading">
                {programs.length} listed option{programs.length === 1 ? "" : "s"}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground group-hover:text-foreground/80 transition-colors">
                Browse these options when you want to move from course guidance to
                actual university comparison.
              </p>
            </div>
          </div>

          {/* ── Country Badges ─────────────────────────────────────────────── */}
          {countries.length ? (
            <div>
              <SectionHeading
                eyebrow="Destination Hub"
                title={`Where students choose ${course.shortName}`}
                description="Open these destination pages for more context on cost, recognition, student life, and country-level differences."
              />
              <div className="flex flex-wrap gap-3 mt-8">
                {countries.map((country) => {
                  const countryCode = navDestinations.find(
                    (d) => d.href === getCountryHref(country.slug)
                  )?.countryCode;
                  
                  return (
                    <Button key={country.slug} asChild variant="outline">
                      <Link href={getCountryHref(country.slug)} className="flex items-center gap-2">
                        {countryCode && (
                          <CountryFlag
                            countryCode={countryCode}
                            alt={country.name}
                            width={20}
                            height={15}
                            className="rounded shadow-sm"
                          />
                        )}
                        {country.name}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* ── Budget Guides ──────────────────────────────────────────────── */}
          {budgetGuides.length ? (
            <div className="border-t border-border/60 pt-20">
              <SectionHeading
                eyebrow="Financial Planning"
                title={`Budget-first planning for ${course.shortName}`}
                description="If fees are shaping the options early, these pages give you a simpler place to start."
              />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-8">
                {budgetGuides.slice(0, 3).map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/budget/${guide.slug}`}
                    className="group rounded-3xl border border-primary/10 bg-gradient-to-br from-primary to-surface-dark-2 p-8 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl group-hover:opacity-20 transition-opacity">
                       <TrendingUp className="w-32 h-32 text-white" />
                    </div>
                    <p className="relative z-10 text-xs font-bold uppercase tracking-widest text-primary-foreground/70">
                      Budget Guide
                    </p>
                    <h2 className="relative z-10 mt-3 font-display text-4xl font-bold text-white group-hover:scale-105 origin-left transition-transform duration-300">
                      Under \${guide.budgetUsd.toLocaleString("en-US")}
                    </h2>
                    <div className="relative z-10 mt-8 flex items-center justify-between">
                      <p className="text-sm font-medium text-white/80">
                        {guide.programs.length} listed options inside this band.
                      </p>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md group-hover:bg-white group-hover:text-primary transition-colors">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {/* ── Finder Preview ─────────────────────────────────────────────── */}
          {previewPrograms.length ? (
            <div className="border-t border-border/60 pt-20">
              <SectionHeading
                eyebrow="University Preview"
                title={`A small preview of ${course.shortName} options`}
                description="These listings give you a quick sense of the options before you open the full university list."
                aside={
                  <Button asChild variant="outline">
                    <Link href={finderHref}>See all universities</Link>
                  </Button>
                }
              />
              <div className="soft-grid sm:grid-cols-2 xl:grid-cols-3 mt-8">
                {previewPrograms.map((program, index) => (
                  <UniversityCard
                    key={program.offering.slug}
                    program={program}
                    imagePriority={index < 2}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* ── Lead Form Integration ──────────────────────────────────────── */}
          <div className="border-t border-border/60 pt-20">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] items-center">
              <div className="flex flex-col">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
                  <BookOpen className="h-7 w-7 text-accent" />
                </div>
                <h2 className="font-display text-4xl font-bold tracking-tight text-heading md:text-5xl leading-[1.15]">
                  Want help choosing the right {course.shortName} route?
                </h2>
                <p className="mt-5 text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Connect directly with our senior counsellors. We'll help you evaluate destinations, compare specific university safety and fees, and build a personalized roadmap. No commitments required.
                </p>
              </div>
              
              <div>
                <DeferredLeadForm
                  sourcePath={`/courses/${course.slug}`}
                  ctaVariant="course_cta"
                  title={`Discuss your ${course.shortName} options`}
                  description="Share your details and we will call you back."
                  courseSlug={course.slug}
                />
              </div>
            </div>
          </div>
        </div>
        
        <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
      </section>
    </div>
  );
}
