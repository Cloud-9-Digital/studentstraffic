import assert from "node:assert/strict";
import test from "node:test";
import { parseReportedFeeQuote, type ReportedFeeQuote } from "@/lib/reported-fee-quote";
import type { ProgramOffering, FinderProgram } from "@/lib/data/types";
import { catalogPayloadSchema } from "../scripts/lib/catalog-payload-schema";
import { assertReportedFeeQuoteEvidence } from "../scripts/lib/reported-fee-quote-evidence";
import { formatProgramAnnualFee, formatProgramFee, formatProgramFeeSummary, getPrimaryProgramFee, getProgramAnnualFeeLabel, getProgramFeeLines, hasRenderableProgramAnnualFee, hasRenderableProgramDisplayFee, hasRenderableProgramFee } from "@/lib/utils";
import { getProgramOfferingStructuredData } from "@/lib/structured-data";
import { hasAnnualFeeSuffix } from "../mobile/src/lib/program-fees";
import { mapUniversityDetail, mapFinderCardProgram } from "@/lib/mobile/mappers";

const quote: ReportedFeeQuote = {
  currency: "INR", minAmount: 55000, status: "indicative", period: "academic_year",
  componentBasis: "Tuition, examinations and compulsory institutional charges combined.",
  audience: "domestic", category: "MSW Aided — all specialisations", academicYear: "2026",
  sourceUrl: "https://example.edu/fees2026.pdf", sourceLabel: "Institution Batch 2026 fee notice", verifiedAt: "2026-10-25",
};
const offering = { annualTuitionUsd: 0, totalTuitionUsd: 0, feeStatus: "on_request", reportedFeeQuote: quote } as ProgramOffering;
const quoteSchema = catalogPayloadSchema.shape.universities.element.shape.programmes.element.shape.admissionsContent.shape.reportedFeeQuote;

test("native combined quote displays amount only without becoming annual tuition or a structured Offer", () => {
  assert.equal(formatProgramFee(offering), "₹55,000 / year");
  assert.equal(formatProgramAnnualFee(offering), "Fee plan on request");
  assert.equal(getProgramAnnualFeeLabel(offering), "Approx. fees");
  assert.deepEqual(getProgramFeeLines(offering, "india"), [{ label: "Approx. fees", amount: "₹55,000 / year" }]);
  const confirmedOffering = { ...offering, reportedFeeQuote: { ...quote, status: "confirmed" as const } } as ProgramOffering;
  assert.equal(getProgramAnnualFeeLabel(confirmedOffering), "Fees");
  assert.equal(hasRenderableProgramDisplayFee(offering), true);
  assert.equal(hasRenderableProgramAnnualFee(offering), false);
  assert.equal(hasRenderableProgramFee(offering), false);
  const program = { offering, university: { name: "Example", slug: "example" }, country: { slug: "india" }, course: { shortName: "MSW" } } as FinderProgram;
  assert.equal(getProgramOfferingStructuredData(program).offers, undefined);
  assert.equal(offering.annualTuitionUsd, 0);
  assert.equal(offering.totalTuitionUsd, 0);
});

test("semester and full-course ranges retain exact internal basis but render only native amounts", () => {
  for (const period of ["semester", "full_course"] as const) {
    const q = { ...quote, period, minAmount: 75000, maxAmount: 180000 };
    const parsed = quoteSchema.parse(q)!;
    assert.equal(parsed.period, period);
    assert.equal(parsed.category, quote.category);
    assert.equal(parsed.componentBasis, quote.componentBasis);
    assert.equal(parsed.sourceUrl, quote.sourceUrl);
    // The billing period is shown so per-semester and full-course figures can't be mistaken for each other;
    // provenance (year, source, status) still stays internal.
    assert.equal(formatProgramFee({ ...offering, reportedFeeQuote: parsed }), `₹75,000–₹1,80,000 ${period === "semester" ? "/ semester" : "full course"}`);
    assert.doesNotMatch(formatProgramFee({ ...offering, reportedFeeQuote: parsed }), /2026|example|indicative/i);
  }
  assert.equal(formatProgramFee({ ...offering, reportedFeeQuote: { ...quote, maxAmount: quote.minAmount } }), "₹55,000 / year");
});

test("confirmed native NIL and published annual tuition keep precedence over combined quotes", () => {
  const zero = { ...offering, feeStatus: "confirmed" as const, officialFeeCurrency: "INR", officialAnnualTuitionAmount: 0 };
  assert.equal(formatProgramFee(zero), "₹0");
  assert.equal(getProgramAnnualFeeLabel(zero), "Tuition per year");
  assert.equal(hasRenderableProgramAnnualFee(zero), true);
  assert.equal(formatProgramFee({ ...zero, officialAnnualTuitionAmount: 20000 }), "₹20,000");
  assert.equal(formatProgramFee({ ...offering, feeStatus: "indicative", indicativeAnnualTuitionMinUsd: 1000, indicativeAnnualTuitionMaxUsd: 2000 }), "$1,000–$2,000");
});

test("explicit sourced NIL quotes display without turning unknown annual tuition into zero", () => {
  const nil = quoteSchema.parse({ ...quote, minAmount: 0, period: "semester", componentBasis: "Published tuition is NIL; laboratory, deposit and other charges are separate." })!;
  const display = { ...offering, reportedFeeQuote: nil };
  assert.equal(parseReportedFeeQuote(nil)?.minAmount, 0);
  assert.equal(formatProgramFee(display), "₹0 / semester");
  assert.equal(hasRenderableProgramDisplayFee(display), true);
  assert.equal(hasRenderableProgramAnnualFee(display), false);
  assert.equal(formatProgramAnnualFee(display), "Fee plan on request");
  assert.equal(formatProgramFee({ ...offering, reportedFeeQuote: undefined }), "Fee plan on request");
  assert.equal(parseReportedFeeQuote({ minAmount: 0 }), undefined);
  const program = { offering: display, university: { name: "Example", slug: "example" }, country: { slug: "india" }, course: { shortName: "BA" } } as FinderProgram;
  assert.equal(getProgramOfferingStructuredData(program).offers, undefined);
});

test("missing and malformed quote records fail closed", () => {
  assert.equal(quoteSchema.parse(undefined), undefined);
  for (const patch of [
    { minAmount: undefined }, { minAmount: null }, { minAmount: "0" }, { minAmount: -1 }, { minAmount: NaN }, { minAmount: 1.5 }, { minAmount: Number.MAX_SAFE_INTEGER + 1 },
    { maxAmount: 100 }, { maxAmount: Infinity }, { currency: "inr" }, { period: "annualish" }, { status: "on_request" },
    { componentBasis: "" }, { academicYear: "" }, { sourceUrl: "javascript:alert(1)" }, { verifiedAt: "not-a-date" }, { category: 5 }, { audience: "foreign" },
  ]) {
    const bad = { ...quote, ...patch };
    assert.equal(parseReportedFeeQuote(bad), undefined, JSON.stringify(patch));
    assert.equal(quoteSchema.safeParse(bad).success, false);
    assert.equal(formatProgramFee({ ...offering, reportedFeeQuote: bad as ReportedFeeQuote }), "Fee plan on request");
  }
});

test("quote publication requires the exact quote evidence field, source and grade/status", () => {
  const evidence = { publicField: "reportedFeeQuote", sourceUrl: quote.sourceUrl, sourceGrade: "A", status: "indicative" };
  assert.doesNotThrow(() => assertReportedFeeQuoteEvidence(quote, [evidence], "example"));
  assert.doesNotThrow(() => assertReportedFeeQuoteEvidence(quote, [{ ...evidence, sourceGrade: "B" }], "example"));
  // A third-party website (Grade C) may support an indicative quote, which pages label "Approx. fees".
  assert.doesNotThrow(() => assertReportedFeeQuoteEvidence(quote, [{ ...evidence, sourceGrade: "C" }], "example"));
  for (const patch of [{ publicField: "fee" }, { sourceUrl: "https://other.example/fees" }, { status: "verified" }, { status: "omit" }]) {
    assert.throws(() => assertReportedFeeQuoteEvidence(quote, [{ ...evidence, ...patch }], "example"), /reportedFeeQuote evidence/);
  }
  const confirmed = { ...quote, status: "confirmed" as const };
  assert.doesNotThrow(() => assertReportedFeeQuoteEvidence(confirmed, [{ ...evidence, status: "verified" }], "example"));
  assert.throws(() => assertReportedFeeQuoteEvidence(confirmed, [{ ...evidence, status: "verified", sourceGrade: "B" }], "example"), /Grade A verified/);
  assert.throws(() => assertReportedFeeQuoteEvidence(confirmed, [{ ...evidence, status: "verified", sourceGrade: "C" }], "example"), /Grade A verified/);
  assert.throws(() => assertReportedFeeQuoteEvidence(confirmed, [evidence], "example"), /Grade A verified/);
});

test("mobile finder receives formatted quote and preserves its numeric annual budget sentinel", () => {
  const card = mapFinderCardProgram({ university: { slug: "example", name: "Example", city: "Chennai", type: "Private", featured: false }, country: { name: "India", slug: "india" }, course: { shortName: "MSW", slug: "master-social-work" }, offering: { ...offering, slug: "example-msw", featured: false } });
  assert.equal(card.feeLabel, "₹55,000 / year");
  assert.equal(card.tuitionUsd, 0);
  assert.equal("reportedFeeQuote" in card, false);
});


test("mobile programme quotes suppress annual units in both visible and accessible fee lines", () => {
  const program = {
    offering: { ...offering, slug: "example-msw", courseSlug: "master-social-work", title: "MSW", durationYears: 2, medium: "English", intakeMonths: [], yearlyCostBreakdown: [], professionalExamSupport: [] },
    course: { slug: "master-social-work", level: "masters" },
  } as unknown as FinderProgram;
  const university = { slug: "example", name: "Example", countrySlug: "india" } as Parameters<typeof mapUniversityDetail>[0];
  const dto = mapUniversityDetail(university, "India", [program]);
  assert.equal(dto.offerings[0].feeLabel, "₹55,000 / year");
  assert.equal(dto.offerings[0].feeIsAnnual, false);
  assert.deepEqual(dto.offerings[0].feeLines, [{ label: "Approx. fees", amount: "₹55,000 / year" }]);
  assert.equal(dto.primaryOffering?.feeIsAnnual, false);
  assert.equal(dto.primaryOffering?.annualTuitionUsd, 0);
  assert.equal(hasAnnualFeeSuffix(dto.offerings[0], dto.offerings[0].feeLines[0].amount), false);

  const nilDto = mapUniversityDetail(university, "India", [{ ...program, offering: { ...program.offering, reportedFeeQuote: { ...quote, minAmount: 0, period: "semester" } } }]);
  assert.equal(nilDto.offerings[0].feeLabel, "₹0 / semester");
  assert.equal(nilDto.offerings[0].feeIsAnnual, false);
  assert.equal(hasAnnualFeeSuffix(nilDto.offerings[0], "₹0"), false);

  const annual = { ...program, offering: { ...program.offering, feeStatus: "confirmed" as const, officialFeeCurrency: "INR", officialAnnualTuitionAmount: 0 } };
  const annualDto = mapUniversityDetail(university, "India", [annual]);
  assert.equal(annualDto.offerings[0].feeIsAnnual, true);
  assert.equal(annualDto.offerings[0].feeLabel, "₹0");
  assert.equal(hasAnnualFeeSuffix(annualDto.offerings[0], "₹0"), true);
  assert.equal(hasAnnualFeeSuffix({}, "₹20,000"), true); // Older API compatibility.
  assert.equal(hasAnnualFeeSuffix({}, "Fee on request"), false);
});

test("single-line fee displays name who each fee is for, so an NRI fee never reads as the Indian fee", () => {
  const nriOnly = { annualTuitionUsd: 3600, totalTuitionUsd: 0, feeStatus: "confirmed", officialFeeCurrency: "USD", officialAnnualTuitionAmount: 3600, feeAudience: "international", additionalFees: [] } as unknown as ProgramOffering;
  assert.equal(formatProgramFeeSummary(nriOnly, "india"), "$3,600 (NRI & international)");
  assert.deepEqual(getPrimaryProgramFee(nriOnly, "india"), { amount: "$3,600", audienceLabel: "NRI & international" });
  assert.equal(formatProgramFeeSummary(nriOnly, "georgia"), "$3,600 (International students)");

  const both = { ...nriOnly, additionalFees: [{ audience: "domestic", annualAmount: 195000, currency: "INR" }] } as unknown as ProgramOffering;
  assert.equal(formatProgramFeeSummary(both, "india"), "₹1,95,000 (Indian students) · $3,600 (NRI & international)");
  assert.deepEqual(getPrimaryProgramFee(both, "india"), { amount: "₹1,95,000", audienceLabel: "Indian students" });
  // Fee-line output stays { label, amount } for the app API.
  assert.deepEqual(getProgramFeeLines(both, "india").map(Object.keys), [["label", "amount"], ["label", "amount"]]);

  const unclassified = { ...nriOnly, feeAudience: undefined };
  assert.equal(formatProgramFeeSummary(unclassified, "india"), "$3,600");
  assert.deepEqual(getPrimaryProgramFee(unclassified, "india"), { amount: "$3,600" });
  assert.equal(formatProgramFeeSummary(offering, "india"), "₹55,000 / year");
});

test("a named seat category labels its fee, so quota fees for the same audience stay distinct", () => {
  const quotas = {
    annualTuitionUsd: 0, totalTuitionUsd: 0, feeStatus: "confirmed", officialFeeCurrency: "INR", officialAnnualTuitionAmount: 250000,
    feeAudience: "domestic", feeCategory: "Government quota",
    additionalFees: [
      { audience: "domestic", category: "Management quota", annualAmount: 600000, currency: "INR" },
      { audience: "international", category: "NRI quota", annualAmount: 900000, currency: "INR" },
    ],
  } as unknown as ProgramOffering;
  assert.deepEqual(getProgramFeeLines(quotas, "india"), [
    { label: "Government quota", amount: "₹2,50,000" },
    { label: "Management quota", amount: "₹6,00,000" },
    { label: "NRI quota", amount: "₹9,00,000" },
  ]);
  assert.equal(formatProgramFeeSummary(quotas, "india"), "₹2,50,000 (Government quota) · ₹6,00,000 (Management quota) · ₹9,00,000 (NRI quota)");
  assert.deepEqual(getPrimaryProgramFee(quotas, "india"), { amount: "₹2,50,000", audienceLabel: "Government quota" });
  // An on-request main fee never shows a stale category.
  assert.equal(getProgramFeeLines({ ...quotas, feeStatus: "on_request", additionalFees: [] } as ProgramOffering, "india")[0].label, "Fee plan");
});
