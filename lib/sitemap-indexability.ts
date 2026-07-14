import type {
  ProgramSection,
  UniversitySection,
} from "@/lib/university-sections";

export type ProgramSitemapSignals = {
  hasAdmissionsContent: boolean;
  hasSpecificIntakeSources: boolean;
  hasAudienceRestrictions: boolean;
  hasRecognitionEvidence: boolean;
  hasVerifiedDetailedFees: boolean;
};

export type UniversitySitemapSignals = {
  hasPublishedPrograms: boolean;
  hasSubstantialStudentLife: boolean;
  hasSubstantialHostel: boolean;
  hasSubstantialFaq: boolean;
};

/**
 * A section URL stays publicly accessible regardless of this result. This
 * policy only decides whether the sitemap actively promotes it as an
 * independent search result.
 */
export function getIndexableProgramSections(
  signals: ProgramSitemapSignals,
): ProgramSection[] {
  const sections: ProgramSection[] = [];

  if (signals.hasAdmissionsContent || signals.hasSpecificIntakeSources) {
    sections.push("admissions");
  }
  if (signals.hasAdmissionsContent || signals.hasAudienceRestrictions) {
    sections.push("eligibility");
  }
  if (signals.hasRecognitionEvidence) {
    sections.push("recognition");
  }
  if (signals.hasVerifiedDetailedFees) {
    sections.push("fees");
  }

  return sections;
}

export function getIndexableUniversitySections(
  signals: UniversitySitemapSignals,
): UniversitySection[] {
  const sections: UniversitySection[] = [];

  if (signals.hasPublishedPrograms) sections.push("programs");
  if (signals.hasSubstantialStudentLife) sections.push("student-life");
  if (signals.hasSubstantialHostel) sections.push("hostel");
  if (signals.hasSubstantialFaq) sections.push("faq");

  return sections;
}
