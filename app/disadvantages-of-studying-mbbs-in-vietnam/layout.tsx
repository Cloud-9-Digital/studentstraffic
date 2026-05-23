import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title:
    "Disadvantages of Studying MBBS in Vietnam for Indian Students 2026",
  description:
    "Get the honest disadvantages of studying MBBS in Vietnam for Indian students, including university quality variation, clinical-language reality, shorter track record, and India-return decision risks.",
  path: "/disadvantages-of-studying-mbbs-in-vietnam",
  openGraphType: "article",
  keywords: [
    "disadvantages of studying mbbs in vietnam",
    "disadvantages of studying mbbs in vietnam for indian students",
    "mbbs in vietnam disadvantages",
    "is mbbs in vietnam good for indian students",
    "mbbs in vietnam for indian students",
    "medical colleges in vietnam",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
