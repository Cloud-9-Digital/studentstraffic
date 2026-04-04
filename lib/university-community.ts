import "server-only";

import { and, asc, desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import type {
  UniversityPeerAvailability,
  UniversityReview,
} from "@/lib/data/types";
import { getDb } from "@/lib/db/server";
import {
  countries,
  studentPeers,
  universities,
  universityReviews,
} from "@/lib/db/schema";

function toIsoString(value: Date | null | undefined) {
  return (value ?? new Date()).toISOString();
}

function logCommunityDataFallback(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[university-community] ${scope}. Rendering fallback data instead. ${message}`);
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

  try {
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
  } catch (error) {
    logCommunityDataFallback(
      `Unable to load peer availability for ${universitySlug}`,
      error,
    );

    return {
      universitySlug,
      activePeerCount: 0,
      hasPeers: false,
    };
  }
}

export type PublicPeer = {
  id: number;
  fullName: string;
  photoUrl: string | null;
  courseName: string | null;
  currentYearOrBatch: string | null;
  hasWhatsApp: boolean;
  homeState: string | null;
  homeCity: string | null;
  languages: string[] | null;
};

export async function getActivePeersForUniversity(
  universitySlug: string
): Promise<PeerWithUniversity[]> {
  "use cache";

  cacheLife("hours");
  cacheTag(getUniversityPeersTag(universitySlug));

  const db = getDb();

  if (!db) return [];

  try {
    const rows = await db
      .select({
        id: studentPeers.id,
        fullName: studentPeers.fullName,
        photoUrl: studentPeers.photoUrl,
        courseName: studentPeers.courseName,
        currentYearOrBatch: studentPeers.currentYearOrBatch,
        hasWhatsApp: sql<boolean>`${studentPeers.contactPhone} is not null`.mapWith(Boolean),
        homeState: studentPeers.homeState,
        homeCity: studentPeers.homeCity,
        languages: studentPeers.languages,
        universitySlug: universities.slug,
        universityName: universities.name,
        countryName: countries.name,
      })
      .from(studentPeers)
      .innerJoin(universities, eq(studentPeers.universityId, universities.id))
      .innerJoin(countries, eq(universities.countryId, countries.id))
      .where(
        and(
          eq(universities.slug, universitySlug),
          eq(studentPeers.status, "active")
        )
      )
      .orderBy(asc(studentPeers.id));

    return rows;
  } catch (error) {
    logCommunityDataFallback(
      `Unable to load active peers for ${universitySlug}`,
      error,
    );
    return [];
  }
}

export type PeerWithUniversity = PublicPeer & {
  universitySlug: string;
  universityName: string;
  countryName: string;
};

export async function getAllActivePeers(): Promise<PeerWithUniversity[]> {
  "use cache";

  cacheLife("hours");

  const db = getDb();
  if (!db) return [];

  try {
    const rows = await db
      .select({
        id: studentPeers.id,
        fullName: studentPeers.fullName,
        photoUrl: studentPeers.photoUrl,
        courseName: studentPeers.courseName,
        currentYearOrBatch: studentPeers.currentYearOrBatch,
        hasWhatsApp: sql<boolean>`${studentPeers.contactPhone} is not null`.mapWith(Boolean),
        homeState: studentPeers.homeState,
        homeCity: studentPeers.homeCity,
        languages: studentPeers.languages,
        universitySlug: universities.slug,
        universityName: universities.name,
        countryName: countries.name,
      })
      .from(studentPeers)
      .innerJoin(universities, eq(studentPeers.universityId, universities.id))
      .innerJoin(countries, eq(universities.countryId, countries.id))
      .where(eq(studentPeers.status, "active"))
      .orderBy(asc(universities.name), asc(studentPeers.id));

    return rows;
  } catch (error) {
    logCommunityDataFallback("Unable to load active peers", error);
    return [];
  }
}

export type PeerUniversity = {
  slug: string;
  name: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  countryName: string;
  peerCount: number;
};

export type UniversityWithPeers = {
  slug: string;
  name: string;
  countryName: string;
  logoUrl: string | null;
  peers: PublicPeer[];
};

export async function getUniversitiesWithPeerProfiles(): Promise<UniversityWithPeers[]> {
  "use cache";

  cacheLife("hours");

  const db = getDb();
  if (!db) return [];

  try {
    const rows = await db
      .select({
        universitySlug: universities.slug,
        universityName: universities.name,
        countryName: countries.name,
        logoUrl: universities.logoUrl,
        peerId: studentPeers.id,
        peerFullName: studentPeers.fullName,
        peerPhotoUrl: studentPeers.photoUrl,
        peerCourseName: studentPeers.courseName,
        peerCurrentYearOrBatch: studentPeers.currentYearOrBatch,
        hasWhatsApp: sql<boolean>`${studentPeers.contactPhone} is not null`.mapWith(Boolean),
        homeState: studentPeers.homeState,
        homeCity: studentPeers.homeCity,
        languages: studentPeers.languages,
      })
      .from(studentPeers)
      .innerJoin(universities, eq(studentPeers.universityId, universities.id))
      .innerJoin(countries, eq(universities.countryId, countries.id))
      .where(eq(studentPeers.status, "active"))
      .orderBy(asc(universities.name), asc(studentPeers.id));

    const map = new Map<string, UniversityWithPeers>();

    for (const row of rows) {
      let uni = map.get(row.universitySlug);
      if (!uni) {
        uni = {
          slug: row.universitySlug,
          name: row.universityName,
          countryName: row.countryName,
          logoUrl: row.logoUrl,
          peers: [],
        };
        map.set(row.universitySlug, uni);
      }
      uni.peers.push({
        id: row.peerId,
        fullName: row.peerFullName,
        photoUrl: row.peerPhotoUrl,
        courseName: row.peerCourseName,
        currentYearOrBatch: row.peerCurrentYearOrBatch,
        hasWhatsApp: row.hasWhatsApp,
        homeState: row.homeState,
        homeCity: row.homeCity,
        languages: row.languages,
      });
    }

    return [...map.values()];
  } catch (error) {
    logCommunityDataFallback("Unable to load universities with peer profiles", error);
    return [];
  }
}

export async function getUniversitiesWithActivePeers(
  limit = 6
): Promise<PeerUniversity[]> {
  "use cache";

  cacheLife("hours");

  const db = getDb();
  if (!db) return [];

  try {
    const rows = await db
      .select({
        slug: universities.slug,
        name: universities.name,
        logoUrl: universities.logoUrl,
        coverImageUrl: universities.coverImageUrl,
        countryName: countries.name,
        peerCount: sql<number>`count(${studentPeers.id})`.mapWith(Number),
      })
      .from(studentPeers)
      .innerJoin(universities, eq(studentPeers.universityId, universities.id))
      .innerJoin(countries, eq(universities.countryId, countries.id))
      .where(eq(studentPeers.status, "active"))
      .groupBy(
        universities.slug,
        universities.name,
        universities.logoUrl,
        universities.coverImageUrl,
        countries.name
      )
      .orderBy(desc(sql`count(${studentPeers.id})`))
      .limit(limit);

    return rows;
  } catch (error) {
    logCommunityDataFallback("Unable to load universities with active peers", error);
    return [];
  }
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

  try {
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
  } catch (error) {
    logCommunityDataFallback(
      `Unable to load university reviews for ${universitySlug}`,
      error,
    );
    return [];
  }
}

export type ReviewWithUniversity = UniversityReview & {
  universityName: string;
  countryName: string;
  isShort: boolean;
};

export async function getAllLiveReviews(): Promise<ReviewWithUniversity[]> {
  "use cache";

  cacheLife("minutes");

  const db = getDb();
  if (!db) return [];

  try {
    const rows = await db
      .select({
        id: universityReviews.id,
        universitySlug: universities.slug,
        universityName: universities.name,
        countryName: countries.name,
        reviewType: universityReviews.reviewType,
        reviewerName: universityReviews.reviewerName,
        reviewerContext: universityReviews.reviewerContext,
        reviewBody: universityReviews.reviewBody,
        youtubeUrl: universityReviews.youtubeUrl,
        youtubeVideoId: universityReviews.youtubeVideoId,
        visibilityStatus: universityReviews.visibilityStatus,
        verificationStatus: universityReviews.verificationStatus,
        isFeatured: universityReviews.isFeatured,
        isShort: universityReviews.isShort,
        starRating: universityReviews.starRating,
        createdAt: universityReviews.createdAt,
      })
      .from(universityReviews)
      .innerJoin(universities, eq(universityReviews.universityId, universities.id))
      .innerJoin(countries, eq(universities.countryId, countries.id))
      .where(eq(universityReviews.visibilityStatus, "live"))
      .orderBy(desc(universityReviews.isFeatured), desc(universityReviews.createdAt));

    return rows.map((r) => ({
      id: r.id,
      universitySlug: r.universitySlug,
      universityName: r.universityName,
      countryName: r.countryName,
      reviewType: r.reviewType,
      reviewerName: r.reviewerName,
      reviewerContext: r.reviewerContext ?? undefined,
      reviewBody: r.reviewBody ?? undefined,
      youtubeUrl: r.youtubeUrl ?? undefined,
      youtubeVideoId: r.youtubeVideoId ?? undefined,
      visibilityStatus: r.visibilityStatus,
      verificationStatus: r.verificationStatus,
      isFeatured: r.isFeatured,
      isShort: r.isShort,
      starRating: r.starRating ?? undefined,
      createdAt: toIsoString(r.createdAt),
    }));
  } catch (error) {
    logCommunityDataFallback("Unable to load live university reviews", error);
    return [];
  }
}
