-- The seat category a programme's main fee belongs to, as the source names it
-- ("Government quota", "Management quota", "NRI quota"). Tamil Nadu medical and
-- dental colleges publish a different fee per quota, and two Indian-student fees
-- were otherwise indistinguishable. additional_fees entries carry the same
-- optional "category" key inside the existing jsonb.
ALTER TABLE "program_offerings" ADD COLUMN IF NOT EXISTS "fee_category" text;
