import { open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";

export const ledgerStatuses = [
  "claimed",
  "researching",
  "held",
  "validated",
  "published",
  "abandoned",
] as const;

export const ledgerPriorities = ["high", "medium", "low"] as const;

export const ledgerColumns = [
  "university_slug",
  "university_name",
  "country_slug",
  "status",
  "owner_agent_id",
  "claimed_at",
  "published_at",
  "programme_count",
  "payload_file",
  "published_url",
  "notes",
  "batch_id",
  "priority",
  "migration_id",
] as const;

export type LedgerStatus = (typeof ledgerStatuses)[number];
export type LedgerPriority = (typeof ledgerPriorities)[number];
export type LedgerColumn = (typeof ledgerColumns)[number];
export type UniversityPublishingLedgerRow = Record<LedgerColumn, string>;

export type LedgerIssue = {
  level: "error" | "warning";
  row?: number;
  message: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const migrationIdPattern = /^\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const activeStatuses = new Set<LedgerStatus>(["claimed", "researching"]);

function parseCsv(input: string) {
  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      record.push(field);
      field = "";
    } else if (character === "\n") {
      record.push(field.replace(/\r$/, ""));
      if (record.some((value) => value.length > 0)) records.push(record);
      record = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("Publishing ledger contains an unterminated quoted field.");
  if (field.length > 0 || record.length > 0) {
    record.push(field.replace(/\r$/, ""));
    if (record.some((value) => value.length > 0)) records.push(record);
  }
  return records;
}

function quoteCsv(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function serializeUniversityPublishingLedger(rows: UniversityPublishingLedgerRow[]) {
  return [
    ledgerColumns.join(","),
    ...rows.map((row) => ledgerColumns.map((column) => quoteCsv(row[column] ?? "")).join(",")),
  ].join("\n") + "\n";
}

export function normalizeUniversityIdentity(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function parseUniversityPublishingLedger(input: string) {
  const records = parseCsv(input);
  if (records.length === 0) throw new Error("Publishing ledger is empty.");
  const header = records[0] ?? [];
  const missingColumns = ledgerColumns.filter((column) => !header.includes(column));
  const unknownColumns = header.filter((column) => !ledgerColumns.includes(column as LedgerColumn));
  if (missingColumns.length || unknownColumns.length) {
    throw new Error(
      `Publishing ledger header mismatch. Missing: ${missingColumns.join(", ") || "none"}; unknown: ${unknownColumns.join(", ") || "none"}.`,
    );
  }

  const rows = records.slice(1).map((rawValues) => {
    const hasCanonicalExtendedColumns =
      rawValues.length === ledgerColumns.length &&
      (!rawValues[12] || ledgerPriorities.includes(rawValues[12] as LedgerPriority)) &&
      (!rawValues[13] || migrationIdPattern.test(rawValues[13]));
    // Before the shared queue existed, many historical notes contained unquoted
    // commas. The first ten fields were always structural and everything after
    // them was the note. Recover those rows once, then the next locked mutation
    // rewrites the file in canonical RFC-4180 form.
    const values = hasCanonicalExtendedColumns
      ? rawValues
      : [...rawValues.slice(0, 10), rawValues.slice(10).join(","), "", "", ""];
    const row = Object.fromEntries(ledgerColumns.map((column) => [column, ""])) as UniversityPublishingLedgerRow;
    header.forEach((column, index) => {
      row[column as LedgerColumn] = values[index] ?? "";
    });
    return row;
  });
  return { rows, rawRecords: records };
}

export function validateUniversityPublishingLedger(
  rows: UniversityPublishingLedgerRow[],
  options: { now?: Date; staleAfterDays?: number } = {},
) {
  const issues: LedgerIssue[] = [];
  const slugs = new Map<string, number>();
  const names = new Map<string, number>();
  const now = options.now ?? new Date();
  const staleAfterMs = (options.staleAfterDays ?? 7) * 24 * 60 * 60 * 1000;

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    if (!slugPattern.test(row.university_slug)) {
      issues.push({ level: "error", row: rowNumber, message: `Invalid university slug '${row.university_slug}'.` });
    }
    if (!row.university_name.trim()) {
      issues.push({ level: "error", row: rowNumber, message: "University name is required." });
    }
    if (!slugPattern.test(row.country_slug)) {
      issues.push({ level: "error", row: rowNumber, message: `Invalid country slug '${row.country_slug}'.` });
    }
    if (!ledgerStatuses.includes(row.status as LedgerStatus)) {
      issues.push({ level: "error", row: rowNumber, message: `Invalid status '${row.status}'.` });
    }
    if (row.priority && !ledgerPriorities.includes(row.priority as LedgerPriority)) {
      issues.push({ level: "error", row: rowNumber, message: `Invalid priority '${row.priority}'.` });
    }
    if (row.migration_id && !migrationIdPattern.test(row.migration_id)) {
      issues.push({ level: "error", row: rowNumber, message: `Invalid migration id '${row.migration_id}'.` });
    }
    if ((row.status === "claimed" || row.status === "researching") && (!row.owner_agent_id || !row.claimed_at)) {
      issues.push({ level: "error", row: rowNumber, message: `${row.status} rows require owner_agent_id and claimed_at.` });
    }
    if (row.status === "validated" && !row.payload_file) {
      issues.push({ level: "error", row: rowNumber, message: "Validated rows require payload_file." });
    }

    const existingSlugRow = slugs.get(row.university_slug);
    if (existingSlugRow) {
      issues.push({ level: "error", row: rowNumber, message: `Duplicate university slug; first appears on row ${existingSlugRow}.` });
    } else {
      slugs.set(row.university_slug, rowNumber);
    }

    const normalizedName = normalizeUniversityIdentity(row.university_name);
    const existingNameRow = names.get(normalizedName);
    if (normalizedName && existingNameRow) {
      issues.push({ level: "error", row: rowNumber, message: `Duplicate normalized university name; first appears on row ${existingNameRow}.` });
    } else if (normalizedName) {
      names.set(normalizedName, rowNumber);
    }

    if (activeStatuses.has(row.status as LedgerStatus) && row.claimed_at) {
      const claimedAt = new Date(row.claimed_at);
      if (Number.isNaN(claimedAt.getTime())) {
        issues.push({ level: "error", row: rowNumber, message: `Invalid claimed_at timestamp '${row.claimed_at}'.` });
      } else if (now.getTime() - claimedAt.getTime() > staleAfterMs) {
        issues.push({ level: "warning", row: rowNumber, message: `${row.status} claim is older than ${options.staleAfterDays ?? 7} days.` });
      }
    }
  });

  return issues;
}

export async function readUniversityPublishingLedger(
  ledgerPath = "research/university-publishing-ledger.csv",
) {
  const absolutePath = resolve(ledgerPath);
  const raw = await readFile(absolutePath, "utf8");
  const parsed = parseUniversityPublishingLedger(raw);
  return { ...parsed, path: absolutePath };
}

async function wait(milliseconds: number) {
  await new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

async function acquireLock(path: string, timeoutMs: number) {
  const startedAt = Date.now();
  while (true) {
    try {
      const handle = await open(path, "wx");
      await handle.writeFile(JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }));
      return handle;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      try {
        const lock = JSON.parse(await readFile(path, "utf8")) as { createdAt?: string };
        const createdAt = lock.createdAt ? new Date(lock.createdAt).getTime() : Number.NaN;
        if (!Number.isNaN(createdAt) && Date.now() - createdAt > 60_000) {
          await unlink(path);
          continue;
        }
      } catch {
        // Another process may be creating or releasing the lock; retry below.
      }
      if (Date.now() - startedAt >= timeoutMs) {
        throw new Error(`Timed out waiting for publishing-ledger lock ${basename(path)}.`);
      }
      await wait(100);
    }
  }
}

export async function mutateUniversityPublishingLedger<T>(
  mutate: (rows: UniversityPublishingLedgerRow[]) => T | Promise<T>,
  options: { ledgerPath?: string; lockTimeoutMs?: number } = {},
) {
  const ledgerPath = resolve(options.ledgerPath ?? "research/university-publishing-ledger.csv");
  const lockPath = `${ledgerPath}.lock`;
  const lockHandle = await acquireLock(lockPath, options.lockTimeoutMs ?? 5_000);
  try {
    const { rows } = await readUniversityPublishingLedger(ledgerPath);
    const result = await mutate(rows);
    const issues = validateUniversityPublishingLedger(rows);
    const errors = issues.filter((issue) => issue.level === "error");
    if (errors.length) {
      throw new Error(`Publishing ledger mutation failed validation: ${errors.map((issue) => issue.message).join(" ")}`);
    }
    const temporaryPath = join(dirname(ledgerPath), `.${basename(ledgerPath)}.${process.pid}.tmp`);
    await writeFile(temporaryPath, serializeUniversityPublishingLedger(rows), "utf8");
    await rename(temporaryPath, ledgerPath);
    return result;
  } finally {
    await lockHandle.close();
    await unlink(lockPath).catch(() => undefined);
  }
}

function migrationSequence(id: string) {
  return Number(id.slice(0, 4));
}

function payloadMatches(rowPayload: string, payloadPath: string) {
  const normalizedRow = rowPayload.replace(/\\/g, "/");
  const normalizedPath = payloadPath.replace(/\\/g, "/");
  return normalizedPath.endsWith(normalizedRow) || normalizedRow.endsWith(normalizedPath);
}

/**
 * Supersede rule: a university's single ledger row always points (`migration_id`, `payload_file`)
 * at the NEWEST local bundle containing that university. An earlier bundle that contains the same
 * slug is historical: it passes eligibility when a later local bundle covers the slug and the row
 * points at that newest bundle. A row still pointing at the earlier bundle while a newer one exists
 * is an error, as is a row pointing at any other bundle.
 *
 * `latestMigrationIdBySlug` comes from `readLatestMigrationIdByUniversitySlug`; when omitted, the
 * migration being checked is treated as the newest (the pre-supersede behaviour).
 */
export function assertMigrationLedgerEligibility(
  rows: UniversityPublishingLedgerRow[],
  migration: { id: string; payloadPath: string; universitySlugs: string[] },
  options: { latestMigrationIdBySlug?: ReadonlyMap<string, string> } = {},
) {
  const allowed = new Set<LedgerStatus>(["validated", "published"]);
  for (const slug of migration.universitySlugs) {
    const matches = rows.filter((row) => row.university_slug === slug);
    if (matches.length !== 1) {
      throw new Error(`Content migration '${migration.id}' requires exactly one ledger row for '${slug}', found ${matches.length}.`);
    }
    const row = matches[0]!;
    if (!allowed.has(row.status as LedgerStatus)) {
      throw new Error(`Content migration '${migration.id}' cannot apply '${slug}' while ledger status is '${row.status}'.`);
    }

    const latestId = options.latestMigrationIdBySlug?.get(slug) ?? migration.id;
    const supersededBy = migrationSequence(latestId) > migrationSequence(migration.id) ? latestId : undefined;

    if (supersededBy) {
      const pointsAtThisBundle = row.migration_id
        ? row.migration_id === migration.id
        : Boolean(row.payload_file) && payloadMatches(row.payload_file, migration.payloadPath);
      if (pointsAtThisBundle) {
        throw new Error(
          `Ledger row for '${slug}' still points at superseded content migration '${migration.id}', but later bundle '${supersededBy}' covers the same university. Point migration_id and payload_file at '${supersededBy}'.`,
        );
      }
      if (row.migration_id && row.migration_id !== supersededBy) {
        throw new Error(
          `Content migration '${migration.id}' is superseded by '${supersededBy}' for '${slug}', but the ledger points at '${row.migration_id}'. Point migration_id and payload_file at '${supersededBy}'.`,
        );
      }
      // Historical bundle: the ledger row belongs to the newest bundle.
      continue;
    }

    if (row.migration_id && row.migration_id !== migration.id) {
      if (migrationSequence(row.migration_id) < migrationSequence(migration.id)) {
        throw new Error(
          `Ledger row for '${slug}' still points at earlier content migration '${row.migration_id}', but '${migration.id}' is the newest bundle covering that university. Point migration_id and payload_file at '${migration.id}'.`,
        );
      }
      throw new Error(`Content migration '${migration.id}' conflicts with ledger migration '${row.migration_id}' for '${slug}'.`);
    }
    if (row.payload_file && !payloadMatches(row.payload_file, migration.payloadPath)) {
      throw new Error(`Content migration '${migration.id}' payload does not match the ledger payload for '${slug}'.`);
    }
  }
}
