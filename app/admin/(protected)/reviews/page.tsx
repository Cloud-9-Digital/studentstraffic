import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getDb } from "@/lib/db/server";
import { universities, universityReviews } from "@/lib/db/schema";

const fmtDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "short", year: "numeric",
});

const statusTone: Record<string, string> = {
  live: "border-emerald-200 bg-emerald-50 text-emerald-700",
  hidden: "border-amber-200 bg-amber-50 text-amber-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
};

export default async function AdminReviewsPage() {
  const db = getDb();

  const rows = db
    ? await db
        .select({
          id: universityReviews.id,
          universityName: universities.name,
          reviewerName: universityReviews.reviewerName,
          reviewType: universityReviews.reviewType,
          starRating: universityReviews.starRating,
          visibilityStatus: universityReviews.visibilityStatus,
          isFeatured: universityReviews.isFeatured,
          createdAt: universityReviews.createdAt,
        })
        .from(universityReviews)
        .innerJoin(universities, eq(universityReviews.universityId, universities.id))
        .orderBy(desc(universityReviews.createdAt))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Moderation</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">Reviews</h1>
        <p className="mt-1 text-sm text-slate-500">{rows.length} review{rows.length !== 1 ? "s" : ""} total</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">University</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Reviewer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((review) => (
                <tr key={review.id} className="group hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-medium text-[#0b312b]">{review.universityName}</td>
                  <td className="px-6 py-3.5 text-slate-500">{review.reviewerName}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusTone[review.visibilityStatus] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}>
                        {review.visibilityStatus}
                      </Badge>
                      {review.isFeatured && (
                        <Badge variant="outline" className="rounded-full border-violet-200 bg-violet-50 px-2 py-0.5 text-xs text-violet-700">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">{review.starRating ? `★ ${review.starRating}/5` : "—"}</td>
                  <td className="px-6 py-3.5 text-slate-400">{review.createdAt ? fmtDate.format(review.createdAt) : "—"}</td>
                  <td className="px-6 py-3.5 text-right">
                    <Link
                      href={`/admin/reviews/${review.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 opacity-0 transition-opacity group-hover:opacity-100 hover:border-[#0b312b]/20 hover:text-[#0b312b]"
                    >
                      View <ChevronRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-400">No reviews yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="divide-y divide-slate-100 md:hidden">
          {rows.map((review) => (
            <Link key={review.id} href={`/admin/reviews/${review.id}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50">
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#0b312b]">{review.universityName}</p>
                <p className="mt-0.5 text-sm text-slate-500">{review.reviewerName}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1">
                  <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${statusTone[review.visibilityStatus] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}>
                    {review.visibilityStatus}
                  </Badge>
                  {review.isFeatured && (
                    <Badge variant="outline" className="rounded-full border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] text-violet-700">Featured</Badge>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <p className="text-xs text-slate-400">{review.createdAt ? fmtDate.format(review.createdAt) : "—"}</p>
                <ChevronRight className="size-4 text-slate-300" />
              </div>
            </Link>
          ))}
          {rows.length === 0 && (
            <p className="px-5 py-16 text-center text-sm text-slate-400">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
