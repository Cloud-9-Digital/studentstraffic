import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { processPendingBackgroundJobs } from "@/lib/background-jobs";
import { env } from "@/lib/env";

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

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(requestedLimit) ? requestedLimit : 10;
  const sourcePathFilter = url.searchParams.get("sourcePath") ?? undefined;
  const result = await processPendingBackgroundJobs({ limit, sourcePathFilter });

  return NextResponse.json({
    ok: true,
    ...result,
  });
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
