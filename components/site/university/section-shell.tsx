"use client";

import { type ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, GraduationCap, ShieldCheck, Phone, ArrowRight } from "lucide-react";

import type { Author } from "@/lib/authors";
import type { Country, FinderProgram, University } from "@/lib/data/types";
import { parseUniversitySlug, UNIVERSITY_SECTIONS, type UniversitySection } from "@/lib/university-sections";
import { recordRecentlyViewed } from "@/lib/recently-viewed";
import { formatProgramAnnualFee, hasRenderableProgramAnnualFee } from "@/lib/utils";
import { getUniversityHref } from "@/lib/routes";

const SECTION_TITLES: Record<UniversitySection, string> = {
  programs: "Programs & Courses",
  "student-life": "Student Life",
  hostel: "Hostel & Accommodation",
  faq: "FAQ",
};

import { UniversityFaqSection } from "./faq-section";
import { UniversityHeroSection } from "./hero-section";
import { UniversityHostelDetailSection } from "./hostel-detail-section";
import { UniversityProgramsSection } from "./programs-section";
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
      return `All programs at ${university.name} — course duration, medium of instruction, annual intake, and official program details.`;
    case "student-life":
      return `Campus life, Indian student community, food options, and day-to-day living at ${university.name} in ${university.city}.`;
    case "hostel":
      return `Hostel facilities, Indian food availability, campus safety, and accommodation options at ${university.name}.`;
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
    document.title = `${university.name}: ${SECTION_TITLES[section]} | Students Traffic`;
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
        activeSectionLabel={activeSection ? SECTION_TITLES[activeSection] : null}
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
            <div className="min-w-0 space-y-0">
              {/* University context strip — shown on every section page */}
              <UniversityContextStrip
                university={university}
                country={country}
                primaryProgram={primaryProgram}
                activeSection={activeSection}
                universitySlug={universitySlug}
              />

              {activeSection === "programs" && programs.length > 0 && (
                <UniversityProgramsSection programs={programs} />
              )}
              {activeSection === "student-life" && (
                <UniversityStudentLifeSection
                  university={university}
                  country={country}
                  primaryProgram={primaryProgram}
                />
              )}
              {activeSection === "hostel" && (
                <UniversityHostelDetailSection
                  university={university}
                  programs={programs}
                />
              )}
              {activeSection === "faq" && (
                <UniversityFaqSection
                  faq={university.faq}
                  universityName={university.name}
                  city={university.city}
                  primaryProgramShortName={primaryProgramShortName}
                />
              )}

              {/* Counselling CTA — shown at bottom of every section page */}
              <SectionCounsellingCta
                universityName={university.name}
                courseSlug={primaryProgram?.course.slug}
                countrySlug={country.slug}
              />
            </div>
          ) : (
            children
          )}
        </div>
      </section>
    </>
  );
}

function UniversityContextStrip({
  university,
  country,
  primaryProgram,
  activeSection,
  universitySlug,
}: {
  university: University;
  country: Country;
  primaryProgram: FinderProgram | undefined;
  activeSection: UniversitySection;
  universitySlug: string;
}) {
  const hasFee = primaryProgram && hasRenderableProgramAnnualFee(primaryProgram.offering);
  const course = primaryProgram?.course.shortName;
  const topBadge = university.recognitionBadges[0];

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 text-sm">
        <span className="font-display font-semibold text-heading">
          {university.name}
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          {university.city}, {country.name}
        </span>
        {course && (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <GraduationCap className="size-3.5 shrink-0" />
            {course} · {university.type}
          </span>
        )}
        {hasFee && (
          <span className="font-medium text-accent">
            {formatProgramAnnualFee(primaryProgram.offering)}/yr
          </span>
        )}
        {topBadge && (
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            <ShieldCheck className="size-3.5 shrink-0" />
            {topBadge}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border/60 bg-background/50 px-5 py-2.5">
        <Link
          href={getUniversityHref(universitySlug)}
          className="text-xs text-muted-foreground hover:text-primary hover:underline"
        >
          Overview
        </Link>
        {UNIVERSITY_SECTIONS.filter((s) => s !== activeSection).map((s) => (
          <Link
            key={s}
            href={`/university/${universitySlug}-${s}`}
            className="text-xs capitalize text-muted-foreground hover:text-primary hover:underline"
          >
            {s.replace("-", " ")}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SectionCounsellingCta({
  universityName,
  courseSlug,
  countrySlug,
}: {
  universityName: string;
  courseSlug?: string;
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
            href={`/universities?country=${countrySlug}${courseSlug ? `&course=${courseSlug}` : ""}`}
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
