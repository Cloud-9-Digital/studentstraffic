import "dotenv/config";

import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/core";
import { studyAbroadGuides as studyAbroadGuidesTable } from "@/lib/db/schema";
import { studyAbroadGuides } from "@/lib/data/study-abroad-guides";
import type { CourseStream } from "@/lib/data/types";
import { triggerRevalidate } from "./lib/trigger-revalidate";

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

  let inserted = 0;
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

    inserted += 1;
  }

  console.log(
    `Migrated ${inserted} study-abroad guides to the database (${skipped} already existed, skipped).`,
  );

  if (inserted > 0) {
    await triggerRevalidate(["catalog", "study-abroad-guides"]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
