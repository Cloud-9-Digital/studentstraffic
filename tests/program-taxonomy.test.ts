import assert from "node:assert/strict";
import test from "node:test";

import {
  canonicalProgrammes,
  getCanonicalProgramme,
  isApprovedCanonicalProgramme,
  programmeCategoryLabels,
} from "../lib/data/program-taxonomy";

test("canonical programme slugs and names are unique", () => {
  const slugs = canonicalProgrammes.map((programme) => programme.slug);
  const names = canonicalProgrammes.map((programme) => programme.name.toLocaleLowerCase("en-IN"));

  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(names).size, names.length);
});

test("canonical aliases do not duplicate another canonical name", () => {
  const canonicalNames = new Map(
    canonicalProgrammes.map((programme) => [programme.name.toLocaleLowerCase("en-IN"), programme.slug]),
  );

  for (const programme of canonicalProgrammes) {
    for (const alias of programme.aliases) {
      const conflictingSlug = canonicalNames.get(alias.toLocaleLowerCase("en-IN"));
      assert.ok(
        !conflictingSlug || conflictingSlug === programme.slug,
        `${alias} conflicts with ${conflictingSlug}`,
      );
    }
  }
});

test("canonical programme lookup accepts only approved slugs", () => {
  assert.equal(isApprovedCanonicalProgramme("mba-finance"), true);
  assert.equal(isApprovedCanonicalProgramme("random-engineering-course"), false);
  assert.equal(getCanonicalProgramme("mba-finance")?.name, "MBA in Finance");
  assert.equal(getCanonicalProgramme("random-engineering-course"), null);
});

test("medical postgraduate programmes use the Medical PG / Residency category", () => {
  assert.equal(programmeCategoryLabels.medicalPostgraduate, "Medical PG / Residency");
  assert.ok(
    canonicalProgrammes
      .filter((programme) => programme.stream === "medicine" && programme.level === "masters")
      .every((programme) => programme.aliases.some((alias) => /residency/i.test(alias))),
  );
});
