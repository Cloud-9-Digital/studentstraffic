import "server-only";

import type { University } from "@/lib/data/types";

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

export function getSharedCityProfile(
  universities: University[],
  countrySlug: string,
  city: string,
): SharedCityProfile | null {
  const sameCityUniversities = universities
    .filter(
      (university) =>
        university.countrySlug === countrySlug &&
        normalizeCity(university.city) === normalizeCity(city),
    )
    .sort((left, right) => {
      if (left.featured !== right.featured) {
        return Number(right.featured) - Number(left.featured);
      }

      if (left.establishedYear !== right.establishedYear) {
        return right.establishedYear - left.establishedYear;
      }

      return left.name.localeCompare(right.name);
    });

  if (sameCityUniversities.length === 0) {
    return null;
  }

  const leadUniversity = sameCityUniversities[0];
  const universityCount = sameCityUniversities.length;
  const sharedTail =
    universityCount > 1
      ? ` ${city} currently has ${universityCount} listed universities in this catalog, so students comparing this city can focus on academic structure, institution type, and campus fit without relearning the same city context on every page.`
      : "";

  return {
    city,
    countrySlug,
    summary: `${leadUniversity.cityProfile}${sharedTail}`,
    universityCount,
    relatedUniversitySlugs: sameCityUniversities.map((university) => university.slug),
  };
}
