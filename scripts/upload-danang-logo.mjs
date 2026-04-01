import { v2 as cloudinary } from "cloudinary";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function uploadAndAssignLogo() {
  console.log("=== Uploading Danang Logo to Cloudinary ===");
  const client = await pool.connect();
  try {
    // The official domain for University of Medicine and Pharmacy - The University of Danang is ump.udn.vn
    // We will use clearbit logo API purely to fetch the raw image buffer, 
    // and upload THAT buffer to Cloudinary, bypassing the Next.js Unconfigured Host issue!
    
    // We can also just pass the URL straight to cloudinary.uploader.upload
    const uploadResult = await cloudinary.uploader.upload(
      "https://www.udn.vn/Portals/1/logo_update.png",
      {
        folder: "studentstraffic/images/universities",
        public_id: "university-of-danang-logo",
        resource_type: "image",
      }
    );
    
    console.log("Upload Success! URL =>", uploadResult.secure_url);
    
    const updateQuery = `
      UPDATE universities
      SET logo_url = $1, updated_at = NOW()
      WHERE slug = 'university-of-danang-medicine-pharmacy'
    `;
    const res = await client.query(updateQuery, [uploadResult.secure_url]);
    console.log(`Assigned logo to Danang. Row count: ${res.rowCount}`);
  } catch (error) {
    console.error("Pipeline Error:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

uploadAndAssignLogo();
