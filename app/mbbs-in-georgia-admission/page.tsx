import type { Metadata } from "next";

import { CountryMbbsLandingPage } from "@/components/site/mbbs-lp/country-landing-page";
import { getProgramsForCountry } from "@/lib/data/catalog";
import {
  GEORGIA_LP_CONFIG,
  GEORGIA_LP_FEATURED_SLUGS,
  getCountryLpStats,
  getFeaturedPrograms,
} from "@/lib/data/mbbs-country-lp";
import { buildIndexableMetadata } from "@/lib/metadata";

const path = "/mbbs-in-georgia-admission";

export const metadata: Metadata = buildIndexableMetadata({
  path,
  title: "MBBS in Georgia for Indian Students 2026 | Fees, Top Universities, Admission",
  description:
    "Get MBBS admission in Georgia with free counselling from Students Traffic. European-standard, English-medium, NMC-aligned universities, fees from ₹28L. Check eligibility and top colleges.",
  keywords: [
    "mbbs in georgia",
    "mbbs in georgia for indian students",
    "mbbs admission in georgia",
    "mbbs in georgia fees",
    "top mbbs colleges in georgia",
    "study mbbs in georgia 2026",
  ],
});

export default async function MbbsInGeorgiaAdmissionPage() {
  const programs = await getProgramsForCountry("georgia");
  const stats = getCountryLpStats(programs, GEORGIA_LP_FEATURED_SLUGS);
  const featuredPrograms = getFeaturedPrograms(programs, GEORGIA_LP_FEATURED_SLUGS);

  return (
    <CountryMbbsLandingPage
      path={path}
      config={GEORGIA_LP_CONFIG}
      stats={stats}
      featuredPrograms={featuredPrograms}
    />
  );
}
