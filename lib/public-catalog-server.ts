import "server-only";

import { AsyncLocalStorage } from "node:async_hooks";
import { createHash } from "node:crypto";

import {
  getCountryBySlug,
  getFinderOptions,
  getProgramBySlug,
  getProgramsForUniversity,
  getUniversityBySlug,
  listFinderPrograms,
} from "@/lib/data/catalog";
import { MCP_RATE_LIMITS, createPublicCatalog } from "@/lib/public-catalog-api";
import {
  getRateLimitIdentifier,
  hasDistributedRateLimiter,
  rateLimit,
} from "@/lib/rate-limit";
import { searchCatalogSuggestions } from "@/lib/search/suggestions";

/**
 * Server side of the public MCP server: the catalogue bound to the real
 * readers, per-IP rate limits and usage logging.
 *
 * Every reader is a "use cache: remote" function tagged like the pages it
 * backs (university:<slug>, program:<slug>, finder, suggestions), so tool calls
 * share the pages' cache entries and publishes invalidate both.
 */
export const publicCatalog = createPublicCatalog({
  search: searchCatalogSuggestions,
  getUniversityBySlug,
  getCountryBySlug,
  getProgramsForUniversity,
  getProgramBySlug,
  getFinderOptions,
  listFinderPrograms,
});

/**
 * Stable, non-reversible id for an IP in logs and rate-limit keys. Salted with
 * MCP_LOG_SALT (or AUTH_SECRET) so the hash cannot be reversed by hashing the
 * IPv4 space.
 */
export function hashIp(ip: string) {
  const salt = process.env.MCP_LOG_SALT || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "studentstraffic-mcp";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 16);
}

export type McpRequestContext = { ipHash: string; userAgent: string };

const requestContext = new AsyncLocalStorage<McpRequestContext>();

export function getMcpRequestContext(request: Request): McpRequestContext {
  return {
    ipHash: hashIp(getRateLimitIdentifier(request)),
    userAgent: (request.headers.get("user-agent") ?? "").slice(0, 200),
  };
}

/** Runs `fn` with the caller's hashed IP and user agent available to tool logging. */
export function runWithMcpRequestContext<T>(context: McpRequestContext, fn: () => T) {
  return requestContext.run(context, fn);
}

/**
 * Per-IP fixed windows: 30 a minute and 500 a day. Counters live in Upstash
 * Redis when UPSTASH_REDIS_REST_URL/TOKEN are set (shared across instances);
 * otherwise in the per-instance in-memory limiter, which is not durable.
 * Returns null when allowed, else which window was hit and the seconds to wait.
 */
export async function checkMcpRateLimit(context: McpRequestContext) {
  for (const [name, config] of Object.entries(MCP_RATE_LIMITS)) {
    const result = await rateLimit(`mcp:${name}:${context.ipHash}`, config);
    if (!result.success) {
      const now = Date.now();
      // The Upstash limiter keys fixed windows on floor(now / window) but
      // reports now + window as the reset; use the real window end instead.
      const reset = hasDistributedRateLimiter()
        ? (Math.floor(now / config.window) + 1) * config.window
        : result.reset;
      return {
        window: name,
        limit: config.limit,
        retryAfter: Math.max(1, Math.ceil((reset - now) / 1000)),
      };
    }
  }
  return null;
}

export function mcpRateLimitStore() {
  return hasDistributedRateLimiter() ? "upstash" : "memory";
}

type UsageEvent = Record<string, string | number | boolean | null>;

/**
 * One structured log line per event, for Vercel logs. Never logs tool
 * arguments (a query could contain personal data), only their sizes.
 */
export function logMcpUsage(event: UsageEvent) {
  const context = requestContext.getStore();
  console.log(
    JSON.stringify({
      source: "mcp",
      ipHash: context?.ipHash ?? null,
      userAgent: context?.userAgent ?? null,
      ...event,
    }),
  );
}
