import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@/lib/env";
import * as schema from "@/lib/db/schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!env.databaseUrl) return null;
  if (!dbInstance) {
    const pool = new Pool({
      connectionString: env.databaseUrl,
      max: 8,
      connectionTimeoutMillis: 5_000,
      statement_timeout: 15_000,
    });
    pool.on("error", (error) => console.error("[postgres-pool]", error.message));
    dbInstance = drizzle(pool, { schema });
  }
  return dbInstance;
}
