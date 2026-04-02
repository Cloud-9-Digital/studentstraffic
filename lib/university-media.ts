type UniversityMediaInput = {
  slug: string;
  name: string;
  coverImageUrl?: string | null;
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

export function getUniversityCoverImage(input: UniversityMediaInput) {
  if (!input.coverImageUrl || !isRealUniversityImageUrl(input.coverImageUrl)) {
    return null;
  }

  return {
    url: input.coverImageUrl,
    alt: `${input.name} campus overview`,
    caption: "Campus overview",
  };
}

// ISO 3166-1 alpha-2 codes for flagcdn.com
const COUNTRY_FLAG_CODES: Record<string, string> = {
  russia:     "ru",
  vietnam:    "vn",
  georgia:    "ge",
  kyrgyzstan: "kg",
  uzbekistan: "uz",
  bangladesh: "bd",
  ukraine:    "ua",
  china:      "cn",
};

export function getCountryFlagCode(countrySlug: string): string {
  return COUNTRY_FLAG_CODES[countrySlug] ?? countrySlug;
}

// Country-branded placeholder gradients — used when no cover image is available.
// Colors are loosely derived from each country's national palette.
const COUNTRY_GRADIENTS: Record<string, { from: string; to: string; text: string }> = {
  russia:     { from: "#6b1a1a", to: "#1a2e4a", text: "#fca5a5" },
  vietnam:    { from: "#8b1a1a", to: "#7c3a0a", text: "#fde68a" },
  georgia:    { from: "#7c1530", to: "#8b3a12", text: "#fecdd3" },
  kyrgyzstan: { from: "#a31c1c", to: "#2d3748", text: "#fca5a5" },
  uzbekistan: { from: "#0d6b61", to: "#1a2e5a", text: "#6ee7b7" },
  bangladesh: { from: "#145228", to: "#8b1a1a", text: "#bbf7d0" },
};
const DEFAULT_GRADIENT = { from: "#1e3a5f", to: "#312e81", text: "#c7d2fe" };

export function getCountryPlaceholder(countrySlug: string) {
  return COUNTRY_GRADIENTS[countrySlug] ?? DEFAULT_GRADIENT;
}
