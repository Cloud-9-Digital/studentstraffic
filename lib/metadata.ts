import type { Metadata } from "next";

import { env } from "@/lib/env";
import { siteConfig } from "@/lib/constants";
import {
  DESCRIPTION_MAX_CHARS,
  TITLE_MAX_CHARS,
  truncateToWordBoundary,
} from "@/lib/university-metadata";

const defaultRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export type IndexableMetadataInput = {
  title: string;
  description: string;
  path: string;
  canonicalPath?: string;
  /** Markdown view for AI agents, advertised as <link rel="alternate">. */
  markdownPath?: string;
  keywords?: string[];
  category?: string;
  openGraphType?: "website" | "article";
};

export function absoluteUrl(path = "/") {
  return new URL(path, env.siteUrl).toString();
}

export function getOgImagePath(path = "/") {
  void path;
  // Generated ImageResponse routes were uncached on Vercel and invoked a
  // function for every social-bot request. Serve one durable study-abroad
  // image from the static CDN instead; page-specific titles and descriptions
  // remain in the Open Graph metadata.
  return "/images/home/apply-confidence.jpg";
}

export function getOgImageUrl(path = "/") {
  return absoluteUrl(getOgImagePath(path));
}

const BRAND_SUFFIX = ` | ${siteConfig.name}`;

/**
 * Keeps hand-written landing, hub and guide titles inside the same budget as
 * the catalogue builders (lib/university-metadata.ts): at most 60 characters
 * before the " | Students Traffic" template. Trailing " | " segments are
 * dropped first (they are keyword lists), then the remainder is cut at a word
 * boundary. A title that already names the brand keeps it as its suffix.
 */
export function fitPageTitle(rawTitle: string, max = TITLE_MAX_CHARS) {
  let title = rawTitle.trim().replace(/\s+/g, " ");
  const brandIndex = title.toLocaleLowerCase().lastIndexOf(BRAND_SUFFIX.toLocaleLowerCase());
  if (brandIndex > 0 && brandIndex + BRAND_SUFFIX.length === title.length) {
    title = title.slice(0, brandIndex);
  }

  const segments = title.split(" | ");
  while (segments.length > 1 && segments.join(" | ").length > max) {
    segments.pop();
  }
  return truncateToWordBoundary(segments.join(" | "), max);
}

function namesBrand(title: string) {
  return title.toLocaleLowerCase().includes(siteConfig.name.toLocaleLowerCase());
}

/**
 * Keeps meta descriptions inside the 155-character snippet budget by dropping
 * whole trailing sentences; only a single over-long sentence is cut.
 */
export function fitPageDescription(rawDescription: string) {
  const description = rawDescription.trim().replace(/\s+/g, " ");
  if (description.length <= DESCRIPTION_MAX_CHARS) return description;

  const sentences = description.split(/(?<=[.!?])\s+/);
  let out = "";
  for (const sentence of sentences) {
    const candidate = out ? `${out} ${sentence}` : sentence;
    if (candidate.length > DESCRIPTION_MAX_CHARS) break;
    out = candidate;
  }
  return out || truncateToWordBoundary(description, DESCRIPTION_MAX_CHARS);
}

export function buildIndexableMetadata(
  input: IndexableMetadataInput
): Metadata {
  const imageUrl = getOgImageUrl(input.path);
  // The root layout appends " | Students Traffic" to every page title. A title
  // that names the brand elsewhere ("About Students Traffic | …") is rendered
  // as-is instead, so it gets the whole rendered budget.
  const fitted = fitPageTitle(input.title);
  const keepsBrand = namesBrand(fitted);
  const title = keepsBrand
    ? fitPageTitle(input.title, TITLE_MAX_CHARS + BRAND_SUFFIX.length)
    : fitted;
  const description = fitPageDescription(input.description);

  return {
    title: keepsBrand ? { absolute: title } : title,
    description,
    keywords: input.keywords,
    category: input.category ?? "education",
    alternates: {
      canonical: absoluteUrl(input.canonicalPath ?? input.path),
      ...(input.markdownPath
        ? { types: { "text/markdown": absoluteUrl(input.markdownPath) } }
        : {}),
    },
    robots: defaultRobots,
    openGraph: {
      type: input.openGraphType ?? "website",
      locale: "en_IN",
      siteName: siteConfig.name,
      url: absoluteUrl(input.path),
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  category: "education",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    default: `${siteConfig.name} | Study Abroad Admissions`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    url: absoluteUrl("/"),
    title: `${siteConfig.name} | Study Abroad Admissions`,
    description: siteConfig.description,
    images: [
      {
        url: getOgImageUrl("/"),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Study Abroad Admissions`,
    description: siteConfig.description,
    images: [getOgImageUrl("/")],
  },
  robots: defaultRobots,
};

// Unknown slugs on catalogue routes still answer HTTP 200: the static shell
// (loading.tsx and the AppChrome Suspense) is sent before the page can call
// notFound(), and the streamed response does not carry Next's noindex. The
// not-found metadata therefore has to say noindex itself.
export function buildNotFoundMetadata(title = "Page Not Found"): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
    alternates: { canonical: null },
  };
}

export function buildNoIndexMetadata(
  base: Metadata,
  options?: { canonicalPath?: string }
): Metadata {
  return {
    ...base,
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
    alternates: options?.canonicalPath
      ? {
          canonical: absoluteUrl(options.canonicalPath),
        }
      : base.alternates,
  };
}
