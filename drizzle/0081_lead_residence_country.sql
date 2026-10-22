-- The country a lead lives in, as an ISO 3166-1 alpha-2 code (e.g. "IN", "AE").
--
-- Lead forms now ask for it because the catalogue serves students outside
-- India. Nullable: rows from before this column have no reliable value (a +91
-- phone says where the number is registered, not where the student lives), so
-- they are not backfilled.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "residence_country" varchar(2);
