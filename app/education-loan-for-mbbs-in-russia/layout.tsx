import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Education Loan for MBBS in Russia 2026: Banks, Rates, Schemes & Complete Guide",
  description:
    "Learn how Indian students can compare loan options, collateral, documents, approval steps, and repayment planning for an MBBS degree in Russia.",
  path: "/education-loan-for-mbbs-in-russia",
  openGraphType: "article",
  keywords: [
    "education loan for mbbs in russia",
    "education loan for mbbs in russia without collateral",
    "mbbs in russia loan",
    "russia mbbs education loan",
    "loan for mbbs in russia",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
