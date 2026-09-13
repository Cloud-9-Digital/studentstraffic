import assert from "node:assert/strict";
import test from "node:test";

import { sql } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";

import type { SearchResult } from "@/lib/data/types";
import {
  analyzeSearchQuery,
  buildBm25SearchQuery,
  buildSearchTextCoverageSql,
  findQueryCountrySlugs,
  getEditDistance,
  MAX_PROGRAMS_PER_UNIVERSITY,
  type RankableSearchResult,
  rerankSearchResults,
  toRankableSearchResult,
} from "@/lib/search/ranking";
import { buildSearchResultLayout, TOP_RESULTS_COUNT } from "@/lib/search/result-sections";

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

test("detects catalogue countries named in the query, including common aliases", () => {
  const catalogue = [
    "bosnia-and-herzegovina",
    "canada",
    "georgia",
    "germany",
    "united-kingdom",
    "united-states",
  ];
  const detect = (query: string) => findQueryCountrySlugs(analyzeSearchQuery(query), catalogue);

  assert.deepEqual(detect("nursing germany"), ["germany"]);
  assert.deepEqual(detect("llm uk"), ["united-kingdom"]);
  assert.deepEqual(detect("study in the USA"), ["united-states"]);
  assert.deepEqual(detect("mbbs in bosnia and herzegovina"), ["bosnia-and-herzegovina"]);
  assert.deepEqual(detect("mbbs in russia vs georgia"), ["georgia"]);
  assert.deepEqual(detect("tbilsi medical"), []);
});

test("ordinary words, origin countries and compound place names create no country intent", () => {
  const catalogue = ["canada", "georgia", "india", "south-korea", "united-kingdom", "united-states"];
  const detect = (query: string) => findQueryCountrySlugs(analyzeSearchQuery(query), catalogue);

  assert.deepEqual(detect("contact us"), []);
  assert.deepEqual(detect("why choose us"), []);
  assert.deepEqual(detect("about us"), []);
  assert.deepEqual(detect("study in the usa"), ["united-states"]);
  assert.deepEqual(detect("u.s. medical schools"), ["united-states"]);
  assert.deepEqual(detect("study in america"), ["united-states"]);
  assert.deepEqual(detect("mbbs in latin america"), []);
  assert.deepEqual(detect("mbbs abroad from india"), []);
  assert.deepEqual(detect("study in canada from india"), ["canada"]);
  assert.deepEqual(detect("mbbs in india"), ["india"]);
  assert.deepEqual(detect("study in south korea"), ["south-korea"]);
  assert.deepEqual(detect("georgia"), ["georgia"]);
});

test("country intent removes documents in other countries once the named country has results", () => {
  const results = [
    fixture({ title: "Germany nursing career pathway", documentType: "landing_page", countrySlug: "albania", score: 40 }, 20000),
    fixture({ title: "BSc Nursing in Albania", documentType: "landing_page", countrySlug: "albania", score: 30 }, 20000),
    fixture({ title: "Western Balkans University (WBU)", documentType: "university", countrySlug: "albania", score: 19.3 }, 8000),
    fixture({ title: "Hamburg University of Applied Sciences (HAW Hamburg)", documentType: "university", countrySlug: "germany", score: 21.2 }, 8000),
    fixture({ title: "Deggendorf Institute of Technology (DIT)", documentType: "university", countrySlug: "germany", score: 19.5 }, 8000),
    fixture({ title: "B.Sc. Nursing Abroad", documentType: "course", score: 12 }, 3000),
  ];

  const ranked = rerankSearchResults(results, "nursing germany", 24, {
    queryCountrySlugs: ["germany"],
  });
  assert.equal(ranked[0].countrySlug, "germany");
  assert.deepEqual(
    titles(ranked.filter((result) => result.countrySlug && result.countrySlug !== "germany")),
    [],
  );
  // Documents without a country stay neutral.
  assert.ok(titles(ranked).includes("B.Sc. Nursing Abroad"), titles(ranked).join(" | "));

  // With no result in the named country, other countries stay but rank below
  // neutral documents.
  const foreignOnly = rerankSearchResults(
    results.filter((result) => result.countrySlug !== "germany"),
    "nursing germany",
    24,
    { queryCountrySlugs: ["germany"] },
  );
  assert.equal(foreignOnly.length, 4);
  assert.equal(foreignOnly[0].title, "B.Sc. Nursing Abroad");
  // Without a named country the rerank is unchanged.
  assert.equal(
    titles(rerankSearchResults(results, "nursing germany", 24))[0],
    "Germany nursing career pathway",
  );
});

test("an entity whose name contains a country word keeps its place", () => {
  const results = [
    fixture({ title: "Georgia Institute of Technology", documentType: "university", countrySlug: "united-states", score: 20 }, 9000),
    fixture({ title: "Georgian Technical University", documentType: "university", countrySlug: "georgia", score: 22 }, 15000),
  ];
  const context = { queryCountrySlugs: ["georgia"] };

  assert.equal(
    titles(rerankSearchResults(results, "georgia institute of technology", 24, context))[0],
    "Georgia Institute of Technology",
  );
  assert.equal(
    titles(rerankSearchResults(results, "georgia", 24, context))[0],
    "Georgian Technical University",
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

test("shows the best results across types first, then typed sections without duplicates", () => {
  const sections = [
    { type: "university" },
    { type: "program" },
    { type: "landing_page" },
    { type: "india_college" },
  ] as const;
  const results = [
    { documentType: "india_college", title: "Sikkim Manipal Institute" },
    { documentType: "university", title: "Manipal Academy of Higher Education" },
    { documentType: "program", title: "MBA at Manipal Academy" },
    { documentType: "india_college", title: "Kasturba Medical College, Manipal" },
    { documentType: "india_college", title: "Kasturba Medical College, Mangalore" },
    { documentType: "university", title: "Another University" },
  ] as const;

  const layout = buildSearchResultLayout(sections, results);

  assert.equal(TOP_RESULTS_COUNT, 4);
  // A strong result of another type is not buried behind weaker same-type results.
  assert.deepEqual(
    layout.topResults.map((result) => result.title),
    [
      "Sikkim Manipal Institute",
      "Manipal Academy of Higher Education",
      "MBA at Manipal Academy",
      "Kasturba Medical College, Manipal",
    ],
  );
  // The rest keep the configured section order; empty sections are omitted.
  assert.deepEqual(
    layout.sections.map(({ section, results: sectionResults }) => [
      section.type,
      sectionResults.map((result) => result.title),
    ]),
    [
      ["university", ["Another University"]],
      ["india_college", ["Kasturba Medical College, Mangalore"]],
    ],
  );
  assert.deepEqual(buildSearchResultLayout(sections, []), { topResults: [], sections: [] });
});
