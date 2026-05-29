-- Migration: schema improvements
-- 1. Add stream to courses
-- 2. Add city_profiles table
-- 3. Fix user_shortlists to use university_id FK

-- ── 1. courses.stream ──────────────────────────────────────────────────────
ALTER TABLE "courses" ADD COLUMN "stream" text NOT NULL DEFAULT 'medicine';
CREATE INDEX "courses_stream_idx" ON "courses" ("stream");

-- ── 2. city_profiles ────────────────────────────────────────────────────────
CREATE TABLE "city_profiles" (
  "id" serial PRIMARY KEY NOT NULL,
  "country_slug" text NOT NULL,
  "city" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE UNIQUE INDEX "city_profiles_country_city_idx" ON "city_profiles" ("country_slug", "city");
CREATE INDEX "city_profiles_country_idx" ON "city_profiles" ("country_slug");

-- Backfill: one row per (country, city) using the featured/oldest university's city_profile
INSERT INTO "city_profiles" ("country_slug", "city", "content")
SELECT DISTINCT ON (co.slug, lower(u.city))
  co.slug AS country_slug,
  u.city,
  u.city_profile AS content
FROM "universities" u
JOIN "countries" co ON co.id = u.country_id
WHERE u.city_profile IS NOT NULL AND u.city_profile != ''
ORDER BY co.slug, lower(u.city), u.featured DESC, u.established_year DESC NULLS LAST
ON CONFLICT DO NOTHING;

-- ── 3. user_shortlists: replace university_slug with university_id FK ────────
-- Step 1: add nullable column
ALTER TABLE "user_shortlists" ADD COLUMN "university_id" integer;

-- Step 2: backfill from universities
UPDATE "user_shortlists" us
SET "university_id" = u.id
FROM "universities" u
WHERE u.slug = us.university_slug;

-- Step 3: delete any rows that couldn't be matched (orphaned slugs)
DELETE FROM "user_shortlists" WHERE "university_id" IS NULL;

-- Step 4: make NOT NULL and add FK
ALTER TABLE "user_shortlists" ALTER COLUMN "university_id" SET NOT NULL;
ALTER TABLE "user_shortlists"
  ADD CONSTRAINT "user_shortlists_university_id_universities_id_fk"
  FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON DELETE CASCADE;

-- Step 5: swap the unique constraint
DROP INDEX IF EXISTS "user_university_unique";
CREATE UNIQUE INDEX "user_university_unique" ON "user_shortlists" ("user_id", "university_id");

-- Step 6: drop the old text column
ALTER TABLE "user_shortlists" DROP COLUMN "university_slug";
