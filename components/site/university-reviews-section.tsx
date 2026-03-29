import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";


import { UniversityReviewForm } from "@/components/site/university-review-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { UniversityReview } from "@/lib/data/types";
import { getUniversityReviews } from "@/lib/university-community";
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
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/12 text-xs font-bold text-accent ring-2 ring-accent/10">
      {initials}
    </div>
  );
}

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "size-5" : "size-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={
            star <= rating
              ? `${cls} fill-yellow-400 text-yellow-400`
              : `${cls} fill-none text-border`
          }
        />
      ))}
    </div>
  );
}

function VideoReviewCard({ review }: { review: UniversityReview }) {
  if (!review.youtubeVideoId || !review.youtubeUrl) return null;

  return (
    <Card className="overflow-hidden border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-video overflow-hidden border-b border-border/60 bg-muted">
        <iframe
          src={getYouTubeEmbedUrl(review.youtubeVideoId)}
          title={`${review.reviewerName} video review`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <CardContent className="py-5">
        <div className="flex items-center gap-3">
          <ReviewerAvatar name={review.reviewerName} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-sm font-semibold text-foreground">{review.reviewerName}</p>
              {review.verificationStatus === "verified" && (
                <Badge className="rounded-full px-2 py-0.5 text-[0.65rem]">Verified</Badge>
              )}
              {review.isFeatured && (
                <Badge className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] text-white">Featured</Badge>
              )}
            </div>
            {review.reviewerContext && (
              <p className="text-xs text-muted-foreground">{review.reviewerContext}</p>
            )}
            <p className="text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground/70">
              {formatReviewDate(review.createdAt)}
            </p>
          </div>
          <Link
            href={review.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:text-accent-strong"
          >
            YouTube
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function TextReviewCard({ review }: { review: UniversityReview }) {
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="relative p-6 sm:p-7">
        {/* Decorative quote mark */}
        <span className="pointer-events-none absolute right-5 top-3 font-display text-[5rem] font-bold leading-none text-accent/8 select-none">
          &ldquo;
        </span>

        {/* Stars */}
        {review.starRating ? (
          <div className="mb-4">
            <StarDisplay rating={review.starRating} size="md" />
          </div>
        ) : null}

        {/* Review body */}
        <p className="relative text-sm leading-[1.85] text-foreground/85 sm:text-[0.9375rem]">
          {review.reviewBody}
        </p>

        {/* Reviewer */}
        <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-5">
          <ReviewerAvatar name={review.reviewerName} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-sm font-semibold text-foreground">{review.reviewerName}</p>
              {review.verificationStatus === "verified" && (
                <Badge className="rounded-full px-2 py-0.5 text-[0.65rem]">Verified</Badge>
              )}
              {review.isFeatured && (
                <Badge className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] text-white">Featured</Badge>
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0">
              {review.reviewerContext && (
                <p className="text-xs text-muted-foreground">{review.reviewerContext}</p>
              )}
              <p className="text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground/60">
                {formatReviewDate(review.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AggregateRating({ reviews }: { reviews: UniversityReview[] }) {
  const rated = reviews.filter((r) => r.reviewType === "text" && r.starRating);
  if (rated.length === 0) return null;
  const avg = rated.reduce((sum, r) => sum + (r.starRating ?? 0), 0) / rated.length;
  const rounded = Math.round(avg * 10) / 10;

  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm">
      <span className="font-display text-3xl font-semibold text-heading">{rounded}</span>
      <div>
        <StarDisplay rating={Math.round(avg)} size="md" />
        <p className="mt-0.5 text-xs text-muted-foreground">{rated.length} rating{rated.length !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
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
    reviews.filter((r) => r.reviewType === "youtube_video")
  );
  const textReviews = sortTextReviews(
    reviews.filter((r) => r.reviewType === "text")
  );
  const totalCount = videoReviews.length + textReviews.length;

  return (
    <div id="reviews" className="deferred-render py-10">

      {/* ── Section header ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="size-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Student Reviews
            </span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
            What students say about {universityName}
          </h2>
          {totalCount > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {totalCount} review{totalCount !== 1 ? "s" : ""} from students and community members
            </p>
          )}
        </div>
        <AggregateRating reviews={reviews} />
      </div>

      {/* ── Reviews ───────────────────────────────────────────────────── */}
      {totalCount === 0 ? (
        <div className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-muted/20 py-12 text-center">
          <p className="font-display text-xl font-semibold text-heading">No reviews yet.</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
            Be the first to share your experience at {universityName}.
          </p>
        </div>
      ) : null}

      {videoReviews.length > 0 ? (
        <div className="mt-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Video reviews</p>
          <div className="grid gap-4">
            {videoReviews.map((review) => (
              <VideoReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      ) : null}

      {textReviews.length > 0 ? (
        <div className="mt-8 space-y-3">
          {videoReviews.length > 0 && (
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Written reviews</p>
          )}
          <div className="grid gap-4">
            {textReviews.map((review) => (
              <TextReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      ) : null}

      {/* ── Add review CTA ────────────────────────────────────────────── */}
      <div className="mt-10 section-tint rounded-[1.75rem] p-6 sm:p-8">
        <UniversityReviewForm
          sourcePath={`/universities/${universitySlug}`}
          universitySlug={universitySlug}
          universityName={universityName}
        />
      </div>

    </div>
  );
}
