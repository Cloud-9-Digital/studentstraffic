import assert from "node:assert/strict";
import test from "node:test";

import { catalogPayloadSchema } from "../scripts/lib/catalog-payload-schema";
import {
  assertOfferingsLanguageFields,
  checkOfferingLanguageFields,
  isPlaceholderMedium,
  programmeMediumSchema,
} from "../scripts/lib/programme-medium";

test("placeholder mediums are rejected case-insensitively by the shared schema", () => {
  for (const value of ["Not confirmed", "NOT  CONFIRMED", "tbc", "TBC", "To be confirmed", "Unknown", "n/a", " N/A "]) {
    assert.equal(isPlaceholderMedium(value), true, value);
    const result = programmeMediumSchema.safeParse(value);
    assert.equal(result.success, false, `expected rejection for ${JSON.stringify(value)}`);
    assert.match(result.error?.issues.at(-1)?.message ?? "", /placeholder/);
  }
  assert.equal(isPlaceholderMedium("English"), false);
  assert.equal(programmeMediumSchema.safeParse("English / Russian").success, true);
});

test("catalogue payload schema re-exports the guarded medium schema", async () => {
  const module = await import("../scripts/lib/catalog-payload-schema");
  assert.equal(module.programmeMediumSchema, programmeMediumSchema);
  assert.ok(catalogPayloadSchema);
});

test("offering language check accepts valid fields and normalizes mediumNote", () => {
  const result = checkOfferingLanguageFields({
    medium: " English / Georgian ",
    instructionLanguages: ["english", "georgian"],
  });
  assert.deepEqual(result, {
    ok: true,
    value: { medium: "English / Georgian", mediumNote: null, instructionLanguages: ["english", "georgian"] },
  });

  const withNote = checkOfferingLanguageFields({
    medium: "English",
    mediumNote: "Clinical rotations require conversational Georgian.",
    instructionLanguages: ["english"],
  });
  assert.equal(withNote.ok && withNote.value.mediumNote, "Clinical rotations require conversational Georgian.");
});

test("offering language check reports missing medium, empty or unknown languages and bad notes", () => {
  const missing = checkOfferingLanguageFields({ instructionLanguages: [] });
  assert.equal(missing.ok, false);
  assert.ok(!missing.ok && missing.issues.some((issue) => /medium is missing/.test(issue)));
  assert.ok(!missing.ok && missing.issues.some((issue) => /instructionLanguages is missing or empty/.test(issue)));

  const unknownCode = checkOfferingLanguageFields({ medium: "English", instructionLanguages: ["english", "klingon"] });
  assert.ok(!unknownCode.ok && unknownCode.issues.some((issue) => /"klingon"/.test(issue)));

  const placeholder = checkOfferingLanguageFields({ medium: "Not confirmed", instructionLanguages: ["english"] });
  assert.ok(!placeholder.ok && placeholder.issues.some((issue) => /placeholder/.test(issue)));

  const shortNote = checkOfferingLanguageFields({ medium: "English", mediumNote: "short", instructionLanguages: ["english"] });
  assert.ok(!shortNote.ok && shortNote.issues.some((issue) => /mediumNote/.test(issue)));
});

test("assertOfferingsLanguageFields fails the whole batch and names every failing offering", () => {
  assert.throws(
    () =>
      assertOfferingsLanguageFields(
        [
          { label: "Entry 1 (good-programme)", input: { medium: "English", instructionLanguages: ["english"] } },
          { label: "Entry 2 (bad-medium)", input: { medium: "TBC", instructionLanguages: ["english"] } },
          { label: "Entry 3 (no-languages)", input: { medium: "English" } },
        ],
        "test-writer",
      ),
    (error: Error) => {
      assert.match(error.message, /2 programme offering\(s\) failed/);
      assert.match(error.message, /nothing was written/);
      assert.match(error.message, /Entry 2 \(bad-medium\)/);
      assert.match(error.message, /Entry 3 \(no-languages\)/);
      assert.doesNotMatch(error.message, /Entry 1/);
      assert.match(error.message, /content:reserve/);
      assert.match(error.message, /content:migrate/);
      return true;
    },
  );

  const values = assertOfferingsLanguageFields(
    [{ label: "ok", input: { medium: "English", instructionLanguages: ["english"] } }],
    "test-writer",
  );
  assert.deepEqual(values, [{ medium: "English", mediumNote: null, instructionLanguages: ["english"] }]);
});
