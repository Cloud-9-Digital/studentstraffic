"use server";

import { eq } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";

import { getDb } from "@/lib/db/server";
import { universities, universityReviews } from "@/lib/db/schema";
import { getUniversityReviewsTag } from "@/lib/university-community";

export type ModerationAction = "show" | "hide" | "archive" | "feature" | "unfeature";

export async function moderateReviewAction(
  reviewId: number,
  action: ModerationAction
): Promise<{ error?: string }> {
  const db = getDb();

  if (!db) {
    return { error: "Database unavailable." };
  }

  const [review] = await db
    .select({
      id: universityReviews.id,
      universitySlug: universities.slug,
    })
    .from(universityReviews)
    .innerJoin(universities, eq(universityReviews.universityId, universities.id))
    .where(eq(universityReviews.id, reviewId))
    .limit(1);

  if (!review) {
    return { error: "Review not found." };
  }

  const updates: Partial<{
    visibilityStatus: "live" | "hidden" | "archived";
    isFeatured: boolean;
    updatedAt: Date;
  }> = { updatedAt: new Date() };

  if (action === "show") updates.visibilityStatus = "live";
  else if (action === "hide") updates.visibilityStatus = "hidden";
  else if (action === "archive") updates.visibilityStatus = "archived";
  else if (action === "feature") updates.isFeatured = true;
  else if (action === "unfeature") updates.isFeatured = false;

  await db
    .update(universityReviews)
    .set(updates)
    .where(eq(universityReviews.id, reviewId));

  updateTag(getUniversityReviewsTag(review.universitySlug));
  refresh();

  return {};
}
