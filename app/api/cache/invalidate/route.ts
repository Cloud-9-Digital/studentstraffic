import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { env } from "@/lib/env";
import { invalidateByTag as invalidateRedisByTag } from "@/lib/redis-cache";

type InvalidateRequest = {
  tags?: string[];
  secret?: string;
};

/**
 * API endpoint to invalidate cache by tags
 *
 * Usage:
 * POST /api/cache/invalidate
 * Body: {
 *   "tags": ["catalog", "universities"],
 *   "secret": "your-revalidate-secret"
 * }
 *
 * This will invalidate both Next.js cache and Redis cache
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InvalidateRequest;

    // Verify secret
    if (!env.revalidateSecret || body.secret !== env.revalidateSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate tags
    if (!body.tags || !Array.isArray(body.tags) || body.tags.length === 0) {
      return NextResponse.json(
        { error: "tags array is required" },
        { status: 400 }
      );
    }

    // Invalidate Next.js cache
    for (const tag of body.tags) {
      revalidateTag(tag, { expire: 0 });
    }

    // Invalidate Redis cache
    if (env.hasUpstashRedis) {
      await Promise.all(body.tags.map((tag) => invalidateRedisByTag(tag)));
    }

    return NextResponse.json({
      ok: true,
      invalidated: body.tags,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[cache-invalidate-error]", error);
    return NextResponse.json(
      {
        error: "Failed to invalidate cache",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
