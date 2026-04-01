ALTER TABLE "universities"
ADD COLUMN "admissions_content" jsonb NOT NULL DEFAULT '{}'::jsonb;
