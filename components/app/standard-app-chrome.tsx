"use client";

import { CompareTrayLoader } from "@/components/site/compare-tray-loader";
import { MobileStickyBar } from "@/components/site/mobile-sticky-bar";
import { SeminarPromoPopup } from "@/components/site/seminar-promo-popup";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CompareProvider } from "@/lib/compare-context";

export function StandardAppChrome({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      <div className="relative flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1 pb-[72px] md:pb-0">{children}</main>
        <SiteFooter />
        <MobileStickyBar />
        <CompareTrayLoader />
        <SeminarPromoPopup />
      </div>
    </CompareProvider>
  );
}
