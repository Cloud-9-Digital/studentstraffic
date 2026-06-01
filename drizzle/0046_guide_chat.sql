CREATE TABLE IF NOT EXISTS "guide_conversations" (
  "id" serial PRIMARY KEY NOT NULL,
  "student_user_id" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "peer_id" integer NOT NULL REFERENCES "student_peers"("id") ON DELETE CASCADE,
  "peer_user_id" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "last_message_text" text,
  "last_message_at" timestamp with time zone,
  "student_last_read_at" timestamp with time zone,
  "peer_last_read_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "guide_conversations_student_peer_unique_idx"
  ON "guide_conversations" ("student_user_id", "peer_id");

CREATE INDEX IF NOT EXISTS "guide_conversations_student_last_message_idx"
  ON "guide_conversations" ("student_user_id", "last_message_at");

CREATE INDEX IF NOT EXISTS "guide_conversations_peer_last_message_idx"
  ON "guide_conversations" ("peer_user_id", "last_message_at");

CREATE TABLE IF NOT EXISTS "guide_messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "conversation_id" integer NOT NULL REFERENCES "guide_conversations"("id") ON DELETE CASCADE,
  "sender_user_id" varchar(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "message_type" text NOT NULL DEFAULT 'text',
  "body" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "edited_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "guide_messages_conversation_created_idx"
  ON "guide_messages" ("conversation_id", "created_at");

CREATE INDEX IF NOT EXISTS "guide_messages_sender_idx"
  ON "guide_messages" ("sender_user_id");
