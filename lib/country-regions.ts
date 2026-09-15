/**
 * Display regions for country navigation (header countries menu).
 *
 * `countries.region` in the database is free text written by content seeding
 * and has drifted into many near-duplicates ("Southeast Europe", "Central
 * Asia", "Caribbean", ...). The menu needs a small, stable set of buckets, so
 * this pure mapper folds every stored value into one of them.
 *
 * Editorial choice: "Caucasus" maps to Europe. Georgia, Armenia and
 * Azerbaijan are marketed alongside European MBBS destinations, and the
 * database already stores Georgia as "Eastern Europe" and Azerbaijan as
 * "Europe", so this keeps the three together.
 *
 * Unknown values are never dropped: keyword heuristics place them in the
 * closest bucket, and anything still unmatched lands in "other", which the
 * menu only renders when it is non-empty.
 */

export const NAV_REGIONS = [
  { id: "europe", label: "Europe" },
  { id: "asia", label: "Asia" },
  { id: "africa", label: "Africa" },
  { id: "americas", label: "Americas" },
  { id: "middle-east-oceania", label: "Middle East & Oceania" },
  { id: "other", label: "Other destinations" },
] as const;

export type NavRegionId = (typeof NAV_REGIONS)[number]["id"];

const EXACT_REGION_IDS: Readonly<Record<string, NavRegionId>> = {
  europe: "europe",
  "eastern europe": "europe",
  "western europe": "europe",
  "northern europe": "europe",
  "southern europe": "europe",
  "southeast europe": "europe",
  "south east europe": "europe",
  "central europe": "europe",
  caucasus: "europe",
  asia: "asia",
  "east asia": "asia",
  "southeast asia": "asia",
  "south east asia": "asia",
  "south asia": "asia",
  "central asia": "asia",
  africa: "africa",
  "north africa": "africa",
  "west africa": "africa",
  "east africa": "africa",
  "southern africa": "africa",
  "sub saharan africa": "africa",
  "north america": "americas",
  "south america": "americas",
  "central america": "americas",
  "latin america": "americas",
  caribbean: "americas",
  americas: "americas",
  "middle east": "middle-east-oceania",
  oceania: "middle-east-oceania",
};

// Checked in order: "middle east" before "asia" so "West Asia / Middle East"
// lands with the Gulf, and "europe" before "asia" for "Eurasia"-style labels
// that also name Europe.
const REGION_KEYWORDS: ReadonlyArray<readonly [RegExp, NavRegionId]> = [
  [/\b(middle east|gulf|arab|levant)\b/, "middle-east-oceania"],
  [/\b(oceania|pacific|australasia|melanesia|polynesia|micronesia)\b/, "middle-east-oceania"],
  [/\b(europe|caucasus|balkans?|baltics?|nordic|scandinavia)\b/, "europe"],
  [/\bafrica\b/, "africa"],
  [/\b(americas?|caribbean)\b/, "americas"],
  [/\basia\b/, "asia"],
];

function normalizeRegionLabel(value: string) {
  return value.toLowerCase().replace(/[^a-z]+/g, " ").trim();
}

export function getNavRegionId(region: string | null | undefined): NavRegionId {
  if (!region) return "other";
  const key = normalizeRegionLabel(region);
  const exact = EXACT_REGION_IDS[key];
  if (exact) return exact;

  for (const [pattern, id] of REGION_KEYWORDS) {
    if (pattern.test(key)) return id;
  }
  return "other";
}
