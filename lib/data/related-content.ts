import "server-only";

import { and, eq, ne, or, type SQL } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { getDb } from "@/lib/db/server";
import {
  countries,
  courses,
  programOfferings,
  studyAbroadGuides as studyAbroadGuidesTable,
  universities,
} from "@/lib/db/schema";
import type { CourseStream } from "@/lib/data/types";
import type { StudyAbroadGuidePageProps } from "@/components/site/study-abroad-guide-page";
import { getStudyAbroadGuideHref, getUniversityHref } from "@/lib/routes";

export type RelatedContentItem = {
  slug: string;
  title: string;
  description?: string;
  href: string;
  type: "university" | "guide";
};

export type GetRelatedContentInput = {
  countrySlug?: string | null;
  courseSlug?: string | null;
  stream?: CourseStream | null;
  excludeSlug?: string;
  limit?: number;
};

function rank(input: {
  courseSlug?: string | null;
  countrySlug?: string | null;
  stream?: CourseStream | null;
}, target: { courseSlug: string | null; countrySlug: string | null; stream: string }) {
  if (input.courseSlug && target.courseSlug === input.courseSlug) return 3;
  if (input.stream && target.stream === input.stream) return 2;
  if (input.countrySlug && target.countrySlug === input.countrySlug) return 1;
  return 0;
}

export async function getRelatedContent({
  countrySlug,
  courseSlug,
  stream,
  excludeSlug,
  limit = 6,
}: GetRelatedContentInput): Promise<RelatedContentItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("study-abroad-guides");

  const db = getDb();
  if (!db) return [];
  if (!countrySlug && !courseSlug && !stream) return [];

  const matchConditions: SQL[] = [];
  if (courseSlug) matchConditions.push(eq(studyAbroadGuidesTable.courseSlug, courseSlug));
  if (stream) matchConditions.push(eq(studyAbroadGuidesTable.stream, stream));
  if (countrySlug) matchConditions.push(eq(studyAbroadGuidesTable.countrySlug, countrySlug));

  const guideWhere = [eq(studyAbroadGuidesTable.published, true), or(...matchConditions)];
  if (excludeSlug) guideWhere.push(ne(studyAbroadGuidesTable.slug, excludeSlug));

  const universityMatchConditions: SQL[] = [];
  if (courseSlug) universityMatchConditions.push(eq(courses.slug, courseSlug));
  if (stream) universityMatchConditions.push(eq(courses.stream, stream));
  if (countrySlug) universityMatchConditions.push(eq(countries.slug, countrySlug));

  const universityWhere = [
    eq(universities.published, true),
    eq(programOfferings.published, true),
    or(...universityMatchConditions),
  ];
  if (excludeSlug) universityWhere.push(ne(universities.slug, excludeSlug));

  const guideRowsQuery = db
    .select({
      slug: studyAbroadGuidesTable.slug,
      page: studyAbroadGuidesTable.page,
      courseSlug: studyAbroadGuidesTable.courseSlug,
      countrySlug: studyAbroadGuidesTable.countrySlug,
      stream: studyAbroadGuidesTable.stream,
    })
    .from(studyAbroadGuidesTable)
    .where(and(...guideWhere))
    .limit(limit * 3);

  const universityRowsQuery = db
    .select({
      slug: universities.slug,
      name: universities.name,
      summary: universities.summary,
      countrySlug: countries.slug,
      courseSlug: courses.slug,
      stream: courses.stream,
    })
    .from(universities)
    .innerJoin(countries, eq(universities.countryId, countries.id))
    .innerJoin(programOfferings, eq(programOfferings.universityId, universities.id))
    .innerJoin(courses, eq(programOfferings.courseId, courses.id))
    .where(and(...universityWhere))
    .limit(limit * 3);

  const [guideRows, universityRows] = await Promise.all([guideRowsQuery, universityRowsQuery]);

  const byKey = new Map<string, RelatedContentItem & { rank: number }>();

  for (const row of guideRows) {
    const page = row.page as StudyAbroadGuidePageProps;
    const key = `guide:${row.slug}`;
    const item = {
      slug: row.slug,
      title: page.title,
      description: page.summary,
      href: getStudyAbroadGuideHref(row.slug),
      type: "guide" as const,
      rank: rank({ courseSlug, countrySlug, stream }, row),
    };
    const existing = byKey.get(key);
    if (!existing || item.rank > existing.rank) byKey.set(key, item);
  }

  for (const row of universityRows) {
    const key = `university:${row.slug}`;
    const item = {
      slug: row.slug,
      title: row.name,
      description: row.summary,
      href: getUniversityHref(row.slug),
      type: "university" as const,
      rank: rank({ courseSlug, countrySlug, stream }, row),
    };
    const existing = byKey.get(key);
    if (!existing || item.rank > existing.rank) byKey.set(key, item);
  }

  return Array.from(byKey.values())
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit)
    .map(({ rank: _rank, ...item }) => item);
}
