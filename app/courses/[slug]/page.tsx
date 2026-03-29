import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { SectionHeading } from "@/components/site/section-heading";
import { UniversityCard } from "@/components/site/university-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((course) => ({ slug: course.slug }));
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
    <section className="section-space">
      <div className="container-shell space-y-12">
        <div className="hero-panel px-6 py-8 md:px-10 md:py-10">
          <Badge className="border-white/12 bg-white/10 text-white">
            Course Guide
          </Badge>
          <div className="mt-5 max-w-4xl space-y-5">
            <h1 className="font-display text-heading-contrast text-5xl font-semibold tracking-tight md:text-6xl">
              {course.shortName} abroad
            </h1>
            <p className="max-w-3xl text-base leading-8 text-white/80">
              {course.summary} Explore where this route is available, which
              countries students usually compare, and the next pages worth
              opening when you want a clearer shortlist.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="accent">
              <Link href={finderHref}>Explore universities</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/18 hover:text-white"
            >
              <Link href="/contact">Get free counselling</Link>
            </Button>
          </div>
        </div>

        <ContentTrustPanel
          lastReviewed={catalogReviewedAt}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              What this page helps with
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
              Understand the route clearly
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Use this page to understand the course path, the kinds of
              destinations students consider, and the next decisions worth
              focusing on.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Available destinations
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
              {countries.length} country{countries.length === 1 ? "" : "ies"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              These are some of the destinations where students currently find
              {` ${course.shortName} `}options in the catalog.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              University options
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
              {programs.length} listed option{programs.length === 1 ? "" : "s"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Browse these options when you want to move from course research to
              actual university comparison.
            </p>
          </div>
        </div>

        {countries.length ? (
          <div>
          <SectionHeading
            eyebrow="Country Guides"
            title={`Where students research ${course.shortName}`}
            description="Open these destination pages if you want more context on cost, recognition, student life, and country-level differences."
          />
            <div className="flex flex-wrap gap-3">
              {countries.map((country) => (
                <Button key={country.slug} asChild variant="outline">
                  <Link href={getCountryHref(country.slug)}>{country.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {budgetGuides.length ? (
          <div>
          <SectionHeading
            eyebrow="Budget Guides"
            title={`Budget-first planning for ${course.shortName}`}
            description="If fees are shaping the shortlist early, these pages give you a simpler place to start."
          />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {budgetGuides.slice(0, 3).map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/budget/${guide.slug}`}
                  className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Budget guide
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-foreground">
                    Under ${guide.budgetUsd.toLocaleString("en-US")}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {guide.programs.length} currently listed options inside this
                    tuition band.
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {previewPrograms.length ? (
          <div>
          <SectionHeading
            eyebrow="Finder Preview"
            title={`A small preview of ${course.shortName} options`}
            description="These listings give you a quick sense of the options before you open the full university list."
            aside={
              <Button asChild variant="outline">
                  <Link href={finderHref}>See all universities</Link>
              </Button>
            }
          />
            <div className="soft-grid sm:grid-cols-2 xl:grid-cols-3">
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

        <div className="grid gap-8 rounded-3xl border border-border bg-card px-8 py-10 md:px-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <SectionHeading
              title={`Want help choosing the right ${course.shortName} route?`}
              description="Share your details if you want help understanding destinations, shortlisting universities, or planning the next step."
            />
          </div>
          <DeferredLeadForm
            sourcePath={`/courses/${course.slug}`}
            ctaVariant="course_cta"
            title={`Talk through your ${course.shortName} options`}
            description="Our counsellors can help you evaluate destinations, compare universities, and move forward with more clarity."
            courseSlug={course.slug}
          />
        </div>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
