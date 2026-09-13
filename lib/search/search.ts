import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { count, sql } from "drizzle-orm";

import { landingPages } from "@/lib/data/landing-pages";
import { studyAbroadGuides } from "@/lib/data/study-abroad-guides";
import type {
  SearchDocument,
  SearchFilters,
  SearchResult,
} from "@/lib/data/types";
import { getDb } from "@/lib/db/server";
import { buildSearchDocuments } from "@/lib/search/documents";
import {
  analyzeSearchQuery,
  buildBm25SearchQuery,
  buildSearchTextCoverageSql,
  getTypeRank,
  MAX_PROGRAMS_PER_UNIVERSITY,
  type RankableSearchResult,
  rerankSearchResults,
  toRankableSearchResult,
} from "@/lib/search/ranking";

const globalSearchLoggingState = globalThis as typeof globalThis & {
  __searchWarningKeys?: Set<string>;
};

function getSearchWarningKeys() {
  globalSearchLoggingState.__searchWarningKeys ??= new Set<string>();
  return globalSearchLoggingState.__searchWarningKeys;
}

function getCompactErrorDetails(error: unknown) {
  const cause = error && typeof error === "object" && "cause" in error
    ? (error as { cause?: unknown }).cause
    : null;
  const source = cause instanceof Error ? cause : error;
  const rawMessage = source instanceof Error ? source.message : String(source);
  const code =
    source && typeof source === "object" && "code" in source
      ? String((source as { code?: unknown }).code)
      : undefined;

  return {
    code,
    error: rawMessage.split("\n")[0] ?? rawMessage,
  };
}

function warnSearchOnce(key: string, message: string, error: unknown) {
  const warningKeys = getSearchWarningKeys();
  const details = getCompactErrorDetails(error);
  const warningKey = `${key}:${details.code ?? ""}:${details.error}`;

  if (process.env.NODE_ENV !== "production" && warningKeys.has(warningKey)) {
    return;
  }

  warningKeys.add(warningKey);
  console.warn(`[search] ${message}`, JSON.stringify(details));
}

function matchesStaticFilters(document: SearchDocument, filters: SearchFilters) {
  if (filters.type && document.documentType !== filters.type) {
    return false;
  }

  if (filters.country && document.countrySlug !== filters.country) {
    return false;
  }

  if (filters.course && document.courseSlug !== filters.course) {
    return false;
  }

  return true;
}

function scoreInMemoryDocument(document: SearchDocument, q?: string) {
  if (!q) {
    return document.featured ? 4 : 1;
  }

  const query = q.trim().toLowerCase();
  const title = document.title.toLowerCase();
  const subtitle = document.subtitle?.toLowerCase() ?? "";
  const haystack = `${title} ${subtitle} ${document.searchText.toLowerCase()}`;

  let score = 0;

  if (title === query) {
    score += 30;
  }

  if (title.startsWith(query)) {
    score += 18;
  }

  if (subtitle.startsWith(query)) {
    score += 6;
  }

  const tokens = query.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    if (title.includes(token)) {
      score += 8;
    } else if (haystack.includes(token)) {
      score += 3;
    }
  }

  if (document.featured) {
    score += 1.5;
  }

  score += Math.max(0, 4 - getTypeRank(document.documentType)) * 0.2;

  return score;
}

async function searchInMemory(
  filters: SearchFilters,
  limit: number
): Promise<SearchResult[]> {
  const documents = getCachedSearchDocuments();

  const results = documents
    .filter((document) => matchesStaticFilters(document, filters))
    .filter((document) => {
      if (!filters.q) {
        return true;
      }

      return scoreInMemoryDocument(document, filters.q) > 0;
    })
    .map((document, index) => ({
      id: index + 1,
      ...document,
      score: scoreInMemoryDocument(document, filters.q),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (right.featured !== left.featured) {
        return Number(right.featured) - Number(left.featured);
      }

      if (getTypeRank(left.documentType) !== getTypeRank(right.documentType)) {
        return getTypeRank(left.documentType) - getTypeRank(right.documentType);
      }

      return left.title.localeCompare(right.title);
    })
    .slice(0, Math.max(limit * 3, 48));

  return rerankSearchResults(
    results.map((result) => toRankableSearchResult(result, filters.q)),
    filters.q,
    limit,
  );
}

/**
 * In-process memo for the static fallback search documents.
 *
 * These are built entirely from module constants already resident in the bundle
 * (landing-pages.ts and study-abroad-guides.ts, ~570 KB of source between them).
 * Routing them through the remote cache meant writing that payload and reading
 * it back over the network to reproduce data the process already held — origin
 * transfer and serialisation cost for no benefit.
 *
 * A module-level memo is the correct cache here: Fluid reuses instances across
 * requests, so this is computed at most once per warm instance, with no network
 * hop and nothing to invalidate (the inputs only change on deploy, which
 * replaces the instance anyway).
 */
let staticSearchDocumentsMemo: SearchDocument[] | undefined;

function getCachedSearchDocuments(): SearchDocument[] {
  staticSearchDocumentsMemo ??= buildSearchDocuments({
    countries: [],
    courses: [],
    universities: [],
    programOfferings: [],
    indiaColleges: [],
    landingPages,
    studyAbroadGuides: Object.values(studyAbroadGuides).map((guide) => guide.page),
    blogPosts: [],
  });

  return staticSearchDocumentsMemo;
}

type SearchCatalogResultSet = {
  results: SearchResult[];
  generatedAtMs: number;
};

function getMonotonicTimeMs() {
  return Number(process.hrtime.bigint() / BigInt(1_000_000));
}

async function hasSearchBm25Index() {
  "use cache: remote";

  cacheLife("catalog");
  cacheTag("search");

  const db = getDb();

  if (!db) {
    return false;
  }

  try {
    const rows = await db
      .select({ value: count() })
      .from(sql`pg_indexes`)
      .where(sql`schemaname = 'public' AND indexname = 'search_documents_bm25_idx'`);

    return (rows[0]?.value ?? 0) > 0;
  } catch {
    return false;
  }
}

async function executeSearchCatalog(
  filters: SearchFilters,
  limit = 24
): Promise<SearchResult[]> {
  const db = getDb();

  if (!db) {
    return searchInMemory(filters, limit);
  }

  const conditions = [sql`1 = 1`];

  if (filters.type) {
    conditions.push(sql`document_type = ${filters.type}`);
  }

  if (filters.country) {
    conditions.push(sql`country_slug = ${filters.country}`);
  }

  if (filters.course) {
    conditions.push(sql`course_slug = ${filters.course}`);
  }

  try {
    if (filters.q) {
      const query = filters.q.trim();
      const candidateLimit = Math.max(limit * 3, 48);
      const bm25MatchPoolSize = 200;
      const analysis = analyzeSearchQuery(query);
      const countryHubName = analysis.coreTerms.join(" ");
      const canUseBm25 = await hasSearchBm25Index();
      const exactMatchBoost = sql`
        CASE
          WHEN lower(title) = lower(${query}) THEN 12
          WHEN lower(title) LIKE lower(${query}) || '%' THEN 5
          -- A query that is exactly a country name should reach the candidate
          -- pool with its hub; the rerank then puts the hub first.
          WHEN document_type = 'country'
            AND replace(country_slug, '-', ' ') IN (${countryHubName}, ${analysis.normalized}) THEN 12
          ELSE 0
        END
      `;
      const businessBoost = sql`
        CASE WHEN featured THEN 0.5 ELSE 0 END
        + CASE document_type
            WHEN 'university' THEN 0.9
            WHEN 'india_college' THEN 0.85
            WHEN 'program' THEN 0.6
            WHEN 'landing_page' THEN 0.1
            ELSE 0
          END
      `;
      const typeRank = sql`
        CASE document_type
          WHEN 'university' THEN 0
            WHEN 'india_college' THEN 1
            WHEN 'program' THEN 2
            WHEN 'landing_page' THEN 3
            WHEN 'blog_post' THEN 4
            WHEN 'country' THEN 5
            WHEN 'course' THEN 6
            ELSE 7
        END
      `;

      if (canUseBm25 && analysis.coreTerms.length) {
        // A single statement: typo-tolerant BM25 matching (see
        // buildBm25SearchQuery), per-type candidate caps so long blog posts or
        // one university's programme catalogue cannot fill the candidate pool,
        // then a primary-key join so wide display columns are read only for
        // the returned candidates. The matched pool is bounded with a top-N
        // sort first: partitioning every match for the window functions made
        // Postgres start parallel workers, which cost ~10ms per search.
        const bm25Results = await db.execute<RankableSearchResult>(sql`
          WITH matched AS (
            SELECT
              id,
              document_type,
              university_slug,
              featured,
              title,
              (coalesce(paradedb.score(id), 0) + ${exactMatchBoost} + ${businessBoost})::float AS score
            FROM search_documents
            WHERE ${sql.join(
              [...conditions, sql`id @@@ ${buildBm25SearchQuery(analysis)}`],
              sql` AND `
            )}
            ORDER BY score DESC, id
            LIMIT ${bm25MatchPoolSize}
          ),
          ranked AS (
            SELECT
              id,
              document_type,
              featured,
              title,
              score,
              row_number() OVER (PARTITION BY document_type ORDER BY score DESC, id) AS type_position,
              row_number() OVER (
                PARTITION BY document_type, university_slug
                ORDER BY score DESC, id
              ) AS university_position
            FROM matched
          ),
          candidates AS (
            SELECT id, score, featured, title, ${typeRank} AS type_rank
            FROM ranked
            WHERE type_position <= ${limit}
              AND (
                document_type <> 'program'
                OR university_position <= ${MAX_PROGRAMS_PER_UNIVERSITY}
              )
            ORDER BY score DESC, featured DESC, type_rank, title ASC
            LIMIT ${candidateLimit}
          )
          SELECT
            documents.id,
            documents.document_type AS "documentType",
            documents.source_slug AS "sourceSlug",
            documents.path,
            documents.title,
            documents.subtitle,
            documents.summary,
            documents.highlights,
            documents.country_slug AS "countrySlug",
            documents.course_slug AS "courseSlug",
            documents.university_slug AS "universitySlug",
            documents.city,
            documents.featured,
            documents.annual_tuition_usd AS "annualTuitionUsd",
            documents.medium,
            documents.intake_months AS "intakeMonths",
            length(documents.search_text) AS "searchTextLength",
            ${buildSearchTextCoverageSql(sql`lowered.search_text`, analysis.coreTerms)} AS "searchTextCoverage",
            candidates.score
          FROM candidates
          INNER JOIN search_documents AS documents ON documents.id = candidates.id
          -- search_text stays in the database: only its length and term
          -- coverage are returned. OFFSET 0 stops the planner flattening the
          -- subquery, so lower() runs once per row rather than once per term.
          CROSS JOIN LATERAL (
            SELECT lower(documents.search_text) AS search_text OFFSET 0
          ) AS lowered
          ORDER BY candidates.score DESC, candidates.featured DESC, candidates.type_rank, candidates.title ASC
        `);

        if (bm25Results.rows.length) {
          return rerankSearchResults(bm25Results.rows, filters.q, limit);
        }
      }

      const trigramResults = await db.execute<RankableSearchResult>(sql`
        SELECT
          id,
          document_type AS "documentType",
          source_slug AS "sourceSlug",
          path,
          title,
          subtitle,
          summary,
          highlights,
          country_slug AS "countrySlug",
          course_slug AS "courseSlug",
          university_slug AS "universitySlug",
          city,
          featured,
          annual_tuition_usd AS "annualTuitionUsd",
          medium,
          intake_months AS "intakeMonths",
          length(search_text) AS "searchTextLength",
          ${buildSearchTextCoverageSql(sql`lower(search_text)`, analysis.coreTerms)} AS "searchTextCoverage",
          (
            similarity(title, ${query})
            + CASE
                WHEN lower(title) LIKE lower(${query}) || '%' THEN 2
                WHEN lower(subtitle) LIKE lower(${query}) || '%' THEN 1
                ELSE 0
              END
            + ${businessBoost}
          )::float AS score
        FROM search_documents
        WHERE ${sql.join(
          [
            ...conditions,
            sql`(
              similarity(title, ${query}) > 0.15
              OR lower(title) LIKE lower(${query}) || '%'
              OR lower(coalesce(subtitle, '')) LIKE lower(${query}) || '%'
            )`,
          ],
          sql` AND `
        )}
        ORDER BY score DESC, featured DESC, title ASC
        LIMIT ${candidateLimit}
      `);

      return rerankSearchResults(trigramResults.rows, filters.q, limit);
    }

    const browseResults = await db.execute<SearchResult>(sql`
      SELECT
        id,
        document_type AS "documentType",
        source_slug AS "sourceSlug",
        path,
        title,
        subtitle,
        summary,
        highlights,
        country_slug AS "countrySlug",
        course_slug AS "courseSlug",
        university_slug AS "universitySlug",
        city,
        featured,
        annual_tuition_usd AS "annualTuitionUsd",
        medium,
        intake_months AS "intakeMonths",
        0::float AS score
      FROM search_documents
      WHERE ${sql.join(conditions, sql` AND `)}
      ORDER BY
        featured DESC,
        CASE document_type
          WHEN 'university' THEN 0
          WHEN 'india_college' THEN 1
          WHEN 'program' THEN 2
          WHEN 'landing_page' THEN 3
          WHEN 'blog_post' THEN 4
          WHEN 'country' THEN 5
          WHEN 'course' THEN 6
          ELSE 7
        END,
        title ASC
      LIMIT ${limit}
    `);

    // Facet browse has no query to rank by: SQL already orders and limits it.
    return browseResults.rows;
  } catch (error) {
    warnSearchOnce(
      "database-fallback",
      "Database search failed; using in-memory fallback.",
      error,
    );

    return searchInMemory(filters, limit);
  }
}

/**
 * Collapses filter values that differ only in case or whitespace.
 *
 * `use cache` derives its key from the arguments, so "MBBS", "mbbs" and
 * "mbbs  abroad" would otherwise mint three separate cache entries despite
 * matching identically (Postgres search is case-insensitive). Every distinct
 * key is a cache write, and search terms are unbounded user input, so
 * normalising here is a direct reduction in write volume for zero change in
 * results.
 */
function normalizeSearchFilters(filters: SearchFilters): SearchFilters {
  const normalizeValue = (value: string | undefined) => {
    if (!value) return undefined;
    const collapsed = value.trim().replace(/\s+/g, " ").toLowerCase();
    return collapsed || undefined;
  };

  return {
    ...filters,
    q: normalizeValue(filters.q),
    country: normalizeValue(filters.country),
    course: normalizeValue(filters.course),
  };
}

async function cachedSearchCatalogResultSet(
  filters: SearchFilters,
  limit: number
): Promise<SearchCatalogResultSet> {
  "use cache: remote";

  cacheLife("catalog");
  cacheTag("catalog");
  cacheTag("search");
  cacheTag("india-colleges");

  return {
    results: await executeSearchCatalog(filters, limit),
    generatedAtMs: getMonotonicTimeMs(),
  };
}

export async function searchCatalogResultSet(
  filters: SearchFilters,
  limit = 24
): Promise<SearchCatalogResultSet> {
  // Normalise before the cache boundary so the key space stays as small as the
  // result space. Doing this inside the cached function would be too late — the
  // raw arguments would already have formed the key.
  const normalized = normalizeSearchFilters(filters);

  // Free-text search is unbounded user input. Normalising collapses case and
  // whitespace variants but cannot bound the key space, so every novel phrase
  // still mints an entry that is written once and never read again — the same
  // pattern that made cache writes exceed reads across this project.
  //
  // Search runs directly against the indexed search_documents table (see
  // executeSearchCatalog), so skipping the incremental cache costs little and
  // removes the unbounded writes. Facet-only requests (no `q`) are a small,
  // reusable key space and stay cached.
  if (normalized.q) {
    return {
      results: await executeSearchCatalog(normalized, limit),
      generatedAtMs: getMonotonicTimeMs(),
    };
  }

  return cachedSearchCatalogResultSet(normalized, limit);
}

export async function searchCatalog(
  filters: SearchFilters,
  limit = 24
): Promise<SearchResult[]> {
  const resultSet = await searchCatalogResultSet(filters, limit);

  return resultSet.results;
}
