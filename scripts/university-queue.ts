import {
  ledgerColumns,
  ledgerPriorities,
  ledgerStatuses,
  mutateUniversityPublishingLedger,
  normalizeUniversityIdentity,
  readUniversityPublishingLedger,
  validateUniversityPublishingLedger,
  type LedgerPriority,
  type LedgerStatus,
  type UniversityPublishingLedgerRow,
} from "./lib/university-publishing-ledger";

function argument(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function requireArgument(name: string) {
  const value = argument(name);
  if (!value) throw new Error(`--${name} is required.`);
  return value;
}

function emptyRow(): UniversityPublishingLedgerRow {
  return Object.fromEntries(ledgerColumns.map((column) => [column, ""])) as UniversityPublishingLedgerRow;
}

function appendNote(current: string, note: string) {
  return current ? `${current} | ${note}` : note;
}

const transitions: Record<LedgerStatus, LedgerStatus[]> = {
  claimed: ["researching", "held", "abandoned"],
  researching: ["validated", "held", "abandoned"],
  held: ["claimed", "abandoned"],
  validated: ["published", "held", "abandoned"],
  published: [],
  abandoned: ["claimed"],
};

async function claim() {
  const slug = requireArgument("slug");
  const name = requireArgument("name");
  const country = requireArgument("country");
  const owner = requireArgument("owner");
  const priority = (argument("priority") ?? "medium") as LedgerPriority;
  if (!ledgerPriorities.includes(priority)) throw new Error(`Invalid priority '${priority}'.`);

  await mutateUniversityPublishingLedger((rows) => {
    const normalizedName = normalizeUniversityIdentity(name);
    const slugMatch = rows.find((row) => row.university_slug === slug);
    const nameMatch = rows.find((row) => normalizeUniversityIdentity(row.university_name) === normalizedName);
    const existing = slugMatch ?? nameMatch;
    if (slugMatch && nameMatch && slugMatch !== nameMatch) {
      throw new Error(`Slug '${slug}' and name '${name}' match different ledger rows.`);
    }
    if (existing && existing.status !== "held" && existing.status !== "abandoned") {
      if (existing.owner_agent_id === owner && (existing.status === "claimed" || existing.status === "researching")) return;
      throw new Error(`University is already ${existing.status} by '${existing.owner_agent_id || "unknown"}'.`);
    }

    const row = existing ?? emptyRow();
    row.university_slug = slug;
    row.university_name = name;
    row.country_slug = country;
    row.status = "claimed";
    row.owner_agent_id = owner;
    row.claimed_at = new Date().toISOString();
    row.published_at = "";
    row.programme_count = "";
    row.payload_file = argument("payload") ?? row.payload_file;
    row.published_url = "";
    row.notes = appendNote(row.notes, argument("notes") ?? "Claimed through the locked shared queue.");
    row.batch_id = argument("batch") ?? "";
    row.priority = priority;
    row.migration_id = argument("migration") ?? "";
    if (!existing) rows.push(row);
  });
  console.log(`Claimed ${slug}.`);
}

async function update() {
  const slug = requireArgument("slug");
  const owner = requireArgument("owner");
  const status = requireArgument("status") as LedgerStatus;
  if (!ledgerStatuses.includes(status)) throw new Error(`Invalid status '${status}'.`);

  await mutateUniversityPublishingLedger((rows) => {
    const row = rows.find((candidate) => candidate.university_slug === slug);
    if (!row) throw new Error(`No ledger row exists for '${slug}'.`);
    if (row.owner_agent_id !== owner) throw new Error(`'${slug}' is owned by '${row.owner_agent_id}', not '${owner}'.`);
    const currentStatus = row.status as LedgerStatus;
    if (currentStatus !== status && !transitions[currentStatus].includes(status)) {
      throw new Error(`Invalid status transition ${currentStatus} -> ${status}.`);
    }
    row.status = status;
    row.payload_file = argument("payload") ?? row.payload_file;
    row.batch_id = argument("batch") ?? row.batch_id;
    row.migration_id = argument("migration") ?? row.migration_id;
    row.programme_count = argument("programmes") ?? row.programme_count;
    row.published_url = argument("url") ?? row.published_url;
    if (status === "published") row.published_at = argument("published-at") ?? new Date().toISOString();
    if (argument("notes")) row.notes = appendNote(row.notes, argument("notes")!);
  });
  console.log(`Updated ${slug} to ${status}.`);
}

async function release() {
  process.argv.push("--status", "abandoned");
  if (!argument("notes")) process.argv.push("--notes", "Released through the locked shared queue.");
  await update();
}

async function status() {
  const { rows } = await readUniversityPublishingLedger();
  const selected = rows.filter((row) => {
    if (argument("status") && row.status !== argument("status")) return false;
    if (argument("owner") && row.owner_agent_id !== argument("owner")) return false;
    if (argument("batch") && row.batch_id !== argument("batch")) return false;
    return true;
  });
  console.table(selected.map((row) => ({
    slug: row.university_slug,
    country: row.country_slug,
    status: row.status,
    owner: row.owner_agent_id,
    batch: row.batch_id,
    priority: row.priority,
    migration: row.migration_id,
  })));
}

async function validate() {
  if (process.argv.includes("--fix")) {
    await mutateUniversityPublishingLedger(() => undefined);
  }
  const { rows } = await readUniversityPublishingLedger();
  const issues = validateUniversityPublishingLedger(rows, {
    staleAfterDays: Number(argument("stale-days") ?? 7),
  });
  for (const issue of issues) {
    console.log(`${issue.level.toUpperCase()}${issue.row ? ` row ${issue.row}` : ""}: ${issue.message}`);
  }
  const errors = issues.filter((issue) => issue.level === "error");
  const warnings = issues.filter((issue) => issue.level === "warning");
  console.log(`Validated ${rows.length} ledger rows: ${errors.length} error(s), ${warnings.length} warning(s).`);
  if (errors.length || (process.argv.includes("--strict-stale") && warnings.length)) process.exitCode = 1;
}

async function main() {
  const command = process.argv[2];
  if (command === "claim") return claim();
  if (command === "update") return update();
  if (command === "release") return release();
  if (command === "status") return status();
  if (command === "validate") return validate();
  throw new Error("Use one of: claim, update, release, status, validate.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
