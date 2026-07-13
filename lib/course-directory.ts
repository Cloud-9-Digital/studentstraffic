import "server-only";

import { getCourseCatalogStats, getCourses } from "@/lib/data/catalog";

export type CourseDirectoryEntry = {
  slug: string;
  name: string;
  shortName: string;
  durationYears: number;
  summary: string;
  countryCount: number;
  programCount: number;
};

const courseOrder = ["mbbs", "bds", "medical-pg", "nursing"] as const;

export async function getCourseDirectoryEntries(): Promise<CourseDirectoryEntry[]> {
  const [courses, stats] = await Promise.all([
    getCourses(),
    getCourseCatalogStats(),
  ]);
  const statsByCourseSlug = new Map(
    stats.map((entry) => [entry.courseSlug, entry]),
  );
  const entries = courses.map((course) => ({
    slug: course.slug,
    name: course.name,
    shortName: course.shortName,
    durationYears: course.durationYears,
    summary: course.summary,
    countryCount: statsByCourseSlug.get(course.slug)?.countryCount ?? 0,
    programCount: statsByCourseSlug.get(course.slug)?.programCount ?? 0,
  }));

  return entries.sort((left, right) => {
    const leftIndex = courseOrder.indexOf(left.slug as (typeof courseOrder)[number]);
    const rightIndex = courseOrder.indexOf(right.slug as (typeof courseOrder)[number]);
    if (leftIndex !== -1 || rightIndex !== -1) {
      if (leftIndex === -1) return 1;
      if (rightIndex === -1) return -1;
      return leftIndex - rightIndex;
    }
    return left.name.localeCompare(right.name);
  });
}
