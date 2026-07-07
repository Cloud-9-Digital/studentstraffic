/**
 * Seed Pharmacy (Bachelor of Pharmacy) as a course in the courses table.
 * Run: node scripts/seed-pharmacy-course.mjs
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const PHARMACY_COURSE = {
  slug: "pharmacy",
  name: "Bachelor of Pharmacy",
  shortName: "B.Pharm",
  stream: "pharmacy",
  durationYears: 4,
  summary:
    "Bachelor of Pharmacy (B.Pharm) is a four-year undergraduate degree covering pharmaceutical chemistry, pharmacology, pharmaceutics, and pharmacy practice. Graduates are qualified to work as registered pharmacists in hospitals, community pharmacies, and the pharmaceutical industry, and the degree opens pathways into clinical research, drug manufacturing, quality control, and higher study such as M.Pharm and Pharm.D.",
  metaTitle:
    "Bachelor of Pharmacy (B.Pharm) Abroad for Indian Students 2026 | Fees, Eligibility, Careers | Students Traffic",
  metaDescription:
    "Complete guide to studying Bachelor of Pharmacy (B.Pharm) abroad for Indian students: course structure, duration, eligibility, tuition fees, recognised universities, and career and registration pathways.",
};

async function seed() {
  const client = await pool.connect();

  try {
    console.log("Upserting course: Bachelor of Pharmacy...");

    const result = await client.query(
      `
      INSERT INTO courses (
        slug, name, short_name, stream, duration_years,
        summary, meta_title, meta_description,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8,
        NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        name               = EXCLUDED.name,
        short_name         = EXCLUDED.short_name,
        stream             = EXCLUDED.stream,
        duration_years     = EXCLUDED.duration_years,
        summary            = EXCLUDED.summary,
        meta_title         = EXCLUDED.meta_title,
        meta_description   = EXCLUDED.meta_description,
        updated_at         = NOW()
      RETURNING id
      `,
      [
        PHARMACY_COURSE.slug,
        PHARMACY_COURSE.name,
        PHARMACY_COURSE.shortName,
        PHARMACY_COURSE.stream,
        PHARMACY_COURSE.durationYears,
        PHARMACY_COURSE.summary,
        PHARMACY_COURSE.metaTitle,
        PHARMACY_COURSE.metaDescription,
      ]
    );

    const courseId = result.rows[0].id;
    console.log(`Pharmacy course upserted (id=${courseId})`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
