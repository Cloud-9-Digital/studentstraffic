CREATE TABLE "university_research_queue" (
  "id" serial PRIMARY KEY NOT NULL,
  "wdoms_school_id" text NOT NULL,
  "country_slug" text NOT NULL,
  "school_name" text NOT NULL,
  "city_name" text,
  "priority" text DEFAULT 'medium' NOT NULL,
  "status" text DEFAULT 'new' NOT NULL,
  "matched_university_id" integer,
  "published_university_slug" text,
  "notes" text,
  "last_attempted_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "university_research_drafts" (
  "id" serial PRIMARY KEY NOT NULL,
  "queue_id" integer NOT NULL,
  "wdoms_school_id" text NOT NULL,
  "official_website" text,
  "program_url" text,
  "fees_url" text,
  "hostel_url" text,
  "admission_url" text,
  "wdoms_url" text,
  "source_bundle" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "structured_facts" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "draft_content" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "quality_score" integer,
  "review_notes" text,
  "verified_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "university_research_queue"
  ADD CONSTRAINT "university_research_queue_matched_university_id_universities_id_fk"
  FOREIGN KEY ("matched_university_id") REFERENCES "public"."universities"("id")
  ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "university_research_drafts"
  ADD CONSTRAINT "university_research_drafts_queue_id_university_research_queue_id_fk"
  FOREIGN KEY ("queue_id") REFERENCES "public"."university_research_queue"("id")
  ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "university_research_queue_wdoms_school_id_idx"
  ON "university_research_queue" USING btree ("wdoms_school_id");
--> statement-breakpoint
CREATE INDEX "university_research_queue_country_idx"
  ON "university_research_queue" USING btree ("country_slug");
--> statement-breakpoint
CREATE INDEX "university_research_queue_priority_idx"
  ON "university_research_queue" USING btree ("priority");
--> statement-breakpoint
CREATE INDEX "university_research_queue_status_idx"
  ON "university_research_queue" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "university_research_queue_matched_university_idx"
  ON "university_research_queue" USING btree ("matched_university_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "university_research_drafts_queue_id_idx"
  ON "university_research_drafts" USING btree ("queue_id");
--> statement-breakpoint
CREATE INDEX "university_research_drafts_wdoms_school_id_idx"
  ON "university_research_drafts" USING btree ("wdoms_school_id");
--> statement-breakpoint
CREATE INDEX "university_research_drafts_verified_at_idx"
  ON "university_research_drafts" USING btree ("verified_at");
