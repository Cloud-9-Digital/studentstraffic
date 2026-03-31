/**
 * Upload cover images for existing blog posts and patch their cover_url in the DB.
 * Run: node scripts/update-blog-images.mjs
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const envContent = readFileSync(join(root, ".env"), "utf8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      const key = l.slice(0, idx).trim();
      const val = l.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
      return [key, val];
    })
);

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const BRAIN = "/Users/bharat/.gemini/antigravity/brain/6120125f-960e-4e07-a96e-a884a178093f";

const updates = [
  {
    slug: "mbbs-in-russia-2026-complete-guide",
    localFile: join(BRAIN, "blog_mbbs_russia_1774957731834.png"),
    publicId: "studentstraffic/blog/mbbs-russia-2026",
  },
  {
    slug: "fmge-nmc-screening-test-2026-complete-preparation-guide",
    localFile: join(BRAIN, "blog_fmge_prep_1774957749144.png"),
    publicId: "studentstraffic/blog/fmge-prep-2026",
  },
  {
    slug: "mbbs-in-georgia-2026-complete-guide",
    localFile: join(BRAIN, "blog_mbbs_georgia_1774957765587.png"),
    publicId: "studentstraffic/blog/mbbs-georgia-2026",
  },
  {
    slug: "mbbs-in-kyrgyzstan-2026-complete-guide",
    localFile: join(BRAIN, "blog_mbbs_kyrgyzstan_1774957783342.png"),
    publicId: "studentstraffic/blog/mbbs-kyrgyzstan-2026",
  },
  {
    slug: "mbbs-in-uzbekistan-2026-complete-guide",
    localFile: join(BRAIN, "blog_mbbs_uzbekistan_1774957802855.png"),
    publicId: "studentstraffic/blog/mbbs-uzbekistan-2026",
  },
  {
    slug: "mbbs-in-vietnam-2026-complete-guide",
    localFile: join(BRAIN, "blog_mbbs_vietnam_1774957819876.png"),
    publicId: "studentstraffic/blog/mbbs-vietnam-2026",
  },
];

async function uploadImage(localPath, publicId) {
  try {
    const existing = await cloudinary.api.resource(publicId);
    console.log(`  [skip] already exists: ${publicId}`);
    return existing.secure_url;
  } catch {
    // not found — upload
  }
  const result = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    overwrite: false,
  });
  console.log(`  [ok] Uploaded → ${result.secure_url}`);
  return result.secure_url;
}

async function run() {
  console.log("=== Updating blog cover images ===\n");

  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();

  try {
    for (const item of updates) {
      console.log(`\nPost: ${item.slug}`);
      const url = await uploadImage(item.localFile, item.publicId);
      if (!url) { console.warn("  [warn] No URL returned, skipping DB update"); continue; }

      const r = await client.query(
        `UPDATE blog_posts SET cover_url = $1, updated_at = NOW()
         WHERE slug = $2 RETURNING id, slug`,
        [url, item.slug]
      );
      if (r.rows.length === 0) {
        console.warn(`  [warn] No row found for slug: ${item.slug}`);
      } else {
        console.log(`  ✓ DB updated: [${r.rows[0].id}] ${r.rows[0].slug}`);
        console.log(`    → ${url}`);
      }
    }
  } finally {
    client.release();
    await pool.end();
  }

  console.log("\n✅ All done!\n");
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
