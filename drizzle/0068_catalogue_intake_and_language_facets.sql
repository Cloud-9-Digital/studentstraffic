ALTER TABLE "program_offerings"
  ADD COLUMN IF NOT EXISTS "instruction_languages" text[] NOT NULL DEFAULT '{}';

ALTER TABLE "program_offerings"
  ADD COLUMN IF NOT EXISTS "intake_codes" text[] NOT NULL DEFAULT '{}';

-- Backfill only exact, unambiguous legacy values. Values that include a
-- qualification, an unconfirmed track, or a seasonal label deliberately stay
-- unclassified until their source-backed content migration is refreshed.
UPDATE "program_offerings"
SET "instruction_languages" = CASE lower(trim("medium"))
  WHEN 'albanian' THEN ARRAY['albanian']
  WHEN 'chinese' THEN ARRAY['chinese']
  WHEN 'english' THEN ARRAY['english']
  WHEN 'english + local support' THEN ARRAY['english']
  WHEN 'english + russian support' THEN ARRAY['english', 'russian']
  WHEN 'english + kyrgyz support' THEN ARRAY['english', 'kyrgyz']
  WHEN 'french' THEN ARRAY['french']
  WHEN 'georgian' THEN ARRAY['georgian']
  WHEN 'german' THEN ARRAY['german']
  WHEN 'italian' THEN ARRAY['italian']
  WHEN 'kyrgyz' THEN ARRAY['kyrgyz']
  WHEN 'lithuanian' THEN ARRAY['lithuanian']
  WHEN 'maltese' THEN ARRAY['maltese']
  WHEN 'polish' THEN ARRAY['polish']
  WHEN 'romanian' THEN ARRAY['romanian']
  WHEN 'russian' THEN ARRAY['russian']
  WHEN 'spanish' THEN ARRAY['spanish']
  WHEN 'turkish' THEN ARRAY['turkish']
  WHEN 'uzbek' THEN ARRAY['uzbek']
  WHEN 'vietnamese' THEN ARRAY['vietnamese']
  ELSE "instruction_languages"
END
WHERE cardinality("instruction_languages") = 0;

UPDATE "program_offerings"
SET "intake_codes" = ARRAY(
  SELECT DISTINCT CASE lower(trim(value))
    WHEN 'jan' THEN 'january' WHEN 'january' THEN 'january'
    WHEN 'feb' THEN 'february' WHEN 'february' THEN 'february'
    WHEN 'mar' THEN 'march' WHEN 'march' THEN 'march'
    WHEN 'apr' THEN 'april' WHEN 'april' THEN 'april'
    WHEN 'may' THEN 'may'
    WHEN 'jun' THEN 'june' WHEN 'june' THEN 'june'
    WHEN 'jul' THEN 'july' WHEN 'july' THEN 'july'
    WHEN 'aug' THEN 'august' WHEN 'august' THEN 'august'
    WHEN 'sep' THEN 'september' WHEN 'sept' THEN 'september' WHEN 'september' THEN 'september'
    WHEN 'oct' THEN 'october' WHEN 'october' THEN 'october'
    WHEN 'nov' THEN 'november' WHEN 'november' THEN 'november'
    WHEN 'dec' THEN 'december' WHEN 'december' THEN 'december'
  END
  FROM unnest("intake_months") AS intake(value)
  WHERE lower(trim(value)) IN (
    'jan', 'january', 'feb', 'february', 'mar', 'march', 'apr', 'april', 'may',
    'jun', 'june', 'jul', 'july', 'aug', 'august', 'sep', 'sept', 'september',
    'oct', 'october', 'nov', 'november', 'dec', 'december'
  )
)
WHERE cardinality("intake_codes") = 0;

CREATE INDEX IF NOT EXISTS "program_offerings_instruction_languages_idx"
  ON "program_offerings" USING gin ("instruction_languages");

CREATE INDEX IF NOT EXISTS "program_offerings_intake_codes_idx"
  ON "program_offerings" USING gin ("intake_codes");
