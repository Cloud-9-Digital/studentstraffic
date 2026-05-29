// Longer suffixes must come first so parseUniversitySlug doesn't short-circuit on a prefix match.
export const UNIVERSITY_SECTIONS = [
  "student-life",
  "recognition",
  "eligibility",
  "admissions",
  "academics",
  "programs",
  "country",
  "hostel",
  "fees",
  "city",
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
