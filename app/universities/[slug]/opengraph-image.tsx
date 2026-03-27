import { notFound } from "next/navigation";

import {
  getCountryBySlug,
  getProgramsForUniversity,
  getUniversityBySlug,
} from "@/lib/data/catalog";
import {
  createSeoImage,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "University details page";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const university = await getUniversityBySlug(slug);

  if (!university) {
    notFound();
  }

  const [country, programs] = await Promise.all([
    getCountryBySlug(university.countrySlug),
    getProgramsForUniversity(university.slug),
  ]);

  if (!country) {
    notFound();
  }

  const primaryProgram =
    programs.find((program) => program.offering.featured) ?? programs[0];

  return createSeoImage({
    eyebrow: country.name,
    title: university.name,
    description:
      primaryProgram
        ? `Compare ${primaryProgram.course.shortName} fees, intake, and student support in ${university.city}, ${country.name}.`
        : university.summary,
    accentLabel: university.city,
    tags: [
      university.type,
      university.recognitionBadges[0] ?? "Medical University",
      primaryProgram?.course.shortName ?? "University",
    ],
  });
}
