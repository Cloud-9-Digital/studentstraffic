CREATE TABLE "wdoms_directory_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_slug" text NOT NULL,
	"country_name" text NOT NULL,
	"school_id" text NOT NULL,
	"school_name" text NOT NULL,
	"city_name" text NOT NULL,
	"school_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "wdoms_directory_entries_school_id_idx" ON "wdoms_directory_entries" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "wdoms_directory_entries_country_idx" ON "wdoms_directory_entries" USING btree ("country_slug");