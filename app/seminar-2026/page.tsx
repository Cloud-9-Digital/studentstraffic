import type { Metadata } from "next";

import { SeminarAtEvent } from "./_components/seminar-at-event";
import { SeminarCitiesTicker } from "./_components/seminar-cities-ticker";
import { SeminarCta } from "./_components/seminar-cta";
import { SeminarDialogProvider } from "./_components/seminar-dialog-context";
import { SeminarDifferentiators } from "./_components/seminar-differentiators";
import { SeminarDoctors } from "./_components/seminar-doctors";
import { SeminarEvents } from "./_components/seminar-events";
import { SeminarFaq } from "./_components/seminar-faq";
import { SeminarFooter } from "./_components/seminar-footer";
import { SeminarHeader } from "./_components/seminar-header";
import { SeminarHero } from "./_components/seminar-hero";
import { SeminarInterest } from "./_components/seminar-interest";
import { SeminarMobileCta } from "./_components/seminar-mobile-cta";
import { SeminarNextEvent } from "./_components/seminar-next-event";
import { SeminarTagline } from "./_components/seminar-tagline";
import { SeminarTopUniversities } from "./_components/seminar-top-universities";
import { SeminarTrust } from "./_components/seminar-trust";

export const metadata: Metadata = {
  title: "Free MBBS Seminar 2026 — Meet Real Doctors, Get Real Answers | Students Traffic",
  description:
    "Free MBBS guidance seminar across Tamil Nadu. Meet FMGE-cleared doctors from Russia, Georgia, Kyrgyzstan & more. Get honest peer guidance — not a sales pitch. Free entry, free mentorship.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Free MBBS Seminar 2026 — 16 Cities across Tamil Nadu",
    description:
      "Meet FMGE-cleared doctors from 5 countries. Get honest peer guidance — not a sales pitch. Free entry, free mentorship.",
    type: "website",
  },
};

export default function SeminarPage() {
  return (
    <SeminarDialogProvider>
      <div className="min-h-screen">
        {/* Hook & Urgency */}
        <SeminarHeader />
        <SeminarHero />
        <SeminarCitiesTicker className="hidden lg:block" />
        <SeminarNextEvent />
        <SeminarEvents />

        {/* Trust & Credibility */}
        <SeminarTrust />
        <SeminarTagline />
        <SeminarAtEvent />
        <SeminarDoctors />

        {/* Value Proposition */}
        <SeminarDifferentiators />
        <SeminarTopUniversities />
        <SeminarInterest />

        {/* Conversion */}
        <SeminarCta />
        <SeminarFaq />
        <SeminarFooter />
        <SeminarMobileCta />
      </div>
    </SeminarDialogProvider>
  );
}
