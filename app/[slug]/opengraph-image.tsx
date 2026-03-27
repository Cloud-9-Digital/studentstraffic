import { notFound } from "next/navigation";

import {
  getLandingPageBySlug,
  getLandingPageContext,
} from "@/lib/data/catalog";
import {
  createSeoImage,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Curated study destination page";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const context = await getLandingPageContext(page);

  if (!context.country || !context.course) {
    notFound();
  }

  return createSeoImage({
    eyebrow: `${context.course.shortName} in ${context.country.name}`,
    title: page.title,
    description: page.summary,
    accentLabel: context.country.name,
    tags: page.heroHighlights,
  });
}
