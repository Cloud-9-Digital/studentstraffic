import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { getCourses, listFinderPrograms } from "@/lib/data/catalog";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { getCourseHref } from "@/lib/routes";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Course Guides",
  description:
    "Browse course guides for Indian students researching MBBS and other medical study-abroad routes before comparing universities.",
  path: "/courses",
});

export default async function CoursesPage() {
  const [courses, programs] = await Promise.all([getCourses(), listFinderPrograms({})]);
  const programCounts = new Map<string, number>();

  for (const program of programs) {
    programCounts.set(
      program.course.slug,
      (programCounts.get(program.course.slug) ?? 0) + 1
    );
  }

  const path = "/courses";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Courses", path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: "Courses abroad",
      description:
        "Course hubs covering university options, fees, and country routes for study-abroad programs.",
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <SectionHeading
          eyebrow="Course Guides"
          title="Understand the route before you compare institutions"
          description="Each course page helps students understand the qualification, available destinations, and the planning questions that matter before they start comparing universities."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <Link key={course.slug} href={getCourseHref(course.slug)}>
              <Card className="h-full transition-colors hover:border-primary/30">
                <CardContent className="space-y-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {course.name}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-foreground">
                      {course.shortName}
                    </h2>
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {course.summary}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>{programCounts.get(course.slug) ?? 0} listed options</span>
                    <span>{course.durationYears} years</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
