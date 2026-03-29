import { siteConfig } from "@/lib/constants";
import {
  createSeoImage,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Students Traffic";

export default function Image() {
  return createSeoImage({
    eyebrow: "Study Abroad Experts",
    title: siteConfig.name,
    description: siteConfig.description,
    tags: ["Verified data", "University guidance", "Free guidance"],
  });
}
