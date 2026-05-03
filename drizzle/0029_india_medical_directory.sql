CREATE TABLE "india_medical_colleges" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"college_code" text,
	"college_name" text NOT NULL,
	"state_name" text NOT NULL,
	"city_name" text,
	"management_type" text,
	"university_name" text,
	"source_authority" text DEFAULT 'NMC' NOT NULL,
	"source_file_name" text,
	"import_batch" text,
	"source_url" text,
	"raw_row" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "india_medical_programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"college_id" integer NOT NULL,
	"slug" text NOT NULL,
	"course_name" text NOT NULL,
	"year_of_inception" integer,
	"annual_intake_seats" integer,
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
ALTER TABLE "india_medical_programs" ADD CONSTRAINT "india_medical_programs_college_id_india_medical_colleges_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."india_medical_colleges"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "india_medical_colleges_slug_idx" ON "india_medical_colleges" USING btree ("slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "india_medical_colleges_code_idx" ON "india_medical_colleges" USING btree ("college_code");
--> statement-breakpoint
CREATE INDEX "india_medical_colleges_state_idx" ON "india_medical_colleges" USING btree ("state_name");
--> statement-breakpoint
CREATE INDEX "india_medical_colleges_management_idx" ON "india_medical_colleges" USING btree ("management_type");
--> statement-breakpoint
CREATE UNIQUE INDEX "india_medical_programs_slug_idx" ON "india_medical_programs" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX "india_medical_programs_college_idx" ON "india_medical_programs" USING btree ("college_id");
--> statement-breakpoint
CREATE INDEX "india_medical_programs_course_idx" ON "india_medical_programs" USING btree ("course_name");
