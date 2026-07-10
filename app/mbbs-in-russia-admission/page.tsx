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
  title: "MBBS in Russia Admission 2026 | Free Counselling & Application Support",
  description:
    "Book a free counselling call for MBBS admission in Russia. Students Traffic handles your university shortlist, application, visa, and admission process end-to-end at NMC-aligned universities.",
  keywords: [
    "mbbs russia admission consultants",
    "mbbs russia counselling free",
    "book mbbs russia application",
    "mbbs russia admission agent",
    "mbbs abroad consultants for russia",
    "students traffic mbbs russia",
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
