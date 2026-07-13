import type { MetadataRoute } from "next";

import { getLatestDate } from "@/lib/content-dates";
import { catalogReviewedAt } from "@/lib/content-governance";
import { maxSitemapUrls } from "@/lib/constants";
import { absoluteUrl } from "@/lib/metadata";
import {
  getPublishedUniversityCount,
  getUniversitySitemapSlice,
} from "@/lib/data/catalog";
import { UNIVERSITY_SECTIONS } from "@/lib/university-sections";

// 1 base URL + UNIVERSITY_SECTIONS.length section URLs per university (programs, student-life,
// hostel, faq — the program-specific sections moved to /programs/sitemap.ts as of 2026-07-08)
const ENTRIES_PER_UNIVERSITY = 1 + UNIVERSITY_SECTIONS.length;
const universitiesPerPage = Math.floor(maxSitemapUrls / ENTRIES_PER_UNIVERSITY);

export async function generateSitemaps() {
  const universityCount = await getPublishedUniversityCount();
  const totalPages = Math.max(1, Math.ceil(universityCount / universitiesPerPage));
  return Array.from({ length: totalPages }, (_, index) => ({ id: index }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const start = id * universitiesPerPage;
  const end = start + universitiesPerPage;
  const universities = await getUniversitySitemapSlice(start, end);

  return universities.flatMap((university) => {
    const lastModified = getLatestDate([catalogReviewedAt, university.updatedAt]);
    return [
      {
        url: absoluteUrl(university.path),
        priority: 0.85,
        changeFrequency: "weekly" as const,
        lastModified,
      },
      ...UNIVERSITY_SECTIONS.map((section) => ({
        url: absoluteUrl(`/university/${university.slug}-${section}`),
        priority: 0.65,
        changeFrequency: "weekly" as const,
        lastModified,
      })),
    ];
  });
}
