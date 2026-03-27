import type {
  Country,
  Course,
  FinderProgram,
  University,
} from "@/lib/data/types";
import { siteConfig } from "@/lib/constants";
import { absoluteUrl, getOgImageUrl } from "@/lib/metadata";
import {
  getCountryHref,
  getCourseHref,
  getUniversityHref,
} from "@/lib/routes";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type WebPageSchemaInput = {
  path: string;
  name: string;
  description: string;
  pageType?: "WebPage" | "CollectionPage";
  aboutIds?: string[];
  mainEntityId?: string;
  datePublished?: string;
  dateModified?: string;
};

type ProgramItemListInput = {
  path: string;
  name: string;
  programs: FinderProgram[];
};

function withFragment(path: string, fragment: string) {
  return `${absoluteUrl(path)}#${fragment}`;
}

function compactValues<T>(items: Array<T | null | undefined | false>) {
  return items.filter(Boolean) as T[];
}

function uniqueValues(values: Array<string | undefined>) {
  return [...new Set(values.filter(Boolean) as string[])];
}

function getAbsoluteMediaUrls(urls: Array<string | undefined>) {
  return uniqueValues(urls).map((url) => absoluteUrl(url));
}

function getProgramCourseStructuredData(program: FinderProgram) {
  const universityUrl = absoluteUrl(getUniversityHref(program.university.slug));

  return {
    "@type": "Course",
    name: program.offering.title,
    description: `${program.course.shortName} at ${program.university.name} in ${program.university.city}, ${program.country.name}.`,
    url: universityUrl,
    provider: {
      "@type": "CollegeOrUniversity",
      name: program.university.name,
      url: universityUrl,
      address: {
        "@type": "PostalAddress",
        addressLocality: program.university.city,
        addressCountry: program.country.name,
      },
    },
    courseCode: program.course.shortName,
    courseMode: program.offering.medium,
    educationalCredentialAwarded: program.course.shortName,
    inLanguage: "en",
    timeRequired: `P${program.offering.durationYears}Y`,
    offers: {
      "@type": "Offer",
      url: universityUrl,
      priceCurrency: "USD",
      price: program.offering.annualTuitionUsd,
      category: program.course.shortName,
    },
  };
}

export function getOrganizationStructuredDataId() {
  return withFragment("/", "organization");
}

export function getWebsiteStructuredDataId() {
  return withFragment("/", "website");
}

export function getWebPageStructuredDataId(path: string) {
  return withFragment(path, "webpage");
}

export function getBreadcrumbStructuredDataId(path: string) {
  return withFragment(path, "breadcrumb");
}

export function getItemListStructuredDataId(path: string) {
  return withFragment(path, "itemlist");
}

export function getCountryStructuredDataId(countrySlug: string) {
  return withFragment(getCountryHref(countrySlug), "country");
}

export function getCourseStructuredDataId(courseSlug: string) {
  return withFragment(getCourseHref(courseSlug), "course");
}

export function getUniversityStructuredDataId(universitySlug: string) {
  return withFragment(getUniversityHref(universitySlug), "institution");
}

export function getStructuredDataGraph(items: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": compactValues(items),
  };
}

export function getOrganizationStructuredData() {
  return {
    "@type": "Organization",
    "@id": getOrganizationStructuredDataId(),
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.webp"),
    },
    image: getOgImageUrl("/"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "admissions support",
        telephone: siteConfig.phone,
        email: siteConfig.email,
        areaServed: "IN",
      },
    ],
    description: siteConfig.description,
  };
}

export function getWebsiteStructuredData() {
  return {
    "@type": "WebSite",
    "@id": getWebsiteStructuredDataId(),
    url: absoluteUrl("/"),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en-IN",
    publisher: {
      "@id": getOrganizationStructuredDataId(),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: absoluteUrl("/search?q={search_term_string}"),
      "query-input": "required name=search_term_string",
    },
  };
}

export function getWebPageStructuredData(input: WebPageSchemaInput) {
  return {
    "@type": input.pageType ?? "WebPage",
    "@id": getWebPageStructuredDataId(input.path),
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    inLanguage: "en-IN",
    image: getOgImageUrl(input.path),
    isPartOf: {
      "@id": getWebsiteStructuredDataId(),
    },
    author: {
      "@type": "Organization",
      name: `${siteConfig.name} Editorial Desk`,
      url: absoluteUrl("/about"),
    },
    publisher: {
      "@id": getOrganizationStructuredDataId(),
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    breadcrumb: {
      "@id": getBreadcrumbStructuredDataId(input.path),
    },
    about: input.aboutIds?.length
      ? input.aboutIds.map((id) => ({
          "@id": id,
        }))
      : undefined,
    mainEntity: input.mainEntityId
      ? {
          "@id": input.mainEntityId,
        }
      : undefined,
  };
}

export function getCollectionPageStructuredData(
  input: Omit<WebPageSchemaInput, "pageType">
) {
  return getWebPageStructuredData({
    ...input,
    pageType: "CollectionPage",
  });
}

export function getBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  const pagePath = items.at(-1)?.path ?? "/";

  return {
    "@type": "BreadcrumbList",
    "@id": getBreadcrumbStructuredDataId(pagePath),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function getFaqStructuredData(items: FaqItem[], path: string) {
  return {
    "@type": "FAQPage",
    "@id": withFragment(path, "faq"),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getCountryStructuredData(country: Country) {
  const path = getCountryHref(country.slug);

  return {
    "@type": "Country",
    "@id": getCountryStructuredDataId(country.slug),
    name: country.name,
    description: country.summary,
    url: absoluteUrl(path),
    image: getOgImageUrl(path),
    mainEntityOfPage: {
      "@id": getWebPageStructuredDataId(path),
    },
  };
}

export function getCourseStructuredData(course: Course) {
  const path = getCourseHref(course.slug);

  return {
    "@type": "Course",
    "@id": getCourseStructuredDataId(course.slug),
    name: course.name,
    description: course.summary,
    url: absoluteUrl(path),
    image: getOgImageUrl(path),
    provider: {
      "@id": getOrganizationStructuredDataId(),
    },
    educationalCredentialAwarded: course.shortName,
    timeRequired: `P${course.durationYears}Y`,
    mainEntityOfPage: {
      "@id": getWebPageStructuredDataId(path),
    },
  };
}

export function getProgramItemListStructuredData(input: ProgramItemListInput) {
  return {
    "@type": "ItemList",
    "@id": getItemListStructuredDataId(input.path),
    name: input.name,
    numberOfItems: input.programs.length,
    itemListElement: input.programs.map((program, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: getProgramCourseStructuredData(program),
    })),
  };
}

export function getUniversityStructuredData(input: {
  university: University;
  country: Country;
  programs: FinderProgram[];
  sameAs?: string[];
}) {
  const path = getUniversityHref(input.university.slug);
  const imageUrls = getAbsoluteMediaUrls([
    input.university.coverImageUrl,
    ...input.university.galleryImages.map((image) => image.url),
  ]);
  const logoUrl = input.university.logoUrl
    ? absoluteUrl(input.university.logoUrl)
    : undefined;

  return {
    "@type": "CollegeOrUniversity",
    "@id": getUniversityStructuredDataId(input.university.slug),
    name: input.university.name,
    description: input.university.summary,
    url: absoluteUrl(path),
    image: imageUrls.length ? imageUrls : getOgImageUrl(path),
    logo: logoUrl,
    sameAs: uniqueValues([
      input.university.officialWebsite,
      ...(input.sameAs ?? []),
    ]),
    foundingDate: String(input.university.establishedYear),
    address: {
      "@type": "PostalAddress",
      addressLocality: input.university.city,
      addressCountry: input.country.name,
    },
    mainEntityOfPage: {
      "@id": getWebPageStructuredDataId(path),
    },
    hasCourse: input.programs.map((program) =>
      getProgramCourseStructuredData(program)
    ),
  };
}
