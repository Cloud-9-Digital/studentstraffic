# Search Scaling Roadmap

The current site search uses the `search_documents` table first, with an in-memory fallback from catalog data. Results are cached with Next.js Cache Components, so repeated queries should avoid repeated database work.

## Current Stage

- Keep Postgres as the source of truth.
- Keep `search_documents` as the internal searchable index.
- Cover universities, programs, countries, courses, India colleges, root guide pages, and blog posts in the same search index.
- Cache search result sets with `use cache`, `cacheLife("hours")`, and `search` cache tags.
- Log production search latency and inferred cache hit/miss behavior from `/search`.
- No external search engine is used: `/search` runs on Postgres only (ParadeDB BM25 when `search_documents_bm25_idx` exists, otherwise pg_trgm, otherwise an in-memory fallback).

## Ranking model (2026-09-13)

`lib/search/ranking.ts` holds the ranking model (pure, unit tested in `tests/search-ranking.test.ts`); `lib/search/search.ts` executes it. A free-text search issues one ranking statement plus the cached `pg_indexes` check; exact and typo-tolerant matching share that statement. The pg_trgm fallback runs only when the BM25 index is missing or nothing matches.

Candidate generation (ParadeDB BM25):

- The query is normalised (lowercase, diacritics stripped) into at most 8 terms. Intent words (`in`, `of`, `for`, `fees`, `cost`, `best`, `top`, `study`, `abroad`, ...) are optional: they add score but are never required, so a page that says "fee" still matches "mbbs georgia fees".
- Every other term must match in some field (title, subtitle, summary, search_text): exactly (BM25 scored), within a typo budget on title or subtitle (0 edits for terms of up to 4 characters so acronyms such as KIIT or LPU stay exact, 1 edit for 5-7, 2 for 8+; a transposition counts as one edit), or as a prefix for the last term of 4+ characters ("manipal univ").
- Adjacent query words that appear as a phrase in the title or search_text add score ("computer science").
- Score = BM25 + exact-title boost + a small type and `featured` boost; when the query is exactly a country name, that country's hub gets the exact-title boost so it reaches the pool. The best 200 matches are taken with a top-N sort, capped at the result limit per document type and at 3 programmes per university, and the best 72 are joined back for display columns.
- `search_text` never leaves the database. The statement returns only rendered fields plus two rank inputs computed next to each row: `length(search_text)` and the share of required terms found in `lower(search_text)`. `SearchResult` has no `searchText`; the rerank strips its inputs before results reach the page or the facet-browse cache.

Rerank (in process, no extra queries):

- Navigational country query: when the required words are exactly a country name ("georgia", "study in canada"), that country's hub gets +95, ahead of titles that merely start with or contain the name.
- Title signals: exact title (+80); the whole title matches with per-word typos (+60, "univercity of copenhagen"); title starts with or contains the query (+55 / +42); subtitle contains it (+18); all or 75% of query words in the title, typo tolerant (+18 / +8); all query words in the subtitle (+6); all required words in the document (+4). Universities, India colleges and programmes that match by title get a type boost; guides, countries and courses that do not are demoted.
- Medical intent: queries containing mbbs, md, medicine, medical or doctor add +10 to universities, India colleges and programmes whose title names a medical or health faculty.
- Content depth prior: up to +5 (1.25 x ln(search_text length / 400)), so thorough pages beat thin stubs with the same terms. It is always smaller than any title signal.
- Strong title matches filter out weaker entity results (unchanged), at most 3 programmes per university reach the results, and ties break on title tier, `featured`, document type and title.
Presentation: `/search` still groups results into typed sections (universities, programmes, guides, articles, India colleges, countries, courses) with the same headings and cards, but orders the sections by their best-ranked result (`orderSectionsByTopResult` in `lib/search/result-sections.ts`, ties keep that configured order). The top-scored result is therefore always the first card. Within a section, cards keep rank order.

Payload (Neon response per search / serialized result set): "georgia" 684 KB / 224 KB -> 50 KB / 19 KB; "mbbs georgia fees" 557 / 118 -> 48 / 22 KB; "computer science canada" 279 / 186 -> 39 / 23 KB; "univercity of copenhagen" 38 / 13 -> 9 / 4 KB.

Evaluation: a 32-query set (exact names, misspellings, acronyms, medical and programme intent, country hubs) scored by on-page position. Before the ranking model: success@1 0.69, success@3 0.75, MRR 0.74 (22 of 32 targets met). Ranking model with type-ordered sections: 0.81 / 0.84 / 0.84 (27). With sections ordered by top result: 0.91 / 1.00 / 0.94 (30). Two queries lost a first place because their top-scored result is a relevant document outside the expected set: "nursing germany" leads with the Germany nursing career guide, and "manipal univ" with Sikkim Manipal Institute.

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
