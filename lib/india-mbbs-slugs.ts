import { createSlug } from "@/lib/utils";

type BuildIndiaCollegeSlugInput = {
  collegeName: string;
  cityName?: string;
  stateName?: string;
  collegeCode?: string;
  existingSlugs?: Set<string>;
};

function normalizeSegment(value?: string) {
  if (!value) {
    return "";
  }

  return value
    .replace(/\([^)]*\)/g, " ")
    .replace(/\bformerly known as\b.*$/i, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsWholeWord(haystack: string, needle: string) {
  const normalizedHaystack = createSlug(haystack);
  const normalizedNeedle = createSlug(needle);

  if (!normalizedNeedle) {
    return false;
  }

  return normalizedHaystack
    .split("-")
    .join(" ")
    .includes(normalizedNeedle.split("-").join(" "));
}

function uniqueSlug(candidates: string[], existingSlugs?: Set<string>) {
  const seen = existingSlugs ?? new Set<string>();

  for (const candidate of candidates) {
    const slug = createSlug(candidate);
    if (slug && !seen.has(slug)) {
      return slug;
    }
  }

  return createSlug(candidates.at(-1) ?? "");
}

export function buildIndiaCollegeSlug(input: BuildIndiaCollegeSlugInput) {
  const collegeName = normalizeSegment(input.collegeName);
  const cityName = normalizeSegment(input.cityName);
  const stateName = normalizeSegment(input.stateName);
  const collegeCode = normalizeSegment(input.collegeCode);

  const includeCity = cityName && !containsWholeWord(collegeName, cityName);
  const withCity = includeCity ? `${collegeName} ${cityName}` : collegeName;
  const includeState =
    stateName &&
    !containsWholeWord(withCity, stateName) &&
    (!cityName || !containsWholeWord(cityName, stateName));
  const withState = includeState ? `${withCity} ${stateName}` : withCity;

  return uniqueSlug(
    [
      collegeName,
      withCity,
      withState,
      collegeCode ? `${withState} ${collegeCode}` : withState,
    ],
    input.existingSlugs,
  );
}

export function buildIndiaProgramSlug(
  collegeSlug: string,
  courseName: string,
  existingSlugs?: Set<string>,
) {
  return uniqueSlug(
    [`${collegeSlug} ${courseName}`, `${collegeSlug} ${courseName} program`],
    existingSlugs,
  );
}
