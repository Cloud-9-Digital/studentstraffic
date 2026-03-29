import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { and, asc, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";

import { landingPages } from "@/lib/data/landing-pages";
import type {
  Country,
  Course,
  FinderCardProgram,
  FinderCardProgramsPage,
  FinderCountryOption,
  FinderCourseOption,
  FinderOptions,
  FinderFilters,
  FinderProgram,
  FinderProgramsPage,
  FinderSort,
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
import { getSortableUsdValue, hasPublishedUsdAmount } from "@/lib/utils";
import { finderPageSize } from "@/lib/constants";
import { getFinderSort } from "@/lib/filters";

type CatalogSnapshot = {
  countries: Country[];
  courses: Course[];
  universities: University[];
  programOfferings: ProgramOffering[];
};

async function readCatalogFromDatabase(): Promise<CatalogSnapshot | null> {
  const db = getDb();

  if (!db) {
    return null;
  }

  try {
    const [countryRows, courseRows, universityRows, programRows] =
      await Promise.all([
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
            similarUniversitySlugs: universitiesTable.similarUniversitySlugs,
            updatedAt: universitiesTable.updatedAt,
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
      updatedAt: country.updatedAt?.toISOString(),
    }));

    const courses: Course[] = courseRows.map((course) => ({
      slug: course.slug,
      name: course.name,
      shortName: course.shortName,
      durationYears: course.durationYears,
      summary: course.summary,
      metaTitle: course.metaTitle,
      metaDescription: course.metaDescription,
      updatedAt: course.updatedAt?.toISOString(),
    }));

    const countrySlugsById = new Map(
      countryRows.map((country) => [country.id, country.slug]),
    );
    const courseSlugsById = new Map(
      courseRows.map((course) => [course.id, course.slug]),
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
      similarUniversitySlugs: university.similarUniversitySlugs,
      updatedAt: university.updatedAt?.toISOString(),
    }));

    const universitySlugsById = new Map(
      universityRows.map((university) => [university.id, university.slug]),
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
      updatedAt: program.updatedAt?.toISOString(),
    }));

    return {
      countries,
      courses,
      universities,
      programOfferings,
    };
  } catch (error) {
    console.error("Failed to read catalog from database:", error);
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
      countries: [],
      courses: [],
      universities: [],
      programOfferings: [],
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

export async function getLandingPages() {
  return landingPages;
}

export async function getLandingPageBySlug(slug: string) {
  return landingPages.find((page) => page.slug === slug) ?? null;
}

export async function getLandingPageSlugs() {
  return landingPages.map((page) => page.slug);
}

async function getFinderProgramsBase() {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");

  const snapshot = await getCatalogSnapshot();

  const universityBySlug = new Map(
    snapshot.universities.map((university) => [university.slug, university]),
  );
  const countryBySlug = new Map(
    snapshot.countries.map((country) => [country.slug, country]),
  );
  const courseBySlug = new Map(
    snapshot.courses.map((course) => [course.slug, course]),
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

      return {
        country,
        course,
        university,
        offering,
      };
    })
    .filter((item): item is FinderProgram => Boolean(item))
    .sort(compareRecommendedPrograms);
}

function compareFinderProgramNames(left: FinderProgram, right: FinderProgram) {
  const byUniversityName = left.university.name.localeCompare(
    right.university.name,
  );

  if (byUniversityName !== 0) {
    return byUniversityName;
  }

  const byCourseName = left.course.shortName.localeCompare(right.course.shortName);
  if (byCourseName !== 0) {
    return byCourseName;
  }

  return left.country.name.localeCompare(right.country.name);
}

function compareRecommendedPrograms(left: FinderProgram, right: FinderProgram) {
  if (left.offering.featured !== right.offering.featured) {
    return Number(right.offering.featured) - Number(left.offering.featured);
  }

  const tuitionDifference =
    getSortableUsdValue(left.offering.annualTuitionUsd) -
    getSortableUsdValue(right.offering.annualTuitionUsd);

  if (tuitionDifference !== 0) {
    return tuitionDifference;
  }

  return compareFinderProgramNames(left, right);
}

function compareProgramsByTuition(
  left: FinderProgram,
  right: FinderProgram,
  direction: "asc" | "desc",
) {
  const leftHasTuition = hasPublishedUsdAmount(left.offering.annualTuitionUsd);
  const rightHasTuition = hasPublishedUsdAmount(right.offering.annualTuitionUsd);

  if (leftHasTuition !== rightHasTuition) {
    return leftHasTuition ? -1 : 1;
  }

  if (leftHasTuition && rightHasTuition) {
    const tuitionDifference =
      left.offering.annualTuitionUsd - right.offering.annualTuitionUsd;

    if (tuitionDifference !== 0) {
      return direction === "asc" ? tuitionDifference : -tuitionDifference;
    }
  }

  return compareRecommendedPrograms(left, right);
}

function sortFinderPrograms(programs: FinderProgram[], sort: FinderSort) {
  if (sort === "recommended") {
    return programs;
  }

  return [...programs].sort((left, right) => {
    switch (sort) {
      case "tuition_asc":
        return compareProgramsByTuition(left, right, "asc");
      case "tuition_desc":
        return compareProgramsByTuition(left, right, "desc");
      case "name_asc":
        return compareFinderProgramNames(left, right);
      default:
        return compareRecommendedPrograms(left, right);
    }
  });
}

export async function listFinderPrograms(filters: FinderFilters) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");

  const programs = await getFinderProgramsBase();

  const filteredPrograms = programs.filter((program) => {
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

    if (filters.feeMin) {
      if (!hasPublishedUsdAmount(program.offering.annualTuitionUsd)) {
        return false;
      }

      if (program.offering.annualTuitionUsd < filters.feeMin) {
        return false;
      }
    }

    if (filters.feeMax) {
      if (!hasPublishedUsdAmount(program.offering.annualTuitionUsd)) {
        return false;
      }

      if (program.offering.annualTuitionUsd > filters.feeMax) {
        return false;
      }
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
  });

  return sortFinderPrograms(filteredPrograms, getFinderSort(filters.sort));
}

export async function getFinderProgramsPage(
  filters: FinderFilters,
  page = 1,
  pageSize = finderPageSize,
): Promise<FinderProgramsPage> {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");

  const allPrograms = await listFinderPrograms(filters);
  const totalItems = allPrograms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    programs: allPrograms.slice(start, start + pageSize),
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}

const EMPTY_CARD_PAGE: FinderCardProgramsPage = {
  programs: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: finderPageSize,
  hasPreviousPage: false,
  hasNextPage: false,
};

/**
 * DB-level finder query — filters, sorts, and paginates in Postgres.
 * Returns only the slim FinderCardProgram fields needed for the card list.
 * Replaces the in-memory getFinderProgramsPage for the /universities explorer.
 */
export async function queryFinderCardProgramsPage(
  filters: FinderFilters,
  page = 1,
  pageSize = finderPageSize,
): Promise<FinderCardProgramsPage> {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");

  const db = getDb();
  if (!db) return { ...EMPTY_CARD_PAGE, pageSize };

  // Build WHERE conditions
  const conditions = [];

  if (filters.country) {
    conditions.push(eq(countriesTable.slug, filters.country));
  }
  if (filters.course) {
    conditions.push(eq(coursesTable.slug, filters.course));
  }
  if (filters.medium) {
    conditions.push(eq(programOfferingsTable.medium, filters.medium));
  }
  if (filters.feeMin != null) {
    conditions.push(gte(programOfferingsTable.annualTuitionUsd, filters.feeMin));
  }
  if (filters.feeMax != null) {
    conditions.push(lte(programOfferingsTable.annualTuitionUsd, filters.feeMax));
  }
  if (filters.intake) {
    // Postgres array contains
    conditions.push(
      sql`${programOfferingsTable.intakeMonths} @> ARRAY[${filters.intake}]::text[]`,
    );
  }
  if (filters.q) {
    const q = `%${filters.q}%`;
    conditions.push(
      or(
        ilike(universitiesTable.name, q),
        ilike(universitiesTable.city, q),
        ilike(countriesTable.name, q),
        ilike(coursesTable.shortName, q),
      ),
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Sort order — replicate JS sort logic in SQL
  const sort = getFinderSort(filters.sort);
  // Push rows with annualTuitionUsd = 0 (TBD) to end for all sort modes
  const tbd = sql`CASE WHEN ${programOfferingsTable.annualTuitionUsd} = 0 THEN 1 ELSE 0 END`;

  let orderClauses;
  switch (sort) {
    case "tuition_asc":
      orderClauses = [asc(tbd), asc(programOfferingsTable.annualTuitionUsd), asc(universitiesTable.name)];
      break;
    case "tuition_desc":
      orderClauses = [asc(tbd), desc(programOfferingsTable.annualTuitionUsd), asc(universitiesTable.name)];
      break;
    case "name_asc":
      orderClauses = [asc(universitiesTable.name), asc(coursesTable.shortName)];
      break;
    default: // recommended: featured first, then cheapest, then name
      orderClauses = [
        desc(programOfferingsTable.featured),
        asc(tbd),
        asc(programOfferingsTable.annualTuitionUsd),
        asc(universitiesTable.name),
      ];
  }

  const currentPage = Math.max(page, 1);
  const offset = (currentPage - 1) * pageSize;

  const rows = await db
    .select({
      offeringSlug: programOfferingsTable.slug,
      annualTuitionUsd: programOfferingsTable.annualTuitionUsd,
      offeringFeatured: programOfferingsTable.featured,
      uniSlug: universitiesTable.slug,
      uniName: universitiesTable.name,
      uniCity: universitiesTable.city,
      uniType: universitiesTable.type,
      uniLogoUrl: universitiesTable.logoUrl,
      uniCoverImageUrl: universitiesTable.coverImageUrl,
      uniFeatured: universitiesTable.featured,
      countrySlug: countriesTable.slug,
      countryName: countriesTable.name,
      courseSlug: coursesTable.slug,
      courseShortName: coursesTable.shortName,
      totalCount: sql<number>`count(*) over()`,
    })
    .from(programOfferingsTable)
    .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
    .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
    .innerJoin(coursesTable, eq(programOfferingsTable.courseId, coursesTable.id))
    .where(where)
    .orderBy(...orderClauses)
    .limit(pageSize)
    .offset(offset);

  const totalItems =
    rows.length > 0
      ? Number(rows[0]?.totalCount ?? 0)
      : currentPage > 1
        ? Number(
            (
              await db
                .select({ total: sql<string>`count(*)` })
                .from(programOfferingsTable)
                .innerJoin(
                  universitiesTable,
                  eq(programOfferingsTable.universityId, universitiesTable.id),
                )
                .innerJoin(
                  countriesTable,
                  eq(universitiesTable.countryId, countriesTable.id),
                )
                .innerJoin(
                  coursesTable,
                  eq(programOfferingsTable.courseId, coursesTable.id),
                )
                .where(where)
            )[0]?.total ?? 0,
          )
        : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const programs: FinderCardProgram[] = rows.map((row) => ({
    university: {
      slug: row.uniSlug,
      name: row.uniName,
      city: row.uniCity,
      type: row.uniType as "Public" | "Private",
      logoUrl: row.uniLogoUrl ?? undefined,
      coverImageUrl: row.uniCoverImageUrl ?? undefined,
      featured: row.uniFeatured,
    },
    country: { slug: row.countrySlug, name: row.countryName },
    course: { slug: row.courseSlug, shortName: row.courseShortName },
    offering: {
      slug: row.offeringSlug,
      annualTuitionUsd: row.annualTuitionUsd,
      featured: row.offeringFeatured,
    },
  }));

  return {
    programs,
    totalItems,
    totalPages,
    currentPage: safePage,
    pageSize,
    hasPreviousPage: safePage > 1,
    hasNextPage: safePage < totalPages,
  };
}

export async function getFinderOptions(): Promise<FinderOptions> {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");

  const db = getDb();
  if (!db) {
    return {
      countries: [],
      courses: [],
      mediums: [],
      intakes: [],
    };
  }

  const [countryRows, courseRows, mediumRows, intakeRows] = await Promise.all([
    db
      .select({
        slug: countriesTable.slug,
        name: countriesTable.name,
      })
      .from(countriesTable)
      .orderBy(asc(countriesTable.name)),
    db
      .select({
        slug: coursesTable.slug,
        shortName: coursesTable.shortName,
      })
      .from(coursesTable)
      .orderBy(asc(coursesTable.shortName)),
    db
      .selectDistinct({
        medium: programOfferingsTable.medium,
      })
      .from(programOfferingsTable)
      .orderBy(asc(programOfferingsTable.medium)),
    db
      .select({
        intakeMonths: programOfferingsTable.intakeMonths,
      })
      .from(programOfferingsTable),
  ]);

  const countries: FinderCountryOption[] = countryRows.map((country) => ({
    slug: country.slug,
    name: country.name,
  }));

  const courses: FinderCourseOption[] = courseRows.map((course) => ({
    slug: course.slug,
    shortName: course.shortName,
  }));

  const mediums = mediumRows.map(
    (row) => row.medium as ProgramOffering["medium"],
  );
  const intakes = [...new Set(intakeRows.flatMap((row) => row.intakeMonths))].sort();

  return {
    countries,
    courses,
    mediums,
    intakes,
  };
}

export async function getFeaturedPrograms(limit = 4) {
  const featuredPrograms = await listFinderPrograms({});
  return featuredPrograms
    .filter((program) => program.offering.featured)
    .slice(0, limit);
}

export async function getProgramsForCountry(countrySlug: string) {
  return listFinderPrograms({ country: countrySlug });
}

export async function getProgramsForCourse(courseSlug: string) {
  return listFinderPrograms({ course: courseSlug });
}

export async function getProgramsForUniversity(universitySlug: string) {
  const programs = await getFinderProgramsBase();
  return programs.filter(
    (program) => program.university.slug === universitySlug,
  );
}

export async function getRelatedLandingPages(
  countrySlug: string,
  courseSlugs: string | string[],
) {
  const courseSlugSet = new Set(
    Array.isArray(courseSlugs) ? courseSlugs : [courseSlugs],
  );

  return landingPages.filter(
    (page) =>
      page.countrySlug === countrySlug || courseSlugSet.has(page.courseSlug),
  );
}

export async function getFeaturedUniversities(limit = 4) {
  const universities = await getUniversities();
  return universities
    .filter((university) => university.featured)
    .slice(0, limit);
}

export async function getHomeStats() {
  const [countries, universities, programs] = await Promise.all([
    getCountries(),
    getUniversities(),
    getProgramOfferings(),
  ]);

  const cheapestAnnualTuitionUsd = Math.min(
    ...programs
      .map((program) => program.annualTuitionUsd)
      .filter((fee) => hasPublishedUsdAmount(fee)),
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
  const [countries, courses] = await Promise.all([
    getCountries(),
    getCourses(),
  ]);

  return [
    "/",
    "/about",
    "/contact",
    "/editorial-policy",
    "/methodology",
    "/privacy",
    "/terms",
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
    updatedAt: university.updatedAt,
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
    page.featuredUniversitySlugs.includes(program.university.slug),
  );

  return {
    country,
    course,
    featuredPrograms,
  };
}
