import assert from "node:assert/strict";
import test from "node:test";

import {
  getIntakeMonthLabel,
  getTeachingLanguageLabel,
  normalizeIntakeMonthCode,
  normalizeTeachingLanguageCode,
  sortIntakeMonthCodes,
  sortTeachingLanguageCodes,
} from "@/lib/catalogue-facets";
import { normalizeFinderFilters } from "@/lib/filters";

test("normalizes legacy finder values to canonical facet codes", () => {
  assert.equal(normalizeIntakeMonthCode("Sept."), "september");
  assert.equal(normalizeIntakeMonthCode("Fall"), undefined);
  assert.equal(normalizeTeachingLanguageCode("English"), "english");
  assert.equal(
    normalizeFinderFilters({ medium: "English", intake: "September" }).medium,
    "english",
  );
  assert.equal(
    normalizeFinderFilters({ medium: "English", intake: "September" }).intake,
    "september",
  );
  assert.deepEqual(
    normalizeFinderFilters({
      country: "georgia",
      city: "Tbilisi",
      level: "masters",
    }),
    {
      country: "georgia",
      city: "Tbilisi",
      level: "masters",
      feeMin: undefined,
      feeMax: undefined,
      q: undefined,
      course: undefined,
      medium: undefined,
      intake: undefined,
      universityType: undefined,
      sort: undefined,
    },
  );
});

test("uses stable labels and chronological intake order", () => {
  assert.deepEqual(
    sortIntakeMonthCodes(["september", "january", "april"]),
    ["january", "april", "september"],
  );
  assert.equal(getIntakeMonthLabel("september"), "September");
  assert.equal(getTeachingLanguageLabel("english"), "English");
});

test("supports Indian teaching languages used by language programmes", () => {
  for (const [code, label] of [
    ["hindi", "Hindi"],
    ["sanskrit", "Sanskrit"],
    ["telugu", "Telugu"],
    ["urdu", "Urdu"],
  ] as const) {
    assert.equal(normalizeTeachingLanguageCode(label), code);
    assert.equal(getTeachingLanguageLabel(code), label);
  }
});


test("preserves Tamil as a distinct facet for mixed English and Tamil programmes", () => {
  assert.equal(normalizeTeachingLanguageCode(" Tamil "), "tamil");
  assert.equal(getTeachingLanguageLabel("tamil"), "Tamil");
  assert.equal(normalizeFinderFilters({ medium: "Tamil" }).medium, "tamil");
  assert.deepEqual(sortTeachingLanguageCodes(["tamil", "english", "tamil"]), ["english", "tamil"]);
  assert.equal(normalizeTeachingLanguageCode("English / Tamil"), undefined);
});
