import type { MetadataRoute } from "next";

import { catalogReviewedAt } from "@/lib/content-governance";
import { maxSitemapUrls } from "@/lib/constants";
import { absoluteUrl } from "@/lib/metadata";
import { getCountryComparisonGuides } from "@/lib/discovery-pages";

// Country-vs-country comparison pages are fully rendered, content-rich
// pages (thousands of words each) that were never listed in any sitemap —
// only the bare /compare hub URL was. The /compare hub itself has no
// crawlable pagination either, so these pages had effectively zero
// discovery path for search engines. This sitemap is the fix.
export async function generateSitemaps() {
  const guides = await getCountryComparisonGuides();
  const totalPages = Math.max(1, Math.ceil(guides.length / maxSitemapUrls));
  return Array.from({ length: totalPages }, (_, index) => ({ id: index }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const start = id * maxSitemapUrls;
  const end = start + maxSitemapUrls;
  const guides = await getCountryComparisonGuides();

  return guides.slice(start, end).map((guide) => ({
    url: absoluteUrl(`/compare/${guide.slug}`),
    priority: 0.6,
    changeFrequency: "weekly" as const,
    lastModified: catalogReviewedAt,
  }));
}
