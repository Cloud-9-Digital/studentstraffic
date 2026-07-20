"use client";

import { Suspense } from "react";

import { CompareTrayLoader } from "@/components/site/compare-tray-loader";
import { MobileBottomNavigation } from "@/components/site/mobile-bottom-navigation";
import { MobileStickyBar } from "@/components/site/mobile-sticky-bar";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CompareProvider } from "@/lib/compare-context";

export function StandardAppChrome({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      <div className="relative flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
        <SiteFooter />
        <Suspense fallback={null}>
          <MobileBottomNavigation />
        </Suspense>
        <Suspense fallback={null}>
          <MobileStickyBar />
        </Suspense>
        <CompareTrayLoader />
      </div>
    </CompareProvider>
  );
}
