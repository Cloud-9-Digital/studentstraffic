import type { MetadataRoute } from "next";

import { maxSitemapUrls } from "@/lib/constants";
import { absoluteUrl } from "@/lib/metadata";
import { getUniversities, getUniversitySitemapSlice } from "@/lib/data/catalog";

export async function generateSitemaps() {
  const universities = await getUniversities();
  const totalPages = Math.max(1, Math.ceil(universities.length / maxSitemapUrls));

  return Array.from({ length: totalPages }, (_, index) => ({ id: index }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const start = id * maxSitemapUrls;
  const end = start + maxSitemapUrls;
  const universities = await getUniversitySitemapSlice(start, end);

  return universities.map((university) => ({
    url: absoluteUrl(university.path),
    priority: 0.85,
    changeFrequency: "weekly",
  }));
}
