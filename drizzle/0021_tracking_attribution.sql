ALTER TABLE "leads"
ADD COLUMN IF NOT EXISTS "visitor_id" text,
ADD COLUMN IF NOT EXISTS "initial_landing_path" text,
ADD COLUMN IF NOT EXISTS "initial_landing_url" text,
ADD COLUMN IF NOT EXISTS "initial_referrer" text,
ADD COLUMN IF NOT EXISTS "initial_utm_landing_url" text,
ADD COLUMN IF NOT EXISTS "gclid" text,
ADD COLUMN IF NOT EXISTS "fbclid" text,
ADD COLUMN IF NOT EXISTS "gbraid" text,
ADD COLUMN IF NOT EXISTS "wbraid" text,
ADD COLUMN IF NOT EXISTS "ttclid" text;--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "leads_visitor_id_idx" ON "leads" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_gclid_idx" ON "leads" USING btree ("gclid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_fbclid_idx" ON "leads" USING btree ("fbclid");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "contact_click_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "visitor_id" text,
  "channel" text NOT NULL,
  "location" text NOT NULL,
  "href" text,
  "page_path" text NOT NULL,
  "page_url" text,
  "referrer" text,
  "initial_landing_path" text,
  "initial_landing_url" text,
  "initial_referrer" text,
  "initial_utm_landing_url" text,
  "utm_source" text,
  "utm_medium" text,
  "utm_campaign" text,
  "utm_term" text,
  "utm_content" text,
  "gclid" text,
  "fbclid" text,
  "gbraid" text,
  "wbraid" text,
  "ttclid" text,
  "user_agent" text,
  "ip_address" text,
  "created_at" timestamp with time zone DEFAULT now()
);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "contact_click_events_created_at_idx" ON "contact_click_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contact_click_events_visitor_id_idx" ON "contact_click_events" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contact_click_events_channel_idx" ON "contact_click_events" USING btree ("channel");
