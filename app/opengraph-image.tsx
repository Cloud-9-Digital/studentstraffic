import {
  createSeoImage,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Students Traffic — Find the right university, anywhere in the world.";

export default async function Image() {
  return createSeoImage({
    eyebrow: "Global study-abroad guidance",
    title: "Find the right university",
    accentTitle: "anywhere in the world.",
    tags: ["Universities", "Programmes", "Destinations", "Admission support"],
  });
}
