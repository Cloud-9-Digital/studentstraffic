ALTER TABLE "universities" DROP COLUMN "has_hostel";--> statement-breakpoint
ALTER TABLE "program_offerings" DROP COLUMN "hostel_usd";--> statement-breakpoint
ALTER TABLE "program_offerings" DROP COLUMN "nmc_eligible";--> statement-breakpoint
ALTER TABLE "program_offerings" DROP COLUMN "usmle_eligible";--> statement-breakpoint
ALTER TABLE "program_offerings" DROP COLUMN "has_hostel";--> statement-breakpoint
DROP INDEX IF EXISTS "program_offerings_nmc_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "program_offerings_usmle_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "program_offerings_hostel_idx";--> statement-breakpoint
ALTER TABLE "search_documents" DROP COLUMN "nmc_eligible";--> statement-breakpoint
ALTER TABLE "search_documents" DROP COLUMN "usmle_eligible";--> statement-breakpoint
ALTER TABLE "search_documents" DROP COLUMN "has_hostel";--> statement-breakpoint
DROP INDEX IF EXISTS "search_documents_nmc_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "search_documents_usmle_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "search_documents_hostel_idx";
