ALTER TABLE student_peers ADD COLUMN IF NOT EXISTS accepting_requests boolean NOT NULL DEFAULT true;
ALTER TABLE peer_call_bookings ADD COLUMN IF NOT EXISTS student_blocked_at timestamptz;
ALTER TABLE peer_call_bookings ADD COLUMN IF NOT EXISTS peer_blocked_at timestamptz;
ALTER TABLE peer_call_bookings ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE guide_messages ADD COLUMN IF NOT EXISTS client_nonce varchar(128);
CREATE UNIQUE INDEX IF NOT EXISTS guide_messages_nonce_idx ON guide_messages(conversation_id, sender_user_id, client_nonce);
CREATE TABLE IF NOT EXISTS peer_reports (
  id serial PRIMARY KEY,
  conversation_id integer NOT NULL REFERENCES guide_conversations(id) ON DELETE RESTRICT,
  reporter_user_id varchar(255) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  reason text NOT NULL,
  details text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  resolution_notes text,
  reviewed_by_admin_id integer REFERENCES admin_users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS peer_reports_status_created_idx ON peer_reports(status, created_at);
