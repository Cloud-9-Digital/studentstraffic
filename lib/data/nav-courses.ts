import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { getCourses } from "@/lib/data/catalog";

export type NavCourse = {
  slug: string;
  name: string;
  shortName: string;
};

// A lightweight, client-safe list of courses for populating select inputs
// (e.g. the "Interested course" field in the counselling dialog). Sorted by
// display name so the dropdown reads alphabetically.
export async function getNavCourses(): Promise<NavCourse[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("courses");

  const courses = await getCourses();

  return courses
    .map((course) => ({
      slug: course.slug,
      name: course.name,
      shortName: course.shortName,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}
