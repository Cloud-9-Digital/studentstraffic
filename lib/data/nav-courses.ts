import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { and, asc, eq, exists, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import {
  courses,
  programOfferings,
  universities,
} from "@/lib/db/schema";
import type { CourseStream } from "@/lib/data/types";

export type NavCourse = {
  slug: string;
  name: string;
  shortName: string;
  stream: CourseStream;
  href: string;
};

// A lightweight, client-safe list of courses for populating select inputs
// (e.g. the "Interested course" field in the counselling dialog). Sorted by
// display name so the dropdown reads alphabetically.
export async function getNavCourses(): Promise<NavCourse[]> {
  // Shared remote cache - see getNavCountries in ./nav-countries for why plain
  // `use cache` was not enough here.
  "use cache: remote";
  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("courses");

  const db = getDb();
  if (!db) return [];

  // EXISTS rather than DISTINCT over a three-table join: the join fanned every
  // course out across all of its published offerings (~12.7M rows scanned per
  // 81k calls) purely to deduplicate back down to ~157 courses. The semi-join
  // stops at the first matching offering per course.
  const rows = await db
    .select({
      slug: courses.slug,
      name: courses.name,
      shortName: courses.shortName,
      stream: courses.stream,
    })
    .from(courses)
    .where(
      and(
        eq(courses.active, true),
        exists(
          db
            .select({ one: sql`1` })
            .from(programOfferings)
            .innerJoin(
              universities,
              eq(programOfferings.universityId, universities.id),
            )
            .where(
              and(
                eq(programOfferings.courseId, courses.id),
                eq(programOfferings.published, true),
                eq(universities.published, true),
              ),
            ),
        ),
      ),
    )
    .orderBy(asc(courses.name));

  return rows
    .map((course) => ({
      slug: course.slug,
      name: course.name,
      shortName: course.shortName,
      stream: course.stream,
      href: `/universities?course=${encodeURIComponent(course.slug)}`,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}
