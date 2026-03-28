import type { Course, FinderProgram } from "@/lib/data/types";
import { getCourses, listFinderPrograms } from "@/lib/data/catalog";

export type ComparisonGuide = {
  slug: string;
  left: FinderProgram;
  right: FinderProgram;
};

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

export async function getComparisonGuides() {
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

export async function getComparisonGuideBySlug(slug: string) {
  const guides = await getComparisonGuides();
  return guides.find((guide) => guide.slug === slug) ?? null;
}

export async function getComparisonGuidesForUniversity(universitySlug: string, limit = 2) {
  const guides = await getComparisonGuides();
  return guides
    .filter(
      (guide) =>
        guide.left.university.slug === universitySlug ||
        guide.right.university.slug === universitySlug
    )
    .slice(0, limit);
}

export async function getBudgetGuides() {
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

export async function getBudgetGuideBySlug(slug: string) {
  const guides = await getBudgetGuides();
  return guides.find((guide) => guide.slug === slug) ?? null;
}

export async function getBudgetGuidesForCourse(courseSlug: string) {
  const guides = await getBudgetGuides();
  return guides.filter((guide) => guide.course.slug === courseSlug);
}

export async function getRecommendedBudgetGuideForCourse(courseSlug: string) {
  const guides = await getBudgetGuidesForCourse(courseSlug);
  return guides[0] ?? null;
}
