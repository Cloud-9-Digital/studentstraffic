import "server-only";

import { and, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { getDb } from "@/lib/db/server";
import { studyAbroadGuides as studyAbroadGuidesTable } from "@/lib/db/schema";
import type { IndexableMetadataInput } from "@/lib/metadata";
import type { StudyAbroadGuidePageProps } from "@/components/site/study-abroad-guide-page";

export type StudyAbroadGuideRow = {
  slug: string;
  metadata: IndexableMetadataInput;
  page: StudyAbroadGuidePageProps;
};

export async function getPublishedStudyAbroadGuideSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("study-abroad-guides");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({ slug: studyAbroadGuidesTable.slug })
    .from(studyAbroadGuidesTable)
    .where(eq(studyAbroadGuidesTable.published, true));

  return rows.map((row) => row.slug);
}

export async function getStudyAbroadGuideBySlug(
  slug: string,
): Promise<StudyAbroadGuideRow | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("study-abroad-guides");

  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select({
      slug: studyAbroadGuidesTable.slug,
      metadata: studyAbroadGuidesTable.metadata,
      page: studyAbroadGuidesTable.page,
    })
    .from(studyAbroadGuidesTable)
    .where(
      and(
        eq(studyAbroadGuidesTable.slug, slug),
        eq(studyAbroadGuidesTable.published, true),
      ),
    )
    .limit(1);

  return row ?? null;
}
