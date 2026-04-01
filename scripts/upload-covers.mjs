import { v2 as cloudinary } from "cloudinary";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();

// Standard configuration reading from process.env.CLOUDINARY_URL
// If not implicitly working, we should rely on process.env.CLOUDINARY_URL format.
// The user has standard Next.js .env setup with CLOUDINARY credentials.

neonConfig.webSocketConstructor = WebSocket;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const artifactDir = "/Users/bharat/.gemini/antigravity/brain/576f9bd3-16af-43aa-9821-24bb2ad2f05c";

const mapping = [
  {
    country_id: 47, // Georgia
    file: `${artifactDir}/mbbs_georgia_2026_hero_1774978670811.png`,
    folder: "heroes/georgia"
  },
  {
    country_id: 48, // Kyrgyzstan
    file: `${artifactDir}/mbbs_kyrgyzstan_2026_hero_1774978699114.png`,
    folder: "heroes/kyrgyzstan"
  },
  {
    country_id: 49, // Uzbekistan
    file: `${artifactDir}/mbbs_uzbekistan_2026_hero_1774978199820.png`,
    folder: "heroes/uzbekistan"
  }
];

async function run() {
  console.log("=== Uploading Phase 2 Heroes to Cloudinary ===");
  const client = await pool.connect();
  try {
    for (const item of mapping) {
      console.log(`\nUploading image for Country ID: ${item.country_id}...`);
      const uploadResult = await cloudinary.uploader.upload(item.file, {
        folder: item.folder,
        resource_type: "image",
      });
      
      console.log("Upload Success! URL =>", uploadResult.secure_url);
      
      const updateQuery = `
        UPDATE universities
        SET cover_image_url = $1, updated_at = NOW()
        WHERE country_id = $2
      `;
      const res = await client.query(updateQuery, [uploadResult.secure_url, item.country_id]);
      console.log(`Assigned to ${res.rowCount} Universities.`);
    }
    console.log("\n✅ All visual assignments complete!");
  } catch (error) {
    console.error("Pipeline Error:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
