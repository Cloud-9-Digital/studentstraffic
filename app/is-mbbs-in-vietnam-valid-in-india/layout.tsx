import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Is MBBS in Vietnam Valid in India? 2026 NMC Recognition Guide",
  description:
    "Get a practical answer to whether MBBS in Vietnam is valid in India, including NMC recognition requirements, FMGE clearance (15-25% pass rate), WDOMS vs validity, and complete India practice pathway verification.",
  path: "/is-mbbs-in-vietnam-valid-in-india",
  openGraphType: "article",
  keywords: [
    "is mbbs in vietnam valid in india",
    "mbbs in vietnam valid in india",
    "is mbbs in vietnam valid",
    "nmc approved universities in vietnam",
    "mbbs in vietnam for indian students",
    "vietnam mbbs validity in india",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
