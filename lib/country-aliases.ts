/**
 * Everyday names for catalogue countries, keyed by normalised phrase
 * (lowercase, punctuation collapsed to single spaces) and mapped to the
 * country slug written with spaces ("united-kingdom" -> "united kingdom").
 *
 * Used by site search ranking (lib/search/ranking.ts). Deliberately free of
 * any server or database import so Client Components can use it.
 *
 * Bare "us" is deliberately absent: it is an ordinary word ("contact us",
 * "why choose us"). "u.s." normalises to "u s".
 */
export const COUNTRY_ALIASES: Readonly<Record<string, string>> = {
  uk: "united kingdom",
  britain: "united kingdom",
  "great britain": "united kingdom",
  england: "united kingdom",
  scotland: "united kingdom",
  wales: "united kingdom",
  usa: "united states",
  "u s": "united states",
  "u s a": "united states",
  america: "united states",
  "united states of america": "united states",
  uae: "united arab emirates",
  holland: "netherlands",
  korea: "south korea",
  czechia: "czech republic",
  bosnia: "bosnia and herzegovina",
  macedonia: "north macedonia",
  nz: "new zealand",
};
