import assert from "node:assert/strict";
import test from "node:test";

import type { FinderProgram, ProgramOffering } from "@/lib/data/types";
import { catalogPayloadSchema } from "../scripts/lib/catalog-payload-schema";
import { getProgramOfferingStructuredData } from "@/lib/structured-data";
import {
  formatProgramAnnualFee,
  getProgramAnnualFeeLabel,
  getProgramFeeLines,
  hasOfficialFeeAmount,
  hasPublishedUsdAmount,
  hasRenderableProgramAnnualFee,
  hasRenderableProgramFee,
} from "@/lib/utils";

const offering = {
  slug: "example-ba-history",
  title: "B.A. History",
  durationYears: 3,
  feeStatus: "confirmed",
  feeAcademicYear: "2026–27",
  feeAudience: "domestic",
  officialAnnualTuitionAmount: 0,
  officialFeeCurrency: "INR",
  annualTuitionUsd: 0,
  totalTuitionUsd: 0,
  medium: "English",
  instructionLanguages: ["english"],
  intakeCodes: [],
  yearlyCostBreakdown: [],
  published: true,
  feeNotes: "NIL tuition for this aided route. Admission, examination and other compulsory charges remain payable.",
} as unknown as ProgramOffering;

const program = {
  country: { slug: "india", name: "India" },
  university: { slug: "example-college", name: "Example College", city: "Chennai" },
  course: { slug: "ba-history", shortName: "B.A. History" },
  offering,
} as FinderProgram;

const feeSchema = catalogPayloadSchema.shape.universities.element.shape.programmes.element.shape.fee;
const fee = {
  status: "confirmed",
  audience: "domestic",
  academicYear: "2026–27",
  officialFeeCurrency: "INR",
  officialAnnualTuitionAmount: 0,
  verifiedAt: "2026-10-25",
  notes: offering.feeNotes,
};

test("confirmed native NIL tuition renders zero with audience and tuition labels", () => {
  assert.equal(formatProgramAnnualFee(offering), "₹0");
  assert.equal(getProgramAnnualFeeLabel(offering), "Tuition per year");
  assert.equal(hasRenderableProgramFee(offering), true);
  assert.equal(hasRenderableProgramAnnualFee(offering), true);
  assert.deepEqual(getProgramFeeLines(offering, "india"), [{ label: "Indian students", amount: "₹0" }]);
  assert.equal(hasPublishedUsdAmount(0), false);
  assert.equal(hasOfficialFeeAmount(0, "INR"), false);
  assert.equal(hasOfficialFeeAmount(0, "INR", "confirmed"), true);
});

test("zero Offer describes annual tuition only and never invents a total or free course", () => {
  const schema = getProgramOfferingStructuredData(program);
  assert.equal(schema.offers?.price, 0);
  assert.equal(schema.offers?.priceCurrency, "INR");
  assert.equal(schema.offers?.priceSpecification.price, 0);
  assert.match(schema.offers?.description ?? "", /tuition only.*compulsory fees/);
  assert.match(schema.offers?.description ?? "", /Admission, examination and other compulsory charges remain payable/);
  assert.notEqual(schema.offers?.category, "Free");
  const parsed = feeSchema.parse(fee);
  assert.equal(parsed.status, "confirmed");
  if (parsed.status === "confirmed") assert.equal(parsed.officialTotalTuitionAmount, undefined);
  assert.equal(offering.totalTuitionUsd, 0); // Remains an unknown sentinel; no annual×duration total.
});

test("on-request, indicative and legacy USD placeholders do not become confirmed zero", () => {
  for (const patch of [
    { feeStatus: "on_request" as const },
    { feeStatus: "indicative" as const },
    { feeStatus: undefined },
    { officialFeeCurrency: undefined },
    { officialFeeCurrency: "???" },
    { officialAnnualTuitionAmount: undefined },
  ]) {
    const unknown = { ...offering, ...patch };
    assert.equal(formatProgramAnnualFee(unknown), "Fee plan on request");
    assert.equal(hasRenderableProgramAnnualFee(unknown), false);
    assert.equal(getProgramOfferingStructuredData({ ...program, offering: unknown }).offers, undefined);
  }
});

test("payload accepts only explicit confirmed native zero and rejects negatives and USD sentinels", () => {
  assert.equal(feeSchema.safeParse(fee).success, true);
  assert.equal(feeSchema.safeParse({ ...fee, officialTotalTuitionAmount: 0 }).success, true);
  for (const patch of [
    { officialAnnualTuitionAmount: -1 },
    { officialTotalTuitionAmount: -1 },
    { officialFeeCurrency: "???" },
    { officialFeeCurrency: undefined },
    { officialAnnualTuitionAmount: undefined },
    { annualTuitionUsd: 0 },
    { totalTuitionUsd: 0 },
  ]) assert.equal(feeSchema.safeParse({ ...fee, ...patch }).success, false);
  assert.equal(feeSchema.safeParse({ status: "indicative", academicYear: "2026–27", annualTuitionMinUsd: 0, annualTuitionMaxUsd: 100, verifiedAt: "2026-10-25", notes: fee.notes }).success, false);
});

test("existing positive annual tuition retains its normalized display and paid Offer", () => {
  const positive = { ...offering, officialAnnualTuitionAmount: 100000, annualTuitionUsd: 1200 };
  assert.match(formatProgramAnnualFee(positive), /1,200/);
  assert.equal(getProgramOfferingStructuredData({ ...program, offering: positive }).offers?.category, "Paid");
  assert.equal(getProgramOfferingStructuredData({ ...program, offering: positive }).offers?.price, 100000);
});
