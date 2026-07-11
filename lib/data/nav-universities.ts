import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";

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
  "use cache";
  cacheLife("catalog");
  cacheTag("countries");
  cacheTag("universities");

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({
      countrySlug: countriesTable.slug,
      countryName: countriesTable.name,
      universitySlug: universitiesTable.slug,
      universityName: universitiesTable.name,
      universityCity: universitiesTable.city,
      featured: universitiesTable.featured,
    })
    .from(universitiesTable)
    .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
    .where(eq(universitiesTable.published, true))
    .orderBy(
      asc(countriesTable.name),
      desc(universitiesTable.featured),
      asc(universitiesTable.name),
    );

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
      if (existing.universities.length < MAX_UNIVERSITIES_PER_COUNTRY) {
        existing.universities.push(navUniversity);
      }
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
