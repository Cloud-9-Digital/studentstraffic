-- Keep one canonical offering per university/course pair before expansion.
-- Older batch scripts created unpublished duplicates alongside live rows.
DELETE FROM program_offerings duplicate_rows
USING (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY university_id, course_id
      ORDER BY published DESC, updated_at DESC NULLS LAST, id DESC
    ) AS duplicate_rank
  FROM program_offerings
) ranked
WHERE duplicate_rows.id = ranked.id
  AND ranked.duplicate_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS program_offerings_university_course_idx
  ON program_offerings (university_id, course_id);

CREATE INDEX IF NOT EXISTS program_offerings_published_university_idx
  ON program_offerings (university_id)
  WHERE published = true;
