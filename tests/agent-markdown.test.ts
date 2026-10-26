import assert from "node:assert/strict";
import test from "node:test";

import {
  estimateMarkdownTokens,
  getProgramMarkdownHref,
  markdownResponse,
  renderCountryMarkdown,
  renderGuideMarkdown,
  renderLandingPageMarkdown,
  getUniversityMarkdownHref,
  renderProgramMarkdown,
  renderUniversityMarkdown,
} from "@/lib/agent-markdown";
import type { CountryProgramDirectoryRow } from "@/lib/data/catalog";
import type { Country, FinderProgram, LandingPage, University } from "@/lib/data/types";
import type { StudyAbroadGuidePageProps } from "@/components/site/study-abroad-guide-page";

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

test("markdown responses send negotiation headers and a token estimate", async () => {
  const body = "# Title\n\nSome text.\n";
  const response = markdownResponse(body, "/university/example-university");
  assert.equal(response.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.equal(response.headers.get("vary"), "Accept");
  assert.equal(response.headers.get("x-markdown-tokens"), String(estimateMarkdownTokens(body)));
  assert.equal(response.headers.get("link"), '<http://localhost:3000/university/example-university>; rel="canonical"');
  assert.equal(await response.text(), body);
});

test("country markdown lists each university once with its courses", () => {
  const row = (courseShortName: string) =>
    ({
      university: { slug: "example-university", name: "Example University", city: "Tbilisi", type: "Public", featured: false },
      course: { slug: courseShortName.toLowerCase(), shortName: courseShortName, stream: "medicine", durationYears: 6 },
      offering: { annualTuitionUsd: 5000, livingUsd: 3000, medium: "English", intakeMonths: [] },
    }) as unknown as CountryProgramDirectoryRow;
  const markdown = renderCountryMarkdown({
    country: { slug: "georgia", name: "Georgia", summary: "Georgia summary.", whyStudentsChooseIt: "Reasons.", climate: "Mild", metaDescription: "Study MBBS in Georgia." } as Country,
    programRows: [row("MBBS"), row("BDS")],
  });
  assert.match(markdown, /^# Study in Georgia\n/);
  assert.match(markdown, /Canonical page: http:\/\/localhost:3000\/countries\/georgia/);
  assert.equal(markdown.match(/\[Example University\]/g)?.length, 1);
  assert.match(markdown, /\| MBBS, BDS \|/);
  assert.match(markdown, /studying in Georgia/);
});

test("guide markdown renders sections, tables and FAQs", () => {
  const guide = {
    path: "/mbbs-in-russia-fees",
    title: "MBBS in Russia fees",
    updatedOn: "October 2026",
    summary: "Fees summary.",
    keyTakeaways: ["Takeaway one"],
    sections: [
      { title: "Fee table", paragraphs: ["Intro."], table: { headers: ["University", "Fee"], rows: [["A | B", "$5,000"]] } },
    ],
    faqItems: [{ question: "Is NEET needed?", answer: "Yes." }],
    notes: "",
  } as unknown as StudyAbroadGuidePageProps;
  const markdown = renderGuideMarkdown({ guide });
  assert.match(markdown, /^# MBBS in Russia fees\n/);
  assert.match(markdown, /- Updated: October 2026/);
  assert.doesNotMatch(markdown, /Last reviewed/);
  assert.match(markdown, /\| University \| Fee \|\n\| --- \| --- \|\n\| A \/ B \| \$5,000 \|/);
  assert.match(markdown, /### Is NEET needed\?\n\nYes\./);
});

test("landing page markdown keeps highlights, steps and FAQs", () => {
  const page = {
    slug: "mbbs-in-georgia",
    courseSlug: "mbbs",
    countrySlug: "georgia",
    title: "MBBS in Georgia",
    summary: "Summary.",
    heroHighlights: ["English medium"],
    reasonsToChoose: ["NMC aligned"],
    admissionSteps: ["Apply", "Get visa"],
    faq: [{ question: "Duration?", answer: "Six years." }],
  } as unknown as LandingPage;
  const markdown = renderLandingPageMarkdown({ page, canonicalPath: "/mbbs-in-georgia", country: { slug: "georgia", name: "Georgia" } });
  assert.match(markdown, /^# MBBS in Georgia\n/);
  assert.match(markdown, /1\. Apply\n2\. Get visa/);
  assert.match(markdown, /\[Universities in Georgia\]\(http:\/\/localhost:3000\/countries\/georgia\)/);
  assert.match(markdown, /### Duration\?\n\nSix years\./);
});
