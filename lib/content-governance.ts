import type { LinkItem } from "@/lib/data/types";
import { siteConfig } from "@/lib/constants";

export const catalogReviewedAt = "2026-03-27";
export const governancePublishedAt = "2026-03-27";
export const editorialDeskName = `${siteConfig.name} Editorial Desk`;

export const editorialPrinciples = [
  "Prefer original university details, fee context, and admission guidance over generic summaries.",
  "Use official university pages, recognition directories, and referenced public records wherever possible.",
  "Revise or remove content when the underlying fee, intake, recognition, or support information changes.",
  "Separate editorial guidance from promotional claims so students can compare options clearly.",
];

export const methodologySteps = [
  "Collect program, fee, intake, location, and support data from official university materials and primary public references.",
  "Normalize data into a consistent catalog so students can compare universities on the same criteria.",
  "Highlight important student decision factors such as tuition, city, medium, hostel, recognition, and fit.",
  "Review destination and shortlist pages through the Students Traffic editorial desk before publishing.",
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
