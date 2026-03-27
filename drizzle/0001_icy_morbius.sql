CREATE TABLE "search_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_type" text NOT NULL,
	"source_slug" text NOT NULL,
	"path" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"summary" text NOT NULL,
	"search_text" text NOT NULL,
	"highlights" jsonb NOT NULL,
	"country_slug" text,
	"course_slug" text,
	"university_slug" text,
	"city" text,
	"featured" boolean DEFAULT false NOT NULL,
	"annual_tuition_usd" integer,
	"medium" text,
	"nmc_eligible" boolean DEFAULT false NOT NULL,
	"usmle_eligible" boolean DEFAULT false NOT NULL,
	"has_hostel" boolean DEFAULT false NOT NULL,
	"intake_months" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "official_program_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "teaching_phases" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "yearly_cost_breakdown" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "license_exam_support" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "official_website" text NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "city_profile" text NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "clinical_exposure" text NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "hostel_overview" text NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "indian_food_support" text NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "safety_overview" text NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "student_support" text NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "why_choose" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "things_to_consider" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "best_fit_for" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "teaching_hospitals" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "recognition_links" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "faq" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "references" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "similar_university_slugs" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "search_documents_type_slug_idx" ON "search_documents" USING btree ("document_type","source_slug");--> statement-breakpoint
CREATE INDEX "search_documents_type_idx" ON "search_documents" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX "search_documents_country_idx" ON "search_documents" USING btree ("country_slug");--> statement-breakpoint
CREATE INDEX "search_documents_course_idx" ON "search_documents" USING btree ("course_slug");--> statement-breakpoint
CREATE INDEX "search_documents_university_idx" ON "search_documents" USING btree ("university_slug");--> statement-breakpoint
CREATE INDEX "search_documents_featured_idx" ON "search_documents" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "search_documents_fee_idx" ON "search_documents" USING btree ("annual_tuition_usd");--> statement-breakpoint
CREATE INDEX "search_documents_nmc_idx" ON "search_documents" USING btree ("nmc_eligible");--> statement-breakpoint
CREATE INDEX "search_documents_usmle_idx" ON "search_documents" USING btree ("usmle_eligible");--> statement-breakpoint
CREATE INDEX "search_documents_hostel_idx" ON "search_documents" USING btree ("has_hostel");