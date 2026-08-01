import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { asc, eq, lte, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import {
  countries as countriesTable,
  universities as universitiesTable,
} from "@/lib/db/schema";
import { getUniversityHref } from "@/lib/routes";

export type NavUniversity = {
  slug: string;
  name: string;
  city: string;
  href: string;
};

export type NavUniversityCountryGroup = {
  countrySlug: string;
  countryName: string;
  href: string;
  universities: NavUniversity[];
};

// How many universities to surface per country before "View all in <country>"
// takes over. Kept small on purpose - this is a jump-to-a-college nav aid,
// not the /universities catalog.
const MAX_UNIVERSITIES_PER_COUNTRY = 5;

/**
 * One row per published university, grouped by country for the Universities
 * mega menu / mobile accordion.
 *
 * Every country with at least one published university gets a non-empty
 * group here - this used to filter on `featured = true` only, which left
 * countries with zero featured rows (Vietnam, Uzbekistan, Italy, Malta)
 * rendering an empty section in the menu. The fallback ranking below
 * (featured first, then name) means a country with no featured picks still
 * surfaces useful universities instead of nothing.
 *
 * No hard cap on the number of countries returned - the mega menu is
 * expected to hold up as the catalog grows to many more countries, so
 * trimming happens client-side (default visible count + search), not here.
 */
export async function getNavUniversitiesByCountry(): Promise<NavUniversityCountryGroup[]> {
  // Shared remote cache - see getNavCountries in ./nav-countries for why plain
  // `use cache` was not enough here.
  "use cache: remote";
  cacheLife("catalog");
  cacheTag("countries");
  cacheTag("universities");

  const db = getDb();
  if (!db) return [];

  // Rank inside SQL and keep only the rows the menu actually renders. This
  // previously selected every published university (~690 rows) and dropped all
  // but MAX_UNIVERSITIES_PER_COUNTRY per country in JS, so ~70% of every result
  // set was fetched only to be discarded.
  // Every column is aliased explicitly: countries and universities both have
  // `slug` and `name`, and an unaliased derived table would expose duplicates
  // that Postgres rejects as ambiguous (42702).
  const ranked = db
    .select({
      countrySlug: sql<string>`${countriesTable.slug}`.as("country_slug"),
      countryName: sql<string>`${countriesTable.name}`.as("country_name"),
      universitySlug: sql<string>`${universitiesTable.slug}`.as("university_slug"),
      universityName: sql<string>`${universitiesTable.name}`.as("university_name"),
      universityCity: sql<string>`${universitiesTable.city}`.as("university_city"),
      rank: sql<number>`row_number() over (
        partition by ${countriesTable.slug}
        order by ${universitiesTable.featured} desc, ${universitiesTable.name} asc
      )`.as("rank"),
    })
    .from(universitiesTable)
    .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
    .where(eq(universitiesTable.published, true))
    .as("ranked");

  const rows = await db
    .select({
      countrySlug: ranked.countrySlug,
      countryName: ranked.countryName,
      universitySlug: ranked.universitySlug,
      universityName: ranked.universityName,
      universityCity: ranked.universityCity,
    })
    .from(ranked)
    .where(lte(ranked.rank, MAX_UNIVERSITIES_PER_COUNTRY))
    .orderBy(asc(ranked.countryName), asc(ranked.rank));

  const groupsByCountry = new Map<string, NavUniversityCountryGroup>();

  for (const row of rows) {
    const navUniversity: NavUniversity = {
      slug: row.universitySlug,
      name: row.universityName,
      city: row.universityCity,
      href: getUniversityHref(row.universitySlug),
    };

    const existing = groupsByCountry.get(row.countrySlug);
    if (existing) {
      existing.universities.push(navUniversity);
    } else {
      groupsByCountry.set(row.countrySlug, {
        countrySlug: row.countrySlug,
        countryName: row.countryName,
        href: `/universities?country=${row.countrySlug}`,
        universities: [navUniversity],
      });
    }
  }

  return Array.from(groupsByCountry.values()).sort(
    (left, right) => left.countryName.localeCompare(right.countryName),
  );
}
