import "server-only";

import * as Sentry from "@sentry/nextjs";

/**
 * Sentry error tracking helpers
 *
 * Uses official @sentry/nextjs SDK
 * Free tier: 5K errors/month
 * Setup: Configured in sentry.*.config.ts files
 */

/**
 * Capture an error in Sentry with additional context
 */
export async function captureError(
  error: Error | string,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    user?: {
      id?: string;
      email?: string;
      ip_address?: string;
    };
    level?: "fatal" | "error" | "warning" | "info";
  }
): Promise<void> {
  const errorObj = typeof error === "string" ? new Error(error) : error;

  Sentry.captureException(errorObj, {
    level: context?.level || "error",
    tags: context?.tags,
    extra: context?.extra,
    user: context?.user,
  });
}

/**
 * Capture a message in Sentry
 */
export async function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
): Promise<void> {
  Sentry.captureMessage(message, {
    level,
    tags: context?.tags,
    extra: context?.extra,
  });
}

/**
 * Set user context for error tracking
 */
export function setUser(user: {
  id?: string;
  email?: string;
  username?: string;
  ip_address?: string;
}): void {
  Sentry.setUser(user);
}

/**
 * Clear user context
 */
export function clearUser(): void {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  data?: Record<string, unknown>,
  category?: string
): void {
  Sentry.addBreadcrumb({
    message,
    data,
    category: category || "custom",
    level: "info",
  });
}

/**
 * Wrap an async function with error capturing
 */
export function withErrorCapture<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      await captureError(
        error instanceof Error ? error : new Error(String(error)),
        context
      );
      throw error;
    }
  }) as T;
}

/**
 * Start a span for performance monitoring
 */
export function startSpan<T>(
  name: string,
  op: string,
  callback: () => T
): T {
  return Sentry.startSpan(
    {
      name,
      op,
    },
    callback
  );
}
