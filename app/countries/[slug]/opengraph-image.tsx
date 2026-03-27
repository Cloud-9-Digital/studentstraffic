import { notFound } from "next/navigation";

import { getCountryBySlug, getProgramsForCountry } from "@/lib/data/catalog";
import {
  createSeoImage,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Country study guide";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const programs = await getProgramsForCountry(country.slug);
  const uniqueUniversities = new Set(programs.map((program) => program.university.slug));
  const primaryCourse = programs[0]?.course.shortName ?? "Study Abroad";

  return createSeoImage({
    eyebrow: `Study in ${country.name}`,
    title: `${country.name} Universities & ${primaryCourse} Options`,
    description: country.summary,
    accentLabel: `${uniqueUniversities.size} universities`,
    tags: [country.region, country.climate, country.currencyCode],
  });
}
