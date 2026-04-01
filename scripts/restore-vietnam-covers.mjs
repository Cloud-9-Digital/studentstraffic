import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const mapping = JSON.parse(
  readFileSync(join(root, "scripts/cloudinary-mapping.json"), "utf8")
);

async function restoreVietnamCovers() {
  console.log("=== Restoring Vietnam University Covers & Logos ===\n");
  const client = await pool.connect();
  let updatedCount = 0;

  try {
    const { rows: allVietnamSlugs } = await client.query(`
      SELECT slug FROM universities WHERE country_id = (SELECT id FROM countries WHERE name = 'Vietnam')
    `);

    for (const [localPath, cloudinaryUrl] of Object.entries(mapping)) {
      if (!localPath.startsWith("/images/universities/")) continue;
      
      const filenameMatch = localPath.match(/universities\/([^.]+)\./);
      if (!filenameMatch) continue;
      const filename = filenameMatch[1];
      
      let isLogo = filename.endsWith("-logo");
      let isCover = !isLogo;
      
      let inferredSlug = filename.replace("-campus", "").replace("-logo", "");
      
      // Manual fixes for tough mismatches
      if (inferredSlug === "hanoi-medical-university") inferredSlug = "hanoi-medical-university";
      if (inferredSlug === "vinuniversity") inferredSlug = "vinuniversity-college-health-sciences";
      if (inferredSlug === "vnu-university-medicine-pharmacy-hanoi") inferredSlug = "vnu-university-of-medicine-and-pharmacy-hanoi";
      if (inferredSlug === "vietnam-university-traditional-medicine") inferredSlug = "vietnam-university-of-traditional-medicine";

      // Find best match slug from DB
      let targetSlug = allVietnamSlugs.find(r => r.slug === inferredSlug)?.slug;
      if (!targetSlug) {
        // Try partial match
        targetSlug = allVietnamSlugs.find(r => r.slug.startsWith(inferredSlug))?.slug;
      }

      if (!targetSlug) {
        console.log(`⚠️  Could not find matching DB slug for visual: ${filename}`);
        continue;
      }

      let updateQuery = "";
      if (isCover) {
        updateQuery = `UPDATE universities SET cover_image_url = $1, updated_at = NOW() WHERE slug = $2`;
      } else if (isLogo) {
        updateQuery = `UPDATE universities SET logo_url = $1, updated_at = NOW() WHERE slug = $2`;
      }
      
      if (updateQuery) {
        const res = await client.query(updateQuery, [cloudinaryUrl, targetSlug]);
        if (res.rowCount > 0) {
          console.log(`✅ Restored ${isCover ? "Cover" : "Logo"} for: ${targetSlug}`);
          updatedCount++;
        }
      }
    }
    
    console.log(`\nSuccessfully restored ${updatedCount} visual assets for Vietnam universities.`);
  } catch (error) {
    console.error("Error restoring images:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

restoreVietnamCovers();
