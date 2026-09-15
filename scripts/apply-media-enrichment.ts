import "./lib/load-script-env.mjs";

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { v2 as cloudinary } from "cloudinary";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";

import { universities } from "@/lib/db/schema";
import * as schema from "@/lib/db/schema";
import { triggerRevalidate } from "./lib/trigger-revalidate";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const manifestPath = process.env.MEDIA_MANIFEST_PATH
  ? join(root, process.env.MEDIA_MANIFEST_PATH)
  : join(root, "research/media-enrichment/reviewed-upload-manifest.json");
const reportPath = join(root, "research/media-enrichment/apply-report.json");

type ManifestAsset = {
  kind: "logo" | "cover";
  sourceUrl: string;
  sourceType: string;
  rightsBasis: string;
  proposedPublicId: string;
};
type ManifestEntry = {
  universitySlug: string;
  universityName: string;
  sourceBatch: string;
  assets: ManifestAsset[];
};
type Manifest = { entries: ManifestEntry[] };

type UploadResult = {
  universitySlug: string;
  kind: "logo" | "cover";
  sourceUrl: string;
  cloudinaryUrl?: string;
  publicId?: string;
  error?: string;
};

type DbUpdateResult = {
  universitySlug: string;
  logoUpdated: boolean;
  coverUpdated: boolean;
  notFoundInDb: boolean;
};

async function main() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

  const manifest: Manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  console.log(
    `Loaded manifest: ${manifest.entries.length} universities, ${manifest.entries.reduce((n, e) => n + e.assets.length, 0)} assets.`,
  );

  function errorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "object" && err !== null && "message" in err) {
      return String((err as { message: unknown }).message);
    }
    return JSON.stringify(err);
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Wikimedia rate-limits cache-miss (origin) fetches from anonymous/browser-spoofed
  // traffic far more aggressively than from a policy-compliant, self-identifying bot
  // User-Agent (see https://meta.wikimedia.org/wiki/User-Agent_policy) — confirmed by
  // testing: the same browser-UA request that 429s succeeds immediately with a
  // descriptive UA, even on a cache-miss. University domains are the opposite: they
  // often block honest bots but allow ordinary browser traffic, so keep the browser UA
  // for everything else.
  const WIKIMEDIA_UA = "StudentsTrafficMediaBot/1.0 (https://studentstraffic.com; contact: bharat@cloud9digital.in) node-fetch";
  const BROWSER_UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

  async function uploadViaClientFetch(asset: ManifestAsset) {
    const isWikimedia = asset.sourceUrl.includes("upload.wikimedia.org");
    const backoffs = isWikimedia ? [3000, 8000] : [];
    let response: Response | undefined;
    for (let attempt = 0; ; attempt++) {
      response = await fetch(asset.sourceUrl, {
        headers: { "User-Agent": isWikimedia ? WIKIMEDIA_UA : BROWSER_UA },
        signal: AbortSignal.timeout(20000),
      });
      if (response.status !== 429 || attempt >= backoffs.length) break;
      await sleep(backoffs[attempt]);
    }
    if (!response!.ok) throw new Error(`Client fetch failed: HTTP ${response!.status}`);
    const buffer = Buffer.from(await response!.arrayBuffer());
    if (buffer.byteLength < 500) throw new Error(`Client fetch returned a suspiciously small body (${buffer.byteLength} bytes).`);

    return new Promise<{ secure_url: string; public_id: string; bytes: number }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: asset.proposedPublicId, resource_type: "image", overwrite: true, invalidate: true },
        (error, result) => {
          if (error || !result) reject(new Error(errorMessage(error)));
          else resolve(result as { secure_url: string; public_id: string; bytes: number });
        },
      );
      stream.end(buffer);
    });
  }

  // Wikimedia serves properly web-sized thumbnails via its own CDN — no site embeds
  // the raw original (some Commons photos are 15-20MB). Rewrite to a 1600px-wide
  // thumbnail when the original trips Cloudinary's upload size cap.
  // Wikimedia only serves a fixed set of thumbnail bucket widths (arbitrary widths
  // 400 -- Use thumbnail sizes listed on https://w.wiki/GHai); 1280 is one of them.
  function wikimediaThumbnailUrl(sourceUrl: string, width = 1280): string | null {
    const match = sourceUrl.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/([0-9a-f])\/([0-9a-f]{2})\/([^/]+)$/i);
    if (!match) return null;
    const [, base, h1, h2, filename] = match;
    const suffix = /\.svg$/i.test(filename) ? `${width}px-${filename}.png` : `${width}px-${filename}`;
    return `${base}/thumb/${h1}/${h2}/${filename}/${suffix}`;
  }

  const uploadResults: UploadResult[] = [];

  for (const entry of manifest.entries) {
    for (const asset of entry.assets) {
      let result: { secure_url: string; public_id: string; bytes: number } | undefined;
      let lastError: unknown;

      try {
        result = await cloudinary.uploader.upload(asset.sourceUrl, {
          public_id: asset.proposedPublicId,
          resource_type: "image",
          overwrite: true,
          invalidate: true,
        });
      } catch (err) {
        lastError = err;
      }

      // Cloudinary's own server-side fetch is sometimes blocked by bot-protection
      // that a browser-like client request bypasses; fall back to fetching the
      // asset ourselves and uploading the bytes directly.
      if (!result || !result.secure_url || !result.bytes || result.bytes < 500) {
        try {
          result = await uploadViaClientFetch(asset);
        } catch (err) {
          lastError = err;
          result = undefined;

          if (errorMessage(err).includes("File size too large")) {
            const thumbUrl = wikimediaThumbnailUrl(asset.sourceUrl);
            if (thumbUrl) {
              try {
                result = await uploadViaClientFetch({ ...asset, sourceUrl: thumbUrl });
              } catch (thumbErr) {
                lastError = thumbErr;
              }
            }
          }
        }
      }

      if (result?.secure_url && result.bytes >= 500) {
        uploadResults.push({
          universitySlug: entry.universitySlug,
          kind: asset.kind,
          sourceUrl: asset.sourceUrl,
          cloudinaryUrl: result.secure_url,
          publicId: result.public_id,
        });
        console.log(`  [ok]   ${entry.universitySlug} ${asset.kind} -> ${result.secure_url}`);
      } else {
        const message = errorMessage(lastError);
        uploadResults.push({
          universitySlug: entry.universitySlug,
          kind: asset.kind,
          sourceUrl: asset.sourceUrl,
          error: message,
        });
        console.error(`  [FAIL] ${entry.universitySlug} ${asset.kind}: ${message}`);
      }
    }
  }

  const succeeded = uploadResults.filter((r) => r.cloudinaryUrl);
  const failed = uploadResults.filter((r) => r.error);
  console.log(`\nUploads: ${succeeded.length} ok, ${failed.length} failed.`);

  // Group successful uploads by university for the DB transaction.
  const bySlug = new Map<string, { logo?: UploadResult; cover?: UploadResult }>();
  for (const result of succeeded) {
    const entry = bySlug.get(result.universitySlug) ?? {};
    entry[result.kind] = result;
    bySlug.set(result.universitySlug, entry);
  }

  neonConfig.webSocketConstructor = WebSocket as unknown as typeof globalThis.WebSocket;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  const dbResults: DbUpdateResult[] = [];

  try {
    await db.transaction(async (tx) => {
      for (const [slug, assets] of bySlug) {
        const [existing] = await tx
          .select({ id: universities.id })
          .from(universities)
          .where(eq(universities.slug, slug));

        if (!existing) {
          dbResults.push({ universitySlug: slug, logoUpdated: false, coverUpdated: false, notFoundInDb: true });
          console.error(`  [FAIL] ${slug}: no matching row in universities table.`);
          continue;
        }

        const patch: Partial<typeof universities.$inferInsert> = { updatedAt: new Date() };
        if (assets.logo) patch.logoUrl = assets.logo.cloudinaryUrl;
        if (assets.cover) patch.coverImageUrl = assets.cover.cloudinaryUrl;

        await tx.update(universities).set(patch).where(eq(universities.id, existing.id));

        dbResults.push({
          universitySlug: slug,
          logoUpdated: Boolean(assets.logo),
          coverUpdated: Boolean(assets.cover),
          notFoundInDb: false,
        });
        console.log(`  [ok]   ${slug}: logo=${Boolean(assets.logo)} cover=${Boolean(assets.cover)}`);
      }
    });
  } finally {
    await pool.end();
  }

  const updatedSlugs = dbResults.filter((r) => !r.notFoundInDb).map((r) => r.universitySlug);
  console.log(`\nDatabase: updated ${updatedSlugs.length} universities.`);

  if (updatedSlugs.length) {
    await triggerRevalidate(
      // Entity-scoped tags only: the shared universities tag would expire every
      // university page at once (see docs/university-pipeline-architecture.md).
      updatedSlugs.flatMap((slug) => [`university:${slug}`, `university-programs:${slug}`]),
      { scope: "catalog", paths: updatedSlugs.map((slug) => `/university/${slug}`) },
    );
    console.log("Triggered cache revalidation for updated university pages.");
  }

  const report = {
    appliedAt: new Date().toISOString(),
    uploads: { attempted: uploadResults.length, succeeded: succeeded.length, failed: failed.length },
    database: {
      updated: updatedSlugs.length,
      notFoundInDb: dbResults.filter((r) => r.notFoundInDb).map((r) => r.universitySlug),
    },
    updatedUniversities: dbResults.filter((r) => !r.notFoundInDb),
    uploadFailures: failed,
  };
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`\nFull report written to ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
