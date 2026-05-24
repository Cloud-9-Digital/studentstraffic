import "dotenv/config";

import { Pool, neonConfig } from "@neondatabase/serverless";
import { WebSocket } from "ws";

import { env } from "@/lib/env";
import type { SearchDocument } from "@/lib/data/types";
import {
  ensureTypesenseSearchCollection,
  importTypesenseSearchDocuments,
} from "@/lib/search/typesense";

neonConfig.webSocketConstructor = WebSocket;

type SearchDocumentRow = {
  document_type: SearchDocument["documentType"];
  source_slug: string;
  path: string;
  title: string;
  subtitle: string | null;
  summary: string;
  search_text: string;
  highlights: string[] | null;
  country_slug: string | null;
  course_slug: string | null;
  university_slug: string | null;
  city: string | null;
  featured: boolean;
  annual_tuition_usd: number | null;
  medium: string | null;
  intake_months: string[] | null;
};

function mapRow(row: SearchDocumentRow): SearchDocument {
  return {
    documentType: row.document_type,
    sourceSlug: row.source_slug,
    path: row.path,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    summary: row.summary,
    searchText: row.search_text,
    highlights: row.highlights ?? [],
    countrySlug: row.country_slug ?? undefined,
    courseSlug: row.course_slug ?? undefined,
    universitySlug: row.university_slug ?? undefined,
    city: row.city ?? undefined,
    featured: row.featured,
    annualTuitionUsd: row.annual_tuition_usd ?? undefined,
    medium: row.medium ?? undefined,
    intakeMonths: row.intake_months ?? [],
  };
}

async function main() {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  if (!env.hasTypesenseAdmin) {
    throw new Error(
      "Typesense admin env is missing. Set TYPESENSE_HOST and TYPESENSE_API_KEY.",
    );
  }

  const pool = new Pool({ connectionString: env.databaseUrl });
  const client = await pool.connect();

  try {
    const { rows } = await client.query<SearchDocumentRow>(`
      SELECT
        document_type,
        source_slug,
        path,
        title,
        subtitle,
        summary,
        search_text,
        highlights,
        country_slug,
        course_slug,
        university_slug,
        city,
        featured,
        annual_tuition_usd,
        medium,
        intake_months
      FROM search_documents
      ORDER BY document_type, source_slug
    `);
    const documents = rows.map(mapRow);

    await ensureTypesenseSearchCollection();
    const result = await importTypesenseSearchDocuments(documents);

    console.log(
      `Typesense search sync complete. Imported ${result.imported} documents.`,
    );
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
