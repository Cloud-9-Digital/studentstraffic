import type { TeachingLanguageCode } from "@/lib/catalogue-facets";
import type {
  Country,
  Course,
  FinderProgram,
  University,
} from "@/lib/data/types";
import { siteConfig } from "@/lib/constants";
import {
  contentAuthorAreas,
  contentAuthorBio,
  contentAuthorName,
  contentAuthorRole,
  contentAuthorSlug,
} from "@/lib/content-governance";
import { absoluteUrl, getOgImageUrl } from "@/lib/metadata";
import {
  getCountryHref,
  getCourseHref,
  getUniversityHref,
  getUniversityProgramHref,
} from "@/lib/routes";
import { getIndexableUniversityImageUrls } from "@/lib/university-media";
import {
  hasOfficialFeeAmount,
  hasPublishedUsdAmount,
  isConfirmedProgramFee,
} from "@/lib/utils";

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

const contentAuthorPath = `/author/${contentAuthorSlug}`;

const teachingLanguageTags: Record<TeachingLanguageCode, string> = {
  albanian: "sq",
  arabic: "ar",
  bulgarian: "bg",
  catalan: "ca",
  chinese: "zh",
  croatian: "hr",
  czech: "cs",
  dutch: "nl",
  english: "en",
  french: "fr",
  georgian: "ka",
  german: "de",
  greek: "el",
  hindi: "hi",
  hungarian: "hu",
  italian: "it",
  japanese: "ja",
  korean: "ko",
  kyrgyz: "ky",
  lithuanian: "lt",
  maltese: "mt",
  norwegian: "no",
  polish: "pl",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  sanskrit: "sa",
  serbian: "sr",
  slovak: "sk",
  slovenian: "sl",
  spanish: "es",
  swedish: "sv",
  telugu: "te",
  turkish: "tr",
  urdu: "ur",
  uzbek: "uz",
  vietnamese: "vi",
};

// Teaching language comes only from the controlled facet; an unconfirmed
// medium is omitted rather than defaulted to English.
function getProgramLanguageTags(program: FinderProgram) {
  const tags = uniqueValues(
    (program.offering.instructionLanguages ?? []).map(
      (code) => teachingLanguageTags[code],
    ),
  );
  if (tags.length === 0) return undefined;
  return tags.length === 1 ? tags[0] : tags;
}

// Annual tuition in the official currency the page shows, falling back to the
// normalized USD figure. Indicative, on-request and missing fees emit nothing.
function getProgramTuitionOffer(program: FinderProgram, programUrl: string) {
  const { offering } = program;
  if (!isConfirmedProgramFee(offering)) return undefined;

  const official =
    hasOfficialFeeAmount(
      offering.officialAnnualTuitionAmount,
      offering.officialFeeCurrency,
    ) && /^[A-Z]{3}$/.test(offering.officialFeeCurrency ?? "");
  const price = official
    ? offering.officialAnnualTuitionAmount
    : hasPublishedUsdAmount(offering.annualTuitionUsd)
      ? offering.annualTuitionUsd
      : undefined;
  if (price === undefined) return undefined;
  const priceCurrency = official ? offering.officialFeeCurrency : "USD";

  return {
    "@type": "Offer",
    url: programUrl,
    category: "Paid",
    description: offering.feeAcademicYear
      ? `Annual tuition, ${offering.feeAcademicYear}`
      : "Annual tuition",
    priceCurrency,
    price,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price,
      priceCurrency,
      referenceQuantity: {
        "@type": "QuantitativeValue",
        value: 1,
        unitCode: "ANN",
      },
    },
  };
}

function getIsoDuration(years: number) {
  return Number.isInteger(years) ? `P${years}Y` : `P${Math.round(years * 12)}M`;
}

export function getProgramStructuredDataId(programSlug: string) {
  return withFragment(getUniversityProgramHref(programSlug), "program");
}

export function getProgramOfferingStructuredData(program: FinderProgram) {
  const programPath = getUniversityProgramHref(program.offering.slug);
  const programUrl = absoluteUrl(programPath);
  const universityId = getUniversityStructuredDataId(program.university.slug);
  const duration = getIsoDuration(program.offering.durationYears);
  const medium =
    program.offering.medium && program.offering.medium !== "Not confirmed"
      ? `, taught in ${program.offering.medium}`
      : "";

  return {
    // A degree programme is both: Course keeps Google's course features,
    // EducationalOccupationalProgram carries timeToComplete.
    "@type": ["Course", "EducationalOccupationalProgram"],
    "@id": getProgramStructuredDataId(program.offering.slug),
    name: program.offering.title,
    description: `${program.offering.title} (${program.course.shortName}) at ${program.university.name}, ${program.university.city}, ${program.country.name}: ${program.offering.durationYears}-year programme${medium}.`,
    url: programUrl,
    provider: {
      "@type": "CollegeOrUniversity",
      "@id": universityId,
      name: program.university.name,
      url: absoluteUrl(getUniversityHref(program.university.slug)),
      address: {
        "@type": "PostalAddress",
        addressLocality: program.university.city,
        addressCountry: program.country.name,
      },
    },
    courseCode: program.course.shortName,
    courseMode: "Onsite",
    educationalCredentialAwarded: program.course.shortName,
    inLanguage: getProgramLanguageTags(program),
    timeRequired: duration,
    timeToComplete: duration,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      courseWorkload: duration,
    },
    offers: getProgramTuitionOffer(program, programUrl),
    mainEntityOfPage: {
      "@id": getWebPageStructuredDataId(programPath),
    },
  };
}

export function getArticleStructuredData(input: {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}) {
  return {
    "@type": "Article",
    "@id": withFragment(input.path, "article"),
    mainEntityOfPage: {
      "@id": getWebPageStructuredDataId(input.path),
    },
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      "@id": getAuthorStructuredDataId(),
    },
    publisher: {
      "@id": getOrganizationStructuredDataId(),
    },
    image: {
      "@type": "ImageObject",
      url: input.image ? absoluteUrl(input.image) : getOgImageUrl(input.path),
    },
  };
}

function getProgramCourseStructuredData(program: FinderProgram) {
  return getProgramOfferingStructuredData(program);
}

export function getOrganizationStructuredDataId() {
  return withFragment("/", "organization");
}

export function getWebsiteStructuredDataId() {
  return withFragment("/", "website");
}

export function getAuthorStructuredDataId() {
  return withFragment(contentAuthorPath, "person");
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
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.operator,
    },
    sameAs: [siteConfig.playStoreUrl, siteConfig.appStoreUrl].filter(Boolean),
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

export function getAuthorStructuredData() {
  return {
    "@type": "Person",
    "@id": getAuthorStructuredDataId(),
    name: contentAuthorName,
    jobTitle: contentAuthorRole,
    description: contentAuthorBio,
    url: absoluteUrl(contentAuthorPath),
    worksFor: {
      "@id": getOrganizationStructuredDataId(),
    },
    knowsAbout: contentAuthorAreas,
  };
}

export function getProfilePageStructuredData(author: {
  slug: string;
  name: string;
  title: string;
  bio: string;
  longBio: string[];
}) {
  const path = `/author/${author.slug}`;
  const personId = `${absoluteUrl(path)}#person`;

  const person = {
    "@type": "Person",
    "@id": personId,
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    url: absoluteUrl(path),
    worksFor: {
      "@id": getOrganizationStructuredDataId(),
    },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": getWebPageStructuredDataId(path),
    url: absoluteUrl(path),
    name: `${author.name} — ${author.title}`,
    description: author.bio,
    inLanguage: "en-IN",
    isPartOf: { "@id": getWebsiteStructuredDataId() },
    publisher: { "@id": getOrganizationStructuredDataId() },
    breadcrumb: { "@id": getBreadcrumbStructuredDataId(path) },
    mainEntity: { "@id": personId },
  };

  const breadcrumb = getBreadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: author.name, path },
  ]);

  return getStructuredDataGraph([
    getOrganizationStructuredData(),
    getWebsiteStructuredData(),
    person,
    profilePage,
    breadcrumb,
  ]);
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
      "@id": getAuthorStructuredDataId(),
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
    // A course family is a catalogue category, not something Students Traffic
    // teaches, so it carries no provider; offerings name their university.
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
  const imageUrls = getAbsoluteMediaUrls(
    getIndexableUniversityImageUrls([
      input.university.coverImageUrl,
    ])
  );
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
    // References only: the full Course nodes are in the page's ItemList (or
    // the programme node itself), so each offering is emitted once.
    hasCourse: input.programs.map((program) => ({
      "@id": getProgramStructuredDataId(program.offering.slug),
    })),
  };
}
