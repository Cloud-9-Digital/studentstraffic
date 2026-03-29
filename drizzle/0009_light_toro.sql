CREATE TABLE "peer_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"university_id" integer NOT NULL,
	"lead_id" integer,
	"matched_peer_id" integer,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"user_state" text NOT NULL,
	"course_interest" text,
	"preferred_contact_mode" text,
	"message" text,
	"source_path" text NOT NULL,
	"source_url" text,
	"source_query" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"page_title" text,
	"document_referrer" text,
	"user_agent" text,
	"ip_address" text,
	"accept_language" text,
	"client_context" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "student_peers" (
	"id" serial PRIMARY KEY NOT NULL,
	"university_id" integer NOT NULL,
	"full_name" text NOT NULL,
	"course_name" text,
	"current_year_or_batch" text,
	"contact_phone" text,
	"contact_email" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "university_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"university_id" integer NOT NULL,
	"review_type" text NOT NULL,
	"reviewer_name" text NOT NULL,
	"reviewer_email" text,
	"reviewer_context" text,
	"review_body" text,
	"youtube_url" text,
	"youtube_video_id" text,
	"source_path" text NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"visibility_status" text DEFAULT 'live' NOT NULL,
	"verification_status" text DEFAULT 'unverified' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "peer_requests" ADD CONSTRAINT "peer_requests_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peer_requests" ADD CONSTRAINT "peer_requests_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peer_requests" ADD CONSTRAINT "peer_requests_matched_peer_id_student_peers_id_fk" FOREIGN KEY ("matched_peer_id") REFERENCES "public"."student_peers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_peers" ADD CONSTRAINT "student_peers_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "university_reviews" ADD CONSTRAINT "university_reviews_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "peer_requests_university_idx" ON "peer_requests" USING btree ("university_id");--> statement-breakpoint
CREATE INDEX "peer_requests_lead_idx" ON "peer_requests" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "peer_requests_status_idx" ON "peer_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "peer_requests_phone_idx" ON "peer_requests" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "peer_requests_created_at_idx" ON "peer_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "student_peers_university_idx" ON "student_peers" USING btree ("university_id");--> statement-breakpoint
CREATE INDEX "student_peers_status_idx" ON "student_peers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "university_reviews_university_idx" ON "university_reviews" USING btree ("university_id");--> statement-breakpoint
CREATE INDEX "university_reviews_type_idx" ON "university_reviews" USING btree ("review_type");--> statement-breakpoint
CREATE INDEX "university_reviews_visibility_idx" ON "university_reviews" USING btree ("visibility_status");--> statement-breakpoint
CREATE INDEX "university_reviews_featured_idx" ON "university_reviews" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "university_reviews_created_at_idx" ON "university_reviews" USING btree ("created_at");--> statement-breakpoint
