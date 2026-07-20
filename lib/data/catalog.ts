import "server-only";

import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import { and, asc, count, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";

import { landingPages } from "@/lib/data/landing-pages";
import type {
  Country,
  Course,
  FinderCardProgram,
  FinderCardProgramsPage,
  FinderCityOption,
  FinderCountryOption,
  FinderCourseOption,
  FinderOptions,
  FinderFilters,
  FinderProgram,
  FinderSort,
  BlogPostSearchMetadata,
  IndiaMbbsCard,
  LandingPage,
  ProgramOffering,
  University,
} from "@/lib/data/types";
import { getDb } from "@/lib/db/server";
import {
  countries as countriesTable,
  courses as coursesTable,
  indiaMedicalColleges,
  indiaMedicalPrograms,
  programOfferings as programOfferingsTable,
  blogPosts,
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
  getUniversityProgramHref,
} from "@/lib/routes";
import {
  createSlug,
  getSortableUsdValue,
  hasPublishedUsdAmount,
} from "@/lib/utils";
import {
  sortIntakeMonthCodes,
  sortTeachingLanguageCodes,
  type IntakeMonthCode,
  type TeachingLanguageCode,
} from "@/lib/catalogue-facets";
import { programmeLevels, type ProgrammeLevel } from "@/lib/data/program-taxonomy";

export function cityNameToSlug(city: string) {
  return createSlug(city);
}
import { finderPageSize } from "@/lib/constants";
import { getFinderSort } from "@/lib/filters";
import { applyUniversityContentOverride } from "@/lib/data/university-content-overrides";
import { getUniversityDisplayName } from "@/lib/university-presentation";
type CatalogSnapshot = {
  countries: Country[];
  courses: Course[];
  universities: University[];
  programOfferings: ProgramOffering[];
  indiaColleges: IndiaMbbsCard[];
  joinUniversities: Array<{ id: number; name: string; countryId: number; countryName: string }>;
  publishedPosts: BlogPostSearchMetadata[];
};

function mapCountryRow(country: typeof countriesTable.$inferSelect): Country {
  return {
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
  };
}

function mapCourseRow(course: typeof coursesTable.$inferSelect): Course {
  return {
    slug: course.slug,
    name: course.name,
    shortName: course.shortName,
    stream: course.stream,
    level: course.level,
    discipline: course.discipline,
    aliases: course.aliases,
    active: course.active,
    displayOrder: course.displayOrder,
    durationYears: course.durationYears,
    summary: course.summary,
    metaTitle: course.metaTitle,
    metaDescription: course.metaDescription,
    updatedAt: course.updatedAt?.toISOString(),
  };
}

function mapUniversityRow(
  university: typeof universitiesTable.$inferSelect,
  countrySlug: string,
): University {
  return applyUniversityContentOverride({
    slug: university.slug,
    countrySlug,
    name: getUniversityDisplayName(university.name),
    city: university.city,
    type: university.type as University["type"],
    establishedYear: university.establishedYear,
    summary: university.summary,
    featured: university.featured,
    published: university.published,
    officialWebsite: university.officialWebsite,
    logoUrl: university.logoUrl ?? undefined,
    coverImageUrl: university.coverImageUrl ?? undefined,
    mediaAttribution: university.mediaAttribution,
    campusLifestyle: university.campusLifestyle,
    cityProfile: university.cityProfile,
    practicalExposure: university.practicalExposure,
    hostelOverview: university.hostelOverview,
    dietarySupport: university.dietarySupport,
    safetyOverview: university.safetyOverview,
    studentSupport: university.studentSupport,
    whyChoose: university.whyChoose,
    thingsToConsider: university.thingsToConsider,
    bestFitFor: university.bestFitFor,
    industryPartners: university.industryPartners,
    recognitionBadges: university.recognitionBadges,
    recognitionLinks: university.recognitionLinks,
    faq: university.faq,
    similarUniversitySlugs: university.similarUniversitySlugs,
    lastVerifiedAt: university.lastVerifiedAt ?? undefined,
    researchSources: university.researchSources,
    researchNotes: university.researchNotes ?? undefined,
    admissionsContent: university.admissionsContent ?? undefined,
    updatedAt: university.updatedAt?.toISOString(),
  });
}

function mapProgramAdmissionsContent(
  admissionsContent: typeof programOfferingsTable.$inferSelect["admissionsContent"],
): ProgramOffering["admissionsContent"] {
  // Older published offerings predate programme-level admissions content and
  // legitimately store the schema default `{}`. Do not expose that as a
  // complete admissions object to page consumers.
  return !admissionsContent || Object.keys(admissionsContent).length === 0
    ? undefined
    : (admissionsContent as ProgramOffering["admissionsContent"]);
}

function mapProgramOfferingRow(
  program: typeof programOfferingsTable.$inferSelect,
  universitySlug: string,
  courseSlug: string,
): ProgramOffering {
  return {
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
    audienceEligibility: program.audienceEligibility,
    admissionsContent: mapProgramAdmissionsContent(program.admissionsContent),
    medium: program.medium as ProgramOffering["medium"],
    instructionLanguages:
      program.instructionLanguages as ProgramOffering["instructionLanguages"],
    published: program.published,
    teachingPhases: program.teachingPhases,
    yearlyCostBreakdown: program.yearlyCostBreakdown,
    professionalExamSupport: program.professionalExamSupport,
    intakeMonths: program.intakeMonths,
    intakeCodes: program.intakeCodes as ProgramOffering["intakeCodes"],
    feeVerifiedAt: program.feeVerifiedAt ?? undefined,
    fxRateDate: program.fxRateDate ?? undefined,
    fxRateSourceUrl: program.fxRateSourceUrl ?? undefined,
    feeNotes: program.feeNotes ?? undefined,
    sourceUrls: program.sourceUrls,
    featured: program.featured,
    updatedAt: program.updatedAt?.toISOString(),
  };
}

export type SitemapCatalogData = {
  countries: Array<{ slug: string; updatedAt?: string }>;
  courses: Array<{ slug: string; updatedAt?: string }>;
  universities: Array<{
    slug: string;
    countrySlug: string;
    updatedAt?: string;
  }>;
  programOfferings: Array<{
    slug: string;
    universitySlug: string;
    courseSlug: string;
    updatedAt?: string;
  }>;
};

function createEmptyCatalogSnapshot(): CatalogSnapshot {
  return {
    countries: [],
    courses: [],
    universities: [],
    programOfferings: [],
    indiaColleges: [],
    joinUniversities: [],
    publishedPosts: [],
  };
}

const globalForCatalogWarnings = globalThis as typeof globalThis & {
  __catalogDbWarningShown?: boolean;
  __catalogSnapshotPromise?: Promise<CatalogSnapshot>;
};

const buildCatalogSnapshotPath = path.join(
  process.cwd(),
  ".next",
  "cache",
  "catalog-snapshot.json",
);
const buildCatalogSnapshotLockPath = `${buildCatalogSnapshotPath}.lock`;
const currentDeploymentId = process.env.VERCEL_DEPLOYMENT_ID;

function isProductionBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function shouldUseBuildCatalogSnapshot() {
  return isProductionBuildPhase();
}

async function readBuildCatalogSnapshotFromDisk(): Promise<CatalogSnapshot | null> {
  try {
    const serialized = await readFile(buildCatalogSnapshotPath, "utf8");
    const parsed = JSON.parse(serialized) as Partial<CatalogSnapshot & { _deploymentId?: string }>;
    // Reject snapshots written for a different Vercel deployment — forces a fresh DB read
    if (currentDeploymentId && parsed._deploymentId !== currentDeploymentId) {
      return null;
    }
    return {
      countries: parsed.countries ?? [],
      courses: parsed.courses ?? [],
      universities: parsed.universities ?? [],
      programOfferings: parsed.programOfferings ?? [],
      indiaColleges: parsed.indiaColleges ?? [],
      joinUniversities: parsed.joinUniversities ?? [],
      publishedPosts: parsed.publishedPosts ?? [],
    };
  } catch {
    return null;
  }
}

async function writeBuildCatalogSnapshotToDisk(snapshot: CatalogSnapshot) {
  await mkdir(path.dirname(buildCatalogSnapshotPath), { recursive: true });
  const tempPath = `${buildCatalogSnapshotPath}.${process.pid}.tmp`;
  const payload = currentDeploymentId
    ? { _deploymentId: currentDeploymentId, ...snapshot }
    : snapshot;
  await writeFile(tempPath, JSON.stringify(payload), "utf8");
  await rename(tempPath, buildCatalogSnapshotPath);
}

async function waitForBuildCatalogSnapshotFromDisk(
  timeoutMs = 30_000
): Promise<CatalogSnapshot | null> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const snapshot = await readBuildCatalogSnapshotFromDisk();
    if (snapshot) {
      return snapshot;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return null;
}

async function createBuildCatalogSnapshot(): Promise<CatalogSnapshot> {
  await mkdir(path.dirname(buildCatalogSnapshotPath), { recursive: true });

  try {
    await mkdir(buildCatalogSnapshotLockPath);
  } catch (error) {
    const snapshot = await waitForBuildCatalogSnapshotFromDisk();
    if (snapshot) {
      return snapshot;
    }

    throw error;
  }

  try {
    const existingSnapshot = await readBuildCatalogSnapshotFromDisk();
    if (existingSnapshot) {
      return existingSnapshot;
    }

    const snapshot =
      (await readCatalogFromDatabase()) ?? createEmptyCatalogSnapshot();

    await writeBuildCatalogSnapshotToDisk(snapshot);
    return snapshot;
  } finally {
    await rm(buildCatalogSnapshotLockPath, { recursive: true, force: true });
  }
}

function isDatabaseConnectivityError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = `${error.message} ${"cause" in error ? String((error as { cause?: unknown }).cause) : ""}`.toLowerCase();
  return (
    message.includes("error connecting to database") ||
    message.includes("fetch failed") ||
    message.includes("neondberror")
  );
}

function isVercelProductionBuild() {
  return (
    process.env.VERCEL === "1" &&
    process.env.NEXT_PHASE === "phase-production-build"
  );
}

function logCatalogDatabaseFallback(error: unknown) {
  if (globalForCatalogWarnings.__catalogDbWarningShown) {
    return;
  }

  globalForCatalogWarnings.__catalogDbWarningShown = true;

  if (isDatabaseConnectivityError(error)) {
    const context = isVercelProductionBuild()
      ? " during Vercel build"
      : "";
    console.warn(
      `Catalog database is unavailable${context}. Falling back to bundled/static catalog data.`,
    );
    return;
  }

  console.error("Failed to read catalog from database:", error);
}

async function readCatalogFromDatabase(): Promise<CatalogSnapshot | null> {
  const db = getDb();

  if (!db) {
    return null;
  }

  const universityRowsQuery = db
    .select()
    .from(universitiesTable)
    .where(eq(universitiesTable.published, true));

  try {
    const [countryRows, courseRows, universityRows, programRows, indiaCollegeRows, publishedPostRows] =
      await Promise.all([
        db.select().from(countriesTable),
        db.select().from(coursesTable),
        universityRowsQuery,
        db
          .select()
          .from(programOfferingsTable)
          .where(eq(programOfferingsTable.published, true)),
        db
          .select({
            slug: indiaMedicalColleges.slug,
            collegeName: indiaMedicalColleges.collegeName,
            programName: indiaMedicalPrograms.courseName,
            stateName: indiaMedicalColleges.stateName,
            cityName: indiaMedicalColleges.cityName,
            managementType: indiaMedicalColleges.managementType,
            universityName: indiaMedicalColleges.universityName,
            yearOfInception: indiaMedicalPrograms.yearOfInception,
            annualIntakeSeats: indiaMedicalPrograms.annualIntakeSeats,
          })
          .from(indiaMedicalColleges)
          .innerJoin(
            indiaMedicalPrograms,
            eq(indiaMedicalPrograms.collegeId, indiaMedicalColleges.id),
          )
          .limit(1000),
        db
          .select({
            slug: blogPosts.slug,
            title: blogPosts.title,
            excerpt: blogPosts.excerpt,
            content: blogPosts.content,
            coverUrl: blogPosts.coverUrl,
            category: blogPosts.category,
            metaTitle: blogPosts.metaTitle,
            metaDescription: blogPosts.metaDescription,
            authorSlug: blogPosts.authorSlug,
            readingTimeMinutes: blogPosts.readingTimeMinutes,
            publishedAt: blogPosts.publishedAt,
            updatedAt: blogPosts.updatedAt,
          })
          .from(blogPosts)
          .where(eq(blogPosts.status, "published"))
          .orderBy(desc(blogPosts.publishedAt)),
      ]);

    const countryNamesById = new Map(countryRows.map((c) => [c.id, c.name]));

    const countries = countryRows.map(mapCountryRow);
    const courses = courseRows.map(mapCourseRow);

    const countrySlugsById = new Map(
      countryRows.map((country) => [country.id, country.slug]),
    );
    const courseSlugsById = new Map(
      courseRows.map((course) => [course.id, course.slug]),
    );

    const universities = universityRows.map((university) =>
      mapUniversityRow(
        university,
        countrySlugsById.get(university.countryId) ?? "",
      ),
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

      return [mapProgramOfferingRow(program, universitySlug, courseSlug)];
    });

    const indiaColleges: IndiaMbbsCard[] = indiaCollegeRows.map((row) => ({
      slug: row.slug,
      collegeName: row.collegeName,
      programName: row.programName,
      stateName: row.stateName,
      cityName: row.cityName ?? undefined,
      managementType: row.managementType ?? undefined,
      universityName: row.universityName ?? undefined,
      yearOfInception: row.yearOfInception ?? undefined,
      annualIntakeSeats: row.annualIntakeSeats ?? undefined,
    }));

    const joinUniversities = universityRows
      .map((university) => ({
        id: university.id,
        name: university.name,
        countryId: university.countryId,
        countryName: countryNamesById.get(university.countryId) ?? "",
      }))
      .sort((left, right) => left.name.localeCompare(right.name));

    const publishedPosts = publishedPostRows.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverUrl: post.coverUrl,
      category: post.category,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      authorSlug: post.authorSlug,
      readingTimeMinutes: post.readingTimeMinutes,
      publishedAt: post.publishedAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
    }));

    return {
      countries,
      courses,
      universities,
      programOfferings,
      indiaColleges,
      joinUniversities,
      publishedPosts,
    };
  } catch (error) {
    logCatalogDatabaseFallback(error);
    return null;
  }
}

export async function getCatalogSnapshot(): Promise<CatalogSnapshot> {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("countries");
  cacheTag("courses");
  cacheTag("universities");
  cacheTag("program-offerings");
  cacheTag("india-colleges");

  if (!globalForCatalogWarnings.__catalogSnapshotPromise) {
    globalForCatalogWarnings.__catalogSnapshotPromise = (async () => {
      const dbSnapshot = shouldUseBuildCatalogSnapshot()
        ? ((await readBuildCatalogSnapshotFromDisk()) ?? (await createBuildCatalogSnapshot()))
        : await readCatalogFromDatabase();

      return dbSnapshot ?? createEmptyCatalogSnapshot();
    })().finally(() => {
      globalForCatalogWarnings.__catalogSnapshotPromise = undefined;
    });
  }

  return globalForCatalogWarnings.__catalogSnapshotPromise;
}

export async function getSitemapCatalogData(): Promise<SitemapCatalogData> {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("sitemap");
  cacheTag("countries");
  cacheTag("courses");
  cacheTag("universities");
  cacheTag("program-offerings");

  const db = getDb();

  if (!db) {
    return {
      countries: [],
      courses: [],
      universities: [],
      programOfferings: [],
    };
  }

  try {
    const [countryRows, courseRows, universityRows, offeringRows] =
      await Promise.all([
        db
          .select({
            slug: countriesTable.slug,
            updatedAt: countriesTable.updatedAt,
          })
          .from(countriesTable),
        db
          .select({
            slug: coursesTable.slug,
            updatedAt: coursesTable.updatedAt,
          })
          .from(coursesTable),
        db
          .select({
            slug: universitiesTable.slug,
            countrySlug: countriesTable.slug,
            updatedAt: universitiesTable.updatedAt,
          })
          .from(universitiesTable)
          .innerJoin(
            countriesTable,
            eq(universitiesTable.countryId, countriesTable.id),
          )
          .where(eq(universitiesTable.published, true)),
        db
          .select({
            slug: programOfferingsTable.slug,
            universitySlug: universitiesTable.slug,
            courseSlug: coursesTable.slug,
            updatedAt: programOfferingsTable.updatedAt,
          })
          .from(programOfferingsTable)
          .innerJoin(
            universitiesTable,
            eq(programOfferingsTable.universityId, universitiesTable.id),
          )
          .innerJoin(
            coursesTable,
            eq(programOfferingsTable.courseId, coursesTable.id),
          )
          .where(
            and(
              eq(programOfferingsTable.published, true),
              eq(universitiesTable.published, true),
            ),
          ),
      ]);

    return {
      countries: countryRows.map((row) => ({
        slug: row.slug,
        updatedAt: row.updatedAt?.toISOString(),
      })),
      courses: courseRows.map((row) => ({
        slug: row.slug,
        updatedAt: row.updatedAt?.toISOString(),
      })),
      universities: universityRows.map((row) => ({
        slug: row.slug,
        countrySlug: row.countrySlug,
        updatedAt: row.updatedAt?.toISOString(),
      })),
      programOfferings: offeringRows.map((row) => ({
        slug: row.slug,
        universitySlug: row.universitySlug,
        courseSlug: row.courseSlug,
        updatedAt: row.updatedAt?.toISOString(),
      })),
    };
  } catch (error) {
    logCatalogDatabaseFallback(error);
    return {
      countries: [],
      courses: [],
      universities: [],
      programOfferings: [],
    };
  }
}

export async function getCountries() {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("countries");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(countriesTable)
    .orderBy(asc(countriesTable.name));

  return rows.map(mapCountryRow);
}

export async function getCountryCount() {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("countries");

  const db = getDb();
  if (!db) return 0;
  const [row] = await db.select({ value: count() }).from(countriesTable);
  return row?.value ?? 0;
}

export async function getCountryBySlug(slug: string) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("countries");
  cacheTag(`country:${slug}`);

  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select()
    .from(countriesTable)
    .where(eq(countriesTable.slug, slug))
    .limit(1);

  return row ? mapCountryRow(row) : null;
}

export async function getCourses() {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("courses");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(coursesTable)
    .orderBy(asc(coursesTable.displayOrder), asc(coursesTable.name));

  return rows.map(mapCourseRow);
}

export async function getCourseBySlug(slug: string) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("courses");
  cacheTag(`course:${slug}`);

  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.slug, slug))
    .limit(1);

  return row ? mapCourseRow(row) : null;
}

export async function getCourseCatalogStats() {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("courses");
  cacheTag("program-offerings");

  const db = getDb();
  if (!db) return [];

  return db
    .select({
      courseSlug: coursesTable.slug,
      programCount: sql<number>`count(${programOfferingsTable.id})::int`,
      countryCount: sql<number>`count(distinct ${countriesTable.id})::int`,
    })
    .from(programOfferingsTable)
    .innerJoin(
      universitiesTable,
      eq(programOfferingsTable.universityId, universitiesTable.id),
    )
    .innerJoin(
      coursesTable,
      eq(programOfferingsTable.courseId, coursesTable.id),
    )
    .innerJoin(
      countriesTable,
      eq(universitiesTable.countryId, countriesTable.id),
    )
    .where(
      and(
        eq(programOfferingsTable.published, true),
        eq(universitiesTable.published, true),
      ),
    )
    .groupBy(coursesTable.slug);
}

// Deduplicate metadata/page reads within one render without persisting a
// negative lookup. University records are inserted directly by catalogue
// workers, so a long-lived cached null would keep a newly published page in a
// "not found" state even after the row exists.
export const getUniversityBySlug = cache(async (slug: string) => {
  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select({
      university: universitiesTable,
      countrySlug: countriesTable.slug,
    })
    .from(universitiesTable)
    .innerJoin(
      countriesTable,
      eq(universitiesTable.countryId, countriesTable.id),
    )
    .where(
      and(
        eq(universitiesTable.slug, slug),
        eq(universitiesTable.published, true),
      ),
    )
    .limit(1);

  return row ? mapUniversityRow(row.university, row.countrySlug) : null;
});

export async function getCatalogLinkOptions() {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("universities");

  const db = getDb();
  if (!db) return { countries: [], universities: [] };

  const [countryRows, universityRows] = await Promise.all([
    db
      .select({ slug: countriesTable.slug, name: countriesTable.name })
      .from(countriesTable)
      .orderBy(asc(countriesTable.name)),
    db
      .select({ slug: universitiesTable.slug, name: universitiesTable.name })
      .from(universitiesTable)
      .where(eq(universitiesTable.published, true))
      .orderBy(asc(universitiesTable.name)),
  ]);

  return { countries: countryRows, universities: universityRows };
}

export async function getUniversityMediaBySlugs(slugs: string[]) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("universities");

  if (slugs.length === 0) return [];

  const db = getDb();
  if (!db) return [];

  return db
    .select({
      slug: universitiesTable.slug,
      name: universitiesTable.name,
      coverImageUrl: universitiesTable.coverImageUrl,
    })
    .from(universitiesTable)
    .where(
      and(
        eq(universitiesTable.published, true),
        inArray(universitiesTable.slug, slugs),
      ),
    );
}

export async function getPublishedBlogPostMetadata() {
  "use cache";

  cacheLife("days");
  cacheTag("blog");
  cacheTag("sitemap");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      slug: blogPosts.slug,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));

  return rows.map((post) => ({
    slug: post.slug,
    publishedAt: post.publishedAt?.toISOString(),
    updatedAt: post.updatedAt?.toISOString(),
  }));
}

// ── Direct, blog-tagged readers ─────────────────────────────────────────────
// The blog detail page must not go through `getCatalogSnapshot()` above:
// blog content has its own cache tag and the detail reader uses a per-slug tag,
// so a publish can invalidate the index and only the affected post instead of
// every cached catalog page.

export async function getAllPublishedBlogPostsMetadata(): Promise<
  BlogPostSearchMetadata[]
> {
  "use cache";

  cacheLife("days");
  cacheTag("blog");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      slug: blogPosts.slug,
      title: blogPosts.title,
      excerpt: blogPosts.excerpt,
      coverUrl: blogPosts.coverUrl,
      category: blogPosts.category,
      metaTitle: blogPosts.metaTitle,
      metaDescription: blogPosts.metaDescription,
      authorSlug: blogPosts.authorSlug,
      readingTimeMinutes: blogPosts.readingTimeMinutes,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));

  return rows.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverUrl: post.coverUrl,
    category: post.category,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    authorSlug: post.authorSlug,
    readingTimeMinutes: post.readingTimeMinutes,
    publishedAt: post.publishedAt?.toISOString(),
    updatedAt: post.updatedAt?.toISOString(),
  }));
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<BlogPostSearchMetadata | null> {
  "use cache";

  cacheLife("days");
  // Do not attach the broad "blog" tag here. That tag belongs to the index;
  // individual posts must be invalidated by slug to avoid flushing every post
  // page when one post is published or edited.
  cacheTag(`blog:${slug}`);

  const db = getDb();
  if (!db) return null;

  const [post] = await db
    .select({
      slug: blogPosts.slug,
      title: blogPosts.title,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      coverUrl: blogPosts.coverUrl,
      category: blogPosts.category,
      metaTitle: blogPosts.metaTitle,
      metaDescription: blogPosts.metaDescription,
      authorSlug: blogPosts.authorSlug,
      readingTimeMinutes: blogPosts.readingTimeMinutes,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), eq(blogPosts.slug, slug)))
    .limit(1);

  if (!post) return null;

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverUrl: post.coverUrl,
    category: post.category,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    authorSlug: post.authorSlug,
    readingTimeMinutes: post.readingTimeMinutes,
    publishedAt: post.publishedAt?.toISOString(),
    updatedAt: post.updatedAt?.toISOString(),
  };
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

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("finder");

  const databasePrograms = await selectFinderProgramsFromDatabase(
    and(
      eq(programOfferingsTable.published, true),
      eq(universitiesTable.published, true),
    ),
  );

  if (databasePrograms) {
    return databasePrograms;
  }

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

function buildFinderProgramConditions(filters: FinderFilters) {
  const conditions = [
    eq(programOfferingsTable.published, true),
    eq(universitiesTable.published, true),
  ];

  if (filters.q) {
    const query = `%${filters.q.toLowerCase()}%`;
    conditions.push(
      or(
        ilike(universitiesTable.name, query),
        ilike(universitiesTable.city, query),
        ilike(countriesTable.name, query),
        ilike(coursesTable.shortName, query),
      )!,
    );
  }

  if (filters.country) {
    conditions.push(eq(countriesTable.slug, filters.country));
  }

  if (filters.city) {
    conditions.push(eq(universitiesTable.city, filters.city));
  }

  if (filters.level) {
    conditions.push(eq(coursesTable.level, filters.level));
  }

  if (filters.course) {
    conditions.push(eq(coursesTable.slug, filters.course));
  }

  if (filters.universityType) {
    conditions.push(eq(universitiesTable.type, filters.universityType));
  }

  if (filters.medium) {
    conditions.push(
      sql`${programOfferingsTable.instructionLanguages} @> ARRAY[${filters.medium}]::text[]`,
    );
  }

  if (filters.intake) {
    conditions.push(
      sql`${programOfferingsTable.intakeCodes} @> ARRAY[${filters.intake}]::text[]`,
    );
  }

  if (filters.feeMin != null) {
    conditions.push(gte(programOfferingsTable.annualTuitionUsd, filters.feeMin));
  }

  if (filters.feeMax != null) {
    conditions.push(lte(programOfferingsTable.annualTuitionUsd, filters.feeMax));
  }

  return and(...conditions);
}

function getFinderProgramOrder(sort?: FinderSort) {
  switch (getFinderSort(sort)) {
    case "tuition_asc":
      return [
        sql`CASE WHEN ${programOfferingsTable.annualTuitionUsd} > 0 THEN 0 ELSE 1 END`,
        asc(programOfferingsTable.annualTuitionUsd),
        asc(universitiesTable.name),
        asc(coursesTable.shortName),
        asc(countriesTable.name),
      ] as const;
    case "tuition_desc":
      return [
        sql`CASE WHEN ${programOfferingsTable.annualTuitionUsd} > 0 THEN 0 ELSE 1 END`,
        desc(programOfferingsTable.annualTuitionUsd),
        asc(universitiesTable.name),
        asc(coursesTable.shortName),
        asc(countriesTable.name),
      ] as const;
    case "name_asc":
      return [
        asc(universitiesTable.name),
        asc(coursesTable.shortName),
        asc(countriesTable.name),
      ] as const;
    default:
      return [
        desc(programOfferingsTable.featured),
        sql`CASE WHEN ${programOfferingsTable.annualTuitionUsd} > 0 THEN ${programOfferingsTable.annualTuitionUsd} ELSE 2147483647 END`,
        asc(universitiesTable.name),
        asc(coursesTable.shortName),
        asc(countriesTable.name),
      ] as const;
  }
}

async function queryFinderProgramsFromDatabase(
  filters: FinderFilters,
  page: number,
  pageSize: number,
): Promise<FinderCardProgramsPage | null> {
  const db = getDb();

  if (!db) {
    return null;
  }

  const whereClause = buildFinderProgramConditions(filters);
  const rankedPrograms = db
    .select({
      universitySlug: sql<string>`${universitiesTable.slug}`.as("university_slug"),
      universityName: sql<string>`${universitiesTable.name}`.as("university_name"),
      universityCity: sql<string>`${universitiesTable.city}`.as("university_city"),
      universityType: sql<string>`${universitiesTable.type}`.as("university_type"),
      universityLogoUrl: sql<string | null>`${universitiesTable.logoUrl}`.as("university_logo_url"),
      universityCoverImageUrl: sql<string | null>`${universitiesTable.coverImageUrl}`.as("university_cover_image_url"),
      universityFeatured: sql<boolean>`${universitiesTable.featured}`.as("university_featured"),
      countrySlug: sql<string>`${countriesTable.slug}`.as("country_slug"),
      countryName: sql<string>`${countriesTable.name}`.as("country_name"),
      courseSlug: sql<string>`${coursesTable.slug}`.as("course_slug"),
      courseShortName: sql<string>`${coursesTable.shortName}`.as("course_short_name"),
      offeringSlug: sql<string>`${programOfferingsTable.slug}`.as("offering_slug"),
      annualTuitionUsd: sql<number>`${programOfferingsTable.annualTuitionUsd}`.as("annual_tuition_usd"),
      officialFeeCurrency: sql<string | null>`${programOfferingsTable.officialFeeCurrency}`.as("official_fee_currency"),
      officialAnnualTuitionAmount: sql<number | null>`${programOfferingsTable.officialAnnualTuitionAmount}`.as("official_annual_tuition_amount"),
      offeringFeatured: sql<boolean>`${programOfferingsTable.featured}`.as("offering_featured"),
      universityRank: sql<number>`row_number() over (
        partition by ${universitiesTable.id}
        order by ${sql.join([...getFinderProgramOrder(filters.sort)], sql`, `)}
      )`.as("university_rank"),
    })
    .from(programOfferingsTable)
    .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
    .innerJoin(coursesTable, eq(programOfferingsTable.courseId, coursesTable.id))
    .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
    .where(whereClause)
    .as("ranked_finder_programs");

  const [countRow] = await db
    .select({ value: count() })
    .from(rankedPrograms)
    .where(eq(rankedPrograms.universityRank, 1));

  const totalItems = countRow?.value ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const offset = (safePage - 1) * pageSize;

  const rankedProgramOrder = (() => {
    switch (getFinderSort(filters.sort)) {
      case "tuition_asc":
        return [
          sql`CASE WHEN ${rankedPrograms.annualTuitionUsd} > 0 THEN 0 ELSE 1 END`,
          asc(rankedPrograms.annualTuitionUsd),
          asc(rankedPrograms.universityName),
          asc(rankedPrograms.courseShortName),
          asc(rankedPrograms.countryName),
        ] as const;
      case "tuition_desc":
        return [
          sql`CASE WHEN ${rankedPrograms.annualTuitionUsd} > 0 THEN 0 ELSE 1 END`,
          desc(rankedPrograms.annualTuitionUsd),
          asc(rankedPrograms.universityName),
          asc(rankedPrograms.courseShortName),
          asc(rankedPrograms.countryName),
        ] as const;
      case "name_asc":
        return [
          asc(rankedPrograms.universityName),
          asc(rankedPrograms.courseShortName),
          asc(rankedPrograms.countryName),
        ] as const;
      default:
        return [
          desc(rankedPrograms.offeringFeatured),
          sql`CASE WHEN ${rankedPrograms.annualTuitionUsd} > 0 THEN ${rankedPrograms.annualTuitionUsd} ELSE 2147483647 END`,
          asc(rankedPrograms.universityName),
          asc(rankedPrograms.courseShortName),
          asc(rankedPrograms.countryName),
        ] as const;
    }
  })();

  const rows = await db
    .select()
    .from(rankedPrograms)
    .where(eq(rankedPrograms.universityRank, 1))
    .orderBy(...rankedProgramOrder)
    .limit(pageSize)
    .offset(offset);

  return {
    programs: rows.map((row) => ({
      university: {
        slug: row.universitySlug,
        name: getUniversityDisplayName(row.universityName),
        city: row.universityCity,
        type: row.universityType as FinderCardProgram["university"]["type"],
        logoUrl: row.universityLogoUrl ?? undefined,
        coverImageUrl: row.universityCoverImageUrl ?? undefined,
        featured: row.universityFeatured,
      },
      country: {
        slug: row.countrySlug,
        name: row.countryName,
      },
      course: {
        slug: row.courseSlug,
        shortName: row.courseShortName,
      },
      offering: {
        slug: row.offeringSlug,
        annualTuitionUsd: row.annualTuitionUsd,
        officialFeeCurrency: row.officialFeeCurrency ?? undefined,
        officialAnnualTuitionAmount: row.officialAnnualTuitionAmount ?? undefined,
        featured: row.offeringFeatured,
      },
    })),
    totalItems,
    totalPages,
    currentPage: safePage,
    pageSize,
    hasPreviousPage: safePage > 1,
    hasNextPage: safePage < totalPages,
  };
}

type FinderProgramRow = {
  countrySlug: string;
  countryName: string;
  countryRegion: string;
  countrySummary: string;
  countryWhyStudentsChooseIt: string;
  countryClimate: string;
  countryCurrencyCode: string;
  countryMetaTitle: string;
  countryMetaDescription: string;
  courseSlug: string;
  courseName: string;
  courseShortName: string;
  courseStream: string;
  courseDurationYears: number;
  courseSummary: string;
  courseMetaTitle: string;
  courseMetaDescription: string;
  universitySlug: string;
  universityName: string;
  universityCity: string;
  universityType: University["type"];
  universityLogoUrl: string | null;
  universityCoverImageUrl: string | null;
  universityEstablishedYear: number;
  universitySummary: string;
  universityFeatured: boolean;
  universityPublished: boolean;
  universityOfficialWebsite: string;
  universityCampusLifestyle: string;
  universityCityProfile: string;
  universityClinicalExposure: string;
  universityHostelOverview: string;
  universityIndianFoodSupport: string;
  universitySafetyOverview: string;
  universityStudentSupport: string;
  universityWhyChoose: University["whyChoose"];
  universityThingsToConsider: University["thingsToConsider"];
  universityBestFitFor: University["bestFitFor"];
  universityTeachingHospitals: University["industryPartners"];
  universityRecognitionBadges: University["recognitionBadges"];
  universityRecognitionLinks: University["recognitionLinks"];
  universityFaq: University["faq"];
  universitySimilarUniversitySlugs: University["similarUniversitySlugs"];
  universityLastVerifiedAt: string | null;
  universityResearchSources: University["researchSources"];
  universityResearchNotes: string | null;
  universityAdmissionsContent: University["admissionsContent"];
  offeringSlug: string;
  offeringTitle: string;
  offeringDurationYears: number;
  offeringAnnualTuitionUsd: number;
  offeringTotalTuitionUsd: number;
  offeringLivingUsd: number;
  offeringOfficialFeeCurrency: string | null;
  offeringOfficialAnnualTuitionAmount: number | null;
  offeringOfficialTotalTuitionAmount: number | null;
  offeringOfficialProgramUrl: string;
  offeringMedium: ProgramOffering["medium"];
  offeringInstructionLanguages: ProgramOffering["instructionLanguages"];
  offeringPublished: boolean;
  offeringTeachingPhases: ProgramOffering["teachingPhases"];
  offeringYearlyCostBreakdown: ProgramOffering["yearlyCostBreakdown"];
  offeringLicenseExamSupport: ProgramOffering["professionalExamSupport"];
  offeringIntakeMonths: ProgramOffering["intakeMonths"];
  offeringIntakeCodes: ProgramOffering["intakeCodes"];
  offeringFeeVerifiedAt: string | null;
  offeringFxRateDate: string | null;
  offeringFxRateSourceUrl: string | null;
  offeringFeeNotes: string | null;
  offeringSourceUrls: ProgramOffering["sourceUrls"];
  offeringFeatured: boolean;
};

function mapFinderProgramRow(row: FinderProgramRow): FinderProgram {
  const university = applyUniversityContentOverride({
    slug: row.universitySlug,
    countrySlug: row.countrySlug,
    name: getUniversityDisplayName(row.universityName),
    city: row.universityCity,
    type: row.universityType,
    logoUrl: row.universityLogoUrl ?? undefined,
    coverImageUrl: row.universityCoverImageUrl ?? undefined,
    establishedYear: row.universityEstablishedYear,
    summary: row.universitySummary,
    featured: row.universityFeatured,
    published: row.universityPublished,
    officialWebsite: row.universityOfficialWebsite,
    campusLifestyle: row.universityCampusLifestyle,
    cityProfile: row.universityCityProfile,
    practicalExposure: row.universityClinicalExposure,
    hostelOverview: row.universityHostelOverview,
    dietarySupport: row.universityIndianFoodSupport,
    safetyOverview: row.universitySafetyOverview,
    studentSupport: row.universityStudentSupport,
    whyChoose: row.universityWhyChoose,
    thingsToConsider: row.universityThingsToConsider,
    bestFitFor: row.universityBestFitFor,
    industryPartners: row.universityTeachingHospitals,
    recognitionBadges: row.universityRecognitionBadges,
    recognitionLinks: row.universityRecognitionLinks,
    faq: row.universityFaq,
    similarUniversitySlugs: row.universitySimilarUniversitySlugs,
    lastVerifiedAt: row.universityLastVerifiedAt ?? undefined,
    researchSources: row.universityResearchSources,
    researchNotes: row.universityResearchNotes ?? undefined,
    admissionsContent: row.universityAdmissionsContent ?? undefined,
  });

  return {
    country: {
      slug: row.countrySlug,
      name: row.countryName,
      region: row.countryRegion,
      summary: row.countrySummary,
      whyStudentsChooseIt: row.countryWhyStudentsChooseIt,
      climate: row.countryClimate,
      currencyCode: row.countryCurrencyCode,
      metaTitle: row.countryMetaTitle,
      metaDescription: row.countryMetaDescription,
    },
    course: {
      slug: row.courseSlug,
      name: row.courseName,
      shortName: row.courseShortName,
      stream: row.courseStream as import("@/lib/data/types").CourseStream,
      durationYears: row.courseDurationYears,
      summary: row.courseSummary,
      metaTitle: row.courseMetaTitle,
      metaDescription: row.courseMetaDescription,
    },
    university,
    offering: {
      slug: row.offeringSlug,
      universitySlug: row.universitySlug,
      courseSlug: row.courseSlug,
      title: row.offeringTitle,
      durationYears: row.offeringDurationYears,
      annualTuitionUsd: row.offeringAnnualTuitionUsd,
      totalTuitionUsd: row.offeringTotalTuitionUsd,
      livingUsd: row.offeringLivingUsd,
      officialFeeCurrency: row.offeringOfficialFeeCurrency ?? undefined,
      officialAnnualTuitionAmount: row.offeringOfficialAnnualTuitionAmount ?? undefined,
      officialTotalTuitionAmount: row.offeringOfficialTotalTuitionAmount ?? undefined,
      officialProgramUrl: row.offeringOfficialProgramUrl,
      medium: row.offeringMedium,
      published: row.offeringPublished,
      teachingPhases: row.offeringTeachingPhases,
      yearlyCostBreakdown: row.offeringYearlyCostBreakdown,
      professionalExamSupport: row.offeringLicenseExamSupport,
      intakeMonths: row.offeringIntakeMonths,
      feeVerifiedAt: row.offeringFeeVerifiedAt ?? undefined,
      fxRateDate: row.offeringFxRateDate ?? undefined,
      fxRateSourceUrl: row.offeringFxRateSourceUrl ?? undefined,
      feeNotes: row.offeringFeeNotes ?? undefined,
      sourceUrls: row.offeringSourceUrls,
      featured: row.offeringFeatured,
      instructionLanguages:
        row.offeringInstructionLanguages as ProgramOffering["instructionLanguages"],
      intakeCodes: row.offeringIntakeCodes as ProgramOffering["intakeCodes"],
    },
  };
}

async function selectFinderProgramsFromDatabase(
  whereClause?: ReturnType<typeof and>,
  limit?: number,
): Promise<FinderProgram[] | null> {
  const db = getDb();

  if (!db) {
    return null;
  }

  const query = db
    .select({
      countrySlug: countriesTable.slug,
      countryName: countriesTable.name,
      countryRegion: countriesTable.region,
      countrySummary: countriesTable.summary,
      countryWhyStudentsChooseIt: countriesTable.whyStudentsChooseIt,
      countryClimate: countriesTable.climate,
      countryCurrencyCode: countriesTable.currencyCode,
      countryMetaTitle: countriesTable.metaTitle,
      countryMetaDescription: countriesTable.metaDescription,
      courseSlug: coursesTable.slug,
      courseName: coursesTable.name,
      courseShortName: coursesTable.shortName,
      courseStream: coursesTable.stream,
      courseDurationYears: coursesTable.durationYears,
      courseSummary: coursesTable.summary,
      courseMetaTitle: coursesTable.metaTitle,
      courseMetaDescription: coursesTable.metaDescription,
      universitySlug: universitiesTable.slug,
      universityName: universitiesTable.name,
      universityCity: universitiesTable.city,
      universityType: universitiesTable.type,
      universityLogoUrl: universitiesTable.logoUrl,
      universityCoverImageUrl: universitiesTable.coverImageUrl,
      universityEstablishedYear: universitiesTable.establishedYear,
      universitySummary: universitiesTable.summary,
      universityFeatured: universitiesTable.featured,
      universityPublished: universitiesTable.published,
      universityOfficialWebsite: universitiesTable.officialWebsite,
      universityCampusLifestyle: universitiesTable.campusLifestyle,
      universityCityProfile: universitiesTable.cityProfile,
      universityClinicalExposure: universitiesTable.practicalExposure,
      universityHostelOverview: universitiesTable.hostelOverview,
      universityIndianFoodSupport: universitiesTable.dietarySupport,
      universitySafetyOverview: universitiesTable.safetyOverview,
      universityStudentSupport: universitiesTable.studentSupport,
      universityWhyChoose: universitiesTable.whyChoose,
      universityThingsToConsider: universitiesTable.thingsToConsider,
      universityBestFitFor: universitiesTable.bestFitFor,
      universityTeachingHospitals: universitiesTable.industryPartners,
      universityRecognitionBadges: universitiesTable.recognitionBadges,
      universityRecognitionLinks: universitiesTable.recognitionLinks,
      universityFaq: universitiesTable.faq,
      universitySimilarUniversitySlugs: universitiesTable.similarUniversitySlugs,
      universityLastVerifiedAt: universitiesTable.lastVerifiedAt,
      universityResearchSources: universitiesTable.researchSources,
      universityResearchNotes: universitiesTable.researchNotes,
      universityAdmissionsContent: universitiesTable.admissionsContent,
      offeringSlug: programOfferingsTable.slug,
      offeringTitle: programOfferingsTable.title,
      offeringDurationYears: programOfferingsTable.durationYears,
      offeringAnnualTuitionUsd: programOfferingsTable.annualTuitionUsd,
      offeringTotalTuitionUsd: programOfferingsTable.totalTuitionUsd,
      offeringLivingUsd: programOfferingsTable.livingUsd,
      offeringOfficialFeeCurrency: programOfferingsTable.officialFeeCurrency,
      offeringOfficialAnnualTuitionAmount: programOfferingsTable.officialAnnualTuitionAmount,
      offeringOfficialTotalTuitionAmount: programOfferingsTable.officialTotalTuitionAmount,
      offeringOfficialProgramUrl: programOfferingsTable.officialProgramUrl,
      offeringMedium: programOfferingsTable.medium,
      offeringInstructionLanguages: programOfferingsTable.instructionLanguages,
      offeringPublished: programOfferingsTable.published,
      offeringTeachingPhases: programOfferingsTable.teachingPhases,
      offeringYearlyCostBreakdown: programOfferingsTable.yearlyCostBreakdown,
      offeringLicenseExamSupport: programOfferingsTable.professionalExamSupport,
      offeringIntakeMonths: programOfferingsTable.intakeMonths,
      offeringIntakeCodes: programOfferingsTable.intakeCodes,
      offeringFeeVerifiedAt: programOfferingsTable.feeVerifiedAt,
      offeringFxRateDate: programOfferingsTable.fxRateDate,
      offeringFxRateSourceUrl: programOfferingsTable.fxRateSourceUrl,
      offeringFeeNotes: programOfferingsTable.feeNotes,
      offeringSourceUrls: programOfferingsTable.sourceUrls,
      offeringFeatured: programOfferingsTable.featured,
    })
    .from(programOfferingsTable)
    .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
    .innerJoin(coursesTable, eq(programOfferingsTable.courseId, coursesTable.id))
    .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
    .where(whereClause)
    .orderBy(...getFinderProgramOrder(undefined))
    .$dynamic();
  const rows = limit == null
    ? await query
    : await query.limit(Math.max(0, limit));

  return rows.map((row) => mapFinderProgramRow(row as FinderProgramRow));
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

function getOneFinderProgramPerUniversity(programs: FinderProgram[]) {
  const seenUniversitySlugs = new Set<string>();

  return programs.filter((program) => {
    if (seenUniversitySlugs.has(program.university.slug)) {
      return false;
    }

    seenUniversitySlugs.add(program.university.slug);
    return true;
  });
}

export async function listFinderPrograms(filters: FinderFilters) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("catalog-details");
  if (filters.country) cacheTag(`country-programs:${filters.country}`);
  if (filters.course) cacheTag(`course-programs:${filters.course}`);

  const programs =
    (await selectFinderProgramsFromDatabase(
      buildFinderProgramConditions(filters),
    )) ?? (await getFinderProgramsBase());

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

    if (filters.city && program.university.city !== filters.city) {
      return false;
    }

    if (filters.level && program.course.level !== filters.level) {
      return false;
    }

    if (
      filters.universityType &&
      program.university.type !== filters.universityType
    ) {
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

    if (
      filters.medium &&
      !program.offering.instructionLanguages.includes(
        filters.medium as TeachingLanguageCode,
      )
    ) {
      return false;
    }

    if (
      filters.intake &&
      !program.offering.intakeCodes.includes(filters.intake as IntakeMonthCode)
    ) {
      return false;
    }

    return true;
  });

  return sortFinderPrograms(filteredPrograms, getFinderSort(filters.sort));
}

function toFinderCardProgram(program: FinderProgram): FinderCardProgram {
  return {
    university: {
      slug: program.university.slug,
      name: program.university.name,
      city: program.university.city,
      type: program.university.type,
      logoUrl: program.university.logoUrl,
      coverImageUrl: program.university.coverImageUrl,
      featured: program.university.featured,
    },
    country: {
      slug: program.country.slug,
      name: program.country.name,
    },
    course: {
      slug: program.course.slug,
      shortName: program.course.shortName,
    },
    offering: {
      slug: program.offering.slug,
      annualTuitionUsd: program.offering.annualTuitionUsd,
      officialFeeCurrency: program.offering.officialFeeCurrency,
      officialAnnualTuitionAmount:
        program.offering.officialAnnualTuitionAmount,
      featured: program.offering.featured,
    },
  };
}

export async function queryFinderCardProgramsPage(
  filters: FinderFilters,
  page = 1,
  pageSize = finderPageSize,
): Promise<FinderCardProgramsPage> {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("finder");

  const safePageSize = Number.isFinite(pageSize)
    ? Math.min(Math.max(Math.floor(pageSize), 1), 100)
    : finderPageSize;
  const databasePage = await queryFinderProgramsFromDatabase(
    filters,
    page,
    safePageSize,
  );

  if (databasePage) {
    return databasePage;
  }

  const allPrograms = getOneFinderProgramPerUniversity(
    await listFinderPrograms(filters),
  );
  const totalItems = allPrograms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * safePageSize;

  return {
    programs: allPrograms
      .slice(start, start + safePageSize)
      .map(toFinderCardProgram),
    totalItems,
    totalPages,
    currentPage: safePage,
    pageSize: safePageSize,
    hasPreviousPage: safePage > 1,
    hasNextPage: safePage < totalPages,
  };
}

export async function getFinderOptions(): Promise<FinderOptions> {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("finder");

  const db = getDb();

  if (db) {
    const [countryRows, cityRows, levelRows, courseRows, mediumRows, intakeRows] = await Promise.all([
      db
        .selectDistinct({ slug: countriesTable.slug, name: countriesTable.name })
        .from(programOfferingsTable)
        .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
        .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
        .where(and(eq(programOfferingsTable.published, true), eq(universitiesTable.published, true)))
        .orderBy(asc(countriesTable.name)),
      db
        .selectDistinct({
          countrySlug: countriesTable.slug,
          name: universitiesTable.city,
        })
        .from(programOfferingsTable)
        .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
        .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
        .where(and(eq(programOfferingsTable.published, true), eq(universitiesTable.published, true)))
        .orderBy(asc(countriesTable.slug), asc(universitiesTable.city)),
      db
        .selectDistinct({ level: coursesTable.level })
        .from(programOfferingsTable)
        .innerJoin(coursesTable, eq(programOfferingsTable.courseId, coursesTable.id))
        .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
        .where(and(eq(programOfferingsTable.published, true), eq(universitiesTable.published, true))),
      db
        .selectDistinct({
          slug: coursesTable.slug,
          shortName: coursesTable.shortName,
          level: coursesTable.level,
        })
        .from(programOfferingsTable)
        .innerJoin(coursesTable, eq(programOfferingsTable.courseId, coursesTable.id))
        .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
        .where(and(eq(programOfferingsTable.published, true), eq(universitiesTable.published, true)))
        .orderBy(asc(coursesTable.shortName)),
      db.execute<{ medium: string }>(sql`
        SELECT DISTINCT unnest(${programOfferingsTable.instructionLanguages}) AS medium
        FROM ${programOfferingsTable}
        INNER JOIN ${universitiesTable}
          ON ${programOfferingsTable.universityId} = ${universitiesTable.id}
        WHERE ${programOfferingsTable.published} = true
          AND ${universitiesTable.published} = true
      `),
      db.execute<{ intake: string }>(sql`
        SELECT DISTINCT unnest(${programOfferingsTable.intakeCodes}) AS intake
        FROM ${programOfferingsTable}
        INNER JOIN ${universitiesTable}
          ON ${programOfferingsTable.universityId} = ${universitiesTable.id}
        WHERE ${programOfferingsTable.published} = true
          AND ${universitiesTable.published} = true
      `),
    ]);

    return {
      countries: countryRows.map((row) => ({ slug: row.slug, name: row.name })),
      cities: cityRows.map((row) => ({
        countrySlug: row.countrySlug,
        name: row.name,
      })),
      levels: programmeLevels.filter((level) =>
        levelRows.some((row) => row.level === level),
      ),
      courses: courseRows.map((row) => ({
        slug: row.slug,
        shortName: row.shortName,
        level: row.level ?? undefined,
      })),
      mediums: sortTeachingLanguageCodes(
        mediumRows.rows.map((row) => row.medium).filter(Boolean) as TeachingLanguageCode[],
      ),
      intakes: sortIntakeMonthCodes(
        intakeRows.rows.map((row) => row.intake).filter(Boolean) as IntakeMonthCode[],
      ),
    };
  }

  const programs = await getFinderProgramsBase();
  const countriesBySlug = new Map<string, FinderCountryOption>();
  const citiesByKey = new Map<string, FinderCityOption>();
  const coursesBySlug = new Map<string, FinderCourseOption>();
  const levels = new Set<ProgrammeLevel>();
  const mediums = new Set<TeachingLanguageCode>();
  const intakes = new Set<IntakeMonthCode>();

  for (const program of programs) {
    countriesBySlug.set(program.country.slug, {
      slug: program.country.slug,
      name: program.country.name,
    });
    citiesByKey.set(`${program.country.slug}:${program.university.city}`, {
      countrySlug: program.country.slug,
      name: program.university.city,
    });
    coursesBySlug.set(program.course.slug, {
      slug: program.course.slug,
      shortName: program.course.shortName,
      level: program.course.level,
    });
    if (programmeLevels.includes(program.course.level as ProgrammeLevel)) {
      levels.add(program.course.level as ProgrammeLevel);
    }
    for (const medium of program.offering.instructionLanguages) {
      mediums.add(medium);
    }
    for (const intake of program.offering.intakeCodes) {
      intakes.add(intake);
    }
  }

  return {
    countries: [...countriesBySlug.values()].sort((left, right) =>
      left.name.localeCompare(right.name),
    ),
    cities: [...citiesByKey.values()].sort((left, right) =>
      left.countrySlug.localeCompare(right.countrySlug) || left.name.localeCompare(right.name),
    ),
    levels: programmeLevels.filter((level) => levels.has(level)),
    courses: [...coursesBySlug.values()].sort((left, right) =>
      left.shortName.localeCompare(right.shortName),
    ),
    mediums: sortTeachingLanguageCodes(mediums),
    intakes: sortIntakeMonthCodes(intakes),
  };
}

export async function getFeaturedPrograms(limit = 4) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("finder");
  cacheTag("program-offerings");

  const featuredPrograms = await selectFinderProgramsFromDatabase(
    and(
      eq(programOfferingsTable.published, true),
      eq(universitiesTable.published, true),
      eq(programOfferingsTable.featured, true),
    ),
    limit,
  );

  if (featuredPrograms) {
    return featuredPrograms.slice(0, Math.max(0, limit));
  }

  return (await listFinderPrograms({}))
    .filter((program) => program.offering.featured)
    .slice(0, Math.max(0, limit));
}

export async function getProgramPreviewForCountry(countrySlug: string, limit = 8) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag(`country-programs:${countrySlug}`);

  return (await selectFinderProgramsFromDatabase(
    and(
      eq(countriesTable.slug, countrySlug),
      eq(programOfferingsTable.published, true),
      eq(universitiesTable.published, true),
    ),
    limit,
  )) ?? [];
}

export type CountryProgramDirectoryRow = {
  university: {
    slug: string;
    name: string;
    city: string;
    type: University["type"];
    logoUrl?: string;
    coverImageUrl?: string;
    featured: boolean;
  };
  course: {
    slug: string;
    shortName: string;
    stream: Course["stream"];
    durationYears: number;
  };
  offering: {
    annualTuitionUsd: number;
    livingUsd: number;
    medium: ProgramOffering["medium"];
    intakeMonths: string[];
  };
};

export async function getCountryProgramDirectoryRows(countrySlug: string) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag(`country-programs:${countrySlug}`);

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      universitySlug: universitiesTable.slug,
      universityName: universitiesTable.name,
      universityCity: universitiesTable.city,
      universityType: universitiesTable.type,
      universityLogoUrl: universitiesTable.logoUrl,
      universityCoverImageUrl: universitiesTable.coverImageUrl,
      universityFeatured: universitiesTable.featured,
      courseSlug: coursesTable.slug,
      courseShortName: coursesTable.shortName,
      courseStream: coursesTable.stream,
      courseDurationYears: coursesTable.durationYears,
      annualTuitionUsd: programOfferingsTable.annualTuitionUsd,
      livingUsd: programOfferingsTable.livingUsd,
      medium: programOfferingsTable.medium,
      intakeMonths: programOfferingsTable.intakeMonths,
    })
    .from(programOfferingsTable)
    .innerJoin(
      universitiesTable,
      eq(programOfferingsTable.universityId, universitiesTable.id),
    )
    .innerJoin(coursesTable, eq(programOfferingsTable.courseId, coursesTable.id))
    .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
    .where(and(
      eq(countriesTable.slug, countrySlug),
      eq(programOfferingsTable.published, true),
      eq(universitiesTable.published, true),
    ))
    .orderBy(...getFinderProgramOrder(undefined));

  return rows.map((row): CountryProgramDirectoryRow => ({
    university: {
      slug: row.universitySlug,
      name: getUniversityDisplayName(row.universityName),
      city: row.universityCity,
      type: row.universityType as University["type"],
      logoUrl: row.universityLogoUrl ?? undefined,
      coverImageUrl: row.universityCoverImageUrl ?? undefined,
      featured: row.universityFeatured,
    },
    course: {
      slug: row.courseSlug,
      shortName: row.courseShortName,
      stream: row.courseStream,
      durationYears: row.courseDurationYears,
    },
    offering: {
      annualTuitionUsd: row.annualTuitionUsd,
      livingUsd: row.livingUsd,
      medium: row.medium as ProgramOffering["medium"],
      intakeMonths: row.intakeMonths,
    },
  }));
}

export async function getProgramPreviewForCourse(courseSlug: string, limit = 3) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag(`course-programs:${courseSlug}`);

  return (await selectFinderProgramsFromDatabase(
    and(
      eq(coursesTable.slug, courseSlug),
      eq(programOfferingsTable.published, true),
      eq(universitiesTable.published, true),
    ),
    limit,
  )) ?? [];
}

export async function getCourseProgramDirectorySummary(courseSlug: string) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag(`course-programs:${courseSlug}`);

  const db = getDb();
  if (!db) return { programCount: 0, countries: [] };

  const rows = await db
    .select({
      countrySlug: countriesTable.slug,
      countryName: countriesTable.name,
      programCount: sql<number>`count(${programOfferingsTable.id})::int`,
    })
    .from(programOfferingsTable)
    .innerJoin(
      universitiesTable,
      eq(programOfferingsTable.universityId, universitiesTable.id),
    )
    .innerJoin(coursesTable, eq(programOfferingsTable.courseId, coursesTable.id))
    .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
    .where(and(
      eq(coursesTable.slug, courseSlug),
      eq(programOfferingsTable.published, true),
      eq(universitiesTable.published, true),
    ))
    .groupBy(countriesTable.slug, countriesTable.name)
    .orderBy(asc(countriesTable.name));

  return {
    programCount: rows.reduce((total, row) => total + row.programCount, 0),
    countries: rows.map((row) => ({ slug: row.countrySlug, name: row.countryName })),
  };
}

export async function getProgramsForUniversity(universitySlug: string) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("courses");
  cacheTag(`university-programs:${universitySlug}`);

  const databasePrograms = await selectFinderProgramsFromDatabase(
    and(
      eq(programOfferingsTable.published, true),
      eq(universitiesTable.published, true),
      eq(universitiesTable.slug, universitySlug),
    ),
  );

  if (databasePrograms) {
    return databasePrograms;
  }

  const programs = await getFinderProgramsBase();
  return programs.filter((program) => program.university.slug === universitySlug);
}

export async function getProgramBySlug(programSlug: string) {
  // Do not persist negative detail lookups independently of the rendered
  // route. A programme may be published after the deployment was built; the
  // regenerated route must read that row immediately. Next/Vercel caches the
  // completed HTML route, so this query is not executed on every page view.
  const databasePrograms = await selectFinderProgramsFromDatabase(
    and(
      eq(programOfferingsTable.published, true),
      eq(universitiesTable.published, true),
      eq(programOfferingsTable.slug, programSlug),
    ),
  );

  if (databasePrograms) {
    return databasePrograms[0] ?? null;
  }

  const programs = await getFinderProgramsBase();
  return (
    programs.find((program) => program.offering.slug === programSlug) ?? null
  );
}

export async function getProgramsForCity(citySlug: string) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag(`city-programs:${citySlug}`);

  const city = (await getUniqueCities()).find((entry) => entry.slug === citySlug);

  if (!city) {
    return [];
  }

  const databasePrograms = await selectFinderProgramsFromDatabase(
    and(
      eq(programOfferingsTable.published, true),
      eq(universitiesTable.published, true),
      eq(countriesTable.slug, city.countrySlug),
      eq(universitiesTable.city, city.name),
    ),
  );

  if (databasePrograms) {
    return databasePrograms;
  }

  const programs = await getFinderProgramsBase();
  return programs.filter(
    (program) =>
      program.country.slug === city.countrySlug &&
      program.university.city === city.name,
  );
}

export async function getUniqueCities() {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("universities");
  cacheTag("program-offerings");
  cacheTag("cities");

  const db = getDb();

  if (db) {
    const rows = await db
      .select({
        cityName: universitiesTable.city,
        countrySlug: countriesTable.slug,
        countryName: countriesTable.name,
        universityCount: sql<number>`count(distinct ${universitiesTable.slug})::int`,
      })
      .from(programOfferingsTable)
      .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
      .innerJoin(coursesTable, eq(programOfferingsTable.courseId, coursesTable.id))
      .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
      .where(and(eq(programOfferingsTable.published, true), eq(universitiesTable.published, true)))
      .groupBy(universitiesTable.city, countriesTable.slug, countriesTable.name)
      .orderBy(desc(sql`count(distinct ${universitiesTable.slug})::int`), asc(universitiesTable.city));

    return rows.map((row) => ({
      slug: cityNameToSlug(row.cityName),
      name: row.cityName,
      countrySlug: row.countrySlug,
      countryName: row.countryName,
      universityCount: row.universityCount,
    }));
  }
  const programs = await getFinderProgramsBase();

  const cityMeta = new Map<string, { slug: string; name: string; countrySlug: string; countryName: string }>();
  const uniSetsPerCity = new Map<string, Set<string>>();

  for (const program of programs) {
    const key = `${program.country.slug}:${program.university.city}`;
    const slug = cityNameToSlug(program.university.city);
    if (!cityMeta.has(key)) {
      cityMeta.set(key, {
        slug,
        name: program.university.city,
        countrySlug: program.country.slug,
        countryName: program.country.name,
      });
    }
    if (!uniSetsPerCity.has(key)) {
      uniSetsPerCity.set(key, new Set());
    }
    uniSetsPerCity.get(key)!.add(program.university.slug);
  }

  return Array.from(cityMeta.entries())
    .map(([key, entry]) => ({
      ...entry,
      universityCount: uniSetsPerCity.get(key)?.size ?? 0,
    }))
    .sort((a, b) => b.universityCount - a.universityCount);
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
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("universities");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      university: universitiesTable,
      countrySlug: countriesTable.slug,
    })
    .from(universitiesTable)
    .innerJoin(
      countriesTable,
      eq(universitiesTable.countryId, countriesTable.id),
    )
    .where(
      and(
        eq(universitiesTable.published, true),
        eq(universitiesTable.featured, true),
      ),
    )
    .orderBy(asc(universitiesTable.name))
    .limit(Math.max(0, limit));

  return rows.map((row) =>
    mapUniversityRow(row.university, row.countrySlug),
  );
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
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("universities");
  cacheTag("sitemap");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      slug: universitiesTable.slug,
      updatedAt: universitiesTable.updatedAt,
      hasPublishedPrograms: sql<boolean>`exists(
        select 1 from ${programOfferingsTable}
        where ${programOfferingsTable.universityId} = ${universitiesTable.id}
          and ${programOfferingsTable.published} = true
      )`,
      hasSubstantialStudentLife: sql<boolean>`
        length(trim(${universitiesTable.campusLifestyle}))
        + length(trim(${universitiesTable.cityProfile}))
        + length(trim(${universitiesTable.studentSupport})) >= 600
      `,
      hasSubstantialHostel: sql<boolean>`
        length(trim(${universitiesTable.hostelOverview}))
        + length(trim(${universitiesTable.dietarySupport}))
        + length(trim(${universitiesTable.safetyOverview})) >= 450
      `,
      hasSubstantialFaq: sql<boolean>`jsonb_array_length(${universitiesTable.faq}) >= 4`,
    })
    .from(universitiesTable)
    .where(eq(universitiesTable.published, true))
    .orderBy(asc(universitiesTable.slug))
    .limit(Math.max(0, end - start))
    .offset(Math.max(0, start));

  return rows.map((university) => ({
    slug: university.slug,
    path: getUniversityHref(university.slug),
    updatedAt: university.updatedAt?.toISOString(),
    hasPublishedPrograms: university.hasPublishedPrograms,
    hasSubstantialStudentLife: university.hasSubstantialStudentLife,
    hasSubstantialHostel: university.hasSubstantialHostel,
    hasSubstantialFaq: university.hasSubstantialFaq,
  }));
}

export async function getPublishedUniversityCount() {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("universities");
  cacheTag("sitemap");

  const db = getDb();
  if (!db) return 0;

  const [row] = await db
    .select({ value: count() })
    .from(universitiesTable)
    .where(eq(universitiesTable.published, true));

  return row?.value ?? 0;
}

export async function getPublishedUniversityParams(limit: number) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("universities");

  const db = getDb();
  if (!db) return [];

  return db
    .select({ slug: universitiesTable.slug })
    .from(universitiesTable)
    .where(eq(universitiesTable.published, true))
    .orderBy(desc(universitiesTable.featured), asc(universitiesTable.name))
    .limit(Math.max(0, limit));
}

export async function getPublishedProgramCount() {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("program-offerings");
  cacheTag("sitemap");

  const db = getDb();
  if (!db) return 0;

  const [row] = await db
    .select({ value: count() })
    .from(programOfferingsTable)
    .innerJoin(
      universitiesTable,
      eq(programOfferingsTable.universityId, universitiesTable.id),
    )
    .where(
      and(
        eq(programOfferingsTable.published, true),
        eq(universitiesTable.published, true),
      ),
    );

  return row?.value ?? 0;
}

export async function getProgramSitemapSlice(start: number, end: number) {
  "use cache";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("program-offerings");
  cacheTag("sitemap");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      slug: programOfferingsTable.slug,
      updatedAt: programOfferingsTable.updatedAt,
      hasAdmissionsContent: sql<boolean>`${universitiesTable.admissionsContent} <> '{}'::jsonb`,
      hasSpecificIntakeSources: sql<boolean>`
        cardinality(${programOfferingsTable.intakeMonths}) > 0
        and cardinality(${programOfferingsTable.sourceUrls}) >= 2
      `,
      hasAudienceRestrictions: sql<boolean>`
        coalesce(${programOfferingsTable.audienceEligibility}->>'availability', 'global') <> 'global'
        or jsonb_array_length(coalesce(${programOfferingsTable.audienceEligibility}->'restrictions', '[]'::jsonb)) > 0
        or jsonb_array_length(coalesce(${programOfferingsTable.audienceEligibility}->'eligibleAudiences', '[]'::jsonb)) > 0
      `,
      hasRecognitionEvidence: sql<boolean>`
        cardinality(${universitiesTable.recognitionBadges}) > 0
        and jsonb_array_length(${universitiesTable.recognitionLinks}) > 0
      `,
      hasVerifiedDetailedFees: sql<boolean>`
        ${programOfferingsTable.annualTuitionUsd} > 0
        and nullif(trim(coalesce(${programOfferingsTable.feeVerifiedAt}, '')), '') is not null
        and (
          jsonb_array_length(${programOfferingsTable.yearlyCostBreakdown}) > 0
          or length(coalesce(${programOfferingsTable.feeNotes}, '')) >= 80
          or ${programOfferingsTable.officialAnnualTuitionAmount} is not null
          or ${programOfferingsTable.officialTotalTuitionAmount} is not null
        )
      `,
    })
    .from(programOfferingsTable)
    .innerJoin(
      universitiesTable,
      eq(programOfferingsTable.universityId, universitiesTable.id),
    )
    .where(
      and(
        eq(programOfferingsTable.published, true),
        eq(universitiesTable.published, true),
      ),
    )
    .orderBy(asc(programOfferingsTable.slug))
    .limit(Math.max(0, end - start))
    .offset(Math.max(0, start));

  return rows.map((offering) => ({
    slug: offering.slug,
    path: getUniversityProgramHref(offering.slug),
    updatedAt: offering.updatedAt?.toISOString(),
    hasAdmissionsContent: offering.hasAdmissionsContent,
    hasSpecificIntakeSources: offering.hasSpecificIntakeSources,
    hasAudienceRestrictions: offering.hasAudienceRestrictions,
    hasRecognitionEvidence: offering.hasRecognitionEvidence,
    hasVerifiedDetailedFees: offering.hasVerifiedDetailedFees,
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
    allPrograms: finderPrograms,
  };
}
