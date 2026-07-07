/**
 * Seed: "How to Study MBBS in Kyrgyzstan" — step-by-step process guide
 * Distinct angle from mbbs-in-kyrgyzstan-2026-complete-guide (which covers
 * university comparisons, fees, curriculum). This post covers the actual
 * step-by-step process: eligibility, application, documents, visa, arrival,
 * and FMGE/NExT licensing after return.
 *
 * Run: node scripts/seed-blog-how-to-study-mbbs-kyrgyzstan.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import readingTime from "reading-time";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envContent = readFileSync(join(root, ".env"), "utf8");
const env = Object.fromEntries(
  envContent.split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^['"]|['"]$/g,"")]; })
);

// Reuse the existing Kyrgyzstan cover image already hosted on Cloudinary
// (uploaded for mbbs-in-kyrgyzstan-2026-complete-guide) — no new upload needed.
const COVER_URL = "https://res.cloudinary.com/dlh6tmx7h/image/upload/v1774957992/studentstraffic/blog/mbbs-kyrgyzstan-2026.jpg";

const post = {
  slug: "how-to-study-mbbs-in-kyrgyzstan",
  category: "MBBS Abroad",
  title: "How to Study MBBS in Kyrgyzstan: A Step-by-Step Guide for Indian Students (2026)",
  excerpt: "A practical, step-by-step walkthrough of how to study MBBS in Kyrgyzstan — from NEET eligibility and university selection to documents, visa, arrival, and the FMGE/NExT licensing process after you return.",
  metaTitle: "How to Study MBBS in Kyrgyzstan: Step-by-Step Process (2026)",
  metaDescription: "Learn how to study MBBS in Kyrgyzstan step by step: NEET eligibility, choosing a university, application documents, visa process, arrival, and FMGE/NExT licensing after returning to India.",
  content: readFileSync(join(root, "scripts", "content-how-to-study-mbbs-kyrgyzstan.md"), "utf8"),
};

async function run() {
  console.log("=== Blog Seeder: How to Study MBBS in Kyrgyzstan ===\n");

  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();

  try {
    const now = new Date();
    const r = await client.query(
      `INSERT INTO blog_posts (slug, title, excerpt, content, cover_url, category, meta_title, meta_description, status, reading_time_minutes, published_at, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'published',$9,$10,$10,$10)
       ON CONFLICT (slug) DO UPDATE SET
         title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, content=EXCLUDED.content,
         cover_url=EXCLUDED.cover_url, category=EXCLUDED.category,
         meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description,
         status='published', reading_time_minutes=EXCLUDED.reading_time_minutes,
         published_at=EXCLUDED.published_at, updated_at=EXCLUDED.updated_at
       RETURNING id, slug`,
      [post.slug, post.title, post.excerpt, post.content, COVER_URL,
       post.category, post.metaTitle, post.metaDescription,
       Math.ceil(readingTime(post.content).minutes), now]
    );
    console.log(`  Upserted [${r.rows[0].id}]: ${r.rows[0].slug}`);
  } finally {
    client.release();
    await pool.end();
  }
  console.log("\nDone.\n");
}
run().catch(e => { console.error(e); process.exit(1); });
