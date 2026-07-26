import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Salary After MBBS in Russia 2026: Career Pathways & Realistic Earnings Guide",
  description:
    "Explore career pathways after an MBBS from Russia, including licensing, further training, and the factors that shape earnings for Indian graduates.",
  path: "/salary-after-mbbs-in-russia",
  openGraphType: "article",
  keywords: [
    "mbbs doctor salary in russia",
    "mbbs salary in russia",
    "salary of mbbs doctor in russia",
    "salary after mbbs in russia",
    "after mbbs in russia",
    "job after mbbs in russia",
    "career after mbbs in russia",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
