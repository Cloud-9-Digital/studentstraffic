ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS level text NOT NULL DEFAULT 'bachelors',
  ADD COLUMN IF NOT EXISTS discipline text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS aliases text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

UPDATE courses
SET
  level = CASE
    WHEN slug = 'medical-pg' THEN 'masters'
    WHEN slug = 'ausbildung' THEN 'vocational'
    ELSE 'bachelors'
  END,
  discipline = CASE slug
    WHEN 'mbbs' THEN 'general-medicine'
    WHEN 'medical-pg' THEN 'medical-postgraduate'
    WHEN 'bsc-nursing' THEN 'nursing'
    WHEN 'bds' THEN 'dentistry'
    WHEN 'pharmacy' THEN 'pharmacy'
    WHEN 'ausbildung' THEN 'vocational-training'
    ELSE slug
  END,
  aliases = CASE slug
    WHEN 'mbbs' THEN ARRAY['Bachelor of Medicine and Bachelor of Surgery', 'Doctor of Medicine', 'General Medicine', 'Medicine and Surgery']::text[]
    WHEN 'medical-pg' THEN ARRAY['Medical Residency', 'Postgraduate Medical Training']::text[]
    WHEN 'bsc-nursing' THEN ARRAY['Bachelor of Science in Nursing', 'Bachelor of Nursing', 'General Practice Nursing']::text[]
    WHEN 'bds' THEN ARRAY['Bachelor of Dental Surgery', 'Dentistry']::text[]
    WHEN 'pharmacy' THEN ARRAY['Bachelor of Pharmacy', 'Integrated Master of Pharmacy']::text[]
    WHEN 'ausbildung' THEN ARRAY['Vocational Training in Germany']::text[]
    ELSE aliases
  END,
  active = slug NOT IN ('medical-pg', 'pharmacy');

DROP INDEX IF EXISTS program_offerings_university_course_idx;

CREATE INDEX IF NOT EXISTS program_offerings_university_course_idx
  ON program_offerings (university_id, course_id);

CREATE INDEX IF NOT EXISTS courses_active_stream_order_idx
  ON courses (active, stream, display_order);
