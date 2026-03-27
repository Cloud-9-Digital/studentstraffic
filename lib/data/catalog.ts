import "server-only";

import { cacheLife, cacheTag } from "next/cache";

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
  FinderFilters,
  FinderProgram,
  LandingPage,
  ProgramOffering,
  University,
} from "@/lib/data/types";
import { getDb } from "@/lib/db/server";
import {
  countries as countriesTable,
  courses as coursesTable,
  programOfferings as programOfferingsTable,
  universities as universitiesTable,
} from "@/lib/db/schema";
import {
  getBudgetIndexHref,
  getCompareIndexHref,
  getCountriesIndexHref,
  getCountryHref,
  getCoursesIndexHref,
  getCourseHref,
  getUniversityHref,
} from "@/lib/routes";

type CatalogSnapshot = {
  countries: Country[];
  courses: Course[];
  universities: University[];
  programOfferings: ProgramOffering[];
};

let catalogFallbackWarningShown = false;

async function readCatalogFromDatabase(): Promise<CatalogSnapshot | null> {
  const db = getDb();

  if (!db) {
    return null;
  }

  try {
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

    return {
      countries,
      courses,
      universities,
      programOfferings,
    };
  } catch (error) {
    if (!catalogFallbackWarningShown) {
      catalogFallbackWarningShown = true;
      console.warn(
        "Falling back to the demo catalog because the database is not ready yet.",
        error
      );
    }

    return null;
  }
}

export async function getCatalogSnapshot() {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("countries");
  cacheTag("courses");
  cacheTag("universities");
  cacheTag("program-offerings");

  return (
    (await readCatalogFromDatabase()) ?? {
      countries: demoCountries,
      courses: demoCourses,
      universities: demoUniversities,
      programOfferings: demoProgramOfferings,
    }
  );
}

export async function getCountries() {
  const snapshot = await getCatalogSnapshot();
  return snapshot.countries;
}

export async function getCountryBySlug(slug: string) {
  const countries = await getCountries();
  return countries.find((country) => country.slug === slug) ?? null;
}

export async function getCourses() {
  const snapshot = await getCatalogSnapshot();
  return snapshot.courses;
}

export async function getCourseBySlug(slug: string) {
  const courses = await getCourses();
  return courses.find((course) => course.slug === slug) ?? null;
}

export async function getUniversities() {
  const snapshot = await getCatalogSnapshot();
  return snapshot.universities;
}

export async function getUniversityBySlug(slug: string) {
  const universities = await getUniversities();
  return universities.find((university) => university.slug === slug) ?? null;
}

export async function getProgramOfferings() {
  const snapshot = await getCatalogSnapshot();
  return snapshot.programOfferings;
}

export async function getFeaturedLandingPages() {
  return landingPages.slice(0, 4);
}

export async function getLandingPageBySlug(slug: string) {
  return landingPages.find((page) => page.slug === slug) ?? null;
}

export async function getLandingPageSlugs() {
  return landingPages.map((page) => page.slug);
}

export async function listFinderPrograms(filters: FinderFilters) {
  const snapshot = await getCatalogSnapshot();

  const universityBySlug = new Map(
    snapshot.universities.map((university) => [university.slug, university])
  );
  const countryBySlug = new Map(
    snapshot.countries.map((country) => [country.slug, country])
  );
  const courseBySlug = new Map(snapshot.courses.map((course) => [course.slug, course]));

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

      return {
        country,
        course,
        university,
        offering,
      };
    })
    .filter((item): item is FinderProgram => Boolean(item))
    .filter((program) => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        const haystack = [
          program.university.name,
          program.university.city,
          program.country.name,
          program.course.shortName,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (filters.country && program.country.slug !== filters.country) {
        return false;
      }

      if (filters.course && program.course.slug !== filters.course) {
        return false;
      }

      if (filters.feeMin && program.offering.annualTuitionUsd < filters.feeMin) {
        return false;
      }

      if (filters.feeMax && program.offering.annualTuitionUsd > filters.feeMax) {
        return false;
      }

      if (filters.medium && program.offering.medium !== filters.medium) {
        return false;
      }

      if (
        filters.intake &&
        !program.offering.intakeMonths.includes(filters.intake)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (a.offering.featured !== b.offering.featured) {
        return Number(b.offering.featured) - Number(a.offering.featured);
      }

      return a.offering.annualTuitionUsd - b.offering.annualTuitionUsd;
    });
}

export async function getFinderOptions() {
  const snapshot = await getCatalogSnapshot();

  return {
    countries: snapshot.countries,
    courses: snapshot.courses,
    mediums: [...new Set(snapshot.programOfferings.map((item) => item.medium))],
    intakes: [
      ...new Set(snapshot.programOfferings.flatMap((item) => item.intakeMonths)),
    ].sort(),
  };
}

export async function getFeaturedPrograms(limit = 4) {
  const featuredPrograms = await listFinderPrograms({});
  return featuredPrograms.filter((program) => program.offering.featured).slice(0, limit);
}

export async function getProgramsForCountry(countrySlug: string) {
  return listFinderPrograms({ country: countrySlug });
}

export async function getProgramsForCourse(courseSlug: string) {
  return listFinderPrograms({ course: courseSlug });
}

export async function getProgramsForUniversity(universitySlug: string) {
  const programs = await listFinderPrograms({});
  return programs.filter((program) => program.university.slug === universitySlug);
}

export async function getRelatedLandingPages(
  countrySlug: string,
  courseSlugs: string | string[]
) {
  const courseSlugSet = new Set(
    Array.isArray(courseSlugs) ? courseSlugs : [courseSlugs]
  );

  return landingPages.filter(
    (page) =>
      page.countrySlug === countrySlug || courseSlugSet.has(page.courseSlug)
  );
}

export async function getFeaturedUniversities(limit = 4) {
  const universities = await getUniversities();
  return universities.filter((university) => university.featured).slice(0, limit);
}

export async function getHomeStats() {
  const [countries, universities, programs] = await Promise.all([
    getCountries(),
    getUniversities(),
    getProgramOfferings(),
  ]);

  const cheapestAnnualTuitionUsd = Math.min(
    ...programs.map((program) => program.annualTuitionUsd)
  );

  return {
    countriesCount: countries.length,
    universitiesCount: universities.length,
    programsCount: programs.length,
    cheapestAnnualTuitionUsd: Number.isFinite(cheapestAnnualTuitionUsd)
      ? cheapestAnnualTuitionUsd
      : 0,
  };
}

export async function getSitemapStaticUrls() {
  const [countries, courses] = await Promise.all([getCountries(), getCourses()]);

  return [
    "/",
    "/about",
    "/contact",
    "/editorial-policy",
    "/methodology",
    "/universities",
    getCountriesIndexHref(),
    getCoursesIndexHref(),
    getCompareIndexHref(),
    getBudgetIndexHref(),
    ...landingPages.map((page) => `/${page.slug}`),
    ...countries.map((country) => getCountryHref(country.slug)),
    ...courses.map((course) => getCourseHref(course.slug)),
  ];
}

export async function getUniversitySitemapSlice(start: number, end: number) {
  const universities = await getUniversities();
  return universities.slice(start, end).map((university) => ({
    slug: university.slug,
    path: getUniversityHref(university.slug),
  }));
}

export async function getAllLandingPages() {
  return landingPages;
}

export async function getLandingPageContext(page: LandingPage) {
  const [country, course, finderPrograms] = await Promise.all([
    getCountryBySlug(page.countrySlug),
    getCourseBySlug(page.courseSlug),
    listFinderPrograms({
      country: page.countrySlug,
      course: page.courseSlug,
    }),
  ]);

  const featuredPrograms = finderPrograms.filter((program) =>
    page.featuredUniversitySlugs.includes(program.university.slug)
  );

  return {
    country,
    course,
    featuredPrograms,
  };
}
