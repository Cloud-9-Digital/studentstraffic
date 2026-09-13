// Pure ranking model for site search. Deliberately free of `server-only`,
// Next.js and database imports so the ranking rules can be unit tested with
// fixture documents. `search.ts` owns execution; this module owns relevance.
import { sql, type SQL } from "drizzle-orm";

import type { SearchDocument, SearchDocumentType, SearchResult } from "@/lib/data/types";

/**
 * A search result plus the two ranking inputs derived from `search_text`.
 * SQL computes them next to the row so the (often multi-KB) search text never
 * leaves the database; they are stripped before results reach the page.
 */
export type RankableSearchResult = SearchResult & {
  /** Character length of the document's search_text. */
  searchTextLength: number;
  /** Share (0-1) of required query terms found as substrings of lower(search_text). */
  searchTextCoverage: number;
};

/**
 * Words that describe what the searcher wants to know about an entity rather
 * than which entity they want ("mbbs georgia fees", "study in canada"). They
 * add score when present but are never required to match, so a strong page
 * that says "fee" instead of "fees" is not dropped from the candidate set.
 */
const OPTIONAL_QUERY_TERMS = new Set([
  "a",
  "an",
  "and",
  "at",
  "for",
  "from",
  "in",
  "of",
  "on",
  "the",
  "to",
  "vs",
  "with",
  "fee",
  "fees",
  "cost",
  "costs",
  "tuition",
  "price",
  "prices",
  "budget",
  "best",
  "top",
  "cheap",
  "cheapest",
  "low",
  "lowest",
  "list",
  "study",
  "abroad",
]);

const MEDICAL_INTENT_TERMS = new Set(["mbbs", "md", "medicine", "medical", "doctor"]);
const MEDICAL_TITLE_TERMS = new Set([
  "medical",
  "medicine",
  "medico",
  "medicina",
  "mbbs",
  "md",
  "health",
]);

const MAX_QUERY_TERMS = 8;
const MIN_PREFIX_TERM_LENGTH = 4;
export const MAX_PROGRAMS_PER_UNIVERSITY = 3;

const BM25_FIELDS = ["title", "subtitle", "summary", "search_text"] as const;
const BM25_FUZZY_FIELDS = ["title", "subtitle"] as const;
const BM25_PREFIX_FIELDS = ["title", "search_text"] as const;
const BM25_PHRASE_FIELDS = ["title", "search_text"] as const;

export type SearchQueryAnalysis = {
  /** Normalised query, tokens joined by single spaces. */
  normalized: string;
  /** Query tokens in order (capped), used for title-shape comparisons. */
  tokens: string[];
  /** Distinct query tokens. */
  terms: string[];
  /** Terms every candidate must match (exactly, by typo or by prefix). */
  coreTerms: string[];
  /** Terms that only contribute score. */
  optionalTerms: string[];
  medicalIntent: boolean;
};

/** Lowercases, strips diacritics and collapses everything but letters/digits. */
export function normalizeSearchValue(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function analyzeSearchQuery(query: string): SearchQueryAnalysis {
  const normalized = normalizeSearchValue(query);
  const tokens = normalized.split(" ").filter(Boolean).slice(0, MAX_QUERY_TERMS);
  const terms = [...new Set(tokens)];
  const nonOptionalTerms = terms.filter((term) => !OPTIONAL_QUERY_TERMS.has(term));
  // A query made only of optional words ("fees") still has to match something.
  const coreTerms = nonOptionalTerms.length ? nonOptionalTerms : terms;
  const optionalTerms = terms.filter((term) => !coreTerms.includes(term));

  return {
    normalized: tokens.join(" "),
    tokens,
    terms,
    coreTerms,
    optionalTerms,
    medicalIntent: terms.some((term) => MEDICAL_INTENT_TERMS.has(term)),
  };
}

/**
 * Typo budget per term, mirrored by the BM25 query and the rerank so both
 * stages agree on what counts as a match. Short terms (acronyms such as
 * "kiit", "lpu", "mba") must match exactly.
 */
export function getFuzzyDistance(term: string) {
  if (term.length <= 4) return 0;
  if (term.length <= 7) return 1;
  return 2;
}

/** Optimal string alignment distance (Levenshtein plus adjacent transpositions). */
export function getEditDistance(left: string, right: string) {
  let beforePrevious: number[] = [];
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];

    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      let value = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);

      if (i > 1 && j > 1 && left[i - 1] === right[j - 2] && left[i - 2] === right[j - 1]) {
        value = Math.min(value, beforePrevious[j - 2] + 1);
      }

      current[j] = value;
    }

    beforePrevious = previous;
    previous = current;
  }

  return previous[right.length];
}

type TermMatch = "exact" | "prefix" | "fuzzy";

function matchTerm(term: string, token: string, allowPrefix: boolean): TermMatch | null {
  if (term === token) return "exact";

  if (allowPrefix && term.length >= MIN_PREFIX_TERM_LENGTH && token.startsWith(term)) {
    return "prefix";
  }

  const maxDistance = getFuzzyDistance(term);

  if (
    maxDistance > 0 &&
    Math.abs(term.length - token.length) <= maxDistance &&
    getEditDistance(term, token) <= maxDistance
  ) {
    return "fuzzy";
  }

  return null;
}

function matchTermInTokens(term: string, tokens: string[], allowPrefix: boolean) {
  let best: TermMatch | null = null;

  for (const token of tokens) {
    const match = matchTerm(term, token, allowPrefix);

    if (match === "exact") return match;
    best ??= match;
  }

  return best;
}

function getTokenCoverage(analysis: SearchQueryAnalysis, tokens: string[]) {
  const { terms } = analysis;

  if (!terms.length || !tokens.length) return 0;

  const lastTerm = analysis.tokens.at(-1);
  let matched = 0;

  for (const term of terms) {
    if (matchTermInTokens(term, tokens, term === lastTerm)) {
      matched += 1;
    }
  }

  return matched / terms.length;
}

/** True when the title is the query, allowing per-term typos ("univercity of copenhagen"). */
function isTypoTolerantTitleMatch(analysis: SearchQueryAnalysis, titleTokens: string[]) {
  const { tokens } = analysis;

  if (!tokens.length || tokens.length !== titleTokens.length) return false;

  return tokens.every((term, index) =>
    Boolean(matchTerm(term, titleTokens[index], index === tokens.length - 1)),
  );
}

/** JS mirror of buildSearchTextCoverageSql, for documents already in memory. */
export function getSearchTextCoverage(terms: string[], searchText: string) {
  if (!terms.length) return 0;

  const haystack = searchText.toLowerCase();

  return terms.filter((term) => haystack.includes(term)).length / terms.length;
}

/**
 * SQL for the share of `terms` found in an already-lowercased search text, so
 * the rerank can use document coverage without transferring search_text.
 */
export function buildSearchTextCoverageSql(loweredSearchText: SQL, terms: string[]): SQL {
  if (!terms.length) return sql`0::float`;

  const hits = terms.map(
    (term) => sql`CASE WHEN strpos(${loweredSearchText}, ${term}) > 0 THEN 1 ELSE 0 END`,
  );

  return sql`((${sql.join(hits, sql` + `)})::float / ${sql.raw(String(terms.length))})`;
}

/** Converts an in-memory document into a rank input, dropping search_text. */
export function toRankableSearchResult(
  { searchText, ...document }: SearchDocument & { id: number; score: number },
  query: string | undefined,
): RankableSearchResult {
  return {
    ...document,
    searchTextLength: searchText.length,
    searchTextCoverage: query
      ? getSearchTextCoverage(analyzeSearchQuery(query).coreTerms, searchText)
      : 0,
  };
}

function toSearchResult(candidate: RankableSearchResult): SearchResult {
  const result: SearchResult & Partial<RankableSearchResult> = { ...candidate };

  delete result.searchTextLength;
  delete result.searchTextCoverage;

  return result;
}

/** Country hub name as query terms: "united-kingdom" -> "united kingdom". */
export function getCountryHubQueryName(countrySlug: string) {
  return analyzeSearchQuery(countrySlug).coreTerms.join(" ");
}

/**
 * A query that is exactly a country name ("georgia", "study in canada") is
 * navigational: the visitor wants that country's hub, not every document that
 * mentions the name.
 */
function isCountryHubMatch(result: SearchResult, analysis: SearchQueryAnalysis) {
  if (result.documentType !== "country" || !result.countrySlug) return false;

  return analysis.coreTerms.join(" ") === getCountryHubQueryName(result.countrySlug);
}

/**
 * Small prior for content depth. BM25 length normalisation pushes long,
 * well-documented pages below thin stubs with the same terms; this nudges
 * them back without outweighing any title signal (max +5, vs +18..+80).
 */
export function getContentDepthPrior(searchTextLength: number) {
  const length = Math.max(searchTextLength, 400);

  return Math.min(5, 1.25 * Math.log(length / 400));
}

export function getSearchSignals(result: RankableSearchResult, analysis: SearchQueryAnalysis) {
  const normalizedQuery = analysis.normalized;
  const normalizedTitle = normalizeSearchValue(result.title);
  const normalizedSubtitle = normalizeSearchValue(result.subtitle ?? "");
  const titleTokens = normalizedTitle.split(" ").filter(Boolean);
  const subtitleTokens = normalizedSubtitle.split(" ").filter(Boolean);

  const titleExact = normalizedTitle === normalizedQuery;
  const titleTypoMatch = !titleExact && isTypoTolerantTitleMatch(analysis, titleTokens);
  const titleStartsWith =
    normalizedQuery.length > 0 && normalizedTitle.startsWith(normalizedQuery);
  const titleContains =
    normalizedQuery.length > 0 && normalizedTitle.includes(normalizedQuery);
  const subtitleContains =
    normalizedQuery.length > 0 && normalizedSubtitle.includes(normalizedQuery);

  const titleCoverage = getTokenCoverage(analysis, titleTokens);
  const subtitleCoverage = getTokenCoverage(analysis, subtitleTokens);
  const searchCoverage = Math.max(result.searchTextCoverage, titleCoverage);

  let directTitleTier = 0;
  let boost = 0;

  if (isCountryHubMatch(result, analysis)) {
    // Navigational query: the country hub leads, ahead of titles that merely
    // start with or contain the country name.
    directTitleTier = 4;
    boost += 95;
  } else if (titleExact) {
    directTitleTier = 4;
    boost += 80;
  } else if (titleTypoMatch) {
    directTitleTier = 3;
    boost += 60;
  } else if (titleStartsWith) {
    directTitleTier = 3;
    boost += 55;
  } else if (titleContains) {
    directTitleTier = 3;
    boost += 42;
  } else if (subtitleContains) {
    directTitleTier = 2;
    boost += 18;
  }

  if (titleCoverage === 1) {
    directTitleTier = Math.max(directTitleTier, 2);
    boost += 18;
  } else if (titleCoverage >= 0.75) {
    boost += 8;
  }

  if (subtitleCoverage === 1) {
    boost += 6;
  }

  if (searchCoverage === 1) {
    boost += 4;
  }

  const isEntity =
    result.documentType === "university" ||
    result.documentType === "india_college" ||
    result.documentType === "program";

  if (
    analysis.medicalIntent &&
    isEntity &&
    titleTokens.some((token) => MEDICAL_TITLE_TERMS.has(token))
  ) {
    boost += 10;
  }

  switch (result.documentType) {
    case "university":
      if (directTitleTier >= 2 || titleCoverage >= 0.75) {
        boost += 12;
      }
      break;
    case "india_college":
      if (directTitleTier >= 2 || titleCoverage >= 0.75) {
        boost += 11;
      }
      break;
    case "program":
      if (directTitleTier >= 2 || subtitleCoverage === 1 || titleCoverage >= 0.75) {
        boost += 10;
      }
      break;
    case "landing_page":
      if (directTitleTier === 0 && titleCoverage < 0.75) {
        boost -= 10;
      }
      break;
    case "country":
    case "course":
      if (directTitleTier === 0 && titleCoverage < 0.75) {
        boost -= 6;
      }
      break;
    default:
      break;
  }

  boost += getContentDepthPrior(result.searchTextLength);

  return {
    directTitleTier,
    titleCoverage,
    subtitleCoverage,
    searchCoverage,
    boost,
  };
}

type SearchSignals = ReturnType<typeof getSearchSignals>;

function hasStrongTitleMatch(signals: SearchSignals) {
  return signals.directTitleTier >= 3 || signals.titleCoverage === 1;
}

export function getTypeRank(documentType: SearchDocumentType) {
  switch (documentType) {
    case "university":
      return 0;
    case "india_college":
      return 1;
    case "program":
      return 2;
    case "landing_page":
      return 3;
    case "blog_post":
      return 4;
    case "country":
      return 5;
    case "course":
      return 6;
    default:
      return 7;
  }
}

/**
 * Keeps at most `MAX_PROGRAMS_PER_UNIVERSITY` programme results per university
 * so one institution's catalogue cannot crowd other universities out of the
 * result limit. Input must already be in final rank order.
 */
function capProgramsPerUniversity<T extends { result: SearchResult }>(entries: T[]) {
  const programsByUniversity = new Map<string, number>();

  return entries.filter(({ result }) => {
    if (result.documentType !== "program") return true;

    const key = result.universitySlug ?? result.path;
    const seen = programsByUniversity.get(key) ?? 0;
    programsByUniversity.set(key, seen + 1);

    return seen < MAX_PROGRAMS_PER_UNIVERSITY;
  });
}

export function rerankSearchResults(
  results: RankableSearchResult[],
  query: string | undefined,
  limit: number,
): SearchResult[] {
  if (!query) {
    return results.slice(0, limit).map(toSearchResult);
  }

  const analysis = analyzeSearchQuery(query);
  const rankedResults = results.map((result) => {
    const signals = getSearchSignals(result, analysis);

    return {
      result: {
        ...result,
        score: result.score + signals.boost,
      },
      signals,
    };
  });

  const hasStrongDirectMatch = rankedResults.some(
    (entry) => entry.signals.directTitleTier >= 3,
  );
  const hasStrongEntityTitleMatch = rankedResults.some(
    (entry) =>
      (entry.result.documentType === "university" ||
        entry.result.documentType === "india_college" ||
        entry.result.documentType === "program") &&
      hasStrongTitleMatch(entry.signals),
  );

  let filteredResults = rankedResults;

  if (hasStrongDirectMatch) {
    filteredResults = filteredResults.filter(
      (entry) =>
        entry.signals.directTitleTier >= 1 ||
        entry.signals.titleCoverage >= 0.75 ||
        entry.signals.searchCoverage === 1,
    );
  }

  if (hasStrongEntityTitleMatch) {
    filteredResults = filteredResults.filter((entry) => {
      switch (entry.result.documentType) {
        case "university":
        case "india_college":
          return (
            entry.signals.directTitleTier >= 2 ||
            entry.signals.titleCoverage >= 0.75
          );
        case "program":
          return (
            entry.signals.directTitleTier >= 2 ||
            entry.signals.titleCoverage >= 0.75 ||
            entry.signals.subtitleCoverage >= 0.75
          );
        case "landing_page":
        case "country":
        case "course":
          return (
            entry.signals.directTitleTier >= 2 ||
            entry.signals.titleCoverage === 1
          );
        default:
          return true;
      }
    });
  }

  const sortedResults = filteredResults.sort((left, right) => {
    if (right.result.score !== left.result.score) {
      return right.result.score - left.result.score;
    }

    if (right.signals.directTitleTier !== left.signals.directTitleTier) {
      return right.signals.directTitleTier - left.signals.directTitleTier;
    }

    if (right.result.featured !== left.result.featured) {
      return Number(right.result.featured) - Number(left.result.featured);
    }

    if (
      getTypeRank(left.result.documentType) !==
      getTypeRank(right.result.documentType)
    ) {
      return (
        getTypeRank(left.result.documentType) -
        getTypeRank(right.result.documentType)
      );
    }

    return left.result.title.localeCompare(right.result.title);
  });

  return capProgramsPerUniversity(sortedResults)
    .slice(0, limit)
    .map((entry) => toSearchResult(entry.result));
}

function bm25Field(field: string) {
  return sql.raw(`'${field}'`);
}

/**
 * Builds the ParadeDB query for one search. Every core term must match in
 * some field — exactly (BM25-scored), within its typo budget, or as a prefix
 * for the last term — so exact and typo-tolerant matching happen in a single
 * statement. Optional terms only add score.
 */
export function buildBm25SearchQuery(analysis: SearchQueryAnalysis): SQL {
  const lastToken = analysis.tokens.at(-1);

  const must = analysis.coreTerms.map((term) => {
    const distance = getFuzzyDistance(term);
    const clauses = BM25_FIELDS.map(
      (field) => sql`paradedb.match(${bm25Field(field)}, ${term})`,
    );

    if (distance > 0) {
      clauses.push(
        ...BM25_FUZZY_FIELDS.map(
          (field) =>
            sql`paradedb.match(${bm25Field(field)}, ${term}, distance => ${sql.raw(String(distance))}, transposition_cost_one => true)`,
        ),
      );
    }

    if (term === lastToken && term.length >= MIN_PREFIX_TERM_LENGTH) {
      // `match(..., prefix => true)` ignores the prefix flag in pg_search 0.15;
      // `fuzzy_term` honours it for a single already-normalised token.
      clauses.push(
        ...BM25_PREFIX_FIELDS.map(
          (field) =>
            sql`paradedb.fuzzy_term(${bm25Field(field)}, ${term}, distance => 0, prefix => true)`,
        ),
      );
    }

    return sql`paradedb.disjunction_max(ARRAY[${sql.join(clauses, sql`, `)}], tie_breaker => 0.15)`;
  });

  const optionalTermClauses = analysis.optionalTerms.map(
    (term) =>
      sql`paradedb.disjunction_max(ARRAY[${sql.join(
        BM25_FIELDS.map((field) => sql`paradedb.match(${bm25Field(field)}, ${term})`),
        sql`, `,
      )}], tie_breaker => 0.15)`,
  );

  // Proximity: adjacent query words that also appear next to each other in a
  // document ("computer science") score above documents that merely contain
  // both words somewhere.
  const phraseClauses = analysis.tokens.slice(1).flatMap((term, index) => {
    const previous = analysis.tokens[index];

    if (
      !analysis.coreTerms.includes(previous) ||
      !analysis.coreTerms.includes(term)
    ) {
      return [];
    }

    return [
      sql`paradedb.disjunction_max(ARRAY[${sql.join(
        BM25_PHRASE_FIELDS.map(
          (field) => sql`paradedb.phrase(${bm25Field(field)}, ARRAY[${previous}, ${term}])`,
        ),
        sql`, `,
      )}])`,
    ];
  });

  const should = [...optionalTermClauses, ...phraseClauses];

  return should.length
    ? sql`paradedb.boolean(must => ARRAY[${sql.join(must, sql`, `)}], should => ARRAY[${sql.join(should, sql`, `)}])`
    : sql`paradedb.boolean(must => ARRAY[${sql.join(must, sql`, `)}])`;
}
