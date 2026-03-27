import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const trackedParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  for (const key of trackedParams) {
    const value = request.nextUrl.searchParams.get(key);

    if (value) {
      response.cookies.set(key, value, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
