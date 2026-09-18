-- Migrate BM25 search from pg_search (ParadeDB) to lakebase_text.
-- pg_search is deprecated on Neon and existing installs are removed 2026-09-21.
-- This migration is additive: it leaves pg_search and its bm25 index in place so
-- the app keeps serving from either path during the deploy. 0075 removes pg_search.

CREATE EXTENSION IF NOT EXISTS lakebase_text;--> statement-breakpoint

-- Weighted tsvector standing in for the per-field scoring that
-- paradedb.disjunction_max used to do: A=title, B=subtitle, C=summary, D=search_text.
ALTER TABLE "search_documents"
  ADD COLUMN IF NOT EXISTS "search_tsv" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("subtitle", '')), 'B') ||
    setweight(to_tsvector('english', coalesce("summary", '')), 'C') ||
    setweight(to_tsvector('english', coalesce("search_text", '')), 'D')
  ) STORED;--> statement-breakpoint

-- lakebase_bm25 reads corpus statistics at build time, so this must run after
-- the table is populated. Re-run VACUUM after any large bulk reload.
CREATE INDEX IF NOT EXISTS "search_documents_lakebase_bm25_idx"
  ON "search_documents" USING lakebase_bm25 ("search_tsv");
