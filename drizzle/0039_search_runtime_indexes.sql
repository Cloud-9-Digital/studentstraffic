CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_am WHERE amname = 'bm25') THEN
    DROP INDEX IF EXISTS search_documents_bm25_idx;

    CREATE INDEX search_documents_bm25_idx
    ON search_documents
    USING bm25 (
      id,
      title,
      subtitle,
      summary,
      search_text
    )
    WITH (
      key_field='id'
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS search_documents_title_trgm_idx
ON search_documents
USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS search_documents_subtitle_trgm_idx
ON search_documents
USING gin (subtitle gin_trgm_ops);
