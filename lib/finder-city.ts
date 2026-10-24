import { sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

export function normalizeFinderCity(city: string) {
  return city.trim().replace(/\s+/g, " ").toLowerCase();
}

export function matchesFinderCity(city: string, selectedCity: string) {
  return normalizeFinderCity(city) === normalizeFinderCity(selectedCity);
}

/** Match the normalized cache key against the display-cased city in storage. */
export function finderCityCondition(column: AnyPgColumn, selectedCity: string) {
  return sql`lower(trim(regexp_replace(${column}, ${"[[:space:]]+"}, ${" "}, ${"g"}))) = ${normalizeFinderCity(selectedCity)}`;
}
