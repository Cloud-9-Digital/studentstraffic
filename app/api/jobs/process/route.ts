import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { processPendingBackgroundJobs } from "@/lib/background-jobs";
import { env } from "@/lib/env";
import { cleanupExpiredPeerCallSessions } from "@/lib/peer-calls";

function isAuthorized(request: Request) {
  const secret = env.cronSecret;

  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  const provided = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : null;

  if (!provided) {
    return false;
  }

  const input = Buffer.from(provided);
  const expected = Buffer.from(secret);
  return input.length === expected.length && timingSafeEqual(input, expected);
}

async function handle(request: Request, cleanExpiredCalls = false) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(requestedLimit) ? requestedLimit : 10;
  const sourcePathFilter = url.searchParams.get("sourcePath") ?? undefined;
  // Peer-call expiry is housekeeping, not lead delivery. Keep it on the
  // scheduled GET path so every paid-ad conversion does not run four
  // unrelated database queries.
  const expiredCallsCleaned = cleanExpiredCalls
    ? await cleanupExpiredPeerCallSessions()
    : 0;
  const result = await processPendingBackgroundJobs({ limit, sourcePathFilter });

  return NextResponse.json({
    ok: true,
    ...result,
    expiredCallsCleaned,
  });
}

export async function GET(request: Request) {
  return handle(request, true);
}

export async function POST(request: Request) {
  return handle(request);
}
