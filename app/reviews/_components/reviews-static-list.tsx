import Link from "next/link";

import type { ReviewWithUniversity } from "@/lib/university-community";
import { getUniversityHref } from "@/lib/routes";

/**
 * Server-rendered version of /reviews. The interactive masonry reads the URL
 * search params, so it renders only on the client; this list is its Suspense
 * fallback and puts every live review (names, universities, written reviews
 * and video links) into the server HTML for crawlers and no-JS readers. The H1
 * is in ReviewsIntro, outside the Suspense boundary.
 */
/** Server-rendered page heading, shared by the interactive and static views. */
export function ReviewsIntro() {
  return (
    <div className="relative overflow-hidden bg-surface-dark">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
      <div className="hero-grid-lines absolute inset-0 pointer-events-none" />
      <div className="container-shell relative pb-5 pt-10 text-center md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          From students, not agents
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl">
          Student reviews
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/60 md:text-base md:leading-7">
          Real experiences from students studying medicine abroad —
          academics, hostels, food, clinical training, and life on campus.
        </p>
      </div>
    </div>
  );
}

export function ReviewsStaticList({ reviews }: { reviews: ReviewWithUniversity[] }) {
  return (
    <>
      <section className="min-h-[50vh] bg-slate-50 py-8 md:py-12">
        <div className="container-shell">
          {reviews.length === 0 ? (
            <p className="rounded-2xl border border-border bg-white px-6 py-10 text-center text-sm text-muted-foreground">
              Student reviews will appear here once they are published.
            </p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="font-semibold text-slate-900">{review.reviewerName}</p>
                  {review.reviewerContext ? (
                    <p className="text-xs text-slate-500">{review.reviewerContext}</p>
                  ) : null}
                  <p className="mt-1 text-xs text-slate-500">
                    <Link
                      href={getUniversityHref(review.universitySlug)}
                      className="text-accent hover:underline"
                    >
                      {review.universityName}
                    </Link>
                    {`, ${review.countryName}`}
                  </p>
                  {review.reviewBody ? (
                    <p className="mt-3 text-sm leading-6 text-slate-700">{review.reviewBody}</p>
                  ) : null}
                  {review.reviewType === "youtube_video" && review.youtubeVideoId ? (
                    <a
                      href={`https://www.youtube.com/watch?v=${review.youtubeVideoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-sm font-medium text-accent hover:underline"
                    >
                      Watch {review.reviewerName}&apos;s video review on YouTube
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
