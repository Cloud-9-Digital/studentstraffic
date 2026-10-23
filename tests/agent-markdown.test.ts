import assert from "node:assert/strict";
import test from "node:test";

import {
  getProgramMarkdownHref,
  getUniversityMarkdownHref,
  renderProgramMarkdown,
  renderUniversityMarkdown,
} from "@/lib/agent-markdown";
import type { Country, FinderProgram, University } from "@/lib/data/types";

const country = { slug: "india", name: "India" } as Country;

const university = {
  slug: "example-university",
  name: "Example University",
  city: "Chennai",
  countrySlug: "india",
  type: "Private",
  establishedYear: 1990,
  summary: "Example University is a private university in Chennai.",
  officialWebsite: "https://example.edu",
  recognitionBadges: ["UGC - Listed private university"],
  recognitionLinks: [{ label: "UGC list", url: "https://ugc.gov.in/list" }],
  whyChoose: [],
  thingsToConsider: [],
  bestFitFor: [],
  campusLifestyle: "",
  cityProfile: "",
  practicalExposure: "",
  hostelOverview: "",
  dietarySupport: "",
  safetyOverview: "",
  studentSupport: "",
  faq: [{ question: "Is it approved?", answer: "Yes, it is UGC listed." }],
  researchSources: [],
  lastVerifiedAt: "2026-10-01",
} as unknown as University;

const program = {
  country,
  university,
  course: { slug: "be-btech-cse", name: "B.E./B.Tech CSE", shortName: "B.Tech CSE" },
  offering: {
    slug: "example-btech-cse",
    title: "B.Tech Computer Science | AI",
    durationYears: 4,
    annualTuitionUsd: 0,
    totalTuitionUsd: 0,
    livingUsd: 0,
    officialFeeCurrency: "INR",
    officialAnnualTuitionAmount: 250000,
    medium: "Not confirmed",
    intakeMonths: [],
    professionalExamSupport: [],
    yearlyCostBreakdown: [],
    teachingPhases: [],
    sourceUrls: ["https://example.edu/fees"],
    officialProgramUrl: "https://example.edu/btech",
  },
} as unknown as FinderProgram;

test("markdown hrefs append .md to the canonical page path", () => {
  assert.equal(getUniversityMarkdownHref("example-university"), "/university/example-university.md");
  assert.equal(getProgramMarkdownHref("example-btech-cse"), "/example-btech-cse.md");
});

test("university markdown carries facts, programme table and FAQ", () => {
  const markdown = renderUniversityMarkdown({ university, country, programs: [program] });

  assert.match(markdown, /^# Example University\n/);
  assert.match(markdown, /Canonical page: http:\/\/localhost:3000\/university\/example-university/);
  assert.match(markdown, /- UGC - Listed private university/);
  // A pipe in a title must not split the table row.
  assert.match(markdown, /\[B\.Tech Computer Science \/ AI\]\(http:\/\/localhost:3000\/example-btech-cse\)/);
  assert.match(markdown, /### Is it approved\?\n\nYes, it is UGC listed\./);
  assert.doesNotMatch(markdown, /## Campus and city/);
});

test("programme markdown shows the official fee and omits an unconfirmed medium", () => {
  const markdown = renderProgramMarkdown({ program });

  assert.match(markdown, /Tuition per year: ₹2,50,000/);
  assert.doesNotMatch(markdown, /Teaching language/);
  assert.match(markdown, /- https:\/\/example\.edu\/fees/);
});
