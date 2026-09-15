import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { asc, sql } from "drizzle-orm";

import { getNavRegionId, type NavRegionId } from "@/lib/country-regions";
import { getDb } from "@/lib/db/server";
import { countries as countriesTable } from "@/lib/db/schema";
import { getCountryFlagCode } from "@/lib/university-media";
import { getCountryHref } from "@/lib/routes";

export type NavCountry = {
  slug: string;
  name: string;
  href: string;
  isoCode: string;
  /** Normalised display region (see lib/country-regions.ts). */
  region: NavRegionId;
  /** Published universities in this country. */
  universityCount: number;
  /** At least one published medicine programme at a published university. */
  hasMedicine: boolean;
};

// Re-exported for backwards compatibility with existing server-side importers.
// Client Components should import this directly from "@/lib/data/nav-constants"
// instead, since this file also contains "use cache" functions that must never
// be bundled into client code.
export { FEATURED_NAV_COUNTRY_SLUG } from "@/lib/data/nav-constants";

export async function getNavCountries(): Promise<NavCountry[]> {
  // `use cache: remote` (not plain `use cache`) because this runs in the root
  // layout on every render. Plain `use cache` is an in-memory LRU that does not
  // persist across serverless instances, so every new Vercel instance re-ran
  // this query - ~81k executions per 12 days, which kept the Neon compute from
  // ever scaling to zero. The remote handler is shared across all instances.
  "use cache: remote";
  // Daily background refresh keeps university counts current: publish scripts
  // refuse the shared tags below (scripts/lib/trigger-revalidate), and the
  // "catalog" profile would otherwise hold stale counts for a year. Cost is
  // one small grouped query per day.
  cacheLife({ stale: 300, revalidate: 60 * 60 * 24 });
  // Shared tags only, matching getNavUniversitiesByCountry. Entity-scoped
  // `country:<slug>` tags are deliberately NOT attached: this entry feeds the
  // root layout, so tying it to every country publish would widen each
  // single-university publish into a site-wide refresh. Publish scripts refuse
  // shared tags, so counts refresh via the daily "nav" cacheLife instead.
  cacheTag("countries");
  cacheTag("universities");

  const db = getDb();
  if (!db) return [];

  // One statement: correlated subqueries resolve per country against the
  // universities(country_id, ...) index, so there is no per-country round trip
  // and no row fan-out from joining offerings into the outer query.
  const rows = await db
    .select({
      slug: countriesTable.slug,
      name: countriesTable.name,
      region: countriesTable.region,
      // Explicit aliases: inside a select, drizzle renders interpolated columns
      // without their table name, which makes "id"/"published" ambiguous.
      universityCount: sql<number>`(
        select count(*)::int
        from universities nav_u
        where nav_u.country_id = countries.id
          and nav_u.published = true
      )`.mapWith(Number),
      hasMedicine: sql<boolean>`exists (
        select 1
        from universities nav_u
        inner join program_offerings nav_po on nav_po.university_id = nav_u.id
        inner join courses nav_c on nav_c.id = nav_po.course_id
        where nav_u.country_id = countries.id
          and nav_u.published = true
          and nav_po.published = true
          and nav_c.stream = 'medicine'
      )`.mapWith(Boolean),
    })
    .from(countriesTable)
    .orderBy(asc(countriesTable.name));

  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    href: getCountryHref(r.slug),
    isoCode: getCountryFlagCode(r.slug),
    region: getNavRegionId(r.region),
    universityCount: r.universityCount,
    hasMedicine: r.hasMedicine,
  }));
}

// A region-grouped variant used to live here and was wired through the root
// layout into a context that nothing ever read. The header countries menu now
// groups this single payload on the client (components/site/countries-menu.tsx)
// rather than issuing a second query.
