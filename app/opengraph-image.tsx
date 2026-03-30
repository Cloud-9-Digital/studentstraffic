import {
  createSeoImage,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Students Traffic — Study MBBS abroad, the right way.";

export default async function Image() {
  return createSeoImage({
    eyebrow: "India's Most Transparent MBBS Abroad Platform",
    title: "Study MBBS abroad —",
    accentTitle: "the right way.",
    tags: ["3,000+ Students", "500+ Universities", "10+ Countries", "100% Free"],
  });
}
