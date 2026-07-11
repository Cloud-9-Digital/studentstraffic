ALTER TABLE universities
  ADD COLUMN IF NOT EXISTS media_attribution jsonb NOT NULL DEFAULT '{}'::jsonb;
