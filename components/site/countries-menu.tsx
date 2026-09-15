"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, MapPinned, Stethoscope } from "lucide-react";

import { CountryFlag } from "@/components/site/country-flag";
import { NAV_REGIONS, type NavRegionId } from "@/lib/country-regions";
import { MBBS_NAV_COUNTRY_SLUGS } from "@/lib/data/nav-constants";
import type { NavCountry } from "@/lib/data/nav-countries";
import { cn } from "@/lib/utils";

// ─── Data model ────────────────────────────────────────────────────────────

const POPULAR_LIMIT = 8;

// Only routes that exist and are indexable (buildIndexableMetadata).
const MBBS_GUIDE_LINKS = [
  { href: "/mbbs-abroad", label: "MBBS abroad", mobileLabel: "MBBS abroad guide" },
  { href: "/mbbs-in-russia-admission", label: "Russia", mobileLabel: "MBBS in Russia" },
  { href: "/mbbs-in-georgia-admission", label: "Georgia", mobileLabel: "MBBS in Georgia" },
  { href: "/mbbs-in-vietnam-admission", label: "Vietnam", mobileLabel: "MBBS in Vietnam" },
] as const;

type RegionGroup = { id: NavRegionId; label: string; countries: NavCountry[] };

export type CountriesMenuModel = {
  popular: NavCountry[];
  mbbs: NavCountry[];
  regions: RegionGroup[];
};

const byName = (left: NavCountry, right: NavCountry) => left.name.localeCompare(right.name);

function buildCountriesMenuModel(countries: readonly NavCountry[]): CountriesMenuModel {
  const byRegion = new Map<NavRegionId, NavCountry[]>();
  const bySlug = new Map<string, NavCountry>();

  for (const country of countries) {
    bySlug.set(country.slug, country);
    const list = byRegion.get(country.region);
    if (list) list.push(country);
    else byRegion.set(country.region, [country]);
  }

  return {
    // Ordered by published university count; counts are never displayed.
    // Countries without published universities stay in their region list
    // (they have country pages worth linking) but never rank as popular.
    popular: countries
      .filter((country) => country.universityCount > 0)
      .sort((left, right) => right.universityCount - left.universityCount || byName(left, right))
      .slice(0, POPULAR_LIMIT),
    mbbs: MBBS_NAV_COUNTRY_SLUGS.flatMap((slug) => {
      const country = bySlug.get(slug);
      return country?.hasMedicine && country.universityCount > 0 ? [country] : [];
    }),
    regions: NAV_REGIONS.flatMap(({ id, label }) => {
      const list = byRegion.get(id);
      return list?.length ? [{ id, label, countries: list.sort(byName) }] : [];
    }),
  };
}

/** Groups the nav payload once per data change. */
export function useCountriesMenuModel(countries: readonly NavCountry[]) {
  return useMemo(() => buildCountriesMenuModel(countries), [countries]);
}

// ─── Shared bits ───────────────────────────────────────────────────────────

// Flags are decorative (the country name is right beside them), so alt="".
// Until the menu has been opened a same-size placeholder renders instead, so
// the closed panel on every page never requests 80 flag images.
function Flag({
  country,
  show,
  width,
  height,
  className,
}: {
  country: NavCountry;
  show: boolean;
  width: number;
  height: number;
  className?: string;
}) {
  if (!show) {
    return (
      <span
        aria-hidden
        className={cn("inline-block shrink-0 bg-muted", className)}
        style={{ width, height }}
      />
    );
  }
  return (
    <CountryFlag
      countryCode={country.isoCode}
      alt=""
      width={width}
      height={height}
      className={cn("shrink-0", className)}
    />
  );
}

function CountryListItem({
  country,
  showFlag,
  onSelect,
}: {
  country: NavCountry;
  showFlag: boolean;
  onSelect: () => void;
}) {
  return (
    <li className="break-inside-avoid">
      <Link
        href={country.href}
        onClick={onSelect}
        className="group flex min-w-0 items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-foreground outline-none transition-colors hover:bg-primary/[0.06] hover:text-primary focus-visible:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <Flag
          country={country}
          show={showFlag}
          width={20}
          height={14}
          className="rounded-[3px] ring-1 ring-black/5"
        />
        <span className="min-w-0 truncate font-medium">{country.name}</span>
      </Link>
    </li>
  );
}

// ─── Desktop panel ─────────────────────────────────────────────────────────

type DesktopTabId = "popular" | NavRegionId;

export function DesktopCountriesMenu({
  model,
  open,
  active,
  onToggle,
  onClose,
  containerRef,
}: {
  model: CountriesMenuModel;
  open: boolean;
  active: boolean;
  onToggle: () => void;
  onClose: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const tabId = (id: DesktopTabId) => `${baseId}-tab-${id}`;
  const tabPanelId = (id: DesktopTabId) => `${baseId}-tabpanel-${id}`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<DesktopTabId>("popular");
  const [hasOpened, setHasOpened] = useState(open);
  const [prevOpen, setPrevOpen] = useState(open);

  // Each opening starts from a clean Popular view. Adjusted during render
  // (not in an effect) so the stale view never paints for a frame.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setHasOpened(true);
      setActiveTab("popular");
    }
  }

  const tabs = useMemo(
    () => [
      { id: "popular" as const, label: "Popular", heading: "Most popular" },
      ...model.regions.map((region) => ({ id: region.id, label: region.label, heading: region.label })),
    ],
    [model],
  );

  useEffect(() => {
    if (open) return;
    // Closing makes the panel inert; hand focus back to the trigger rather
    // than letting it fall to <body>.
    if (panelRef.current?.contains(document.activeElement)) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === activeTab);
    let next = -1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    if (next < 0) return;
    event.preventDefault();
    const nextId = tabs[next].id;
    setActiveTab(nextId);
    document.getElementById(tabId(nextId))?.focus();
  };

  const activeHeading = tabs.find((tab) => tab.id === activeTab)?.heading ?? "Most popular";

  return (
    <div className="pointer-events-auto relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
          active || open
            ? "bg-primary/8 text-primary"
            : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
        )}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <MapPinned className="size-3.5 text-primary/65" />
        Countries
        <ChevronDown className={cn("size-4 transition-transform motion-reduce:transition-none", open && "rotate-180")} />
      </button>

      <div
        id={panelId}
        ref={panelRef}
        inert={!open}
        className={cn(
          // No `w-screen`: the header's backdrop-filter makes it this
          // panel's containing block, so `inset-x-0` already spans the
          // header, while 100vw would add the vertical-scrollbar width
          // as horizontal page overflow on classic-scrollbar browsers.
          "fixed inset-x-0 top-16 z-40 overflow-hidden rounded-b-3xl border border-t-0 border-border bg-white shadow-xl transition-[opacity,translate] duration-200 motion-reduce:transition-none",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0 motion-reduce:translate-y-0",
        )}
      >
        <div className="grid grid-cols-[15rem_minmax(0,1fr)] 2xl:grid-cols-[17rem_minmax(0,1fr)]">
          {/* Region rail */}
          <div className="relative overflow-hidden bg-primary px-4 pb-6 pt-6 text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(circle,rgba(185,239,208,0.16),transparent_70%)]"
            />
            <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/55">
              Destinations
            </p>
            <p className="mt-1.5 px-3 font-display text-[1.6rem] font-semibold leading-[1.05] tracking-[-0.03em]">
              Where do you want
              <span className="block text-heading-contrast">to study?</span>
            </p>

            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label="Browse countries by region"
              onKeyDown={handleTabKeyDown}
              className="mt-6 flex flex-col gap-0.5"
            >
              {tabs.map((tab) => {
                const selected = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    id={tabId(tab.id)}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={tabPanelId(tab.id)}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center rounded-xl px-3 py-2 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-heading-contrast/70 motion-reduce:transition-none",
                      selected
                        ? "bg-white font-semibold text-primary shadow-sm"
                        : "text-white/75 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <span className="min-w-0 truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-col">
            {/* Quiet visual label for the active tab; each tabpanel is already
                labelled by its tab, so this is hidden from assistive tech. */}
            <p
              aria-hidden
              className="px-6 pt-5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-heading"
            >
              {activeHeading}
            </p>

            {/* Single scroll area (never nested) as a fallback for short viewports. */}
            <div className="max-h-[calc(100dvh-12rem)] overflow-y-auto overscroll-contain px-6 pb-5 pt-3">
              {/* Every region panel stays in the DOM (hidden when inactive) so
                  all country links remain crawlable; flags only load once opened. */}
              <div
                id={tabPanelId("popular")}
                role="tabpanel"
                aria-labelledby={tabId("popular")}
                hidden={activeTab !== "popular"}
              >
                <ol className="grid grid-cols-4 gap-2.5">
                  {model.popular.map((country) => (
                    <li key={country.slug}>
                      <Link
                        href={country.href}
                        onClick={onClose}
                        className="group relative flex h-full items-center gap-3 rounded-2xl border border-border bg-white p-3 outline-none transition-[border-color,box-shadow,translate] hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md focus-visible:border-primary/40 focus-visible:ring-3 focus-visible:ring-primary/15 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        <Flag
                          country={country}
                          show={hasOpened}
                          width={34}
                          height={24}
                          className="rounded-md ring-1 ring-black/5"
                        />
                        <span className="min-w-0 truncate text-sm font-semibold text-foreground group-hover:text-primary">
                          {country.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>

                {model.mbbs.length > 0 ? (
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-dashed border-border pt-4">
                    <p className="mr-1 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-heading">
                      <Stethoscope aria-hidden className="size-3.5 text-accent" />
                      Popular for MBBS
                    </p>
                    <ul className="flex flex-wrap items-center gap-2">
                      {model.mbbs.map((country) => (
                        <li key={country.slug}>
                          <Link
                            href={country.href}
                            onClick={onClose}
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-white py-1 pl-1.5 pr-3 text-sm font-medium text-foreground outline-none transition-colors hover:border-accent/30 hover:bg-accent/[0.05] hover:text-accent focus-visible:ring-2 focus-visible:ring-accent/30"
                          >
                            <Flag
                              country={country}
                              show={hasOpened}
                              width={18}
                              height={18}
                              className="rounded-full ring-1 ring-black/5"
                            />
                            {country.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {model.regions.map((region) => (
                <div
                  key={region.id}
                  id={tabPanelId(region.id)}
                  role="tabpanel"
                  aria-labelledby={tabId(region.id)}
                  hidden={activeTab !== region.id}
                >
                  <ul className="columns-4 gap-x-6 2xl:columns-5">
                    {region.countries.map((country) => (
                      <CountryListItem
                        key={country.slug}
                        country={country}
                        showFlag={hasOpened && activeTab === region.id}
                        onSelect={onClose}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border bg-muted/25 px-6 py-3">
          <nav aria-label="MBBS guides" className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
            <span className="mr-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              MBBS guides
            </span>
            {MBBS_GUIDE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="rounded-lg px-2 py-1 font-medium text-foreground/80 transition-colors hover:bg-primary/8 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/compare"
              onClick={onClose}
              className="rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary/8 hover:text-primary"
            >
              Compare destinations
            </Link>
            <Link
              href="/countries"
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/8"
            >
              View all countries
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile drawer panel ───────────────────────────────────────────────────

function MobileCountryRow({
  country,
  onLinkClick,
}: {
  country: NavCountry;
  onLinkClick: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <li>
      <Link
        href={country.href}
        onClick={(event) => onLinkClick(event, country.href)}
        className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/5 active:bg-primary/8"
      >
        <CountryFlag
          countryCode={country.isoCode}
          alt=""
          width={24}
          height={17}
          className="shrink-0 rounded-[3px] ring-1 ring-black/5"
        />
        <span className="min-w-0 truncate font-medium">{country.name}</span>
      </Link>
    </li>
  );
}

/**
 * Countries sub-panel of the mobile drawer. `header` (the drawer's back
 * button) sits in a sticky bar so it stays pinned while the list scrolls.
 * Mounted only while active, and regions use native <details>, so collapsed
 * regions neither run JS nor load flag images.
 */
export function CountriesMobilePanel({
  model,
  header,
  onNavigate,
}: {
  model: CountriesMenuModel;
  header: ReactNode;
  onNavigate: (href: string) => void;
}) {
  const headingId = useId();

  // Closing the full-screen drawer makes it inert before Link can complete its
  // default action on some mobile browsers, so navigate through the router.
  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-border bg-white/95 backdrop-blur">{header}</div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-4 sm:px-7">
        {model.popular.length > 0 ? (
          <section aria-labelledby={`${headingId}-popular`}>
            <h2
              id={`${headingId}-popular`}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-heading"
            >
              Popular destinations
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {model.popular.map((country) => (
                <li key={country.slug} className="max-w-full">
                  <Link
                    href={country.href}
                    onClick={(event) => handleLinkClick(event, country.href)}
                    className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-white py-1.5 pl-1.5 pr-3 text-sm font-medium text-foreground transition-colors active:bg-primary/8"
                  >
                    <CountryFlag
                      countryCode={country.isoCode}
                      alt=""
                      width={22}
                      height={22}
                      className="shrink-0 rounded-full ring-1 ring-black/5"
                    />
                    <span className="min-w-0 truncate">{country.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {model.mbbs.length > 0 ? (
          <section aria-labelledby={`${headingId}-mbbs`} className="mt-6">
            <h2
              id={`${headingId}-mbbs`}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-heading"
            >
              <Stethoscope aria-hidden className="size-3.5 text-accent" />
              Popular for MBBS
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {model.mbbs.map((country) => (
                <li key={country.slug} className="max-w-full">
                  <Link
                    href={country.href}
                    onClick={(event) => handleLinkClick(event, country.href)}
                    className="inline-flex max-w-full items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.04] py-1.5 pl-1.5 pr-3 text-sm font-medium text-foreground transition-colors active:bg-accent/10"
                  >
                    <CountryFlag
                      countryCode={country.isoCode}
                      alt=""
                      width={22}
                      height={22}
                      className="shrink-0 rounded-full ring-1 ring-black/5"
                    />
                    <span className="min-w-0 truncate">{country.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby={`${headingId}-regions`} className="mt-7">
          <h2
            id={`${headingId}-regions`}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-heading"
          >
            Browse by region
          </h2>
          <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {model.regions.map((region) => (
              <details key={region.id} name="mobile-country-regions" className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-white px-4 py-3.5 text-sm font-semibold text-foreground transition-colors active:bg-muted/40 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 truncate">{region.label}</span>
                  <ChevronDown
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  />
                </summary>
                <ul className="space-y-0.5 border-t border-border/70 bg-muted/[0.12] px-1.5 py-1.5">
                  {region.countries.map((country) => (
                    <MobileCountryRow key={country.slug} country={country} onLinkClick={handleLinkClick} />
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>

        <nav aria-label="More destination links" className="mt-7 border-t border-border pt-4">
          <ul className="space-y-0.5">
            {[
              ...MBBS_GUIDE_LINKS.map((link) => ({ href: link.href, label: link.mobileLabel })),
              { href: "/compare", label: "Compare destinations" },
              { href: "/countries", label: "View all countries" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(event) => handleLinkClick(event, link.href)}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors active:bg-primary/8"
                >
                  <span className="min-w-0 truncate">{link.label}</span>
                  <ArrowRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
