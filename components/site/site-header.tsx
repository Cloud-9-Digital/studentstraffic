"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, GraduationCap, Menu, X } from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { UserMenu, UserMenuMobile } from "@/components/site/user-menu";
import { CountryFlag } from "@/components/site/country-flag";
import { SearchPalette } from "@/components/site/search-palette";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [universitiesOpen, setUniversitiesOpen] = useState(false);
  const [mobileCountriesOpen, setMobileCountriesOpen] = useState(false);
  const [mobileUniversitiesOpen, setMobileUniversitiesOpen] = useState(false);
  const countriesMenuRef = useRef<HTMLDivElement | null>(null);
  const universitiesMenuRef = useRef<HTMLDivElement | null>(null);

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
                </div>

                <div className="flex gap-6 p-5">
                  <div className="grid flex-1 grid-cols-3 gap-x-6 gap-y-4">
                    {navCountriesByRegion.map((group) => (
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
                className={cn(
                  "absolute left-0 top-full mt-2 w-[58rem] max-w-[90vw] overflow-hidden rounded-2xl border border-border bg-background shadow-xl transition-all duration-200",
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
                  {[
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
                  ].map((item) => (
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
                  <div className="grid grid-cols-4 gap-x-5 gap-y-4 p-5">
                    {navUniversitiesByCountry.map((group) => (
                      <div key={group.countrySlug}>
                        <p className="px-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {group.countryName}
                        </p>
                        <div className="mt-1.5 space-y-0.5">
                          {group.universities.map((university) => (
                            <Link
                              key={university.href}
                              href={university.href}
                              onClick={() => setUniversitiesOpen(false)}
                              className="block truncate rounded-lg px-1 py-1.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                            >
                              {university.name}
                            </Link>
                          ))}
                          {group.totalFeaturedCount > group.universities.length && (
                            <Link
                              href={group.href}
                              onClick={() => setUniversitiesOpen(false)}
                              className="mt-1 flex items-center gap-1 rounded-lg px-1 py-1 text-xs font-semibold text-primary transition-colors hover:underline"
                            >
                              View all in {group.countryName}
                              <ArrowRight className="size-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
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
              showInterestSelects
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
                  "overflow-hidden transition-all duration-200",
                  mobileUniversitiesOpen ? "max-h-44 opacity-100" : "max-h-0 opacity-0",
                )}
              >
                <div className="space-y-1 px-2 pb-2">
                  {[
                    { href: "/universities", label: "Abroad Colleges" },
                    { href: "/india-mbbs-colleges", label: "India MBBS Colleges" },
                  ].map((item) => (
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
                  "overflow-hidden transition-all duration-200",
                  mobileCountriesOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
                )}
              >
                <div className="space-y-1 px-2 pb-2">
                  {navCountries.map((destination) => (
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
                  ))}
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
              showInterestSelects
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
