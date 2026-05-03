import { getDb } from "@/lib/db/server";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Applying neet_score migration...");

  const db = getDb();

  if (!db) {
    console.error("Database connection not available. Check your DATABASE_URL environment variable.");
    process.exit(1);
  }

  try {
    await db.execute(sql`ALTER TABLE "leads" ADD COLUMN "neet_score" integer`);
    console.log("✅ Migration applied successfully! The neet_score column has been added.");
  } catch (error: any) {
    if (error?.message?.includes("already exists") || error?.code === "42701") {
      console.log("✅ Column already exists, no action needed.");
    } else {
      console.error("❌ Migration failed:", error.message);
      process.exit(1);
    }
  }
}

main();
