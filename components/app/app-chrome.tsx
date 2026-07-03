"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { StandardAppChrome } from "./standard-app-chrome";

const BARE_PREFIXES = [
  "/admin",
  "/dashboard",
  "/login/",
  "/seminar-2026",
  "/mbbs-abroad",
];
const BARE_EXACT = new Set([
  "/login",
  "/register",
  "/mbbs-in-russia-admission",
  "/mbbs-in-vietnam-admission",
  "/mbbs-in-georgia-admission",
]);

function AppChromeInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isBare =
    BARE_EXACT.has(pathname) ||
    BARE_PREFIXES.some((p) => pathname.startsWith(p));

  if (isBare) {
    return <div className="relative flex min-h-full flex-col">{children}</div>;
  }

  return <StandardAppChrome>{children}</StandardAppChrome>;
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    // StandardAppChrome is the correct default for static prerendering —
    // it covers the vast majority of pages. Admin/login pages swap on
    // hydration; they are not statically prerendered anyway.
    <Suspense fallback={<StandardAppChrome>{children}</StandardAppChrome>}>
      <AppChromeInner>{children}</AppChromeInner>
    </Suspense>
  );
}
