import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { asc } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { countries as countriesTable } from "@/lib/db/schema";
import { getCountryFlagCode } from "@/lib/university-media";
import { getCountryHref } from "@/lib/routes";

export type NavCountry = {
  slug: string;
  name: string;
  href: string;
  isoCode: string;
  description: string;
};

export type NavCountryRegionGroup = {
  region: string;
  countries: NavCountry[];
};

// Re-exported for backwards compatibility with existing server-side importers.
// Client Components should import this directly from "@/lib/data/nav-constants"
// instead, since this file also contains "use cache" functions that must never
// be bundled into client code.
export { FEATURED_NAV_COUNTRY_SLUG } from "@/lib/data/nav-constants";

// Nav descriptions are derived from each country's DB `summary` (first
// sentence, trimmed) rather than a hand-maintained map. A hardcoded
// slug -> copy table silently degrades every country that isn't added to it
// (this covered 6 of 11 countries before), which only gets worse as the
// catalog grows toward many more countries. Deriving from live data means
// every country - present and future - gets an accurate, non-empty
// description with zero manual upkeep.
function deriveDescription(summary: string): string {
  const first = summary.split(/[.!?]/)[0]?.trim() ?? summary;
  return first.length > 84 ? first.slice(0, 81) + "…" : first;
}

export async function getNavCountries(): Promise<NavCountry[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("countries");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      slug: countriesTable.slug,
      name: countriesTable.name,
      summary: countriesTable.summary,
    })
    .from(countriesTable)
    .orderBy(asc(countriesTable.name));

  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    href: getCountryHref(r.slug),
    isoCode: getCountryFlagCode(r.slug),
    description: deriveDescription(r.summary),
  }));
}

export async function getNavCountriesByRegion(): Promise<NavCountryRegionGroup[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag("countries");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      slug: countriesTable.slug,
      name: countriesTable.name,
      summary: countriesTable.summary,
      region: countriesTable.region,
    })
    .from(countriesTable)
    .orderBy(asc(countriesTable.region), asc(countriesTable.name));

  const groupsByRegion = new Map<string, NavCountry[]>();

  for (const row of rows) {
    const navCountry: NavCountry = {
      slug: row.slug,
      name: row.name,
      href: getCountryHref(row.slug),
      isoCode: getCountryFlagCode(row.slug),
      description: deriveDescription(row.summary),
    };

    const existing = groupsByRegion.get(row.region);
    if (existing) {
      existing.push(navCountry);
    } else {
      groupsByRegion.set(row.region, [navCountry]);
    }
  }

  return Array.from(groupsByRegion.entries())
    .map(([region, countries]) => ({ region, countries }))
    .sort((left, right) => left.region.localeCompare(right.region));
}
