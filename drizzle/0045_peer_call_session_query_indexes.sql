CREATE INDEX IF NOT EXISTS "peer_call_sessions_peer_status_expires_idx"
  ON "peer_call_sessions" ("peer_user_id", "status", "expires_at");

CREATE INDEX IF NOT EXISTS "peer_call_sessions_caller_status_expires_idx"
  ON "peer_call_sessions" ("caller_user_id", "status", "expires_at");

CREATE INDEX IF NOT EXISTS "peer_call_sessions_peer_caller_status_expires_idx"
  ON "peer_call_sessions" ("peer_id", "caller_user_id", "status", "expires_at");
