ALTER TABLE "leads"
  ADD COLUMN IF NOT EXISTS "source_url" text,
  ADD COLUMN IF NOT EXISTS "source_query" jsonb DEFAULT '{}'::jsonb NOT NULL,
  ADD COLUMN IF NOT EXISTS "page_title" text,
  ADD COLUMN IF NOT EXISTS "document_referrer" text,
  ADD COLUMN IF NOT EXISTS "user_agent" text,
  ADD COLUMN IF NOT EXISTS "ip_address" text,
  ADD COLUMN IF NOT EXISTS "accept_language" text,
  ADD COLUMN IF NOT EXISTS "client_context" jsonb DEFAULT '{}'::jsonb NOT NULL;
