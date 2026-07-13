import type { Metadata } from "next";

import { CountryMbbsLandingPage } from "@/components/site/mbbs-lp/country-landing-page";
import { listFinderPrograms } from "@/lib/data/catalog";
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
  title: "MBBS in Georgia Admission 2026 | Free Counselling & Application Support",
  description:
    "Book a free counselling call for MBBS admission in Georgia. Students Traffic handles your university shortlist, application, visa, and admission process end-to-end at private, NMC-aligned universities.",
  keywords: [
    "mbbs georgia admission consultants",
    "mbbs georgia counselling free",
    "book mbbs georgia application",
    "mbbs georgia admission agent",
    "mbbs abroad consultants for georgia",
    "students traffic mbbs georgia",
  ],
});

export default async function MbbsInGeorgiaAdmissionPage() {
  const programs = await listFinderPrograms({ country: "georgia", course: "mbbs" });
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
