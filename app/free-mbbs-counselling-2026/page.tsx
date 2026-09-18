import type { Metadata } from "next";

import { buildNoIndexMetadata } from "@/lib/metadata";

import { LpCovered } from "./_components/lp-covered";
import { LpCta } from "./_components/lp-cta";
import { LpDialogProvider } from "./_components/lp-dialog";
import { LpFaq } from "./_components/lp-faq";
import { LpFooter } from "./_components/lp-footer";
import { LpHeader } from "./_components/lp-header";
import { LpHero } from "./_components/lp-hero";
import { LpMobileCta } from "./_components/lp-mobile-cta";
import { LpPathways } from "./_components/lp-pathways";
import { LpProcess } from "./_components/lp-process";
import { LpTrust } from "./_components/lp-trust";

/**
 * Paid-traffic landing page (Meta ads) for the "Free Counselling for MBBS 2026"
 * campaign, scoped to India / NEET counselling.
 *
 * Deliberately noindex: the organic equivalent of this intent is
 * `/neet-college-predictor` plus the NEET/admission guides, and an indexed
 * near-duplicate would cannibalise them.
 *
 * Leads carry `sourcePath = "/free-mbbs-counselling-2026"`, which is listed in
 * `CRM_ONLY_SOURCE_PATHS` in `lib/lead-delivery-routes.ts` and so takes the
 * `crmOnly` flow: the Students Traffic CRM and nothing else. No WATI WhatsApp
 * confirmation — the counsellor call is the whole promise on this page.
 */
export const metadata: Metadata = buildNoIndexMetadata(
  {
    title: {
      absolute: "Free MBBS Counselling for NEET 2026 | Students Traffic",
    },
    description:
      "Free NEET 2026 counselling for MBBS and BDS admission. Share your score, category and state, and a Students Traffic counsellor calls you back with realistic government, private, deemed and abroad options.",
  },
  { canonicalPath: "/free-mbbs-counselling-2026" },
);

export default function FreeMbbsCounselling2026Page() {
  return (
    <LpDialogProvider>
      <LpHeader />
      <LpHero />
      <LpTrust />
      <LpCovered />
      <LpPathways />
      <LpProcess />
      <LpFaq />
      <LpCta />
      <LpFooter />
      <LpMobileCta />
    </LpDialogProvider>
  );
}
