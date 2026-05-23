import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "How to Apply for MBBS in Russia 2026: Step-by-Step Application Guide for Indian Students",
  description:
    "Complete Russia MBBS application guide: timeline (January-August), required documents (NEET 50th/40th percentile, apostille, HIV certificate), visa process (20-45 days invitation, 2-3 weeks visa), costs (₹2-3 lakhs), NMC compliance verification, and common mistakes to avoid for Indian students.",
  path: "/how-to-apply-for-mbbs-in-russia",
  openGraphType: "article",
  keywords: [
    "how to apply for mbbs in russia",
    "how to do mbbs in russia",
    "how to get admission in russia for mbbs",
    "mbbs admission process in russia",
    "russia mbbs application process",
    "apply for mbbs in russia",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
