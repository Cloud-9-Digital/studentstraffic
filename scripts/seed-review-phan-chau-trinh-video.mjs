import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env") });

const sql = neon(process.env.DATABASE_URL);

const [university] = await sql`
  SELECT id, name, slug
  FROM universities
  WHERE name ILIKE '%phan chau trinh%'
  LIMIT 1
`;

if (!university) {
  console.error("University not found: Phan Chau Trinh");
  process.exit(1);
}

console.log(`Found university: [${university.id}] ${university.name} (${university.slug})`);

const videoId = "G1evnYo2KrY";
const youtubeUrl = `https://youtu.be/${videoId}`;

await sql`
  INSERT INTO university_reviews (
    university_id,
    review_type,
    reviewer_name,
    reviewer_context,
    youtube_url,
    youtube_video_id,
    source_path,
    visibility_status,
    verification_status,
    is_featured,
    is_short
  ) VALUES (
    ${university.id},
    'youtube_video',
    'Rahul Verma',
    'MBBS 3rd Year Student',
    ${youtubeUrl},
    ${videoId},
    ${`/universities/${university.slug}`},
    'live',
    'unverified',
    false,
    true
  )
`;

console.log("Review inserted successfully.");
