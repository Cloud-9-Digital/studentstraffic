import type { LinkItem } from "@/lib/data/types";

export const catalogReviewedAt = "2026-03-27";
export const governancePublishedAt = "2026-03-27";
export const contentAuthorName = "Bharath";

export const editorialPrinciples = [
  "Prefer university-specific academic context, fee clarity, and admissions guidance over generic brochure summaries.",
  "Review every shortlist page against current university and public admissions materials before publishing updates.",
  "Revise or remove content when the underlying fee, intake, recognition, or student-planning context changes.",
  "Separate editorial guidance from promotional claims so students can compare options clearly.",
];

export const methodologySteps = [
  "Collect program, fee, intake, location, and student-planning data from current university and public admissions materials.",
  "Normalize data into a consistent catalog so students can compare universities on the same criteria.",
  "Highlight important student decision factors such as tuition, city, medium, recognition, clinical environment, and fit.",
  "Review destination and shortlist pages through Bharath before publishing.",
];

export const trustPageLinks = [
  { label: "About", href: "/about" },
  { label: "Editorial policy", href: "/editorial-policy" },
  { label: "Methodology", href: "/methodology" },
  { label: "Contact", href: "/contact" },
] as const;

export function formatContentDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function countUniqueSources(
  ...sourceLists: Array<readonly LinkItem[] | LinkItem[] | undefined>
) {
  return new Set(
    sourceLists
      .flatMap((list) => list ?? [])
      .map((item) => item.url)
      .filter(Boolean)
  ).size;
}
