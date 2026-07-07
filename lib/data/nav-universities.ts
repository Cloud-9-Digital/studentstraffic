import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { and, asc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { countries as countriesTable, universities as universitiesTable } from "@/lib/db/schema";
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
  totalFeaturedCount: number;
};

// Cap on how many country columns the universities mega menu renders, and how
// many featured universities are shown per column before "View all" kicks in.
const MAX_COUNTRY_COLUMNS = 8;
const MAX_UNIVERSITIES_PER_COLUMN = 6;

export async function getNavUniversitiesByCountry(): Promise<NavUniversityCountryGroup[]> {
  "use cache";
  cacheLife("hours");
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
    })
    .from(universitiesTable)
    .innerJoin(countriesTable, eq(universitiesTable.countryId, countriesTable.id))
    .where(and(eq(universitiesTable.featured, true), eq(universitiesTable.published, true)))
    .orderBy(asc(countriesTable.name), asc(universitiesTable.name));

  const groupsByCountry = new Map<string, NavUniversityCountryGroup>();

  for (const row of rows) {
    const existing = groupsByCountry.get(row.countrySlug);
    const navUniversity: NavUniversity = {
      slug: row.universitySlug,
      name: row.universityName,
      city: row.universityCity,
      href: getUniversityHref(row.universitySlug),
    };

    if (existing) {
      existing.totalFeaturedCount += 1;
      if (existing.universities.length < MAX_UNIVERSITIES_PER_COLUMN) {
        existing.universities.push(navUniversity);
      }
    } else {
      groupsByCountry.set(row.countrySlug, {
        countrySlug: row.countrySlug,
        countryName: row.countryName,
        href: `/universities?country=${row.countrySlug}`,
        universities: [navUniversity],
        totalFeaturedCount: 1,
      });
    }
  }

  return Array.from(groupsByCountry.values())
    .sort((left, right) => right.totalFeaturedCount - left.totalFeaturedCount)
    .slice(0, MAX_COUNTRY_COLUMNS);
}
