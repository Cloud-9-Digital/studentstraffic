-- Add peerUserId to student_peers and student_peer_applications
-- so approved peers and their applications are linked to user accounts

ALTER TABLE "student_peers"
  ADD COLUMN IF NOT EXISTS "peer_user_id" varchar(255)
    REFERENCES "users"("id") ON DELETE SET NULL;

ALTER TABLE "student_peer_applications"
  ADD COLUMN IF NOT EXISTS "peer_user_id" varchar(255)
    REFERENCES "users"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "student_peers_user_idx"
  ON "student_peers" ("peer_user_id");

CREATE INDEX IF NOT EXISTS "student_peer_applications_user_idx"
  ON "student_peer_applications" ("peer_user_id");
