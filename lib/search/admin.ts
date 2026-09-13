import "server-only";

import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { studyAbroadGuides } from "@/lib/data/study-abroad-guides";
import { landingPages } from "@/lib/data/landing-pages";
import { getDb } from "@/lib/db/server";
import {
  blogPosts,
  countries,
  courses,
  indiaMedicalColleges,
  indiaMedicalPrograms,
  programOfferings,
  searchDocuments,
  universities,
} from "@/lib/db/schema";
import { buildSearchDocuments } from "@/lib/search/documents";
import { searchCatalog } from "@/lib/search/search";
import {
  searchCountryColumns,
  searchCourseColumns,
  searchProgramColumns,
  searchUniversityColumns,
  toSearchDocumentRow,
  toSearchProgramOfferings,
} from "@/lib/search/university-search-documents";

async function ensurePostgresSearchIndexes() {
  const db = getDb();

  if (!db) {
    throw new Error("Database unavailable.");
  }

  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_am WHERE amname = 'bm25') THEN
        DROP INDEX IF EXISTS search_documents_bm25_idx;

        CREATE INDEX search_documents_bm25_idx
        ON search_documents
        USING bm25 (
          id,
          title,
          subtitle,
          summary,
          search_text
        )
        WITH (
          key_field='id'
        );
      END IF;
    END $$
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS search_documents_title_trgm_idx
    ON search_documents
    USING gin (title gin_trgm_ops)
  `);
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS search_documents_subtitle_trgm_idx
    ON search_documents
    USING gin (subtitle gin_trgm_ops)
  `);
}

export async function buildCurrentSearchDocuments() {
  const db = getDb();
  if (!db) {
    throw new Error("Database unavailable.");
  }

  const [countryRows, courseRows, universityRows, programRows, indiaColleges, publishedPosts] =
    await Promise.all([
      db.select(searchCountryColumns).from(countries),
      db.select(searchCourseColumns).from(courses),
      db.select(searchUniversityColumns).from(universities)
        .innerJoin(countries, eq(universities.countryId, countries.id))
        .where(eq(universities.published, true)),
      db.select(searchProgramColumns).from(programOfferings)
        .innerJoin(universities, eq(programOfferings.universityId, universities.id))
        .innerJoin(courses, eq(programOfferings.courseId, courses.id))
        .where(and(
          eq(programOfferings.published, true),
          eq(universities.published, true),
        )),
      db.select({
        slug: indiaMedicalColleges.slug,
        collegeName: indiaMedicalColleges.collegeName,
        programName: indiaMedicalPrograms.courseName,
        stateName: indiaMedicalColleges.stateName,
        cityName: indiaMedicalColleges.cityName,
        managementType: indiaMedicalColleges.managementType,
        universityName: indiaMedicalColleges.universityName,
        yearOfInception: indiaMedicalPrograms.yearOfInception,
        annualIntakeSeats: indiaMedicalPrograms.annualIntakeSeats,
      }).from(indiaMedicalColleges)
        .innerJoin(indiaMedicalPrograms, eq(indiaMedicalPrograms.collegeId, indiaMedicalColleges.id))
        .limit(1000),
      db.select({
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        category: blogPosts.category,
      }).from(blogPosts)
        .where(eq(blogPosts.status, "published")),
    ]);

  return buildSearchDocuments({
    countries: countryRows,
    courses: courseRows,
    universities: universityRows,
    programOfferings: toSearchProgramOfferings(programRows),
    indiaColleges: indiaColleges.map((college) => ({
      ...college,
      cityName: college.cityName ?? undefined,
      managementType: college.managementType ?? undefined,
      universityName: college.universityName ?? undefined,
      yearOfInception: college.yearOfInception ?? undefined,
      annualIntakeSeats: college.annualIntakeSeats ?? undefined,
    })),
    landingPages,
    studyAbroadGuides: Object.values(studyAbroadGuides).map((guide) => guide.page),
    blogPosts: publishedPosts.map((post) => ({
      ...post,
      excerpt: post.excerpt ?? undefined,
      category: post.category ?? undefined,
    })),
  });
}

export async function rebuildPostgresSearchIndex() {
  const db = getDb();

  if (!db) {
    throw new Error("Database unavailable.");
  }

  const documents = await buildCurrentSearchDocuments();

  await db.transaction(async (tx) => {
    await tx.delete(searchDocuments);

    if (documents.length) {
      await tx.insert(searchDocuments).values(documents.map(toSearchDocumentRow));
    }
  });
  await ensurePostgresSearchIndexes();

  revalidateTag("search", "hours");

  return {
    indexed: documents.length,
  };
}

export async function getSearchIndexHealth() {
  const db = getDb();

  if (!db) {
    return {
      totalDocuments: 0,
      documentsByType: [] as Array<{ documentType: string; count: number }>,
      latestUpdatedAt: null as Date | null,
      recentDocuments: [] as Array<{
        documentType: string;
        title: string;
        path: string;
        updatedAt: Date | null;
      }>,
    };
  }

  const [totalRows, typeRows, latestRows, recentDocuments] = await Promise.all([
    db.select({ value: count() }).from(searchDocuments),
    db
      .select({
        documentType: searchDocuments.documentType,
        count: sql<number>`count(*)::int`,
      })
      .from(searchDocuments)
      .groupBy(searchDocuments.documentType)
      .orderBy(asc(searchDocuments.documentType)),
    db
      .select({ updatedAt: searchDocuments.updatedAt })
      .from(searchDocuments)
      .orderBy(desc(searchDocuments.updatedAt))
      .limit(1),
    db
      .select({
        documentType: searchDocuments.documentType,
        title: searchDocuments.title,
        path: searchDocuments.path,
        updatedAt: searchDocuments.updatedAt,
      })
      .from(searchDocuments)
      .orderBy(desc(searchDocuments.updatedAt))
      .limit(8),
  ]);

  return {
    totalDocuments: totalRows[0]?.value ?? 0,
    documentsByType: typeRows,
    latestUpdatedAt: latestRows[0]?.updatedAt ?? null,
    recentDocuments,
  };
}

export async function testSearchQuery(query: string) {
  const startedAt = Date.now();
  const results = query.trim()
    ? await searchCatalog({ q: query.trim() }, 8)
    : [];

  return {
    query,
    latencyMs: Date.now() - startedAt,
    results,
  };
}
