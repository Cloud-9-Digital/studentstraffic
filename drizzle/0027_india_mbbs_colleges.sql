CREATE TABLE "india_mbbs_colleges" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"college_name" text NOT NULL,
	"state_name" text NOT NULL,
	"city_name" text,
	"management_type" text,
	"university_name" text,
	"course_name" text DEFAULT 'MBBS' NOT NULL,
	"annual_intake_seats" integer,
	"teaching_hospital" text,
	"address" text,
	"source_authority" text DEFAULT 'NMC' NOT NULL,
	"source_file_name" text,
	"source_row_number" integer,
	"import_batch" text,
	"source_url" text,
	"raw_row" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX "india_mbbs_colleges_slug_idx" ON "india_mbbs_colleges" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX "india_mbbs_colleges_state_idx" ON "india_mbbs_colleges" USING btree ("state_name");
--> statement-breakpoint
CREATE INDEX "india_mbbs_colleges_management_idx" ON "india_mbbs_colleges" USING btree ("management_type");
--> statement-breakpoint
CREATE INDEX "india_mbbs_colleges_course_idx" ON "india_mbbs_colleges" USING btree ("course_name");
