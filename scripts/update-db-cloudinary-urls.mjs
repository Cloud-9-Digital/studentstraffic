/**
 * Reads cloudinary-mapping.json and updates all universities in the DB
 * that have logoUrl or coverImageUrl pointing to /images/... local paths.
 *
 * Run AFTER upload-to-cloudinary.mjs:
 *   node scripts/update-db-cloudinary-urls.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load .env
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

const mapping = JSON.parse(
  readFileSync(join(root, "scripts/cloudinary-mapping.json"), "utf8")
);

const sql = neon(env.DATABASE_URL);

function remap(url) {
  if (!url) return url;
  // Match "/images/..." regardless of any host prefix
  const localPathMatch = url.match(/(\/images\/.+)/);
  if (localPathMatch) {
    const localPath = localPathMatch[1];
    return mapping[localPath] ?? url;
  }
  return url;
}

const universities = await sql`SELECT id, logo_url, cover_image_url FROM universities`;

let updated = 0;
for (const uni of universities) {
  const newLogo = remap(uni.logo_url);
  const newCover = remap(uni.cover_image_url);

  const logoChanged = newLogo !== uni.logo_url;
  const coverChanged = newCover !== uni.cover_image_url;

  if (logoChanged || coverChanged) {
    await sql`
      UPDATE universities
      SET
        logo_url = ${newLogo ?? null},
        cover_image_url = ${newCover ?? null},
        updated_at = NOW()
      WHERE id = ${uni.id}
    `;
    console.log(`Updated university ${uni.id}:`);
    if (logoChanged) console.log(`  logo:  ${uni.logo_url}\n      →  ${newLogo}`);
    if (coverChanged) console.log(`  cover: ${uni.cover_image_url}\n      →  ${newCover}`);
    updated++;
  }
}

console.log(`\nDone: updated ${updated} of ${universities.length} universities.`);
