import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { sql } from "drizzle-orm";

import { landingPages } from "@/lib/data/landing-pages";
import { getCatalogSnapshot } from "@/lib/data/catalog";
import type {
  SearchDocument,
  SearchDocumentType,
  SearchFilters,
  SearchResult,
} from "@/lib/data/types";
import { getDb } from "@/lib/db/server";
import { buildSearchDocuments } from "@/lib/search/documents";

function getTypeRank(documentType: SearchDocumentType) {
  switch (documentType) {
    case "university":
      return 0;
    case "india_college":
      return 1;
    case "program":
      return 2;
    case "landing_page":
      return 3;
    case "country":
      return 4;
    case "course":
      return 5;
    default:
      return 6;
  }
}

function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTokenCoverage(tokens: string[], haystack: string) {
  if (!tokens.length) {
    return 0;
  }

  let matched = 0;

  for (const token of tokens) {
    if (haystack.includes(token)) {
      matched += 1;
    }
  }

  return matched / tokens.length;
}

function getSearchSignals(result: SearchResult, query: string) {
  const normalizedQuery = normalizeSearchValue(query);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const normalizedTitle = normalizeSearchValue(result.title);
  const normalizedSubtitle = normalizeSearchValue(result.subtitle ?? "");
  const normalizedSearchText = normalizeSearchValue(result.searchText);

  const titleExact = normalizedTitle === normalizedQuery;
  const titleStartsWith =
    normalizedQuery.length > 0 && normalizedTitle.startsWith(normalizedQuery);
  const titleContains =
    normalizedQuery.length > 0 && normalizedTitle.includes(normalizedQuery);
  const subtitleContains =
    normalizedQuery.length > 0 && normalizedSubtitle.includes(normalizedQuery);

  const titleCoverage = getTokenCoverage(tokens, normalizedTitle);
  const subtitleCoverage = getTokenCoverage(tokens, normalizedSubtitle);
  const searchCoverage = getTokenCoverage(tokens, normalizedSearchText);

  let directTitleTier = 0;
  let boost = 0;

  if (titleExact) {
    directTitleTier = 4;
    boost += 80;
  } else if (titleStartsWith) {
    directTitleTier = 3;
    boost += 55;
  } else if (titleContains) {
    directTitleTier = 3;
    boost += 42;
  } else if (subtitleContains) {
    directTitleTier = 2;
    boost += 18;
  }

  if (titleCoverage === 1) {
    directTitleTier = Math.max(directTitleTier, 2);
    boost += 18;
  } else if (titleCoverage >= 0.75) {
    boost += 8;
  }

  if (subtitleCoverage === 1) {
    boost += 6;
  }

  if (searchCoverage === 1) {
    boost += 4;
  }

  switch (result.documentType) {
    case "university":
      if (directTitleTier >= 2 || titleCoverage >= 0.75) {
        boost += 12;
      }
      break;
    case "india_college":
      if (directTitleTier >= 2 || titleCoverage >= 0.75) {
        boost += 11;
      }
      break;
    case "program":
      if (directTitleTier >= 2 || subtitleCoverage === 1 || titleCoverage >= 0.75) {
        boost += 10;
      }
      break;
    case "landing_page":
      if (directTitleTier === 0 && titleCoverage < 0.75) {
        boost -= 10;
      }
      break;
    case "country":
    case "course":
      if (directTitleTier === 0 && titleCoverage < 0.75) {
        boost -= 6;
      }
      break;
    default:
      break;
  }

  return {
    directTitleTier,
    titleCoverage,
    subtitleCoverage,
    searchCoverage,
    boost,
  };
}

function hasStrongTitleMatch(signals: ReturnType<typeof getSearchSignals>) {
  return signals.directTitleTier >= 3 || signals.titleCoverage === 1;
}

function rerankSearchResults(
  results: SearchResult[],
  filters: SearchFilters,
  limit: number,
) {
  if (!filters.q) {
    return results.slice(0, limit);
  }

  const rankedResults = results.map((result) => {
    const signals = getSearchSignals(result, filters.q!);

    return {
      result: {
        ...result,
        score: result.score + signals.boost,
      },
      signals,
    };
  });

  const hasStrongDirectMatch = rankedResults.some(
    (entry) => entry.signals.directTitleTier >= 3,
  );
  const hasStrongEntityTitleMatch = rankedResults.some(
    (entry) =>
      (entry.result.documentType === "university" ||
        entry.result.documentType === "india_college" ||
        entry.result.documentType === "program") &&
      hasStrongTitleMatch(entry.signals),
  );

  let filteredResults = rankedResults;

  if (hasStrongDirectMatch) {
    filteredResults = filteredResults.filter(
      (entry) =>
        entry.signals.directTitleTier >= 1 ||
        entry.signals.titleCoverage >= 0.75 ||
        entry.signals.searchCoverage === 1,
    );
  }

  if (hasStrongEntityTitleMatch) {
    filteredResults = filteredResults.filter((entry) => {
      switch (entry.result.documentType) {
        case "university":
        case "india_college":
          return (
            entry.signals.directTitleTier >= 2 ||
            entry.signals.titleCoverage >= 0.75
          );
        case "program":
          return (
            entry.signals.directTitleTier >= 2 ||
            entry.signals.titleCoverage >= 0.75 ||
            entry.signals.subtitleCoverage >= 0.75
          );
        case "landing_page":
        case "country":
        case "course":
          return (
            entry.signals.directTitleTier >= 2 ||
            entry.signals.titleCoverage === 1
          );
        default:
          return true;
      }
    });
  }

  return filteredResults
    .sort((left, right) => {
      if (right.result.score !== left.result.score) {
        return right.result.score - left.result.score;
      }

      if (right.signals.directTitleTier !== left.signals.directTitleTier) {
        return right.signals.directTitleTier - left.signals.directTitleTier;
      }

      if (right.result.featured !== left.result.featured) {
        return Number(right.result.featured) - Number(left.result.featured);
      }

      if (
        getTypeRank(left.result.documentType) !==
        getTypeRank(right.result.documentType)
      ) {
        return (
          getTypeRank(left.result.documentType) -
          getTypeRank(right.result.documentType)
        );
      }

      return left.result.title.localeCompare(right.result.title);
    })
    .slice(0, limit)
    .map((entry) => entry.result);
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
  const documents = await getCachedSearchDocuments();

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

  return rerankSearchResults(results, filters, limit);
}

async function getCachedSearchDocuments(): Promise<SearchDocument[]> {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("search");
  cacheTag("india-colleges");

  const snapshot = await getCatalogSnapshot();

  return buildSearchDocuments({
    ...snapshot,
    landingPages,
  });
}

export async function searchCatalog(
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
      const fuzzyDistance = query.length >= 10 ? 2 : 1;
      const exactMatchBoost = sql`
        CASE
          WHEN lower(title) = lower(${query}) THEN 12
          WHEN lower(title) LIKE lower(${query}) || '%' THEN 5
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
          WHEN 'country' THEN 4
          WHEN 'course' THEN 5
          ELSE 6
        END
      `;

      const bm25Results = await db.execute<SearchResult>(sql`
        SELECT
          id,
          document_type AS "documentType",
          source_slug AS "sourceSlug",
          path,
          title,
          subtitle,
          summary,
          search_text AS "searchText",
          highlights,
          country_slug AS "countrySlug",
          course_slug AS "courseSlug",
          university_slug AS "universitySlug",
          city,
          featured,
          annual_tuition_usd AS "annualTuitionUsd",
          medium,
          intake_months AS "intakeMonths",
          (coalesce(paradedb.score(id), 0) + ${exactMatchBoost} + ${businessBoost})::float AS score
        FROM search_documents
        WHERE ${sql.join(
          [
            ...conditions,
            sql`id @@@ paradedb.disjunction_max(
              ARRAY[
                paradedb.match('title', ${query}, conjunction_mode => true),
                paradedb.match('subtitle', ${query}, conjunction_mode => true),
                paradedb.match('summary', ${query}, conjunction_mode => true),
                paradedb.match('search_text', ${query}, conjunction_mode => true)
              ],
              tie_breaker => 0.15
            )`,
          ],
          sql` AND `
        )}
        ORDER BY score DESC, featured DESC, ${typeRank}, title ASC
        LIMIT ${candidateLimit}
      `);

      if (bm25Results.rows.length) {
        return rerankSearchResults(bm25Results.rows, filters, limit);
      }

      const fuzzyResults = await db.execute<SearchResult>(sql`
        SELECT
          id,
          document_type AS "documentType",
          source_slug AS "sourceSlug",
          path,
          title,
          subtitle,
          summary,
          search_text AS "searchText",
          highlights,
          country_slug AS "countrySlug",
          course_slug AS "courseSlug",
          university_slug AS "universitySlug",
          city,
          featured,
          annual_tuition_usd AS "annualTuitionUsd",
          medium,
          intake_months AS "intakeMonths",
          (coalesce(paradedb.score(id), 0) + (${exactMatchBoost} * 0.25) + ${businessBoost})::float AS score
        FROM search_documents
        WHERE ${sql.join(
          [
            ...conditions,
            sql`id @@@ paradedb.disjunction_max(
              ARRAY[
                paradedb.match('title', ${query}, distance => ${fuzzyDistance}, conjunction_mode => true),
                paradedb.match('subtitle', ${query}, distance => ${fuzzyDistance}, conjunction_mode => true),
                paradedb.match('summary', ${query}, distance => ${fuzzyDistance}, conjunction_mode => true),
                paradedb.match('search_text', ${query}, distance => ${fuzzyDistance}, conjunction_mode => true)
              ],
              tie_breaker => 0.1
            )`,
          ],
          sql` AND `
        )}
        ORDER BY score DESC, featured DESC, ${typeRank}, title ASC
        LIMIT ${candidateLimit}
      `);

      if (fuzzyResults.rows.length) {
        return rerankSearchResults(fuzzyResults.rows, filters, limit);
      }

      const trigramResults = await db.execute<SearchResult>(sql`
        SELECT
          id,
          document_type AS "documentType",
          source_slug AS "sourceSlug",
          path,
          title,
          subtitle,
          summary,
          search_text AS "searchText",
          highlights,
          country_slug AS "countrySlug",
          course_slug AS "courseSlug",
          university_slug AS "universitySlug",
          city,
          featured,
          annual_tuition_usd AS "annualTuitionUsd",
          medium,
          intake_months AS "intakeMonths",
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

      return rerankSearchResults(trigramResults.rows, filters, limit);
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
        search_text AS "searchText",
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
          WHEN 'country' THEN 4
          WHEN 'course' THEN 5
          ELSE 6
        END,
        title ASC
      LIMIT ${limit}
    `);

    return rerankSearchResults(browseResults.rows, filters, limit);
  } catch (error) {
    console.warn(
      "Falling back to in-memory search because the database search layer is not ready.",
      error
    );

    return searchInMemory(filters, limit);
  }
}
