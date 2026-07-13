import dotenv from "dotenv";

import { defineConfig } from "drizzle-kit";

// Drizzle runs outside Next.js, so load environment files in the same precedence
// order as the app. Local credentials must override shared defaults.
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/studentstraffic",
  },
  verbose: true,
  strict: true,
});
