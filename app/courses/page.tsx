import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { getCourses, getProgramsForCourse } from "@/lib/data/catalog";
import { buildIndexableMetadata } from "@/lib/metadata";
import { getCourseHref } from "@/lib/routes";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS, BDS, Nursing and Medical PG Abroad | Indian Students Guide",
  description:
    "Understand MBBS, BDS, Nursing, and Medical PG abroad for Indian students with fees, eligibility, duration, and top countries.",
  path: "/courses",
});

const courseOrder = ["mbbs", "bds", "medical-pg", "nursing"] as const;

const courseThemes: Record<
  string,
  { card: string; action: string }
> = {
  mbbs: {
    card: "border-primary/15 bg-[linear-gradient(180deg,rgba(11,49,43,0.05)_0%,#ffffff_38%)] hover:border-primary/30",
    action: "text-primary",
  },
  bds: {
    card: "border-[#b96f5b]/15 bg-[linear-gradient(180deg,rgba(185,111,91,0.06)_0%,#ffffff_38%)] hover:border-[#b96f5b]/30",
    action: "text-[#9f4d36]",
  },
  "medical-pg": {
    card: "border-[#355e8a]/15 bg-[linear-gradient(180deg,rgba(53,94,138,0.06)_0%,#ffffff_38%)] hover:border-[#355e8a]/30",
    action: "text-[#2f5a86]",
  },
  nursing: {
    card: "border-[#2d6b64]/15 bg-[linear-gradient(180deg,rgba(45,107,100,0.06)_0%,#ffffff_38%)] hover:border-[#2d6b64]/30",
    action: "text-[#235b55]",
  },
};

function toPlainText(value: string) {
  return value
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function getConciseSummary(value: string) {
  const plain = toPlainText(value);
  const firstSentence = plain.match(/^[^.!?]+[.!?]/)?.[0]?.trim() || plain;

  if (firstSentence.length <= 155) {
    return firstSentence;
  }

  return `${firstSentence.slice(0, 152).trimEnd()}...`;
}

function formatDuration(durationYears: number) {
  return `${durationYears} year${durationYears === 1 ? "" : "s"}`;
}

export default async function CoursesPage() {
  const courses = await getCourses();

  const courseCards = await Promise.all(
    courses.map(async (course) => {
      const programs = await getProgramsForCourse(course.slug);
      const countryCount = new Set(programs.map((program) => program.country.slug))
        .size;

      return {
        ...course,
        countryCount,
        programCount: programs.length,
      };
    }),
  );

  courseCards.sort((left, right) => {
    const leftIndex = courseOrder.indexOf(left.slug as (typeof courseOrder)[number]);
    const rightIndex = courseOrder.indexOf(
      right.slug as (typeof courseOrder)[number],
    );

    if (leftIndex !== -1 || rightIndex !== -1) {
      if (leftIndex === -1) {
        return 1;
      }

      if (rightIndex === -1) {
        return -1;
      }

      return leftIndex - rightIndex;
    }

    return left.name.localeCompare(right.name);
  });

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
          <div className="grid gap-4 md:grid-cols-2">
            {courseCards.map((course) => {
              const theme = courseThemes[course.slug] ?? {
                card: "border-border hover:border-primary/20",
                action: "text-primary",
              };

              return (
                <Link
                  key={course.slug}
                  href={getCourseHref(course.slug)}
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                    theme.card,
                  )}
                >
                  <div className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          {course.name}
                        </p>
                        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-heading">
                          {course.shortName}
                        </h2>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Duration
                        </p>
                        <p className="mt-2 text-sm font-semibold text-heading">
                          {formatDuration(course.durationYears)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                      {getConciseSummary(course.summary)}
                    </p>

                    <div className="mt-5 border-t border-border/70 pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                          {course.programCount} option
                          {course.programCount === 1 ? "" : "s"} across{" "}
                          {course.countryCount} countr
                          {course.countryCount === 1 ? "y" : "ies"}
                        </p>
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 text-sm font-semibold",
                            theme.action,
                          )}
                        >
                          Open guide
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
