ALTER TABLE "leads" ADD COLUMN "leadsquared_sync_status" text DEFAULT 'not_attempted' NOT NULL;
ALTER TABLE "leads" ADD COLUMN "leadsquared_synced_at" timestamp with time zone;
ALTER TABLE "leads" ADD COLUMN "leadsquared_sync_error" text;
ALTER TABLE "leads" ADD COLUMN "leadsquared_external_id" text;
