import type { Metadata } from "next";

import { CountryMbbsLandingPage } from "@/components/site/mbbs-lp/country-landing-page";
import { getProgramsForCountry } from "@/lib/data/catalog";
import {
  RUSSIA_LP_CONFIG,
  RUSSIA_LP_FEATURED_SLUGS,
  getCountryLpStats,
  getFeaturedPrograms,
} from "@/lib/data/mbbs-country-lp";
import { buildIndexableMetadata } from "@/lib/metadata";

const path = "/mbbs-in-russia-admission";

export const metadata: Metadata = buildIndexableMetadata({
  path,
  title: "MBBS in Russia for Indian Students 2026 | Fees, Top Universities, Admission",
  description:
    "Get MBBS admission in Russia with free counselling from Students Traffic. NMC-aligned universities, English medium, fees from ₹19L. Check eligibility and top colleges.",
  keywords: [
    "mbbs in russia",
    "mbbs in russia for indian students",
    "mbbs admission in russia",
    "mbbs in russia fees",
    "top mbbs colleges in russia",
    "study mbbs in russia 2026",
  ],
});

export default async function MbbsInRussiaAdmissionPage() {
  const programs = await getProgramsForCountry("russia");
  const stats = getCountryLpStats(programs, RUSSIA_LP_FEATURED_SLUGS);
  const featuredPrograms = getFeaturedPrograms(programs, RUSSIA_LP_FEATURED_SLUGS);

  return (
    <CountryMbbsLandingPage
      path={path}
      config={RUSSIA_LP_CONFIG}
      stats={stats}
      featuredPrograms={featuredPrograms}
    />
  );
}
