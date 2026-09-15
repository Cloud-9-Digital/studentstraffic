ALTER TABLE content_migrations
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'applied';

ALTER TABLE content_migrations
  ADD CONSTRAINT content_migrations_status_check
  CHECK (status IN ('db_applied', 'applied'));

CREATE INDEX IF NOT EXISTS content_migrations_status_idx
  ON content_migrations (status);
