# Search Scaling Roadmap

The current site search uses the `search_documents` table first, with an in-memory fallback from catalog data. Results are cached with Next.js Cache Components, so repeated queries should avoid repeated database work.

## Current Stage

- Keep Postgres as the source of truth.
- Keep `search_documents` as the internal searchable index.
- Cover universities, programs, countries, courses, India colleges, root guide pages, and blog posts in the same search index.
- Cache search result sets with `use cache`, `cacheLife("hours")`, and `search` cache tags.
- Log production search latency and inferred cache hit/miss behavior from `/search`.
- Optionally mirror the same documents to Typesense for low-cost typo-tolerant search.

## Optional Typesense Setup

Typesense can be self-hosted for the lowest infrastructure cost, or run through a hosted provider if a free/low-cost tier fits current usage.

Required env:

- `TYPESENSE_HOST`
- `TYPESENSE_API_KEY`
- optional `TYPESENSE_SEARCH_API_KEY`
- optional `TYPESENSE_COLLECTION`

Sync command:

```bash
npm run search:sync:typesense
```

The former `npm run db:seed` command was removed with the historical seed scripts. Search index
updates now belong to the approved content publish/revalidation workflow.
`npm run search:sync:typesense` mirrors the current Postgres search index to Typesense when configured.

When Typesense env is present, `/search` tries Typesense first and falls back to Postgres automatically if Typesense is unavailable.

## Move Fully To A Dedicated Search Engine When

- Search traffic becomes a meaningful share of total traffic.
- Common search queries regularly exceed acceptable latency.
- Filters, typo tolerance, synonyms, ranking controls, or analytics become product requirements.
- The `search_documents` table grows enough that Postgres search work competes with lead capture, admin, or public page rendering.

## Candidate Engines

- Typesense: strong default for fast, typo-tolerant catalog search with simpler operations.
- Meilisearch: good developer experience and relevance tuning for moderate scale.
- Algolia: best managed option if budget allows and search analytics/conversion tuning matter.
- OpenSearch: powerful, but heavier operationally; use when search requirements become complex enough to justify it.

## Migration Shape

1. Keep Postgres as source of truth.
2. Add a background job that syncs changed catalog rows into the search engine.
3. Keep `search_documents` as a fallback until the external index is proven.
4. Switch `/search` and autocomplete APIs to the search engine behind the existing `searchCatalog` interface.
5. Keep the public UI unchanged during the migration.
