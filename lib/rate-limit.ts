import "server-only";

import { env } from "@/lib/env";

/**
 * Rate limiter using Upstash Redis (free tier: 10K requests/day)
 * Falls back to in-memory limiter if Redis is not configured
 */

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

// In-memory fallback rate limiter (for development or if Upstash is not configured)
class InMemoryRateLimiter {
  private requests = new Map<string, { count: number; resetAt: number }>();

  async limit(
    identifier: string,
    limit: number,
    window: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const record = this.requests.get(identifier);

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      for (const [key, value] of this.requests.entries()) {
        if (value.resetAt < now) {
          this.requests.delete(key);
        }
      }
    }

    if (!record || record.resetAt < now) {
      // Create new window
      const resetAt = now + window;
      this.requests.set(identifier, { count: 1, resetAt });
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: resetAt,
      };
    }

    // Increment existing window
    record.count += 1;
    const success = record.count <= limit;

    return {
      success,
      limit,
      remaining: Math.max(0, limit - record.count),
      reset: record.resetAt,
    };
  }
}

// Upstash Redis rate limiter
class UpstashRateLimiter {
  private baseUrl: string;
  private token: string;

  constructor(url: string, token: string) {
    this.baseUrl = url.replace(/\/$/, "");
    this.token = token;
  }

  async limit(
    identifier: string,
    limit: number,
    window: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const resetAt = now + window;
    const key = `ratelimit:${identifier}:${Math.floor(now / window)}`;

    try {
      // Use Redis INCR with PEXPIRE
      const pipeline = [
        ["INCR", key],
        ["PEXPIRE", key, window.toString()],
      ];

      const response = await fetch(`${this.baseUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pipeline),
      });

      if (!response.ok) {
        throw new Error(`Upstash error: ${response.status}`);
      }

      const results = (await response.json()) as Array<{
        result?: number;
        error?: string;
      }>;
      const count = results[0]?.result ?? 0;

      return {
        success: count <= limit,
        limit,
        remaining: Math.max(0, limit - count),
        reset: resetAt,
      };
    } catch (error) {
      console.error("Rate limit error:", error);
      // Fail open on errors (allow the request)
      return {
        success: true,
        limit,
        remaining: limit,
        reset: resetAt,
      };
    }
  }
}

// Global rate limiter instance
let rateLimiter: InMemoryRateLimiter | UpstashRateLimiter | null = null;

function getRateLimiter(): InMemoryRateLimiter | UpstashRateLimiter {
  if (rateLimiter) {
    return rateLimiter;
  }

  if (env.upstashRedisRestUrl && env.upstashRedisRestToken) {
    rateLimiter = new UpstashRateLimiter(
      env.upstashRedisRestUrl,
      env.upstashRedisRestToken
    );
  } else {
    rateLimiter = new InMemoryRateLimiter();
  }

  return rateLimiter;
}

export function hasDistributedRateLimiter() {
  return Boolean(env.upstashRedisRestUrl && env.upstashRedisRestToken);
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // API endpoints
  api: {
    limit: 100,
    window: 60 * 1000, // 100 requests per minute
  },
  // Contact tracking (more lenient)
  tracking: {
    limit: 300,
    window: 60 * 1000, // 300 requests per minute
  },
  // Lead submission (strict)
  leads: {
    limit: 10,
    window: 60 * 1000, // 10 requests per minute
  },
  // Search queries
  search: {
    limit: 60,
    window: 60 * 1000, // 60 requests per minute
  },
  // Cache revalidation (very strict)
  admin: {
    limit: 10,
    window: 60 * 1000, // 10 requests per minute
  },
} as const;

/**
 * Apply rate limiting with a specific configuration
 */
export async function rateLimit(
  identifier: string,
  config: { limit: number; window: number }
): Promise<RateLimitResult> {
  const limiter = getRateLimiter();
  return limiter.limit(identifier, config.limit, config.window);
}

/**
 * Get identifier from request (IP address)
 */
export function getRateLimitIdentifier(request: Request): string {
  // Try to get real IP from headers (Vercel sets these)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

/**
 * Create rate limit response
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please try again later.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.reset.toString(),
      },
    }
  );
}
