-- `medium` becomes a short language label ("English / Russian"); source-backed
-- delivery nuance moves to this optional column. Additive and nullable.
ALTER TABLE "program_offerings"
  ADD COLUMN IF NOT EXISTS "medium_note" text;
