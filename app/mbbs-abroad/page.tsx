import type { Metadata } from "next";

import { LpCta } from "./_components/lp-cta";
import { LpCountries } from "./_components/lp-countries";
import { LpDialogProvider } from "./_components/lp-dialog";
import { LpEligibility } from "./_components/lp-eligibility";
import { LpFaq } from "./_components/lp-faq";
import { LpFooter } from "./_components/lp-footer";
import { LpHeader } from "./_components/lp-header";
import { LpHero } from "./_components/lp-hero";
import { LpMobileCta } from "./_components/lp-mobile-cta";
import { LpProcess } from "./_components/lp-process";
import { LpTrust } from "./_components/lp-trust";
import { LpWhyAbroad } from "./_components/lp-why-abroad";

export const metadata: Metadata = {
  title: "MBBS Abroad Admission 2026 for Indian Students | Fees, Eligibility, NMC",
  description:
    "Get MBBS abroad admission for Indian students in Russia, Georgia, Kyrgyzstan, Vietnam and more. Check fees, eligibility, and NMC recognition with free counselling.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "MBBS Abroad Admission 2026 for Indian Students",
    description:
      "Compare MBBS abroad fees, NMC recognition, and eligibility across top countries for Indian students.",
    type: "website",
  },
  keywords: [
    "MBBS abroad for Indian students",
    "MBBS abroad fees",
    "MBBS abroad 2026",
    "study MBBS abroad India",
    "NMC recognized MBBS abroad",
    "MBBS Russia India students",
    "MBBS Georgia fees",
    "MBBS Philippines",
    "MBBS Kyrgyzstan",
    "cheapest MBBS abroad",
    "MBBS abroad eligibility",
    "FMGE NExT MBBS abroad",
  ],
};

export default function MbbsAbroadPage() {
  return (
    <LpDialogProvider>
      <LpHeader />
      <LpHero />
      <LpCountries />
      <LpWhyAbroad />
      <LpEligibility />
      <LpProcess />
      <LpTrust />
      <LpFaq />
      <LpCta />
      <LpFooter />
      <LpMobileCta />
    </LpDialogProvider>
  );
}
