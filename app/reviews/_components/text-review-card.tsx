"use client";

import { useState } from "react";
import Link from "next/link";
import { Quote } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getUniversityHref } from "@/lib/routes";
import type { ReviewWithUniversity } from "@/lib/university-community";
import { cn } from "@/lib/utils";
import { Stars } from "./stars";

export function TextReviewCard({
  review,
  className,
}: {
  review: ReviewWithUniversity;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const reviewBody = review.reviewBody?.trim() ?? "";
  const isCollapsible = reviewBody.length > 180;

  return (
    <div
      className={cn(
        "min-w-0 flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-card p-3.5 shadow-sm",
        className
      )}
    >
      <Quote className="size-4 text-accent/30" />
      {reviewBody && (
        <div>
          <p
            className={cn(
              "text-sm leading-6 text-foreground/80 [overflow-wrap:anywhere]",
              isCollapsible &&
                !expanded &&
                "[display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:5]"
            )}
          >
            {reviewBody}
          </p>
          {isCollapsible && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-2 text-xs font-semibold text-accent transition-colors hover:text-accent-strong"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}
      <div className="mt-auto border-t border-border/50 pt-3">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="truncate text-sm font-semibold text-foreground">
            {review.reviewerName}
          </span>
          {review.verificationStatus === "verified" && (
            <Badge className="shrink-0 rounded-full px-1.5 py-0 text-[0.6rem]">
              Verified
            </Badge>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 leading-none">
          {review.reviewerContext && (
            <span className="text-[0.72rem] text-muted-foreground [overflow-wrap:anywhere]">
              {review.reviewerContext}
            </span>
          )}
          {review.starRating && <Stars rating={review.starRating} />}
        </div>
        <Link
          href={getUniversityHref(review.universitySlug)}
          className="mt-1 block truncate text-[0.72rem] leading-none font-medium text-primary transition-colors hover:text-accent"
        >
          {review.universityName}
        </Link>
      </div>
    </div>
  );
}
