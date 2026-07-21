DO $$
DECLARE
  established_offering_id integer;
  enriched_offering_id integer;
BEGIN
  SELECT po.id
    INTO established_offering_id
  FROM program_offerings po
  JOIN universities u ON u.id = po.university_id
  WHERE u.slug = 'university-of-maryland-college-park'
    AND po.slug = 'bs-computer-science-umd'
  LIMIT 1;

  SELECT po.id
    INTO enriched_offering_id
  FROM program_offerings po
  JOIN universities u ON u.id = po.university_id
  WHERE u.slug = 'university-of-maryland-college-park'
    AND po.slug = 'umd-bs-computer-science'
  LIMIT 1;

  IF established_offering_id IS NOT NULL AND enriched_offering_id IS NOT NULL THEN
    DELETE FROM program_offerings WHERE id = established_offering_id;
    UPDATE program_offerings
      SET slug = 'bs-computer-science-umd', updated_at = now()
    WHERE id = enriched_offering_id;
  END IF;
END $$;
