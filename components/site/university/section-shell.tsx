import type { ReactNode } from "react";

import type { Author } from "@/lib/authors";
import type { Country, FinderProgram, University } from "@/lib/data/types";
import type { UniversitySection } from "@/lib/university-sections";
import {
  formatProgramAnnualFee,
  hasRenderableProgramAnnualFee,
} from "@/lib/utils";

import { UniversityFaqSection } from "./faq-section";
import { UniversityHostelDetailSection } from "./hostel-detail-section";
import { UniversityProgramsSection } from "./programs-section";
import { UniversitySectionShellClient } from "./section-shell-client";
import { UniversityStudentLifeSection } from "./student-life-section";

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
}: {
  children: ReactNode;
  initialSection: UniversitySection | null;
  universitySlug: string;
  university: University;
  programs: FinderProgram[];
  primaryProgram: FinderProgram | undefined;
  country: Country;
  coverImage: { url: string; alt: string } | null;
  logoUrl?: string;
  logoInitials: string;
  lastVerifiedAt: string;
  primaryProgramShortName?: string;
  author?: Author | null;
}) {
  const hasFee = Boolean(
    primaryProgram && hasRenderableProgramAnnualFee(primaryProgram.offering),
  );
  const content = initialSection === "programs"
    ? programs.length > 0
      ? <UniversityProgramsSection programs={programs} />
      : null
    : initialSection === "student-life"
      ? (
          <UniversityStudentLifeSection
            university={university}
            country={country}
            primaryProgram={primaryProgram}
          />
        )
      : initialSection === "hostel"
        ? <UniversityHostelDetailSection university={university} programs={programs} />
        : initialSection === "faq"
          ? (
              <UniversityFaqSection
                faq={university.faq}
                universityName={university.name}
                city={university.city}
                primaryProgramShortName={primaryProgramShortName}
              />
            )
          : children;

  return (
    <UniversitySectionShellClient
      initialSection={initialSection}
      universitySlug={universitySlug}
      universityName={university.name}
      universitySummary={university.summary}
      universityCity={university.city}
      universityType={university.type}
      countryName={country.name}
      countrySlug={country.slug}
      logoUrl={logoUrl}
      coverImage={coverImage}
      logoInitials={logoInitials}
      primaryProgramShortName={primaryProgramShortName}
      courseSlug={primaryProgram?.course.slug}
      feeValue={
        primaryProgram
          ? formatProgramAnnualFee(primaryProgram.offering, "Fee plan on request")
          : "Available on request"
      }
      hasFee={hasFee}
      recognitionBadge={university.recognitionBadges[0]}
      lastVerifiedAt={lastVerifiedAt}
      author={author}
      content={content}
    />
  );
}
