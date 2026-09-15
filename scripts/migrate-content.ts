import "./lib/load-script-env.mjs";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";

import { contentMigrations } from "@/lib/db/schema";
import * as schema from "@/lib/db/schema";
import {
  classifyReviewByExpiry,
  readContentMigrations,
  readLatestMigrationIdByUniversitySlug,
} from "./lib/content-migrations";
import {
  assertMigrationLedgerEligibility,
  readUniversityPublishingLedger,
  validateUniversityPublishingLedger,
} from "./lib/university-publishing-ledger";

function hasArgument(name: string) {
  return process.argv.includes(name);
}

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const validateOnly = hasArgument("--validate");
  const apply = hasArgument("--apply");
  const onlyId = argument("--id");

  if (validateOnly && apply) {
    throw new Error("Use either --validate (offline) or --apply, not both.");
  }
  if (onlyId && !validateOnly) {
    throw new Error("--id is available only with offline --validate; publication always checks the full sequence.");
  }

  const localMigrations = await readContentMigrations("content-migrations", { onlyId });
  const latestMigrationIdBySlug = await readLatestMigrationIdByUniversitySlug("content-migrations");
  const { rows: publishingLedger } = await readUniversityPublishingLedger();
  const ledgerErrors = validateUniversityPublishingLedger(publishingLedger)
    .filter((issue) => issue.level === "error");
  if (ledgerErrors.length) {
    throw new Error(`Publishing ledger is invalid: ${ledgerErrors.map((issue) => issue.message).join(" ")}`);
  }
  for (const migration of localMigrations) {
    assertMigrationLedgerEligibility(publishingLedger, {
      id: migration.id,
      payloadPath: migration.payloadPath,
      universitySlugs: migration.payload.universities.map((university) => university.slug),
    }, { latestMigrationIdBySlug });
  }
  if (validateOnly) {
    const { warnings } = classifyReviewByExpiry(localMigrations);
    for (const warning of warnings) console.warn(`Warning: ${warning}`);
    console.log(
      `Validated ${localMigrations.length} content migration(s) without connecting to the database` +
        ` (${warnings.length} expired review-by warning(s)).`,
    );
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to check or apply content migrations.");
  }

  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    const applied = await db
      .select({
        migrationId: contentMigrations.migrationId,
        checksum: contentMigrations.checksum,
        status: contentMigrations.status,
        appliedAt: contentMigrations.appliedAt,
      })
      .from(contentMigrations)
      .orderBy(contentMigrations.migrationId);
    const appliedById = new Map(applied.map((migration) => [migration.migrationId, migration]));
    const localById = new Map(localMigrations.map((migration) => [migration.id, migration]));

    for (const migration of applied) {
      if (!localById.has(migration.migrationId)) {
        throw new Error(
          `Database has applied content migration '${migration.migrationId}', but its local bundle is missing. Restore the immutable bundle before continuing.`,
        );
      }
    }

    for (const migration of localMigrations) {
      const appliedMigration = appliedById.get(migration.id);
      if (appliedMigration && appliedMigration.checksum !== migration.checksum) {
        throw new Error(
          `Content migration '${migration.id}' was changed after it was applied. Create a new numbered migration instead.`,
        );
      }
    }

    const pending = localMigrations.filter((migration) => !appliedById.has(migration.id));

    // Same rule for the dry-run check and --apply: applied bundles only warn; pending bundles with
    // expired evidence block the run before anything is written.
    const expiry = classifyReviewByExpiry(localMigrations, {
      appliedIds: new Set(appliedById.keys()),
      latestMigrationIdBySlug,
    });
    for (const warning of expiry.warnings) console.warn(`Warning: ${warning}`);
    if (expiry.errors.length) {
      throw new Error(`Expired review-by dates in pending content migrations:\n${expiry.errors.join("\n")}`);
    }

    console.log(
      JSON.stringify(
        {
          applied: applied.map((migration) => ({
            id: migration.migrationId,
            status: migration.status,
            appliedAt: migration.appliedAt,
          })),
          pending: pending.map((migration) => ({
            id: migration.id,
            description: migration.description,
            payload: migration.payloadPath,
          })),
        },
        null,
        2,
      ),
    );

    if (!apply || pending.length === 0) {
      if (!apply) return;
    }

    const { publishCatalogPayload, refreshCatalogPayload } = await import("./publish-catalog-payload");

    for (const migrationRecord of applied.filter((migration) => migration.status === "db_applied")) {
      const migration = localById.get(migrationRecord.migrationId);
      if (!migration) continue;
      console.log(`Resuming post-commit refresh for ${migration.id}.`);
      await refreshCatalogPayload(migration.payload);
      await db.update(contentMigrations)
        .set({ status: "applied" })
        .where(eq(contentMigrations.migrationId, migration.id));
      console.log(`Completed refresh for ${migration.id}.`);
    }

    for (const migration of pending) {
      console.log(`Applying content migration ${migration.id}: ${migration.description}`);
      const summary = {
          description: migration.description,
          payloadPath: migration.payloadPath,
      };
      const result = await publishCatalogPayload(migration.payload, {
        deferRefresh: true,
        contentMigration: {
          migrationId: migration.id,
          checksum: migration.checksum,
          payloadCount: migration.payload.universities.length,
          summary,
        },
      });
      await refreshCatalogPayload(migration.payload, result.publishedProgrammes);
      await db.update(contentMigrations)
        .set({
          status: "applied",
          summary: { ...summary, publishedProgrammes: result.publishedProgrammes },
        })
        .where(eq(contentMigrations.migrationId, migration.id));
      console.log(`Applied ${migration.id}.`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
