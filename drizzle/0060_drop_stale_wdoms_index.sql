-- WDOMS was removed from the queue schema, but its old duplicate unique
-- constraint/index survived the column rename. The canonical discovery-key
-- constraint remains.
ALTER TABLE university_research_queue
  DROP CONSTRAINT IF EXISTS university_research_queue_wdoms_school_id_key;
