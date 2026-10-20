"use client";

import { Suspense } from "react";

import { CompareTrayLoader } from "@/components/site/compare-tray-loader";
import { MobileBottomNavigation } from "@/components/site/mobile-bottom-navigation";
import { MobileStickyBar } from "@/components/site/mobile-sticky-bar";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ChatDockProvider } from "@/components/site/chatbot/chat-dock-context";
import { CompareProvider } from "@/lib/compare-context";

export function StandardAppChrome({
  children,
  chatEnabled = false,
}: {
  children: React.ReactNode;
  /**
   * The dock lives here rather than in the root layout. It is a client
   * component, and wrapping every route with one changed how admin pages
   * prerender under Cache Components — enough to fail the production build.
   * Admin, auth and the single-task landing pages never render this chrome, so
   * this is both the correct boundary and the narrower one.
   */
  chatEnabled?: boolean;
}) {
  const chrome = (
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

  return chatEnabled ? <ChatDockProvider>{chrome}</ChatDockProvider> : chrome;
}
