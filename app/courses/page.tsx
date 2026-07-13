import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { CourseDirectoryGrid } from "@/components/site/course-directory-grid";
import { getCourseDirectoryEntries } from "@/lib/course-directory";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Courses Abroad for Indian Students | Fees, Eligibility & Universities",
  description:
    "Compare courses abroad for Indian students with fees, eligibility, duration, universities, and destination guidance.",
  path: "/courses",
});

export default async function CoursesPage() {
  const courseCards = await getCourseDirectoryEntries();

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
        "Course hubs covering university options, fees, and countries for study-abroad programmes.",
    }),
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(145deg,#f6f1e8_0%,#fbfaf8_48%,#eef3fb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,97,0,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(53,94,138,0.10),transparent_28%)]" />
        <div className="container-shell relative py-14 md:py-18 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Course Guides
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-heading sm:text-6xl">
              Choose the course first.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Use these guides to understand the route before you compare
              destinations, budgets, and universities.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <CourseDirectoryGrid
            initialEntries={courseCards.slice(0, 24)}
            total={courseCards.length}
          />
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
