import { asc, count, desc, eq, and } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getDb } from "@/lib/db/server";
import {
  blogPosts,
  countries as countriesTable,
  courses as coursesTable,
  programOfferings as programOfferingsTable,
  universities as universitiesTable,
} from "@/lib/db/schema";
import { renderLlmsFullTxt } from "@/lib/llms-full-txt";
import { logPublicRouteRequest } from "@/lib/route-observability";

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

// unstable_cache entries over 2 MB are silently not stored, so a too-large
// entry would re-read the catalogue from Neon on every request. Entities and
// programme counts are cached separately. Bump a key when its row shape
// changes: the data cache outlives deploys.
const getLlmsCatalogEntities = unstable_cache(
  async () => {
    const db = getDb();
    if (!db) {
      return { countries: [], courses: [], universities: [] };
    }

    const [countries, courses, universities] = await Promise.all([
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
          recognitionBadges: universitiesTable.recognitionBadges,
        })
        .from(universitiesTable)
        .innerJoin(
          countriesTable,
          eq(universitiesTable.countryId, countriesTable.id),
        )
        .where(eq(universitiesTable.published, true))
        .orderBy(asc(universitiesTable.name)),
    ]);

    return { countries, courses, universities };
  },
  ["llms-full-catalog-entities-v2"],
  { tags: ["catalog", "llms"], revalidate: 86400 },
);

/** Published programme count per university, as [slug, count] tuples. */
const getLlmsProgrammeCounts = unstable_cache(
  async (): Promise<Array<[string, number]>> => {
    const db = getDb();
    if (!db) return [];

    const rows = await db
      .select({ slug: universitiesTable.slug, programmes: count() })
      .from(programOfferingsTable)
      .innerJoin(
        universitiesTable,
        eq(programOfferingsTable.universityId, universitiesTable.id),
      )
      .where(
        and(
          eq(programOfferingsTable.published, true),
          eq(universitiesTable.published, true),
        ),
      )
      .groupBy(universitiesTable.slug);

    return rows.map((row) => [row.slug, row.programmes]);
  },
  ["llms-full-programme-counts-v1"],
  { tags: ["catalog", "llms"], revalidate: 86400 },
);

export async function GET(request: Request) {
  logPublicRouteRequest({
    route: "llms-full.txt",
    request,
    sampleRate: 1,
  });

  const [{ universities, countries, courses }, programmeCounts, posts] = await Promise.all([
    getLlmsCatalogEntities(),
    getLlmsProgrammeCounts(),
    getPublishedBlogIndex(),
  ]);
  const countBySlug = new Map(programmeCounts);

  const body = renderLlmsFullTxt({
    countries,
    courses,
    universities: universities.map((university) => ({
      ...university,
      programmeCount: countBySlug.get(university.slug) ?? 0,
    })),
    posts,
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
