CREATE TABLE IF NOT EXISTS "mobile_sessions" (
  "id" varchar(255) PRIMARY KEY NOT NULL,
  "user_id" varchar(255) NOT NULL,
  "token_hash" varchar(255) NOT NULL,
  "token_prefix" varchar(16) NOT NULL,
  "device_name" varchar(255),
  "platform" varchar(50),
  "app_version" varchar(50),
  "push_token" text,
  "last_used_at" timestamp DEFAULT now() NOT NULL,
  "expires_at" timestamp NOT NULL,
  "revoked_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "mobile_sessions"
  ADD CONSTRAINT "mobile_sessions_user_id_users_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE cascade ON UPDATE no action;

CREATE UNIQUE INDEX IF NOT EXISTS "mobile_sessions_token_hash_idx"
ON "mobile_sessions" ("token_hash");

CREATE INDEX IF NOT EXISTS "mobile_sessions_user_idx"
ON "mobile_sessions" ("user_id");

CREATE INDEX IF NOT EXISTS "mobile_sessions_expires_idx"
ON "mobile_sessions" ("expires_at");
