import "dotenv/config";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import { studyAbroadGuides as studyAbroadGuidesTable } from "@/lib/db/schema";
import { studyAbroadGuides } from "@/lib/data/study-abroad-guides";

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, val]) => [key, sortKeysDeep(val)]),
    );
  }
  return value;
}

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is missing. Add it to .env before running this script.");
  }

  let mismatches = 0;

  for (const [slug, original] of Object.entries(studyAbroadGuides)) {
    const [row] = await db
      .select({
        metadata: studyAbroadGuidesTable.metadata,
        page: studyAbroadGuidesTable.page,
        published: studyAbroadGuidesTable.published,
      })
      .from(studyAbroadGuidesTable)
      .where(eq(studyAbroadGuidesTable.slug, slug))
      .limit(1);

    if (!row) {
      console.error("MISSING from DB:", slug);
      mismatches += 1;
      continue;
    }

    if (!row.published) {
      console.error("NOT PUBLISHED in DB:", slug);
      mismatches += 1;
    }

    const origJson = JSON.stringify(
      sortKeysDeep({ metadata: original.metadata, page: original.page }),
    );
    const dbJson = JSON.stringify(sortKeysDeep({ metadata: row.metadata, page: row.page }));

    if (origJson !== dbJson) {
      console.error("MISMATCH:", slug);
      mismatches += 1;
    }
  }

  console.log(
    `Checked ${Object.keys(studyAbroadGuides).length} guides, ${mismatches} mismatches.`,
  );

  if (mismatches > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
