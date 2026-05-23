import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS in Russia Fees 2026: Complete Cost Breakdown & University-Wise Fees for Indian Students",
  description:
    "Comprehensive MBBS in Russia fees guide: university-wise fees (₹2.6-15L/year tuition), total 6-year costs (₹28-103L complete), India comparison (50-70% cheaper than private colleges ₹60L-₹2.2Cr), hidden costs (₹8-15L), city-wise variations (Moscow ₹36-59L vs Crimea ₹13-21L living), cost-saving strategies (save ₹25-50L), education loan options, and budget/medium/premium scenarios for Indian students.",
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
