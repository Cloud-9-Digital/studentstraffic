import { and, asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { siteConfig } from "@/lib/constants";
import { getDb } from "@/lib/db/server";
import {
  blogPosts,
  countries as countriesTable,
  courses as coursesTable,
  programOfferings as programOfferingsTable,
  universities as universitiesTable,
} from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/metadata";
import { logPublicRouteRequest } from "@/lib/route-observability";
import {
  getCountryHref,
  getCourseHref,
  getUniversityHref,
} from "@/lib/routes";
import { formatProgramMedium, hasPublishedUsdAmount } from "@/lib/utils";

const getPublishedBlogIndex = unstable_cache(
  async () => {
    const db = getDb();
    if (!db) {
      return [];
    }

    return db
      .select({
        slug: blogPosts.slug,
        title: blogPosts.title,
        category: blogPosts.category,
        excerpt: blogPosts.excerpt,
        publishedAt: blogPosts.publishedAt,
        readingTimeMinutes: blogPosts.readingTimeMinutes,
      })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
  },
  ["llms-full-blog-index"],
  { tags: ["blog"], revalidate: 3600 }
);

const getLlmsCatalogIndex = unstable_cache(
  async () => {
    const db = getDb();
    if (!db) {
      return { countries: [], courses: [], universities: [], offerings: [] };
    }

    const [countries, courses, universities, offerings] = await Promise.all([
      db
        .select({
          slug: countriesTable.slug,
          name: countriesTable.name,
          region: countriesTable.region,
          summary: countriesTable.summary,
        })
        .from(countriesTable)
        .orderBy(asc(countriesTable.name)),
      db
        .select({
          slug: coursesTable.slug,
          name: coursesTable.name,
          shortName: coursesTable.shortName,
          durationYears: coursesTable.durationYears,
          summary: coursesTable.summary,
        })
        .from(coursesTable)
        .where(eq(coursesTable.active, true))
        .orderBy(asc(coursesTable.displayOrder), asc(coursesTable.name)),
      db
        .select({
          slug: universitiesTable.slug,
          name: universitiesTable.name,
          countrySlug: countriesTable.slug,
          city: universitiesTable.city,
          type: universitiesTable.type,
          establishedYear: universitiesTable.establishedYear,
          recognitionBadges: universitiesTable.recognitionBadges,
          summary: universitiesTable.summary,
        })
        .from(universitiesTable)
        .innerJoin(
          countriesTable,
          eq(universitiesTable.countryId, countriesTable.id),
        )
        .where(eq(universitiesTable.published, true))
        .orderBy(asc(universitiesTable.name)),
      db
        .select({
          universitySlug: universitiesTable.slug,
          courseSlug: coursesTable.slug,
          durationYears: programOfferingsTable.durationYears,
          annualTuitionUsd: programOfferingsTable.annualTuitionUsd,
          totalTuitionUsd: programOfferingsTable.totalTuitionUsd,
          medium: programOfferingsTable.medium,
        })
        .from(programOfferingsTable)
        .innerJoin(
          universitiesTable,
          eq(programOfferingsTable.universityId, universitiesTable.id),
        )
        .innerJoin(
          coursesTable,
          eq(programOfferingsTable.courseId, coursesTable.id),
        )
        .where(
          and(
            eq(programOfferingsTable.published, true),
            eq(universitiesTable.published, true),
          ),
        )
        .orderBy(asc(universitiesTable.name), asc(coursesTable.name)),
    ]);

    return { countries, courses, universities, offerings };
  },
  ["llms-full-catalog-index"],
  { tags: ["catalog", "llms"], revalidate: 86400 },
);

export async function GET(request: Request) {
  logPublicRouteRequest({
    route: "llms-full.txt",
    request,
    sampleRate: 1,
  });

  const [{ universities, countries, courses, offerings }, posts] = await Promise.all([
    getLlmsCatalogIndex(),
    getPublishedBlogIndex(),
  ]);

  const countryMap = new Map(countries.map((c) => [c.slug, c]));
  const courseMap = new Map(courses.map((c) => [c.slug, c]));

  const lines: string[] = [
    `# ${siteConfig.name} — Full Content Index`,
    "",
    `> ${siteConfig.description}`,
    "",
    "This file provides a lightweight structured index of Students Traffic content for AI agents and LLMs. For navigation guidance see /llms.txt.",
    "",
    "---",
    "",
    "## Evergreen Pages",
    "",
    "### Free MBBS in Abroad for Indian Students",
    `- URL: ${absoluteUrl("/free-mbbs-in-abroad-for-indian-students")}`,
    "- Summary: A realistic 2026 guide on whether Indian students can study MBBS abroad for free, covering scholarship reality, hidden costs, official-source checks, and NMC-aware planning.",
    "",
    "### MBBS in Russia Fees for Indian Students",
    `- URL: ${absoluteUrl("/mbbs-in-russia-fees")}`,
    "- Summary: A commercial comparison page for MBBS in Russia fees, covering annual tuition, hostel plus food estimates, total tuition planning, and university-wise shortlist decisions for Indian students.",
    "",
    "### MBBS in Vietnam Fees for Indian Students",
    `- URL: ${absoluteUrl("/mbbs-in-vietnam-fees")}`,
    "- Summary: A commercial fee-comparison page for MBBS in Vietnam, covering tuition, hostel plus food estimates, total cost planning, and university-level affordability for Indian students.",
    "",
    "### Best MBBS Colleges in Russia for Indian Students",
    `- URL: ${absoluteUrl("/best-mbbs-colleges-in-russia-for-indian-students")}`,
    "- Summary: A shortlist-driven Russia comparison page covering university fit, tuition band, city context, and which Russian colleges Indian students should evaluate first.",
    "",
    "### MBBS in Russia vs Vietnam for Indian Students",
    `- URL: ${absoluteUrl("/mbbs-in-russia-vs-vietnam-for-indian-students")}`,
    "- Summary: A commercial Russia-vs-Vietnam comparison page covering fees, English-medium reality, travel comfort, shortlist quality, and which country fits different Indian student profiles.",
    "",
    "### Medical Colleges in Vietnam for Indian Students",
    `- URL: ${absoluteUrl("/medical-colleges-in-vietnam")}`,
    "- Summary: A shortlist-driven Vietnam comparison page covering medical colleges, tuition band, city context, and which Vietnam options Indian students should evaluate first.",
    "",
    "### Best MBBS Universities in Vietnam for Indian Students",
    `- URL: ${absoluteUrl("/best-mbbs-universities-in-vietnam-for-indian-students")}`,
    "- Summary: A commercial Vietnam shortlist page focused on the best MBBS universities for Indian students, including fee fit, city context, and why certain universities deserve shortlist priority first.",
    "",
    "### Disadvantages of Studying MBBS in Russia",
    `- URL: ${absoluteUrl("/disadvantages-of-studying-mbbs-in-russia")}`,
    "- Summary: An honest decision page covering the main disadvantages of studying MBBS in Russia for Indian students, including language, climate, shortlist quality, and India-return planning.",
    "",
    "### Is MBBS in Russia Worth It?",
    `- URL: ${absoluteUrl("/is-mbbs-in-russia-worth-it")}`,
    "- Summary: A practical yes-or-no decision page on whether MBBS in Russia is worth it for Indian students, covering cost value, adaptation, and who should or should not choose Russia.",
    "",
    "### Is NEET Required for MBBS in Russia?",
    `- URL: ${absoluteUrl("/is-neet-required-for-mbbs-in-russia")}`,
    "- Summary: A direct Russia eligibility page covering whether NEET is required, the 'without NEET' myth, qualifying-score reality, and how the India-return pathway changes the answer.",
    "",
    "### Disadvantages of Studying MBBS in Vietnam",
    `- URL: ${absoluteUrl("/disadvantages-of-studying-mbbs-in-vietnam")}`,
    "- Summary: An honest Vietnam decision page covering the main disadvantages of studying MBBS in Vietnam for Indian students, including university variation, clinical-language reality, and shortlist quality.",
    "",
    "### Is MBBS in Vietnam Good for Indian Students?",
    `- URL: ${absoluteUrl("/is-mbbs-in-vietnam-good-for-indian-students")}`,
    "- Summary: A practical yes-or-no Vietnam decision page covering cost value, climate, proximity to India, and why university-level shortlisting still decides whether Vietnam is a good fit.",
    "",
    "### Is MBBS in Vietnam Valid in India?",
    `- URL: ${absoluteUrl("/is-mbbs-in-vietnam-valid-in-india")}`,
    "- Summary: A practical Vietnam validity page covering whether MBBS in Vietnam is valid in India, what 'valid' really means under the foreign medical graduate pathway, and what families should verify before admission.",
    "",
    "### Is NEET Required for MBBS in Vietnam?",
    `- URL: ${absoluteUrl("/is-neet-required-for-mbbs-in-vietnam")}`,
    "- Summary: A direct Vietnam eligibility page covering whether NEET is required, the 'without NEET' myth, score reality, and why Indian students should treat NEET as part of the India-return pathway.",
    "### MBBS Admission in Russia",
    `- URL: ${absoluteUrl("/mbbs-admission-in-russia")}`,
    "- Summary: A practical India-focused guide to MBBS admission in Russia, covering eligibility, documents, timeline, NEET implications, and common admission mistakes.",
    "",
    "### MBBS from Russia Valid in India",
    `- URL: ${absoluteUrl("/mbbs-from-russia-valid-in-india")}`,
    "- Summary: A direct answer page explaining when a Russia MBBS degree is workable for India-return planning and what usually breaks the pathway.",
    "",
    "### MBBS in Russia with Scholarship",
    `- URL: ${absoluteUrl("/mbbs-in-russia-with-scholarship")}`,
    "- Summary: A scholarship-intent guide separating official Russia scholarship routes from vague marketing claims and showing what costs remain.",
    "",
    "### MBBS in Russia Duration",
    `- URL: ${absoluteUrl("/mbbs-in-russia-duration")}`,
    "- Summary: A long-form guide on how the six-year Russia MBBS pathway works, including internship, structure confusion, and India-return planning implications.",
    "",
    "### Top MBBS Colleges in Russia",
    `- URL: ${absoluteUrl("/top-mbbs-colleges-in-russia")}`,
    "- Summary: A shortlist-first guide that explains how Indian students should compare top Russian medical universities by fit, city, budget, and pathway quality.",
    "",
    "### MBBS in Russia Eligibility for Indian Students",
    `- URL: ${absoluteUrl("/mbbs-in-russia-eligibility-for-indian-students")}`,
    "- Summary: A direct India-focused eligibility guide covering PCB, NEET, age, passport readiness, and application readiness for Russia MBBS applicants.",
    "",
    "### Lowest MBBS Fees in Russia",
    `- URL: ${absoluteUrl("/lowest-mbbs-fees-in-russia")}`,
    "- Summary: A budget-first guide explaining how to compare genuinely low-fee Russia options without sacrificing university fit or pathway quality.",
    "",
    "### MBBS in Russia Fees in Rupees",
    `- URL: ${absoluteUrl("/mbbs-in-russia-fees-in-rupees")}`,
    "- Summary: An INR-first fee-planning guide that translates Russia MBBS cost into realistic rupee budgeting, hidden charges, and total-pathway thinking.",
    "",
    "### Study in Germany with Scholarship",
    `- URL: ${absoluteUrl("/study-in-germany-with-scholarship")}`,
    "- Summary: A practical Germany scholarship guide explaining what scholarships really cover, what living-cost and visa-financing realities remain, and how Indian students should plan the route honestly.",
    "",
    "### Study in Australia for Indian Students",
    `- URL: ${absoluteUrl("/study-in-australia-for-indian-students")}`,
    "- Summary: A broad decision-stage Australia guide covering cost reality, scholarships, course and city selection, admissions planning, and who Australia actually suits.",
    "",
    "### Scholarships for Indian Students to Study Abroad",
    `- URL: ${absoluteUrl("/scholarships-for-indian-students-to-study-abroad")}`,
    "- Summary: A scholarship hub that connects Germany, Russia MBBS, and broader study-abroad scholarship planning pages for Indian students.",
    "",
    "---",
    "",
    "## Countries",
    "",
  ];

  for (const country of countries) {
    const url = absoluteUrl(getCountryHref(country.slug));
    lines.push(`### ${country.name}`);
    lines.push(`- URL: ${url}`);
    lines.push(`- Region: ${country.region}`);
    lines.push(`- Summary: ${country.summary}`);
    lines.push("");
  }

  lines.push("---", "", "## Courses", "");

  for (const course of courses) {
    const url = absoluteUrl(getCourseHref(course.slug));
    lines.push(`### ${course.name} (${course.shortName})`);
    lines.push(`- URL: ${url}`);
    lines.push(`- Duration: ${course.durationYears} years`);
    lines.push(`- Summary: ${course.summary}`);
    lines.push("");
  }

  lines.push("---", "", "## Universities", "");

  for (const university of universities) {
    const country = countryMap.get(university.countrySlug);
    const url = absoluteUrl(getUniversityHref(university.slug));
    const universityOfferings = offerings.filter(
      (o) => o.universitySlug === university.slug,
    );

    lines.push(`### ${university.name}`);
    lines.push(`- URL: ${url}`);
    lines.push(`- Location: ${university.city}${country ? `, ${country.name}` : ""}`);
    lines.push(`- Type: ${university.type}`);
    lines.push(`- Established: ${university.establishedYear}`);

    if (university.recognitionBadges.length > 0) {
      lines.push(`- Recognition: ${university.recognitionBadges.join(", ")}`);
    }

    if (universityOfferings.length > 0) {
      const programLines: string[] = [];
      for (const offering of universityOfferings) {
        const course = courseMap.get(offering.courseSlug);
        const courseName = course?.shortName ?? offering.courseSlug.toUpperCase();
        const fee = hasPublishedUsdAmount(offering.annualTuitionUsd)
          ? `$${offering.annualTuitionUsd.toLocaleString("en-US")}/year`
          : "fee on request";
        const totalFee = hasPublishedUsdAmount(offering.totalTuitionUsd)
          ? `, $${offering.totalTuitionUsd.toLocaleString("en-US")} total`
          : "";
        programLines.push(
          `  - ${courseName}: ${fee}${totalFee}, ${offering.durationYears} years, ${formatProgramMedium(
            offering.medium as Parameters<typeof formatProgramMedium>[0],
            university.countrySlug,
          )}`,
        );
      }
      lines.push(`- Programs:`);
      lines.push(...programLines);
    }

    lines.push(`- Summary: ${university.summary}`);
    lines.push("");
  }

  if (posts.length > 0) {
    lines.push("---", "", "## Blog Posts", "");
    for (const post of posts) {
      const url = absoluteUrl(`/blog/${post.slug}`);
      const readingMinutes = post.readingTimeMinutes ?? 5;
      lines.push(`### ${post.title}`);
      lines.push(`- URL: ${url}`);
      if (post.category) lines.push(`- Category: ${post.category}`);
      if (post.publishedAt) lines.push(`- Published: ${new Date(post.publishedAt).toISOString().slice(0, 10)}`);
      lines.push(`- Reading time: ~${readingMinutes} min`);
      if (post.excerpt) lines.push(`- Summary: ${post.excerpt}`);
      lines.push("");
    }
  }

  lines.push("---", "", "## Contact", "");
  lines.push(`- Email: ${siteConfig.email}`);
  lines.push(`- Phone: ${siteConfig.phone}`);

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
