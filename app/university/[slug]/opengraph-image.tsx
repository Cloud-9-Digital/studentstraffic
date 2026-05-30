import { ImageResponse } from "next/og";
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
import { getUniversityCoverImage } from "@/lib/university-media";
import { parseUniversitySlug } from "@/lib/university-sections";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "University details page";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const { universitySlug: slug } = parseUniversitySlug(rawSlug);
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

  const coverImage = getUniversityCoverImage(university);

  if (coverImage) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            position: "relative",
            background: "#000",
          }}
        >
          {/* Cover photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage.url}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.85,
            }}
          />

          {/* Gradient overlay — dark at bottom for text readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
              display: "flex",
            }}
          />

          {/* Brand — top left */}
          <div
            style={{
              position: "absolute",
              top: 32,
              left: 40,
              fontSize: 20,
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.01em",
              display: "flex",
            }}
          >
            Students Traffic
          </div>

          {/* University info — bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 36,
              left: 40,
              right: 40,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                display: "flex",
              }}
            >
              {university.name}
            </div>
            <div
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.75)",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <span>{university.city}</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{country.name}</span>
            </div>
          </div>
        </div>
      ),
      { ...ogImageSize },
    );
  }

  // Fallback: branded generated card
  const primaryProgram = programs.find((p) => p.offering.featured) ?? programs[0];
  return createSeoImage({
    eyebrow: country.name,
    title: university.name,
    description: primaryProgram
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
