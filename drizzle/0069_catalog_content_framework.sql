ALTER TABLE program_offerings
  ADD COLUMN IF NOT EXISTS fee_status text,
  ADD COLUMN IF NOT EXISTS fee_academic_year text,
  ADD COLUMN IF NOT EXISTS indicative_annual_tuition_min_usd integer,
  ADD COLUMN IF NOT EXISTS indicative_annual_tuition_max_usd integer;

ALTER TABLE program_offerings
  ADD CONSTRAINT program_offerings_fee_status_check
  CHECK (fee_status IS NULL OR fee_status IN ('confirmed', 'indicative', 'on_request'));

ALTER TABLE program_offerings
  ADD CONSTRAINT program_offerings_indicative_fee_range_check
  CHECK (
    indicative_annual_tuition_min_usd IS NULL
    OR indicative_annual_tuition_max_usd IS NULL
    OR indicative_annual_tuition_min_usd <= indicative_annual_tuition_max_usd
  );

CREATE TABLE IF NOT EXISTS catalog_content_evidence (
  id serial PRIMARY KEY,
  country_id integer REFERENCES countries(id) ON DELETE CASCADE,
  university_id integer REFERENCES universities(id) ON DELETE CASCADE,
  program_offering_id integer REFERENCES program_offerings(id) ON DELETE CASCADE,
  public_field text NOT NULL,
  claim_text text NOT NULL,
  content_status text NOT NULL CHECK (content_status IN ('verified', 'indicative', 'omit')),
  source_label text NOT NULL,
  source_url text NOT NULL,
  source_grade text NOT NULL CHECK (source_grade IN ('A', 'B', 'C')),
  checked_at text NOT NULL,
  review_by text NOT NULL,
  internal_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT catalog_content_evidence_one_entity_check CHECK (
    ((country_id IS NOT NULL)::integer + (university_id IS NOT NULL)::integer + (program_offering_id IS NOT NULL)::integer) = 1
  )
);

CREATE INDEX IF NOT EXISTS catalog_content_evidence_country_idx
  ON catalog_content_evidence (country_id);
CREATE INDEX IF NOT EXISTS catalog_content_evidence_university_idx
  ON catalog_content_evidence (university_id);
CREATE INDEX IF NOT EXISTS catalog_content_evidence_programme_idx
  ON catalog_content_evidence (program_offering_id);
CREATE INDEX IF NOT EXISTS catalog_content_evidence_review_by_idx
  ON catalog_content_evidence (review_by);
