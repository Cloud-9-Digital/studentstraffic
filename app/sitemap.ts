import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/metadata";
import {
  getAllLandingPages,
  getCountries,
  getCourses,
  getUniversities,
} from "@/lib/data/catalog";
import { getBudgetGuides, getComparisonGuides } from "@/lib/discovery-pages";
import {
  getBudgetGuideHref,
  getBudgetIndexHref,
  getCompareIndexHref,
  getComparisonHref,
  getCountriesIndexHref,
  getCountryHref,
  getCoursesIndexHref,
  getCourseHref,
  getLandingPageHref,
  getUniversityHref,
} from "@/lib/routes";

function uniqueUrls(urls: Array<string | undefined>) {
  return [...new Set(urls.filter(Boolean))];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    countries,
    courses,
    landingPages,
    universities,
    comparisonGuides,
    budgetGuides,
  ] = await Promise.all([
    getCountries(),
    getCourses(),
    getAllLandingPages(),
    getUniversities(),
    getComparisonGuides(),
    getBudgetGuides(),
  ]);

  return [
    {
      url: absoluteUrl("/"),
      priority: 1,
      changeFrequency: "weekly",
    },
    {
      url: absoluteUrl("/universities"),
      priority: 0.9,
      changeFrequency: "daily",
    },
    {
      url: absoluteUrl(getCountriesIndexHref()),
      priority: 0.85,
      changeFrequency: "weekly",
    },
    {
      url: absoluteUrl(getCoursesIndexHref()),
      priority: 0.85,
      changeFrequency: "weekly",
    },
    {
      url: absoluteUrl("/about"),
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: absoluteUrl("/contact"),
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: absoluteUrl("/editorial-policy"),
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: absoluteUrl("/methodology"),
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: absoluteUrl(getCompareIndexHref()),
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      url: absoluteUrl(getBudgetIndexHref()),
      priority: 0.8,
      changeFrequency: "weekly",
    },
    ...countries.map((country) => ({
      url: absoluteUrl(getCountryHref(country.slug)),
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
    ...courses.map((course) => ({
      url: absoluteUrl(getCourseHref(course.slug)),
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
    ...universities.map((university) => ({
      url: absoluteUrl(getUniversityHref(university.slug)),
      priority: 0.85,
      changeFrequency: "weekly" as const,
      images: uniqueUrls([
        university.logoUrl,
        university.coverImageUrl,
        ...university.galleryImages.map((image) => image.url),
      ]).map((url) => absoluteUrl(url)),
    })),
    ...landingPages.map((page) => ({
      url: absoluteUrl(getLandingPageHref(page.courseSlug, page.countrySlug)),
      priority: 0.95,
      changeFrequency: "weekly" as const,
    })),
    ...comparisonGuides.map((guide) => ({
      url: absoluteUrl(getComparisonHref(guide.slug)),
      priority: 0.78,
      changeFrequency: "weekly" as const,
    })),
    ...budgetGuides.map((guide) => ({
      url: absoluteUrl(getBudgetGuideHref(guide.slug)),
      priority: 0.78,
      changeFrequency: "weekly" as const,
    })),
  ];
}
