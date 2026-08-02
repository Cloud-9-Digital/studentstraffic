CREATE TABLE IF NOT EXISTS "not_found_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "path" text NOT NULL,
  "referrer" text,
  "user_agent" text,
  "ip_address" text,
  "created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "not_found_events_created_at_idx" ON "not_found_events" ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "not_found_events_path_created_at_idx" ON "not_found_events" ("path", "created_at" DESC);
