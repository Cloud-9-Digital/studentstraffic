import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { UniversityReviewForm } from "@/components/site/university-review-form";
import { Badge } from "@/components/ui/badge";
import type { UniversityReview } from "@/lib/data/types";
import { getUniversityReviews } from "@/lib/university-community";
import { absoluteUrl } from "@/lib/metadata";
import { getUniversityHref } from "@/lib/routes";
import { getUniversityStructuredDataId } from "@/lib/structured-data";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function sortVideoReviews(reviews: UniversityReview[]) {
  return [...reviews].sort((left, right) => {
    if (left.isFeatured !== right.isFeatured) {
      return Number(right.isFeatured) - Number(left.isFeatured);
    }
    return right.createdAt.localeCompare(left.createdAt);
  });
}

function sortTextReviews(reviews: UniversityReview[]) {
  return [...reviews].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt)
  );
}

function ReviewerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[0.65rem] font-bold text-accent">
      {initials}
    </div>
  );
}

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const cls = size === "sm" ? "size-3.5" : "size-3";
  return (
    <div className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={
            star <= rating
              ? `${cls} fill-yellow-400 text-yellow-400`
              : `${cls} fill-muted text-muted`
          }
        />
      ))}
    </div>
  );
}

function VideoReviewCard({ review }: { review: UniversityReview }) {
  if (!review.youtubeVideoId || !review.youtubeUrl) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <div className="aspect-video overflow-hidden bg-muted">
        <iframe
          src={getYouTubeEmbedUrl(review.youtubeVideoId)}
          title={`${review.reviewerName} video review`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <div className="flex items-center gap-2.5 px-4 py-3">
        <ReviewerAvatar name={review.reviewerName} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-foreground">{review.reviewerName}</p>
            {review.verificationStatus === "verified" && (
              <Badge className="rounded-full px-1.5 py-0 text-[0.6rem]">Verified</Badge>
            )}
          </div>
          {review.reviewerContext && (
            <p className="text-xs text-muted-foreground">{review.reviewerContext}</p>
          )}
        </div>
        <Link
          href={review.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-accent hover:underline"
        >
          Watch
          <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}

function TextReviewRow({ review, isLast }: { review: UniversityReview; isLast: boolean }) {
  return (
    <div className={!isLast ? "border-b border-border/50 pb-4" : undefined}>
      <div className="flex items-start gap-2.5">
        <ReviewerAvatar name={review.reviewerName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">{review.reviewerName}</span>
              {review.verificationStatus === "verified" && (
                <Badge className="rounded-full px-1.5 py-0 text-[0.6rem]">Verified</Badge>
              )}
            </div>
            {review.starRating ? <StarDisplay rating={review.starRating} size="sm" /> : null}
          </div>
          <p className="text-[0.7rem] text-muted-foreground">
            {review.reviewerContext ? `${review.reviewerContext} · ` : ""}
            {formatReviewDate(review.createdAt)}
          </p>
          {review.reviewBody && (
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{review.reviewBody}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AggregateRatingDisplay({ reviews }: { reviews: UniversityReview[] }) {
  const rated = reviews.filter((r) => r.reviewType === "text" && r.starRating);
  if (rated.length === 0) return null;
  const avg = rated.reduce((sum, r) => sum + (r.starRating ?? 0), 0) / rated.length;
  const rounded = Math.round(avg * 10) / 10;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xl font-bold tabular-nums text-heading">{rounded}</span>
      <StarDisplay rating={Math.round(avg)} size="sm" />
      <span className="text-xs text-muted-foreground">({rated.length})</span>
    </div>
  );
}

function buildReviewsSchema(
  reviews: UniversityReview[],
  universitySlug: string,
  universityName: string,
) {
  const universityId = getUniversityStructuredDataId(universitySlug);
  const universityUrl = absoluteUrl(getUniversityHref(universitySlug));

  const textReviews = reviews.filter(
    (r) => r.reviewType === "text" && r.reviewBody,
  );
  const rated = textReviews.filter((r) => r.starRating);

  const graph: object[] = textReviews.map((r) => ({
    "@type": "Review",
    "@id": `${universityUrl}#review-${r.id}`,
    author: { "@type": "Person", name: r.reviewerName },
    reviewBody: r.reviewBody,
    datePublished: r.createdAt.slice(0, 10),
    itemReviewed: { "@id": universityId },
    ...(r.starRating
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.starRating,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }));

  if (rated.length > 0) {
    const avg =
      rated.reduce((sum, r) => sum + (r.starRating ?? 0), 0) / rated.length;
    graph.push({
      "@type": "AggregateRating",
      "@id": `${universityUrl}#aggregate-rating`,
      itemReviewed: { "@id": universityId, "@type": "CollegeOrUniversity", name: universityName },
      ratingValue: String(Math.round(avg * 10) / 10),
      bestRating: "5",
      worstRating: "1",
      reviewCount: rated.length,
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export async function UniversityReviewsSection({
  universitySlug,
  universityName,
}: {
  universitySlug: string;
  universityName: string;
}) {
  const reviews = await getUniversityReviews(universitySlug);
  const videoReviews = sortVideoReviews(
    reviews.filter((r) => r.reviewType === "youtube_video"),
  );
  const textReviews = sortTextReviews(
    reviews.filter((r) => r.reviewType === "text"),
  );
  const totalCount = videoReviews.length + textReviews.length;
  const hasSchema = reviews.some((r) => r.reviewType === "text" && r.reviewBody);

  return (
    <div id="reviews" className="deferred-render py-10">
      {hasSchema && (
        <JsonLd data={buildReviewsSchema(reviews, universitySlug, universityName)} />
      )}

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <h2 className="font-display text-xl font-semibold tracking-tight text-heading">
            Student reviews
          </h2>
          {totalCount > 0 && (
            <span className="text-sm text-muted-foreground">{totalCount}</span>
          )}
        </div>
        <AggregateRatingDisplay reviews={reviews} />
      </div>

      {totalCount === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-10 text-center">
          <p className="text-sm font-medium text-heading">No reviews yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to share your experience at {universityName}.
          </p>
        </div>
      )}

      {videoReviews.length > 0 && (
        <div className="mb-5">
          <p className="mb-2.5 text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
            Video reviews
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {videoReviews.map((review) => (
              <VideoReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      {textReviews.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card px-4 py-4 sm:px-5">
          <div className="space-y-4">
            {textReviews.map((review, i) => (
              <TextReviewRow
                key={review.id}
                review={review}
                isLast={i === textReviews.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add review */}
      <div className="mt-6 section-tint rounded-[1.75rem] p-5 sm:p-6">
        <UniversityReviewForm
          sourcePath={`/universities/${universitySlug}`}
          universitySlug={universitySlug}
          universityName={universityName}
        />
      </div>
    </div>
  );
}
