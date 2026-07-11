"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  GraduationCap,
  MapPinned,
  Menu,
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
import { useNavUniversities } from "@/components/app/nav-universities-client-provider";
import { FEATURED_NAV_COUNTRY_SLUG } from "@/lib/data/nav-constants";

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

const navLinks = [
  { href: "/students",     label: "Talk to Students" },
  { href: "/news",         label: "News" },
  { href: "/blog",         label: "Blog" },
] as const;

const universityQuickLinks = [
  {
    href: "/universities",
    label: "Abroad Colleges",
    description: "Browse universities across top study-abroad destinations",
  },
] as const;

function SiteHeaderInner() {
  const pathname = usePathname();
  const navCountries = useNavCountries();
  const navUniversitiesByCountry = useNavUniversities();
  const countryBySlug = useMemo(
    () => new Map(navCountries.map((country) => [country.slug, country] as const)),
    [navCountries],
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [universitiesOpen, setUniversitiesOpen] = useState(false);
  const [mobileCountriesOpen, setMobileCountriesOpen] = useState(false);
  const [mobileUniversitiesOpen, setMobileUniversitiesOpen] = useState(false);
  const countriesMenuRef = useRef<HTMLDivElement | null>(null);
  const universitiesMenuRef = useRef<HTMLDivElement | null>(null);

  // Which country's universities are previewed in the desktop mega menu's
  // right-hand panel. Defaults to the featured destination when it has a
  // university list, else whichever country sorts first (most active).
  const [activeUniversityCountrySlug, setActiveUniversityCountrySlug] = useState<string | null>(
    () =>
      navUniversitiesByCountry.find((group) => group.countrySlug === FEATURED_NAV_COUNTRY_SLUG)
        ?.countrySlug ??
      navUniversitiesByCountry[0]?.countrySlug ??
      null,
  );

  // Which country's universities are expanded inline in the mobile
  // accordion. Only one at a time, closed by default.
  const [mobileExpandedUniversityCountry, setMobileExpandedUniversityCountry] = useState<
    string | null
  >(null);

  const filteredNavCountries = navCountries;

  const filteredUniversityGroups = navUniversitiesByCountry;

  const activeUniversityGroup =
    filteredUniversityGroups.find((group) => group.countrySlug === activeUniversityCountrySlug) ??
    filteredUniversityGroups[0] ??
    null;

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
    setMobileOpen(false);
    setCountriesOpen(false);
    setUniversitiesOpen(false);
    setMobileCountriesOpen(false);
    setMobileUniversitiesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileUniversitiesOpen) {
      setMobileExpandedUniversityCountry(null);
    }
  }, [mobileUniversitiesOpen]);

  useEffect(() => {
    if (!countriesOpen && !universitiesOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!countriesMenuRef.current?.contains(event.target as Node)) {
        setCountriesOpen(false);
      }
      if (!universitiesMenuRef.current?.contains(event.target as Node)) {
        setUniversitiesOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCountriesOpen(false);
        setUniversitiesOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [countriesOpen, universitiesOpen]);

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
          <nav className="absolute inset-x-0 hidden items-center justify-center gap-0.5 lg:flex">
            <div className="relative" ref={countriesMenuRef}>
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

            <div className="relative" ref={universitiesMenuRef}>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                  universitiesActive || universitiesOpen
                    ? "bg-primary/8 text-primary"
                    : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
                )}
                aria-expanded={universitiesOpen}
                aria-haspopup="menu"
                onClick={() => setUniversitiesOpen((open) => !open)}
              >
                Universities
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    universitiesOpen ? "rotate-180" : "",
                  )}
                />
              </button>

              <div
                inert={!universitiesOpen}
                className={cn(
                  "fixed inset-x-0 top-16 z-40 w-screen overflow-hidden rounded-b-3xl border border-t-0 border-border bg-white shadow-xl transition-all duration-200",
                  universitiesOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0",
                )}
              >
                <div className="float-left min-h-[25rem] w-80 border-r border-border bg-white px-6 py-7">
                  <div>
                    <div>
                      <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
                        <Building2 className="size-3.5" /> University atlas
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-primary">
                        Start with the destination, then meet the right university
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Explore verified options by country, city, and student fit.
                      </p>
                    </div>
                    <Link
                      href="/universities"
                      onClick={() => setUniversitiesOpen(false)}
                      className="mt-8 flex w-fit items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                    >
                      Open finder <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="ml-80 grid grid-cols-1 gap-3 border-b border-border/60 bg-white p-4 sm:grid-cols-2">
                  {universityQuickLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setUniversitiesOpen(false)}
                      className="group flex items-center gap-3 rounded-2xl border border-primary/10 bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
                    >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                        <GraduationCap className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {item.label}
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  ))}
                </div>

                {navUniversitiesByCountry.length > 0 && (
                  <div className="ml-80 flex bg-background">
                    {/* Country rail: scrollable + searchable, scales to any number of countries */}
                    <div className="w-60 shrink-0 border-r border-border/60 bg-muted/20 p-4">
                      <div
                        role="tablist"
                        aria-label="Countries with university listings"
                        className="max-h-80 space-y-1 overflow-y-auto"
                      >
                        {filteredUniversityGroups.length > 0 ? (
                          filteredUniversityGroups.map((group) => {
                            const active = activeUniversityGroup?.countrySlug === group.countrySlug;
                            return (
                              <button
                                key={group.countrySlug}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onMouseEnter={() => setActiveUniversityCountrySlug(group.countrySlug)}
                                onFocus={() => setActiveUniversityCountrySlug(group.countrySlug)}
                                onClick={() => setActiveUniversityCountrySlug(group.countrySlug)}
                                className={cn(
                                  "flex w-full items-center gap-2 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm transition-all",
                                  active
                                    ? "border-primary/10 bg-white font-semibold text-primary shadow-sm"
                                    : "text-foreground/80 hover:bg-white hover:shadow-sm",
                                )}
                              >
                                <CountryFlag
                                  countryCode={countryBySlug.get(group.countrySlug)?.isoCode ?? ""}
                                  alt={group.countryName}
                                  width={18}
                                  height={13}
                                  className="shrink-0 rounded-sm border border-black/5"
                                />
                                <span className="min-w-0 flex-1 break-words leading-5">{group.countryName}</span>
                              </button>
                            );
                          })
                        ) : (
                          <p className="px-2 py-4 text-xs text-muted-foreground">
                            No countries with university listings
                          </p>
                        )}
                      </div>
                    </div>

                    {/* University preview panel for the active/hovered country */}
                    <div className="min-w-0 flex-1 p-5">
                      {activeUniversityGroup ? (
                        <>
                          <div className="mb-4 flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                            <div className="flex items-center gap-2">
                              <CountryFlag
                                countryCode={countryBySlug.get(activeUniversityGroup.countrySlug)?.isoCode ?? ""}
                                alt={activeUniversityGroup.countryName}
                                width={20}
                                height={14}
                                className="rounded-sm border border-black/5"
                              />
                              <h4 className="font-display text-lg font-semibold tracking-tight text-heading">
                                {activeUniversityGroup.countryName}
                              </h4>
                            </div>
                          </div>
                          <div className="grid max-h-[24rem] gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
                            {activeUniversityGroup.universities.map((university) => (
                              <Link
                                key={university.href}
                                href={university.href}
                                onClick={() => setUniversitiesOpen(false)}
                                className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary hover:shadow-sm"
                              >
                                <span className="min-w-0 flex-1 break-words leading-5">{university.name}</span>
                                <span className="shrink-0 text-right text-xs text-muted-foreground">
                                  {university.city}
                                </span>
                              </Link>
                            ))}
                          </div>
                          <Link
                            href={activeUniversityGroup.href}
                            onClick={() => setUniversitiesOpen(false)}
                            className="mt-2.5 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:underline"
                          >
                            View all in {activeUniversityGroup.countryName}
                            <ArrowRight className="size-3" />
                          </Link>
                        </>
                      ) : (
                        <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center">
                          <p className="text-sm font-medium text-foreground">
                            No countries with university listings
                          </p>
                          <Link
                            href="/universities"
                            onClick={() => setUniversitiesOpen(false)}
                            className="text-sm font-semibold text-primary hover:underline"
                          >
                            Browse all universities
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(href)
                    ? "bg-primary/8 text-primary"
                    : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
                )}
              >
                {label}
              </Link>
            ))}
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
            <div className="rounded-2xl">
              <button
                type="button"
                onClick={() => setMobileUniversitiesOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
                aria-expanded={mobileUniversitiesOpen}
              >
                <span>Universities</span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    mobileUniversitiesOpen ? "rotate-180" : "",
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  mobileUniversitiesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div inert={!mobileUniversitiesOpen} className="overflow-hidden">
                  <div className="space-y-1 px-2 pb-3">
                    <div className="grid gap-1.5 pb-1">
                      {universityQuickLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className="flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {navUniversitiesByCountry.length > 0 && (
                      <>
                        <p className="px-3 pt-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Browse by country
                        </p>
                        <div className="space-y-0.5">
                          {filteredUniversityGroups.length > 0 ? (
                            filteredUniversityGroups.map((group) => {
                              const expanded = mobileExpandedUniversityCountry === group.countrySlug;
                              return (
                                <div key={group.countrySlug}>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setMobileExpandedUniversityCountry(expanded ? null : group.countrySlug)
                                    }
                                    aria-expanded={expanded}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-black/5"
                                  >
                                    <CountryFlag
                                      countryCode={countryBySlug.get(group.countrySlug)?.isoCode ?? ""}
                                      alt={group.countryName}
                                      width={20}
                                      height={14}
                                      className="shrink-0 rounded-sm border border-black/5"
                                    />
                                    <span className="min-w-0 flex-1 truncate text-left font-medium text-foreground">
                                      {group.countryName}
                                    </span>
                                    <ChevronDown
                                      className={cn(
                                        "size-3.5 shrink-0 text-muted-foreground transition-transform",
                                        expanded ? "rotate-180" : "",
                                      )}
                                    />
                                  </button>
                                  <div
                                    className={cn(
                                      "grid transition-[grid-template-rows] duration-200 ease-out",
                                      expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                                    )}
                                  >
                                    <div inert={!expanded} className="overflow-hidden">
                                      <div className="space-y-0.5 py-1 pl-9 pr-2">
                                        {group.universities.map((university) => (
                                          <Link
                                            key={university.href}
                                            href={university.href}
                                            onClick={closeMobile}
                                            className="block truncate rounded-lg px-2 py-1.5 text-sm text-foreground/85 transition-colors hover:bg-black/5"
                                          >
                                            {university.name}
                                          </Link>
                                        ))}
                                        <Link
                                          href={group.href}
                                          onClick={closeMobile}
                                          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-primary"
                                        >
                                          View all in {group.countryName}
                                          <ArrowRight className="size-3" />
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="px-3 py-4 text-sm text-muted-foreground">
                              No countries with university listings
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl">
              <button
                type="button"
                onClick={() => setMobileCountriesOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
                aria-expanded={mobileCountriesOpen}
              >
                <span>Countries</span>
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
                  <div className="space-y-1 px-2 pb-3">
                    {filteredNavCountries.length > 0 ? (
                      filteredNavCountries.map((destination) => (
                        <Link
                          key={destination.href}
                          href={destination.href}
                          onClick={closeMobile}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-black/5"
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

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5"
              >
                {label}
              </Link>
            ))}
          </nav>

          <UserMenuMobile onClose={closeMobile} />

          <div className="flex-shrink-0 border-t border-border p-4">
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
