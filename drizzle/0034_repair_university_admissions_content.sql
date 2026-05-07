ALTER TABLE "universities"
ADD COLUMN IF NOT EXISTS "admissions_content" jsonb NOT NULL DEFAULT '{}'::jsonb;
