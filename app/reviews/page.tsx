import { Suspense } from "react";
import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";
import { getAllLiveReviews } from "@/lib/university-community";
import { ReviewsMasonry } from "./reviews-masonry";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Student Reviews | MBBS Abroad Experience | Students Traffic",
  description:
    "Read and watch honest reviews from Indian students studying MBBS abroad — academics, hostel life, food, clinical exposure, and daily experience at universities across Vietnam, Russia, Georgia and more.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const reviews = await getAllLiveReviews();
  return (
    <Suspense>
      <ReviewsMasonry reviews={reviews} />
    </Suspense>
  );
}
