import { NextResponse } from "next/server";

import { processPendingBackgroundJobs } from "@/lib/background-jobs";
import { env } from "@/lib/env";

function isAuthorized(request: Request) {
  const secret = env.cronSecret ?? env.revalidateSecret;

  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${secret}`;

  if (authHeader === expected) {
    return true;
  }

  const url = new URL(request.url);

  return url.searchParams.get("secret") === secret;
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(requestedLimit) ? requestedLimit : 10;
  const result = await processPendingBackgroundJobs({ limit });

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
