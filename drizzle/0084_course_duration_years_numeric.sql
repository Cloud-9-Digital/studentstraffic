-- Preserve exact fractional-year canonical awards, including 5.5-year BVSc programmes.
-- Existing integer values convert exactly; programme-offering precision is unchanged.
ALTER TABLE "courses"
ALTER COLUMN "duration_years" TYPE numeric(4, 1)
USING "duration_years"::numeric(4, 1);
