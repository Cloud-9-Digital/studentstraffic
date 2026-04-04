"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getUniversityHref } from "@/lib/routes";
import type { ReviewWithUniversity } from "@/lib/university-community";
import { cn } from "@/lib/utils";
import { YouTubePlayer } from "./youtube-player";

export function VideoReviewCard({
  review,
  className,
}: {
  review: ReviewWithUniversity;
  className?: string;
}) {
  const [isPlayingInline, setIsPlayingInline] = useState(false);

  if (!review.youtubeVideoId) return null;

  const thumbUrl = `https://i.ytimg.com/vi/${review.youtubeVideoId}/hqdefault.jpg`;
  const aspectClass = review.isShort
    ? "aspect-[4/5] max-h-[17rem] lg:max-h-[14.5rem]"
    : "aspect-[4/3] sm:aspect-video";

  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md",
        isPlayingInline && "col-span-2 lg:col-span-1",
        className
      )}
    >
      <div className="p-2 pb-0">
        {isPlayingInline ? (
          <div className="relative">
            <YouTubePlayer
              videoId={review.youtubeVideoId}
              isShort={review.isShort}
              className={cn("rounded-xl", aspectClass)}
              startMuted={false}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPlayingInline(false);
              }}
              className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-black/60 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/75 hover:text-white"
              aria-label="Close video"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsPlayingInline(true)}
            className={`group relative block w-full overflow-hidden rounded-xl bg-muted ${aspectClass}`}
            aria-label="Play video"
          >
            <img
              src={thumbUrl}
              alt={`${review.reviewerName} video review`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/25 transition-transform group-hover:scale-110">
                <Play className="size-4 fill-white text-white translate-x-0.5" />
              </div>
            </div>
            {/* Expand hint */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[0.55rem] font-medium text-white/90 backdrop-blur-sm">
              <Play className="size-2.5 fill-white" />
              Play
            </div>
          </button>
        )}
      </div>

      <div className="px-2.5 py-2.5">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="truncate text-[0.82rem] font-semibold text-foreground">
            {review.reviewerName}
          </span>
          {review.verificationStatus === "verified" && (
            <Badge className="shrink-0 rounded-full px-1.5 py-0 text-[0.6rem]">
              Verified
            </Badge>
          )}
        </div>
        <p className="mt-1 truncate text-[0.68rem] leading-none text-muted-foreground">
          {[review.reviewerContext, review.universityName]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <Link
          href={getUniversityHref(review.universitySlug)}
          className="mt-1 block truncate text-[0.68rem] leading-none font-medium text-primary transition-colors hover:text-accent"
        >
          {review.universityName}
        </Link>
      </div>
    </div>
  );
}
