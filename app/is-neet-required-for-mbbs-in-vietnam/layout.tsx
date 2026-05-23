import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Is NEET Required for MBBS in Vietnam? 2026 NMC Rules for Indian Students",
  description:
    "Get the exact answer on whether NEET is required for MBBS in Vietnam, including NMC rules, qualifying score requirements (50th/40th percentile), the 'without NEET' myth, and India-return implications.",
  path: "/is-neet-required-for-mbbs-in-vietnam",
  openGraphType: "article",
  keywords: [
    "is neet required for mbbs in vietnam",
    "neet required for mbbs in vietnam",
    "mbbs in vietnam without neet",
    "how much neet score is required for mbbs in vietnam",
    "mbbs in vietnam for indian students",
    "nmc rules mbbs abroad neet",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
