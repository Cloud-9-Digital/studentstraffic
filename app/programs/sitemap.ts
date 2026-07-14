import type { MetadataRoute } from "next";

import { getLatestDate } from "@/lib/content-dates";
import { catalogReviewedAt } from "@/lib/content-governance";
import { maxSitemapUrls } from "@/lib/constants";
import { absoluteUrl } from "@/lib/metadata";
import {
  getPublishedProgramCount,
  getProgramSitemapSlice,
} from "@/lib/data/catalog";
import { getIndexableProgramSections } from "@/lib/sitemap-indexability";
import { PROGRAM_SECTIONS } from "@/lib/university-sections";

// 1 base URL + 4 section URLs per program (admissions/eligibility/fees/recognition)
const ENTRIES_PER_PROGRAM = 1 + PROGRAM_SECTIONS.length;
const programsPerPage = Math.floor(maxSitemapUrls / ENTRIES_PER_PROGRAM);

export async function generateSitemaps() {
  const programCount = await getPublishedProgramCount();
  const totalPages = Math.max(1, Math.ceil(programCount / programsPerPage));
  return Array.from({ length: totalPages }, (_, index) => ({ id: index }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const start = id * programsPerPage;
  const end = start + programsPerPage;
  const programs = await getProgramSitemapSlice(start, end);

  return programs.flatMap((program) => {
    const lastModified = getLatestDate([catalogReviewedAt, program.updatedAt]);
    const sections = getIndexableProgramSections(program);
    return [
      {
        url: absoluteUrl(program.path),
        priority: 0.8,
        changeFrequency: "weekly" as const,
        lastModified,
      },
      ...sections.map((section) => ({
        url: absoluteUrl(`${program.path}-${section}`),
        priority: 0.6,
        changeFrequency: "weekly" as const,
        lastModified,
      })),
    ];
  });
}
