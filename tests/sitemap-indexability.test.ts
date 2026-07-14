import assert from "node:assert/strict";
import test from "node:test";

import {
  getIndexableProgramSections,
  getIndexableUniversitySections,
} from "../lib/sitemap-indexability";

test("program sitemaps promote only sections supported by their source data", () => {
  assert.deepEqual(
    getIndexableProgramSections({
      hasAdmissionsContent: false,
      hasSpecificIntakeSources: false,
      hasAudienceRestrictions: false,
      hasRecognitionEvidence: false,
      hasVerifiedDetailedFees: false,
    }),
    [],
  );

  assert.deepEqual(
    getIndexableProgramSections({
      hasAdmissionsContent: false,
      hasSpecificIntakeSources: true,
      hasAudienceRestrictions: true,
      hasRecognitionEvidence: true,
      hasVerifiedDetailedFees: false,
    }),
    ["admissions", "eligibility", "recognition"],
  );

  assert.deepEqual(
    getIndexableProgramSections({
      hasAdmissionsContent: true,
      hasSpecificIntakeSources: false,
      hasAudienceRestrictions: false,
      hasRecognitionEvidence: false,
      hasVerifiedDetailedFees: true,
    }),
    ["admissions", "eligibility", "fees"],
  );
});

test("university sitemaps keep each section behind its own content threshold", () => {
  assert.deepEqual(
    getIndexableUniversitySections({
      hasPublishedPrograms: false,
      hasSubstantialStudentLife: false,
      hasSubstantialHostel: false,
      hasSubstantialFaq: false,
    }),
    [],
  );

  assert.deepEqual(
    getIndexableUniversitySections({
      hasPublishedPrograms: true,
      hasSubstantialStudentLife: true,
      hasSubstantialHostel: false,
      hasSubstantialFaq: true,
    }),
    ["programs", "student-life", "faq"],
  );
});
