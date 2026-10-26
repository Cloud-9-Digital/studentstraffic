-- Lead-gated university brochures.
--
-- universities.brochure holds the private (authenticated) Cloudinary raw asset
-- for the university's official brochure, written by scripts/apply-brochures.ts:
-- { publicId, fileName, title, academicYear?, bytes, sourceUrl, sourceLabel, checkedAt }.
-- Null means the university has no brochure and the page shows no download button.
--
-- brochure_downloads records each brochure a lead downloaded through
-- /api/brochures/[slug], so counsellors can see which brochures a student took.
ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "brochure" jsonb;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brochure_downloads" (
  "id" serial PRIMARY KEY NOT NULL,
  "lead_id" integer NOT NULL,
  "university_slug" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "brochure_downloads_lead_id_leads_id_fk"
    FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "brochure_downloads_lead_created_idx" ON "brochure_downloads" USING btree ("lead_id", "created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "brochure_downloads_university_created_idx" ON "brochure_downloads" USING btree ("university_slug", "created_at");
