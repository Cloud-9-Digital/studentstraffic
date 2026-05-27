CREATE TABLE IF NOT EXISTS "peer_call_sessions" (
  "id" text PRIMARY KEY,
  "channel_name" text NOT NULL UNIQUE,
  "university_id" integer NOT NULL REFERENCES "universities"("id") ON DELETE CASCADE,
  "peer_id" integer NOT NULL REFERENCES "student_peers"("id") ON DELETE CASCADE,
  "peer_user_id" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "caller_user_id" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "status" text NOT NULL DEFAULT 'ringing',
  "started_at" timestamp with time zone,
  "answered_at" timestamp with time zone,
  "ended_at" timestamp with time zone,
  "expires_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "peer_call_sessions_peer_idx"
  ON "peer_call_sessions" ("peer_id");

CREATE INDEX IF NOT EXISTS "peer_call_sessions_peer_user_idx"
  ON "peer_call_sessions" ("peer_user_id");

CREATE INDEX IF NOT EXISTS "peer_call_sessions_caller_user_idx"
  ON "peer_call_sessions" ("caller_user_id");

CREATE INDEX IF NOT EXISTS "peer_call_sessions_status_idx"
  ON "peer_call_sessions" ("status");

CREATE INDEX IF NOT EXISTS "peer_call_sessions_created_at_idx"
  ON "peer_call_sessions" ("created_at");
