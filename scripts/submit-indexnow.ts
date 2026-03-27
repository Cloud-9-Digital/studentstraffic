import "dotenv/config";

import {
  countries as demoCountries,
  courses as demoCourses,
  landingPages,
  programOfferings as demoProgramOfferings,
  universities as demoUniversities,
} from "@/lib/data/demo-dataset";
import type {
  Country,
  Course,
  FinderProgram,
  ProgramOffering,
  University,
} from "@/lib/data/types";
import { getDb } from "@/lib/db/core";
import {
  countries as countriesTable,
  courses as coursesTable,
  programOfferings as programOfferingsTable,
  universities as universitiesTable,
} from "@/lib/db/schema";
import { buildIndexNowPayload } from "@/lib/indexnow";
import { absoluteUrl } from "@/lib/metadata";
import {
  getBudgetGuideHref,
  getComparisonHref,
  getCountryHref,
  getCourseHref,
  getLandingPageHref,
  getUniversityHref,
} from "@/lib/routes";

type CatalogSnapshot = {
  countries: Country[];
  courses: Course[];
  universities: University[];
  programOfferings: ProgramOffering[];
};

function uniqueValues<T>(items: T[]) {
  return [...new Set(items)];
}

async function getCatalogSnapshot(): Promise<CatalogSnapshot> {
  const db = getDb();

  if (!db) {
    return {
      countries: demoCountries,
      courses: demoCourses,
      universities: demoUniversities,
      programOfferings: demoProgramOfferings,
    };
  }

  const [countryRows, courseRows, universityRows, programRows] = await Promise.all([
    db.select().from(countriesTable),
    db.select().from(coursesTable),
    db
      .select({
        id: universitiesTable.id,
        countryId: universitiesTable.countryId,
        slug: universitiesTable.slug,
        name: universitiesTable.name,
        city: universitiesTable.city,
        type: universitiesTable.type,
        establishedYear: universitiesTable.establishedYear,
        summary: universitiesTable.summary,
        featured: universitiesTable.featured,
        officialWebsite: universitiesTable.officialWebsite,
        logoUrl: universitiesTable.logoUrl,
        coverImageUrl: universitiesTable.coverImageUrl,
        galleryImages: universitiesTable.galleryImages,
        campusLifestyle: universitiesTable.campusLifestyle,
        cityProfile: universitiesTable.cityProfile,
        clinicalExposure: universitiesTable.clinicalExposure,
        hostelOverview: universitiesTable.hostelOverview,
        indianFoodSupport: universitiesTable.indianFoodSupport,
        safetyOverview: universitiesTable.safetyOverview,
        studentSupport: universitiesTable.studentSupport,
        whyChoose: universitiesTable.whyChoose,
        thingsToConsider: universitiesTable.thingsToConsider,
        bestFitFor: universitiesTable.bestFitFor,
        teachingHospitals: universitiesTable.teachingHospitals,
        recognitionBadges: universitiesTable.recognitionBadges,
        recognitionLinks: universitiesTable.recognitionLinks,
        faq: universitiesTable.faq,
        references: universitiesTable.references,
        similarUniversitySlugs: universitiesTable.similarUniversitySlugs,
      })
      .from(universitiesTable),
    db.select().from(programOfferingsTable),
  ]);

  const countries: Country[] = countryRows.map((country) => ({
    slug: country.slug,
    name: country.name,
    region: country.region,
    summary: country.summary,
    whyStudentsChooseIt: country.whyStudentsChooseIt,
    climate: country.climate,
    currencyCode: country.currencyCode,
    metaTitle: country.metaTitle,
    metaDescription: country.metaDescription,
  }));

  const courses: Course[] = courseRows.map((course) => ({
    slug: course.slug,
    name: course.name,
    shortName: course.shortName,
    durationYears: course.durationYears,
    summary: course.summary,
    metaTitle: course.metaTitle,
    metaDescription: course.metaDescription,
  }));

  const countrySlugsById = new Map(
    countryRows.map((country) => [country.id, country.slug])
  );
  const courseSlugsById = new Map(
    courseRows.map((course) => [course.id, course.slug])
  );

  const universities: University[] = universityRows.map((university) => ({
    slug: university.slug,
    countrySlug: countrySlugsById.get(university.countryId) ?? "",
    name: university.name,
    city: university.city,
    type: university.type as University["type"],
    establishedYear: university.establishedYear,
    summary: university.summary,
    featured: university.featured,
    officialWebsite: university.officialWebsite,
    logoUrl: university.logoUrl ?? undefined,
    coverImageUrl: university.coverImageUrl ?? undefined,
    galleryImages: university.galleryImages as University["galleryImages"],
    campusLifestyle: university.campusLifestyle,
    cityProfile: university.cityProfile,
    clinicalExposure: university.clinicalExposure,
    hostelOverview: university.hostelOverview,
    indianFoodSupport: university.indianFoodSupport,
    safetyOverview: university.safetyOverview,
    studentSupport: university.studentSupport,
    whyChoose: university.whyChoose as University["whyChoose"],
    thingsToConsider:
      university.thingsToConsider as University["thingsToConsider"],
    bestFitFor: university.bestFitFor as University["bestFitFor"],
    teachingHospitals: university.teachingHospitals,
    recognitionBadges: university.recognitionBadges,
    recognitionLinks:
      university.recognitionLinks as University["recognitionLinks"],
    faq: university.faq as University["faq"],
    references: university.references as University["references"],
    similarUniversitySlugs: university.similarUniversitySlugs,
  }));

  const universitySlugsById = new Map(
    universityRows.map((university) => [university.id, university.slug])
  );

  const programOfferings: ProgramOffering[] = programRows.map((program) => ({
    slug: program.slug,
    universitySlug: universitySlugsById.get(program.universityId) ?? "",
    courseSlug: courseSlugsById.get(program.courseId) ?? "",
    title: program.title,
    durationYears: program.durationYears,
    annualTuitionUsd: program.annualTuitionUsd,
    totalTuitionUsd: program.totalTuitionUsd,
    livingUsd: program.livingUsd,
    officialProgramUrl: program.officialProgramUrl,
    medium: program.medium as ProgramOffering["medium"],
    teachingPhases:
      program.teachingPhases as ProgramOffering["teachingPhases"],
    yearlyCostBreakdown:
      program.yearlyCostBreakdown as ProgramOffering["yearlyCostBreakdown"],
    licenseExamSupport:
      program.licenseExamSupport as ProgramOffering["licenseExamSupport"],
    intakeMonths: program.intakeMonths,
    featured: program.featured,
  }));

  return { countries, courses, universities, programOfferings };
}

function buildFinderPrograms(snapshot: CatalogSnapshot) {
  const universityBySlug = new Map(
    snapshot.universities.map((university) => [university.slug, university])
  );
  const countryBySlug = new Map(
    snapshot.countries.map((country) => [country.slug, country])
  );
  const courseBySlug = new Map(
    snapshot.courses.map((course) => [course.slug, course])
  );

  return snapshot.programOfferings
    .map((offering): FinderProgram | null => {
      const university = universityBySlug.get(offering.universitySlug);
      const course = courseBySlug.get(offering.courseSlug);
      const country = university
        ? countryBySlug.get(university.countrySlug)
        : undefined;

      if (!university || !course || !country) {
        return null;
      }

      return { country, course, university, offering };
    })
    .filter((program): program is FinderProgram => Boolean(program))
    .sort((a, b) => {
      if (a.offering.featured !== b.offering.featured) {
        return Number(b.offering.featured) - Number(a.offering.featured);
      }

      return a.offering.annualTuitionUsd - b.offering.annualTuitionUsd;
    });
}

function getComparisonGuideSlug(leftUniversitySlug: string, rightUniversitySlug: string) {
  return [leftUniversitySlug, rightUniversitySlug]
    .sort((left, right) => left.localeCompare(right))
    .join("-vs-");
}

function getComparisonGuideSlugs(programs: FinderProgram[]) {
  const primaryPrograms = new Map<string, FinderProgram>();
  const seenPairs = new Set<string>();
  const slugs: string[] = [];

  for (const program of programs) {
    if (!primaryPrograms.has(program.university.slug)) {
      primaryPrograms.set(program.university.slug, program);
    }
  }

  for (const program of primaryPrograms.values()) {
    for (const similarSlug of program.university.similarUniversitySlugs) {
      if (!primaryPrograms.has(similarSlug)) {
        continue;
      }

      const pairKey = [program.university.slug, similarSlug]
        .sort((left, right) => left.localeCompare(right))
        .join("::");

      if (seenPairs.has(pairKey)) {
        continue;
      }

      seenPairs.add(pairKey);
      slugs.push(getComparisonGuideSlug(program.university.slug, similarSlug));
    }
  }

  return slugs;
}

function getBudgetGuideSlugs(programs: FinderProgram[], courses: Course[]) {
  const budgetThresholds = [4000, 5000, 6000, 8000, 10000];
  const slugs: string[] = [];

  for (const course of courses) {
    const coursePrograms = programs.filter(
      (program) => program.course.slug === course.slug
    );

    for (const budgetUsd of budgetThresholds) {
      if (
        coursePrograms.filter(
          (program) => program.offering.annualTuitionUsd <= budgetUsd
        ).length >= 2
      ) {
        slugs.push(`${course.slug}-under-${budgetUsd}-usd`);
      }
    }
  }

  return slugs;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const snapshot = await getCatalogSnapshot();
  const finderPrograms = buildFinderPrograms(snapshot);
  const comparisonGuideSlugs = getComparisonGuideSlugs(finderPrograms);
  const budgetGuideSlugs = getBudgetGuideSlugs(
    finderPrograms,
    snapshot.courses
  );

  const urlList = uniqueValues([
    absoluteUrl("/"),
    absoluteUrl("/about"),
    absoluteUrl("/contact"),
    absoluteUrl("/editorial-policy"),
    absoluteUrl("/methodology"),
    absoluteUrl("/countries"),
    absoluteUrl("/courses"),
    absoluteUrl("/universities"),
    absoluteUrl("/compare"),
    absoluteUrl("/budget"),
    ...landingPages.map((page) =>
      absoluteUrl(getLandingPageHref(page.courseSlug, page.countrySlug))
    ),
    ...snapshot.countries.map((country) =>
      absoluteUrl(getCountryHref(country.slug))
    ),
    ...snapshot.courses.map((course) => absoluteUrl(getCourseHref(course.slug))),
    ...snapshot.universities.map((university) =>
      absoluteUrl(getUniversityHref(university.slug))
    ),
    ...comparisonGuideSlugs.map((slug) =>
      absoluteUrl(getComparisonHref(slug))
    ),
    ...budgetGuideSlugs.map((slug) => absoluteUrl(getBudgetGuideHref(slug))),
  ]);
  const payload = buildIndexNowPayload(urlList);

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `IndexNow submission failed with ${response.status} ${response.statusText}`
    );
  }

  console.log(`Submitted ${payload.urlList.length} URLs to IndexNow.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
