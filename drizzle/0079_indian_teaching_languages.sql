-- Allow Hindi, Sanskrit, Telugu and Urdu as programme teaching-language codes.
-- Keeps the database guard in step with `teachingLanguageCodes` in lib/catalogue-facets.ts
-- (India batch 3: language M.A. programmes taught in the language concerned).
-- Only the allow-list changes; the function body is otherwise identical to 0073.
CREATE OR REPLACE FUNCTION normalize_program_medium_fields() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE canonical text;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.medium_details IS NULL THEN NEW.medium_details := OLD.medium_details; END IF;
  SELECT coalesce(array_agg(DISTINCT code ORDER BY code), ARRAY[]::text[]) INTO NEW.instruction_languages
  FROM unnest(NEW.instruction_languages) AS code;
  IF EXISTS (SELECT 1 FROM unnest(NEW.instruction_languages) AS code WHERE code <> ALL (ARRAY['albanian','arabic','bulgarian','catalan','chinese','croatian','czech','dutch','english','french','georgian','german','greek','hindi','hungarian','italian','japanese','korean','kyrgyz','lithuanian','maltese','norwegian','polish','portuguese','romanian','russian','sanskrit','serbian','slovak','slovenian','spanish','swedish','telugu','turkish','urdu','uzbek','vietnamese'])) THEN
    RAISE EXCEPTION 'Use a supported instruction_languages code';
  END IF;
  SELECT coalesce(string_agg(initcap(code), ' / ' ORDER BY code), 'Not confirmed') INTO canonical FROM unnest(NEW.instruction_languages) AS code;
  IF nullif(trim(NEW.medium), '') IS NOT NULL AND NEW.medium <> canonical AND NEW.medium IS DISTINCT FROM NEW.medium_details THEN
    NEW.medium_details := concat_ws(E'\n\n', nullif(NEW.medium_details, ''), NEW.medium);
  END IF;
  NEW.medium := canonical;
  RETURN NEW;
END;
$$;
