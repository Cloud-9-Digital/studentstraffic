-- Reconcile the two parallel implementations of programme delivery nuance.
-- 0073_program_offering_medium_note (upstream) added medium_note; an earlier
-- local branch added medium_details and populated 436 rows. medium_note is the
-- direction we keep, so carry that data across.
--
-- Only rows matching the medium_note contract (10-300 chars) are copied: 13 of
-- the 436 are shorter than 10 chars and 5 exceed 300. Those 18 are left in
-- medium_details for manual review rather than silently truncated.
--
-- medium_details is deliberately NOT dropped here. Drop it in a follow-up once
-- the 18 outliers are resolved.

UPDATE "program_offerings"
SET "medium_note" = btrim("medium_details")
WHERE "medium_note" IS NULL
  AND "medium_details" IS NOT NULL
  AND length(btrim("medium_details")) BETWEEN 10 AND 300;
