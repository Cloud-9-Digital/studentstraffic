"use client";

import { usePathname } from "next/navigation";

import { CompareTrayLoader } from "@/components/site/compare-tray-loader";
import { MobileStickyBar } from "@/components/site/mobile-sticky-bar";
import { SeminarPromoPopup } from "@/components/site/seminar-promo-popup";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CompareProvider } from "@/lib/compare-context";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname === "/login" || pathname.startsWith("/seminar-2026")) {
    return <div className="relative flex min-h-full flex-col">{children}</div>;
  }

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
