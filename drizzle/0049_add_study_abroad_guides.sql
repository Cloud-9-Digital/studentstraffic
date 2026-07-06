CREATE TABLE IF NOT EXISTS "study_abroad_guides" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "stream" text NOT NULL DEFAULT 'medicine',
  "course_slug" text,
  "country_slug" text,
  "metadata" jsonb NOT NULL,
  "page" jsonb NOT NULL,
  "published" boolean NOT NULL DEFAULT false,
  "last_verified_at" timestamp with time zone,
  "source_urls" jsonb,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "study_abroad_guides_slug_idx"
  ON "study_abroad_guides" USING btree ("slug");

CREATE INDEX IF NOT EXISTS "study_abroad_guides_stream_idx"
  ON "study_abroad_guides" USING btree ("stream");

CREATE INDEX IF NOT EXISTS "study_abroad_guides_published_idx"
  ON "study_abroad_guides" USING btree ("published");

CREATE INDEX IF NOT EXISTS "universities_country_city_idx"
  ON "universities" USING btree ("country_id", "city");
