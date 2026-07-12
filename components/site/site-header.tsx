"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  GraduationCap,
  MapPinned,
  Menu,
  University,
  X,
} from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { UserMenu, UserMenuMobile } from "@/components/site/user-menu";
import { CountryFlag } from "@/components/site/country-flag";
import { SearchPalette } from "@/components/site/search-palette";
import { cn } from "@/lib/utils";
import {
  useNavCountries,
} from "@/components/app/nav-countries-client-provider";
import { useNavCourses } from "@/components/app/nav-courses-client-provider";
import { groupProgrammeNavigationCourses } from "@/lib/data/programme-navigation";

function SiteLogo({ onClick, showTagline = false }: { onClick?: () => void; showTagline?: boolean }) {
  return (
    <Link href="/" onClick={onClick} className="flex shrink-0 items-center gap-2.5">
      <Image
        src="/logo.webp"
        alt="Students Traffic"
        width={256}
        height={28}
        className="h-4 w-auto"
        priority
      />
      {showTagline && (
        <>
          <span className="h-5 w-px shrink-0 bg-foreground/25" aria-hidden />
          <span className="text-[9px] font-medium leading-snug text-foreground/65">
            India&apos;s Trusted<br />Study Abroad Platform
          </span>
        </>
      )}
    </Link>
  );
}

function SiteHeaderInner() {
  const pathname = usePathname();
  const navCountries = useNavCountries();
  const navCourses = useNavCourses();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [mobileCountriesOpen, setMobileCountriesOpen] = useState(false);
  const [courseMenuOpen, setCourseMenuOpen] = useState<string | null>(null);
  const countriesMenuRef = useRef<HTMLDivElement | null>(null);
  const courseMenuRef = useRef<HTMLElement | null>(null);

  const filteredNavCountries = navCountries;
  const programmeGroups = useMemo(
    () => groupProgrammeNavigationCourses(navCourses),
    [navCourses],
  );
  const programsOpen = courseMenuOpen === "programs";


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

  useEffect(() => {
    if (!countriesOpen && !courseMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!countriesMenuRef.current?.contains(event.target as Node)) {
        setCountriesOpen(false);
      }
      if (!courseMenuRef.current?.contains(event.target as Node)) {
        setCourseMenuOpen(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCountriesOpen(false);
        setCourseMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [countriesOpen, courseMenuOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const countriesActive = isActive("/countries");
  const universitiesActive = isActive("/universities");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.08)]" : "border-b border-white/60",
        )}
        style={{
          background: scrolled
            ? "rgba(255, 255, 255, 0.75)"
            : "rgba(255, 255, 255, 0.60)",
          backdropFilter: "blur(24px) saturate(180%) brightness(1.06)",
          WebkitBackdropFilter: "blur(24px) saturate(180%) brightness(1.06)",
        }}
      >
        <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <SiteLogo showTagline />

          {/* Desktop nav */}
          <nav ref={courseMenuRef} className="pointer-events-none absolute inset-x-0 hidden items-center justify-center gap-0.5 lg:flex">
            <div className="pointer-events-auto relative" ref={countriesMenuRef}>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                  countriesActive || countriesOpen
                    ? "bg-primary/8 text-primary"
                    : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
                )}
                aria-expanded={countriesOpen}
                aria-haspopup="menu"
                onClick={() => setCountriesOpen((open) => !open)}
              >
                <MapPinned className="size-3.5 text-primary/65" />
                Countries
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    countriesOpen ? "rotate-180" : "",
                  )}
                />
              </button>

              <div
                inert={!countriesOpen}
                className={cn(
                  "fixed inset-x-0 top-16 z-40 w-screen overflow-hidden rounded-b-3xl border border-t-0 border-border bg-white shadow-xl transition-all duration-200",
                  countriesOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0",
                )}
              >
                <div className="float-left min-h-[18rem] w-64 border-r border-border bg-white px-6 py-7">
                  <div>
                    <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-accent">
                      <MapPinned className="size-3.5" /> 01 / WHERE TO GO
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.04em] text-primary">
                      Where will your degree take you?
                    </h3>
                    <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
                      A quick way into the countries, cities, and stories students compare most.
                    </p>
                  </div>
                </div>

                <div className="ml-64 min-h-[18rem] bg-white p-5">
                  <div className="max-h-[27rem] min-w-0 overflow-y-auto pr-1">
                    {filteredNavCountries.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        {filteredNavCountries.map((destination) => (
                          <Link
                            key={destination.href}
                            href={destination.href}
                            onClick={() => setCountriesOpen(false)}
                            className="group relative flex min-h-20 flex-col items-start justify-between gap-3 rounded-2xl border border-border bg-card p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-muted/30 hover:shadow-sm"
                          >
                            <CountryFlag
                              countryCode={destination.isoCode}
                              alt={destination.name}
                              width={26}
                              height={18}
                              className="rounded-sm border border-black/5 shadow-sm"
                            />
                            <span className="min-w-0 break-words text-sm font-semibold leading-5 text-foreground">
                              {destination.name}
                            </span>
                            <ArrowRight className="absolute right-3.5 top-3.5 size-3.5 text-accent opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                        <p className="text-sm font-medium text-foreground">
                          No destinations available
                        </p>
                        <Link
                          href="/countries"
                          onClick={() => setCountriesOpen(false)}
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          Browse all countries
                        </Link>
                      </div>
                    )}
                  </div>

                </div>

                <div className="clear-both flex items-center justify-between gap-3 border-t border-border bg-muted/20 px-7 py-3.5">
                  <p className="text-xs font-medium text-muted-foreground">Explore destinations</p>
                  <Link
                    href="/countries"
                    onClick={() => setCountriesOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/8"
                  >
                    View all countries
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/universities"
              className={cn(
                "pointer-events-auto flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                universitiesActive
                  ? "bg-primary/8 text-primary"
                  : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
              )}
            >
              <University className="size-3.5 text-primary/65" />
              Universities
            </Link>

            <div className="pointer-events-auto relative">
              <button
                type="button"
                aria-expanded={programsOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setCountriesOpen(false);
                  setCourseMenuOpen(programsOpen ? null : "programs");
                }}
                className={cn(
                  "flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                  programsOpen ? "bg-primary/8 text-primary" : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
                )}
              >
                <GraduationCap className="size-3.5 text-primary/65" />
                Programs
                <ChevronDown className={cn("size-3.5 transition-transform", programsOpen && "rotate-180")} />
              </button>

              <div
                inert={!programsOpen}
                className={cn(
                  "fixed inset-x-0 top-16 z-40 overflow-hidden rounded-b-3xl border border-t-0 border-border bg-white shadow-xl transition-all duration-200",
                  programsOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
                )}
              >
                <div className="mx-auto grid max-w-[1380px] lg:grid-cols-[15rem_minmax(0,1fr)]">
                  <div className="border-b border-border bg-muted/20 px-6 py-6 lg:border-b-0 lg:border-r">
                    <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-accent">
                      <GraduationCap className="size-3.5" /> Programs
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.04em] text-primary">
                      Find what you want to study.
                    </h3>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      Browse every published programme, grouped by academic field.
                    </p>
                    <Link
                      href="/courses"
                      onClick={() => setCourseMenuOpen(null)}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      View all programs <ArrowRight className="size-3.5" />
                    </Link>
                  </div>

                  <div className="max-h-[calc(100vh-7rem)] overflow-y-auto p-5">
                    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
                      {programmeGroups.map((group) => (
                        <section key={group.stream}>
                          <p className="border-b border-border pb-2 text-xs font-semibold uppercase tracking-[0.13em] text-primary">
                            {group.label}
                          </p>
                          <div className="mt-2 space-y-0.5">
                            {group.courses.map((course) => (
                              <Link
                                key={course.slug}
                                href={course.href}
                                onClick={() => setCourseMenuOpen(null)}
                                className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                              >
                                <span className="min-w-0 truncate">{course.name}</span>
                                <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                              </Link>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </nav>

          {/* Desktop actions */}
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <SearchPalette />
            <UserMenu />
            <CounsellingDialog
              triggerVariant="accent"
              triggerSize="sm"
              triggerClassName="gap-1.5 px-5 shadow-cta hover:shadow-cta-hover"
              triggerContent={
                <>
                  Request counselling
                  <ArrowRight className="size-3.5" />
                </>
              }
            />
          </div>

          {/* Mobile toggle */}
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

      {/* Mobile overlay */}
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

      {/* Mobile drawer */}
      <div
        inert={!mobileOpen}
        className={cn(
          "fixed inset-0 z-50 flex h-full w-full flex-col bg-white shadow-drawer transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-white px-6">
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
          <nav className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-y-auto bg-white pb-4">
            <Link
              href="/universities"
              onClick={closeMobile}
              className="order-2 flex w-full items-center justify-between border-b border-border/70 bg-white px-5 py-4 text-foreground transition-colors hover:bg-muted/40 sm:px-7"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/8">
                  <University className="size-4 text-primary" />
                </span>
                <span className="text-sm font-semibold">Universities</span>
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            <div className="order-1 border-b border-border/70 bg-white">
              <button
                type="button"
                onClick={() => {
                  setMobileCountriesOpen((open) => !open);
                }}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-foreground transition-colors hover:bg-muted/40 sm:px-7"
                aria-expanded={mobileCountriesOpen}
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary/8">
                    <MapPinned className="size-4 text-primary" />
                  </span>
                  <span className="text-sm font-semibold">Countries</span>
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    mobileCountriesOpen ? "rotate-180" : "",
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  mobileCountriesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div inert={!mobileCountriesOpen} className="overflow-hidden">
                  <div className="space-y-1 bg-muted/15 px-5 pb-4 pt-1 sm:px-7">
                    {filteredNavCountries.length > 0 ? (
                      filteredNavCountries.map((destination) => (
                        <Link
                          key={destination.href}
                          href={destination.href}
                          onClick={closeMobile}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors hover:bg-primary/5"
                        >
                          <CountryFlag
                            countryCode={destination.isoCode}
                            alt={destination.name}
                            width={24}
                            height={18}
                            className="rounded-sm border border-black/5"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">
                              {destination.name}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="px-3 py-4 text-sm text-muted-foreground">
                        No destinations available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="order-3 border-b border-border/70 bg-white">
              <button
                type="button"
                onClick={() => {
                  setCourseMenuOpen(programsOpen ? null : "programs");
                  setMobileCountriesOpen(false);
                }}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-foreground transition-colors hover:bg-muted/40 sm:px-7"
                aria-expanded={programsOpen}
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary/8">
                    <GraduationCap className="size-4 text-primary" />
                  </span>
                  <span className="text-sm font-semibold">Programs</span>
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    programsOpen ? "rotate-180" : "",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  programsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div inert={!programsOpen} className="overflow-hidden">
                  <div className="space-y-5 bg-muted/15 px-5 pb-4 pt-3 sm:px-7">
                    {programmeGroups.map((group) => (
                      <section key={group.stream}>
                        <p className="px-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                          {group.label}
                        </p>
                        <div className="mt-1 space-y-0.5">
                          {group.courses.map((course) => (
                            <Link
                              key={course.slug}
                              href={course.href}
                              onClick={closeMobile}
                              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/40 hover:text-primary"
                            >
                              <span>{course.name}</span>
                              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                            </Link>
                          ))}
                        </div>
                      </section>
                    ))}
                    <Link
                      href="/courses"
                      onClick={closeMobile}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-primary"
                    >
                      View all programs <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </nav>

          <div className="mx-auto w-full max-w-3xl px-4 pb-2 sm:px-6">
            <UserMenuMobile onClose={closeMobile} />
          </div>

          <div className="flex-shrink-0 border-t border-border bg-white p-4 sm:px-6">
            <CounsellingDialog
              triggerVariant="accent"
              triggerClassName="w-full gap-2"
              onTriggerClick={closeMobile}
              triggerContent={
                <>
                  Request counselling
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

// Minimal static shell rendered as the Suspense fallback during prerendering.
// It matches the header's height and frosted-glass appearance so there is no
// layout shift, but carries no interactive or pathname-dependent state.
function SiteHeaderShell() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-white/60"
      style={{
        background: "rgba(255, 255, 255, 0.60)",
        backdropFilter: "blur(24px) saturate(180%) brightness(1.06)",
        WebkitBackdropFilter: "blur(24px) saturate(180%) brightness(1.06)",
      }}
    >
      <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <SiteLogo showTagline />
      </div>
    </header>
  );
}

export function SiteHeader() {
  return (
    <Suspense fallback={<SiteHeaderShell />}>
      <SiteHeaderInner />
    </Suspense>
  );
}
