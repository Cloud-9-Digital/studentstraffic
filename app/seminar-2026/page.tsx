import type { Metadata } from "next";

import { SeminarCitiesTicker } from "./_components/seminar-cities-ticker";
import { SeminarCta } from "./_components/seminar-cta";
import { SeminarDialogProvider } from "./_components/seminar-dialog-context";
import { SeminarDifferentiators } from "./_components/seminar-differentiators";
import { SeminarEvents } from "./_components/seminar-events";
import { SeminarFaq } from "./_components/seminar-faq";
import { SeminarFooter } from "./_components/seminar-footer";
import { SeminarHeader } from "./_components/seminar-header";
import { SeminarHero } from "./_components/seminar-hero";
import { SeminarInclusions } from "./_components/seminar-inclusions";
import { SeminarInterest } from "./_components/seminar-interest";
import { SeminarMobileCta } from "./_components/seminar-mobile-cta";
import { SeminarNextEvent } from "./_components/seminar-next-event";
import { SeminarSpeakers } from "./_components/seminar-speakers";
import { SeminarTagline } from "./_components/seminar-tagline";
import { SeminarTrust } from "./_components/seminar-trust";

export const metadata: Metadata = {
  title: "Free MBBS Seminar 2026 — Meet Real Doctors, Get Real Answers | Students Traffic",
  description:
    "Free MBBS guidance seminar across Tamil Nadu. Meet FMGE-cleared doctors from Russia, Georgia, Kyrgyzstan & more. Get honest peer guidance — not a sales pitch. Free entry, free mentorship.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Free MBBS Seminar 2026 — 14 Cities across Tamil Nadu",
    description:
      "Meet FMGE-cleared doctors from 5 countries. Get honest peer guidance — not a sales pitch. Free entry, free mentorship.",
    type: "website",
  },
};

export default function SeminarPage() {
  return (
    <SeminarDialogProvider>
      <div className="min-h-screen">
        <SeminarHeader />
        <SeminarHero />
        <SeminarCitiesTicker />
        <SeminarNextEvent />
        <SeminarTrust />
        <SeminarTagline />
        <SeminarDifferentiators />
        <SeminarSpeakers />
        <SeminarInterest />
        <SeminarInclusions />
        <SeminarEvents />
        <SeminarCta />
        <SeminarFaq />
        <SeminarFooter />
        <SeminarMobileCta />
      </div>
    </SeminarDialogProvider>
  );
}
