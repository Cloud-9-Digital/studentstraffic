/**
 * Uploads official university brochures as private Cloudinary assets and links
 * them to `universities.brochure`, which turns on the lead-gated
 * "Download brochure" button on /university/<slug>.
 *
 * Usage:
 *   npx tsx scripts/apply-brochures.ts <batch> [--dry-run]
 *
 * Manifest: research/brochures/<batch>.json
 *
 *   {
 *     "checkedAt": "2026-10-26",            // optional; default review date for entries
 *     "entries": [
 *       {
 *         "universitySlug": "anna-university",
 *         "sourceUrl": "https://www.annauniv.edu/pdf/prospectus-2026.pdf",
 *         "sourceLabel": "Anna University official website",
 *         "title": "Prospectus 2026-27",
 *         "academicYear": "2026-27",       // optional
 *         "rights": "Official prospectus published by the university for prospective students",
 *         "checkedAt": "2026-10-26"         // optional; overrides the manifest date
 *       }
 *     ]
 *   }
 *
 * For each entry the script:
 *   1. checks the university exists in the database (published or not);
 *   2. downloads the PDF from `sourceUrl` and rejects anything that does not
 *      start with the `%PDF-` signature or exceeds 40 MB;
 *   3. uploads it to Cloudinary as `resource_type: "raw"`, `type: "authenticated"`
 *      at `studentstraffic/brochures/<slug>/brochure.pdf`, so it has no public URL;
 *   4. writes `universities.brochure` = { publicId, fileName, title, academicYear?,
 *      bytes, sourceUrl, sourceLabel, checkedAt };
 *   5. revalidates only that university's cache tags and page path.
 *
 * `--dry-run` performs steps 1-2 (database reads and the download/validation)
 * and prints what would change, without uploading, writing or revalidating.
 *
 * Students receive the file only through /api/brochures/<slug>, after the lead
 * form; see docs/university-pipeline-architecture.md ("Lead-gated brochures").
 */
import "./lib/load-script-env.mjs";

import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { neonConfig, Pool } from "@neondatabase/serverless";
import { v2 as cloudinary } from "cloudinary";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { WebSocket } from "ws";

import type { UniversityBrochure } from "@/lib/data/types";
import * as schema from "@/lib/db/schema";
import { universities } from "@/lib/db/schema";
import { triggerRevalidate } from "./lib/trigger-revalidate";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const MAX_BYTES = 40 * 1024 * 1024;
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

type ManifestEntry = {
  universitySlug: string;
  sourceUrl: string;
  sourceLabel: string;
  title: string;
  academicYear?: string;
  rights: string;
  checkedAt?: string;
};
type Manifest = { checkedAt?: string; entries: ManifestEntry[] };

type EntryResult = {
  universitySlug: string;
  sourceUrl: string;
  status: "applied" | "dry-run" | "failed";
  brochure?: UniversityBrochure;
  rights?: string;
  error?: string;
};

function parseArgs(argv: string[]) {
  const dryRun = argv.includes("--dry-run");
  const positional = argv.filter((arg) => !arg.startsWith("--"));
  const batch = positional[0];
  if (!batch || positional.length > 1 || !/^[a-z0-9][a-z0-9._-]*$/i.test(batch)) {
    throw new Error("Usage: npx tsx scripts/apply-brochures.ts <batch> [--dry-run]");
  }
  return { batch: batch.replace(/\.json$/i, ""), dryRun };
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function validateManifest(raw: unknown): Manifest {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as Manifest).entries)) {
    throw new Error("Manifest must be an object with an `entries` array.");
  }
  const manifest = raw as Manifest;
  if (manifest.checkedAt !== undefined && !DATE.test(manifest.checkedAt)) {
    throw new Error("Manifest checkedAt must be YYYY-MM-DD.");
  }
  const seen = new Set<string>();
  manifest.entries.forEach((entry, index) => {
    const where = `entries[${index}]`;
    const requireText = (key: keyof ManifestEntry) => {
      const value = entry[key];
      if (typeof value !== "string" || !value.trim()) {
        throw new Error(`${where}.${key} is required.`);
      }
    };
    (["universitySlug", "sourceUrl", "sourceLabel", "title", "rights"] as const).forEach(requireText);
    if (!SLUG.test(entry.universitySlug)) throw new Error(`${where}.universitySlug is not a slug.`);
    if (seen.has(entry.universitySlug)) throw new Error(`${where}: duplicate ${entry.universitySlug}.`);
    seen.add(entry.universitySlug);
    if (!/^https:\/\//.test(entry.sourceUrl)) throw new Error(`${where}.sourceUrl must be https.`);
    if (entry.academicYear !== undefined && (typeof entry.academicYear !== "string" || !entry.academicYear.trim())) {
      throw new Error(`${where}.academicYear must be a non-empty string when present.`);
    }
    if (entry.checkedAt !== undefined && !DATE.test(entry.checkedAt)) {
      throw new Error(`${where}.checkedAt must be YYYY-MM-DD.`);
    }
  });
  return manifest;
}

/** True when the buffer starts with the PDF file signature. */
function isPdf(buffer: Buffer) {
  return buffer.subarray(0, 5).toString("latin1") === "%PDF-";
}

function fileNameFrom(response: Response, sourceUrl: string) {
  const disposition = response.headers.get("content-disposition") ?? "";
  const star = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plain = disposition.match(/filename="?([^";]+)"?/i)?.[1];
  let name = star ? decodeURIComponent(star) : plain;
  if (!name) {
    try {
      name = decodeURIComponent(basename(new URL(sourceUrl).pathname));
    } catch {
      name = undefined;
    }
  }
  name = (name ?? "").replace(/[\r\n"\\/]+/g, " ").trim();
  return name || "brochure.pdf";
}

async function downloadPdf(sourceUrl: string) {
  const response = await fetch(sourceUrl, {
    headers: { "User-Agent": BROWSER_UA, Accept: "application/pdf,*/*;q=0.8" },
    redirect: "follow",
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok || !response.body) {
    throw new Error(`Download failed: HTTP ${response.status}`);
  }
  const declared = Number(response.headers.get("content-length") ?? "0");
  if (declared > MAX_BYTES) {
    await response.body.cancel();
    throw new Error(`File is ${declared} bytes; the limit is ${MAX_BYTES}.`);
  }

  // Read with a running cap so an undeclared or lying length cannot exhaust memory.
  const chunks: Uint8Array[] = [];
  let total = 0;
  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      throw new Error(`File exceeds the ${MAX_BYTES}-byte limit.`);
    }
    chunks.push(value);
  }
  const buffer = Buffer.concat(chunks);
  if (!isPdf(buffer)) {
    const type = response.headers.get("content-type") ?? "unknown";
    throw new Error(`Not a PDF (content-type ${type}; missing %PDF- signature).`);
  }
  return { buffer, fileName: fileNameFrom(response, sourceUrl) };
}

function uploadPrivatePdf(publicId: string, buffer: Buffer) {
  return new Promise<{ public_id: string; bytes: number; type: string; resource_type: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: "raw",
          type: "authenticated",
          overwrite: true,
          invalidate: true,
        },
        (error, result) => {
          if (error || !result) reject(new Error(error?.message ?? "Upload failed."));
          else resolve(result as { public_id: string; bytes: number; type: string; resource_type: string });
        },
      );
      stream.end(buffer);
    },
  );
}

async function main() {
  const { batch, dryRun } = parseArgs(process.argv.slice(2));
  const manifestPath = join(root, "research/brochures", `${batch}.json`);
  const reportPath = join(root, "research/brochures", `${batch}.apply-report.json`);
  const manifest = validateManifest(JSON.parse(readFileSync(manifestPath, "utf8")));
  console.log(`${dryRun ? "[dry run] " : ""}Loaded ${manifest.entries.length} brochure entries from ${manifestPath}`);

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  if (!dryRun) {
    for (const key of ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]) {
      if (!process.env[key]) throw new Error(`${key} is required.`);
    }
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  neonConfig.webSocketConstructor = WebSocket as unknown as typeof globalThis.WebSocket;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });
  const today = new Date().toISOString().slice(0, 10);
  const results: EntryResult[] = [];

  try {
    for (const entry of manifest.entries) {
      const slug = entry.universitySlug;
      try {
        const [university] = await db
          .select({ id: universities.id })
          .from(universities)
          .where(eq(universities.slug, slug))
          .limit(1);
        if (!university) throw new Error("No matching row in universities.");

        const { buffer, fileName } = await downloadPdf(entry.sourceUrl);
        const publicId = `studentstraffic/brochures/${slug}/brochure.pdf`;
        const brochureBase = {
          fileName,
          title: entry.title.trim(),
          ...(entry.academicYear ? { academicYear: entry.academicYear.trim() } : {}),
          sourceUrl: entry.sourceUrl,
          sourceLabel: entry.sourceLabel.trim(),
          checkedAt: entry.checkedAt ?? manifest.checkedAt ?? today,
        };

        if (dryRun) {
          const brochure: UniversityBrochure = { publicId, bytes: buffer.byteLength, ...brochureBase };
          results.push({ universitySlug: slug, sourceUrl: entry.sourceUrl, status: "dry-run", brochure, rights: entry.rights });
          console.log(`  [dry]  ${slug}: ${fileName} (${buffer.byteLength} bytes) -> ${publicId}`);
          continue;
        }

        const upload = await uploadPrivatePdf(publicId, buffer);
        if (upload.type !== "authenticated" || upload.resource_type !== "raw") {
          throw new Error(`Cloudinary stored the asset as ${upload.resource_type}/${upload.type}, not raw/authenticated.`);
        }
        const brochure: UniversityBrochure = { publicId: upload.public_id, bytes: upload.bytes, ...brochureBase };

        await db
          .update(universities)
          .set({ brochure, updatedAt: new Date() })
          .where(eq(universities.id, university.id));

        // Entity-scoped only: the shared universities tag would expire every
        // university page at once (see docs/university-pipeline-architecture.md).
        await triggerRevalidate([`university:${slug}`, `university-programs:${slug}`], {
          scope: "exact",
          paths: [`/university/${slug}`],
        });

        results.push({ universitySlug: slug, sourceUrl: entry.sourceUrl, status: "applied", brochure, rights: entry.rights });
        console.log(`  [ok]   ${slug}: ${fileName} (${upload.bytes} bytes) -> ${upload.public_id}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        results.push({ universitySlug: slug, sourceUrl: entry.sourceUrl, status: "failed", error: message });
        console.error(`  [FAIL] ${slug}: ${message}`);
      }
    }
  } finally {
    await pool.end();
  }

  const failed = results.filter((result) => result.status === "failed");
  console.log(
    `\n${dryRun ? "Dry run" : "Applied"}: ${results.length - failed.length} ok, ${failed.length} failed.`,
  );

  if (!dryRun) {
    writeFileSync(
      reportPath,
      `${JSON.stringify({ appliedAt: new Date().toISOString(), batch, results }, null, 2)}\n`,
      "utf8",
    );
    console.log(`Report written to ${reportPath}`);
  }

  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
