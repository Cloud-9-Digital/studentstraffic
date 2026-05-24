import "server-only";

import { env } from "@/lib/env";

/**
 * Redis caching layer using Upstash
 *
 * Free tier: 10K requests/day
 * Use for hot data: search results, catalog lookups, session data
 */

type CacheOptions = {
  /**
   * Time to live in seconds
   */
  ttl?: number;
  /**
   * Tags for cache invalidation
   */
  tags?: string[];
};

/**
 * Get a value from Redis cache
 */
export async function getCached<T>(key: string): Promise<T | null> {
  if (!env.hasUpstashRedis) {
    return null;
  }

  try {
    const response = await fetch(
      `${env.upstashRedisRestUrl}/get/${encodeURIComponent(key)}`,
      {
        headers: {
          Authorization: `Bearer ${env.upstashRedisRestToken}`,
        },
        next: { revalidate: 0 }, // Don't cache the cache request
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as { result: string | null };
    if (!data.result) {
      return null;
    }

    return JSON.parse(data.result) as T;
  } catch (error) {
    console.error("[redis-cache-get-error]", error);
    return null;
  }
}

/**
 * Set a value in Redis cache
 */
export async function setCached<T>(
  key: string,
  value: T,
  options?: CacheOptions
): Promise<void> {
  if (!env.hasUpstashRedis) {
    return;
  }

  try {
    const commands: Array<[string, ...Array<string | number>]> = [
      ["SET", key, JSON.stringify(value)],
    ];

    if (options?.ttl) {
      commands.push(["EXPIRE", key, options.ttl]);
    }

    // Store tags for invalidation
    if (options?.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        commands.push(["SADD", `tag:${tag}`, key]);
        if (options?.ttl) {
          commands.push(["EXPIRE", `tag:${tag}`, options.ttl]);
        }
      }
    }

    await fetch(`${env.upstashRedisRestUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.upstashRedisRestToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
    });
  } catch (error) {
    console.error("[redis-cache-set-error]", error);
  }
}

/**
 * Delete a value from Redis cache
 */
export async function deleteCached(key: string | string[]): Promise<void> {
  if (!env.hasUpstashRedis) {
    return;
  }

  try {
    const keys = Array.isArray(key) ? key : [key];
    await fetch(`${env.upstashRedisRestUrl}/del/${keys.map(encodeURIComponent).join("/")}`, {
      headers: {
        Authorization: `Bearer ${env.upstashRedisRestToken}`,
      },
    });
  } catch (error) {
    console.error("[redis-cache-del-error]", error);
  }
}

/**
 * Invalidate all cache entries with a specific tag
 */
export async function invalidateByTag(tag: string): Promise<void> {
  if (!env.hasUpstashRedis) {
    return;
  }

  try {
    // Get all keys with this tag
    const response = await fetch(
      `${env.upstashRedisRestUrl}/smembers/tag:${encodeURIComponent(tag)}`,
      {
        headers: {
          Authorization: `Bearer ${env.upstashRedisRestToken}`,
        },
      }
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json() as { result: string[] };
    if (!data.result || data.result.length === 0) {
      return;
    }

    // Delete all keys and the tag set
    const keysToDelete = [...data.result, `tag:${tag}`];
    await deleteCached(keysToDelete);
  } catch (error) {
    console.error("[redis-cache-invalidate-error]", error);
  }
}

/**
 * Get or set a value in cache with a fallback function
 */
export async function getOrSet<T>(
  key: string,
  fallback: () => Promise<T>,
  options?: CacheOptions
): Promise<T> {
  // Try to get from cache first
  const cached = await getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss - compute the value
  const value = await fallback();

  // Store in cache (fire and forget)
  void setCached(key, value, options);

  return value;
}

/**
 * Cache key builders for common patterns
 */
export const cacheKeys = {
  search: (query: string) => `search:${query}`,
  university: (slug: string) => `university:${slug}`,
  country: (slug: string) => `country:${slug}`,
  course: (slug: string) => `course:${slug}`,
  programs: (filters: string) => `programs:${filters}`,
  catalog: (type: string) => `catalog:${type}`,
} as const;
