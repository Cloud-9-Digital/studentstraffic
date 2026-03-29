import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { findActiveAdminById } from "@/lib/auth/admin-access";
import { env } from "@/lib/env";

const OWNER_ONLY_ADMIN_PATHS = ["/admin/admins"];

function getLoginRedirect(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  return loginUrl;
}

export async function proxy(request: NextRequest) {
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
  matcher: ["/admin/:path*"],
};
