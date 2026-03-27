import type { UniversityGalleryImage } from "@/lib/data/types";

type UniversityMediaInput = {
  slug: string;
  name: string;
  coverImageUrl?: string | null;
  galleryImages?: UniversityGalleryImage[] | null;
};

function createPlaceholderGalleryImage(input: {
  slug: string;
  name: string;
  seed: string;
  caption: string;
}): UniversityGalleryImage {
  return {
    url: `https://picsum.photos/seed/${input.slug}-${input.seed}/1600/900`,
    alt: `${input.name} ${input.caption.toLowerCase()}`,
    caption: input.caption,
  };
}

export function getUniversityInitials(name: string): string {
  return name
    .split(" ")
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function getDefaultUniversityGalleryImages(
  input: Pick<UniversityMediaInput, "slug" | "name">
) {
  return [
    createPlaceholderGalleryImage({
      slug: input.slug,
      name: input.name,
      seed: "cover",
      caption: "Campus overview",
    }),
    createPlaceholderGalleryImage({
      slug: input.slug,
      name: input.name,
      seed: "facilities",
      caption: "Campus facilities",
    }),
    createPlaceholderGalleryImage({
      slug: input.slug,
      name: input.name,
      seed: "student-life",
      caption: "Student life",
    }),
  ];
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
    if (!image?.url || seen.has(image.url)) {
      return;
    }

    seen.add(image.url);
    galleryImages.push(image);
  };

  push(coverGalleryImage);

  for (const image of input.galleryImages ?? []) {
    push(image);
  }

  for (const image of getDefaultUniversityGalleryImages(input)) {
    if (galleryImages.length >= 3) {
      break;
    }

    push(image);
  }

  return galleryImages;
}

export function getUniversityCoverImage(input: UniversityMediaInput) {
  return getUniversityGalleryImages(input)[0] ?? null;
}
