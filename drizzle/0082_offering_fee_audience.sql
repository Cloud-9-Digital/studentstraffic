-- Who a programme's published fee applies to, and any further published fees.
--
-- Indian universities often publish one fee for Indian students and another
-- for NRI and foreign applicants; a single fee column could not say which one
-- it was. fee_audience is "domestic", "international" or "all" (null when not
-- yet classified). additional_fees holds further official fees as
-- [{ audience, currency, annualAmount, totalAmount?, academicYear, verifiedAt, notes }].
ALTER TABLE "program_offerings" ADD COLUMN IF NOT EXISTS "fee_audience" text;
ALTER TABLE "program_offerings" ADD COLUMN IF NOT EXISTS "additional_fees" jsonb DEFAULT '[]'::jsonb NOT NULL;
