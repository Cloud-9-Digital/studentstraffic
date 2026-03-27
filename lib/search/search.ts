import "server-only";

import { sql } from "drizzle-orm";

import { landingPages } from "@/lib/data/demo-dataset";
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
    case "program":
      return 0;
    case "university":
      return 1;
    case "landing_page":
      return 2;
    case "country":
      return 3;
    case "course":
      return 4;
    default:
      return 5;
  }
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
  const snapshot = await getCatalogSnapshot();
  const documents = buildSearchDocuments({
    ...snapshot,
    landingPages,
  });

  return documents
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
    .slice(0, limit);
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
      const fuzzyDistance = query.length >= 10 ? 2 : 1;
      const exactMatchBoost = sql`
        CASE
          WHEN lower(title) = lower(${query}) THEN 12
          WHEN lower(title) LIKE lower(${query}) || '%' THEN 5
          ELSE 0
        END
      `;
      const businessBoost = sql`
        CASE WHEN featured THEN 0.75 ELSE 0 END
        + CASE document_type
            WHEN 'landing_page' THEN 0.8
            WHEN 'university' THEN 0.2
            WHEN 'program' THEN 0.1
            ELSE 0
          END
      `;
      const typeRank = sql`
        CASE document_type
          WHEN 'program' THEN 0
          WHEN 'university' THEN 1
          WHEN 'landing_page' THEN 2
          WHEN 'country' THEN 3
          WHEN 'course' THEN 4
          ELSE 5
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
                paradedb.match('summary', ${query}),
                paradedb.match('search_text', ${query})
              ],
              tie_breaker => 0.15
            )`,
          ],
          sql` AND `
        )}
        ORDER BY score DESC, featured DESC, ${typeRank}, title ASC
        LIMIT ${limit}
      `);

      if (bm25Results.rows.length) {
        return bm25Results.rows;
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
                paradedb.match('subtitle', ${query}, distance => ${fuzzyDistance}),
                paradedb.match('summary', ${query}, distance => ${fuzzyDistance}),
                paradedb.match('search_text', ${query}, distance => ${fuzzyDistance})
              ],
              tie_breaker => 0.1
            )`,
          ],
          sql` AND `
        )}
        ORDER BY score DESC, featured DESC, ${typeRank}, title ASC
        LIMIT ${limit}
      `);

      if (fuzzyResults.rows.length) {
        return fuzzyResults.rows;
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
        LIMIT ${limit}
      `);

      return trigramResults.rows;
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
          WHEN 'program' THEN 0
          WHEN 'university' THEN 1
          WHEN 'landing_page' THEN 2
          WHEN 'country' THEN 3
          WHEN 'course' THEN 4
          ELSE 5
        END,
        title ASC
      LIMIT ${limit}
    `);

    return browseResults.rows;
  } catch (error) {
    console.warn(
      "Falling back to in-memory search because the database search layer is not ready.",
      error
    );

    return searchInMemory(filters, limit);
  }
}
