import assert from "node:assert/strict";
import test from "node:test";

import {
  programmeMediumNoteSchema,
  programmeMediumSchema,
} from "../scripts/lib/catalog-payload-schema";
import { formatProgramMedium, isPlaceholderProgramMedium } from "../lib/utils";

test("programme medium accepts short language labels", () => {
  for (const label of ["English", "English / Russian", "Catalan / English / Spanish"]) {
    assert.equal(programmeMediumSchema.parse(label), label);
  }
  assert.equal(programmeMediumSchema.parse("  English  "), "English");
});

test("programme medium rejects sentence-like or long values and points to mediumNote", () => {
  const rejected = [
    "E",
    "English (clinical years in Russian)",
    "English; Georgian for clinical rotations",
    "English. Years 4-6 are taught in Russian",
    "Primary language: English",
    "English\nRussian",
    "English / Russian / Kazakh / Uzbek / Kyrgyz / Tajik",
  ];
  for (const value of rejected) {
    const result = programmeMediumSchema.safeParse(value);
    assert.equal(result.success, false, `expected rejection for ${JSON.stringify(value)}`);
    if (value.length > 1) {
      assert.match(result.error?.issues[0]?.message ?? "", /mediumNote/);
    }
  }
});

test("programme mediumNote is optional but bounded when present", () => {
  assert.equal(programmeMediumNoteSchema.safeParse(undefined).success, true);
  assert.equal(programmeMediumNoteSchema.safeParse(null).success, true);
  assert.equal(
    programmeMediumNoteSchema.safeParse(
      "Years 1-3 are taught in English; clinical rotations require working Russian.",
    ).success,
    true,
  );
  assert.equal(programmeMediumNoteSchema.safeParse("Too short").success, false);
  assert.equal(programmeMediumNoteSchema.safeParse("x".repeat(301)).success, false);
});

test("formatProgramMedium keeps labels and shortens legacy sentences", () => {
  assert.equal(formatProgramMedium("English / Russian"), "English / Russian");
  assert.equal(formatProgramMedium("English + Local Support", "georgia"), "English, Georgian");
  assert.equal(
    formatProgramMedium("English (Russian required from year 3 for clinical practice)"),
    "English",
  );
  assert.equal(
    formatProgramMedium("English-taught programme; local language classes are compulsory"),
    "English-taught programme",
  );
});

test("isPlaceholderProgramMedium detects placeholder values case-insensitively", () => {
  for (const value of [
    "Not confirmed",
    "  not CONFIRMED ",
    "TBC",
    "To be confirmed",
    "Unknown",
    "N/A",
    "",
    "   ",
    null,
    undefined,
  ]) {
    assert.equal(isPlaceholderProgramMedium(value), true, `expected placeholder: ${JSON.stringify(value)}`);
  }
  for (const value of ["English", "English / Russian", "Uzbek", "Not confirmed English"]) {
    assert.equal(isPlaceholderProgramMedium(value), false, `expected real label: ${JSON.stringify(value)}`);
  }
});

test("formatProgramMedium returns null for placeholders and never guesses a language", () => {
  for (const value of ["Not confirmed", "not confirmed", "TBC", "Unknown", "n/a", "", null, undefined]) {
    assert.equal(formatProgramMedium(value, "georgia"), null);
  }
  // A placeholder hidden inside a legacy sentence is still suppressed after shortening.
  assert.equal(formatProgramMedium("Not confirmed (awaiting university reply)"), null);
});
