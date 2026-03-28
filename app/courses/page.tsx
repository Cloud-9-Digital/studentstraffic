import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { getCourses } from "@/lib/data/catalog";
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
    "Browse course guides for Indian students researching MBBS and other medical programmes abroad before comparing universities.",
  path: "/courses",
});

export default async function CoursesPage() {
  const courses = await getCourses();

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
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
        <div className="hero-grid-lines pointer-events-none absolute inset-0" />
        <div className="hero-orb hero-orb--warm pointer-events-none absolute -right-16 -top-20 size-96 opacity-40" />
        <div className="hero-orb hero-orb--cool pointer-events-none absolute -bottom-10 left-10 size-72 opacity-60" />

        <div className="container-shell relative py-12 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Course Guides
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-5xl font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Know the course.
            <br />
            <span className="italic text-accent">Then choose the university.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/70">
            Each guide covers what the degree means, which countries offer it,
            and what to check before comparing universities.
          </p>
        </div>
      </div>

      {/* ── Course grid ──────────────────────────────────────────────────────── */}
      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={getCourseHref(course.slug)}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-heading">
                    {course.shortName}
                  </h2>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>

                <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                  {course.summary}
                </p>

                <p className="mt-5 border-t border-border pt-4 text-xs font-medium text-muted-foreground">
                  {course.durationYears} year programme
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
