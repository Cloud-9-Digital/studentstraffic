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

// Short nav descriptions keyed by slug; new countries fall back to first
// sentence of their DB summary — no manual update needed.
const NAV_DESCRIPTIONS: Record<string, string> = {
  russia:     "Established NMC pathways, top public universities",
  vietnam:    "Affordable fees, growing English-medium options",
  georgia:    "WHO & NMC recognised, European standard",
  kyrgyzstan: "Low cost of living, NMC eligible programs",
  uzbekistan: "English medium programs, highly affordable",
  italy:      "IMAT-based admission, WHO & NMC recognised",
};

function deriveDescription(slug: string, summary: string): string {
  if (NAV_DESCRIPTIONS[slug]) return NAV_DESCRIPTIONS[slug];
  const first = summary.split(/[.!?]/)[0]?.trim() ?? summary;
  return first.length > 70 ? first.slice(0, 67) + "…" : first;
}

export async function getNavCountries(): Promise<NavCountry[]> {
  "use cache";
  cacheLife("hours");
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
    description: deriveDescription(r.slug, r.summary),
  }));
}

export async function getNavCountriesByRegion(): Promise<NavCountryRegionGroup[]> {
  "use cache";
  cacheLife("hours");
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
      description: deriveDescription(row.slug, row.summary),
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
