import "server-only";

import { and, count, eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { cityProfiles, universities, countries } from "@/lib/db/schema";

export type SharedCityProfile = {
  city: string;
  countrySlug: string;
  summary: string;
  universityCount: number;
  relatedUniversitySlugs: string[];
};

function normalizeCity(value: string) {
  return value.trim().toLowerCase();
}

export async function getSharedCityProfile(
  countrySlug: string,
  city: string,
): Promise<SharedCityProfile | null> {
  const db = getDb();
  if (!db) return null;

  const [profileRow, universityRows] = await Promise.all([
    db
      .select({ content: cityProfiles.content })
      .from(cityProfiles)
      .where(
        and(
          eq(cityProfiles.countrySlug, countrySlug),
          sql`lower(${cityProfiles.city}) = ${normalizeCity(city)}`
        )
      )
      .limit(1),
    db
      .select({ slug: universities.slug })
      .from(universities)
      .innerJoin(countries, eq(countries.id, universities.countryId))
      .where(
        and(
          eq(countries.slug, countrySlug),
          sql`lower(${universities.city}) = ${normalizeCity(city)}`,
          eq(universities.published, true)
        )
      ),
  ]);

  if (!profileRow[0]) return null;

  const universityCount = universityRows.length;
  const sharedTail =
    universityCount > 1
      ? ` ${city} currently has ${universityCount} listed universities in this catalog, so students comparing this city can focus on academic structure, institution type, and campus fit without relearning the same city context on every page.`
      : "";

  return {
    city,
    countrySlug,
    summary: `${profileRow[0].content}${sharedTail}`,
    universityCount,
    relatedUniversitySlugs: universityRows.map((u) => u.slug),
  };
}
