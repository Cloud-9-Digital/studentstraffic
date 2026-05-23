import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Is MBBS in Vietnam Good for Indian Students in 2026? Cost-Benefit Analysis",
  description:
    "Get a practical answer to whether MBBS in Vietnam is good for Indian students, including total cost comparison (₹28-40 lakhs vs Russia/India), climate advantages, travel proximity, and university quality variation.",
  path: "/is-mbbs-in-vietnam-good-for-indian-students",
  openGraphType: "article",
  keywords: [
    "is mbbs in vietnam good for indian students",
    "is mbbs in vietnam worth it",
    "mbbs in vietnam good option for indian students",
    "mbbs in vietnam for indian students",
    "medical colleges in vietnam",
    "mbbs in vietnam fees",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
