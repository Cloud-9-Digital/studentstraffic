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
    intakeCodes: [],
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


test("programme markdown preserves confirmed NIL tuition and compulsory charge notes", () => {
  const markdown = renderProgramMarkdown({ program: { ...program, offering: {
    ...program.offering, feeStatus: "confirmed", officialAnnualTuitionAmount: 0,
    feeNotes: "NIL tuition only; admission and examination charges remain payable.",
  }} as FinderProgram });
  assert.match(markdown, /Tuition per year:.*₹0/);
  assert.match(markdown, /NIL tuition only; admission and examination charges remain payable/);
  assert.doesNotMatch(markdown, /Total tuition:.*0|Free course/);
});

test("reported full-course quote uses generic Fees without annual units or internal quote prose", () => {
  const quotedProgram = { ...program, offering: {
    ...program.offering, feeStatus: "on_request", officialAnnualTuitionAmount: undefined,
    feeNotes: "INTERNAL first-year fee basis and source-year detail must not accompany a reported quote.",
    reportedFeeQuote: {
      currency: "INR", minAmount: 45000, maxAmount: 90000, status: "indicative", period: "full_course",
      componentBasis: "Combined compulsory course fees, not isolated tuition.", category: "Indian route", academicYear: "2026",
      sourceUrl: "https://example.edu/reported-fee-quote", sourceLabel: "Internal retained quote notice", verifiedAt: "2026-10-25",
    },
  }} as FinderProgram;
  const markdown = renderProgramMarkdown({ program: quotedProgram });
  assert.match(markdown, /Fees: ₹45,000–₹90,000/);
  assert.doesNotMatch(markdown, /Tuition per year:|INTERNAL|Internal retained quote|first-year fee basis|full_course/);
  const universityMarkdown = renderUniversityMarkdown({ university, country, programs: [quotedProgram] });
  assert.match(universityMarkdown, /\| Medium \| Fees \|/);
  assert.doesNotMatch(universityMarkdown, /Tuition per year|₹90,000\/year/);
});
