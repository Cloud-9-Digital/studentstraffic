"use server";

import { headers } from "next/headers";
import { and, eq, gte } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { z } from "zod";

import {
  emptyToUndefined,
  getFormString,
  getIpAddress,
  minutesAgo,
  wasSubmittedTooFast,
} from "@/app/_actions/form-helpers";
import { getDb } from "@/lib/db/server";
import { universities, universityReviews } from "@/lib/db/schema";
import { consumePublicFormRateLimits } from "@/lib/security/public-form-guard";
import { getUniversityReviewsTag } from "@/lib/university-community";
import { getYouTubeIsShort, getYouTubeVideoId, getYouTubeWatchUrl } from "@/lib/youtube";

export type UniversityReviewFormState = {
  error?: string;
  success?: string;
};

const reviewSchema = z.object({
  universitySlug: z.string().trim().min(1),
  reviewType: z.enum(["text", "youtube_video"]),
  reviewerName: z.string().trim().min(2, "Please enter your name."),
  reviewerEmail: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || /\S+@\S+\.\S+/.test(value), {
      message: "Please enter a valid email address.",
    }),
  reviewerContext: z.string().trim().max(120).optional(),
  reviewBody: z.string().trim().optional(),
  youtubeUrl: z.string().trim().optional(),
  starRating: z.coerce.number().int().min(1).max(5).optional(),
  sourcePath: z.string().trim().min(1),
  website: z.string().trim().optional(),
  startedAt: z.string().trim().min(1),
});

function getReviewErrorMessage(input: {
  reviewType: "text" | "youtube_video";
  reviewBody?: string;
  youtubeUrl?: string;
}) {
  if (input.reviewType === "text") {
    if (!input.reviewBody || input.reviewBody.length < 30) {
      return "Please share a more detailed review.";
    }

    return null;
  }

  if (!input.youtubeUrl) {
    return "Please paste a YouTube video link.";
  }

  if (!getYouTubeVideoId(input.youtubeUrl)) {
    return "Please use a valid YouTube video URL.";
  }

  return null;
}

export async function submitUniversityReviewAction(
  _prevState: UniversityReviewFormState,
  formData: FormData
): Promise<UniversityReviewFormState> {
  const parsed = reviewSchema.safeParse({
    universitySlug: getFormString(formData, "universitySlug"),
    reviewType: getFormString(formData, "reviewType"),
    reviewerName: getFormString(formData, "reviewerName"),
    reviewerEmail: getFormString(formData, "reviewerEmail"),
    reviewerContext: getFormString(formData, "reviewerContext"),
    reviewBody: getFormString(formData, "reviewBody"),
    youtubeUrl: getFormString(formData, "youtubeUrl"),
    starRating: getFormString(formData, "starRating"),
    sourcePath: getFormString(formData, "sourcePath"),
    website: getFormString(formData, "website"),
    startedAt: getFormString(formData, "startedAt"),
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Please check your review and try again.",
    };
  }

  const data = parsed.data;

  if (data.website) {
    return {
      error: "Spam detection triggered. Please try again.",
    };
  }

  if (wasSubmittedTooFast(data.startedAt)) {
    return {
      error: "Please take a moment and submit again.",
    };
  }

  const reviewError = getReviewErrorMessage({
    reviewType: data.reviewType,
    reviewBody: emptyToUndefined(data.reviewBody),
    youtubeUrl: emptyToUndefined(data.youtubeUrl),
  });

  if (reviewError) {
    return {
      error: reviewError,
    };
  }

  const db = getDb();

  if (!db) {
    return {
      error: "Reviews are temporarily unavailable. Please try again shortly.",
    };
  }

  const headerStore = await headers();
  const ipAddress = getIpAddress(headerStore);
  const submittedAt = new Date();
  const reviewerIdentifier =
    emptyToUndefined(data.reviewerEmail)?.toLowerCase() ??
    `${data.universitySlug}:${data.reviewerName.trim().toLowerCase()}`;

  const rateLimitError = await consumePublicFormRateLimits(
    [
      ipAddress
        ? {
            scope: "public:review:ip",
            identifier: ipAddress,
            limit: 3,
            windowMs: 60 * 60_000,
            blockMs: 6 * 60 * 60_000,
          }
        : null,
      {
        scope: "public:review:identity",
        identifier: reviewerIdentifier,
        limit: 2,
        windowMs: 24 * 60 * 60_000,
        blockMs: 24 * 60 * 60_000,
      },
    ],
    "review submissions"
  );

  if (rateLimitError) {
    return { error: rateLimitError };
  }

  const [universityRecord] = await db
    .select({
      id: universities.id,
      slug: universities.slug,
    })
    .from(universities)
    .where(eq(universities.slug, data.universitySlug))
    .limit(1);

  if (!universityRecord) {
    return {
      error: "We could not find that university. Please refresh and try again.",
    };
  }

  if (ipAddress) {
    const [recentReview] = await db
      .select({ id: universityReviews.id })
      .from(universityReviews)
      .where(
        and(
          eq(universityReviews.universityId, universityRecord.id),
          eq(universityReviews.ipAddress, ipAddress),
          gte(universityReviews.createdAt, minutesAgo(10))
        )
      )
      .limit(1);

    if (recentReview) {
      return {
        error: "Please wait a few minutes before submitting another review.",
      };
    }
  }

  const youtubeVideoId =
    data.reviewType === "youtube_video" && data.youtubeUrl
      ? getYouTubeVideoId(data.youtubeUrl)
      : null;

  const isShort =
    youtubeVideoId ? (await getYouTubeIsShort(youtubeVideoId)) ?? false : false;

  if (data.reviewType === "youtube_video" && youtubeVideoId) {
    const [duplicateVideo] = await db
      .select({ id: universityReviews.id })
      .from(universityReviews)
      .where(
        and(
          eq(universityReviews.universityId, universityRecord.id),
          eq(universityReviews.youtubeVideoId, youtubeVideoId)
        )
      )
      .limit(1);

    if (duplicateVideo) {
      return {
        error: "That YouTube review is already listed for this university.",
      };
    }
  }

  if (data.reviewType === "text" && data.reviewBody) {
    const [duplicateText] = await db
      .select({ id: universityReviews.id })
      .from(universityReviews)
      .where(
        and(
          eq(universityReviews.universityId, universityRecord.id),
          eq(universityReviews.reviewerName, data.reviewerName),
          eq(universityReviews.reviewBody, data.reviewBody)
        )
      )
      .limit(1);

    if (duplicateText) {
      return {
        error: "This review looks like a duplicate of one you already shared.",
      };
    }
  }

  try {
    await db.insert(universityReviews).values({
      universityId: universityRecord.id,
      reviewType: data.reviewType,
      reviewerName: data.reviewerName,
      reviewerEmail: emptyToUndefined(data.reviewerEmail),
      reviewerContext: emptyToUndefined(data.reviewerContext),
      reviewBody:
        data.reviewType === "text" ? emptyToUndefined(data.reviewBody) : null,
      youtubeUrl:
        data.reviewType === "youtube_video" && youtubeVideoId
          ? getYouTubeWatchUrl(youtubeVideoId)
          : null,
      youtubeVideoId,
      sourcePath: data.sourcePath,
      userAgent: headerStore.get("user-agent") ?? null,
      ipAddress,
      visibilityStatus: "hidden",
      verificationStatus: "unverified",
      isFeatured: false,
      isShort,
      starRating: data.reviewType === "text" ? (data.starRating ?? null) : null,
      createdAt: submittedAt,
      updatedAt: submittedAt,
    });
  } catch {
    return {
      error: "We could not publish your review right now. Please try again.",
    };
  }

  updateTag(getUniversityReviewsTag(universityRecord.slug));
  refresh();

  return {
    success: "Thanks for sharing your perspective. Your review is now queued for moderation.",
  };
}
