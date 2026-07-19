import "./lib/load-script-env.mjs";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";

import { contentMigrations } from "@/lib/db/schema";
import * as schema from "@/lib/db/schema";
import { readContentMigrations } from "./lib/content-migrations";

function hasArgument(name: string) {
  return process.argv.includes(name);
}

async function main() {
  const validateOnly = hasArgument("--validate");
  const apply = hasArgument("--apply");

  if (validateOnly && apply) {
    throw new Error("Use either --validate (offline) or --apply, not both.");
  }

  const localMigrations = await readContentMigrations();
  if (validateOnly) {
    console.log(`Validated ${localMigrations.length} content migration(s) without connecting to the database.`);
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
    console.log(
      JSON.stringify(
        {
          applied: applied.map((migration) => ({
            id: migration.migrationId,
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
      return;
    }

    for (const migration of pending) {
      console.log(`Applying content migration ${migration.id}: ${migration.description}`);
      const { publishCatalogPayload } = await import("./publish-catalog-payload");
      const result = await publishCatalogPayload(migration.payload);
      await db.insert(contentMigrations).values({
        migrationId: migration.id,
        checksum: migration.checksum,
        payloadCount: 1,
        summary: {
          description: migration.description,
          publishedProgrammes: result.publishedProgrammes,
          payloadPath: migration.payloadPath,
        },
      });
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
