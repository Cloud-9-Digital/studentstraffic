ALTER TABLE program_offerings ADD COLUMN IF NOT EXISTS medium_details text;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION normalize_program_medium_fields() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE canonical text;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.medium_details IS NULL THEN NEW.medium_details := OLD.medium_details; END IF;
  SELECT coalesce(array_agg(DISTINCT code ORDER BY code), ARRAY[]::text[]) INTO NEW.instruction_languages
  FROM unnest(NEW.instruction_languages) AS code;
  IF EXISTS (SELECT 1 FROM unnest(NEW.instruction_languages) AS code WHERE code <> ALL (ARRAY['albanian','arabic','bulgarian','catalan','chinese','croatian','czech','dutch','english','french','georgian','german','greek','hungarian','italian','japanese','korean','kyrgyz','lithuanian','maltese','norwegian','polish','portuguese','romanian','russian','serbian','slovak','slovenian','spanish','swedish','turkish','uzbek','vietnamese'])) THEN
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
--> statement-breakpoint
DROP TRIGGER IF EXISTS program_medium_normalization ON program_offerings;
--> statement-breakpoint
CREATE TRIGGER program_medium_normalization BEFORE INSERT OR UPDATE OF medium, instruction_languages ON program_offerings FOR EACH ROW EXECUTE FUNCTION normalize_program_medium_fields();
