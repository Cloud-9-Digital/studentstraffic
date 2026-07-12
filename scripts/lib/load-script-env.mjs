import * as nextEnv from "@next/env";

const loadEnvConfig =
  nextEnv.loadEnvConfig ??
  nextEnv.default?.loadEnvConfig ??
  nextEnv["module.exports"]?.loadEnvConfig;

if (typeof loadEnvConfig !== "function") {
  throw new Error("@next/env does not expose loadEnvConfig in this runtime.");
}

// Standalone publishing scripts do not run through the Next.js CLI, so load
// the same env-file stack explicitly. @next/env preserves values supplied by
// the parent process while applying Next.js's .env.local-over-.env precedence.
loadEnvConfig(process.cwd());
