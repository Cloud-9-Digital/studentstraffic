import type { MetadataRoute } from "next";

import { getLatestDate } from "@/lib/content-dates";
import {
  catalogReviewedAt,
  governancePublishedAt,
} from "@/lib/content-governance";
import { absoluteUrl } from "@/lib/metadata";
import {
  getAllLandingPages,
  getCatalogSnapshot,
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
import { getIndexableUniversityImageUrls } from "@/lib/university-media";

function uniqueUrls(urls: Array<string | undefined>) {
  return [...new Set(urls.filter(Boolean))];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [snapshot, landingPages, comparisonGuides, budgetGuides] =
    await Promise.all([
      getCatalogSnapshot(),
      getAllLandingPages(),
      getComparisonGuides(),
      getBudgetGuides(),
    ]);
  const { countries, courses, universities, programOfferings } = snapshot;
  const countryBySlug = new Map(countries.map((country) => [country.slug, country]));
  const courseBySlug = new Map(courses.map((course) => [course.slug, course]));
  const universityBySlug = new Map(
    universities.map((university) => [university.slug, university])
  );
  const programsByUniversity = new Map<string, typeof programOfferings>();
  const programsByCountryCourse = new Map<string, typeof programOfferings>();

  for (const offering of programOfferings) {
    const universityPrograms =
      programsByUniversity.get(offering.universitySlug) ?? [];
    universityPrograms.push(offering);
    programsByUniversity.set(offering.universitySlug, universityPrograms);

    const university = universityBySlug.get(offering.universitySlug);

    if (!university) {
      continue;
    }

    const countryCourseKey = `${university.countrySlug}::${offering.courseSlug}`;
    const countryCoursePrograms =
      programsByCountryCourse.get(countryCourseKey) ?? [];
    countryCoursePrograms.push(offering);
    programsByCountryCourse.set(countryCourseKey, countryCoursePrograms);
  }

  const catalogLastModified = getLatestDate([
    catalogReviewedAt,
    ...countries.map((country) => country.updatedAt),
    ...courses.map((course) => course.updatedAt),
    ...universities.map((university) => university.updatedAt),
    ...programOfferings.map((offering) => offering.updatedAt),
  ]);
  const governanceLastModified = getLatestDate([
    governancePublishedAt,
    catalogReviewedAt,
  ]);

  function getUniversityLastModified(universitySlug: string) {
    const university = universityBySlug.get(universitySlug);

    return getLatestDate([
      catalogReviewedAt,
      university?.updatedAt,
      ...(programsByUniversity.get(universitySlug) ?? []).map(
        (offering) => offering.updatedAt
      ),
    ]);
  }

  function getLandingPageLastModified(courseSlug: string, countrySlug: string) {
    const relatedPrograms =
      programsByCountryCourse.get(`${countrySlug}::${courseSlug}`) ?? [];

    return getLatestDate([
      catalogReviewedAt,
      countryBySlug.get(countrySlug)?.updatedAt,
      courseBySlug.get(courseSlug)?.updatedAt,
      ...relatedPrograms.map((offering) => offering.updatedAt),
      ...relatedPrograms.map(
        (offering) => universityBySlug.get(offering.universitySlug)?.updatedAt
      ),
    ]);
  }

  return [
    {
      url: absoluteUrl("/"),
      priority: 1,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/universities"),
      priority: 0.9,
      changeFrequency: "daily",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl(getCountriesIndexHref()),
      priority: 0.85,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl(getCoursesIndexHref()),
      priority: 0.85,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/about"),
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/contact"),
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/editorial-policy"),
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/methodology"),
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/privacy"),
      priority: 0.5,
      changeFrequency: "yearly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/terms"),
      priority: 0.5,
      changeFrequency: "yearly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl(getCompareIndexHref()),
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl(getBudgetIndexHref()),
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    ...countries.map((country) => ({
      url: absoluteUrl(getCountryHref(country.slug)),
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified: getLatestDate([catalogReviewedAt, country.updatedAt]),
    })),
    ...courses.map((course) => ({
      url: absoluteUrl(getCourseHref(course.slug)),
      priority: 0.8,
      changeFrequency: "weekly" as const,
      lastModified: getLatestDate([catalogReviewedAt, course.updatedAt]),
    })),
    ...universities.map((university) => ({
      url: absoluteUrl(getUniversityHref(university.slug)),
      priority: 0.85,
      changeFrequency: "weekly" as const,
      lastModified: getUniversityLastModified(university.slug),
      images: uniqueUrls(
        getIndexableUniversityImageUrls([
          university.logoUrl,
          university.coverImageUrl,
          ...university.galleryImages.map((image) => image.url),
        ])
      ).map((url) => absoluteUrl(url)),
    })),
    ...landingPages.map((page) => ({
      url: absoluteUrl(getLandingPageHref(page.courseSlug, page.countrySlug)),
      priority: 0.95,
      changeFrequency: "weekly" as const,
      lastModified: getLandingPageLastModified(
        page.courseSlug,
        page.countrySlug
      ),
    })),
    ...comparisonGuides.map((guide) => ({
      url: absoluteUrl(getComparisonHref(guide.slug)),
      priority: 0.78,
      changeFrequency: "weekly" as const,
      lastModified: getLatestDate([
        catalogReviewedAt,
        guide.left.course.updatedAt,
        guide.right.course.updatedAt,
        guide.left.university.updatedAt,
        guide.right.university.updatedAt,
        guide.left.offering.updatedAt,
        guide.right.offering.updatedAt,
      ]),
    })),
    ...budgetGuides.map((guide) => ({
      url: absoluteUrl(getBudgetGuideHref(guide.slug)),
      priority: 0.78,
      changeFrequency: "weekly" as const,
      lastModified: getLatestDate([
        catalogReviewedAt,
        guide.course.updatedAt,
        ...guide.programs.flatMap((program) => [
          program.university.updatedAt,
          program.offering.updatedAt,
        ]),
      ]),
    })),
  ];
}
