import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { LeadForm } from "@/components/site/lead-form";
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
  const path = `/courses/${course.slug}`;
  const courseStructuredData = getCourseStructuredData(course);
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
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
          programs,
        })
      : null,
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <div className="hero-panel px-6 py-8 md:px-10 md:py-10">
          <Badge className="border-white/12 bg-white/10 text-white">
            {course.shortName}
          </Badge>
          <div className="mt-5 max-w-4xl space-y-5">
            <h1 className="font-display text-heading-contrast text-5xl font-semibold tracking-tight md:text-6xl">
              {course.shortName} abroad
            </h1>
            <p className="text-base leading-8 text-white/80">{course.summary}</p>
          </div>
        </div>

        <ContentTrustPanel
          lastReviewed={catalogReviewedAt}
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Course Hub"
              title={`Programs currently available for ${course.shortName}`}
              description="This route gives you a course-level hub that can grow into broader medical category pages later."
            />
            <div className="soft-grid sm:grid-cols-2 xl:grid-cols-3">
              {programs.map((program) => (
                <UniversityCard key={program.offering.slug} program={program} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <LeadForm
              sourcePath={`/courses/${course.slug}`}
              ctaVariant="course_sidebar"
              title={`Get help choosing the right ${course.shortName} destination`}
              courseSlug={course.slug}
            />
            {budgetGuides[0] ? (
              <Button asChild variant="outline" className="w-full">
                <Link href={`/budget/${budgetGuides[0].slug}`}>
                  Start with a budget-first shortlist
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
