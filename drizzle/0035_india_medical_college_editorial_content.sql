ALTER TABLE "india_medical_colleges"
ADD COLUMN "editorial_content" jsonb NOT NULL DEFAULT '{}'::jsonb;
