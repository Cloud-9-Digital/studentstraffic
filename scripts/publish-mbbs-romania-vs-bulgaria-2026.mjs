import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const root = process.cwd();
const slug = "mbbs-in-romania-vs-bulgaria-for-indian-students-2026";
const title =
  "MBBS in Romania vs Bulgaria 2026: Which Is Better for Indian Students?";
const excerpt =
  "A practical Romania vs Bulgaria MBBS comparison for Indian students covering English-medium proof, NMC checks, fees, admission tests, clinical language, EU mobility and total-cost decisions.";
const metaTitle = "Romania vs Bulgaria MBBS 2026: Which Is Better?";
const metaDescription =
  "Compare MBBS in Romania vs Bulgaria for Indian students: fees, English-medium proof, NMC checks, admissions, clinical language and EU career fit.";
const coverPath = path.join(root, "tmp", "blog-covers", `${slug}.png`);
const contentPath = path.join(root, "tmp", "blog-covers", `${slug}.md`);

const content = fs.readFileSync(contentPath, "utf8");
if (!fs.existsSync(coverPath))
  throw new Error(`Cover image not found: ${coverPath}`);
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary configuration is incomplete.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploaded = await cloudinary.uploader.upload(coverPath, {
  folder: "studentstraffic/blog-covers",
  public_id: slug,
  overwrite: true,
  resource_type: "image",
});

const sql = neon(process.env.DATABASE_URL);
const publishedAt = new Date();
const readingTimeMinutes = Math.max(
  1,
  Math.ceil(content.trim().split(/\s+/).length / 200),
);

await sql`
  INSERT INTO blog_posts (
    slug, title, excerpt, content, cover_url, category, meta_title,
    meta_description, author_slug, status, reading_time_minutes,
    published_at, created_at, updated_at
  ) VALUES (
    ${slug}, ${title}, ${excerpt}, ${content}, ${uploaded.secure_url},
    ${"Comparison Guide"}, ${metaTitle}, ${metaDescription},
    ${"bharat-vasireddy"}, ${"published"}, ${readingTimeMinutes},
    ${publishedAt}, ${publishedAt}, ${publishedAt}
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    content = EXCLUDED.content,
    cover_url = EXCLUDED.cover_url,
    category = EXCLUDED.category,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    author_slug = EXCLUDED.author_slug,
    status = EXCLUDED.status,
    reading_time_minutes = EXCLUDED.reading_time_minutes,
    published_at = EXCLUDED.published_at,
    updated_at = EXCLUDED.updated_at
`;

console.log(
  JSON.stringify({
    slug,
    title,
    coverUrl: uploaded.secure_url,
    publishedAt,
    readingTimeMinutes,
    wordCount: content.trim().split(/\s+/).length,
  }),
);
