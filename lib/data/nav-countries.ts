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
