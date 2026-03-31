import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const imagePaths = [
  "/Users/bharat/.gemini/antigravity/brain/576f9bd3-16af-43aa-9821-24bb2ad2f05c/historic_moscow_medical_1774984226716.png",
  "/Users/bharat/.gemini/antigravity/brain/576f9bd3-16af-43aa-9821-24bb2ad2f05c/siberian_winter_campus_1774984253422.png",
  "/Users/bharat/.gemini/antigravity/brain/576f9bd3-16af-43aa-9821-24bb2ad2f05c/modern_federal_clinic_1774984271179.png",
  "/Users/bharat/.gemini/antigravity/brain/576f9bd3-16af-43aa-9821-24bb2ad2f05c/southern_russia_autumn_1774984288144.png",
  "/Users/bharat/.gemini/antigravity/brain/576f9bd3-16af-43aa-9821-24bb2ad2f05c/st_petersburg_cultural_1774984310681.png",
];

async function run() {
  const client = await pool.connect();

  try {
    console.log("1. Uploading Hero Images to Cloudinary...");
    const uploadedUrls = [];
    for (const path of imagePaths) {
      console.log(`Uploading: ${path}`);
      const result = await cloudinary.uploader.upload(path, {
        folder: "studentstraffic/universities/covers",
        use_filename: true,
        unique_filename: false,
      });
      uploadedUrls.push(result.secure_url);
    }

    console.log("Uploaded URLs:", uploadedUrls);

    console.log("\n2. Fetching Russian Universities from Database...");
    const { rows: universities } = await client.query(`
      SELECT id, official_website FROM universities WHERE country_id = 45
    `);
    
    console.log(`Found ${universities.length} universities.`);

    console.log("\n3. Assigning Covers and Logos...");
    for (let i = 0; i < universities.length; i++) {
      const uni = universities[i];
      
      // Determine Cover Image (Cycle through the 5 images)
      const coverUrl = uploadedUrls[i % uploadedUrls.length];

      // Determine Logo URL (Clearbit API)
      let logoUrl = null;
      if (uni.official_website) {
        try {
          const urlObj = new URL(uni.official_website);
          const hostname = urlObj.hostname.replace(/^www\./, "");
          logoUrl = `https://logo.clearbit.com/${hostname}`;
        } catch (e) {
          console.error(`Invalid URL for ID ${uni.id}: ${uni.official_website}`);
        }
      }

      await client.query(`
        UPDATE universities
        SET cover_image_url = $1, logo_url = $2
        WHERE id = $3
      `, [coverUrl, logoUrl, uni.id]);

      if (i % 10 === 0) console.log(`Processed ${i} / ${universities.length}...`);
    }

    console.log(`\n✅ Finished updating ${universities.length} universities with Hero Covers and Clearbit Logos!`);

  } catch (error) {
    console.error("FATAL ERROR:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
