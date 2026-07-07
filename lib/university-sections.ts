// Longer suffixes must come first so parseUniversitySlug doesn't short-circuit on a prefix match.
//
// Academics, Admissions, Eligibility, Fees, and Recognition used to live here too, but as of the
// program-page restructure they're program-specific (not university-general) and now live on each
// program's own page — see PROGRAM_SECTIONS below. Country/City were dropped entirely since they
// duplicated the existing /countries/[slug] and /cities/[slug] pages.
export const UNIVERSITY_SECTIONS = [
  "student-life",
  "programs",
  "hostel",
  "faq",
] as const;

export type UniversitySection = (typeof UNIVERSITY_SECTIONS)[number];

export function parseUniversitySlug(slug: string): {
  universitySlug: string;
  section: UniversitySection | null;
} {
  for (const section of UNIVERSITY_SECTIONS) {
    if (slug.endsWith(`-${section}`)) {
      return {
        universitySlug: slug.slice(0, -(section.length + 1)),
        section,
      };
    }
  }
  return { universitySlug: slug, section: null };
}

export function buildSectionSlug(universitySlug: string, section: UniversitySection): string {
  return `${universitySlug}-${section}`;
}

// Program-specific sections — one full page per program (e.g. /mbbs-in-dai-nam-university), with
// these 4 as suffixed sub-pages. "Academics" is the default/no-suffix view, matching how "overview"
// has no suffix on the university page.
export const PROGRAM_SECTIONS = [
  "eligibility",
  "recognition",
  "admissions",
  "fees",
] as const;

export type ProgramSection = (typeof PROGRAM_SECTIONS)[number];

export function parseProgramSlug(slug: string): {
  programSlug: string;
  section: ProgramSection | null;
} {
  for (const section of PROGRAM_SECTIONS) {
    if (slug.endsWith(`-${section}`)) {
      return {
        programSlug: slug.slice(0, -(section.length + 1)),
        section,
      };
    }
  }
  return { programSlug: slug, section: null };
}

export function buildProgramSectionSlug(programSlug: string, section: ProgramSection): string {
  return `${programSlug}-${section}`;
}
