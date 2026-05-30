"use client";

import { type ReactNode, useEffect, useState } from "react";

import type { Author } from "@/lib/authors";
import type { CountryContent } from "@/lib/data/country-content";
import type { SharedCityProfile } from "@/lib/data/city-content";
import type { CountryRegulatoryAdvisory, UniversityRegulatoryAdvisory } from "@/lib/data/regulatory-advisories";
import type { Country, FinderProgram, University, WdomsDirectoryEntry } from "@/lib/data/types";
import type { LocationMedia } from "@/lib/location-media";
import { parseUniversitySlug, type UniversitySection } from "@/lib/university-sections";
import { recordRecentlyViewed } from "@/lib/recently-viewed";

const SECTION_TITLES: Record<UniversitySection, string> = {
  programs: "Programs & Courses",
  academics: "Academics & Curriculum",
  admissions: "Admissions Process",
  eligibility: "Eligibility & Requirements",
  "student-life": "Student Life",
  fees: "Fee Structure",
  recognition: "Recognition & Accreditation",
  hostel: "Hostel & Accommodation",
  country: "About the Country",
  city: "About the City",
  faq: "FAQ",
};

import { UniversityAcademicsSection } from "./academics-section";
import { UniversityAdmissionsSection } from "./admissions-section";
import { UniversityCitySection, UniversityCountrySection } from "./content-sections";
import { UniversityFaqSection } from "./faq-section";
import { UniversityFeesDetailSection } from "./fees-detail-section";
import { UniversityHeroSection } from "./hero-section";
import { UniversityHostelDetailSection } from "./hostel-detail-section";
import { UniversityProgramsSection } from "./programs-section";
import { UniversityRecognitionDetailSection } from "./recognition-detail-section";
import { UniversityStudentLifeSection } from "./student-life-section";
import { UniversityPageNav } from "./sticky-nav";

type HeroProps = {
  coverImage: { url: string; alt: string } | null;
  logoUrl?: string;
  logoInitials: string;
};

type Props = HeroProps & {
  children: ReactNode;
  initialSection: UniversitySection | null;
  universitySlug: string;
  university: University;
  programs: FinderProgram[];
  primaryProgram: FinderProgram | undefined;
  country: Country;
  wdomsEntry: WdomsDirectoryEntry | null;
  countryContent: CountryContent | null;
  countryAdvisory: CountryRegulatoryAdvisory | null;
  universityAdvisory: UniversityRegulatoryAdvisory | null;
  cityMedia: LocationMedia | null;
  countryMedia: LocationMedia | null;
  cityProfile: SharedCityProfile | null;
  lastVerifiedAt: string;
  primaryProgramShortName?: string;
  author?: Author | null;
};

function getSectionSummary(
  section: UniversitySection | null,
  university: University,
  country: Country,
  primaryProgramShortName: string | undefined,
): string {
  const course = primaryProgramShortName ?? "MBBS";
  switch (section) {
    case "programs":
      return `All ${course} programs at ${university.name} — course duration, medium of instruction, annual intake, and official program details.`;
    case "academics":
      return `Academic structure, teaching phases, clinical training, and curriculum at ${university.name} — everything Indian students need before enrolling.`;
    case "admissions":
      return `How to apply for ${course} at ${university.name} — step-by-step process, documents required, and application timeline.`;
    case "eligibility":
      return `NEET score requirements, age limit, and academic qualifications needed to apply for ${course} at ${university.name}.`;
    case "student-life":
      return `Campus life, Indian student community, food options, and day-to-day living at ${university.name} in ${university.city}.`;
    case "fees":
      return `Year-wise ${course} fee breakdown at ${university.name} — annual tuition, hostel costs, and total program cost in USD.`;
    case "recognition":
      return `NMC, WHO, and international recognition status of ${university.name} — accreditation badges and official verification links.`;
    case "hostel":
      return `Hostel facilities, Indian food availability, campus safety, and accommodation options at ${university.name}.`;
    case "country":
      return `Why Indian students choose ${country.name} for ${course} — climate, culture, safety, currency, and career opportunities.`;
    case "city":
      return `Living in ${university.city} as a medical student — cost of living, transport, safety, food, and student community.`;
    case "faq":
      return `Answers to the most common questions Indian students ask about ${course} at ${university.name}.`;
    default:
      return university.summary;
  }
}

export function UniversitySectionShell({
  children,
  initialSection,
  universitySlug,
  university,
  programs,
  primaryProgram,
  country,
  wdomsEntry,
  countryContent,
  countryAdvisory,
  universityAdvisory,
  cityMedia,
  countryMedia,
  cityProfile,
  coverImage,
  logoUrl,
  logoInitials,
  primaryProgramShortName,
  lastVerifiedAt,
  author,
}: Props) {
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    recordRecentlyViewed({
      slug: universitySlug,
      name: university.name,
      logoUrl: logoUrl ?? undefined,
      city: university.city,
      countryName: country.name,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universitySlug]);

  useEffect(() => {
    const handlePopState = () => {
      const rawSlug = window.location.pathname.replace("/university/", "");
      const { section } = parseUniversitySlug(rawSlug);
      if (!section) {
        window.location.reload();
        return;
      }
      setActiveSection(section);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSectionChange = (section: UniversitySection | null) => {
    if (section === null) {
      window.location.href = `/university/${universitySlug}`;
      return;
    }
    setActiveSection(section);
    window.history.pushState({}, "", `/university/${universitySlug}-${section}`);
    document.title = `${university.name}: ${SECTION_TITLES[section]} | StudentsTraffic`;
  };

  const summary = getSectionSummary(activeSection, university, country, primaryProgramShortName);

  return (
    <>
      <UniversityHeroSection
        universityName={university.name}
        universitySlug={universitySlug}
        universitySummary={summary}
        logoUrl={logoUrl}
        coverImage={coverImage}
        logoInitials={logoInitials}
        activeSection={activeSection}
        lastVerifiedAt={lastVerifiedAt}
        author={author}
      />

      <UniversityPageNav
        universitySlug={universitySlug}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <section className="py-10 md:py-14">
        <div className="container-shell">
          {activeSection ? (
            <div className="min-w-0">
              {activeSection === "programs" && programs.length > 0 && (
                <UniversityProgramsSection programs={programs} />
              )}
              {activeSection === "academics" && primaryProgram && (
                <UniversityAcademicsSection
                  university={university}
                  primaryProgram={primaryProgram}
                />
              )}
              {(activeSection === "admissions" || activeSection === "eligibility") && (
                <UniversityAdmissionsSection
                  university={university}
                  primaryProgram={primaryProgram}
                  countryContent={countryContent}
                  countryAdvisory={countryAdvisory}
                  universityAdvisory={universityAdvisory}
                  wdomsEntry={wdomsEntry}
                />
              )}
              {activeSection === "student-life" && (
                <UniversityStudentLifeSection university={university} />
              )}
              {activeSection === "fees" && (
                <UniversityFeesDetailSection
                  programs={programs}
                  universityName={university.name}
                />
              )}
              {activeSection === "recognition" && (
                <UniversityRecognitionDetailSection
                  university={university}
                  wdomsEntry={wdomsEntry}
                />
              )}
              {activeSection === "hostel" && (
                <UniversityHostelDetailSection
                  university={university}
                  programs={programs}
                />
              )}
              {activeSection === "country" && (
                <UniversityCountrySection
                  country={country}
                  countryContent={countryContent}
                  countryMedia={countryMedia}
                />
              )}
              {activeSection === "city" && cityProfile && (
                <UniversityCitySection
                  cityProfile={cityProfile}
                  city={university.city}
                  countryName={country.name}
                  universityName={university.name}
                  cityMedia={cityMedia}
                />
              )}
              {activeSection === "faq" && (
                <UniversityFaqSection faq={university.faq} />
              )}
            </div>
          ) : (
            children
          )}
        </div>
      </section>
    </>
  );
}
