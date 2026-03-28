ALTER TABLE "leads" ADD COLUMN "crm_sync_status" text DEFAULT 'not_attempted' NOT NULL;
ALTER TABLE "leads" ADD COLUMN "crm_synced_at" timestamp with time zone;
ALTER TABLE "leads" ADD COLUMN "crm_sync_error" text;
ALTER TABLE "leads" ADD COLUMN "crm_external_id" text;
ALTER TABLE "leads" ADD COLUMN "pabbly_sync_status" text DEFAULT 'not_attempted' NOT NULL;
ALTER TABLE "leads" ADD COLUMN "pabbly_synced_at" timestamp with time zone;
ALTER TABLE "leads" ADD COLUMN "pabbly_sync_error" text;
