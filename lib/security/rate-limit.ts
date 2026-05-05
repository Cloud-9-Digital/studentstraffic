import "server-only";

import { and, eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/server";
import { securityRateLimits } from "@/lib/db/schema";

export type RateLimitRule = {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
  blockMs?: number;
};

export type RateLimitStatus = {
  allowed: boolean;
  attemptCount: number;
  remaining: number;
  retryAfterMs: number;
};

function getBlockMs(rule: RateLimitRule) {
  return rule.blockMs ?? rule.windowMs;
}

export async function getRateLimitStatus(
  rule: RateLimitRule
): Promise<RateLimitStatus> {
  const db = getDb();

  if (!db) {
    return {
      allowed: true,
      attemptCount: 0,
      remaining: rule.limit,
      retryAfterMs: 0,
    };
  }

  const now = new Date();
  const [row] = await db
    .select({
      attemptCount: securityRateLimits.attemptCount,
      windowStartedAt: securityRateLimits.windowStartedAt,
      blockedUntil: securityRateLimits.blockedUntil,
    })
    .from(securityRateLimits)
    .where(
      and(
        eq(securityRateLimits.scope, rule.scope),
        eq(securityRateLimits.identifier, rule.identifier)
      )
    )
    .limit(1);

  if (!row) {
    return {
      allowed: true,
      attemptCount: 0,
      remaining: rule.limit,
      retryAfterMs: 0,
    };
  }

  const blockedUntilTime = row.blockedUntil?.getTime() ?? 0;
  if (blockedUntilTime > now.getTime()) {
    return {
      allowed: false,
      attemptCount: row.attemptCount,
      remaining: 0,
      retryAfterMs: blockedUntilTime - now.getTime(),
    };
  }

  const windowStartedAtTime = row.windowStartedAt.getTime();
  if (windowStartedAtTime + rule.windowMs <= now.getTime()) {
    return {
      allowed: true,
      attemptCount: 0,
      remaining: rule.limit,
      retryAfterMs: 0,
    };
  }

  return {
    allowed: true,
    attemptCount: row.attemptCount,
    remaining: Math.max(rule.limit - row.attemptCount, 0),
    retryAfterMs: 0,
  };
}

export async function consumeRateLimit(
  rule: RateLimitRule
): Promise<RateLimitStatus> {
  const db = getDb();

  if (!db) {
    return {
      allowed: true,
      attemptCount: 1,
      remaining: Math.max(rule.limit - 1, 0),
      retryAfterMs: 0,
    };
  }

  const now = new Date();
  const blockUntil = new Date(now.getTime() + getBlockMs(rule));
  const windowSeconds = rule.windowMs / 1000;
  const { rows } = await db.execute<{
    attemptCount: number;
    windowStartedAt: Date;
    blockedUntil: Date | null;
  }>(sql`
    INSERT INTO security_rate_limits (
      scope,
      identifier,
      attempt_count,
      window_started_at,
      blocked_until,
      updated_at
    )
    VALUES (${rule.scope}, ${rule.identifier}, 1, ${now}, NULL, ${now})
    ON CONFLICT (scope, identifier) DO UPDATE SET
      attempt_count = CASE
        WHEN security_rate_limits.blocked_until IS NOT NULL
          AND security_rate_limits.blocked_until > ${now}
          THEN security_rate_limits.attempt_count
        WHEN security_rate_limits.window_started_at + make_interval(secs => ${windowSeconds}) <= ${now}
          THEN 1
        ELSE security_rate_limits.attempt_count + 1
      END,
      window_started_at = CASE
        WHEN security_rate_limits.blocked_until IS NOT NULL
          AND security_rate_limits.blocked_until > ${now}
          THEN security_rate_limits.window_started_at
        WHEN security_rate_limits.window_started_at + make_interval(secs => ${windowSeconds}) <= ${now}
          THEN ${now}
        ELSE security_rate_limits.window_started_at
      END,
      blocked_until = CASE
        WHEN security_rate_limits.blocked_until IS NOT NULL
          AND security_rate_limits.blocked_until > ${now}
          THEN security_rate_limits.blocked_until
        WHEN security_rate_limits.window_started_at + make_interval(secs => ${windowSeconds}) > ${now}
          AND security_rate_limits.attempt_count + 1 > ${rule.limit}
          THEN ${blockUntil}
        ELSE NULL
      END,
      updated_at = CASE
        WHEN security_rate_limits.blocked_until IS NOT NULL
          AND security_rate_limits.blocked_until > ${now}
          THEN security_rate_limits.updated_at
        ELSE ${now}
      END
    RETURNING
      attempt_count AS "attemptCount",
      window_started_at AS "windowStartedAt",
      blocked_until AS "blockedUntil"
  `);
  const [row] = rows;

  const blockedUntilTime = row.blockedUntil?.getTime() ?? 0;
  if (blockedUntilTime > now.getTime()) {
    return {
      allowed: false,
      attemptCount: row.attemptCount,
      remaining: 0,
      retryAfterMs: blockedUntilTime - now.getTime(),
    };
  }

  return {
    allowed: true,
    attemptCount: row.attemptCount,
    remaining: Math.max(rule.limit - row.attemptCount, 0),
    retryAfterMs: 0,
  };
}

export async function resetRateLimit(scope: string, identifier: string) {
  const db = getDb();

  if (!db) {
    return;
  }

  await db
    .delete(securityRateLimits)
    .where(
      and(
        eq(securityRateLimits.scope, scope),
        eq(securityRateLimits.identifier, identifier)
      )
    );
}

export function formatRetryAfterMs(retryAfterMs: number) {
  const totalSeconds = Math.max(Math.ceil(retryAfterMs / 1000), 1);

  if (totalSeconds < 60) {
    return `${totalSeconds} second${totalSeconds === 1 ? "" : "s"}`;
  }

  const totalMinutes = Math.ceil(totalSeconds / 60);
  if (totalMinutes < 60) {
    return `${totalMinutes} minute${totalMinutes === 1 ? "" : "s"}`;
  }

  const totalHours = Math.ceil(totalMinutes / 60);
  return `${totalHours} hour${totalHours === 1 ? "" : "s"}`;
}
