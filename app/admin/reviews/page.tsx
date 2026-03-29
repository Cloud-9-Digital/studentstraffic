import { desc, eq } from "drizzle-orm";

import { moderateReviewAction } from "@/app/_actions/moderate-university-review";
import { getDb } from "@/lib/db/server";
import { universities, universityReviews } from "@/lib/db/schema";

function ActionButton({
  reviewId,
  action,
  label,
  variant,
}: {
  reviewId: number;
  action: string;
  label: string;
  variant: "default" | "destructive" | "muted";
}) {
  const variantClass =
    variant === "destructive"
      ? "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
      : variant === "muted"
        ? "bg-muted text-muted-foreground hover:bg-muted/80 border-border"
        : "bg-accent/10 text-accent hover:bg-accent/20 border-accent/20";

  return (
    <form
      action={async () => {
        "use server";
        await moderateReviewAction(reviewId, action as Parameters<typeof moderateReviewAction>[1]);
      }}
    >
      <button
        type="submit"
        className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${variantClass}`}
      >
        {label}
      </button>
    </form>
  );
}

export default async function AdminReviewsPage() {
  const db = getDb();

  const rows = db
    ? await db
        .select({
          id: universityReviews.id,
          universityName: universities.name,
          universitySlug: universities.slug,
          reviewType: universityReviews.reviewType,
          reviewerName: universityReviews.reviewerName,
          reviewerContext: universityReviews.reviewerContext,
          reviewBody: universityReviews.reviewBody,
          youtubeVideoId: universityReviews.youtubeVideoId,
          starRating: universityReviews.starRating,
          visibilityStatus: universityReviews.visibilityStatus,
          isFeatured: universityReviews.isFeatured,
          verificationStatus: universityReviews.verificationStatus,
          createdAt: universityReviews.createdAt,
        })
        .from(universityReviews)
        .innerJoin(universities, eq(universityReviews.universityId, universities.id))
        .orderBy(desc(universityReviews.createdAt))
    : [];

  const statusColor: Record<string, string> = {
    live: "bg-emerald-50 text-emerald-700",
    hidden: "bg-yellow-50 text-yellow-700",
    archived: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
          <p className="mt-1 text-sm text-gray-500">
            {rows.length} total review{rows.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">University</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Reviewer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Rating</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Content</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <a
                      href={`/universities/${review.universitySlug}#reviews`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {review.universityName}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{review.reviewerName}</p>
                    {review.reviewerContext ? (
                      <p className="text-xs text-gray-400">{review.reviewerContext}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {review.reviewType === "youtube_video" ? "Video" : "Text"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {review.starRating ? `${review.starRating}/5` : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    {review.reviewType === "youtube_video" ? (
                      <a
                        href={`https://www.youtube.com/watch?v=${review.youtubeVideoId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        youtube/{review.youtubeVideoId}
                      </a>
                    ) : (
                      <p className="line-clamp-2 text-gray-600">{review.reviewBody}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor[review.visibilityStatus] ?? ""}`}
                      >
                        {review.visibilityStatus}
                      </span>
                      {review.isFeatured ? (
                        <span className="inline-block rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {review.createdAt
                      ? new Intl.DateTimeFormat("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(review.createdAt)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {review.visibilityStatus !== "live" ? (
                        <ActionButton reviewId={review.id} action="show" label="Show" variant="default" />
                      ) : null}
                      {review.visibilityStatus === "live" ? (
                        <ActionButton reviewId={review.id} action="hide" label="Hide" variant="muted" />
                      ) : null}
                      {review.visibilityStatus !== "archived" ? (
                        <ActionButton reviewId={review.id} action="archive" label="Archive" variant="destructive" />
                      ) : null}
                      {!review.isFeatured ? (
                        <ActionButton reviewId={review.id} action="feature" label="Feature" variant="default" />
                      ) : (
                        <ActionButton reviewId={review.id} action="unfeature" label="Unfeature" variant="muted" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                    No reviews yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
