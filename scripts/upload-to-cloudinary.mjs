/**
 * Uploads all local public/images to Cloudinary and prints
 * a JSON mapping of old local URL path → new Cloudinary URL.
 *
 * Run: node scripts/upload-to-cloudinary.mjs
 */
import { v2 as cloudinary } from "cloudinary";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, basename, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load .env manually (no dotenv dep needed)
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

function walkDir(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full));
    } else {
      const ext = extname(entry).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        files.push(full);
      }
    }
  }
  return files;
}

const publicDir = join(root, "public");
const imageFiles = walkDir(join(publicDir, "images"));

// Also include root-level logo files
const rootImages = ["logo.webp", "logo-white.png"]
  .map((f) => join(publicDir, f))
  .filter((f) => {
    try { statSync(f); return true; } catch { return false; }
  });

const allFiles = [...imageFiles, ...rootImages];

console.log(`Uploading ${allFiles.length} images to Cloudinary...\n`);

const mapping = {};
let uploaded = 0;
let skipped = 0;

for (const filePath of allFiles) {
  // Derive the folder + public_id from path relative to /public
  const relative = filePath.replace(publicDir, "").replace(/^\//, "");
  // e.g. "images/universities/foo.jpg" → folder "studentstraffic/images/universities", public_id "foo"
  const parts = relative.split("/");
  const fileName = parts.pop(); // "foo.jpg"
  const nameWithoutExt = fileName.replace(/\.[^.]+$/, ""); // "foo"
  const folder = ["studentstraffic", ...parts].join("/");
  const publicId = `${folder}/${nameWithoutExt}`;
  const localPath = `/${relative}`; // "/images/universities/foo.jpg"

  try {
    // Check if already uploaded
    let existingUrl = null;
    try {
      const existing = await cloudinary.api.resource(publicId);
      existingUrl = existing.secure_url;
    } catch {
      // Not found — upload
    }

    if (existingUrl) {
      console.log(`  [skip] ${localPath} → already exists`);
      mapping[localPath] = existingUrl;
      skipped++;
    } else {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: false,
        use_filename: false,
      });
      mapping[localPath] = result.secure_url;
      console.log(`  [ok]   ${localPath} → ${result.secure_url}`);
      uploaded++;
    }
  } catch (err) {
    console.error(`  [err]  ${localPath}: ${err.message}`);
  }
}

console.log(`\nDone: ${uploaded} uploaded, ${skipped} skipped.`);
console.log("\n--- MAPPING (save this) ---");
console.log(JSON.stringify(mapping, null, 2));

// Write mapping to file for the DB update script
import { writeFileSync } from "fs";
writeFileSync(
  join(root, "scripts/cloudinary-mapping.json"),
  JSON.stringify(mapping, null, 2)
);
console.log("\nMapping saved to scripts/cloudinary-mapping.json");
