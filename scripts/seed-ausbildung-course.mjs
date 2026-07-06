/**
 * Seed Ausbildung as a course in the courses table.
 * Run: node scripts/seed-ausbildung-course.mjs
 */
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const AUSBILDUNG_COURSE = {
  slug: "ausbildung",
  name: "Ausbildung in Germany",
  shortName: "Ausbildung",
  stream: "other",
  durationYears: 3,
  summary:
    "Ausbildung is Germany's government-regulated dual vocational training system. Trainees sign a legal employment contract with a German company from Day 1, earn EUR 724–1,503/month during training, pay zero tuition at public vocational schools, and qualify for a defined permanent residency pathway after completion. Over 320 recognised Ausbildung occupations are available, covering nursing, IT, mechatronics, business administration, hospitality, logistics, and childcare.",
  metaTitle:
    "Ausbildung in Germany for Indian Students 2026 | Earn While You Train | Students Traffic",
  metaDescription:
    "Complete guide to Ausbildung in Germany for Indian students: dual training system, sectors, German language requirements, visa, stipends EUR 724–1,503/month, PR pathway, and step-by-step application process.",
};

async function seed() {
  const client = await pool.connect();

  try {
    console.log("Upserting course: Ausbildung...");

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
        AUSBILDUNG_COURSE.slug,
        AUSBILDUNG_COURSE.name,
        AUSBILDUNG_COURSE.shortName,
        AUSBILDUNG_COURSE.stream,
        AUSBILDUNG_COURSE.durationYears,
        AUSBILDUNG_COURSE.summary,
        AUSBILDUNG_COURSE.metaTitle,
        AUSBILDUNG_COURSE.metaDescription,
      ]
    );

    const courseId = result.rows[0].id;
    console.log(`Ausbildung course upserted (id=${courseId})`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
