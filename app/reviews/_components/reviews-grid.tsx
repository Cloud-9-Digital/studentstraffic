import { ChevronDown, MessageSquareQuote } from "lucide-react";

import type { ReviewWithUniversity } from "@/lib/university-community";
import { VideoReviewCard } from "./video-review-card";
import { TextReviewCard } from "./text-review-card";

export type ReviewSort = "newest" | "oldest" | "top_rated";

const sortOptions: { value: ReviewSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "top_rated", label: "Top rated" },
];

function sortReviews(reviews: ReviewWithUniversity[], sort: ReviewSort) {
  return [...reviews].sort((a, b) => {
    if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
    if (sort === "top_rated") return (b.starRating ?? 0) - (a.starRating ?? 0);
    return b.createdAt.localeCompare(a.createdAt); // newest
  });
}

export function ReviewsGrid({
  reviews,
  totalCount,
  activeFilterCount,
  sort,
  onSortChange,
  onClearFilters,
}: {
  reviews: ReviewWithUniversity[];
  totalCount: number;
  activeFilterCount: number;
  sort: ReviewSort;
  onSortChange: (sort: ReviewSort) => void;
  onClearFilters: () => void;
}) {
  const sorted = sortReviews(reviews, sort);

  return (
    <div>
      {/* Count + sort bar */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-none text-heading">
            {reviews.length.toLocaleString()}{" "}
            {reviews.length === 1 ? "review" : "reviews"}
            {activeFilterCount > 0 && reviews.length < totalCount && (
              <span className="ml-1 font-normal text-muted-foreground">
                of {totalCount}
              </span>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <label
            htmlFor="reviews-sort"
            className="whitespace-nowrap text-sm font-medium leading-none text-muted-foreground"
          >
            Sort by
          </label>
          <div className="relative">
            <select
              id="reviews-sort"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as ReviewSort)}
              className="h-8 min-w-[148px] appearance-none rounded-lg border border-border/80 bg-card px-3 pr-8 text-sm font-medium text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && reviews.length < totalCount && (
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
          </span>
          <button
            onClick={onClearFilters}
            className="text-xs font-medium text-[#c2410c] hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <MessageSquareQuote className="mx-auto mb-3 size-8 text-slate-300" />
          <p className="font-medium text-slate-600">
            No reviews match your filters.
          </p>
          <button
            onClick={onClearFilters}
            className="mt-2 text-sm text-[#c2410c] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 items-start gap-3 sm:gap-4 lg:grid-cols-4">
          {sorted.map((review) =>
            review.reviewType === "youtube_video" ? (
              <VideoReviewCard key={review.id} review={review} />
            ) : (
              <TextReviewCard key={review.id} review={review} />
            )
          )}
        </div>
      )}
    </div>
  );
}
