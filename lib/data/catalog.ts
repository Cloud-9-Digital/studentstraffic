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
  WdomsDirectoryEntry,
} from "@/lib/data/types";
import { getDb } from "@/lib/db/server";
import {
  countries as countriesTable,
  courses as coursesTable,
  programOfferings as programOfferingsTable,
  universities as universitiesTable,
  wdomsDirectoryEntries as wdomsDirectoryEntriesTable,
} from "@/lib/db/schema";
import {
  getBudgetIndexHref,
  getCompareIndexHref,
  getCountriesIndexHref,
  getCountryHref,
  getCoursesIndexHref,
  getCourseHref,
  getUniversityHref,
  getWdomsDirectoryHref,
  getWdomsSchoolHref,
} from "@/lib/routes";
import {
  getSortableUsdValue,
  hasPublishedUsdAmount,
} from "@/lib/utils";
import { finderPageSize } from "@/lib/constants";
import { getFinderSort } from "@/lib/filters";
import { applyUniversityContentOverride } from "@/lib/data/university-content-overrides";
import {
  buildWdomsUniversityLookup,
  matchWdomsSchoolToUniversity,
  getWdomsSchoolRouteSlug,
  wdomsCountryConfigs,
} from "@/lib/wdoms";

type CatalogSnapshot = {
  countries: Country[];
  courses: Course[];
  universities: University[];
  programOfferings: ProgramOffering[];
};

function isMissingAdmissionsContentColumn(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = `${error.message} ${"cause" in error ? String((error as { cause?: unknown }).cause) : ""}`;
  return message.includes('column "admissions_content" does not exist');
}

async function readCatalogFromDatabase(): Promise<CatalogSnapshot | null> {
  const db = getDb();

  if (!db) {
    return null;
  }

  const getUniversitySelect = (includeAdmissionsContent: boolean) =>
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
        published: universitiesTable.published,
        officialWebsite: universitiesTable.officialWebsite,
        logoUrl: universitiesTable.logoUrl,
        coverImageUrl: universitiesTable.coverImageUrl,
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
        lastVerifiedAt: universitiesTable.lastVerifiedAt,
        researchSources: universitiesTable.researchSources,
        researchNotes: universitiesTable.researchNotes,
        ...(includeAdmissionsContent
          ? { admissionsContent: universitiesTable.admissionsContent }
          : {}),
        updatedAt: universitiesTable.updatedAt,
      })
      .from(universitiesTable)
      .where(eq(universitiesTable.published, true));

  try {
    const [countryRows, courseRows, universityRows, programRows] =
      await Promise.all([
        db.select().from(countriesTable),
        db.select().from(coursesTable),
        getUniversitySelect(true),
        db
          .select()
          .from(programOfferingsTable)
          .where(eq(programOfferingsTable.published, true)),
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

    const universities: University[] = universityRows.map((university) =>
      applyUniversityContentOverride({
        slug: university.slug,
        countrySlug: countrySlugsById.get(university.countryId) ?? "",
        name: university.name,
        city: university.city,
        type: university.type as University["type"],
        establishedYear: university.establishedYear,
        summary: university.summary,
        featured: university.featured,
        published: university.published,
        officialWebsite: university.officialWebsite,
        logoUrl: university.logoUrl ?? undefined,
        coverImageUrl: university.coverImageUrl ?? undefined,
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
        lastVerifiedAt: university.lastVerifiedAt ?? undefined,
        researchSources:
          university.researchSources as University["researchSources"],
        researchNotes: university.researchNotes ?? undefined,
        admissionsContent:
          ("admissionsContent" in university
            ? (university.admissionsContent as University["admissionsContent"])
            : undefined) ?? undefined,
        updatedAt: university.updatedAt?.toISOString(),
      }),
    );

    const universitySlugsById = new Map(
      universityRows.map((university) => [university.id, university.slug]),
    );

    const programOfferings: ProgramOffering[] = programRows.flatMap((program) => {
      const universitySlug = universitySlugsById.get(program.universityId);
      const courseSlug = courseSlugsById.get(program.courseId);

      if (!universitySlug || !courseSlug) {
        return [];
      }

      return [{
        slug: program.slug,
        universitySlug,
        courseSlug,
        title: program.title,
        durationYears: program.durationYears,
        annualTuitionUsd: program.annualTuitionUsd,
        totalTuitionUsd: program.totalTuitionUsd,
        livingUsd: program.livingUsd,
        officialFeeCurrency: program.officialFeeCurrency ?? undefined,
        officialAnnualTuitionAmount:
          program.officialAnnualTuitionAmount ?? undefined,
        officialTotalTuitionAmount:
          program.officialTotalTuitionAmount ?? undefined,
        officialProgramUrl: program.officialProgramUrl,
        medium: program.medium as ProgramOffering["medium"],
        published: program.published,
        teachingPhases:
          program.teachingPhases as ProgramOffering["teachingPhases"],
        yearlyCostBreakdown:
          program.yearlyCostBreakdown as ProgramOffering["yearlyCostBreakdown"],
        licenseExamSupport:
          program.licenseExamSupport as ProgramOffering["licenseExamSupport"],
        intakeMonths: program.intakeMonths,
        feeVerifiedAt: program.feeVerifiedAt ?? undefined,
        fxRateDate: program.fxRateDate ?? undefined,
        fxRateSourceUrl: program.fxRateSourceUrl ?? undefined,
        feeNotes: program.feeNotes ?? undefined,
        sourceUrls: program.sourceUrls,
        featured: program.featured,
        updatedAt: program.updatedAt?.toISOString(),
      }];
    });

    return {
      countries,
      courses,
      universities,
      programOfferings,
    };
  } catch (error) {
    if (isMissingAdmissionsContentColumn(error)) {
      try {
        const [countryRows, courseRows, universityRows, programRows] =
          await Promise.all([
            db.select().from(countriesTable),
            db.select().from(coursesTable),
            getUniversitySelect(false),
            db
              .select()
              .from(programOfferingsTable)
              .where(eq(programOfferingsTable.published, true)),
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

        const universities: University[] = universityRows.map((university) =>
          applyUniversityContentOverride({
            slug: university.slug,
            countrySlug: countrySlugsById.get(university.countryId) ?? "",
            name: university.name,
            city: university.city,
            type: university.type as University["type"],
            establishedYear: university.establishedYear,
            summary: university.summary,
            featured: university.featured,
            published: university.published,
            officialWebsite: university.officialWebsite,
            logoUrl: university.logoUrl ?? undefined,
            coverImageUrl: university.coverImageUrl ?? undefined,
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
            lastVerifiedAt: university.lastVerifiedAt ?? undefined,
            researchSources:
              university.researchSources as University["researchSources"],
            researchNotes: university.researchNotes ?? undefined,
            updatedAt: university.updatedAt?.toISOString(),
          }),
        );

        const universitySlugsById = new Map(
          universityRows.map((university) => [university.id, university.slug]),
        );

        const programOfferings: ProgramOffering[] = programRows.flatMap((program) => {
          const universitySlug = universitySlugsById.get(program.universityId);
          const courseSlug = courseSlugsById.get(program.courseId);

          if (!universitySlug || !courseSlug) {
            return [];
          }

          return [{
            slug: program.slug,
            universitySlug,
            courseSlug,
            title: program.title,
            durationYears: program.durationYears,
            annualTuitionUsd: program.annualTuitionUsd,
            totalTuitionUsd: program.totalTuitionUsd,
            livingUsd: program.livingUsd,
            officialFeeCurrency: program.officialFeeCurrency ?? undefined,
            officialAnnualTuitionAmount:
              program.officialAnnualTuitionAmount ?? undefined,
            officialTotalTuitionAmount:
              program.officialTotalTuitionAmount ?? undefined,
            officialProgramUrl: program.officialProgramUrl,
            medium: program.medium as ProgramOffering["medium"],
            published: program.published,
            teachingPhases:
              program.teachingPhases as ProgramOffering["teachingPhases"],
            yearlyCostBreakdown:
              program.yearlyCostBreakdown as ProgramOffering["yearlyCostBreakdown"],
            licenseExamSupport:
              program.licenseExamSupport as ProgramOffering["licenseExamSupport"],
            intakeMonths: program.intakeMonths,
            feeVerifiedAt: program.feeVerifiedAt ?? undefined,
            fxRateDate: program.fxRateDate ?? undefined,
            fxRateSourceUrl: program.fxRateSourceUrl ?? undefined,
            feeNotes: program.feeNotes ?? undefined,
            sourceUrls: program.sourceUrls,
            featured: program.featured,
            updatedAt: program.updatedAt?.toISOString(),
          }];
        });

        return {
          countries,
          courses,
          universities,
          programOfferings,
        };
      } catch (fallbackError) {
        console.error(
          "Failed to read catalog from database after admissions_content fallback:",
          fallbackError,
        );
      }
    }
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

export async function getWdomsDirectoryEntries(countrySlug: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("wdoms-directory");
  cacheTag(`wdoms-directory:${countrySlug}`);

  const db = getDb();

  if (!db) {
    return [] as WdomsDirectoryEntry[];
  }

  const [directoryRows, publishedUniversities] = await Promise.all([
    db
      .select({
        countrySlug: wdomsDirectoryEntriesTable.countrySlug,
        countryName: wdomsDirectoryEntriesTable.countryName,
        schoolId: wdomsDirectoryEntriesTable.schoolId,
        schoolName: wdomsDirectoryEntriesTable.schoolName,
        cityName: wdomsDirectoryEntriesTable.cityName,
        schoolUrl: wdomsDirectoryEntriesTable.schoolUrl,
        schoolType: wdomsDirectoryEntriesTable.schoolType,
        operationalStatus: wdomsDirectoryEntriesTable.operationalStatus,
        yearInstructionStarted: wdomsDirectoryEntriesTable.yearInstructionStarted,
        academicAffiliation: wdomsDirectoryEntriesTable.academicAffiliation,
        clinicalFacilities: wdomsDirectoryEntriesTable.clinicalFacilities,
        clinicalTraining: wdomsDirectoryEntriesTable.clinicalTraining,
        schoolWebsite: wdomsDirectoryEntriesTable.schoolWebsite,
        mainAddress: wdomsDirectoryEntriesTable.mainAddress,
        qualificationTitle: wdomsDirectoryEntriesTable.qualificationTitle,
        curriculumDuration: wdomsDirectoryEntriesTable.curriculumDuration,
        languageOfInstruction: wdomsDirectoryEntriesTable.languageOfInstruction,
        prerequisiteEducation: wdomsDirectoryEntriesTable.prerequisiteEducation,
        foreignStudents: wdomsDirectoryEntriesTable.foreignStudents,
        entranceExam: wdomsDirectoryEntriesTable.entranceExam,
      })
      .from(wdomsDirectoryEntriesTable)
      .where(eq(wdomsDirectoryEntriesTable.countrySlug, countrySlug))
      .orderBy(
        asc(wdomsDirectoryEntriesTable.schoolName),
        asc(wdomsDirectoryEntriesTable.cityName),
      ),
    db
      .select({
        slug: universitiesTable.slug,
        name: universitiesTable.name,
        city: universitiesTable.city,
      })
      .from(universitiesTable)
      .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
      .where(
        and(
          eq(countriesTable.slug, countrySlug),
          eq(universitiesTable.published, true),
        ),
      ),
  ]);

  const universityLookup = buildWdomsUniversityLookup(publishedUniversities);

  return directoryRows.map((entry) => {
    const matchedUniversity = matchWdomsSchoolToUniversity(entry, universityLookup);

    return {
      countrySlug: entry.countrySlug,
      countryName: entry.countryName,
      schoolId: entry.schoolId,
      schoolName: entry.schoolName,
      cityName: entry.cityName,
      schoolUrl: entry.schoolUrl,
      schoolType: entry.schoolType ?? undefined,
      operationalStatus: entry.operationalStatus ?? undefined,
      yearInstructionStarted: entry.yearInstructionStarted ?? undefined,
      academicAffiliation: entry.academicAffiliation ?? undefined,
      clinicalFacilities: entry.clinicalFacilities ?? undefined,
      clinicalTraining: entry.clinicalTraining ?? undefined,
      schoolWebsite: entry.schoolWebsite ?? undefined,
      mainAddress: entry.mainAddress ?? undefined,
      qualificationTitle: entry.qualificationTitle ?? undefined,
      curriculumDuration: entry.curriculumDuration ?? undefined,
      languageOfInstruction: entry.languageOfInstruction ?? undefined,
      prerequisiteEducation: entry.prerequisiteEducation ?? undefined,
      foreignStudents: entry.foreignStudents ?? undefined,
      entranceExam: entry.entranceExam ?? undefined,
      routeSlug: getWdomsSchoolRouteSlug(entry.schoolName, entry.schoolId),
      matchedUniversitySlug: matchedUniversity?.slug,
      matchedUniversityName: matchedUniversity?.name,
    };
  });
}

export async function getWdomsDirectoryEntryForUniversity(universitySlug: string) {
  const university = await getUniversityBySlug(universitySlug);

  if (!university) {
    return null;
  }

  const entries = await getWdomsDirectoryEntries(university.countrySlug);

  return (
    entries.find((entry) => entry.matchedUniversitySlug === university.slug) ?? null
  );
}

export async function getWdomsDirectoryEntryByRoute(
  countrySlug: string,
  schoolRouteSlug: string,
) {
  const entries = await getWdomsDirectoryEntries(countrySlug);
  return entries.find((entry) => entry.routeSlug === schoolRouteSlug) ?? null;
}

export async function getWdomsUniversityPreviewGroups(limitPerCountry = 4) {
  const groups = await Promise.all(
    wdomsCountryConfigs.map(async (config) => ({
      config,
      allEntries: await getWdomsDirectoryEntries(config.slug),
    })),
  );

  return groups
    .map((group) => ({
      config: group.config,
      entries: group.allEntries.slice(0, limitPerCountry),
      totalCount: group.allEntries.length,
    }))
    .filter((group) => group.totalCount > 0);
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
  const conditions = [
    eq(universitiesTable.published, true),
    eq(programOfferingsTable.published, true),
  ];

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
  if (filters.universityType) {
    conditions.push(eq(universitiesTable.type, filters.universityType));
  }
  if (filters.q) {
    const q = `%${filters.q}%`;
    const searchCondition = or(
      ilike(universitiesTable.name, q),
      ilike(universitiesTable.city, q),
      ilike(countriesTable.name, q),
      ilike(coursesTable.shortName, q),
    );

    if (searchCondition) {
      conditions.push(searchCondition);
    }
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
      officialFeeCurrency: programOfferingsTable.officialFeeCurrency,
      officialAnnualTuitionAmount:
        programOfferingsTable.officialAnnualTuitionAmount,
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
        officialFeeCurrency: row.officialFeeCurrency ?? undefined,
        officialAnnualTuitionAmount:
          row.officialAnnualTuitionAmount ?? undefined,
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
      .selectDistinct({
        slug: countriesTable.slug,
        name: countriesTable.name,
      })
      .from(countriesTable)
      .innerJoin(universitiesTable, eq(universitiesTable.countryId, countriesTable.id))
      .innerJoin(programOfferingsTable, eq(programOfferingsTable.universityId, universitiesTable.id))
      .where(
        and(
          eq(universitiesTable.published, true),
          eq(programOfferingsTable.published, true),
        ),
      )
      .orderBy(asc(countriesTable.name)),
    db
      .selectDistinct({
        slug: coursesTable.slug,
        shortName: coursesTable.shortName,
      })
      .from(coursesTable)
      .innerJoin(programOfferingsTable, eq(programOfferingsTable.courseId, coursesTable.id))
      .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
      .where(
        and(
          eq(universitiesTable.published, true),
          eq(programOfferingsTable.published, true),
        ),
      )
      .orderBy(asc(coursesTable.shortName)),
    db
      .selectDistinct({
        medium: programOfferingsTable.medium,
      })
      .from(programOfferingsTable)
      .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
      .where(
        and(
          eq(universitiesTable.published, true),
          eq(programOfferingsTable.published, true),
        ),
      )
      .orderBy(asc(programOfferingsTable.medium)),
    db
      .select({
        intakeMonths: programOfferingsTable.intakeMonths,
      })
      .from(programOfferingsTable)
      .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
      .where(
        and(
          eq(universitiesTable.published, true),
          eq(programOfferingsTable.published, true),
        ),
      ),
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
  const [countries, courses, wdomsProfileGroups] = await Promise.all([
    getCountries(),
    getCourses(),
    Promise.all(
      wdomsCountryConfigs.map(async (config) => ({
        config,
        entries: await getWdomsDirectoryEntries(config.slug),
      })),
    ),
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
    ...wdomsCountryConfigs
      .filter((config) => !config.landingPageSlug)
      .map((config) => getWdomsDirectoryHref(config.slug)),
    ...wdomsProfileGroups.flatMap((group) =>
      group.entries.map((entry) =>
        getWdomsSchoolHref(group.config.slug, entry.routeSlug),
      ),
    ),
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
