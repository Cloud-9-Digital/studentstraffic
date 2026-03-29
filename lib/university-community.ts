import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import type {
  UniversityPeerAvailability,
  UniversityReview,
} from "@/lib/data/types";
import { getDb } from "@/lib/db/server";
import {
  studentPeers,
  universities,
  universityReviews,
} from "@/lib/db/schema";

function toIsoString(value: Date | null | undefined) {
  return (value ?? new Date()).toISOString();
}

export function getUniversityReviewsTag(universitySlug: string) {
  return `university-reviews:${universitySlug}`;
}

export function getUniversityPeersTag(universitySlug: string) {
  return `university-peers:${universitySlug}`;
}

export async function getUniversityPeerAvailability(
  universitySlug: string
): Promise<UniversityPeerAvailability> {
  "use cache";

  cacheLife("hours");
  cacheTag(getUniversityPeersTag(universitySlug));

  const db = getDb();

  if (!db) {
    return {
      universitySlug,
      activePeerCount: 0,
      hasPeers: false,
    };
  }

  const [result] = await db
    .select({
      activePeerCount: sql<number>`count(*)`.mapWith(Number),
    })
    .from(studentPeers)
    .innerJoin(universities, eq(studentPeers.universityId, universities.id))
    .where(
      and(
        eq(universities.slug, universitySlug),
        eq(studentPeers.status, "active")
      )
    );

  const activePeerCount = result?.activePeerCount ?? 0;

  return {
    universitySlug,
    activePeerCount,
    hasPeers: activePeerCount > 0,
  };
}

export async function getUniversityReviews(
  universitySlug: string
): Promise<UniversityReview[]> {
  "use cache";

  cacheLife("minutes");
  cacheTag(getUniversityReviewsTag(universitySlug));

  const db = getDb();

  if (!db) {
    return [];
  }

  const reviews = await db
    .select({
      id: universityReviews.id,
      universitySlug: universities.slug,
      reviewType: universityReviews.reviewType,
      reviewerName: universityReviews.reviewerName,
      reviewerEmail: universityReviews.reviewerEmail,
      reviewerContext: universityReviews.reviewerContext,
      reviewBody: universityReviews.reviewBody,
      youtubeUrl: universityReviews.youtubeUrl,
      youtubeVideoId: universityReviews.youtubeVideoId,
      visibilityStatus: universityReviews.visibilityStatus,
      verificationStatus: universityReviews.verificationStatus,
      isFeatured: universityReviews.isFeatured,
      starRating: universityReviews.starRating,
      createdAt: universityReviews.createdAt,
      updatedAt: universityReviews.updatedAt,
    })
    .from(universityReviews)
    .innerJoin(universities, eq(universityReviews.universityId, universities.id))
    .where(
      and(
        eq(universities.slug, universitySlug),
        eq(universityReviews.visibilityStatus, "live")
      )
    )
    .orderBy(
      desc(universityReviews.isFeatured),
      desc(universityReviews.createdAt)
    );

  return reviews.map((review) => ({
    id: review.id,
    universitySlug: review.universitySlug,
    reviewType: review.reviewType,
    reviewerName: review.reviewerName,
    reviewerEmail: review.reviewerEmail ?? undefined,
    reviewerContext: review.reviewerContext ?? undefined,
    reviewBody: review.reviewBody ?? undefined,
    youtubeUrl: review.youtubeUrl ?? undefined,
    youtubeVideoId: review.youtubeVideoId ?? undefined,
    visibilityStatus: review.visibilityStatus,
    verificationStatus: review.verificationStatus,
    isFeatured: review.isFeatured,
    starRating: review.starRating ?? undefined,
    createdAt: toIsoString(review.createdAt),
    updatedAt: review.updatedAt ? toIsoString(review.updatedAt) : undefined,
  }));
}
