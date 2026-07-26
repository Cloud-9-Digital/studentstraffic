import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS in Russia Fees 2026: Complete Cost Breakdown & University-Wise Fees for Indian Students",
  description:
    "Understand tuition, living costs, and fee differences across Russian medical universities, with a practical MBBS budget plan for Indian students.",
  path: "/mbbs-in-russia-fees",
  openGraphType: "article",
  keywords: [
    "mbbs in russia fees",
    "mbbs in russia for indian students fees",
    "mbbs fees in russia for indian students",
    "mbbs in russia fees in rupees",
    "mbbs in russia fee structure",
    "cost of mbbs in russia",
    "russia mbbs fees",
    "mbbs russia total cost",
    "cheapest mbbs in russia",
    "lowest mbbs fees in russia",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
