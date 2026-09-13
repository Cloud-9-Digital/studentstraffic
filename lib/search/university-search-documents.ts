// Script-safe: publish scripts run outside Next.js, so this module must not
// import Next.js runtime modules or the server-guarded DB wrapper. Callers
// pass their own Drizzle instance.
import { and, eq, inArray, notInArray, or, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import type { SearchDocument } from "@/lib/data/types";
import type * as schema from "@/lib/db/schema";
import {
  countries,
  courses,
  programOfferings,
  searchDocuments,
  universities,
} from "@/lib/db/schema";
import {
  buildSearchDocuments,
  type SearchProgramOffering,
} from "@/lib/search/documents";

export type SearchDocumentsDb = PgDatabase<PgQueryResultHKT, typeof schema>;

// Shared projections so the full rebuild and the per-university refresh read
// exactly the same fields and therefore produce identical documents.
export const searchCountryColumns = {
  slug: countries.slug,
  name: countries.name,
  region: countries.region,
  summary: countries.summary,
  whyStudentsChooseIt: countries.whyStudentsChooseIt,
  climate: countries.climate,
  currencyCode: countries.currencyCode,
};

export const searchCourseColumns = {
  slug: courses.slug,
  name: courses.name,
  shortName: courses.shortName,
  durationYears: courses.durationYears,
  summary: courses.summary,
};

export const searchUniversityColumns = {
  slug: universities.slug,
  countrySlug: countries.slug,
  name: universities.name,
  city: universities.city,
  summary: universities.summary,
  featured: universities.featured,
  campusLifestyle: universities.campusLifestyle,
  cityProfile: universities.cityProfile,
  practicalExposure: universities.practicalExposure,
  safetyOverview: universities.safetyOverview,
  studentSupport: universities.studentSupport,
  whyChoose: universities.whyChoose,
  thingsToConsider: universities.thingsToConsider,
  bestFitFor: universities.bestFitFor,
  industryPartners: universities.industryPartners,
  recognitionBadges: universities.recognitionBadges,
  faq: universities.faq,
};

export const searchProgramColumns = {
  slug: programOfferings.slug,
  universitySlug: universities.slug,
  courseSlug: courses.slug,
  title: programOfferings.title,
  annualTuitionUsd: programOfferings.annualTuitionUsd,
  medium: programOfferings.medium,
  professionalExamSupport: programOfferings.professionalExamSupport,
  teachingPhases: programOfferings.teachingPhases,
  intakeMonths: programOfferings.intakeMonths,
  featured: programOfferings.featured,
};

export function toSearchProgramOfferings<T extends { medium: string }>(rows: T[]) {
  return rows.map((program) => ({
    ...program,
    medium: program.medium as SearchProgramOffering["medium"],
  }));
}

export function toSearchDocumentRow(document: SearchDocument) {
  return {
    documentType: document.documentType,
    sourceSlug: document.sourceSlug,
    path: document.path,
    title: document.title,
    subtitle: document.subtitle,
    summary: document.summary,
    searchText: document.searchText,
    highlights: document.highlights,
    countrySlug: document.countrySlug,
    courseSlug: document.courseSlug,
    universitySlug: document.universitySlug,
    city: document.city,
    featured: document.featured,
    annualTuitionUsd: document.annualTuitionUsd,
    medium: document.medium,
    intakeMonths: document.intakeMonths,
  };
}

/**
 * Builds the "university" and "program" search documents for the given
 * universities, identical to what the full rebuild produces for them. Issues
 * four bounded queries in parallel, all filtered by `slug IN (...)`.
 *
 * Country and course documents are intentionally not rebuilt here: their text
 * aggregates every university/programme in the country or course, so building
 * them from a partial set would overwrite them with incomplete data.
 */
export async function buildSearchDocumentsForUniversities(
  db: SearchDocumentsDb,
  universitySlugs: string[],
): Promise<SearchDocument[]> {
  const slugs = [...new Set(universitySlugs.filter(Boolean))];
  if (slugs.length === 0) return [];

  const publishedUniversity = and(
    inArray(universities.slug, slugs),
    eq(universities.published, true),
  );
  const publishedProgram = and(
    publishedUniversity,
    eq(programOfferings.published, true),
  );

  const [countryRows, courseRows, universityRows, programRows] = await Promise.all([
    db.selectDistinct(searchCountryColumns)
      .from(countries)
      .innerJoin(universities, eq(universities.countryId, countries.id))
      .where(publishedUniversity),
    db.selectDistinct(searchCourseColumns)
      .from(courses)
      .innerJoin(programOfferings, eq(programOfferings.courseId, courses.id))
      .innerJoin(universities, eq(programOfferings.universityId, universities.id))
      .where(publishedProgram),
    db.select(searchUniversityColumns)
      .from(universities)
      .innerJoin(countries, eq(universities.countryId, countries.id))
      .where(publishedUniversity),
    db.select(searchProgramColumns)
      .from(programOfferings)
      .innerJoin(universities, eq(programOfferings.universityId, universities.id))
      .innerJoin(courses, eq(programOfferings.courseId, courses.id))
      .where(publishedProgram),
  ]);

  return buildSearchDocuments({
    countries: countryRows,
    courses: courseRows,
    universities: universityRows,
    programOfferings: toSearchProgramOfferings(programRows),
    landingPages: [],
  }).filter(
    (document) =>
      document.documentType === "university" || document.documentType === "program",
  );
}

/**
 * Incrementally refreshes `search_documents` for the given universities after a
 * publish, so they are searchable without a full index rebuild.
 *
 * Two statements, no interactive transaction (the neon-http driver used by the
 * draft publisher does not support one):
 * 1. one batched INSERT ... ON CONFLICT (document_type, source_slug) DO UPDATE
 *    for the fresh university/programme documents;
 * 2. one DELETE of rows still owned by these universities that are no longer
 *    published (e.g. a withdrawn programme or an unpublished university).
 * Upserting before pruning means a reader never sees the university missing.
 */
export async function refreshSearchDocumentsForUniversities(
  db: SearchDocumentsDb,
  universitySlugs: string[],
) {
  const slugs = [...new Set(universitySlugs.filter(Boolean))];
  if (slugs.length === 0) return { upserted: 0, removed: 0 };

  const documents = await buildSearchDocumentsForUniversities(db, slugs);
  const freshSlugsByType = (documentType: SearchDocument["documentType"]) =>
    documents
      .filter((document) => document.documentType === documentType)
      .map((document) => document.sourceSlug);
  const freshUniversitySlugs = freshSlugsByType("university");
  const freshProgramSlugs = freshSlugsByType("program");

  if (documents.length > 0) {
    await db
      .insert(searchDocuments)
      .values(documents.map(toSearchDocumentRow))
      .onConflictDoUpdate({
        target: [searchDocuments.documentType, searchDocuments.sourceSlug],
        set: {
          path: sql`excluded.path`,
          title: sql`excluded.title`,
          subtitle: sql`excluded.subtitle`,
          summary: sql`excluded.summary`,
          searchText: sql`excluded.search_text`,
          highlights: sql`excluded.highlights`,
          countrySlug: sql`excluded.country_slug`,
          courseSlug: sql`excluded.course_slug`,
          universitySlug: sql`excluded.university_slug`,
          city: sql`excluded.city`,
          featured: sql`excluded.featured`,
          annualTuitionUsd: sql`excluded.annual_tuition_usd`,
          medium: sql`excluded.medium`,
          intakeMonths: sql`excluded.intake_months`,
          updatedAt: sql`now()`,
        },
      });
  }

  const removed = await db
    .delete(searchDocuments)
    .where(
      or(
        and(
          eq(searchDocuments.documentType, "university"),
          inArray(searchDocuments.sourceSlug, slugs),
          freshUniversitySlugs.length > 0
            ? notInArray(searchDocuments.sourceSlug, freshUniversitySlugs)
            : undefined,
        ),
        and(
          eq(searchDocuments.documentType, "program"),
          inArray(searchDocuments.universitySlug, slugs),
          freshProgramSlugs.length > 0
            ? notInArray(searchDocuments.sourceSlug, freshProgramSlugs)
            : undefined,
        ),
      ),
    )
    .returning({ id: searchDocuments.id });

  return { upserted: documents.length, removed: removed.length };
}
