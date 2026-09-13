import assert from "node:assert/strict";
import test from "node:test";

import { sql } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";

import type { SearchResult } from "@/lib/data/types";
import {
  analyzeSearchQuery,
  buildBm25SearchQuery,
  buildSearchTextCoverageSql,
  getEditDistance,
  MAX_PROGRAMS_PER_UNIVERSITY,
  type RankableSearchResult,
  rerankSearchResults,
  toRankableSearchResult,
} from "@/lib/search/ranking";
import { orderSectionsByTopResult } from "@/lib/search/result-sections";

let nextId = 1;

function fixture(
  overrides: Partial<RankableSearchResult> & Pick<SearchResult, "title" | "documentType">,
  textLength = 600,
): RankableSearchResult {
  const id = nextId++;
  const slug = overrides.sourceSlug ?? `doc-${id}`;

  return {
    id,
    sourceSlug: slug,
    path: `/university/${overrides.universitySlug ?? slug}`,
    summary: overrides.title,
    searchTextLength: textLength,
    searchTextCoverage: 1,
    highlights: [],
    featured: false,
    intakeMonths: [],
    score: 1,
    ...overrides,
  };
}

const titles = (results: SearchResult[]) => results.map((result) => result.title);

test("analyses queries into required and optional terms with medical intent", () => {
  const analysis = analyzeSearchQuery("MBBS  Georgia fees");

  assert.deepEqual(analysis.coreTerms, ["mbbs", "georgia"]);
  assert.deepEqual(analysis.optionalTerms, ["fees"]);
  assert.equal(analysis.medicalIntent, true);
  assert.deepEqual(analyzeSearchQuery("fees").coreTerms, ["fees"]);
  assert.equal(analyzeSearchQuery("mba germany").medicalIntent, false);
  assert.equal(analyzeSearchQuery("Università di Bologna").normalized, "universita di bologna");
});

test("measures typos with adjacent transpositions costing one edit", () => {
  assert.equal(getEditDistance("tbilsi", "tbilisi"), 1);
  assert.equal(getEditDistance("univeristy", "university"), 1);
  assert.equal(getEditDistance("univercity", "university"), 1);
  assert.equal(getEditDistance("kiit", "iit"), 1);
});

test("builds one BM25 query with typo budgets, last-term prefix and optional terms", () => {
  const { sql, params } = new PgDialect().sqlToQuery(
    buildBm25SearchQuery(analyzeSearchQuery("tbilsi medical fees")),
  );

  assert.match(sql, /^paradedb\.boolean\(must => ARRAY\[/);
  assert.match(sql, /should => ARRAY\[/);
  assert.match(sql, /distance => 1, transposition_cost_one => true/);
  assert.ok(params.includes("tbilsi"));
  assert.ok(params.includes("fees"));

  // Acronyms get no typo budget (only the last-term prefix clause).
  const acronym = new PgDialect().sqlToQuery(buildBm25SearchQuery(analyzeSearchQuery("kiit")));
  assert.doesNotMatch(acronym.sql, /transposition_cost_one/);
  assert.doesNotMatch(acronym.sql, /should =>/);

  const partial = new PgDialect().sqlToQuery(buildBm25SearchQuery(analyzeSearchQuery("manipal univ")));
  assert.match(partial.sql, /paradedb\.fuzzy_term\('title', \$\d+, distance => 0, prefix => true\)/);

  const programme = new PgDialect().sqlToQuery(
    buildBm25SearchQuery(analyzeSearchQuery("computer science canada")),
  );
  assert.equal(programme.sql.match(/paradedb\.phrase\('search_text'/g)?.length, 2);
});

test("a misspelled university name ranks the named university first", () => {
  const results = [
    fixture({ title: "Technical University of Denmark", documentType: "university", score: 16.9 }, 8000),
    fixture({ title: "Lund University", documentType: "university", score: 16.7 }, 7000),
    fixture({ title: "University of Copenhagen", documentType: "university", score: 13 }, 6300),
  ];

  assert.equal(
    titles(rerankSearchResults(results, "univercity of copenhagen", 24))[0],
    "University of Copenhagen",
  );
  assert.equal(
    titles(
      rerankSearchResults(
        [
          fixture({ title: "Toronto Metropolitan University", documentType: "university", score: 27 }),
          fixture({ title: "University of Toronto", documentType: "university", score: 20 }),
        ],
        "univeristy of toronto",
        24,
      ),
    )[0],
    "University of Toronto",
  );
});

test("a typo plus medical intent prefers the established Tbilisi medical universities", () => {
  const results = [
    fixture({ title: "Georgian National University SEU", documentType: "university", featured: true, score: 3.05 }, 2600),
    fixture({ title: "David Tvildiani Medical University AIETI Medical School", documentType: "university", score: 4.73 }, 1500),
    fixture({ title: "Tbilisi Medical Teaching University 'Hippocrates'", documentType: "university", score: 4.58 }, 460),
    fixture({ title: "Petre Shotadze Tbilisi Medical Academy Faculty of Medicine", documentType: "university", score: 4.07 }, 10900),
    fixture({ title: "Tbilisi State Medical University Faculty of Medicine", documentType: "university", score: 3.8 }, 12100),
  ];

  const ranked = titles(rerankSearchResults(results, "tbilsi medical", 24));

  assert.ok(
    [
      "Tbilisi State Medical University Faculty of Medicine",
      "Petre Shotadze Tbilisi Medical Academy Faculty of Medicine",
    ].includes(ranked[0]),
    `unexpected first result: ${ranked[0]}`,
  );
  assert.ok(!ranked.includes("Georgian National University SEU"));
});

test("medical intent lifts medical faculties above generic universities for country queries", () => {
  const results = [
    fixture({ title: "Quality Control Teaching University of Georgia", documentType: "university", score: 12.69 }, 760),
    fixture({ title: "David Aghmashenebeli University of Georgia", documentType: "university", score: 12.58 }, 900),
    fixture({ title: "University of Georgia", documentType: "university", score: 11.62 }, 5500),
    fixture({ title: "David Tvildiani Medical University AIETI Medical School", documentType: "university", score: 12.17 }, 1500),
    fixture({ title: "Tbilisi State Medical University Faculty of Medicine", documentType: "university", score: 9.1 }, 12100),
  ];

  const topThree = titles(rerankSearchResults(results, "mbbs georgia fees", 24)).slice(0, 3);

  assert.ok(topThree.includes("Tbilisi State Medical University Faculty of Medicine"));
  assert.ok(!topThree.includes("Quality Control Teaching University of Georgia"));
});

test("caps programme results per university so one catalogue cannot crowd others out", () => {
  const programs = Array.from({ length: 6 }, (_, index) =>
    fixture({
      title: `M.Sc. Subject ${index} at University of Copenhagen`,
      documentType: "program",
      universitySlug: "university-of-copenhagen",
      score: 30 - index,
    }),
  );
  const results = [
    ...programs,
    fixture({ title: "University of Copenhagen", documentType: "university", sourceSlug: "university-of-copenhagen", score: 10 }),
    fixture({ title: "Aarhus University", documentType: "university", score: 9 }),
  ];

  const ranked = rerankSearchResults(results, "copenhagen", 6);
  const copenhagenPrograms = ranked.filter(
    (result) => result.documentType === "program" && result.universitySlug === "university-of-copenhagen",
  );

  assert.equal(copenhagenPrograms.length, MAX_PROGRAMS_PER_UNIVERSITY);
  assert.ok(titles(ranked).includes("University of Copenhagen"));
});

test("exact titles still outrank typo-tolerant matches", () => {
  const results = [
    fixture({ title: "Deakin University", documentType: "university", score: 5 }),
    fixture({ title: "Dekin University", documentType: "university", score: 9 }),
  ];

  assert.equal(titles(rerankSearchResults(results, "deakin university", 24))[0], "Deakin University");
});

test("a query that is exactly a country name leads with that country's hub", () => {
  const results = [
    fixture({ title: "Georgia Institute of Technology", documentType: "university", score: 23 }, 9000),
    fixture({ title: "Georgian Technical University", documentType: "university", score: 22 }, 15000),
    fixture({ title: "Study in Georgia", documentType: "country", countrySlug: "georgia", score: 10 }, 5000),
  ];

  assert.equal(titles(rerankSearchResults(results, "georgia", 24))[0], "Study in Georgia");
  assert.equal(titles(rerankSearchResults(results, "Study in Georgia", 24))[0], "Study in Georgia");
  assert.equal(
    titles(rerankSearchResults(results, "georgia technology", 24))[0],
    "Georgia Institute of Technology",
  );
});

test("ranked results never carry search text or its ranking inputs to the page", () => {
  const document = fixture({ title: "Deakin University", documentType: "university" });

  for (const [result] of [
    rerankSearchResults([document], "deakin", 24),
    rerankSearchResults([document], undefined, 24),
  ]) {
    assert.equal("searchText" in result, false);
    assert.equal("searchTextLength" in result, false);
    assert.equal("searchTextCoverage" in result, false);
  }

  const rankable = toRankableSearchResult(
    {
      id: 1,
      score: 0,
      documentType: "university",
      sourceSlug: "tsmu",
      path: "/university/tsmu",
      title: "TSMU",
      summary: "",
      searchText: "Tbilisi MBBS fees",
      highlights: [],
      featured: false,
      intakeMonths: [],
    },
    "mbbs tbilisi fees",
  );

  assert.equal("searchText" in rankable, false);
  assert.equal(rankable.searchTextLength, 17);
  assert.equal(rankable.searchTextCoverage, 1);

  const coverage = new PgDialect().sqlToQuery(
    buildSearchTextCoverageSql(sql`lowered.search_text`, ["mbbs", "georgia"]),
  );
  assert.match(coverage.sql, /strpos\(lowered\.search_text, \$1\)/);
  assert.deepEqual(coverage.params, ["mbbs", "georgia"]);
});

test("orders result sections by their best-ranked result, then configured order", () => {
  const sections = [
    { type: "university" },
    { type: "program" },
    { type: "landing_page" },
    { type: "country" },
  ] as const;

  assert.deepEqual(
    orderSectionsByTopResult(sections, [
      { documentType: "landing_page" },
      { documentType: "university" },
      { documentType: "landing_page" },
      { documentType: "program" },
    ]).map((section) => section.type),
    ["landing_page", "university", "program", "country"],
  );
  assert.deepEqual(
    orderSectionsByTopResult(sections, []).map((section) => section.type),
    ["university", "program", "landing_page", "country"],
  );
});
