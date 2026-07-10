import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

import { env } from "@/lib/env";
import { invalidateByTag as invalidateRedisByTag } from "@/lib/redis-cache";

type InvalidateRequest = {
  tags?: string[];
};

function isAuthorized(request: Request) {
  const secret = env.revalidateSecret;
  const header = request.headers.get("authorization");
  const provided = header?.startsWith("Bearer ")
    ? header.slice("Bearer ".length).trim()
    : null;
  if (!secret || !provided) return false;

  const input = Buffer.from(provided);
  const expected = Buffer.from(secret);
  return input.length === expected.length && timingSafeEqual(input, expected);
}

/**
 * API endpoint to invalidate cache by tags
 *
 * Usage:
 * POST /api/cache/invalidate
 * Header: Authorization: Bearer $REVALIDATE_SECRET
 * Body: { "tags": ["catalog", "universities"] }
 *
 * This will invalidate both Next.js cache and Redis cache
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InvalidateRequest;

    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate tags
    const tags = Array.isArray(body.tags)
      ? Array.from(
          new Set(
            body.tags
              .filter((tag): tag is string => typeof tag === "string")
              .map((tag) => tag.trim())
              .filter(Boolean)
          )
        ).slice(0, 20)
      : [];

    if (tags.length === 0) {
      return NextResponse.json(
        { error: "tags array is required" },
        { status: 400 }
      );
    }

    // Invalidate Next.js cache
    for (const tag of tags) {
      revalidateTag(tag, { expire: 0 });
    }

    // Invalidate Redis cache
    if (env.hasUpstashRedis) {
      await Promise.all(tags.map((tag) => invalidateRedisByTag(tag)));
    }

    return NextResponse.json({
      ok: true,
      invalidated: tags,
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
