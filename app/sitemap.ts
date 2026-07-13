import type { MetadataRoute } from "next";
import { getLatestDate } from "@/lib/content-dates";
import {
  catalogReviewedAt,
  governancePublishedAt,
} from "@/lib/content-governance";
import { absoluteUrl } from "@/lib/metadata";
import {
  getAllLandingPages,
  getPublishedBlogPostMetadata,
  getSitemapCatalogData,
} from "@/lib/data/catalog";
import { getTamilNaduCityPages } from "@/lib/data/tamil-nadu-local";
import {
  getBudgetIndexHref,
  getCompareIndexHref,
  getCountriesIndexHref,
  getCountryHref,
  getCoursesIndexHref,
  getCourseHref,
  getIndiaMbbsCollegesHref,
  getLandingPageHref,
  getTamilNaduCityHref,
  getTamilNaduHubHref,
} from "@/lib/routes";

function uniqueUrls(urls: Array<string | undefined>) {
  return [...new Set(urls.filter(Boolean))];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tamilNaduCityPages = getTamilNaduCityPages();
  const [sitemapCatalog, landingPages, publishedPosts] = await Promise.all([
    getSitemapCatalogData(),
    getAllLandingPages(),
    getPublishedBlogPostMetadata(),
  ]);
  const { countries, courses, universities, programOfferings } = sitemapCatalog;
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
  const indiaCollegesLastModified = getLatestDate([
    catalogReviewedAt,
  ]);
  const latestBlogModified =
    getLatestDate(
      publishedPosts.flatMap((post) => [post.updatedAt, post.publishedAt]),
    ) ?? governanceLastModified;

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
      url: absoluteUrl("/neet-college-predictor"),
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl(getIndiaMbbsCollegesHref()),
      priority: 0.82,
      changeFrequency: "weekly",
      lastModified: indiaCollegesLastModified ?? catalogLastModified,
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
      url: absoluteUrl("/news"),
      priority: 0.75,
      changeFrequency: "hourly",
      lastModified: new Date(),
    },
    {
      url: absoluteUrl("/blog"),
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: publishedPosts[0]?.publishedAt ? new Date(publishedPosts[0].publishedAt) : new Date(),
    },
    {
      url: absoluteUrl(getTamilNaduHubHref()),
      priority: 0.76,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/blog/feed.xml"),
      priority: 0.3,
      changeFrequency: "daily" as const,
      lastModified: publishedPosts[0]?.publishedAt ? new Date(publishedPosts[0].publishedAt) : new Date(),
    },
    // Category archive pages
    ...["mbbs-abroad","country-guide","nmc-licensing","university-guide","admissions","student-life","fees-scholarships","tips-advice"].map((cat) => ({
      url: absoluteUrl(`/blog/category/${cat}`),
      priority: 0.65,
      changeFrequency: "weekly" as const,
      lastModified: latestBlogModified,
    })),
    ...publishedPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      priority: 0.75,
      changeFrequency: "monthly" as const,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : post.publishedAt ? new Date(post.publishedAt) : new Date(),
    })),
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
      url: absoluteUrl("/free-mbbs-in-abroad-for-indian-students"),
      priority: 0.78,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/mbbs-in-russia-admission"),
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/mbbs-in-vietnam-admission"),
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/mbbs-in-georgia-admission"),
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/mbbs-in-russia-fees"),
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/mbbs-in-vietnam-fees"),
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/best-mbbs-colleges-in-russia-for-indian-students"),
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/mbbs-in-russia-vs-vietnam-for-indian-students"),
      priority: 0.89,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/medical-colleges-in-vietnam"),
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/best-mbbs-universities-in-vietnam-for-indian-students"),
      priority: 0.89,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/disadvantages-of-studying-mbbs-in-russia"),
      priority: 0.86,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/is-mbbs-in-russia-worth-it"),
      priority: 0.86,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/is-neet-required-for-mbbs-in-russia"),
      priority: 0.86,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/disadvantages-of-studying-mbbs-in-vietnam"),
      priority: 0.86,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/is-mbbs-in-vietnam-good-for-indian-students"),
      priority: 0.86,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/is-mbbs-in-vietnam-valid-in-india"),
      priority: 0.86,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/is-neet-required-for-mbbs-in-vietnam"),
      priority: 0.86,
      changeFrequency: "weekly",
      lastModified: catalogLastModified,
    },
    {
      url: absoluteUrl("/mbbs-admission-in-russia"),
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/mbbs-from-russia-valid-in-india"),
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/mbbs-in-russia-with-scholarship"),
      priority: 0.78,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/mbbs-in-russia-duration"),
      priority: 0.78,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/top-mbbs-colleges-in-russia"),
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/mbbs-in-russia-eligibility-for-indian-students"),
      priority: 0.78,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/lowest-mbbs-fees-in-russia"),
      priority: 0.78,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/mbbs-in-russia-fees-in-rupees"),
      priority: 0.78,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/bsc-nursing-in-albania"),
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/bsc-nursing-in-albania-fees"),
      priority: 0.88,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/germany-nursing-career-pathway"),
      priority: 0.87,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/albania-student-visa-for-indian-students"),
      priority: 0.86,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/bsc-nursing-in-canada"),
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/bsc-nursing-in-canada-fees"),
      priority: 0.88,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/canada-study-permit-for-indian-students"),
      priority: 0.87,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/canada-nursing-pr-pathway"),
      priority: 0.87,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/study-mbbs-in-italy"),
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/mbbs-in-italy-fees"),
      priority: 0.88,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/imat-exam-for-mbbs-in-italy"),
      priority: 0.87,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/medical-colleges-in-italy"),
      priority: 0.88,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/study-in-germany-with-scholarship"),
      priority: 0.78,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/study-in-australia-for-indian-students"),
      priority: 0.78,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/scholarships-for-indian-students-to-study-abroad"),
      priority: 0.79,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/seminar-2026"),
      priority: 0.82,
      changeFrequency: "weekly",
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
      url: absoluteUrl("/guides/neet-2026-paper-analysis-expected-cutoff"),
      priority: 0.82,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/guides/neet-2026-expected-cut-off"),
      priority: 0.78,
      changeFrequency: "weekly",
      lastModified: governanceLastModified,
    },
    {
      url: absoluteUrl("/guides/neet-2026-marks-vs-rank"),
      priority: 0.78,
      changeFrequency: "weekly",
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
    ...landingPages.map((page) => ({
      url: absoluteUrl(getLandingPageHref(page.courseSlug, page.countrySlug)),
      priority: 0.95,
      changeFrequency: "weekly" as const,
      lastModified: getLandingPageLastModified(
        page.courseSlug,
        page.countrySlug
      ),
    })),
    ...tamilNaduCityPages.map((page) => ({
      url: absoluteUrl(getTamilNaduCityHref(page.slug)),
      priority: 0.72,
      changeFrequency: "weekly" as const,
      lastModified: governanceLastModified,
    })),
  ];
}
