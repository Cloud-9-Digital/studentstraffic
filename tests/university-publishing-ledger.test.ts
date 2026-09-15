import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  assertMigrationLedgerEligibility,
  ledgerColumns,
  mutateUniversityPublishingLedger,
  parseUniversityPublishingLedger,
  readUniversityPublishingLedger,
  serializeUniversityPublishingLedger,
  validateUniversityPublishingLedger,
  type UniversityPublishingLedgerRow,
} from "../scripts/lib/university-publishing-ledger";
import { reserveContentMigration } from "../scripts/reserve-content-migration";

function row(overrides: Partial<UniversityPublishingLedgerRow> = {}): UniversityPublishingLedgerRow {
  return {
    university_slug: "test-university",
    university_name: "Test University",
    country_slug: "test-country",
    status: "validated",
    owner_agent_id: "codex-test",
    claimed_at: "2026-07-25T00:00:00.000Z",
    published_at: "",
    programme_count: "1",
    payload_file: "content-migrations/0004-test/payload.json",
    published_url: "",
    notes: "Validated offline, with commas preserved.",
    batch_id: "batch-001",
    priority: "high",
    migration_id: "0004-test",
    ...overrides,
  };
}

test("serializes quoted notes and parses every shared queue column", () => {
  const serialized = serializeUniversityPublishingLedger([row()]);
  const { rows } = parseUniversityPublishingLedger(serialized);
  assert.deepEqual(rows, [row()]);
  assert.equal(serialized.split("\n")[0], ledgerColumns.join(","));
});

test("recovers historical unquoted commas in the notes column", () => {
  const legacy = `${ledgerColumns.join(",")}\nlegacy-university,Legacy University,test-country,published,legacy-agent,2026-07-01T00:00:00Z,2026-07-02T00:00:00Z,2,payload.json,https://example.com,Published medicine, engineering, and business programmes.\n`;
  const { rows } = parseUniversityPublishingLedger(legacy);
  assert.equal(rows[0]?.notes, "Published medicine, engineering, and business programmes.");
  assert.equal(rows[0]?.priority, "");
});

test("locked concurrent mutations preserve both claims", async () => {
  const root = await mkdtemp(join(tmpdir(), "studentstraffic-ledger-"));
  const ledgerPath = join(root, "ledger.csv");
  await writeFile(ledgerPath, serializeUniversityPublishingLedger([]));
  try {
    await Promise.all([
      mutateUniversityPublishingLedger((rows) => rows.push(row()), { ledgerPath }),
      mutateUniversityPublishingLedger((rows) => rows.push(row({
        university_slug: "second-university",
        university_name: "Second University",
        migration_id: "0005-second",
        payload_file: "content-migrations/0005-second/payload.json",
      })), { ledgerPath }),
    ]);
    const { rows } = await readUniversityPublishingLedger(ledgerPath);
    assert.deepEqual(rows.map((item) => item.university_slug).sort(), ["second-university", "test-university"]);
    assert.equal(validateUniversityPublishingLedger(rows).filter((issue) => issue.level === "error").length, 0);
    assert.match(await readFile(ledgerPath, "utf8"), /Validated offline, with commas preserved\./);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("migration eligibility requires one validated row and matching migration metadata", () => {
  assert.doesNotThrow(() => assertMigrationLedgerEligibility([row()], {
    id: "0004-test",
    payloadPath: "C:/repo/content-migrations/0004-test/payload.json",
    universitySlugs: ["test-university"],
  }));
  assert.throws(() => assertMigrationLedgerEligibility([row({ status: "researching" })], {
    id: "0004-test",
    payloadPath: "C:/repo/content-migrations/0004-test/payload.json",
    universitySlugs: ["test-university"],
  }), /cannot apply/);
});

test("supersede rule: earlier bundles are historical once the ledger points at the newest bundle", () => {
  const latestMigrationIdBySlug = new Map([["test-university", "0009-test-correction"]]);
  const correctedRow = row({
    status: "validated",
    migration_id: "0009-test-correction",
    payload_file: "content-migrations/0009-test-correction/payload.json",
  });
  const earlier = {
    id: "0004-test",
    payloadPath: "C:/repo/content-migrations/0004-test/payload.json",
    universitySlugs: ["test-university"],
  };
  const superseding = {
    id: "0009-test-correction",
    payloadPath: "C:/repo/content-migrations/0009-test-correction/payload.json",
    universitySlugs: ["test-university"],
  };

  // Superseded earlier bundle passes eligibility.
  assert.doesNotThrow(() => assertMigrationLedgerEligibility([correctedRow], earlier, { latestMigrationIdBySlug }));
  // Superseding bundle passes with the ledger pointing at it.
  assert.doesNotThrow(() => assertMigrationLedgerEligibility([correctedRow], superseding, { latestMigrationIdBySlug }));
  // A published row pointing at the newest bundle is equally valid.
  assert.doesNotThrow(() =>
    assertMigrationLedgerEligibility([{ ...correctedRow, status: "published" }], earlier, { latestMigrationIdBySlug }),
  );
});

test("supersede rule: a ledger row left on the old bundle while a newer bundle exists is a clear error", () => {
  const latestMigrationIdBySlug = new Map([["test-university", "0009-test-correction"]]);
  const staleRow = row();
  assert.throws(
    () => assertMigrationLedgerEligibility([staleRow], {
      id: "0004-test",
      payloadPath: "C:/repo/content-migrations/0004-test/payload.json",
      universitySlugs: ["test-university"],
    }, { latestMigrationIdBySlug }),
    /still points at superseded content migration '0004-test'.*later bundle '0009-test-correction'/,
  );
  assert.throws(
    () => assertMigrationLedgerEligibility([staleRow], {
      id: "0009-test-correction",
      payloadPath: "C:/repo/content-migrations/0009-test-correction/payload.json",
      universitySlugs: ["test-university"],
    }, { latestMigrationIdBySlug }),
    /still points at earlier content migration '0004-test'.*'0009-test-correction' is the newest bundle/,
  );
  // A row pointing at an unrelated bundle is still a conflict for the historical bundle.
  assert.throws(
    () => assertMigrationLedgerEligibility([row({ migration_id: "0007-other", payload_file: "" })], {
      id: "0004-test",
      payloadPath: "C:/repo/content-migrations/0004-test/payload.json",
      universitySlugs: ["test-university"],
    }, { latestMigrationIdBySlug }),
    /superseded by '0009-test-correction'.*ledger points at '0007-other'/,
  );
});

test("concurrent content migration reservations receive different sequence numbers", async () => {
  const root = await mkdtemp(join(tmpdir(), "studentstraffic-reservations-"));
  try {
    const reservations = await Promise.all([
      reserveContentMigration({
        root,
        name: "codex-batch",
        description: "Reserve the Codex research batch migration.",
        createdAt: new Date("2026-07-25T00:00:00.000Z"),
      }),
      reserveContentMigration({
        root,
        name: "claude-batch",
        description: "Reserve the Claude research batch migration.",
        createdAt: new Date("2026-07-25T00:00:00.000Z"),
      }),
    ]);
    assert.deepEqual(reservations.map((reservation) => reservation.id.slice(0, 4)).sort(), ["0001", "0002"]);
    for (const reservation of reservations) {
      const manifest = JSON.parse(await readFile(join(reservation.directory, "manifest.json"), "utf8"));
      assert.equal(manifest.id, reservation.id);
      assert.equal(manifest.payload, "payload.json");
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
