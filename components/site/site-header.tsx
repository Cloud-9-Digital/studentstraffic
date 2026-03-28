"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Menu,
  Phone,
  X,
} from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { SearchPalette } from "@/components/site/search-palette";
import { cn } from "@/lib/utils";
import { guideNav, siteConfig } from "@/lib/constants";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function SiteLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex-shrink-0">
      <Image
        src="/logo.webp"
        alt="Students Traffic"
        width={180}
        height={48}
        className="h-7 w-auto"
        priority
      />
    </Link>
  );
}

function GuidesPanel() {
  return (
    <div className="w-[520px] overflow-hidden rounded-xl border border-border bg-white shadow-dropdown">
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Research Guides
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore country, course, comparison, and budget guides built to help
          students and parents make better study-abroad decisions.
        </p>
      </div>
      <div className="grid gap-0.5 p-2">
        {guideNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start justify-between gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
          >
            <div>
              <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {item.label}
              </p>
              <p className="mt-0.5 text-2xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
            <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGuidesOpen, setMobileGuidesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openGuides = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    setGuidesOpen(true);
  }, []);

  const scheduleGuidesClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setGuidesOpen(false), 120);
  }, []);

  const cancelGuidesClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileGuidesOpen(false);
  }, []);

  const isGuidesPath =
    pathname === "/guides" ||
    pathname.startsWith("/countries") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/budget");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 bg-header-bg backdrop-blur-xl transition-shadow duration-300",
          scrolled ? "shadow-header-scrolled" : "border-b border-border",
        )}
      >
        <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <SiteLogo />

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
            <Link
              href="/universities"
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/universities")
                  ? "bg-primary/8 text-primary"
                  : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
              )}
            >
              Universities
            </Link>

            <div
              className="relative"
              onMouseEnter={openGuides}
              onMouseLeave={scheduleGuidesClose}
            >
              <button
                className={cn(
                  "flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                  guidesOpen || isGuidesPath
                    ? "bg-primary/8 text-primary"
                    : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
                )}
              >
                Guides
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    guidesOpen && "rotate-180",
                  )}
                />
              </button>

              <div
                className={cn(
                  "absolute left-0 top-full pt-2.5 transition-[opacity,transform] duration-200",
                  guidesOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0",
                )}
                onMouseEnter={cancelGuidesClose}
                onMouseLeave={scheduleGuidesClose}
              >
                <GuidesPanel />
              </div>
            </div>

            <Link
              href="/about"
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                pathname === "/about"
                  ? "bg-primary/8 text-primary"
                  : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
              )}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                pathname === "/contact"
                  ? "bg-primary/8 text-primary"
                  : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
              )}
            >
              Contact
            </Link>
          </nav>

          <div className="ml-auto hidden items-center gap-1 lg:flex">
            <SearchPalette />
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              aria-label="Call us"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground/60 transition-colors hover:bg-black/5 hover:text-foreground"
            >
              <Phone className="size-[18px]" />
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground/60 transition-colors hover:bg-whatsapp/10 hover:text-whatsapp"
            >
              <WhatsAppIcon className="size-[19px]" />
            </a>
            <CounsellingDialog
              triggerVariant="accent"
              triggerSize="sm"
              triggerClassName="gap-1.5 px-5 shadow-cta hover:shadow-cta-hover"
              triggerContent={
                <>
                  Free Counselling
                  <ArrowRight className="size-3.5" />
                </>
              }
            />
          </div>

          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <SearchPalette />
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-black/5"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={closeMobile}
      />

      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[min(340px,90vw)] flex-col bg-background shadow-drawer transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border px-5">
          <SiteLogo onClick={closeMobile} />
          <button
            onClick={closeMobile}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-black/5"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-0.5 p-3">
            <Link
              href="/universities"
              onClick={closeMobile}
              className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
            >
              Universities
            </Link>

            <div>
              <button
                onClick={() => setMobileGuidesOpen((value) => !value)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
              >
                Guides
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200",
                    mobileGuidesOpen && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  mobileGuidesOpen
                    ? "max-h-[520px] opacity-100"
                    : "max-h-0 opacity-0",
                )}
              >
                <div className="space-y-0.5 pb-2 pl-2 pr-1 pt-1">
                  {guideNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-black/5"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.label}
                        </p>
                        <p className="text-2xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/about"
              onClick={closeMobile}
              className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={closeMobile}
              className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
            >
              Contact
            </Link>
          </nav>

          <div className="flex-shrink-0 space-y-2.5 border-t border-border p-4">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-whatsapp/25 bg-whatsapp/8 py-3 text-sm font-semibold text-whatsapp-dark transition-colors hover:bg-whatsapp/14"
            >
              <WhatsAppIcon className="size-4" />
              Chat on WhatsApp
            </a>
            <CounsellingDialog
              triggerVariant="accent"
              triggerClassName="w-full gap-2"
              onTriggerClick={closeMobile}
              triggerContent={
                <>
                  Free Counselling
                  <ArrowRight className="size-4" />
                </>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
