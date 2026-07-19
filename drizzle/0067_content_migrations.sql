CREATE TABLE IF NOT EXISTS content_migrations (
  migration_id text PRIMARY KEY NOT NULL,
  checksum text NOT NULL,
  payload_count integer NOT NULL,
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  applied_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_migrations_applied_at_idx
  ON content_migrations (applied_at);
