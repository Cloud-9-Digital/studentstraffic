import { env } from "@/lib/env";
import type {
  SearchDocument,
  SearchFilters,
  SearchResult,
} from "@/lib/data/types";

type TypesenseFieldType =
  | "string"
  | "string[]"
  | "int32"
  | "float"
  | "bool";

type TypesenseCollectionSchema = {
  name: string;
  fields: Array<{
    name: string;
    type: TypesenseFieldType;
    optional?: boolean;
    facet?: boolean;
    sort?: boolean;
  }>;
  default_sorting_field?: string;
};

type TypesenseSearchHit = {
  document: TypesenseSearchDocument;
  text_match?: number;
  text_match_info?: {
    score?: string;
  };
};

type TypesenseSearchResponse = {
  hits?: TypesenseSearchHit[];
  found?: number;
};

type TypesenseCollectionInfo = {
  name: string;
  num_documents?: number;
};

export type TypesenseSearchDocument = SearchDocument & {
  id: string;
  scoreBoost: number;
};

const SEARCH_TIMEOUT_MS = 2_000;
const ADMIN_TIMEOUT_MS = 15_000;

export const typesenseSearchSchema: TypesenseCollectionSchema = {
  name: env.typesenseCollection,
  fields: [
    { name: "documentType", type: "string", facet: true },
    { name: "sourceSlug", type: "string" },
    { name: "path", type: "string" },
    { name: "title", type: "string", sort: true },
    { name: "subtitle", type: "string", optional: true },
    { name: "summary", type: "string" },
    { name: "searchText", type: "string" },
    { name: "highlights", type: "string[]", optional: true },
    { name: "countrySlug", type: "string", optional: true, facet: true },
    { name: "courseSlug", type: "string", optional: true, facet: true },
    { name: "universitySlug", type: "string", optional: true, facet: true },
    { name: "city", type: "string", optional: true, facet: true },
    { name: "featured", type: "bool", facet: true },
    { name: "annualTuitionUsd", type: "int32", optional: true, sort: true },
    { name: "medium", type: "string", optional: true, facet: true },
    { name: "intakeMonths", type: "string[]", optional: true, facet: true },
    { name: "scoreBoost", type: "int32", sort: true },
  ],
  default_sorting_field: "scoreBoost",
};

function getTypesenseUrl(path: string) {
  if (!env.typesenseHost) {
    throw new Error("TYPESENSE_HOST is not configured.");
  }

  const baseUrl = env.typesenseHost.replace(/\/+$/, "");

  return `${baseUrl}${path}`;
}

function getTypesenseKey(admin = false) {
  if (admin) {
    return env.typesenseApiKey;
  }

  return env.typesenseSearchApiKey ?? env.typesenseApiKey;
}

function buildFilterBy(filters: SearchFilters) {
  const clauses: string[] = [];
  const quote = (value: string) => `\`${value.replace(/`/g, "\\`")}\``;

  if (filters.type) {
    clauses.push(`documentType:=${quote(filters.type)}`);
  }

  if (filters.country) {
    clauses.push(`countrySlug:=${quote(filters.country)}`);
  }

  if (filters.course) {
    clauses.push(`courseSlug:=${quote(filters.course)}`);
  }

  return clauses.join(" && ");
}

function scoreBoostFor(document: SearchDocument) {
  const typeBoost =
    document.documentType === "university"
      ? 60
      : document.documentType === "india_college"
        ? 55
        : document.documentType === "program"
          ? 45
          : document.documentType === "landing_page"
            ? 35
            : 20;

  return typeBoost + (document.featured ? 10 : 0);
}

function toTypesenseDocument(document: SearchDocument): TypesenseSearchDocument {
  return {
    id: `${document.documentType}:${document.sourceSlug}`,
    ...document,
    scoreBoost: scoreBoostFor(document),
  };
}

function toSearchResult(hit: TypesenseSearchHit, index: number): SearchResult {
  const document = { ...hit.document };
  delete (document as Partial<TypesenseSearchDocument>).id;
  delete (document as Partial<TypesenseSearchDocument>).scoreBoost;
  const rawScore = hit.text_match ?? Number(hit.text_match_info?.score ?? 0);

  return {
    id: index + 1,
    ...(document as SearchDocument),
    score: rawScore + hit.document.scoreBoost,
  };
}

async function typesenseFetch(
  path: string,
  init: RequestInit = {},
  options: { admin?: boolean; timeoutMs?: number } = {},
) {
  const apiKey = getTypesenseKey(options.admin);

  if (!apiKey) {
    throw new Error("Typesense API key is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? SEARCH_TIMEOUT_MS,
  );

  try {
    return await fetch(getTypesenseUrl(path), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-TYPESENSE-API-KEY": apiKey,
        ...init.headers,
      },
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function searchTypesenseCatalog(
  filters: SearchFilters,
  limit: number,
): Promise<SearchResult[] | null> {
  if (!env.hasTypesenseSearch || !filters.q) {
    return null;
  }

  const params = new URLSearchParams({
    q: filters.q,
    query_by: "title,subtitle,summary,searchText",
    query_by_weights: "5,3,2,1",
    per_page: String(limit),
    sort_by: "_text_match:desc,scoreBoost:desc,title:asc",
    typo_tokens_threshold: "1",
  });
  const filterBy = buildFilterBy(filters);

  if (filterBy) {
    params.set("filter_by", filterBy);
  }

  const response = await typesenseFetch(
    `/collections/${encodeURIComponent(env.typesenseCollection)}/documents/search?${params.toString()}`,
    {},
    { timeoutMs: SEARCH_TIMEOUT_MS },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Typesense search failed with ${response.status}: ${text.slice(0, 500)}`,
    );
  }

  const payload = (await response.json()) as TypesenseSearchResponse;

  return (payload.hits ?? []).map(toSearchResult);
}

export async function ensureTypesenseSearchCollection() {
  if (!env.hasTypesenseAdmin) {
    throw new Error("Typesense admin configuration is missing.");
  }

  const collectionPath = `/collections/${encodeURIComponent(env.typesenseCollection)}`;
  const existing = await typesenseFetch(collectionPath, {}, {
    admin: true,
    timeoutMs: ADMIN_TIMEOUT_MS,
  });

  if (existing.ok) {
    return;
  }

  if (existing.status !== 404) {
    const text = await existing.text();
    throw new Error(
      `Typesense collection check failed with ${existing.status}: ${text.slice(0, 500)}`,
    );
  }

  const created = await typesenseFetch(
    "/collections",
    {
      method: "POST",
      body: JSON.stringify(typesenseSearchSchema),
    },
    { admin: true, timeoutMs: ADMIN_TIMEOUT_MS },
  );

  if (!created.ok) {
    const text = await created.text();
    throw new Error(
      `Typesense collection create failed with ${created.status}: ${text.slice(0, 500)}`,
    );
  }
}

export async function getTypesenseSearchHealth() {
  if (!env.hasTypesenseSearch) {
    return {
      configured: false,
      reachable: false,
      documentCount: null,
      error: null,
    };
  }

  try {
    const response = await typesenseFetch(
      `/collections/${encodeURIComponent(env.typesenseCollection)}`,
      {},
      { timeoutMs: SEARCH_TIMEOUT_MS },
    );

    if (!response.ok) {
      const text = await response.text();

      return {
        configured: true,
        reachable: false,
        documentCount: null,
        error: `Typesense returned ${response.status}: ${text.slice(0, 200)}`,
      };
    }

    const info = (await response.json()) as TypesenseCollectionInfo;

    return {
      configured: true,
      reachable: true,
      documentCount: info.num_documents ?? null,
      error: null,
    };
  } catch (error) {
    return {
      configured: true,
      reachable: false,
      documentCount: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function importTypesenseSearchDocuments(
  documents: SearchDocument[],
) {
  if (!env.hasTypesenseAdmin) {
    throw new Error("Typesense admin configuration is missing.");
  }

  const body = documents
    .map(toTypesenseDocument)
    .map((document) => JSON.stringify(document))
    .join("\n");
  const response = await typesenseFetch(
    `/collections/${encodeURIComponent(env.typesenseCollection)}/documents/import?action=upsert`,
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body,
    },
    { admin: true, timeoutMs: ADMIN_TIMEOUT_MS },
  );
  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Typesense import failed with ${response.status}: ${text.slice(0, 500)}`,
    );
  }

  const rows = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { success?: boolean; error?: string });
  const failed = rows.filter((row) => !row.success);

  if (failed.length) {
    throw new Error(
      `Typesense import had ${failed.length} failed rows. First error: ${
        failed[0]?.error ?? "unknown"
      }`,
    );
  }

  return {
    imported: rows.length,
  };
}
