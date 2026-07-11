ALTER TABLE program_offerings
  ADD COLUMN IF NOT EXISTS audience_eligibility jsonb NOT NULL DEFAULT jsonb_build_object(
    'availability', 'global',
    'eligibleAudiences', jsonb_build_array(),
    'restrictions', jsonb_build_array(),
    'verifiedAt', '',
    'sourceUrl', ''
  );
