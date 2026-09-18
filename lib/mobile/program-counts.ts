import { and, count, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db/server";
import { programOfferings, universities } from "@/lib/db/schema";

/** Counts all published programs, independently of the current finder filter. */
export async function getMobileProgramCounts(slugs: string[]) {
  const db = getDb();
  if (!db || !slugs.length) return new Map<string, number>();
  const rows = await db.select({ slug: universities.slug, total: count(programOfferings.id) })
    .from(universities)
    .leftJoin(programOfferings, and(eq(programOfferings.universityId, universities.id), eq(programOfferings.published, true)))
    .where(inArray(universities.slug, slugs))
    .groupBy(universities.slug);
  return new Map(rows.map(row => [row.slug, row.total]));
}
