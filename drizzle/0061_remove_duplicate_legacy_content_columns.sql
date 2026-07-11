-- Migration 0054 introduced stream-neutral replacements but left the old
-- medical-only columns in place. The application and current SQL importers
-- use the replacements; the old columns are redundant copies.
ALTER TABLE universities
  DROP COLUMN IF EXISTS clinical_exposure,
  DROP COLUMN IF EXISTS teaching_hospitals,
  DROP COLUMN IF EXISTS indian_food_support;

ALTER TABLE program_offerings
  DROP COLUMN IF EXISTS license_exam_support;
