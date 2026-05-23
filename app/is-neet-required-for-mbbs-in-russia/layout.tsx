import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Is NEET Required for MBBS in Russia? 2026 NMC Rules for Indian Students",
  description:
    "Get the exact answer on whether NEET is required for MBBS in Russia, including NMC rules, qualifying score requirements, the 'without NEET' myth, and India-return implications.",
  path: "/is-neet-required-for-mbbs-in-russia",
  openGraphType: "article",
  keywords: [
    "is neet required for mbbs in russia",
    "neet required for mbbs in russia",
    "mbbs in russia without neet",
    "how much neet score is required for mbbs in russia",
    "mbbs in russia for indian students",
    "nmc rules mbbs abroad neet",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
