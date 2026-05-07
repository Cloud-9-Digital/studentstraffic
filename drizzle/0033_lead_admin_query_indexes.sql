CREATE INDEX IF NOT EXISTS "leads_created_at_idx"
ON "leads" USING btree ("created_at");--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "leads_seminar_event_idx"
ON "leads" USING btree ("seminar_event");--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "leads_interested_country_idx"
ON "leads" USING btree ("interested_country");--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "leads_full_name_trgm_idx"
ON "leads" USING gin ("full_name" gin_trgm_ops);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "leads_phone_trgm_idx"
ON "leads" USING gin ("phone" gin_trgm_ops);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "leads_email_trgm_idx"
ON "leads" USING gin ("email" gin_trgm_ops);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "leads_father_name_trgm_idx"
ON "leads" USING gin ("father_name" gin_trgm_ops);--> statement-breakpoint
