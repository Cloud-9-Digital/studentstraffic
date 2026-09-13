import "dotenv/config";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import { studyAbroadGuides as studyAbroadGuidesTable } from "@/lib/db/schema";
import { studyAbroadGuides } from "@/lib/data/study-abroad-guides";
import type { CourseStream } from "@/lib/data/types";
import { getStudyAbroadGuideHref } from "@/lib/routes";
import { triggerRevalidate } from "./lib/trigger-revalidate";

// Above this many inserted guides, one study-abroad-guides tag replaces the
// per-guide tags to keep the revalidation request short.
const GUIDE_TAG_LIMIT = 10;

function inferStreamAndCourse(
  slug: string,
  explicitCourseSlug: string | undefined,
): { stream: CourseStream; courseSlug: string | null } {
  if (explicitCourseSlug === "mbbs") return { stream: "medicine", courseSlug: "mbbs" };
  if (explicitCourseSlug === "bsc-nursing") return { stream: "nursing", courseSlug: "bsc-nursing" };
  if (explicitCourseSlug) return { stream: "medicine", courseSlug: explicitCourseSlug };

  if (slug.includes("ausbildung")) return { stream: "vocational", courseSlug: "ausbildung" };
  if (slug.includes("nursing")) return { stream: "nursing", courseSlug: "bsc-nursing" };
  if (
    slug.includes("mbbs") ||
    slug.includes("medical-colleges") ||
    slug.includes("medical-university")
  ) {
    return { stream: "medicine", courseSlug: "mbbs" };
  }

  return { stream: "medicine", courseSlug: null };
}

async function main() {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL is missing. Add it to .env before running this script.");
  }

  const insertedSlugs: string[] = [];
  let skipped = 0;

  for (const [slug, guide] of Object.entries(studyAbroadGuides)) {
    const [existing] = await db
      .select({ id: studyAbroadGuidesTable.id })
      .from(studyAbroadGuidesTable)
      .where(eq(studyAbroadGuidesTable.slug, slug))
      .limit(1);

    if (existing) {
      skipped += 1;
      continue;
    }

    const { stream, courseSlug } = inferStreamAndCourse(slug, guide.page.courseSlug);
    const countrySlug = guide.page.countrySlug ?? null;
    const lastVerifiedAt = guide.page.publishedDate ? new Date(guide.page.publishedDate) : null;

    await db.insert(studyAbroadGuidesTable).values({
      slug,
      stream,
      courseSlug,
      countrySlug,
      metadata: guide.metadata,
      page: guide.page,
      published: true,
      lastVerifiedAt,
    });

    insertedSlugs.push(slug);
  }

  console.log(
    `Migrated ${insertedSlugs.length} study-abroad guides to the database (${skipped} already existed, skipped).`,
  );

  if (insertedSlugs.length > 0) {
    // Only the inserted guides change. Guide pages read
    // getStudyAbroadGuideBySlug (tagged guide:<slug>) on the root /[slug]
    // route, so their own tags and exact paths are enough. The shared
    // "catalog" tag, or the old implicit catalog scope, would regenerate every
    // catalogue page against Neon.
    // Global refresh: past GUIDE_TAG_LIMIT inserts, expire study-abroad-guides
    // instead. It covers only the guide readers (one small table), never
    // catalogue entities.
    const refreshAllGuides = insertedSlugs.length > GUIDE_TAG_LIMIT;
    await triggerRevalidate(
      refreshAllGuides
        ? ["study-abroad-guides"]
        : insertedSlugs.map((slug) => `guide:${slug}`),
      {
        scope: "guide",
        paths: insertedSlugs.map((slug) => getStudyAbroadGuideHref(slug)),
      },
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
