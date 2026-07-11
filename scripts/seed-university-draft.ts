import "dotenv/config";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import {
  universityResearchDrafts,
  universityResearchQueue,
} from "@/lib/db/schema";
import { createSlug } from "@/lib/utils";

/**
 * Seeds a `university_research_queue` + `university_research_drafts` pair from a
 * researched draft JSON file, so the EXISTING publisher
 * (scripts/publish-university-draft.ts) can consume it.
 *
 * Re-running with the same input updates the same rows instead of duplicating them.
 *
 * Run: tsx scripts/seed-nonofficial-directory-draft.ts --file <path-to-draft.json>
 *
 * The JSON must match the shape the publisher expects. Top-level fields:
 *   {
 *     "countrySlug": "germany",              // required; must exist in `countries`
 *     "schoolName": "Some University",       // required (queue.school_name)
 *     "cityName": "Berlin",                  // optional (queue.city_name)
 *     "priority": "medium",                  // optional: high|medium|low
 *     "officialWebsite": "https://...",      // optional; falls back to structuredFacts.officialWebsite
 *     "programUrl": "https://...",           // optional draft url columns
 *     "feesUrl": "https://...",
 *     "hostelUrl": "https://...",
 *     "admissionUrl": "https://...",
 *     "qualityScore": 90,                    // optional int
 *     "reviewNotes": "…",                    // optional
 *     "verifiedAt": "2026-07-01",            // optional ISO date/datetime
 *     "sourceBundle": { "sources": [ … ] },  // required by publisher (>=2 sources)
 *     "structuredFacts": { … },              // required by publisher
 *     "draftContent": { … }                  // required by publisher
 *   }
 *
 * This script does NOT validate publishability (the publisher does that) and does
 * NOT publish anything. It only inserts/updates the queue + draft rows and prints
 * the queue-id + draft-id.
 */

type SeedArgs = {
  file?: string;
};

type DraftInput = {
  countrySlug?: unknown;
  universitySlug?: unknown;
  schoolName?: unknown;
  cityName?: unknown;
  priority?: unknown;
  officialWebsite?: unknown;
  programUrl?: unknown;
  feesUrl?: unknown;
  hostelUrl?: unknown;
  admissionUrl?: unknown;
  qualityScore?: unknown;
  reviewNotes?: unknown;
  verifiedAt?: unknown;
  sourceBundle?: unknown;
  structuredFacts?: unknown;
  draftContent?: unknown;
};

function parseArgs(argv: string[]): SeedArgs {
  const args: SeedArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];

    if ((token === "--file" || token === "--json") && value) {
      args.file = value;
      index += 1;
    }
  }

  return args;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asPriority(value: unknown): "high" | "medium" | "low" {
  return value === "high" || value === "low" ? value : "medium";
}

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is missing. Add it to .env before running this script.");
  }

  const args = parseArgs(process.argv.slice(2));

  if (!args.file) {
    throw new Error("Pass --file <path-to-draft.json>.");
  }

  const filePath = resolve(process.cwd(), args.file);
  let parsed: DraftInput;

  try {
    parsed = JSON.parse(readFileSync(filePath, "utf8")) as DraftInput;
  } catch (error) {
    throw new Error(`Failed to read/parse JSON at "${filePath}": ${(error as Error).message}`);
  }

  const structuredFacts = asRecord(parsed.structuredFacts);
  const sourceBundle = asRecord(parsed.sourceBundle);
  const draftContent = asRecord(parsed.draftContent);

  const countrySlug = asString(parsed.countrySlug);
  if (!countrySlug) {
    throw new Error('Missing "countrySlug" in the draft JSON.');
  }

  const schoolName =
    asString(parsed.schoolName) ?? asString(structuredFacts.name);
  if (!schoolName) {
    throw new Error('Missing "schoolName" (or structuredFacts.name) in the draft JSON.');
  }

  const cityName = asString(parsed.cityName) ?? asString(structuredFacts.city);

  // Derive a stable discovery key for idempotent queue upserts.
  const universitySlug =
    asString(structuredFacts.slug) ??
    asString(parsed.universitySlug) ??
    createSlug(schoolName);

  const discoveryKey = `disc-${countrySlug}-${universitySlug}`;

  const officialWebsite =
    asString(parsed.officialWebsite) ?? asString(structuredFacts.officialWebsite);

  const verifiedAtInput = asString(parsed.verifiedAt);
  const verifiedAt = verifiedAtInput ? new Date(verifiedAtInput) : null;
  if (verifiedAt && Number.isNaN(verifiedAt.getTime())) {
    throw new Error(`"verifiedAt" is not a valid date: ${verifiedAtInput}`);
  }

  const now = new Date();

  // --- Upsert the queue row (idempotent on the discovery key). ---
  const [queueRow] = await db
    .insert(universityResearchQueue)
    .values({
      discoveryKey,
      countrySlug,
      schoolName,
      cityName,
      priority: asPriority(parsed.priority),
      status: "draft_ready",
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: universityResearchQueue.discoveryKey,
      set: {
        countrySlug,
        schoolName,
        cityName,
        priority: asPriority(parsed.priority),
        status: "draft_ready",
        updatedAt: now,
      },
    })
    .returning({ id: universityResearchQueue.id });

  if (!queueRow) {
    throw new Error("Failed to upsert the university_research_queue row.");
  }

  const queueId = queueRow.id;

  // --- Upsert the draft row (idempotent on queue_id, which is UNIQUE). ---
  const draftValues = {
    queueId,
    discoveryKey,
    officialWebsite,
    programUrl: asString(parsed.programUrl),
    feesUrl: asString(parsed.feesUrl),
    hostelUrl: asString(parsed.hostelUrl),
    admissionUrl: asString(parsed.admissionUrl),
    sourceBundle: sourceBundle as Record<string, unknown>,
    structuredFacts: structuredFacts as Record<string, unknown>,
    draftContent: draftContent as Record<string, unknown>,
    qualityScore: asNumber(parsed.qualityScore),
    reviewNotes: asString(parsed.reviewNotes),
    verifiedAt,
    updatedAt: now,
  };

  const [draftRow] = await db
    .insert(universityResearchDrafts)
    .values(draftValues)
    .onConflictDoUpdate({
      target: universityResearchDrafts.queueId,
      set: {
        discoveryKey,
        officialWebsite,
        programUrl: draftValues.programUrl,
        feesUrl: draftValues.feesUrl,
        hostelUrl: draftValues.hostelUrl,
        admissionUrl: draftValues.admissionUrl,
        sourceBundle: draftValues.sourceBundle,
        structuredFacts: draftValues.structuredFacts,
        draftContent: draftValues.draftContent,
        qualityScore: draftValues.qualityScore,
        reviewNotes: draftValues.reviewNotes,
        verifiedAt,
        updatedAt: now,
      },
    })
    .returning({ id: universityResearchDrafts.id });

  if (!draftRow) {
    throw new Error("Failed to upsert the university_research_drafts row.");
  }

  console.log("Seeded research draft.");
  console.log(`  discovery key: ${discoveryKey}`);
  console.log(`  country:      ${countrySlug}`);
  console.log(`  university:   ${schoolName} (${universitySlug})`);
  console.log(`  queue-id:     ${queueId}`);
  console.log(`  draft-id:     ${draftRow.id}`);
  console.log("");
  console.log("Publish with:");
  console.log(`  tsx scripts/publish-university-draft.ts --queue-id ${queueId}`);

  // Confirm the pair is linked (defensive read-back; no writes).
  const check = await db
    .select({ id: universityResearchDrafts.id })
    .from(universityResearchDrafts)
    .where(eq(universityResearchDrafts.queueId, queueId))
    .limit(1);

  if (!check[0]) {
    throw new Error("Read-back failed: draft row not found after upsert.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
