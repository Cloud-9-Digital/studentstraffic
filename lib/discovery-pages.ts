import { cacheLife, cacheTag } from "next/cache";

import type { Country, Course, FinderProgram } from "@/lib/data/types";
import { getCountries, getCourses, listFinderPrograms } from "@/lib/data/catalog";

export type ComparisonGuide = {
  kind: "university";
  slug: string;
  left: FinderProgram;
  right: FinderProgram;
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

function getPrimaryProgramsByUniversity(programs: FinderProgram[]) {
  const primaryPrograms = new Map<string, FinderProgram>();

  for (const program of programs) {
    if (!primaryPrograms.has(program.university.slug)) {
      primaryPrograms.set(program.university.slug, program);
    }
  }

  return primaryPrograms;
}

async function buildComparisonGuides() {
  const programs = await listFinderPrograms({});
  const primaryPrograms = getPrimaryProgramsByUniversity(programs);
  const seenPairs = new Set<string>();
  const guides: ComparisonGuide[] = [];

  for (const program of primaryPrograms.values()) {
    for (const similarSlug of program.university.similarUniversitySlugs) {
      const similarProgram = primaryPrograms.get(similarSlug);

      if (!similarProgram) {
        continue;
      }

      const pairKey = sortPair(
        program.university.slug,
        similarProgram.university.slug
      ).join("::");

      if (seenPairs.has(pairKey)) {
        continue;
      }

      seenPairs.add(pairKey);

      guides.push({
        kind: "university",
        slug: getComparisonGuideSlug(
          program.university.slug,
          similarProgram.university.slug
        ),
        left:
          program.university.slug.localeCompare(similarProgram.university.slug) <= 0
            ? program
            : similarProgram,
        right:
          program.university.slug.localeCompare(similarProgram.university.slug) <= 0
            ? similarProgram
            : program,
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

export async function getComparisonGuideBySlug(slug: string) {
  const guides = await getCachedComparisonGuides();
  return guides.find((guide) => guide.slug === slug) ?? null;
}

export async function getComparisonGuidesForUniversity(universitySlug: string, limit = 2) {
  const guides = await getCachedComparisonGuides();
  return guides
    .filter(
      (guide) =>
        guide.left.university.slug === universitySlug ||
        guide.right.university.slug === universitySlug
    )
    .slice(0, limit);
}

async function buildCountryComparisonGuides() {
  const [countries, courses, programs] = await Promise.all([
    getCountries(),
    getCourses(),
    listFinderPrograms({}),
  ]);
  const countryBySlug = new Map(countries.map((country) => [country.slug, country]));
  const guides: CountryComparisonGuide[] = [];

  for (const course of courses) {
    const coursePrograms = programs.filter(
      (program) => program.course.slug === course.slug
    );
    const countriesForCourse = [...new Set(
      coursePrograms.map((program) => program.country.slug)
    )]
      .map((countrySlug) => ({
        country: countryBySlug.get(countrySlug) ?? null,
        programs: coursePrograms.filter(
          (program) => program.country.slug === countrySlug
        ),
      }))
      .filter(
        (
          entry
        ): entry is { country: Country; programs: FinderProgram[] } =>
          entry.country !== null && entry.programs.length >= 2
      );

    for (let index = 0; index < countriesForCourse.length; index += 1) {
      for (
        let innerIndex = index + 1;
        innerIndex < countriesForCourse.length;
        innerIndex += 1
      ) {
        const leftEntry = countriesForCourse[index];
        const rightEntry = countriesForCourse[innerIndex];
        const [leftCountry, rightCountry] =
          leftEntry.country.slug.localeCompare(rightEntry.country.slug) <= 0
            ? [leftEntry, rightEntry]
            : [rightEntry, leftEntry];

        guides.push({
          kind: "country",
          slug: getCountryComparisonGuideSlug(
            course.slug,
            leftCountry.country.slug,
            rightCountry.country.slug
          ),
          course,
          leftCountry: leftCountry.country,
          rightCountry: rightCountry.country,
          leftPrograms: leftCountry.programs,
          rightPrograms: rightCountry.programs,
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
  const [countries, courses, programs] = await Promise.all([
    getCountries(),
    getCourses(),
    listFinderPrograms({}),
  ]);
  const countryBySlug = new Map(countries.map((country) => [country.slug, country]));
  const guides: BudgetComparisonGuide[] = [];

  for (const course of courses) {
    const coursePrograms = programs.filter(
      (program) => program.course.slug === course.slug
    );

    for (const budgetUsd of budgetThresholds) {
      const matchingPrograms = coursePrograms.filter(
        (program) =>
          program.offering.annualTuitionUsd > 0 &&
          program.offering.annualTuitionUsd <= budgetUsd
      );
      const countriesWithinBudget = [...new Set(
        matchingPrograms.map((program) => program.country.slug)
      )]
        .map((countrySlug) => ({
          country: countryBySlug.get(countrySlug) ?? null,
          programs: matchingPrograms.filter(
            (program) => program.country.slug === countrySlug
          ),
        }))
        .filter(
          (
            entry
          ): entry is { country: Country; programs: FinderProgram[] } =>
            entry.country !== null && entry.programs.length >= 2
        );

      for (let index = 0; index < countriesWithinBudget.length; index += 1) {
        for (
          let innerIndex = index + 1;
          innerIndex < countriesWithinBudget.length;
          innerIndex += 1
        ) {
          const leftEntry = countriesWithinBudget[index];
          const rightEntry = countriesWithinBudget[innerIndex];
          const [leftCountry, rightCountry] =
            leftEntry.country.slug.localeCompare(rightEntry.country.slug) <= 0
              ? [leftEntry, rightEntry]
              : [rightEntry, leftEntry];

          guides.push({
            kind: "budget",
            slug: getBudgetComparisonGuideSlug(
              course.slug,
              budgetUsd,
              leftCountry.country.slug,
              rightCountry.country.slug
            ),
            budgetUsd,
            course,
            leftCountry: leftCountry.country,
            rightCountry: rightCountry.country,
            leftPrograms: leftCountry.programs,
            rightPrograms: rightCountry.programs,
          });
        }
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

async function getCachedAllComparisonPages() {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("comparison-guides");

  const [universityGuides, countryGuides, budgetGuides] = await Promise.all([
    getCachedComparisonGuides(),
    getCachedCountryComparisonGuides(),
    getCachedBudgetComparisonGuides(),
  ]);

  return [
    ...universityGuides,
    ...countryGuides,
    ...budgetGuides,
  ].sort((left, right) => left.slug.localeCompare(right.slug));
}

export async function getAllComparisonPages() {
  return getCachedAllComparisonPages();
}

export async function getComparisonPageBySlug(slug: string) {
  const pages = await getCachedAllComparisonPages();
  return pages.find((page) => page.slug === slug) ?? null;
}

async function buildBudgetGuides() {
  const [courses, programs] = await Promise.all([getCourses(), listFinderPrograms({})]);
  const guides: BudgetGuide[] = [];

  for (const course of courses) {
    const coursePrograms = programs.filter(
      (program) => program.course.slug === course.slug
    );

    for (const budgetUsd of budgetThresholds) {
      const matchingPrograms = coursePrograms.filter(
        (program) =>
          program.offering.annualTuitionUsd > 0 &&
          program.offering.annualTuitionUsd <= budgetUsd
      );

      if (matchingPrograms.length < 2) {
        continue;
      }

      guides.push({
        slug: getBudgetGuideSlug(course.slug, budgetUsd),
        budgetUsd,
        course,
        programs: matchingPrograms,
      });
    }
  }

  return guides.sort((a, b) => {
    if (a.course.slug !== b.course.slug) {
      return a.course.slug.localeCompare(b.course.slug);
    }

    return a.budgetUsd - b.budgetUsd;
  });
}

async function getCachedBudgetGuides() {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("budget-guides");

  return buildBudgetGuides();
}

export async function getBudgetGuides() {
  return getCachedBudgetGuides();
}

export async function getBudgetGuideBySlug(slug: string) {
  const guides = await getCachedBudgetGuides();
  return guides.find((guide) => guide.slug === slug) ?? null;
}

export async function getBudgetGuidesForCourse(courseSlug: string) {
  const guides = await getCachedBudgetGuides();
  return guides.filter((guide) => guide.course.slug === courseSlug);
}

export async function getRecommendedBudgetGuideForCourse(courseSlug: string) {
  const guides = await getBudgetGuidesForCourse(courseSlug);
  return guides[0] ?? null;
}
