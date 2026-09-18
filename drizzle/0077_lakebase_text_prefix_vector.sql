-- Prefix matching support for the lakebase_text search tier.
--
-- search_tsv is built with the 'english' configuration, so its lexemes are
-- stemmed ("universities" -> "univers"). A prefix query like 'universit':*
-- therefore misses them, which is why prefix matching needs its own vector.
--
-- This column uses the 'simple' configuration (no stemming) over the same
-- fields pg_search used for prefix matching (BM25_PREFIX_FIELDS: title and
-- search_text), so a partially typed last word still matches. It is used for
-- filtering only; BM25 scoring stays on search_tsv.

ALTER TABLE "search_documents"
  ADD COLUMN IF NOT EXISTS "search_tsv_prefix" tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce("title", '') || ' ' || coalesce("search_text", ''))
  ) STORED;--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "search_documents_prefix_tsv_idx"
  ON "search_documents" USING gin ("search_tsv_prefix");
