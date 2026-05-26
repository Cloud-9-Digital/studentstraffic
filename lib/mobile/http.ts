import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function mobileJson<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...init?.headers,
    },
  });
}

export function mobilePublicJson<T>(
  data: T,
  init?: ResponseInit & {
    sMaxAge?: number;
    staleWhileRevalidate?: number;
  }
) {
  const sMaxAge = init?.sMaxAge ?? 300;
  const staleWhileRevalidate = init?.staleWhileRevalidate ?? 86_400;

  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
      ...init?.headers,
    },
  });
}

export function mobileError(
  code: string,
  message: string,
  status = 400,
  details?: unknown
) {
  return mobileJson({ error: { code, message, details } }, { status });
}

export function mobileValidationError(error: ZodError) {
  return mobileError(
    "validation_error",
    error.issues[0]?.message ?? "Please check the submitted values.",
    422,
    error.flatten()
  );
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
