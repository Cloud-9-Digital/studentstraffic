import "server-only";

import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { cacheLife, cacheTag } from "next/cache";
import { and, asc, count, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";

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
  BlogPostSearchMetadata,
  IndiaMbbsCard,
  LandingPage,
  ProgramOffering,
  University,
  WdomsDirectoryEntry,
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
  getUniversityProgramHref,
  getWdomsDirectoryHref,
  getWdomsSchoolHref,
} from "@/lib/routes";
import {
  createSlug,
  getSortableUsdValue,
  hasPublishedUsdAmount,
} from "@/lib/utils";

export function cityNameToSlug(city: string) {
  return createSlug(city);
}
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
  indiaColleges: IndiaMbbsCard[];
  joinUniversities: Array<{ id: number; name: string; countryId: number; countryName: string }>;
  publishedPosts: BlogPostSearchMetadata[];
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
  __catalogSnapshotCache?: {
    value: CatalogSnapshot;
    expiresAt: number;
  };
  __catalogSnapshotPromise?: Promise<CatalogSnapshot>;
};

const catalogSnapshotTtlMs = 12 * 60 * 60 * 1000;
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
      admissionsContent: universitiesTable.admissionsContent,
      updatedAt: universitiesTable.updatedAt,
    })
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
      stream: course.stream,
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
          (university.admissionsContent as University["admissionsContent"]) ?? undefined,
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

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("countries");
  cacheTag("courses");
  cacheTag("universities");
  cacheTag("program-offerings");
  cacheTag("india-colleges");

  const now = Date.now();
  const cachedSnapshot = globalForCatalogWarnings.__catalogSnapshotCache;

  if (cachedSnapshot && cachedSnapshot.expiresAt > now) {
    return cachedSnapshot.value;
  }

  if (!globalForCatalogWarnings.__catalogSnapshotPromise) {
    globalForCatalogWarnings.__catalogSnapshotPromise = (async () => {
      const dbSnapshot = shouldUseBuildCatalogSnapshot()
        ? ((await readBuildCatalogSnapshotFromDisk()) ?? (await createBuildCatalogSnapshot()))
        : await readCatalogFromDatabase();

      if (dbSnapshot) {
        // Only cache when we got real data — don't freeze an empty fallback in-memory for 12h
        globalForCatalogWarnings.__catalogSnapshotCache = {
          value: dbSnapshot,
          expiresAt: Date.now() + catalogSnapshotTtlMs,
        };
        return dbSnapshot;
      }

      return createEmptyCatalogSnapshot();
    })().finally(() => {
      globalForCatalogWarnings.__catalogSnapshotPromise = undefined;
    });
  }

  return globalForCatalogWarnings.__catalogSnapshotPromise;
}

export async function getCountries() {
  const snapshot = await getCatalogSnapshot();
  return snapshot.countries;
}

export async function getCountryBySlug(slug: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("countries");

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
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("universities");
  cacheTag(`university:${slug}`);

  const universities = await getUniversities();
  return universities.find((university) => university.slug === slug) ?? null;
}

export async function getProgramOfferings() {
  const snapshot = await getCatalogSnapshot();
  return snapshot.programOfferings;
}

export async function getJoinUniversityOptions() {
  const snapshot = await getCatalogSnapshot();
  return snapshot.joinUniversities;
}

export async function getPublishedBlogPostMetadata() {
  const snapshot = await getCatalogSnapshot();
  return snapshot.publishedPosts;
}

// ── Direct, blog-tagged readers ─────────────────────────────────────────────
// The blog detail page must never go through `getCatalogSnapshot()` above:
// that snapshot is tagged catalog/countries/courses/universities/
// program-offerings/india-colleges (no "blog" tag) and is additionally frozen
// behind a hand-rolled 12h in-memory TTL cache that `revalidateTag`/
// `revalidatePath` cannot invalidate. A freshly published blog post would
// then 404 on /blog/[slug] until that in-memory cache expired or the app
// restarted, even though /blog and /blog/category/[slug] (which query
// blogPosts directly, tagged "blog") already show it. These readers query
// blogPosts directly and tag themselves "blog" (+ a per-slug tag), matching
// the pattern used by getUniversityBySlug's `university:${slug}` tag and by
// the /blog/category/[slug] reader.

export async function getAllPublishedBlogPostsMetadata(): Promise<
  BlogPostSearchMetadata[]
> {
  "use cache";

  cacheLife("hours");
  cacheTag("blog");

  const db = getDb();
  if (!db) return [];

  const rows = await db
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
    .orderBy(desc(blogPosts.publishedAt));

  return rows.map((post) => ({
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
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<BlogPostSearchMetadata | null> {
  "use cache";

  cacheLife("hours");
  cacheTag("blog");
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

  if (filters.course) {
    conditions.push(eq(coursesTable.slug, filters.course));
  }

  if (filters.universityType) {
    conditions.push(eq(universitiesTable.type, filters.universityType));
  }

  if (filters.medium) {
    conditions.push(eq(programOfferingsTable.medium, filters.medium as ProgramOffering["medium"]));
  }

  if (filters.intake) {
    conditions.push(sql`${programOfferingsTable.intakeMonths} @> ARRAY[${filters.intake}]::text[]`);
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
  if (shouldUseBuildCatalogSnapshot()) {
    return null;
  }

  const db = getDb();

  if (!db) {
    return null;
  }

  const whereClause = buildFinderProgramConditions(filters);
  const [countRow] = await db
    .select({ value: count() })
    .from(programOfferingsTable)
    .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
    .innerJoin(coursesTable, eq(programOfferingsTable.courseId, coursesTable.id))
    .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
    .where(whereClause);

  const totalItems = countRow?.value ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const offset = (safePage - 1) * pageSize;

  const rows = await db
    .select({
      universitySlug: universitiesTable.slug,
      universityName: universitiesTable.name,
      universityCity: universitiesTable.city,
      universityType: universitiesTable.type,
      universityLogoUrl: universitiesTable.logoUrl,
      universityCoverImageUrl: universitiesTable.coverImageUrl,
      universityFeatured: universitiesTable.featured,
      countrySlug: countriesTable.slug,
      countryName: countriesTable.name,
      courseSlug: coursesTable.slug,
      courseShortName: coursesTable.shortName,
      offeringSlug: programOfferingsTable.slug,
      annualTuitionUsd: programOfferingsTable.annualTuitionUsd,
      officialFeeCurrency: programOfferingsTable.officialFeeCurrency,
      officialAnnualTuitionAmount: programOfferingsTable.officialAnnualTuitionAmount,
      offeringFeatured: programOfferingsTable.featured,
    })
    .from(programOfferingsTable)
    .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
    .innerJoin(coursesTable, eq(programOfferingsTable.courseId, coursesTable.id))
    .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
    .where(whereClause)
    .orderBy(...getFinderProgramOrder(filters.sort))
    .limit(pageSize)
    .offset(offset);

  return {
    programs: rows.map((row) => ({
      university: {
        slug: row.universitySlug,
        name: row.universityName,
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
  universityTeachingHospitals: University["teachingHospitals"];
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
  offeringPublished: boolean;
  offeringTeachingPhases: ProgramOffering["teachingPhases"];
  offeringYearlyCostBreakdown: ProgramOffering["yearlyCostBreakdown"];
  offeringLicenseExamSupport: ProgramOffering["licenseExamSupport"];
  offeringIntakeMonths: ProgramOffering["intakeMonths"];
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
    name: row.universityName,
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
    clinicalExposure: row.universityClinicalExposure,
    hostelOverview: row.universityHostelOverview,
    indianFoodSupport: row.universityIndianFoodSupport,
    safetyOverview: row.universitySafetyOverview,
    studentSupport: row.universityStudentSupport,
    whyChoose: row.universityWhyChoose,
    thingsToConsider: row.universityThingsToConsider,
    bestFitFor: row.universityBestFitFor,
    teachingHospitals: row.universityTeachingHospitals,
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
      licenseExamSupport: row.offeringLicenseExamSupport,
      intakeMonths: row.offeringIntakeMonths,
      feeVerifiedAt: row.offeringFeeVerifiedAt ?? undefined,
      fxRateDate: row.offeringFxRateDate ?? undefined,
      fxRateSourceUrl: row.offeringFxRateSourceUrl ?? undefined,
      feeNotes: row.offeringFeeNotes ?? undefined,
      sourceUrls: row.offeringSourceUrls,
      featured: row.offeringFeatured,
    },
  };
}

async function selectFinderProgramsFromDatabase(
  whereClause?: ReturnType<typeof and>,
): Promise<FinderProgram[] | null> {
  if (shouldUseBuildCatalogSnapshot()) {
    return null;
  }

  const db = getDb();

  if (!db) {
    return null;
  }

  const rows = await db
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
      universityClinicalExposure: universitiesTable.clinicalExposure,
      universityHostelOverview: universitiesTable.hostelOverview,
      universityIndianFoodSupport: universitiesTable.indianFoodSupport,
      universitySafetyOverview: universitiesTable.safetyOverview,
      universityStudentSupport: universitiesTable.studentSupport,
      universityWhyChoose: universitiesTable.whyChoose,
      universityThingsToConsider: universitiesTable.thingsToConsider,
      universityBestFitFor: universitiesTable.bestFitFor,
      universityTeachingHospitals: universitiesTable.teachingHospitals,
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
      offeringPublished: programOfferingsTable.published,
      offeringTeachingPhases: programOfferingsTable.teachingPhases,
      offeringYearlyCostBreakdown: programOfferingsTable.yearlyCostBreakdown,
      offeringLicenseExamSupport: programOfferingsTable.licenseExamSupport,
      offeringIntakeMonths: programOfferingsTable.intakeMonths,
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
    .orderBy(...getFinderProgramOrder(undefined));

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

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");

  const databasePage = await queryFinderProgramsFromDatabase(filters, page, pageSize);

  if (databasePage) {
    return databasePage;
  }

  const allPrograms = await listFinderPrograms(filters);
  const totalItems = allPrograms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    programs: allPrograms.slice(start, start + pageSize).map(toFinderCardProgram),
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

  if (db && !shouldUseBuildCatalogSnapshot()) {
    const [countryRows, courseRows, mediumRows, intakeRows] = await Promise.all([
      db
        .selectDistinct({ slug: countriesTable.slug, name: countriesTable.name })
        .from(programOfferingsTable)
        .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
        .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
        .where(and(eq(programOfferingsTable.published, true), eq(universitiesTable.published, true)))
        .orderBy(asc(countriesTable.name)),
      db
        .selectDistinct({ slug: coursesTable.slug, shortName: coursesTable.shortName })
        .from(programOfferingsTable)
        .innerJoin(coursesTable, eq(programOfferingsTable.courseId, coursesTable.id))
        .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
        .where(and(eq(programOfferingsTable.published, true), eq(universitiesTable.published, true)))
        .orderBy(asc(coursesTable.shortName)),
      db
        .selectDistinct({ medium: programOfferingsTable.medium })
        .from(programOfferingsTable)
        .innerJoin(universitiesTable, eq(programOfferingsTable.universityId, universitiesTable.id))
        .where(and(eq(programOfferingsTable.published, true), eq(universitiesTable.published, true)))
        .orderBy(asc(programOfferingsTable.medium)),
      db.execute<{ intake: string }>(sql`
        SELECT DISTINCT unnest(${programOfferingsTable.intakeMonths}) AS intake
        FROM ${programOfferingsTable}
        INNER JOIN ${universitiesTable}
          ON ${programOfferingsTable.universityId} = ${universitiesTable.id}
        WHERE ${programOfferingsTable.published} = true
          AND ${universitiesTable.published} = true
        ORDER BY intake ASC
      `),
    ]);

    return {
      countries: countryRows.map((row) => ({ slug: row.slug, name: row.name })),
      courses: courseRows.map((row) => ({ slug: row.slug, shortName: row.shortName })),
      mediums: mediumRows.map((row) => row.medium as ProgramOffering["medium"]),
      intakes: intakeRows.rows.map((row) => row.intake).filter(Boolean),
    };
  }

  const programs = await getFinderProgramsBase();
  const countriesBySlug = new Map<string, FinderCountryOption>();
  const coursesBySlug = new Map<string, FinderCourseOption>();
  const mediums = new Set<ProgramOffering["medium"]>();
  const intakes = new Set<string>();

  for (const program of programs) {
    countriesBySlug.set(program.country.slug, {
      slug: program.country.slug,
      name: program.country.name,
    });
    coursesBySlug.set(program.course.slug, {
      slug: program.course.slug,
      shortName: program.course.shortName,
    });
    mediums.add(program.offering.medium);
    for (const intake of program.offering.intakeMonths) {
      intakes.add(intake);
    }
  }

  return {
    countries: [...countriesBySlug.values()].sort((left, right) =>
      left.name.localeCompare(right.name),
    ),
    courses: [...coursesBySlug.values()].sort((left, right) =>
      left.shortName.localeCompare(right.shortName),
    ),
    mediums: [...mediums].sort(),
    intakes: [...intakes].sort(),
  };
}

export async function getFeaturedPrograms(limit = 4) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");
  cacheTag("program-offerings");

  const featuredPrograms = await listFinderPrograms({});
  return featuredPrograms
    .filter((program) => program.offering.featured)
    .slice(0, limit);
}

export async function getProgramsForCountry(countrySlug: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");
  cacheTag("program-offerings");
  cacheTag("countries");
  cacheTag(`country-programs:${countrySlug}`);

  const databasePrograms = await selectFinderProgramsFromDatabase(
    and(
      eq(programOfferingsTable.published, true),
      eq(universitiesTable.published, true),
      eq(countriesTable.slug, countrySlug),
    ),
  );

  if (databasePrograms) {
    return databasePrograms;
  }

  return listFinderPrograms({ country: countrySlug });
}

export async function getProgramsForCourse(courseSlug: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");
  cacheTag("program-offerings");
  cacheTag("courses");
  cacheTag(`course-programs:${courseSlug}`);

  const databasePrograms = await selectFinderProgramsFromDatabase(
    and(
      eq(programOfferingsTable.published, true),
      eq(universitiesTable.published, true),
      eq(coursesTable.slug, courseSlug),
    ),
  );

  if (databasePrograms) {
    return databasePrograms;
  }

  return listFinderPrograms({ course: courseSlug });
}

export async function getProgramsForUniversity(universitySlug: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");
  cacheTag("program-offerings");
  cacheTag("courses");
  cacheTag("universities");
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
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");
  cacheTag("program-offerings");
  cacheTag("courses");
  cacheTag("universities");
  cacheTag(`program:${programSlug}`);

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

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");
  cacheTag("program-offerings");
  cacheTag("universities");
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
  if (shouldUseBuildCatalogSnapshot()) {
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
  const universities = await getUniversities();
  return universities
    .filter((university) => university.featured)
    .slice(0, limit);
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

export async function getPublishedProgramSlugs() {
  const offerings = await getProgramOfferings();
  return offerings.filter((offering) => offering.published).map((offering) => offering.slug);
}

export async function getProgramSitemapSlice(start: number, end: number) {
  const offerings = await getProgramOfferings();
  const published = offerings.filter((offering) => offering.published);
  return published.slice(start, end).map((offering) => ({
    slug: offering.slug,
    path: getUniversityProgramHref(offering.slug),
    updatedAt: offering.updatedAt,
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
