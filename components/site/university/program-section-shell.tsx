import type { Author } from "@/lib/authors";
import type { CountryContent } from "@/lib/data/country-content";
import type {
  CountryRegulatoryAdvisory,
  UniversityRegulatoryAdvisory,
} from "@/lib/data/regulatory-advisories";
import type { Country, FinderProgram, University } from "@/lib/data/types";
import type { ProgramSection } from "@/lib/university-sections";
import { formatProgramAnnualFee, hasRenderableProgramAnnualFee } from "@/lib/utils";

import { UniversityAcademicsSection } from "./academics-section";
import {
  UniversityAdmissionsSection,
  UniversityEligibilitySection,
} from "./admissions-section";
import { UniversityFeesDetailSection } from "./fees-detail-section";
import { ProgramSectionShellClient } from "./program-section-shell-client";
import { UniversityRecognitionDetailSection } from "./recognition-detail-section";

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
  return (
    <ProgramSectionShellClient
      initialSection={initialSection}
      programSlug={programSlug}
      courseShortName={program.course.shortName}
      courseSlug={program.course.slug}
      universityName={university.name}
      universitySlug={university.slug}
      universityCity={university.city}
      universityType={university.type}
      countryName={country.name}
      countrySlug={country.slug}
      hasFee={hasRenderableProgramAnnualFee(program.offering)}
      feeValue={formatProgramAnnualFee(program.offering)}
      coverImage={coverImage}
      logoUrl={logoUrl}
      logoInitials={logoInitials}
      lastVerifiedAt={lastVerifiedAt}
      author={author}
      academicsContent={
        <UniversityAcademicsSection university={university} primaryProgram={program} />
      }
      admissionsContent={
        <UniversityAdmissionsSection
          university={university}
          primaryProgram={program}
          countryContent={countryContent}
          countryAdvisory={countryAdvisory}
          universityAdvisory={universityAdvisory}
        />
      }
      eligibilityContent={
        <UniversityEligibilitySection
          university={university}
          primaryProgram={program}
          countryContent={countryContent}
        />
      }
      feesContent={
        <UniversityFeesDetailSection
          programs={[program]}
          universityName={university.name}
          university={university}
          country={country}
        />
      }
      recognitionContent={
        <UniversityRecognitionDetailSection
          university={university}
          country={country}
          primaryProgram={program}
        />
      }
    />
  );
}
