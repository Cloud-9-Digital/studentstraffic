import type { Metadata } from "next";

import { CountryMbbsLandingPage } from "@/components/site/mbbs-lp/country-landing-page";
import { listFinderPrograms } from "@/lib/data/catalog";
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
  title: "MBBS in Vietnam Admission 2026 | Free Counselling & Application Support",
  description:
    "Book a free counselling call for MBBS admission in Vietnam. Students Traffic handles your university shortlist, application, visa, and admission process end-to-end at English-medium, NMC-aligned universities.",
  keywords: [
    "mbbs vietnam admission consultants",
    "mbbs vietnam counselling free",
    "book mbbs vietnam application",
    "mbbs vietnam admission agent",
    "mbbs abroad consultants for vietnam",
    "students traffic mbbs vietnam",
  ],
});

export default async function MbbsInVietnamAdmissionPage() {
  const programs = await listFinderPrograms({ country: "vietnam", course: "mbbs" });
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
