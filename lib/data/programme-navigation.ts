import type { CourseStream } from "@/lib/data/types";

export type ProgrammeNavigationCourse = {
  slug: string;
  name: string;
  shortName: string;
  stream: CourseStream;
};

export const programmeStreamLabels: Record<CourseStream, string> = {
  medicine: "Medicine",
  nursing: "Nursing",
  dental: "Dentistry",
  pharmacy: "Pharmacy",
  physiotherapy: "Physiotherapy",
  engineering: "Engineering",
  business: "Business & Management",
  law: "Law",
  hospitality: "Hospitality",
  agriculture: "Agriculture",
  education: "Education",
  architecture: "Architecture",
  "arts-humanities": "Arts & Humanities",
  "social-sciences": "Social Sciences",
  "natural-sciences": "Natural Sciences",
  "mathematics-statistics": "Mathematics & Statistics",
  "economics-commerce": "Economics & Commerce",
  "design-creative-arts": "Design & Creative Arts",
  psychology: "Psychology",
  "public-health-allied-health": "Public Health & Allied Health",
  "media-communication": "Media & Communication",
  "environment-sustainability": "Environment & Sustainability",
  "aviation-maritime-logistics": "Aviation, Maritime & Logistics",
  "public-policy-international-relations": "Public Policy & International Relations",
  "computing-information-systems": "Computing & Information Systems",
  veterinary: "Veterinary Science",
  vocational: "Vocational & Applied Programs",
  other: "Other Programs",
};

const streamPriority = Object.keys(programmeStreamLabels) as CourseStream[];

export function groupProgrammeNavigationCourses<T extends ProgrammeNavigationCourse>(courses: T[]) {
  const grouped = new Map<CourseStream, T[]>();

  for (const course of courses) {
    const existing = grouped.get(course.stream);
    if (existing) existing.push(course);
    else grouped.set(course.stream, [course]);
  }

  return streamPriority
    .filter((stream) => grouped.has(stream))
    .map((stream) => ({
      stream,
      label: programmeStreamLabels[stream],
      courses: grouped.get(stream)!.toSorted((left, right) => left.name.localeCompare(right.name)),
    }));
}
