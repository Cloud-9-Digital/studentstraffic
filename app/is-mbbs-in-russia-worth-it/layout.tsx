import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Is MBBS in Russia Worth It for Indian Students in 2026?",
  description:
    "Get a practical answer to whether MBBS in Russia is worth it for Indian students, including cost, climate, university fit, and the India-return decision.",
  path: "/is-mbbs-in-russia-worth-it",
  openGraphType: "article",
  keywords: [
    "is mbbs in russia worth it",
    "is mbbs in russia worth it for indian students",
    "is mbbs in russia good for indian students",
    "mbbs in russia worth it",
    "mbbs in russia for indian students",
    "mbbs in russia fees",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
