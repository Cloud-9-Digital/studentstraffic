"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Phone,
} from "lucide-react";

import { CountryFlag } from "@/components/site/country-flag";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { SearchPalette } from "@/components/site/search-palette";
import { cn } from "@/lib/utils";
import { navCourses, navDestinations, siteConfig } from "@/lib/constants";

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

type DropdownId = "destinations" | "courses" | null;

// ─── Logo ────────────────────────────────────────────────────────────────────

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

// ─── Desktop Dropdowns ───────────────────────────────────────────────────────

function DestinationsPanel() {
  return (
    <div className="w-[520px] overflow-hidden rounded-xl border border-border bg-white shadow-dropdown">
      <div className="p-2">
        <div className="grid grid-cols-2 gap-0.5">
          {navDestinations.map((dest) => (
            <Link
              key={dest.href}
              href={dest.href}
              className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
            >
              <CountryFlag
                countryCode={dest.countryCode}
                alt={dest.name}
                width={24}
                height={18}
                className="mt-0.5 flex-shrink-0 rounded-sm shadow-flag"
              />
              <div>
                <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {dest.name}
                </p>
                <p className="mt-0.5 text-2xs leading-relaxed text-muted-foreground">
                  {dest.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-border bg-muted/60 px-4 py-3">
        <Link
          href="/countries"
          className="group flex items-center gap-1.5 text-xs font-semibold text-primary"
        >
          View all destinations
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

function CoursesPanel() {
  return (
    <div className="w-60 overflow-hidden rounded-xl border border-border bg-white shadow-dropdown">
      <div className="p-2">
        {navCourses.map((course) => (
          <Link
            key={course.href}
            href={course.href}
            className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
          >
            <div>
              <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {course.name}
              </p>
              <p className="text-2xs text-muted-foreground">
                {course.description}
              </p>
            </div>
            <ChevronRight className="size-3.5 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Main Header ─────────────────────────────────────────────────────────────

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<
    "destinations" | "courses" | null
  >(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock for mobile drawer
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openDropdown = useCallback((id: DropdownId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(id);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

  return (
    <>
      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-50 bg-header-bg backdrop-blur-xl transition-shadow duration-300",
          scrolled ? "shadow-header-scrolled" : "border-b border-border",
        )}
      >
        <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <SiteLogo />

          {/* Desktop nav — absolutely centered */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
            {/* Study Destinations */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown("destinations")}
              onMouseLeave={scheduleClose}
            >
              <button
                className={cn(
                  "flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                  activeDropdown === "destinations" || pathname.startsWith("/countries")
                    ? "bg-primary/8 text-primary"
                    : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
                )}
              >
                Study Destinations
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    activeDropdown === "destinations" && "rotate-180",
                  )}
                />
              </button>

              <div
                className={cn(
                  "absolute left-0 top-full pt-2.5 transition-[opacity,transform] duration-200",
                  activeDropdown === "destinations"
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0",
                )}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              >
                <DestinationsPanel />
              </div>
            </div>

            {/* Courses */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown("courses")}
              onMouseLeave={scheduleClose}
            >
              <button
                className={cn(
                  "flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                  activeDropdown === "courses" || pathname.startsWith("/courses")
                    ? "bg-primary/8 text-primary"
                    : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
                )}
              >
                Courses
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    activeDropdown === "courses" && "rotate-180",
                  )}
                />
              </button>

              <div
                className={cn(
                  "absolute left-0 top-full pt-2.5 transition-[opacity,transform] duration-200",
                  activeDropdown === "courses"
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0",
                )}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              >
                <CoursesPanel />
              </div>
            </div>

            <Link
              href="/universities"
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/universities")
                  ? "bg-primary/8 text-primary"
                  : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
              )}
            >
              University Finder
            </Link>

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
          </nav>

          {/* Desktop right actions */}
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

          {/* Mobile right actions */}
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

      {/* ── Mobile drawer backdrop ─────────────────────────────────────────── */}
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

      {/* ── Mobile drawer panel ────────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[min(340px,90vw)] flex-col bg-background shadow-drawer transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Drawer header */}
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

        {/* Drawer scrollable body */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-0.5 p-3">
            {/* Destinations accordion */}
            <div>
              <button
                onClick={() =>
                  setMobileExpanded(
                    mobileExpanded === "destinations" ? null : "destinations",
                  )
                }
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
              >
                Study Destinations
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200",
                    mobileExpanded === "destinations" && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  mobileExpanded === "destinations"
                    ? "max-h-[480px] opacity-100"
                    : "max-h-0 opacity-0",
                )}
              >
                <div className="space-y-0.5 pb-2 pl-2 pr-1 pt-1">
                  {navDestinations.map((dest) => (
                    <Link
                      key={dest.href}
                      href={dest.href}
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-black/5"
                    >
                      <CountryFlag
                        countryCode={dest.countryCode}
                        alt={dest.name}
                        width={20}
                        height={15}
                        className="flex-shrink-0 rounded-sm shadow-flag"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {dest.name}
                        </p>
                        <p className="text-2xs leading-relaxed text-muted-foreground">
                          {dest.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href="/countries"
                    onClick={closeMobile}
                    className="group flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary"
                  >
                    View all destinations
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Courses accordion */}
            <div>
              <button
                onClick={() =>
                  setMobileExpanded(
                    mobileExpanded === "courses" ? null : "courses",
                  )
                }
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
              >
                Courses
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200",
                    mobileExpanded === "courses" && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  mobileExpanded === "courses"
                    ? "max-h-[280px] opacity-100"
                    : "max-h-0 opacity-0",
                )}
              >
                <div className="space-y-0.5 pb-2 pl-2 pr-1 pt-1">
                  {navCourses.map((course) => (
                    <Link
                      key={course.href}
                      href={course.href}
                      onClick={closeMobile}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-black/5"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {course.name}
                        </p>
                        <p className="text-2xs text-muted-foreground">
                          {course.description}
                        </p>
                      </div>
                      <ChevronRight className="size-3.5 flex-shrink-0 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/universities"
              onClick={closeMobile}
              className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
            >
              University Finder
            </Link>

            <Link
              href="/about"
              onClick={closeMobile}
              className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
            >
              About
            </Link>
          </nav>

          {/* Drawer bottom CTAs */}
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
