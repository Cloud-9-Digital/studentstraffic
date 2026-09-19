import assert from "node:assert/strict";
import test from "node:test";

import type { CourseStream } from "@/lib/data/types";
import {
  DESCRIPTION_MAX_CHARS,
  TITLE_MAX_CHARS,
  buildComparisonTitle,
  buildProgramMetadata,
  buildUniversityMetadata,
  selectFlagshipProgram,
  selectLowestFeeProgram,
  summariseUniversityStreams,
  type MetadataProgram,
} from "@/lib/university-metadata";

function program(input: {
  slug: string;
  shortName: string;
  stream: CourseStream;
  level?: string;
  fee?: number | null;
  featured?: boolean;
}): MetadataProgram {
  return {
    offering: {
      slug: input.slug,
      featured: input.featured ?? false,
      annualTuitionUsd: input.fee ?? 0,
      feeStatus: input.fee == null ? "on_request" : "confirmed",
      officialAnnualTuitionAmount: input.fee ?? undefined,
      officialFeeCurrency: input.fee == null ? undefined : "USD",
      indicativeAnnualTuitionMinUsd: undefined,
      indicativeAnnualTuitionMaxUsd: undefined,
    },
    course: {
      shortName: input.shortName,
      stream: input.stream,
      level: input.level ?? "bachelors",
    },
  };
}

// Mirrors the published Vellore Institute of Technology catalogue: seven
// offerings, engineering dominant, B.Com first by slug order.
const vitPrograms: MetadataProgram[] = [
  program({ slug: "vit-vellore-bcom", shortName: "B.Com", stream: "economics-commerce", fee: 3450 }),
  program({ slug: "vit-vellore-btech-civil-engineering", shortName: "B.E./B.Tech Civil", stream: "engineering", fee: 9000 }),
  program({ slug: "vit-vellore-btech-computer-science-engineering", shortName: "B.E./B.Tech CSE", stream: "engineering", fee: 9000 }),
  program({ slug: "vit-vellore-btech-electronics-communication-engineering", shortName: "B.E./B.Tech ECE", stream: "engineering", fee: 9000 }),
  program({ slug: "vit-vellore-btech-mechanical-engineering", shortName: "B.E./B.Tech Mechanical", stream: "engineering", fee: 9000 }),
  program({ slug: "vit-vellore-mba", shortName: "MBA", stream: "business", level: "masters", fee: 6450 }),
  program({ slug: "vit-vellore-msc-data-science", shortName: "M.Sc. Data Science", stream: "engineering", level: "masters", fee: 3450 }),
];

const vit = {
  name: "Vellore Institute of Technology",
  city: "Vellore",
  faq: new Array(13).fill({ question: "q", answer: "a" }),
  recognitionBadges: [
    "NAAC — Accredited A++, CGPA 3.66, Cycle 4 (declared August 2021)",
    "NBA Tier I",
  ],
};
const india = { name: "India" };

const kazanPrograms: MetadataProgram[] = [
  program({
    slug: "mbbs-in-kazan-state-medical-university",
    shortName: "MBBS",
    stream: "medicine",
    fee: 5500,
    featured: true,
  }),
];
const kazan = {
  name: "Kazan State Medical University",
  city: "Kazan",
  faq: new Array(5).fill({ question: "q", answer: "a" }),
  recognitionBadges: ["NMC", "WHO"],
};
const russia = { name: "Russia" };

function assertBudgets(meta: { title: string; description: string }) {
  assert.ok(
    meta.title.length <= TITLE_MAX_CHARS,
    `title too long (${meta.title.length}): ${meta.title}`,
  );
  assert.ok(
    meta.description.length <= DESCRIPTION_MAX_CHARS,
    `description too long (${meta.description.length}): ${meta.description}`,
  );
}

test("flagship selection uses the dominant stream, not slug order", () => {
  const flagship = selectFlagshipProgram(vitPrograms);
  assert.equal(flagship?.course.stream, "engineering");
  assert.notEqual(flagship?.course.shortName, "B.Com");
  // Deterministic across input ordering.
  const reversed = selectFlagshipProgram([...vitPrograms].reverse());
  assert.equal(reversed?.offering.slug, flagship?.offering.slug);
});

test("an explicitly featured offering still wins", () => {
  const withFeatured = [
    ...vitPrograms,
    program({ slug: "vit-vellore-featured", shortName: "MBA Featured", stream: "business", featured: true, fee: 6450 }),
  ];
  assert.equal(selectFlagshipProgram(withFeatured)?.offering.slug, "vit-vellore-featured");
});

test("stream summary reports dominance and a stream-aware keyword noun", () => {
  const profile = summariseUniversityStreams(vitPrograms);
  assert.equal(profile.dominantStream, "engineering");
  assert.equal(profile.distinctStreamCount, 3);
  assert.equal(profile.isSingleStream, false);
  assert.equal(profile.keywordNoun, "engineering college");

  const medical = summariseUniversityStreams(kazanPrograms);
  assert.equal(medical.isSingleStream, true);
  assert.equal(medical.keywordNoun, "medical university");
});

test("multi-stream university page leads with the university, never a course", () => {
  const meta = buildUniversityMetadata({
    university: vit,
    country: india,
    programs: vitPrograms,
    section: null,
  });
  assert.ok(meta.title.startsWith("Vellore Institute of Technology"));
  assert.ok(!meta.title.includes("B.Com"));
  assert.ok(meta.description.startsWith("Vellore Institute of Technology, Vellore, India"));
  assert.ok(meta.description.includes("7 programmes"));
  assertBudgets(meta);
  // Stream-aware keywords replaced the hardcoded "<city> medical university".
  assert.ok(meta.keywords.includes("Vellore engineering college"));
  assert.ok(!meta.keywords.some((k) => k.includes("medical university")));
  // Long accreditation sentences are not keywords.
  assert.ok(meta.keywords.every((k) => k.length <= 64));
  assert.ok(meta.keywords.includes("NBA Tier I"));
});

test("single-stream university surfaces its one course in the title", () => {
  const meta = buildUniversityMetadata({
    university: kazan,
    country: russia,
    programs: kazanPrograms,
    section: null,
  });
  assert.ok(meta.title.startsWith("Kazan State Medical University MBBS"));
  assert.ok(meta.description.includes("$5,500"));
  assertBudgets(meta);
});

test("every university section leads with the university and stays in budget", () => {
  const sections = ["programs", "student-life", "hostel", "faq"] as const;
  const titles = new Set<string>();

  for (const section of sections) {
    const meta = buildUniversityMetadata({
      university: vit,
      country: india,
      programs: vitPrograms,
      section,
    });
    assert.ok(
      meta.title.startsWith("Vellore Institute of Technology"),
      `${section}: ${meta.title}`,
    );
    assertBudgets(meta);
    titles.add(meta.title);
  }

  // No duplicate templates across sibling pages.
  assert.equal(titles.size, sections.length);

  const faq = buildUniversityMetadata({
    university: vit,
    country: india,
    programs: vitPrograms,
    section: "faq",
  });
  assert.ok(faq.description.startsWith("13 answered questions"));
});

test("missing fee data is omitted, never fabricated", () => {
  const noFee = [
    program({ slug: "mbbs-no-fee", shortName: "MBBS", stream: "medicine", fee: null, featured: true }),
  ];
  const meta = buildUniversityMetadata({
    university: kazan,
    country: russia,
    programs: noFee,
    section: null,
  });
  assert.ok(!meta.description.includes("$"));
  assert.ok(!/tuition/i.test(meta.description.split(":")[1] ?? ""));
  assert.ok(!meta.title.includes("Fees"));
  assertBudgets(meta);
});

test("missing country falls back to the city alone", () => {
  const meta = buildUniversityMetadata({
    university: kazan,
    country: null,
    programs: kazanPrograms,
    section: null,
  });
  assert.ok(meta.description.includes("Kazan:"));
  assert.ok(!meta.description.includes("Russia"));
  assert.ok(!meta.keywords.some((k) => k.includes("undefined")));
  assertBudgets(meta);
});

test("a university with no published programmes still gets a real description", () => {
  const meta = buildUniversityMetadata({
    university: kazan,
    country: russia,
    programs: [],
    section: null,
  });
  assert.ok(meta.title.startsWith("Kazan State Medical University"));
  assert.ok(meta.description.length > 60);
  assert.ok(!meta.description.includes("undefined"));
  assertBudgets(meta);
});

test("very long university names are truncated at a word boundary", () => {
  const longName = {
    name: "Università Cattolica del Sacro Cuore - Faculty of Medicine and Surgery (Rome campus / Gemelli)",
    city: "Rome",
    faq: [],
    recognitionBadges: [],
  };
  const meta = buildUniversityMetadata({
    university: longName,
    country: { name: "Italy" },
    programs: kazanPrograms,
    section: null,
  });
  assertBudgets(meta);
  assert.ok(meta.title.endsWith("…"));
  assert.ok(meta.title.startsWith("Università Cattolica del Sacro Cuore"));
  assert.ok(!meta.title.includes("  "));

  const section = buildUniversityMetadata({
    university: longName,
    country: { name: "Italy" },
    programs: kazanPrograms,
    section: "hostel",
  });
  assertBudgets(section);
});

test("programme pages lead with the programme at that university", () => {
  const meta = buildProgramMetadata({
    program: kazanPrograms[0],
    university: kazan,
    country: russia,
    section: null,
  });
  assert.ok(meta.title.startsWith("MBBS at Kazan State Medical University"));
  assert.ok(meta.description.startsWith("MBBS at Kazan State Medical University"));
  assert.ok(meta.description.includes("$5,500"));
  assertBudgets(meta);
});

test("each programme section gets a distinct, in-budget title", () => {
  const sections = ["fees", "eligibility", "admissions", "recognition", null] as const;
  const titles = new Set<string>();

  for (const section of sections) {
    const meta = buildProgramMetadata({
      program: kazanPrograms[0],
      university: kazan,
      country: russia,
      section,
    });
    assert.ok(meta.title.startsWith("MBBS"), `${section}: ${meta.title}`);
    assert.ok(meta.title.includes("Kazan State Medical University"), meta.title);
    assertBudgets(meta);
    titles.add(meta.title);
  }

  assert.equal(titles.size, sections.length);
});

test("programme fee section omits the figure when there is no published fee", () => {
  const meta = buildProgramMetadata({
    program: program({ slug: "p", shortName: "MBBS", stream: "medicine", fee: null }),
    university: kazan,
    country: russia,
    section: "fees",
  });
  assert.ok(!meta.description.includes("$"));
  assert.ok(!meta.title.includes("$"));
  assertBudgets(meta);
});

test("comparison titles keep both institutions", () => {
  const short = buildComparisonTitle("HSE University", "Kazan Federal University");
  assert.ok(short.includes("HSE University vs Kazan Federal University"));
  assert.ok(short.length <= TITLE_MAX_CHARS);

  const long = buildComparisonTitle(
    "Lobachevsky State University of Nizhny Novgorod (Institute of Clinical Medicine)",
    "Pitirim Sorokin Syktyvkar State University (Medical Institute)",
  );
  assert.ok(long.length <= TITLE_MAX_CHARS);
  assert.ok(long.includes(" vs "));
  const [left, right] = long.split(" vs ");
  assert.ok(left.startsWith("Lobachevsky"));
  assert.ok(right.startsWith("Pitirim"));
});

test("'tuition from' uses the cheapest published programme, not the flagship", () => {
  const meta = buildUniversityMetadata({
    university: vit,
    country: india,
    programs: vitPrograms,
    section: null,
  });
  // Flagship is a $9,000 B.Tech; the catalogue floor is $3,450.
  assert.ok(meta.description.includes("from $3,450"));
  assert.equal(selectLowestFeeProgram(vitPrograms)?.offering.slug, "vit-vellore-bcom");
  assert.equal(selectLowestFeeProgram([]), undefined);
});

test("stream labels that contain 'and' are not double-conjoined", () => {
  const meta = buildUniversityMetadata({
    university: vit,
    country: india,
    programs: vitPrograms,
    section: null,
  });
  assert.ok(!meta.description.includes("and commerce and economics and"));
  assert.ok(!/ and .* and /.test(meta.description));
});

test("a single published programme is described in the singular", () => {
  const meta = buildUniversityMetadata({
    university: kazan,
    country: russia,
    programs: kazanPrograms,
    section: "programs",
  });
  assert.ok(meta.description.startsWith("All 1 programme at"));
  assert.ok(!meta.description.includes("1 programmes"));
});

test("broad catalogues do not claim a single-stream keyword noun", () => {
  const broad = [
    program({ slug: "a", shortName: "B.A.", stream: "arts-humanities" }),
    program({ slug: "b", shortName: "B.Sc.", stream: "natural-sciences" }),
    program({ slug: "c", shortName: "LLB", stream: "law" }),
    program({ slug: "d", shortName: "B.Com", stream: "economics-commerce" }),
  ];
  const meta = buildUniversityMetadata({
    university: { name: "Broad University", city: "Berlin" },
    country: { name: "Germany" },
    programs: broad,
    section: null,
  });
  assert.ok(meta.keywords.includes("Berlin university"));
});
