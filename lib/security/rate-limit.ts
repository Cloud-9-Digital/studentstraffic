import "server-only";

import { and, eq } from "drizzle-orm";

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
  const [row] = await db
    .select({
      id: securityRateLimits.id,
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
    await db.insert(securityRateLimits).values({
      scope: rule.scope,
      identifier: rule.identifier,
      attemptCount: 1,
      windowStartedAt: now,
      blockedUntil: null,
      updatedAt: now,
    });

    return {
      allowed: true,
      attemptCount: 1,
      remaining: Math.max(rule.limit - 1, 0),
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

  const windowExpired =
    row.windowStartedAt.getTime() + rule.windowMs <= now.getTime();
  const nextAttemptCount = windowExpired ? 1 : row.attemptCount + 1;
  const nextBlockedUntil =
    !windowExpired && nextAttemptCount > rule.limit
      ? new Date(now.getTime() + getBlockMs(rule))
      : null;

  await db
    .update(securityRateLimits)
    .set({
      attemptCount: nextAttemptCount,
      windowStartedAt: windowExpired ? now : row.windowStartedAt,
      blockedUntil: nextBlockedUntil,
      updatedAt: now,
    })
    .where(eq(securityRateLimits.id, row.id));

  if (nextBlockedUntil) {
    return {
      allowed: false,
      attemptCount: nextAttemptCount,
      remaining: 0,
      retryAfterMs: nextBlockedUntil.getTime() - now.getTime(),
    };
  }

  return {
    allowed: true,
    attemptCount: nextAttemptCount,
    remaining: Math.max(rule.limit - nextAttemptCount, 0),
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
