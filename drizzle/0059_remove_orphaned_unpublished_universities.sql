-- Remove unpublished staging universities that are not owned by the research
-- queue and therefore cannot be completed or reached through the public site.
-- Their unpublished program rows are removed by the university FK cascade.
DELETE FROM universities
WHERE published = false
  AND slug IN (
    'kirov-state-medical-university-komi-branch',
    'sakhalin-state-university',
    'tomsk-state-university',
    'yelets-state-bunin-university'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM university_research_queue q
    WHERE q.matched_university_id = universities.id
       OR q.published_university_slug = universities.slug
  );
