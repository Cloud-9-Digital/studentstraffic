import { Suspense } from "react";
import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { catalogReviewedAt, governancePublishedAt } from "@/lib/content-governance";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";
import { getAllLiveReviews } from "@/lib/university-community";
import { ReviewsIntro, ReviewsStaticList } from "./_components/reviews-static-list";
import { ReviewsMasonry } from "./reviews-masonry";

const PATH = "/reviews";
const DESCRIPTION =
  "Reviews from students studying medicine abroad: academics, hostel life, food and clinical exposure at universities in Vietnam, Russia, Georgia and more.";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Student Reviews | MBBS Abroad Experience | Students Traffic",
  description: DESCRIPTION,
  path: PATH,
});

export default async function ReviewsPage() {
  const reviews = await getAllLiveReviews();
  const structuredData = getStructuredDataGraph([
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Student reviews", path: PATH },
    ]),
    getWebPageStructuredData({
      path: PATH,
      name: "Student reviews",
      description: DESCRIPTION,
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ]);

  return (
    <>
      <ReviewsIntro />
      {/* The masonry reads search params and renders on the client only; the
          fallback is the crawlable, server-rendered list of the same reviews. */}
      <Suspense fallback={<ReviewsStaticList reviews={reviews} />}>
        <ReviewsMasonry reviews={reviews} />
      </Suspense>
      <JsonLd data={structuredData} />
    </>
  );
}
