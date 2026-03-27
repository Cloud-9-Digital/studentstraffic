CREATE TABLE "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"region" text NOT NULL,
	"summary" text NOT NULL,
	"why_students_choose_it" text NOT NULL,
	"climate" text NOT NULL,
	"currency_code" text NOT NULL,
	"meta_title" text NOT NULL,
	"meta_description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"duration_years" integer NOT NULL,
	"summary" text NOT NULL,
	"meta_title" text NOT NULL,
	"meta_description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"course_slug" text,
	"country_slug" text,
	"university_slug" text,
	"source_path" text NOT NULL,
	"cta_variant" text NOT NULL,
	"notes" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_term" text,
	"utm_content" text,
	"referrer" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "program_offerings" (
	"id" serial PRIMARY KEY NOT NULL,
	"university_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"duration_years" integer NOT NULL,
	"annual_tuition_usd" integer NOT NULL,
	"total_tuition_usd" integer NOT NULL,
	"hostel_usd" integer NOT NULL,
	"living_usd" integer NOT NULL,
	"medium" text NOT NULL,
	"nmc_eligible" boolean DEFAULT false NOT NULL,
	"usmle_eligible" boolean DEFAULT false NOT NULL,
	"has_hostel" boolean DEFAULT false NOT NULL,
	"intake_months" text[] DEFAULT '{}' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "universities" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_id" integer NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"type" text NOT NULL,
	"established_year" integer NOT NULL,
	"summary" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"has_hostel" boolean DEFAULT false NOT NULL,
	"campus_lifestyle" text NOT NULL,
	"recognition_badges" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "program_offerings" ADD CONSTRAINT "program_offerings_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_offerings" ADD CONSTRAINT "program_offerings_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "universities" ADD CONSTRAINT "universities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "countries_slug_idx" ON "countries" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "leads_source_path_idx" ON "leads" USING btree ("source_path");--> statement-breakpoint
CREATE UNIQUE INDEX "program_offerings_slug_idx" ON "program_offerings" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "program_offerings_university_idx" ON "program_offerings" USING btree ("university_id");--> statement-breakpoint
CREATE INDEX "program_offerings_course_idx" ON "program_offerings" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "program_offerings_fee_idx" ON "program_offerings" USING btree ("annual_tuition_usd");--> statement-breakpoint
CREATE INDEX "program_offerings_medium_idx" ON "program_offerings" USING btree ("medium");--> statement-breakpoint
CREATE INDEX "program_offerings_nmc_idx" ON "program_offerings" USING btree ("nmc_eligible");--> statement-breakpoint
CREATE INDEX "program_offerings_usmle_idx" ON "program_offerings" USING btree ("usmle_eligible");--> statement-breakpoint
CREATE INDEX "program_offerings_hostel_idx" ON "program_offerings" USING btree ("has_hostel");--> statement-breakpoint
CREATE UNIQUE INDEX "universities_slug_idx" ON "universities" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "universities_country_idx" ON "universities" USING btree ("country_id");