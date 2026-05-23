import type { Metadata } from "next";

import { buildIndexableMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Education Loan for MBBS in Russia 2026: Banks, Rates, Schemes & Complete Guide",
  description:
    "Complete Russia MBBS education loan guide: loan types (secured 8.25-11.5%, unsecured 11-17%), amounts (₹7.5 lakhs-₹1.5 crores), government schemes (PM-Vidyalaxmi 3% subsidy, CSIS), major lenders (SBI, HDFC, Credila), collateral requirements, documentation, approval timeline (2-8 weeks), EMI calculations, Section 80E tax benefits, and without collateral options for Indian students.",
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
