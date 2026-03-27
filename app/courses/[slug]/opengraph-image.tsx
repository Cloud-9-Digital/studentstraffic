import { notFound } from "next/navigation";

import { getCourseBySlug, getProgramsForCourse } from "@/lib/data/catalog";
import {
  createSeoImage,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Course comparison page";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const programs = await getProgramsForCourse(course.slug);
  const uniqueCountries = new Set(programs.map((program) => program.country.slug));

  return createSeoImage({
    eyebrow: `${course.shortName} Abroad`,
    title: `${course.shortName} Universities Across ${uniqueCountries.size || 1} Countries`,
    description: course.summary,
    accentLabel: `${programs.length} options`,
    tags: ["Fees", "Eligibility", "Clinical Fit", "Support"],
  });
}
