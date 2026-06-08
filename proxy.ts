import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { edgeAuth } from "@/lib/auth.config";

import {
  rateLimit,
  rateLimitConfigs,
  getRateLimitIdentifier,
  createRateLimitResponse,
} from "@/lib/rate-limit";

/**
 * Edge Proxy for rate limiting API routes and auth protection
 * Runs on Vercel Edge Network (globally distributed)
 *
 * Note: In Next.js 16, middleware has been renamed to proxy
 */

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes - require authentication
  if (pathname.startsWith("/dashboard")) {
    const session = await edgeAuth();
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith("/api/")) {
    // Determine which rate limit config to use
    let config: { limit: number; window: number } = rateLimitConfigs.api;

    if (pathname.startsWith("/api/track-contact")) {
      config = rateLimitConfigs.tracking;
    } else if (
      pathname.startsWith("/api/suggestions") ||
      pathname.startsWith("/api/finder") ||
      pathname.startsWith("/api/india-mbbs-finder")
    ) {
      config = rateLimitConfigs.search;
    } else if (
      pathname.startsWith("/api/revalidate") ||
      pathname.startsWith("/api/jobs/process")
    ) {
      config = rateLimitConfigs.admin;
    } else if (pathname.includes("/lead")) {
      config = rateLimitConfigs.leads;
    }

    // Get identifier (IP address)
    const identifier = getRateLimitIdentifier(request);

    // Apply rate limit
    const result = await rateLimit(identifier, config);

    if (!result.success) {
      return createRateLimitResponse(result);
    }

    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", result.limit.toString());
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set("X-RateLimit-Reset", result.reset.toString());

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all API routes and dashboard pages
     * - /api/*
     * - /dashboard/*
     */
    "/api/:path*",
    "/dashboard/:path*",
  ],
};
