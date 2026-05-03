import { neon } from "@neondatabase/serverless";
import "dotenv/config";

async function main() {
  console.log("Applying neet_score migration...");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`ALTER TABLE "leads" ADD COLUMN "neet_score" integer`;
    console.log("✅ Migration applied successfully! The neet_score column has been added.");
  } catch (error) {
    if (error?.message?.includes("already exists") || error?.code === "42701") {
      console.log("✅ Column already exists, no action needed.");
    } else {
      console.error("❌ Migration failed:", error.message);
      console.error("Full error:", error);
      process.exit(1);
    }
  }
}

main();
