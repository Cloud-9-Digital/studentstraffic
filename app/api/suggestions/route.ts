import { NextRequest, NextResponse } from "next/server";

import {
  getAllLandingPages,
  getCountries,
  getCourses,
  getUniversities,
} from "@/lib/data/catalog";
import { getCountryHref, getCourseHref, getUniversityHref } from "@/lib/routes";

export type Suggestion = {
  type: "university" | "country" | "course" | "landing_page";
  label: string;
  subtitle: string;
  href: string;
};

type RankedSuggestion = Suggestion & {
  score: number;
  directLabelTier: number;
  labelCoverage: number;
  subtitleCoverage: number;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTokenCoverage(tokens: string[], haystack: string) {
  if (!tokens.length) {
    return 0;
  }

  let matched = 0;

  for (const token of tokens) {
    if (haystack.includes(token)) {
      matched += 1;
    }
  }

  return matched / tokens.length;
}

function getSuggestionSignals(query: string, label: string, subtitle: string) {
  const normalizedQuery = normalize(query);
  const normalizedLabel = normalize(label);
  const normalizedSubtitle = normalize(subtitle);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  let score = 0;
  let directLabelTier = 0;

  if (normalizedLabel === normalizedQuery) {
    directLabelTier = 4;
    score += 80;
  } else if (normalizedLabel.startsWith(normalizedQuery)) {
    directLabelTier = 3;
    score += 55;
  } else if (normalizedLabel.includes(normalizedQuery)) {
    directLabelTier = 3;
    score += 42;
  } else if (normalizedSubtitle.includes(normalizedQuery)) {
    directLabelTier = 2;
    score += 12;
  }

  const labelCoverage = getTokenCoverage(tokens, normalizedLabel);
  const subtitleCoverage = getTokenCoverage(tokens, normalizedSubtitle);

  if (labelCoverage === 1) {
    score += 18;
  } else if (labelCoverage >= 0.75) {
    score += 8;
  }

  if (subtitleCoverage === 1) {
    score += 4;
  }

  return {
    score,
    directLabelTier,
    labelCoverage,
    subtitleCoverage,
  };
}

function getTypeRank(type: Suggestion["type"]) {
  switch (type) {
    case "university":
      return 0;
    case "landing_page":
      return 1;
    case "country":
      return 2;
    case "course":
      return 3;
    default:
      return 4;
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json<Suggestion[]>([]);
  }

  const [countries, courses, universities, landingPages] = await Promise.all([
    getCountries(),
    getCourses(),
    getUniversities(),
    getAllLandingPages(),
  ]);

  const countryMap = new Map(countries.map((country) => [country.slug, country.name]));
  const rankedResults: RankedSuggestion[] = [];

  for (const university of universities) {
    const countryName = countryMap.get(university.countrySlug) ?? "";
    const subtitle = `${university.city}${countryName ? `, ${countryName}` : ""}`;
    const primarySignals = getSuggestionSignals(q, university.name, subtitle);
    const secondarySignals = getSuggestionSignals(q, university.city, university.name);
    const strongestSignals =
      primarySignals.score >= secondarySignals.score ? primarySignals : secondarySignals;
    const score = Math.max(
      primarySignals.score,
      secondarySignals.score,
    );

    if (score > 0) {
      rankedResults.push({
        type: "university",
        label: university.name,
        subtitle,
        href: getUniversityHref(university.slug),
        score: score + 10,
        directLabelTier: strongestSignals.directLabelTier,
        labelCoverage: strongestSignals.labelCoverage,
        subtitleCoverage: strongestSignals.subtitleCoverage,
      });
    }
  }

  for (const country of countries) {
    const label = `Study in ${country.name}`;
    const primarySignals = getSuggestionSignals(q, label, country.region);
    const secondarySignals = getSuggestionSignals(q, country.name, country.region);
    const strongestSignals =
      primarySignals.score >= secondarySignals.score ? primarySignals : secondarySignals;
    const score = Math.max(
      primarySignals.score,
      secondarySignals.score,
    );

    if (score > 0) {
      rankedResults.push({
        type: "country",
        label,
        subtitle: country.region,
        href: getCountryHref(country.slug),
        score,
        directLabelTier: strongestSignals.directLabelTier,
        labelCoverage: strongestSignals.labelCoverage,
        subtitleCoverage: strongestSignals.subtitleCoverage,
      });
    }
  }

  for (const course of courses) {
    const primarySignals = getSuggestionSignals(q, course.shortName, course.name);
    const secondarySignals = getSuggestionSignals(q, course.name, course.shortName);
    const strongestSignals =
      primarySignals.score >= secondarySignals.score ? primarySignals : secondarySignals;
    const score = Math.max(
      primarySignals.score,
      secondarySignals.score,
    );

    if (score > 0) {
      rankedResults.push({
        type: "course",
        label: course.shortName,
        subtitle: course.name,
        href: getCourseHref(course.slug),
        score,
        directLabelTier: strongestSignals.directLabelTier,
        labelCoverage: strongestSignals.labelCoverage,
        subtitleCoverage: strongestSignals.subtitleCoverage,
      });
    }
  }

  for (const landingPage of landingPages) {
    const signals = getSuggestionSignals(q, landingPage.title, landingPage.kicker);
    const score = signals.score - 4;

    if (score > 0) {
      rankedResults.push({
        type: "landing_page",
        label: landingPage.title,
        subtitle: "Curated guide",
        href: `/${landingPage.slug}`,
        score,
        directLabelTier: signals.directLabelTier,
        labelCoverage: signals.labelCoverage,
        subtitleCoverage: signals.subtitleCoverage,
      });
    }
  }

  const hasStrongUniversityMatch = rankedResults.some(
    (result) =>
      result.type === "university" &&
      (result.directLabelTier >= 3 || result.labelCoverage === 1),
  );

  const filteredResults = hasStrongUniversityMatch
    ? rankedResults.filter((result) => {
        switch (result.type) {
          case "university":
            return result.directLabelTier >= 2 || result.labelCoverage >= 0.75;
          case "landing_page":
          case "country":
          case "course":
            return result.directLabelTier >= 2 || result.labelCoverage === 1;
          default:
            return true;
        }
      })
    : rankedResults;

  return NextResponse.json<Suggestion[]>(
    filteredResults
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        if (getTypeRank(left.type) !== getTypeRank(right.type)) {
          return getTypeRank(left.type) - getTypeRank(right.type);
        }

        return left.label.localeCompare(right.label);
      })
      .slice(0, 8)
      .map(
        ({
          score: _score,
          directLabelTier: _directLabelTier,
          labelCoverage: _labelCoverage,
          subtitleCoverage: _subtitleCoverage,
          ...suggestion
        }) => suggestion,
      ),
  );
}
