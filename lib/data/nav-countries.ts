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
  // `use cache: remote` (not plain `use cache`) because this runs in the root
  // layout on every render. Plain `use cache` is an in-memory LRU that does not
  // persist across serverless instances, so every new Vercel instance re-ran
  // this query - ~81k executions per 12 days, which kept the Neon compute from
  // ever scaling to zero. The remote handler is shared across all instances.
  "use cache: remote";
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

// A region-grouped variant used to live here and was wired through the root
// layout into a context that nothing ever read. It cost one catalog query per
// render and serialized a second copy of every country into each page's RSC
// payload (RSC dedupes by object reference, and these were distinct objects).
// If a region-grouped menu is needed again, group `getNavCountries()` on the
// client rather than issuing a second query.
