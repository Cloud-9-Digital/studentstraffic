# Search Scaling Roadmap

The current site search uses the `search_documents` table first, with an in-memory fallback from catalog data. Results are cached with Next.js Cache Components, so repeated queries should avoid repeated database work.

## Current Stage

- Keep Postgres as the source of truth.
- Keep `search_documents` as the internal searchable index.
- Cover universities, programs, countries, courses, India colleges, root guide pages, and blog posts in the same search index.
- Cache search result sets with `use cache`, `cacheLife("hours")`, and `search` cache tags.
- Log production search latency and inferred cache hit/miss behavior from `/search`.
- No external search engine is used: `/search` runs on Postgres only (ParadeDB BM25 when `search_documents_bm25_idx` exists, otherwise pg_trgm, otherwise an in-memory fallback).

## Keeping The Index Fresh

- University publishes (`scripts/publish-university-draft.ts` and catalogue payloads applied through `scripts/publish-catalog-payload.ts`) call `refreshSearchDocumentsForUniversities` (`lib/search/university-search-documents.ts`). It upserts only those universities' `university` and `program` rows in `search_documents` and deletes their rows that are no longer published, then the publish triggers `/api/revalidate` (catalog scope), which expires the `search` cache tag.
- Country and course documents aggregate every university or programme in that country or course, so they are not refreshed per publish. Run "Rebuild Postgres index" on `/admin/search` after bulk changes or after country, course, guide or blog content changes.

The former `npm run db:seed` command was removed with the historical seed scripts. Search index
updates now belong to the approved content publish/revalidation workflow.

## Move Fully To A Dedicated Search Engine When

- Search traffic becomes a meaningful share of total traffic.
- Common search queries regularly exceed acceptable latency.
- Filters, typo tolerance, synonyms, ranking controls, or analytics become product requirements.
- The `search_documents` table grows enough that Postgres search work competes with lead capture, admin, or public page rendering.

## Candidate Engines

- Meilisearch: good developer experience and relevance tuning for moderate scale.
- Algolia: best managed option if budget allows and search analytics/conversion tuning matter.
- OpenSearch: powerful, but heavier operationally; use when search requirements become complex enough to justify it.

## Migration Shape

1. Keep Postgres as source of truth.
2. Add a background job that syncs changed catalog rows into the search engine.
3. Keep `search_documents` as a fallback until the external index is proven.
4. Switch `/search` and autocomplete APIs to the search engine behind the existing `searchCatalog` interface.
5. Keep the public UI unchanged during the migration.
