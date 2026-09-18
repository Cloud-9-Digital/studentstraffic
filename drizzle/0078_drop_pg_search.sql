-- Remove the deprecated pg_search extension. Applied once 0074+0077 are live
-- and search has been verified against lakebase_text in production.
-- CASCADE also drops search_documents_bm25_idx, which depends on the extension.
-- Restart the compute afterwards to unload the library.

DROP EXTENSION IF EXISTS pg_search CASCADE;
