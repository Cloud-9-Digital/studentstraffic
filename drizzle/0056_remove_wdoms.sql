-- Remove the retired WDOMS directory and all WDOMS-backed queue records.
-- Dedicated university pages are now the source of truth.

DELETE FROM "university_research_drafts" drafts
USING "university_research_queue" queue
WHERE drafts.queue_id = queue.id
  AND queue.wdoms_school_id NOT LIKE 'disc-%'
  AND queue.wdoms_school_id NOT LIKE 'live:%';

DELETE FROM "university_research_queue"
WHERE wdoms_school_id NOT LIKE 'disc-%'
  AND wdoms_school_id NOT LIKE 'live:%';

DROP TABLE IF EXISTS "wdoms_directory_entries";

DROP INDEX IF EXISTS "university_research_queue_wdoms_school_id_idx";
DROP INDEX IF EXISTS "university_research_drafts_wdoms_school_id_idx";

ALTER TABLE "university_research_queue"
  RENAME COLUMN "wdoms_school_id" TO "discovery_key";

ALTER TABLE "university_research_drafts"
  RENAME COLUMN "wdoms_school_id" TO "discovery_key";

ALTER TABLE "university_research_drafts"
  DROP COLUMN IF EXISTS "wdoms_url";

CREATE UNIQUE INDEX "university_research_queue_discovery_key_idx"
  ON "university_research_queue" USING btree ("discovery_key");

CREATE INDEX "university_research_drafts_discovery_key_idx"
  ON "university_research_drafts" USING btree ("discovery_key");
