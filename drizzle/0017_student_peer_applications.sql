CREATE TABLE "student_peer_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"university_id" integer NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"course_name" text,
	"current_year_or_batch" text,
	"enrollment_status" text NOT NULL,
	"proof_url" text NOT NULL,
	"message" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"reviewed_by_admin_id" integer,
	"review_notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);

ALTER TABLE "student_peer_applications" ADD CONSTRAINT "student_peer_applications_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "student_peer_applications" ADD CONSTRAINT "student_peer_applications_reviewed_by_admin_id_admin_users_id_fk" FOREIGN KEY ("reviewed_by_admin_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;

CREATE INDEX "student_peer_applications_university_idx" ON "student_peer_applications" USING btree ("university_id");
CREATE INDEX "student_peer_applications_status_idx" ON "student_peer_applications" USING btree ("status");
CREATE INDEX "student_peer_applications_created_at_idx" ON "student_peer_applications" USING btree ("created_at");
