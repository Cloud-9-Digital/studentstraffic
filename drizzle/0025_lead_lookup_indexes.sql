CREATE INDEX IF NOT EXISTS "leads_phone_created_at_idx" ON "leads" USING btree ("phone","created_at");
