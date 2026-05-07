import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/lib/env";
import * as schema from "@/lib/db/schema";
import { configureDatabaseTransport } from "@/lib/db/transport";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!env.databaseUrl) {
    return null;
  }

  if (!dbInstance) {
    configureDatabaseTransport();
    const client = neon(env.databaseUrl);
    dbInstance = drizzle(client, { schema });
  }

  return dbInstance;
}
