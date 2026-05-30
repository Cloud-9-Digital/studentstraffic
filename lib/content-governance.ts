export const catalogReviewedAt = "2026-03-27";
export const governancePublishedAt = "2026-03-27";
export const contentAuthorName = "Bharat Vasireddy";
export const contentAuthorSlug = "bharat-vasireddy";
export const contentAuthorRole = "Co-Founder, StudentsTraffic";
export const contentAuthorBio =
  "Bharat Vasireddy is the co-founder of StudentsTraffic, helping Indian students navigate MBBS admissions abroad with honest, verified, commission-free guidance.";
export const contentAuthorAreas = [
  "MBBS abroad destinations and university selection",
  "Admissions, fees, and compliance guidance",
  "Application planning and student onboarding support",
] as const;

export const editorialPrinciples = [
  "Prefer university-specific academic context, fee clarity, and admissions guidance over generic brochure summaries.",
  "Review every admissions page against current university and public admissions materials before publishing updates.",
  "Revise or remove content when the underlying fee, intake, recognition, or student-planning context changes.",
  "Keep every page useful for students who want to choose the right university and move into admission with clarity.",
];

export const methodologySteps = [
  "Collect program, fee, intake, location, and admission data from current university and public admissions materials.",
  "Normalize data into a consistent catalog so students and parents can evaluate universities on the same criteria.",
  "Highlight important admission factors such as tuition, city, medium, recognition, clinical environment, and fit.",
  "Review destination and admissions pages through our admissions research team before publishing.",
];

export function formatContentDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}
