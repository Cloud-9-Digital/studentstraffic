ALTER TABLE program_offerings
  ADD COLUMN IF NOT EXISTS admissions_content jsonb NOT NULL DEFAULT '{}'::jsonb;
