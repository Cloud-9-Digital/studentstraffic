import Link from "next/link";
import { ArrowUpRight, PlayCircle } from "lucide-react";

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

function ReviewMeta({
  review,
  video = false,
}: {
  review: UniversityReview;
  video?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {video ? (
          <Badge variant="outline" className="rounded-full px-3 py-1">
            Video review
          </Badge>
        ) : (
          <Badge variant="outline" className="rounded-full px-3 py-1">
            Text review
          </Badge>
        )}
        {review.verificationStatus === "verified" ? (
          <Badge className="rounded-full px-3 py-1">Verified student</Badge>
        ) : null}
        {review.isFeatured ? (
          <Badge className="rounded-full bg-accent px-3 py-1 text-white">
            Featured
          </Badge>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">{review.reviewerName}</p>
        {review.reviewerContext ? (
          <p className="text-sm text-muted-foreground">{review.reviewerContext}</p>
        ) : null}
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Shared {formatReviewDate(review.createdAt)}
        </p>
      </div>
    </div>
  );
}

function VideoReviewCard({ review }: { review: UniversityReview }) {
  if (!review.youtubeVideoId || !review.youtubeUrl) {
    return null;
  }

  return (
    <Card className="overflow-hidden border-border/80 bg-card/95 shadow-sm">
      <div className="aspect-video overflow-hidden border-b border-border bg-muted">
        <iframe
          src={getYouTubeEmbedUrl(review.youtubeVideoId)}
          title={`${review.reviewerName} video review`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <CardContent className="space-y-4 py-5">
        <ReviewMeta review={review} video />
        <Link
          href={review.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-strong"
        >
          Watch on YouTube
          <ArrowUpRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

function TextReviewCard({ review }: { review: UniversityReview }) {
  return (
    <Card className="border-border/80 bg-card/95 shadow-sm">
      <CardContent className="space-y-5 py-6">
        <ReviewMeta review={review} />
        <p className="text-sm leading-7 text-muted-foreground">
          {review.reviewBody}
        </p>
      </CardContent>
    </Card>
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
    reviews.filter((review) => review.reviewType === "youtube_video")
  );
  const textReviews = sortTextReviews(
    reviews.filter((review) => review.reviewType === "text")
  );

  return (
    <div id="reviews" className="deferred-render space-y-6 py-10">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Reviews
      </h2>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(380px,1.2fr)]">
        <div className="section-tint rounded-[1.75rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent/80">
            Student voices
          </p>
          <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-heading">
            See how students talk about {universityName}.
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            Browse written experiences and YouTube reviews from students and
            community members, then add your own perspective if you&apos;ve
            studied there.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-white/75 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-accent">
                <PlayCircle className="size-4" />
                <span className="text-sm font-semibold text-foreground">
                  YouTube video reviews
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Hosted on YouTube only, so videos load reliably across the site.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/75 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-accent">
                <Badge variant="outline" className="rounded-full px-2 py-0.5">
                  Text
                </Badge>
                <span className="text-sm font-semibold text-foreground">
                  Written reviews
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Quick perspective on academics, campus life, city fit, and the
                day-to-day student experience.
              </p>
            </div>
          </div>
        </div>

        <UniversityReviewForm
          sourcePath={`/universities/${universitySlug}`}
          universitySlug={universitySlug}
          universityName={universityName}
        />
      </div>

      {videoReviews.length === 0 && textReviews.length === 0 ? (
        <Card className="border-dashed border-border/80 bg-muted/20">
          <CardContent className="py-10 text-center">
            <p className="font-medium text-foreground">No reviews yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Be the first to share a text review or a YouTube video review for
              this university.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {videoReviews.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Video reviews</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {videoReviews.map((review) => (
              <VideoReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      ) : null}

      {textReviews.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Text reviews</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {textReviews.map((review) => (
              <TextReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
