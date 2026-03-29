CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "universities_name_trgm_idx"
ON "universities" USING gin ("name" gin_trgm_ops);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "universities_city_trgm_idx"
ON "universities" USING gin ("city" gin_trgm_ops);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "countries_name_trgm_idx"
ON "countries" USING gin ("name" gin_trgm_ops);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "courses_short_name_trgm_idx"
ON "courses" USING gin ("short_name" gin_trgm_ops);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "program_offerings_intake_months_gin_idx"
ON "program_offerings" USING gin ("intake_months");--> statement-breakpoint
