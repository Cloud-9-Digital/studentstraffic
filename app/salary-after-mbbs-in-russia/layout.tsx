import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Salary After MBBS in Russia 2026: Career Pathways & Realistic Earnings Guide",
  description:
    "Comprehensive salary guide for Russia MBBS graduates: Russia practice (40,000-400,000 RUB/month), India return (₹4-50+ LPA), Gulf careers (₹8-21 lakh/month), US/UK pathways, career timelines, and ROI analysis for Indian students.",
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
