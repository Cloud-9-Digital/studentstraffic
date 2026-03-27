import type { UniversityGalleryImage } from "@/lib/data/types";

type UniversityMediaInput = {
  slug: string;
  name: string;
  coverImageUrl?: string | null;
  galleryImages?: UniversityGalleryImage[] | null;
};

const stockImageHostnames = new Set(["picsum.photos"]);

function getImageHostname(url: string) {
  try {
    return new URL(url, "https://studentstraffic.local").hostname;
  } catch {
    return null;
  }
}

export function isStockUniversityImageUrl(url?: string | null) {
  if (!url) {
    return false;
  }

  const hostname = getImageHostname(url);
  return hostname ? stockImageHostnames.has(hostname) : false;
}

export function isRealUniversityImageUrl(url?: string | null) {
  return Boolean(url) && !isStockUniversityImageUrl(url);
}

export function getIndexableUniversityImageUrls(
  urls: Array<string | null | undefined>
) {
  const seen = new Set<string>();

  return urls.filter((url): url is string => {
    if (!url || !isRealUniversityImageUrl(url) || seen.has(url)) {
      return false;
    }

    seen.add(url);
    return true;
  });
}

export function getUniversityInitials(name: string): string {
  return name
    .split(" ")
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function getUniversityGalleryImages(input: UniversityMediaInput) {
  const galleryImages: UniversityGalleryImage[] = [];
  const seen = new Set<string>();
  const coverGalleryImage = input.coverImageUrl
    ? (input.galleryImages ?? []).find((image) => image.url === input.coverImageUrl) ?? {
        url: input.coverImageUrl,
        alt: `${input.name} campus overview`,
        caption: "Campus overview",
      }
    : null;

  const push = (image?: UniversityGalleryImage | null) => {
    if (!image?.url || !isRealUniversityImageUrl(image.url) || seen.has(image.url)) {
      return;
    }

    seen.add(image.url);
    galleryImages.push(image);
  };

  push(coverGalleryImage);

  for (const image of input.galleryImages ?? []) {
    push(image);
  }

  return galleryImages;
}

export function getUniversityCoverImage(input: UniversityMediaInput) {
  return getUniversityGalleryImages(input)[0] ?? null;
}
