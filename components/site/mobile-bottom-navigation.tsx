"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { Bookmark, Compass, House, MessageCircleQuestion, type LucideIcon } from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { cn } from "@/lib/utils";
import { usesMobileBottomNavigation } from "@/components/site/mobile-navigation-routes";

type NavigationLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
};

function NavigationLink({ href, icon: Icon, label, active }: NavigationLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-16 flex-col items-center justify-center gap-1 px-2 text-[10px] font-semibold transition-colors",
        active ? "text-primary" : "text-muted-foreground active:text-primary",
      )}
    >
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full transition-colors",
          active && "bg-primary/10",
        )}
      >
        <Icon className="size-[18px]" strokeWidth={active ? 2.4 : 1.9} aria-hidden />
      </span>
      <span>{label}</span>
    </Link>
  );
}

export function MobileBottomNavigation() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const shouldRender = usesMobileBottomNavigation(pathname);

  // Publishes the bar's real rendered height (including the safe-area inset
  // it pads for) as a CSS variable, so viewport-height sections like the
  // homepage hero can subtract the exact value instead of guessing.
  useLayoutEffect(() => {
    const node = navRef.current;
    if (!shouldRender || !node) {
      document.documentElement.style.removeProperty("--mobile-bottom-nav-h");
      return;
    }
    const setNavHeightVar = () => {
      document.documentElement.style.setProperty("--mobile-bottom-nav-h", `${node.offsetHeight}px`);
    };
    setNavHeightVar();
    const observer = new ResizeObserver(setNavHeightVar);
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--mobile-bottom-nav-h");
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const isExploreRoute = pathname !== "/";

  return (
    <nav
      ref={navRef}
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-white/90 shadow-[0_-8px_24px_rgba(15,61,55,0.08)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        <NavigationLink href="/" icon={House} label="Home" active={pathname === "/"} />
        <NavigationLink href="/universities" icon={Compass} label="Explore" active={isExploreRoute} />
        <NavigationLink href="/dashboard/shortlists" icon={Bookmark} label="Shortlist" active={false} />
        <CounsellingDialog
          triggerContent={
            <span className="flex min-h-16 flex-col items-center justify-center gap-1 px-2 text-[10px] font-bold text-accent transition-transform active:scale-[0.96]">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent/12 ring-1 ring-accent/15">
                <MessageCircleQuestion className="size-[18px]" strokeWidth={2.2} aria-hidden />
              </span>
              <span>Get help</span>
            </span>
          }
          triggerClassName="w-full"
          plainTrigger
          ctaVariant="mobile_bottom_navigation"
          title="Get guidance for your study abroad plan"
          description="Share your details and our counsellors will help you choose the right next step."
        />
      </div>
    </nav>
  );
}
