import { eq, desc } from "drizzle-orm";

import { siteConfig } from "@/lib/constants";
import {
  getCountries,
  getCourses,
  getProgramOfferings,
  getUniversities,
} from "@/lib/data/catalog";
import { getDb } from "@/lib/db/server";
import { blogPosts } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/metadata";
import {
  getCountryHref,
  getCourseHref,
  getUniversityHref,
} from "@/lib/routes";
import { hasPublishedUsdAmount } from "@/lib/utils";

export async function GET() {
  const db = getDb();
  const [universities, countries, courses, offerings, posts] = await Promise.all([
    getUniversities(),
    getCountries(),
    getCourses(),
    getProgramOfferings(),
    db
      ? db.select({
          slug: blogPosts.slug,
          title: blogPosts.title,
          category: blogPosts.category,
          excerpt: blogPosts.excerpt,
          publishedAt: blogPosts.publishedAt,
          content: blogPosts.content,
        })
        .from(blogPosts)
        .where(eq(blogPosts.status, "published"))
        .orderBy(desc(blogPosts.publishedAt))
      : Promise.resolve([]),
  ]);

  const countryMap = new Map(countries.map((c) => [c.slug, c]));
  const courseMap = new Map(courses.map((c) => [c.slug, c]));

  const lines: string[] = [
    `# ${siteConfig.name} — Full Content Index`,
    "",
    `> ${siteConfig.description}`,
    "",
    "This file provides a structured index of all content on Students Traffic for use by AI agents and LLMs. For navigation guidance see /llms.txt.",
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
          `  - ${courseName}: ${fee}${totalFee}, ${offering.durationYears} years, ${offering.medium}`,
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
      const wordCount = post.content.split(/\s+/).length;
      const readingMinutes = Math.ceil(wordCount / 200);
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
    },
  });
}
