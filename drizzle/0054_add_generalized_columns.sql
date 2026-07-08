-- Generalize medical/India-specific column names to stream-neutral ones so the
-- universities/program_offerings schema can hold non-medical content without
-- misleading field names.
--
-- ADDITIVE (expand) step of a zero-downtime expand/contract migration — safe to
-- apply at any time, including well before deploying the code that reads/writes
-- the new columns. It does NOT touch, rename, or drop the old columns, so the
-- currently-deployed (old) code keeps working unmodified against them.
--
-- universities.clinical_exposure    -> practical_exposure     (clinical training / industry exposure)
-- universities.teaching_hospitals   -> industry_partners      (teaching hospitals / placement partners)
-- universities.indian_food_support  -> dietary_support        (Indian food / general dietary support)
-- program_offerings.license_exam_support -> professional_exam_support (FMGE/NExT / any licensing/certification exam)
--
-- CONTRACT step (dropping the old columns) is intentionally deferred to a later,
-- separate migration once the new code has been live and stable for a while —
-- see docs/university-pipeline-architecture.md.

-- ── universities.practical_exposure ─────────────────────────────────────────
ALTER TABLE "universities" ADD COLUMN "practical_exposure" text;
UPDATE "universities" SET "practical_exposure" = "clinical_exposure";
ALTER TABLE "universities" ALTER COLUMN "practical_exposure" SET NOT NULL;

-- ── universities.industry_partners ──────────────────────────────────────────
ALTER TABLE "universities" ADD COLUMN "industry_partners" text[] NOT NULL DEFAULT '{}';
UPDATE "universities" SET "industry_partners" = "teaching_hospitals";

-- ── universities.dietary_support ────────────────────────────────────────────
ALTER TABLE "universities" ADD COLUMN "dietary_support" text;
UPDATE "universities" SET "dietary_support" = "indian_food_support";
ALTER TABLE "universities" ALTER COLUMN "dietary_support" SET NOT NULL;

-- ── program_offerings.professional_exam_support ─────────────────────────────
ALTER TABLE "program_offerings" ADD COLUMN "professional_exam_support" jsonb NOT NULL DEFAULT '[]'::jsonb;
UPDATE "program_offerings" SET "professional_exam_support" = "license_exam_support";
