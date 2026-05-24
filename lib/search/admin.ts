import "server-only";

import { asc, count, desc, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { studyAbroadGuides } from "@/lib/data/study-abroad-guides";
import { getCatalogSnapshot } from "@/lib/data/catalog";
import { landingPages } from "@/lib/data/landing-pages";
import { getDb } from "@/lib/db/server";
import { searchDocuments } from "@/lib/db/schema";
import { buildSearchDocuments } from "@/lib/search/documents";
import {
  ensureTypesenseSearchCollection,
  getTypesenseSearchHealth,
  importTypesenseSearchDocuments,
} from "@/lib/search/typesense";
import { searchCatalog } from "@/lib/search/search";

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
  const snapshot = await getCatalogSnapshot();

  return buildSearchDocuments({
    ...snapshot,
    landingPages,
    studyAbroadGuides: Object.values(studyAbroadGuides).map((guide) => guide.page),
    blogPosts: snapshot.publishedPosts,
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
      await tx.insert(searchDocuments).values(
        documents.map((document) => ({
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
        })),
      );
    }
  });
  await ensurePostgresSearchIndexes();

  revalidateTag("search", "hours");

  return {
    indexed: documents.length,
  };
}

export async function syncTypesenseSearchIndex() {
  const documents = await buildCurrentSearchDocuments();

  await ensureTypesenseSearchCollection();
  const result = await importTypesenseSearchDocuments(documents);
  revalidateTag("search", "hours");

  return result;
}

export async function getSearchIndexHealth() {
  const db = getDb();
  const typesense = await getTypesenseSearchHealth();

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
      typesense,
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
    typesense,
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
