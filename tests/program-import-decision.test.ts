import test from "node:test";
import assert from "node:assert/strict";

import { resolveProgramImportAction } from "../lib/research/program-import-decision";

test("imports a new program for a brand-new (not yet published) university", () => {
  const result = resolveProgramImportAction({
    universityAlreadyPublished: false,
    courseAlreadyOfferedByUniversity: false,
    existingProgramPublished: false,
  });

  assert.deepEqual(result, { action: "import" });
});

test("imports a new course (e.g. Pharmacy) for an already-published university that doesn't yet offer it", () => {
  const result = resolveProgramImportAction({
    universityAlreadyPublished: true,
    courseAlreadyOfferedByUniversity: false,
    existingProgramPublished: false,
  });

  assert.deepEqual(result, { action: "import" });
});

test("skips a course the published university already offers, never touching the existing program", () => {
  const result = resolveProgramImportAction({
    universityAlreadyPublished: true,
    courseAlreadyOfferedByUniversity: true,
    existingProgramPublished: true,
  });

  assert.deepEqual(result, { action: "skip", reason: "course-already-offered" });
});

test("skips an already-published program matched by slug, even for a non-published university", () => {
  const result = resolveProgramImportAction({
    universityAlreadyPublished: false,
    courseAlreadyOfferedByUniversity: false,
    existingProgramPublished: true,
  });

  assert.deepEqual(result, { action: "skip", reason: "program-already-published" });
});

test("Dai Nam University scenario: MBBS untouched, Pharmacy added", () => {
  // MBBS already exists and is published for this university.
  const mbbsDecision = resolveProgramImportAction({
    universityAlreadyPublished: true,
    courseAlreadyOfferedByUniversity: true,
    existingProgramPublished: true,
  });
  assert.equal(mbbsDecision.action, "skip");

  // Pharmacy is a new course this university doesn't offer yet.
  const pharmacyDecision = resolveProgramImportAction({
    universityAlreadyPublished: true,
    courseAlreadyOfferedByUniversity: false,
    existingProgramPublished: false,
  });
  assert.equal(pharmacyDecision.action, "import");
});
