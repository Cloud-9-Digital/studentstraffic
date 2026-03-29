import Link from "next/link";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { moderateReviewAction } from "@/app/_actions/moderate-university-review";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/lib/db/server";
import { universities, universityReviews } from "@/lib/db/schema";

const fmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "long", year: "numeric",
  hour: "numeric", minute: "2-digit", timeZoneName: "short",
});

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-800 break-words">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b312b]/60">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function ActionButton({ reviewId, action, label, variant }: {
  reviewId: number; action: string; label: string;
  variant: "default" | "destructive" | "muted";
}) {
  const cls =
    variant === "destructive" ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100" :
    variant === "muted" ? "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100" :
    "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100";

  return (
    <form action={async () => {
      "use server";
      await moderateReviewAction(reviewId, action as Parameters<typeof moderateReviewAction>[1]);
    }}>
      <button type="submit" className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${cls}`}>
        {label}
      </button>
    </form>
  );
}

const statusTone: Record<string, string> = {
  live: "border-emerald-200 bg-emerald-50 text-emerald-700",
  hidden: "border-amber-200 bg-amber-50 text-amber-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
};

async function ReviewDetail({ id }: { id: string }) {
  await connection();

  const db = getDb();
  if (!db) notFound();

  const [row] = await db
    .select({
      review: universityReviews,
      universityName: universities.name,
      universitySlug: universities.slug,
    })
    .from(universityReviews)
    .innerJoin(universities, eq(universityReviews.universityId, universities.id))
    .where(eq(universityReviews.id, Number(id)))
    .limit(1);

  if (!row) notFound();
  const { review, universityName, universitySlug } = row;

  return (
    <div className="space-y-4">
      {/* Back + header */}
      <div>
        <Link href="/admin/reviews" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0b312b]">
          <ArrowLeft className="size-4" /> Reviews
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold text-[#0b312b] md:text-3xl">{review.reviewerName}</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review for{" "}
          <a href={`/universities/${universitySlug}#reviews`} target="_blank" rel="noreferrer" className="text-[#0b312b] hover:underline">
            {universityName}
          </a>
          {" "}· Review #{review.id}
        </p>
      </div>

      {/* Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`rounded-full px-2.5 py-1 text-sm capitalize ${statusTone[review.visibilityStatus] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}>
              {review.visibilityStatus}
            </Badge>
            {review.isFeatured && (
              <Badge variant="outline" className="rounded-full border-violet-200 bg-violet-50 px-2.5 py-1 text-sm text-violet-700">Featured</Badge>
            )}
            <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 px-2.5 py-1 text-sm capitalize text-slate-600">
              {review.verificationStatus}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {review.visibilityStatus !== "live" && (
              <ActionButton reviewId={review.id} action="show" label="Make live" variant="default" />
            )}
            {review.visibilityStatus === "live" && (
              <ActionButton reviewId={review.id} action="hide" label="Hide" variant="muted" />
            )}
            {review.visibilityStatus !== "archived" && (
              <ActionButton reviewId={review.id} action="archive" label="Archive" variant="destructive" />
            )}
            {!review.isFeatured ? (
              <ActionButton reviewId={review.id} action="feature" label="Feature" variant="default" />
            ) : (
              <ActionButton reviewId={review.id} action="unfeature" label="Unfeature" variant="muted" />
            )}
          </div>
        </div>
      </div>

      <Section title="Reviewer">
        <Field label="Name" value={review.reviewerName} />
        <Field label="Email" value={review.reviewerEmail} />
        <Field label="Context" value={review.reviewerContext} />
      </Section>

      <Section title="Review">
        <Field label="Type" value={review.reviewType === "youtube_video" ? "YouTube video" : "Text"} />
        <Field label="Star rating" value={review.starRating ? `${review.starRating} / 5` : undefined} />
        <Field label="Submitted" value={review.createdAt ? fmt.format(review.createdAt) : undefined} />
        <Field label="Updated" value={review.updatedAt ? fmt.format(review.updatedAt) : undefined} />
      </Section>

      {review.reviewBody && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b312b]/60">Review body</h2>
          <p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap">{review.reviewBody}</p>
        </div>
      )}

      {review.reviewType === "youtube_video" && review.youtubeVideoId && (
        <Section title="Video">
          <Field label="YouTube video ID" value={review.youtubeVideoId} />
          <Field label="YouTube URL" value={
            <a href={review.youtubeUrl ?? `https://youtube.com/watch?v=${review.youtubeVideoId}`} target="_blank" rel="noreferrer" className="text-[#c2410c] hover:underline break-all">
              {review.youtubeUrl ?? `https://youtube.com/watch?v=${review.youtubeVideoId}`}
            </a>
          } />
        </Section>
      )}

      <Section title="Technical">
        <Field label="Source path" value={review.sourcePath} />
        <Field label="IP address" value={review.ipAddress} />
        <Field label="User agent" value={review.userAgent} />
      </Section>
    </div>
  );
}

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-400">Loading…</div>}>
      <ReviewDetailInner params={params} />
    </Suspense>
  );
}

async function ReviewDetailInner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewDetail id={id} />;
}
