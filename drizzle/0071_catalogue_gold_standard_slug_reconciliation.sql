DO $$
DECLARE
  mapping record;
  established_offering_id integer;
  enriched_offering_id integer;
BEGIN
  FOR mapping IN
    SELECT * FROM (VALUES
      ('semmelweis-university', 'general-medicine-md-semmelweis', 'semmelweis-university-general-medicine'),
      ('dai-nam-university-faculty-of-medicine', 'mbbs-in-dai-nam-university-faculty-of-medicine', 'dai-nam-university-faculty-of-medicine-mbbs'),
      ('dong-a-university-college-of-medicine', 'mbbs-in-dong-a-university-college-of-medicine', 'dong-a-university-college-of-medicine-mbbs'),
      ('buon-ma-thuot-medical-university', 'mbbs-in-buon-ma-thuot-medical-university', 'buon-ma-thuot-medical-university-mbbs'),
      ('can-tho-university-medicine-pharmacy', 'mbbs-in-can-tho-university-medicine-pharmacy', 'can-tho-university-medicine-pharmacy-mbbs')
    ) AS mappings(university_slug, established_slug, enriched_slug)
  LOOP
    SELECT po.id
      INTO established_offering_id
    FROM program_offerings po
    JOIN universities u ON u.id = po.university_id
    WHERE u.slug = mapping.university_slug
      AND po.slug = mapping.established_slug
    LIMIT 1;

    SELECT po.id
      INTO enriched_offering_id
    FROM program_offerings po
    JOIN universities u ON u.id = po.university_id
    WHERE u.slug = mapping.university_slug
      AND po.slug = mapping.enriched_slug
    LIMIT 1;

    IF established_offering_id IS NOT NULL AND enriched_offering_id IS NOT NULL THEN
      DELETE FROM program_offerings WHERE id = established_offering_id;
      UPDATE program_offerings
        SET slug = mapping.established_slug, updated_at = now()
      WHERE id = enriched_offering_id;
    END IF;
  END LOOP;
END $$;
