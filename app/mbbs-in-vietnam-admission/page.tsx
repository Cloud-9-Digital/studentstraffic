import type { Metadata } from "next";

import { CountryMbbsLandingPage } from "@/components/site/mbbs-lp/country-landing-page";
import { getProgramsForCountry } from "@/lib/data/catalog";
import {
  VIETNAM_LP_CONFIG,
  VIETNAM_LP_FEATURED_SLUGS,
  getCountryLpStats,
  getFeaturedPrograms,
} from "@/lib/data/mbbs-country-lp";
import { buildIndexableMetadata } from "@/lib/metadata";

const path = "/mbbs-in-vietnam-admission";

export const metadata: Metadata = buildIndexableMetadata({
  path,
  title: "MBBS in Vietnam for Indian Students 2026 | Fees, Top Universities, Admission",
  description:
    "Get MBBS admission in Vietnam with free counselling from Students Traffic. English-medium, NMC-aligned universities, fees from ₹21L. Check eligibility and top colleges.",
  keywords: [
    "mbbs in vietnam",
    "mbbs in vietnam for indian students",
    "mbbs admission in vietnam",
    "mbbs in vietnam fees",
    "english medium mbbs in vietnam",
    "study mbbs in vietnam 2026",
  ],
});

export default async function MbbsInVietnamAdmissionPage() {
  const programs = await getProgramsForCountry("vietnam");
  const stats = getCountryLpStats(programs, VIETNAM_LP_FEATURED_SLUGS);
  const featuredPrograms = getFeaturedPrograms(programs, VIETNAM_LP_FEATURED_SLUGS);

  return (
    <CountryMbbsLandingPage
      path={path}
      config={VIETNAM_LP_CONFIG}
      stats={stats}
      featuredPrograms={featuredPrograms}
    />
  );
}
