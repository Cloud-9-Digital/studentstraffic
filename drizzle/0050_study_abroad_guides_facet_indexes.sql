CREATE INDEX IF NOT EXISTS "study_abroad_guides_course_slug_idx"
  ON "study_abroad_guides" USING btree ("course_slug");

CREATE INDEX IF NOT EXISTS "study_abroad_guides_country_slug_idx"
  ON "study_abroad_guides" USING btree ("country_slug");
