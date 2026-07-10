"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, GraduationCap, Menu, Search, X } from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { UserMenu, UserMenuMobile } from "@/components/site/user-menu";
import { CountryFlag } from "@/components/site/country-flag";
import { SearchPalette } from "@/components/site/search-palette";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useNavCountries,
  useNavCountriesByRegion,
} from "@/components/app/nav-countries-client-provider";
import { useNavUniversities } from "@/components/app/nav-universities-client-provider";
import { FEATURED_NAV_COUNTRY_SLUG } from "@/lib/data/nav-constants";
import { getCountryHeroImage } from "@/lib/country-media";

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
  { href: "/reviews",      label: "Reviews" },
  { href: "/news",         label: "News" },
  { href: "/blog",         label: "Blog" },
] as const;

const universityQuickLinks = [
  {
    href: "/universities",
    label: "Abroad Colleges",
    description: "Browse universities across top study-abroad destinations",
  },
  {
    href: "/india-mbbs-colleges",
    label: "India MBBS Colleges",
    description: "Browse government and private MBBS colleges in India",
  },
] as const;

// Simple, dependency-free substring match used by every search/filter box in
// the nav. Case-insensitive; an empty query matches everything.
function matchesQuery(name: string, query: string) {
  const trimmed = query.trim().toLowerCase();
  return trimmed.length === 0 || name.toLowerCase().includes(trimmed);
}

function NavSearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 rounded-xl pl-10 text-sm"
      />
    </div>
  );
}

function SiteHeaderInner() {
  const pathname = usePathname();
  const navCountries = useNavCountries();
  const navCountriesByRegion = useNavCountriesByRegion();
  const navUniversitiesByCountry = useNavUniversities();
  const featuredCountry = navCountries.find(
    (country) => country.slug === FEATURED_NAV_COUNTRY_SLUG,
  );
  const featuredCountryImage = featuredCountry
    ? getCountryHeroImage(featuredCountry.slug)
    : null;

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

  // Search/filter state. Shared between the desktop mega menu and the mobile
  // accordion equivalent for the same section - only one of the two is ever
  // visible at a given viewport width, so there's no real cross-talk, and it
  // keeps the amount of state manageable as the catalog grows.
  const [countryQuery, setCountryQuery] = useState("");
  const [universityQuery, setUniversityQuery] = useState("");

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

  const filteredRegionGroups = useMemo(() => {
    if (!countryQuery.trim()) return navCountriesByRegion;
    return navCountriesByRegion
      .map((group) => ({
        ...group,
        countries: group.countries.filter((country) => matchesQuery(country.name, countryQuery)),
      }))
      .filter((group) => group.countries.length > 0);
  }, [navCountriesByRegion, countryQuery]);

  const filteredNavCountries = useMemo(
    () => navCountries.filter((country) => matchesQuery(country.name, countryQuery)),
    [navCountries, countryQuery],
  );

  const filteredUniversityGroups = useMemo(
    () => navUniversitiesByCountry.filter((group) => matchesQuery(group.countryName, universityQuery)),
    [navUniversitiesByCountry, universityQuery],
  );

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

  // Reset each menu's search box (and the mobile inline expansion) once it
  // closes, so reopening it always starts from a clean, fully-visible state.
  useEffect(() => {
    if (!countriesOpen) setCountryQuery("");
  }, [countriesOpen]);

  useEffect(() => {
    if (!universitiesOpen) setUniversityQuery("");
  }, [universitiesOpen]);

  useEffect(() => {
    if (!mobileCountriesOpen) setCountryQuery("");
  }, [mobileCountriesOpen]);

  useEffect(() => {
    if (!mobileUniversitiesOpen) {
      setUniversityQuery("");
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
  const universitiesActive =
    isActive("/universities") || isActive("/india-mbbs-colleges");

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
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
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
                  "absolute left-0 top-full mt-2 w-[52rem] max-w-[90vw] overflow-hidden rounded-2xl border border-border bg-background shadow-xl transition-all duration-200",
                  countriesOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0",
                )}
              >
                <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-3">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary/70">
                      Countries
                    </p>
                    <h3 className="mt-0.5 text-sm font-semibold text-heading">
                      Choose a destination
                    </h3>
                  </div>
                  <NavSearchInput
                    value={countryQuery}
                    onChange={setCountryQuery}
                    placeholder="Search countries…"
                    className="w-56"
                  />
                </div>

                <div className="flex gap-6 p-5">
                  <div className="max-h-[24rem] flex-1 overflow-y-auto pr-1">
                    {filteredRegionGroups.length > 0 ? (
                      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                        {filteredRegionGroups.map((group) => (
                          <div key={group.region}>
                            <p className="px-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                              {group.region}
                            </p>
                            <div className="mt-1">
                              {group.countries.map((destination) => (
                                <Link
                                  key={destination.href}
                                  href={destination.href}
                                  onClick={() => setCountriesOpen(false)}
                                  className="group flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-muted"
                                >
                                  <CountryFlag
                                    countryCode={destination.isoCode}
                                    alt={destination.name}
                                    width={22}
                                    height={15}
                                    className="rounded-sm border border-black/5 shadow-sm"
                                  />
                                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                                    {destination.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                        <p className="text-sm font-medium text-foreground">
                          No destinations match &ldquo;{countryQuery}&rdquo;
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

                  {featuredCountry && featuredCountryImage && (
                    <Link
                      href={featuredCountry.href}
                      onClick={() => setCountriesOpen(false)}
                      className="group relative flex w-56 shrink-0 flex-col overflow-hidden rounded-2xl border border-border/60"
                    >
                      <div className="relative h-28 w-full overflow-hidden">
                        <Image
                          src={featuredCountryImage.url}
                          alt={featuredCountryImage.alt}
                          fill
                          sizes="224px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-accent/90 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">
                          Popular
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-1 bg-muted/40 p-3.5">
                        <p className="text-sm font-semibold text-heading">
                          {featuredCountry.name}
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {featuredCountry.description}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                          Explore {featuredCountry.name}
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  )}
                </div>

                <div className="border-t border-border/60 p-2">
                  <Link
                    href="/countries"
                    onClick={() => setCountriesOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-primary"
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
                  "absolute left-0 top-full mt-2 w-[46rem] max-w-[92vw] overflow-hidden rounded-2xl border border-border bg-background shadow-xl transition-all duration-200",
                  universitiesOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0",
                )}
              >
                <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-3">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary/70">
                      Explore Colleges
                    </p>
                    <h3 className="mt-0.5 text-sm font-semibold text-heading">
                      Choose a college finder
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-b border-border/60 p-3">
                  {universityQuickLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setUniversitiesOpen(false)}
                      className="group flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5 transition-colors hover:bg-muted"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
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
                  <div className="flex">
                    {/* Country rail: scrollable + searchable, scales to any number of countries */}
                    <div className="w-56 shrink-0 border-r border-border/60 p-3">
                      <NavSearchInput
                        value={universityQuery}
                        onChange={setUniversityQuery}
                        placeholder="Search countries…"
                        className="mb-2"
                      />
                      <div
                        role="tablist"
                        aria-label="Countries with university listings"
                        className="max-h-72 space-y-0.5 overflow-y-auto"
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
                                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                                  active
                                    ? "bg-primary/8 font-semibold text-primary"
                                    : "text-foreground/80 hover:bg-muted",
                                )}
                              >
                                <CountryFlag
                                  countryCode={countryBySlug.get(group.countrySlug)?.isoCode ?? ""}
                                  alt={group.countryName}
                                  width={18}
                                  height={13}
                                  className="shrink-0 rounded-sm border border-black/5"
                                />
                                <span className="min-w-0 flex-1 truncate">{group.countryName}</span>
                                <span className="shrink-0 text-[0.7rem] text-muted-foreground">
                                  {group.totalPublishedCount}
                                </span>
                              </button>
                            );
                          })
                        ) : (
                          <p className="px-2 py-4 text-xs text-muted-foreground">
                            No countries match &ldquo;{universityQuery}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* University preview panel for the active/hovered country */}
                    <div className="min-w-0 flex-1 p-4">
                      {activeUniversityGroup ? (
                        <>
                          <div className="mb-2.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <CountryFlag
                                countryCode={countryBySlug.get(activeUniversityGroup.countrySlug)?.isoCode ?? ""}
                                alt={activeUniversityGroup.countryName}
                                width={20}
                                height={14}
                                className="rounded-sm border border-black/5"
                              />
                              <h4 className="text-sm font-semibold text-heading">
                                {activeUniversityGroup.countryName}
                              </h4>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {activeUniversityGroup.totalPublishedCount} universities
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            {activeUniversityGroup.universities.map((university) => (
                              <Link
                                key={university.href}
                                href={university.href}
                                onClick={() => setUniversitiesOpen(false)}
                                className="group flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                              >
                                <span className="min-w-0 flex-1 truncate">{university.name}</span>
                                <span className="shrink-0 truncate text-xs text-muted-foreground">
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
                            View all {activeUniversityGroup.totalPublishedCount} in {activeUniversityGroup.countryName}
                            <ArrowRight className="size-3" />
                          </Link>
                        </>
                      ) : (
                        <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center">
                          <p className="text-sm font-medium text-foreground">
                            No countries match &ldquo;{universityQuery}&rdquo;
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
                        <NavSearchInput
                          value={universityQuery}
                          onChange={setUniversityQuery}
                          placeholder="Search countries…"
                          className="px-1 py-1.5"
                        />
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
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                      {group.totalPublishedCount}
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
                              No countries match &ldquo;{universityQuery}&rdquo;
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
                    <NavSearchInput
                      value={countryQuery}
                      onChange={setCountryQuery}
                      placeholder="Search countries…"
                      className="px-1 py-1.5"
                    />
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
                        No destinations match &ldquo;{countryQuery}&rdquo;
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
