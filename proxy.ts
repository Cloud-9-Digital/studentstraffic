import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { findActiveAdminById } from "@/lib/auth/admin-access";
import { env } from "@/lib/env";
import {
  ATTRIBUTION_COOKIE_MAX_AGE,
  CLICK_ID_KEYS,
  TRACKING_COOKIE_MAX_AGE,
  trackingCookieNames,
  UTM_KEYS,
} from "@/lib/tracking";

const OWNER_ONLY_ADMIN_PATHS = ["/admin/admins"];
const preferredSiteUrl = new URL(env.siteUrl);

function getAlternateHostname(hostname: string) {
  if (hostname === "localhost" || !hostname.includes(".")) {
    return null;
  }

  return hostname.startsWith("www.")
    ? hostname.slice(4)
    : `www.${hostname}`;
}

function getHostRedirect(request: NextRequest) {
  const alternateHostname = getAlternateHostname(preferredSiteUrl.hostname);

  if (!alternateHostname) {
    return null;
  }

  const requestedHostname = request.nextUrl.hostname;

  if (
    requestedHostname !== preferredSiteUrl.hostname &&
    requestedHostname !== alternateHostname
  ) {
    return null;
  }

  if (
    request.nextUrl.hostname === preferredSiteUrl.hostname &&
    request.nextUrl.protocol === preferredSiteUrl.protocol
  ) {
    return null;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.protocol = preferredSiteUrl.protocol;
  redirectUrl.hostname = preferredSiteUrl.hostname;
  redirectUrl.port = preferredSiteUrl.port;

  return NextResponse.redirect(redirectUrl, 308);
}

function getLoginRedirect(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  return loginUrl;
}

function applyAttributionCookies(
  request: NextRequest,
  response: NextResponse
) {
  let hasCampaignParams = false;

  if (!request.cookies.get(trackingCookieNames.visitorId)?.value) {
    response.cookies.set(trackingCookieNames.visitorId, crypto.randomUUID(), {
      path: "/",
      maxAge: ATTRIBUTION_COOKIE_MAX_AGE,
      sameSite: "lax",
      httpOnly: false,
      secure: preferredSiteUrl.protocol === "https:",
    });
  }

  for (const key of UTM_KEYS) {
    const value = request.nextUrl.searchParams.get(key);

    if (!value) {
      continue;
    }

    hasCampaignParams = true;
    response.cookies.set(key, value, {
      path: "/",
      maxAge: ATTRIBUTION_COOKIE_MAX_AGE,
      sameSite: "lax",
      httpOnly: false,
      secure: preferredSiteUrl.protocol === "https:",
    });
  }

  for (const key of CLICK_ID_KEYS) {
    const value = request.nextUrl.searchParams.get(key);

    if (!value) {
      continue;
    }

    hasCampaignParams = true;
    response.cookies.set(key, value, {
      path: "/",
      maxAge: ATTRIBUTION_COOKIE_MAX_AGE,
      sameSite: "lax",
      httpOnly: false,
      secure: preferredSiteUrl.protocol === "https:",
    });
  }

  if (!request.cookies.get(trackingCookieNames.initialLandingPath)?.value) {
    response.cookies.set(
      trackingCookieNames.initialLandingPath,
      request.nextUrl.pathname,
      {
      path: "/",
      maxAge: TRACKING_COOKIE_MAX_AGE,
      sameSite: "lax",
      httpOnly: false,
      secure: preferredSiteUrl.protocol === "https:",
      }
    );
  }

  if (!request.cookies.get(trackingCookieNames.initialLandingUrl)?.value) {
    response.cookies.set(
      trackingCookieNames.initialLandingUrl,
      request.nextUrl.toString(),
      {
      path: "/",
      maxAge: TRACKING_COOKIE_MAX_AGE,
      sameSite: "lax",
      httpOnly: false,
      secure: preferredSiteUrl.protocol === "https:",
      }
    );
  }

  if (!request.cookies.get(trackingCookieNames.initialReferrer)?.value) {
    const referrer = request.headers.get("referer");

    if (referrer) {
      response.cookies.set(trackingCookieNames.initialReferrer, referrer, {
        path: "/",
        maxAge: TRACKING_COOKIE_MAX_AGE,
        sameSite: "lax",
        httpOnly: false,
        secure: preferredSiteUrl.protocol === "https:",
      });
    }
  }

  if (
    hasCampaignParams &&
    !request.cookies.get(trackingCookieNames.initialUtmLandingUrl)?.value
  ) {
    response.cookies.set(
      trackingCookieNames.initialUtmLandingUrl,
      request.nextUrl.toString(),
      {
        path: "/",
        maxAge: ATTRIBUTION_COOKIE_MAX_AGE,
        sameSite: "lax",
        httpOnly: false,
        secure: preferredSiteUrl.protocol === "https:",
      }
    );
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const hostRedirect = getHostRedirect(request);

  if (hostRedirect) {
    return applyAttributionCookies(request, hostRedirect);
  }

  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return applyAttributionCookies(request, NextResponse.next());
  }

  if (request.nextUrl.pathname === "/admin/login") {
    return applyAttributionCookies(request, NextResponse.next());
  }

  const token = await getToken({
    req: request,
    secret: env.nextAuthSecret,
  });

  if (token?.role !== "admin" || typeof token.adminUserId !== "number") {
    return applyAttributionCookies(
      request,
      NextResponse.redirect(getLoginRedirect(request))
    );
  }

  const adminUser = await findActiveAdminById(token.adminUserId);

  if (!adminUser) {
    return applyAttributionCookies(
      request,
      NextResponse.redirect(getLoginRedirect(request))
    );
  }

  if (
    OWNER_ONLY_ADMIN_PATHS.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    ) &&
    adminUser.role !== "owner"
  ) {
    return applyAttributionCookies(
      request,
      NextResponse.redirect(new URL("/admin", request.url))
    );
  }

  return applyAttributionCookies(request, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
