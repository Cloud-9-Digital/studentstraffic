"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, GraduationCap, Phone, ArrowRight } from "lucide-react";

import type { Author } from "@/lib/authors";
import type { CountryContent } from "@/lib/data/country-content";
import type { CountryRegulatoryAdvisory, UniversityRegulatoryAdvisory } from "@/lib/data/regulatory-advisories";
import type { Country, FinderProgram, University } from "@/lib/data/types";
import { parseProgramSlug, PROGRAM_SECTIONS, type ProgramSection } from "@/lib/university-sections";
import { formatProgramAnnualFee, hasRenderableProgramAnnualFee } from "@/lib/utils";
import { getUniversityHref, getUniversityProgramHref } from "@/lib/routes";

import { UniversityAcademicsSection } from "./academics-section";
import { UniversityAdmissionsSection, UniversityEligibilitySection } from "./admissions-section";
import { UniversityFeesDetailSection } from "./fees-detail-section";
import { UniversityHeroSection } from "./hero-section";
import { UniversityRecognitionDetailSection } from "./recognition-detail-section";
import { ProgramPageNav } from "./program-nav";

const SECTION_TITLES: Record<ProgramSection, string> = {
  admissions: "Admissions Process",
  eligibility: "Eligibility & Requirements",
  fees: "Fee Structure",
  recognition: "Recognition & Accreditation",
};

function getSectionSummary(
  section: ProgramSection | null,
  program: FinderProgram,
  university: University,
): string {
  const course = program.course.shortName;
  switch (section) {
    case "admissions":
      return `How to apply for ${course} at ${university.name} — step-by-step process, documents required, and application timeline.`;
    case "eligibility":
      return `Eligibility criteria and academic qualifications needed to apply for ${course} at ${university.name}.`;
    case "fees":
      return `Year-wise ${course} fee breakdown at ${university.name} — annual tuition, hostel costs, and total program cost in USD.`;
    case "recognition":
      return `Recognition and accreditation status of ${course} at ${university.name} — badges and official verification links.`;
    default:
      return `Academic structure, teaching phases, and curriculum for ${course} at ${university.name}.`;
  }
}

export function ProgramSectionShell({
  initialSection,
  programSlug,
  program,
  university,
  country,
  countryContent,
  countryAdvisory,
  universityAdvisory,
  coverImage,
  logoUrl,
  logoInitials,
  lastVerifiedAt,
  author,
}: {
  initialSection: ProgramSection | null;
  programSlug: string;
  program: FinderProgram;
  university: University;
  country: Country;
  countryContent: CountryContent | null;
  countryAdvisory: CountryRegulatoryAdvisory | null;
  universityAdvisory: UniversityRegulatoryAdvisory | null;
  coverImage: { url: string; alt: string } | null;
  logoUrl?: string;
  logoInitials: string;
  lastVerifiedAt: string;
  author?: Author | null;
}) {
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    const handlePopState = () => {
      const rawSlug = window.location.pathname.replace(/^\//, "");
      const { section } = parseProgramSlug(rawSlug);
      setActiveSection(section);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSectionChange = (section: ProgramSection | null) => {
    setActiveSection(section);
    const nextPath = section ? `/${programSlug}-${section}` : `/${programSlug}`;
    window.history.pushState({}, "", nextPath);
    document.title = section
      ? `${program.course.shortName} at ${university.name}: ${SECTION_TITLES[section]} | Students Traffic`
      : `${program.course.shortName} at ${university.name} | Students Traffic`;
  };

  const summary = getSectionSummary(activeSection, program, university);

  return (
    <>
      <UniversityHeroSection
        universityName={`${program.course.shortName} at ${university.name}`}
        universitySlug={university.slug}
        universitySummary={summary}
        logoUrl={logoUrl}
        coverImage={coverImage}
        logoInitials={logoInitials}
        activeSectionLabel={activeSection ? SECTION_TITLES[activeSection] : null}
        lastVerifiedAt={lastVerifiedAt}
        author={author}
      />

      <ProgramPageNav
        programSlug={programSlug}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <section className="py-10 md:py-14">
        <div className="container-shell">
          <div className="min-w-0 space-y-0">
            <ProgramContextStrip
              university={university}
              country={country}
              program={program}
              activeSection={activeSection}
              programSlug={programSlug}
            />

            {activeSection === null && (
              <UniversityAcademicsSection
                university={university}
                primaryProgram={program}
              />
            )}
            {activeSection === "admissions" && (
              <UniversityAdmissionsSection
                university={university}
                primaryProgram={program}
                countryContent={countryContent}
                countryAdvisory={countryAdvisory}
                universityAdvisory={universityAdvisory}
              />
            )}
            {activeSection === "eligibility" && (
              <UniversityEligibilitySection
                university={university}
                primaryProgram={program}
                countryContent={countryContent}
              />
            )}
            {activeSection === "fees" && (
              <UniversityFeesDetailSection
                programs={[program]}
                universityName={university.name}
                university={university}
                country={country}
              />
            )}
            {activeSection === "recognition" && (
              <UniversityRecognitionDetailSection
                university={university}
                country={country}
                primaryProgram={program}
              />
            )}

            <ProgramCounsellingCta
              universityName={university.name}
              courseSlug={program.course.slug}
              countrySlug={country.slug}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function ProgramContextStrip({
  university,
  country,
  program,
  activeSection,
  programSlug,
}: {
  university: University;
  country: Country;
  program: FinderProgram;
  activeSection: ProgramSection | null;
  programSlug: string;
}) {
  const hasFee = hasRenderableProgramAnnualFee(program.offering);

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 text-sm">
        <Link
          href={getUniversityHref(university.slug)}
          className="font-display font-semibold text-heading hover:text-primary hover:underline"
        >
          {university.name}
        </Link>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          {university.city}, {country.name}
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <GraduationCap className="size-3.5 shrink-0" />
          {program.course.shortName} · {university.type}
        </span>
        {hasFee && (
          <span className="font-medium text-accent">
            {formatProgramAnnualFee(program.offering)}/yr
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border/60 bg-background/50 px-5 py-2.5">
        <Link
          href={getUniversityProgramHref(programSlug)}
          className="text-xs text-muted-foreground hover:text-primary hover:underline"
        >
          Academics
        </Link>
        {PROGRAM_SECTIONS.filter((s) => s !== activeSection).map((s) => (
          <Link
            key={s}
            href={`/${programSlug}-${s}`}
            className="text-xs capitalize text-muted-foreground hover:text-primary hover:underline"
          >
            {s}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProgramCounsellingCta({
  universityName,
  courseSlug,
  countrySlug,
}: {
  universityName: string;
  courseSlug: string;
  countrySlug: string;
}) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 px-6 py-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <p className="font-display text-lg font-semibold text-heading">
            Applying to {universityName}?
          </p>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Students Traffic verifies seat availability, checks current recognition status, and prepares your complete application for{" "}
            {universityName}. The consultation is free.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a
            href="tel:+919176162888"
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
          >
            <Phone className="size-3.5" />
            Call us
          </a>
          <Link
            href={`/universities?country=${countrySlug}&course=${courseSlug}`}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            Compare colleges
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
