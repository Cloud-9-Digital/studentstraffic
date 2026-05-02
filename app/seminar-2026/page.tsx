import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { buildIndexableMetadata, absoluteUrl } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";
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
import { EVENTS, FAQ } from "./_data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS Abroad Seminar in Tamil Nadu | FMGE Doctors Seminar",
  description:
    "Join the MBBS abroad seminar in Tamil Nadu by FMGE doctors. Get guidance on countries, colleges, fees, NMC recognition, and reserve your free seat.",
  path: "/seminar-2026",
  keywords: [
    "MBBS abroad seminar Tamil Nadu",
    "FMGE doctors seminar Tamil Nadu",
    "MBBS abroad event Chennai",
    "study MBBS abroad seminar",
    "free MBBS seminar Tamil Nadu",
  ],
});

function getEventIso(date: string, time = "10:00 AM") {
  return new Date(`${date} ${time} GMT+0530`).toISOString();
}

export default function SeminarPage() {
  const path = "/seminar-2026";
  const primaryEvent = EVENTS[0];
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "MBBS Abroad Seminar", path },
    ]),
    getWebPageStructuredData({
      path,
      name: "Tamil Nadu's Biggest MBBS Abroad Seminar by FMGE Doctors",
      description:
        "Seminar landing page for Students Traffic's MBBS abroad events across Tamil Nadu, featuring FMGE-cleared doctors and city-wise registration.",
    }),
    {
      "@type": "EducationEvent",
      "@id": `${absoluteUrl(path)}#event`,
      name: "Tamil Nadu's Biggest MBBS Abroad Seminar by FMGE Doctors",
      description:
        "A free MBBS abroad seminar across Tamil Nadu where students and parents can meet FMGE-cleared doctors and get direct answers on colleges, fees, recognition, and long-term outcomes.",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      startDate: getEventIso(primaryEvent.date, primaryEvent.time ?? "10:00 AM"),
      endDate: getEventIso(primaryEvent.date, "1:00 PM"),
      location: {
        "@type": "Place",
        name: primaryEvent.venue,
        address: {
          "@type": "PostalAddress",
          addressLocality: primaryEvent.city,
          addressRegion: "Tamil Nadu",
          addressCountry: "IN",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "Students Traffic",
        url: absoluteUrl("/"),
      },
      image: absoluteUrl("/images/seminar-2026/students-traffic-panel.png"),
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: absoluteUrl(path),
      },
      audience: {
        "@type": "Audience",
        audienceType: "Students and parents exploring MBBS abroad",
      },
      subEvent: EVENTS.slice(1).map((event) => ({
        "@type": "EducationEvent",
        name: `MBBS Abroad Seminar — ${event.city}`,
        startDate: getEventIso(event.date, event.time ?? "10:00 AM"),
        location: {
          "@type": "Place",
          name: event.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: event.city,
            addressRegion: "Tamil Nadu",
            addressCountry: "IN",
          },
        },
      })),
    },
    getFaqStructuredData(
      FAQ.map((item) => ({ question: item.q, answer: item.a })),
      path,
    ),
  ];

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
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </SeminarDialogProvider>
  );
}
