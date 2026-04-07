import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { findActiveAdminById } from "@/lib/auth/admin-access";
import { env } from "@/lib/env";

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

export async function proxy(request: NextRequest) {
  const hostRedirect = getHostRedirect(request);

  if (hostRedirect) {
    return hostRedirect;
  }

  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: env.nextAuthSecret,
  });

  if (token?.role !== "admin" || typeof token.adminUserId !== "number") {
    return NextResponse.redirect(getLoginRedirect(request));
  }

  const adminUser = await findActiveAdminById(token.adminUserId);

  if (!adminUser) {
    return NextResponse.redirect(getLoginRedirect(request));
  }

  if (
    OWNER_ONLY_ADMIN_PATHS.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    ) &&
    adminUser.role !== "owner"
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
