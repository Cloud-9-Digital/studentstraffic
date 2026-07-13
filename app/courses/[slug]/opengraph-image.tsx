import { notFound } from "next/navigation";

import { getCourseBySlug, getCourseProgramDirectorySummary } from "@/lib/data/catalog";
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

  const summary = await getCourseProgramDirectorySummary(course.slug);

  return createSeoImage({
    eyebrow: `${course.shortName} Abroad`,
    title: `${course.shortName} Universities Across ${summary.countries.length || 1} Countries`,
    description: course.summary,
    accentLabel: `${summary.programCount} options`,
    tags: ["Fees", "Eligibility", "Clinical Fit", "Support"],
  });
}
