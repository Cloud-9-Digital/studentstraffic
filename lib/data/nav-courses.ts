import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { getCourses, getProgramOfferings } from "@/lib/data/catalog";
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

  const [courses, offerings] = await Promise.all([getCourses(), getProgramOfferings()]);
  const publishedCourseSlugs = new Set(offerings.map((offering) => offering.courseSlug));

  return courses
    .filter((course) => course.active !== false && publishedCourseSlugs.has(course.slug))
    .map((course) => ({
      slug: course.slug,
      name: course.name,
      shortName: course.shortName,
      stream: course.stream,
      href: `/universities?course=${encodeURIComponent(course.slug)}`,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}
