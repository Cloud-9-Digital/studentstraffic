import type { Metadata } from "next";

import { env } from "@/lib/env";
import { siteConfig } from "@/lib/constants";

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

type IndexableMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  category?: string;
  openGraphType?: "website" | "article";
};

export function absoluteUrl(path = "/") {
  return new URL(path, env.siteUrl).toString();
}

export function getOgImagePath(path = "/") {
  return path === "/" ? "/opengraph-image" : `${path}/opengraph-image`;
}

export function getOgImageUrl(path = "/") {
  return absoluteUrl(getOgImagePath(path));
}

export function buildIndexableMetadata(
  input: IndexableMetadataInput
): Metadata {
  const imageUrl = getOgImageUrl(input.path);

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    category: input.category ?? "education",
    alternates: {
      canonical: absoluteUrl(input.path),
    },
    robots: defaultRobots,
    openGraph: {
      type: input.openGraphType ?? "website",
      locale: "en_IN",
      siteName: siteConfig.name,
      url: absoluteUrl(input.path),
      title: input.title,
      description: input.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
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
