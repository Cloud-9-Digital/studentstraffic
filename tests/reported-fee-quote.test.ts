import assert from "node:assert/strict";
import test from "node:test";
import { parseReportedFeeQuote, type ReportedFeeQuote } from "@/lib/reported-fee-quote";
import type { ProgramOffering, FinderProgram } from "@/lib/data/types";
import { catalogPayloadSchema } from "../scripts/lib/catalog-payload-schema";
import { assertReportedFeeQuoteEvidence } from "../scripts/lib/reported-fee-quote-evidence";
import { formatProgramAnnualFee, formatProgramFee, getProgramAnnualFeeLabel, getProgramFeeLines, hasRenderableProgramAnnualFee, hasRenderableProgramDisplayFee, hasRenderableProgramFee } from "@/lib/utils";
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
  assert.equal(formatProgramFee(offering), "₹55,000");
  assert.equal(formatProgramAnnualFee(offering), "Fee plan on request");
  assert.equal(getProgramAnnualFeeLabel(offering), "Fees");
  assert.deepEqual(getProgramFeeLines(offering, "india"), [{ label: "Fees", amount: "₹55,000" }]);
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
    assert.equal(formatProgramFee({ ...offering, reportedFeeQuote: parsed }), "₹75,000–₹1,80,000");
    assert.doesNotMatch(formatProgramFee({ ...offering, reportedFeeQuote: parsed }), /year|semester|course|2026|example|indicative/i);
  }
  assert.equal(formatProgramFee({ ...offering, reportedFeeQuote: { ...quote, maxAmount: quote.minAmount } }), "₹55,000");
});

test("confirmed native NIL and published annual tuition keep precedence over combined quotes", () => {
  const zero = { ...offering, feeStatus: "confirmed" as const, officialFeeCurrency: "INR", officialAnnualTuitionAmount: 0 };
  assert.equal(formatProgramFee(zero), "₹0");
  assert.equal(getProgramAnnualFeeLabel(zero), "Tuition per year");
  assert.equal(hasRenderableProgramAnnualFee(zero), true);
  assert.equal(formatProgramFee({ ...zero, officialAnnualTuitionAmount: 20000 }), "₹20,000");
  assert.equal(formatProgramFee({ ...offering, feeStatus: "indicative", indicativeAnnualTuitionMinUsd: 1000, indicativeAnnualTuitionMaxUsd: 2000 }), "$1,000–$2,000");
});

test("missing and malformed quote records fail closed; unknown zero never becomes a reported fee", () => {
  assert.equal(quoteSchema.parse(undefined), undefined);
  for (const patch of [
    { minAmount: 0 }, { minAmount: -1 }, { minAmount: NaN }, { minAmount: 1.5 }, { minAmount: Number.MAX_SAFE_INTEGER + 1 },
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
  for (const patch of [{ publicField: "fee" }, { sourceUrl: "https://other.example/fees" }, { sourceGrade: "C" }, { status: "verified" }, { status: "omit" }]) {
    assert.throws(() => assertReportedFeeQuoteEvidence(quote, [{ ...evidence, ...patch }], "example"), /reportedFeeQuote evidence/);
  }
  const confirmed = { ...quote, status: "confirmed" as const };
  assert.doesNotThrow(() => assertReportedFeeQuoteEvidence(confirmed, [{ ...evidence, status: "verified" }], "example"));
  assert.throws(() => assertReportedFeeQuoteEvidence(confirmed, [{ ...evidence, status: "verified", sourceGrade: "B" }], "example"), /Grade A verified/);
  assert.throws(() => assertReportedFeeQuoteEvidence(confirmed, [evidence], "example"), /Grade A verified/);
});

test("mobile finder receives formatted quote and preserves its numeric annual budget sentinel", () => {
  const card = mapFinderCardProgram({ university: { slug: "example", name: "Example", city: "Chennai", type: "Private", featured: false }, country: { name: "India", slug: "india" }, course: { shortName: "MSW", slug: "master-social-work" }, offering: { ...offering, slug: "example-msw", featured: false } });
  assert.equal(card.feeLabel, "₹55,000");
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
  assert.equal(dto.offerings[0].feeLabel, "₹55,000");
  assert.equal(dto.offerings[0].feeIsAnnual, false);
  assert.deepEqual(dto.offerings[0].feeLines, [{ label: "Fees", amount: "₹55,000" }]);
  assert.equal(dto.primaryOffering?.feeIsAnnual, false);
  assert.equal(dto.primaryOffering?.annualTuitionUsd, 0);
  assert.equal(hasAnnualFeeSuffix(dto.offerings[0], dto.offerings[0].feeLines[0].amount), false);

  const annual = { ...program, offering: { ...program.offering, feeStatus: "confirmed" as const, officialFeeCurrency: "INR", officialAnnualTuitionAmount: 0 } };
  const annualDto = mapUniversityDetail(university, "India", [annual]);
  assert.equal(annualDto.offerings[0].feeIsAnnual, true);
  assert.equal(annualDto.offerings[0].feeLabel, "₹0");
  assert.equal(hasAnnualFeeSuffix(annualDto.offerings[0], "₹0"), true);
  assert.equal(hasAnnualFeeSuffix({}, "₹20,000"), true); // Older API compatibility.
  assert.equal(hasAnnualFeeSuffix({}, "Fee on request"), false);
});
