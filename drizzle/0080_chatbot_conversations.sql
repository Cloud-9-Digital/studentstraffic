-- Chatbot ("Mira") transcripts.
--
-- Two tables rather than one jsonb blob per conversation: the per-message rows
-- are what make "what are students actually asking" queryable, and they let a
-- single answer carry its own token/latency/tool-call record.
--
-- `public_id` is what the browser holds across reloads. The serial id is never
-- exposed, so one visitor cannot walk another visitor's conversation.
CREATE TABLE IF NOT EXISTS "chatbot_conversations" (
  "id" serial PRIMARY KEY NOT NULL,
  "public_id" varchar(64) NOT NULL,
  "visitor_id" text,
  "user_id" varchar(255),
  "lead_id" integer,
  "source_path" text,
  "source_url" text,
  "page_title" text,
  "referrer" text,
  "user_agent" text,
  "ip_address" text,
  "message_count" integer DEFAULT 0 NOT NULL,
  "last_message_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chatbot_messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "conversation_id" integer NOT NULL,
  "role" text NOT NULL,
  "content" text NOT NULL,
  "tool_calls" jsonb,
  "model" text,
  "input_tokens" integer,
  "cached_input_tokens" integer,
  "output_tokens" integer,
  "latency_ms" integer,
  "stop_reason" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- A deleted user or lead must not take the transcript with it: the conversation
-- is still the content signal we keep these rows for. Messages, by contrast,
-- are meaningless without their conversation, so those cascade.
DO $$ BEGIN
  ALTER TABLE "chatbot_conversations" ADD CONSTRAINT "chatbot_conversations_user_id_users_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "chatbot_conversations" ADD CONSTRAINT "chatbot_conversations_lead_id_leads_id_fk"
    FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "chatbot_messages" ADD CONSTRAINT "chatbot_messages_conversation_id_chatbot_conversations_id_fk"
    FOREIGN KEY ("conversation_id") REFERENCES "public"."chatbot_conversations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "chatbot_conversations_public_id_idx" ON "chatbot_conversations" ("public_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chatbot_conversations_visitor_idx" ON "chatbot_conversations" ("visitor_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chatbot_conversations_lead_idx" ON "chatbot_conversations" ("lead_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chatbot_conversations_created_at_idx" ON "chatbot_conversations" ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chatbot_messages_conversation_created_idx" ON "chatbot_messages" ("conversation_id", "created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chatbot_messages_role_created_idx" ON "chatbot_messages" ("role", "created_at");
