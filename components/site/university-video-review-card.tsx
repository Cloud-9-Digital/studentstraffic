"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import { YouTubePlayer } from "@/app/reviews/_components/youtube-player";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UniversityReview } from "@/lib/data/types";

export function UniversityVideoReviewCard({ review }: { review: UniversityReview }) {
  const [open, setOpen] = useState(false);
  if (!review.youtubeVideoId) return null;
  const thumbUrl = `https://i.ytimg.com/vi/${review.youtubeVideoId}/hqdefault.jpg`;
  const aspectClass = review.isShort ? "aspect-[9/16]" : "aspect-video";
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <div className="p-2 pb-0">
          <button
            onClick={() => setOpen(true)}
            className={`group relative block w-full overflow-hidden rounded-lg bg-muted ${aspectClass}`}
            aria-label="Play video"
          >
            <img
              src={thumbUrl}
              alt={`${review.reviewerName} video review`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/25 transition-transform group-hover:scale-110">
                <Play className="size-4 fill-white text-white translate-x-0.5" />
              </div>
            </div>
          </button>
        </div>
        <div className="px-2.5 py-2">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="truncate text-[0.82rem] font-semibold text-foreground">{review.reviewerName}</span>
            {review.verificationStatus === "verified" && (
              <Badge className="shrink-0 rounded-full px-1.5 py-0 text-[0.6rem]">Verified</Badge>
            )}
          </div>
          {review.reviewerContext && (
            <p className="mt-0.5 truncate text-[0.68rem] leading-none text-muted-foreground">{review.reviewerContext}</p>
          )}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
          <DialogTitle className="sr-only">{review.reviewerName} video review</DialogTitle>
          <YouTubePlayer videoId={review.youtubeVideoId} isShort={review.isShort} />
          <div className="px-4 py-3">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="truncate text-sm font-semibold text-foreground">{review.reviewerName}</span>
              {review.verificationStatus === "verified" && (
                <Badge className="shrink-0 rounded-full px-1.5 py-0 text-[0.6rem]">Verified</Badge>
              )}
            </div>
            {review.reviewerContext && (
              <p className="mt-0.5 text-[0.7rem] leading-none text-muted-foreground">{review.reviewerContext}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
