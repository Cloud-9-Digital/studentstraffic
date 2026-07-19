import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  contentMigrationChecksum,
  readContentMigrations,
} from "../scripts/lib/content-migrations";

const courseSummary = "Verified MBBS catalogue information for students. ".repeat(5);
const universitySummary = "Test University is a public institution in Test City with a verified academic profile for this migration validation fixture. ".repeat(3);
const cityProfile = "Test City provides local context, practical services, and a verified environment for prospective students using this complete content-migration validation fixture. ".repeat(2);
const practicalExposure = "The official programme pages describe supervised academic and practical learning opportunities that meet the content-migration fixture requirements and are backed by the source bundle. ".repeat(2);

const validPayload = {
  countries: [],
  courses: [
    {
      slug: "mbbs",
      name: "Bachelor of Medicine, Bachelor of Surgery",
      shortName: "MBBS",
      stream: "medicine",
      level: "bachelors",
      discipline: "Medicine",
      aliases: ["MBBS"],
      displayOrder: 1,
      durationYears: 6,
      summary: courseSummary,
      metaTitle: "MBBS course information for students",
      metaDescription: "Verified MBBS course information, admissions guidance, course structure, fees, and application support for prospective students.",
    },
  ],
  universities: [
    {
      countrySlug: "test-country",
      slug: "test-university",
      name: "Test University",
      city: "Test City",
      type: "Public",
      establishedYear: 1950,
      officialWebsite: "https://example.edu",
      summary: universitySummary,
      campusLifestyle: "Verified campus facilities and student services are described in the official source bundle.",
      cityProfile,
      practicalExposure,
      hostelOverview: "Official accommodation information is included in the source bundle for this validation fixture.",
      dietarySupport: "Official student support information is included in the source bundle for this validation fixture.",
      safetyOverview: "Official safety and support information is included in the source bundle for this validation fixture.",
      studentSupport: "Official student support services are included in the source bundle for this validation fixture.",
      whyChoose: ["Verified academic information.", "Verified student services.", "Verified programme details."],
      thingsToConsider: ["Confirm current fees.", "Check programme eligibility.", "Review official application instructions."],
      bestFitFor: ["Students with a verified academic fit.", "Applicants who meet official eligibility.", "Students seeking the listed programme."],
      industryPartners: [],
      recognitionBadges: ["Test regulator accreditation", "Test quality assurance status"],
      recognitionLinks: [
        { label: "Test regulator", url: "https://example.edu/regulator" },
        { label: "Test quality body", url: "https://example.edu/quality" },
      ],
      faq: Array.from({ length: 6 }, (_, index) => ({
        question: `What is verified question ${index + 1} for this university?`,
        answer: "This fixture answer is sufficiently detailed to satisfy the catalogue validation rules without asserting an unsupported real-world fact.",
      })),
      researchSources: [
        "official-university",
        "official-program",
        "official-fee",
        "recognition",
      ].map((kind) => ({
        label: `Test ${kind} source`,
        url: `https://example.edu/${kind}`,
        kind,
        checkedAt: "2026-07-19",
      })),
      admissionsContent: {},
      programmes: [
        {
          slug: "test-university-mbbs",
          canonicalCourseSlug: "mbbs",
          officialTitle: "Bachelor of Medicine, Bachelor of Surgery",
          durationYears: 6,
          officialFeeCurrency: "USD",
          officialAnnualTuitionAmount: 10000,
          officialTotalTuitionAmount: 60000,
          officialProgramUrl: "https://example.edu/mbbs",
          audienceEligibility: {
            availability: "global",
            eligibleAudiences: ["International applicants"],
            restrictions: [],
            verifiedAt: "2026-07-19",
            sourceUrl: "https://example.edu/mbbs",
          },
          admissionsContent: {
            overview: "This verified test fixture supplies programme-specific admissions information for validation.",
            eligibility: { intro: "Applicants must meet the official academic requirements listed by the university.", items: ["Official academic qualification"] },
            applicationSteps: ["Review the official programme page.", "Submit the required application documents."],
            documentsRequired: { academic: ["Academic transcript"], application: ["Application form"] },
          },
          medium: "English",
          intakeMonths: ["September"],
          feeVerifiedAt: "2026-07-19",
          feeNotes: "This test fixture includes a verified fee note of sufficient length for schema validation.",
          teachingPhases: [{ phase: "Foundation", language: "English", details: "Official programme structure." }],
          sourceUrls: ["https://example.edu/mbbs", "https://example.edu/fees"],
        },
      ],
    },
  ],
};

async function withTemporaryMigrations(run: (root: string) => Promise<void>) {
  const root = await mkdtemp(join(tmpdir(), "studentstraffic-content-migrations-"));
  try {
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("discovers numbered content migrations in sequence and hashes their immutable inputs", async () => {
  await withTemporaryMigrations(async (root) => {
    const migrationDirectory = join(root, "0001-test-university");
    await mkdir(migrationDirectory);
    const manifest = JSON.stringify({
      version: 1,
      id: "0001-test-university",
      description: "Publish the complete test university fixture.",
      createdAt: "2026-07-19",
      payload: "payload.json",
    });
    const payload = JSON.stringify(validPayload);
    await writeFile(join(migrationDirectory, "manifest.json"), manifest);
    await writeFile(join(migrationDirectory, "payload.json"), payload);

    const migrations = await readContentMigrations(root);

    assert.equal(migrations.length, 1);
    assert.equal(migrations[0]?.id, "0001-test-university");
    assert.equal(migrations[0]?.checksum, contentMigrationChecksum(manifest, payload));
  });
});

test("rejects a bundle whose manifest id does not match its sequence directory", async () => {
  await withTemporaryMigrations(async (root) => {
    const migrationDirectory = join(root, "0001-test-university");
    await mkdir(migrationDirectory);
    await writeFile(join(migrationDirectory, "manifest.json"), JSON.stringify({
      version: 1,
      id: "0002-test-university",
      description: "Publish the complete test university fixture.",
      createdAt: "2026-07-19",
      payload: "payload.json",
    }));
    await writeFile(join(migrationDirectory, "payload.json"), JSON.stringify(validPayload));

    await assert.rejects(readContentMigrations(root), /must use the directory name/);
  });
});
