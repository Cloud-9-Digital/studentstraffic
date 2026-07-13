import { NextRequest, NextResponse } from "next/server";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, eq, ilike, or } from "drizzle-orm";

import { getAllLandingPages } from "@/lib/data/catalog";
import { getDb } from "@/lib/db/server";
import {
  countries as countriesTable,
  courses as coursesTable,
  indiaMedicalColleges,
  indiaMedicalPrograms,
  universities as universitiesTable,
} from "@/lib/db/schema";
import { logPublicRouteRequest } from "@/lib/route-observability";
import {
  getCountryHref,
  getCourseHref,
  getUniversityHref,
} from "@/lib/routes";

export type Suggestion = {
  type: "university" | "india_college" | "country" | "course" | "landing_page";
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

type SuggestionSource = {
  countries: Array<{ slug: string; name: string; region: string }>;
  courses: Array<{ slug: string; name: string; shortName: string }>;
  universities: Array<{
    slug: string;
    name: string;
    city: string;
    countryName: string;
  }>;
  indiaColleges: Array<{
    slug: string;
    collegeName: string;
    programName: string;
    stateName: string;
    cityName: string | null;
    universityName: string | null;
  }>;
  landingPages: Awaited<ReturnType<typeof getAllLandingPages>>;
};

function dedupeIndiaColleges(
  colleges: SuggestionSource["indiaColleges"],
) {
  const uniqueBySlug = new Map<string, (typeof colleges)[number]>();

  for (const college of colleges) {
    const existing = uniqueBySlug.get(college.slug);

    if (!existing) {
      uniqueBySlug.set(college.slug, college);
      continue;
    }

    if (existing.programName !== "MBBS" && college.programName === "MBBS") {
      uniqueBySlug.set(college.slug, college);
    }
  }

  return [...uniqueBySlug.values()];
}

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
    case "india_college":
      return 1;
    case "landing_page":
      return 2;
    case "country":
      return 3;
    case "course":
      return 4;
    default:
      return 5;
  }
}

async function getSuggestionSource(query: string): Promise<SuggestionSource> {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");
  cacheTag("finder");
  cacheTag("suggestions");

  const landingPages = await getAllLandingPages();
  const db = getDb();

  if (!db) {
    return {
      countries: [],
      courses: [],
      universities: [],
      indiaColleges: [],
      landingPages,
    };
  }

  const pattern = `%${query}%`;
  const [countries, courses, universities, indiaCollegeRows] = await Promise.all([
    db
      .select({
        slug: countriesTable.slug,
        name: countriesTable.name,
        region: countriesTable.region,
      })
      .from(countriesTable)
      .where(
        or(
          ilike(countriesTable.name, pattern),
          ilike(countriesTable.region, pattern),
        ),
      )
      .orderBy(asc(countriesTable.name))
      .limit(12),
    db
      .select({
        slug: coursesTable.slug,
        name: coursesTable.name,
        shortName: coursesTable.shortName,
      })
      .from(coursesTable)
      .where(
        and(
          eq(coursesTable.active, true),
          or(
            ilike(coursesTable.name, pattern),
            ilike(coursesTable.shortName, pattern),
          ),
        ),
      )
      .orderBy(asc(coursesTable.name))
      .limit(20),
    db
      .select({
        slug: universitiesTable.slug,
        name: universitiesTable.name,
        city: universitiesTable.city,
        countryName: countriesTable.name,
      })
      .from(universitiesTable)
      .innerJoin(
        countriesTable,
        eq(universitiesTable.countryId, countriesTable.id),
      )
      .where(
        and(
          eq(universitiesTable.published, true),
          or(
            ilike(universitiesTable.name, pattern),
            ilike(universitiesTable.city, pattern),
            ilike(countriesTable.name, pattern),
          ),
        ),
      )
      .orderBy(asc(universitiesTable.name))
      .limit(40),
    db
      .select({
        slug: indiaMedicalColleges.slug,
        collegeName: indiaMedicalColleges.collegeName,
        programName: indiaMedicalPrograms.courseName,
        stateName: indiaMedicalColleges.stateName,
        cityName: indiaMedicalColleges.cityName,
        universityName: indiaMedicalColleges.universityName,
      })
      .from(indiaMedicalColleges)
      .innerJoin(
        indiaMedicalPrograms,
        eq(indiaMedicalPrograms.collegeId, indiaMedicalColleges.id),
      )
      .where(
        or(
          ilike(indiaMedicalColleges.collegeName, pattern),
          ilike(indiaMedicalColleges.cityName, pattern),
          ilike(indiaMedicalColleges.stateName, pattern),
          ilike(indiaMedicalColleges.universityName, pattern),
          ilike(indiaMedicalPrograms.courseName, pattern),
        ),
      )
      .orderBy(asc(indiaMedicalColleges.collegeName))
      .limit(40),
  ]);

  return {
    countries,
    courses,
    universities,
    indiaColleges: dedupeIndiaColleges(indiaCollegeRows),
    landingPages,
  };
}

export async function GET(req: NextRequest) {
  logPublicRouteRequest({
    route: "api/suggestions",
    request: req,
    sampleRate: 0.05,
  });

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json<Suggestion[]>([]);
  }

  const { countries, courses, universities, indiaColleges, landingPages } =
    await getSuggestionSource(q);

  const rankedResults: RankedSuggestion[] = [];

  for (const university of universities) {
    const subtitle = `${university.city}, ${university.countryName}`;
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

  for (const college of indiaColleges) {
    const subtitle = college.cityName
      ? `${college.cityName}, ${college.stateName}`
      : college.stateName;
    const primarySignals = getSuggestionSignals(q, college.collegeName, subtitle);
    const secondarySignals = getSuggestionSignals(
      q,
      college.universityName ?? college.stateName,
      `${college.collegeName} ${college.programName}`,
    );
    const strongestSignals =
      primarySignals.score >= secondarySignals.score ? primarySignals : secondarySignals;
    const score = Math.max(primarySignals.score, secondarySignals.score);

    if (score > 0) {
      rankedResults.push({
        type: "india_college",
        label: college.collegeName,
        subtitle,
        href: `/india-mbbs-colleges?q=${encodeURIComponent(college.collegeName)}`,
        score: score + 8,
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
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}
