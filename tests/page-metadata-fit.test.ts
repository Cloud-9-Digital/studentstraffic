import assert from "node:assert/strict";
import test from "node:test";

import { buildIndexableMetadata, fitPageDescription, fitPageTitle } from "@/lib/metadata";

test("hub titles drop trailing keyword segments to fit 60 characters", () => {
  assert.equal(
    fitPageTitle("MBBS in Georgia for Indian Students 2026 | Fees, Universities, English Medium"),
    "MBBS in Georgia for Indian Students 2026",
  );
  assert.equal(
    fitPageTitle("MBBS: Compare Entry and Fees | Countries, Universities, Fees & Eligibility"),
    "MBBS: Compare Entry and Fees",
  );
  assert.equal(fitPageTitle("Research Methodology | Students Traffic"), "Research Methodology");
});

test("a title that names the brand mid-way stays absolute and is not doubled", () => {
  const metadata = buildIndexableMetadata({
    title: "About Students Traffic | Global Study Abroad Guidance",
    description: "About us.",
    path: "/about",
  });
  assert.deepEqual(metadata.title, { absolute: "About Students Traffic | Global Study Abroad Guidance" });
});

test("descriptions drop whole trailing sentences to fit 155 characters", () => {
  const long =
    "Compare medical colleges in Chennai with fees, recognition and admission steps for Indian students planning MBBS abroad this year. Free counselling with experts. Call now for help.";
  const fitted = fitPageDescription(long);
  assert.ok(fitted.length <= 155, fitted);
  assert.ok(fitted.endsWith("."), fitted);
  assert.ok(long.startsWith(fitted));
});
