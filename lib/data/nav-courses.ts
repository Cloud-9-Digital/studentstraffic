import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { and, asc, eq } from "drizzle-orm";

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
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("courses");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .selectDistinct({
      slug: courses.slug,
      name: courses.name,
      shortName: courses.shortName,
      stream: courses.stream,
    })
    .from(courses)
    .innerJoin(programOfferings, eq(programOfferings.courseId, courses.id))
    .innerJoin(universities, eq(programOfferings.universityId, universities.id))
    .where(
      and(
        eq(courses.active, true),
        eq(programOfferings.published, true),
        eq(universities.published, true),
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
