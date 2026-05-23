import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title:
    "Disadvantages of Studying MBBS in Russia for Indian Students 2026",
  description:
    "Get the honest disadvantages of studying MBBS in Russia for Indian students, including language, climate, total cost, India-return risks, and how to avoid a bad shortlist.",
  path: "/disadvantages-of-studying-mbbs-in-russia",
  openGraphType: "article",
  keywords: [
    "disadvantages of studying mbbs in russia",
    "disadvantages of studying mbbs in russia for indian students",
    "mbbs in russia disadvantages",
    "risks of mbbs in russia",
    "is mbbs in russia worth it",
    "mbbs in russia for indian students",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
