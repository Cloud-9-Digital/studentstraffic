import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buildIndexableMetadata } from "@/lib/metadata";
import { getUniversityHref } from "@/lib/routes";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import {
  getAllLiveReviews,
  type ReviewWithUniversity,
} from "@/lib/university-community";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Student Reviews | MBBS Abroad Experience | Students Traffic",
  description:
    "Read and watch honest reviews from Indian students studying MBBS abroad — academics, hostel life, food, clinical exposure, and daily experience at universities across Vietnam, Russia, Georgia and more.",
  path: "/reviews",
});

function ReviewerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
      {initials}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`size-3.5 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

function VideoReviewCard({ review }: { review: ReviewWithUniversity }) {
  if (!review.youtubeVideoId || !review.youtubeUrl) return null;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-video overflow-hidden bg-muted">
        <iframe
          src={getYouTubeEmbedUrl(review.youtubeVideoId)}
          title={`${review.reviewerName} — ${review.universityName}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <div className="flex items-start gap-3 p-4">
        <ReviewerAvatar name={review.reviewerName} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-foreground">
              {review.reviewerName}
            </p>
            {review.verificationStatus === "verified" && (
              <Badge className="rounded-full px-1.5 py-0 text-[0.6rem]">Verified</Badge>
            )}
          </div>
          {review.reviewerContext && (
            <p className="text-xs text-muted-foreground">{review.reviewerContext}</p>
          )}
          <Link
            href={getUniversityHref(review.universitySlug)}
            className="mt-0.5 text-xs font-medium text-primary transition-colors hover:text-accent"
          >
            {review.universityName}
          </Link>
        </div>
        <Link
          href={review.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-accent hover:underline"
        >
          Watch <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}

function TextReviewCard({ review }: { review: ReviewWithUniversity }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <ReviewerAvatar name={review.reviewerName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">
                {review.reviewerName}
              </span>
              {review.verificationStatus === "verified" && (
                <Badge className="rounded-full px-1.5 py-0 text-[0.6rem]">Verified</Badge>
              )}
            </div>
            {review.starRating && <Stars rating={review.starRating} />}
          </div>
          {review.reviewerContext && (
            <p className="text-xs text-muted-foreground">{review.reviewerContext}</p>
          )}
          <Link
            href={getUniversityHref(review.universitySlug)}
            className="text-xs font-medium text-primary transition-colors hover:text-accent"
          >
            {review.universityName}
          </Link>
        </div>
      </div>
      {review.reviewBody && (
        <p className="text-sm leading-relaxed text-foreground/80">
          {review.reviewBody}
        </p>
      )}
    </div>
  );
}

export default async function ReviewsPage() {
  const reviews = await getAllLiveReviews();
  const videoReviews = reviews.filter((r) => r.reviewType === "youtube_video");
  const textReviews = reviews.filter((r) => r.reviewType === "text");
  const totalCount = reviews.length;

  return (
    <div className="container-shell py-12 md:py-16">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          From students, not agents
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-heading sm:text-5xl">
          Student reviews
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Real experiences from Indian students studying MBBS abroad —
          academics, hostels, food, clinical training, and life on campus.
          {totalCount > 0 && (
            <span className="ml-1 font-medium text-foreground">
              {totalCount} review{totalCount !== 1 ? "s" : ""} published.
            </span>
          )}
        </p>
      </div>

      {totalCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
          <p className="font-medium text-heading">No reviews published yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check individual university pages to submit the first review.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {videoReviews.length > 0 && (
            <section>
              <h2 className="mb-5 text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
                Video reviews ({videoReviews.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {videoReviews.map((review) => (
                  <VideoReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
          )}

          {textReviews.length > 0 && (
            <section>
              <h2 className="mb-5 text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
                Written reviews ({textReviews.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {textReviews.map((review) => (
                  <TextReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
