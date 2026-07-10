-- Ensure replayed WATI webhook events cannot create duplicate inbound leads.
-- Keep the oldest record for any historical duplicate before adding the index.
WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY wati_whatsapp_message_id
      ORDER BY created_at ASC NULLS LAST, id ASC
    ) AS row_number
  FROM leads
  WHERE wati_whatsapp_message_id IS NOT NULL
)
UPDATE leads
SET
  wati_whatsapp_message_id = NULL,
  wati_message_error = COALESCE(wati_message_error, 'duplicate WATI webhook record')
WHERE id IN (
  SELECT id FROM ranked WHERE row_number > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS leads_wati_whatsapp_message_unique_idx
  ON leads (wati_whatsapp_message_id)
  WHERE wati_whatsapp_message_id IS NOT NULL;
