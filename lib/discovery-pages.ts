import { cacheLife, cacheTag } from "next/cache";
import { sql } from "drizzle-orm";

import type { Country, Course, FinderProgram } from "@/lib/data/types";
import {
  getCountries,
  getCourseBySlug,
  getProgramsForUniversity,
  getUniversityBySlug,
  listFinderPrograms,
} from "@/lib/data/catalog";
import { getDb } from "@/lib/db/server";
import {
  countries as countriesTable,
  courses as coursesTable,
  programOfferings as programOfferingsTable,
  universities as universitiesTable,
} from "@/lib/db/schema";

export type ComparisonGuide = {
  kind: "university";
  slug: string;
  left: FinderProgram;
  right: FinderProgram;
};

export type ComparisonGuideSummary = {
  kind: "university";
  slug: string;
  left: {
    university: Pick<FinderProgram["university"], "slug" | "name">;
    course: Pick<FinderProgram["course"], "shortName">;
  };
  right: {
    university: Pick<FinderProgram["university"], "slug" | "name">;
    course: Pick<FinderProgram["course"], "shortName">;
  };
};

export type CountryComparisonGuide = {
  kind: "country";
  slug: string;
  course: Course;
  leftCountry: Country;
  rightCountry: Country;
  leftPrograms: FinderProgram[];
  rightPrograms: FinderProgram[];
};

export type BudgetComparisonGuide = {
  kind: "budget";
  slug: string;
  budgetUsd: number;
  course: Course;
  leftCountry: Country;
  rightCountry: Country;
  leftPrograms: FinderProgram[];
  rightPrograms: FinderProgram[];
};

export type CountryComparisonGuideSummary = Omit<
  CountryComparisonGuide,
  "course" | "leftCountry" | "rightCountry" | "leftPrograms" | "rightPrograms"
> & {
  course: Pick<Course, "slug" | "name" | "shortName">;
  leftCountry: Pick<Country, "slug" | "name">;
  rightCountry: Pick<Country, "slug" | "name">;
};

type BudgetCountryStats = {
  programCount: number;
  minimumAnnualTuitionUsd: number;
  maximumAnnualTuitionUsd: number;
};

export type BudgetComparisonGuideSummary = Omit<
  BudgetComparisonGuide,
  "course" | "leftCountry" | "rightCountry" | "leftPrograms" | "rightPrograms"
> & {
  course: Pick<Course, "slug" | "name" | "shortName">;
  leftCountry: Pick<Country, "slug" | "name">;
  rightCountry: Pick<Country, "slug" | "name">;
  leftStats: BudgetCountryStats;
  rightStats: BudgetCountryStats;
};

export type ComparisonPage =
  | ComparisonGuide
  | CountryComparisonGuide
  | BudgetComparisonGuide;

export type BudgetGuide = {
  slug: string;
  budgetUsd: number;
  course: Course;
  programs: FinderProgram[];
};

export type BudgetGuideSummary = {
  slug: string;
  budgetUsd: number;
  course: Pick<Course, "slug" | "name" | "shortName">;
  programCount: number;
  countryNames: string[];
};

const budgetThresholds = [4000, 5000, 6000, 8000, 10000];

function sortPair(a: string, b: string) {
  return [a, b].sort((left, right) => left.localeCompare(right));
}

export function getComparisonGuideSlug(leftUniversitySlug: string, rightUniversitySlug: string) {
  const [left, right] = sortPair(leftUniversitySlug, rightUniversitySlug);
  return `${left}-vs-${right}`;
}

function getCountryComparisonGuideSlug(
  courseSlug: string,
  leftCountrySlug: string,
  rightCountrySlug: string
) {
  const [left, right] = sortPair(leftCountrySlug, rightCountrySlug);
  return `country-${courseSlug}-${left}-vs-${right}`;
}

function getBudgetComparisonGuideSlug(
  courseSlug: string,
  budgetUsd: number,
  leftCountrySlug: string,
  rightCountrySlug: string
) {
  const [left, right] = sortPair(leftCountrySlug, rightCountrySlug);
  return `budget-${courseSlug}-under-${budgetUsd}-usd-${left}-vs-${right}`;
}

function getBudgetGuideSlug(courseSlug: string, budgetUsd: number) {
  return `${courseSlug}-under-${budgetUsd}-usd`;
}

async function buildComparisonGuides() {
  const db = getDb();
  if (!db) return [];

  const result = await db.execute<{
    universitySlug: string;
    universityName: string;
    similarUniversitySlugs: string[];
    courseShortName: string;
  }>(sql`
    SELECT DISTINCT ON (${universitiesTable.id})
      ${universitiesTable.slug} AS "universitySlug",
      ${universitiesTable.name} AS "universityName",
      ${universitiesTable.similarUniversitySlugs} AS "similarUniversitySlugs",
      ${coursesTable.shortName} AS "courseShortName"
    FROM ${universitiesTable}
    INNER JOIN ${programOfferingsTable}
      ON ${programOfferingsTable.universityId} = ${universitiesTable.id}
    INNER JOIN ${coursesTable}
      ON ${programOfferingsTable.courseId} = ${coursesTable.id}
    WHERE ${universitiesTable.published} = true
      AND ${programOfferingsTable.published} = true
    ORDER BY
      ${universitiesTable.id},
      ${programOfferingsTable.featured} DESC,
      CASE
        WHEN ${programOfferingsTable.annualTuitionUsd} > 0
          THEN ${programOfferingsTable.annualTuitionUsd}
        ELSE 2147483647
      END,
      ${coursesTable.shortName},
      ${programOfferingsTable.slug}
  `);
  const primaryPrograms = new Map(
    result.rows.map((row) => [row.universitySlug, row]),
  );
  const seenPairs = new Set<string>();
  const guides: ComparisonGuideSummary[] = [];

  for (const program of primaryPrograms.values()) {
    for (const similarSlug of program.similarUniversitySlugs) {
      const similarProgram = primaryPrograms.get(similarSlug);

      if (!similarProgram) {
        continue;
      }

      const pairKey = sortPair(
        program.universitySlug,
        similarProgram.universitySlug
      ).join("::");

      if (seenPairs.has(pairKey)) {
        continue;
      }

      seenPairs.add(pairKey);

      const [left, right] =
        program.universitySlug.localeCompare(similarProgram.universitySlug) <= 0
          ? [program, similarProgram]
          : [similarProgram, program];

      guides.push({
        kind: "university",
        slug: getComparisonGuideSlug(
          program.universitySlug,
          similarProgram.universitySlug
        ),
        left: {
          university: { slug: left.universitySlug, name: left.universityName },
          course: { shortName: left.courseShortName },
        },
        right: {
          university: { slug: right.universitySlug, name: right.universityName },
          course: { shortName: right.courseShortName },
        },
      });
    }
  }

  return guides.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function getCachedComparisonGuides() {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("comparison-guides");

  return buildComparisonGuides();
}

export async function getComparisonGuides() {
  return getCachedComparisonGuides();
}

async function buildComparisonGuidesForUniversity(
  universitySlug: string,
  limit: number,
) {
  const university = await getUniversityBySlug(universitySlug);
  if (!university) return [];

  const relatedUniversitySlugs = [
    ...new Set(
      university.similarUniversitySlugs.filter(
        (slug) => slug && slug !== universitySlug,
      ),
    ),
  ].slice(0, Math.max(0, limit));

  if (relatedUniversitySlugs.length === 0) return [];

  const [universityPrograms, ...relatedProgramGroups] = await Promise.all([
    getProgramsForUniversity(universitySlug),
    ...relatedUniversitySlugs.map((slug) => getProgramsForUniversity(slug)),
  ]);
  const primaryProgram = universityPrograms[0];

  if (!primaryProgram) return [];

  return relatedProgramGroups.flatMap((programs): ComparisonGuide[] => {
    const relatedProgram = programs[0];
    if (!relatedProgram) return [];

    const [left, right] =
      primaryProgram.university.slug.localeCompare(
        relatedProgram.university.slug,
      ) <= 0
        ? [primaryProgram, relatedProgram]
        : [relatedProgram, primaryProgram];

    return [
      {
        kind: "university",
        slug: getComparisonGuideSlug(
          primaryProgram.university.slug,
          relatedProgram.university.slug,
        ),
        left,
        right,
      },
    ];
  });
}

async function getCachedComparisonGuidesForUniversity(
  universitySlug: string,
  limit: number,
) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("comparison-guides");
  cacheTag(`university-comparison-guides:${universitySlug}`);

  return buildComparisonGuidesForUniversity(universitySlug, limit);
}

export async function getComparisonGuidesForUniversity(universitySlug: string, limit = 2) {
  return getCachedComparisonGuidesForUniversity(
    universitySlug,
    Math.max(0, limit),
  );
}

async function buildCountryComparisonGuides() {
  const db = getDb();
  if (!db) return [];

  const result = await db.execute<{
    courseSlug: string;
    courseName: string;
    courseShortName: string;
    countrySlug: string;
    countryName: string;
  }>(sql`
    SELECT
      ${coursesTable.slug} AS "courseSlug",
      ${coursesTable.name} AS "courseName",
      ${coursesTable.shortName} AS "courseShortName",
      ${countriesTable.slug} AS "countrySlug",
      ${countriesTable.name} AS "countryName"
    FROM ${programOfferingsTable}
    INNER JOIN ${universitiesTable}
      ON ${programOfferingsTable.universityId} = ${universitiesTable.id}
    INNER JOIN ${coursesTable}
      ON ${programOfferingsTable.courseId} = ${coursesTable.id}
    INNER JOIN ${countriesTable}
      ON ${universitiesTable.countryId} = ${countriesTable.id}
    WHERE ${programOfferingsTable.published} = true
      AND ${universitiesTable.published} = true
    GROUP BY
      ${coursesTable.slug}, ${coursesTable.name}, ${coursesTable.shortName},
      ${countriesTable.slug}, ${countriesTable.name}
    HAVING count(${programOfferingsTable.id}) >= 2
    ORDER BY ${coursesTable.slug}, ${countriesTable.slug}
  `);
  const rowsByCourse = new Map<string, typeof result.rows>();
  for (const row of result.rows) {
    rowsByCourse.set(row.courseSlug, [...(rowsByCourse.get(row.courseSlug) ?? []), row]);
  }
  const guides: CountryComparisonGuideSummary[] = [];

  for (const countriesForCourse of rowsByCourse.values()) {
    const courseRow = countriesForCourse[0];
    if (!courseRow) continue;

    for (let index = 0; index < countriesForCourse.length; index += 1) {
      for (
        let innerIndex = index + 1;
        innerIndex < countriesForCourse.length;
        innerIndex += 1
      ) {
        const leftCountry = countriesForCourse[index];
        const rightCountry = countriesForCourse[innerIndex];

        guides.push({
          kind: "country",
          slug: getCountryComparisonGuideSlug(
            courseRow.courseSlug,
            leftCountry.countrySlug,
            rightCountry.countrySlug
          ),
          course: {
            slug: courseRow.courseSlug,
            name: courseRow.courseName,
            shortName: courseRow.courseShortName,
          },
          leftCountry: { slug: leftCountry.countrySlug, name: leftCountry.countryName },
          rightCountry: { slug: rightCountry.countrySlug, name: rightCountry.countryName },
        });
      }
    }
  }

  return guides.sort((left, right) => left.slug.localeCompare(right.slug));
}

async function getCachedCountryComparisonGuides() {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("comparison-guides");
  cacheTag("country-comparison-guides");

  return buildCountryComparisonGuides();
}

export async function getCountryComparisonGuides() {
  return getCachedCountryComparisonGuides();
}

async function buildBudgetComparisonGuides() {
  const db = getDb();
  if (!db) return [];

  const result = await db.execute<{
    courseSlug: string;
    courseName: string;
    courseShortName: string;
    budgetUsd: number;
    countrySlug: string;
    countryName: string;
    programCount: number;
    minimumAnnualTuitionUsd: number;
    maximumAnnualTuitionUsd: number;
  }>(sql`
    WITH budgets (budget_usd) AS (
      VALUES (4000), (5000), (6000), (8000), (10000)
    )
    SELECT
      ${coursesTable.slug} AS "courseSlug",
      ${coursesTable.name} AS "courseName",
      ${coursesTable.shortName} AS "courseShortName",
      budgets.budget_usd::int AS "budgetUsd",
      ${countriesTable.slug} AS "countrySlug",
      ${countriesTable.name} AS "countryName",
      count(${programOfferingsTable.id})::int AS "programCount",
      min(${programOfferingsTable.annualTuitionUsd})::int AS "minimumAnnualTuitionUsd",
      max(${programOfferingsTable.annualTuitionUsd})::int AS "maximumAnnualTuitionUsd"
    FROM ${programOfferingsTable}
    INNER JOIN ${universitiesTable}
      ON ${programOfferingsTable.universityId} = ${universitiesTable.id}
    INNER JOIN ${coursesTable}
      ON ${programOfferingsTable.courseId} = ${coursesTable.id}
    INNER JOIN ${countriesTable}
      ON ${universitiesTable.countryId} = ${countriesTable.id}
    CROSS JOIN budgets
    WHERE ${programOfferingsTable.published} = true
      AND ${universitiesTable.published} = true
      AND ${programOfferingsTable.annualTuitionUsd} > 0
      AND ${programOfferingsTable.annualTuitionUsd} <= budgets.budget_usd
    GROUP BY
      ${coursesTable.slug}, ${coursesTable.name}, ${coursesTable.shortName},
      budgets.budget_usd, ${countriesTable.slug}, ${countriesTable.name}
    HAVING count(${programOfferingsTable.id}) >= 2
    ORDER BY ${coursesTable.slug}, budgets.budget_usd, ${countriesTable.slug}
  `);
  const rowsByCourseAndBudget = new Map<string, typeof result.rows>();
  for (const row of result.rows) {
    const key = `${row.courseSlug}:${row.budgetUsd}`;
    rowsByCourseAndBudget.set(key, [...(rowsByCourseAndBudget.get(key) ?? []), row]);
  }
  const guides: BudgetComparisonGuideSummary[] = [];

  for (const countriesWithinBudget of rowsByCourseAndBudget.values()) {
    const firstRow = countriesWithinBudget[0];
    if (!firstRow) continue;

      for (let index = 0; index < countriesWithinBudget.length; index += 1) {
        for (
          let innerIndex = index + 1;
          innerIndex < countriesWithinBudget.length;
          innerIndex += 1
        ) {
          const leftCountry = countriesWithinBudget[index];
          const rightCountry = countriesWithinBudget[innerIndex];

          guides.push({
            kind: "budget",
            slug: getBudgetComparisonGuideSlug(
              firstRow.courseSlug,
              firstRow.budgetUsd,
              leftCountry.countrySlug,
              rightCountry.countrySlug
            ),
            budgetUsd: firstRow.budgetUsd,
            course: {
              slug: firstRow.courseSlug,
              name: firstRow.courseName,
              shortName: firstRow.courseShortName,
            },
            leftCountry: { slug: leftCountry.countrySlug, name: leftCountry.countryName },
            rightCountry: { slug: rightCountry.countrySlug, name: rightCountry.countryName },
            leftStats: {
              programCount: leftCountry.programCount,
              minimumAnnualTuitionUsd: leftCountry.minimumAnnualTuitionUsd,
              maximumAnnualTuitionUsd: leftCountry.maximumAnnualTuitionUsd,
            },
            rightStats: {
              programCount: rightCountry.programCount,
              minimumAnnualTuitionUsd: rightCountry.minimumAnnualTuitionUsd,
              maximumAnnualTuitionUsd: rightCountry.maximumAnnualTuitionUsd,
            },
          });
        }
      }
  }

  return guides.sort((left, right) => left.slug.localeCompare(right.slug));
}

async function getCachedBudgetComparisonGuides() {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("comparison-guides");
  cacheTag("budget-comparison-guides");

  return buildBudgetComparisonGuides();
}

export async function getBudgetComparisonGuides() {
  return getCachedBudgetComparisonGuides();
}

export async function getComparisonPageBySlug(
  slug: string,
): Promise<ComparisonPage | null> {
  if (slug.startsWith("country-")) {
    const summary = (await getCachedCountryComparisonGuides()).find(
      (guide) => guide.slug === slug,
    );
    if (!summary) return null;

    const [course, countries, leftPrograms, rightPrograms] = await Promise.all([
      getCourseBySlug(summary.course.slug),
      getCountries(),
      listFinderPrograms({
        course: summary.course.slug,
        country: summary.leftCountry.slug,
      }),
      listFinderPrograms({
        course: summary.course.slug,
        country: summary.rightCountry.slug,
      }),
    ]);
    const countryBySlug = new Map(countries.map((country) => [country.slug, country]));
    const leftCountry = countryBySlug.get(summary.leftCountry.slug);
    const rightCountry = countryBySlug.get(summary.rightCountry.slug);
    if (!course || !leftCountry || !rightCountry || leftPrograms.length < 2 || rightPrograms.length < 2) {
      return null;
    }

    return { kind: "country", slug, course, leftCountry, rightCountry, leftPrograms, rightPrograms };
  }

  if (slug.startsWith("budget-")) {
    const summary = (await getCachedBudgetComparisonGuides()).find(
      (guide) => guide.slug === slug,
    );
    if (!summary) return null;

    const [course, countries, leftPrograms, rightPrograms] = await Promise.all([
      getCourseBySlug(summary.course.slug),
      getCountries(),
      listFinderPrograms({
        course: summary.course.slug,
        country: summary.leftCountry.slug,
        feeMax: summary.budgetUsd,
      }),
      listFinderPrograms({
        course: summary.course.slug,
        country: summary.rightCountry.slug,
        feeMax: summary.budgetUsd,
      }),
    ]);
    const countryBySlug = new Map(countries.map((country) => [country.slug, country]));
    const leftCountry = countryBySlug.get(summary.leftCountry.slug);
    const rightCountry = countryBySlug.get(summary.rightCountry.slug);
    if (!course || !leftCountry || !rightCountry || leftPrograms.length < 2 || rightPrograms.length < 2) {
      return null;
    }

    return {
      kind: "budget",
      slug,
      budgetUsd: summary.budgetUsd,
      course,
      leftCountry,
      rightCountry,
      leftPrograms,
      rightPrograms,
    };
  }

  const summary = (await getCachedComparisonGuides()).find(
    (guide) => guide.slug === slug,
  );
  if (!summary) return null;

  const [leftPrograms, rightPrograms] = await Promise.all([
    getProgramsForUniversity(summary.left.university.slug),
    getProgramsForUniversity(summary.right.university.slug),
  ]);
  const left = leftPrograms[0];
  const right = rightPrograms[0];
  if (!left || !right) return null;

  return { kind: "university", slug, left, right };
}

export async function getBudgetGuideBySlug(slug: string) {
  const match = /^(.+)-under-(\d+)-usd$/.exec(slug);
  if (!match) return null;

  const courseSlug = match[1];
  const budgetUsd = Number(match[2]);
  if (!budgetThresholds.includes(budgetUsd)) return null;

  const [course, programs] = await Promise.all([
    getCourseBySlug(courseSlug),
    listFinderPrograms({ course: courseSlug, feeMax: budgetUsd }),
  ]);
  const matchingPrograms = programs.filter(
    (program) =>
      program.offering.annualTuitionUsd > 0 &&
      program.offering.annualTuitionUsd <= budgetUsd,
  );

  if (!course || matchingPrograms.length < 2) return null;

  return { slug, budgetUsd, course, programs: matchingPrograms };
}

export async function getBudgetGuidesForCourse(courseSlug: string) {
  const [course, programs] = await Promise.all([
    getCourseBySlug(courseSlug),
    listFinderPrograms({ course: courseSlug }),
  ]);

  if (!course) return [];

  return budgetThresholds.flatMap((budgetUsd) => {
    const matchingPrograms = programs.filter(
      (program) =>
        program.offering.annualTuitionUsd > 0 &&
        program.offering.annualTuitionUsd <= budgetUsd,
    );

    return matchingPrograms.length >= 2
      ? [{
          slug: getBudgetGuideSlug(course.slug, budgetUsd),
          budgetUsd,
          course,
          programs: matchingPrograms,
        }]
      : [];
  });
}

export async function getBudgetGuideSummaries(): Promise<BudgetGuideSummary[]> {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("budget-guides");

  const db = getDb();
  if (!db) return [];

  const result = await db.execute<{
    courseSlug: string;
    courseName: string;
    courseShortName: string;
    budgetUsd: number;
    programCount: number;
    countryNames: string[];
  }>(sql`
    WITH budgets (budget_usd) AS (
      VALUES (4000), (5000), (6000), (8000), (10000)
    )
    SELECT
      ${coursesTable.slug} AS "courseSlug",
      ${coursesTable.name} AS "courseName",
      ${coursesTable.shortName} AS "courseShortName",
      budgets.budget_usd::int AS "budgetUsd",
      count(${programOfferingsTable.id})::int AS "programCount",
      array_agg(DISTINCT ${countriesTable.name} ORDER BY ${countriesTable.name}) AS "countryNames"
    FROM ${programOfferingsTable}
    INNER JOIN ${universitiesTable}
      ON ${programOfferingsTable.universityId} = ${universitiesTable.id}
    INNER JOIN ${coursesTable}
      ON ${programOfferingsTable.courseId} = ${coursesTable.id}
    INNER JOIN ${countriesTable}
      ON ${universitiesTable.countryId} = ${countriesTable.id}
    CROSS JOIN budgets
    WHERE ${programOfferingsTable.published} = true
      AND ${universitiesTable.published} = true
      AND ${programOfferingsTable.annualTuitionUsd} > 0
      AND ${programOfferingsTable.annualTuitionUsd} <= budgets.budget_usd
    GROUP BY
      ${coursesTable.slug},
      ${coursesTable.name},
      ${coursesTable.shortName},
      budgets.budget_usd
    HAVING count(${programOfferingsTable.id}) >= 2
    ORDER BY ${coursesTable.slug}, budgets.budget_usd
  `);

  return result.rows.map((row) => ({
    slug: getBudgetGuideSlug(row.courseSlug, row.budgetUsd),
    budgetUsd: row.budgetUsd,
    course: {
      slug: row.courseSlug,
      name: row.courseName,
      shortName: row.courseShortName,
    },
    programCount: row.programCount,
    countryNames: row.countryNames,
  }));
}

export async function getRecommendedBudgetGuideForCourse(courseSlug: string) {
  const guides = await getBudgetGuidesForCourse(courseSlug);
  return guides[0] ?? null;
}
