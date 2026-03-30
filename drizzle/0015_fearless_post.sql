ALTER TABLE "program_offerings" ADD COLUMN "official_fee_currency" text;--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "official_annual_tuition_amount" integer;--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "official_total_tuition_amount" integer;--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "fee_verified_at" text;--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "fx_rate_date" text;--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "fx_rate_source_url" text;--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "fee_notes" text;--> statement-breakpoint
ALTER TABLE "program_offerings" ADD COLUMN "source_urls" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "last_verified_at" text;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "research_sources" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "research_notes" text;