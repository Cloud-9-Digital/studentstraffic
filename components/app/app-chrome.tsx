"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import Loading from "@/app/loading";

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
  "/free-mbbs-counselling-2026",
  "/mbbs-in-russia-admission",
  "/mbbs-in-vietnam-admission",
  "/mbbs-in-georgia-admission",
]);

function AppChromeInner({
  children,
  chatEnabled,
}: {
  children: React.ReactNode;
  chatEnabled: boolean;
}) {
  const pathname = usePathname();

  const isBare =
    BARE_EXACT.has(pathname) ||
    BARE_PREFIXES.some((p) => pathname.startsWith(p));

  if (isBare) {
    return <div className="relative flex min-h-full flex-col">{children}</div>;
  }

  return (
    <StandardAppChrome chatEnabled={chatEnabled}>{children}</StandardAppChrome>
  );
}

export function AppChrome({
  children,
  chatEnabled,
}: {
  children: React.ReactNode;
  chatEnabled: boolean;
}) {
  return (
    // StandardAppChrome is the correct default for static prerendering —
    // it covers the vast majority of pages. Admin/login pages swap on
    // hydration; they are not statically prerendered anyway.
    //
    // The fallback must not render `children`. On dynamic-param routes
    // usePathname suspends during prerender, so the fallback lands in the
    // shell and the request-time resume then rendered the page twice: once
    // into the fallback and once into AppChromeInner. Catalogue pages shipped
    // two copies of their body and JSON-LD graph (~2.5 MB of HTML).
    <Suspense
      fallback={
        <StandardAppChrome chatEnabled={chatEnabled}>
          <Loading />
        </StandardAppChrome>
      }
    >
      <AppChromeInner chatEnabled={chatEnabled}>{children}</AppChromeInner>
    </Suspense>
  );
}
