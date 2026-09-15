import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { neon } from "@neondatabase/serverless";

const slug = "mbbs-in-university-of-georgia-vs-european-university-2026";
const title = "University of Georgia vs European University for MBBS 2026: Which Is Better?";
const root = process.cwd();
const contentPath = path.join(root, "tmp", "blog-covers", slug + ".md");
const imagePath = path.join(root, "tmp", "blog-covers", slug + ".png");
const content = fs.readFileSync(contentPath, "utf8");
const excerpt = "Compare University of Georgia vs European University for MBBS in 2026 on tuition, clinical training, admissions, recognition, accommodation and India-return checks.";
const metaTitle = "University of Georgia vs European University MBBS";
const metaDescription = "University of Georgia vs European University MBBS 2026: compare tuition, clinical training, admissions, recognition and India-return checks.";

if (!fs.existsSync(imagePath)) throw new Error("Cover image missing: " + imagePath);
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) throw new Error("Cloudinary configuration is incomplete.");

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
const uploaded = await cloudinary.uploader.upload(imagePath, { folder: "studentstraffic/blog-covers", public_id: slug, overwrite: false, resource_type: "image" });
const publishedAt = new Date();
const readingTimeMinutes = Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
const sql = neon(process.env.DATABASE_URL);
await sql.query(
  "INSERT INTO blog_posts (slug, title, excerpt, content, cover_url, category, meta_title, meta_description, author_slug, status, reading_time_minutes, published_at, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12,$12)",
  [slug, title, excerpt, content, uploaded.secure_url, "University Selection", metaTitle, metaDescription, "bharat-vasireddy", "published", readingTimeMinutes, publishedAt],
);
console.log(JSON.stringify({ slug, title, coverUrl: uploaded.secure_url, publishedAt: publishedAt.toISOString(), readingTimeMinutes, wordCount: content.trim().split(/\s+/).length }));
