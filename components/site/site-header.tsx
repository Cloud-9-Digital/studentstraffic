"use client";

import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  Cpu,
  FlaskConical,
  Grid2X2,
  MapPinned,
  Menu,
  Newspaper,
  Palette,
  Scale,
  Stethoscope,
  University,
  UsersRound,
  X,
  type LucideIcon,
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

type ProgrammeMenuGroup = {
  stream: string;
  label: string;
  courses: Array<{ slug: string; name: string; href: string }>;
};

function ProgrammeMenuPanel({
  icon: Icon,
  label,
  description,
  groups,
  open,
  onClose,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  groups: ProgrammeMenuGroup[];
  open: boolean;
  onClose: () => void;
}) {
  const totalCourses = groups.reduce((sum, group) => sum + group.courses.length, 0);

  return (
    <div
      inert={!open}
      className={cn(
        "absolute left-1/2 top-full z-[60] mt-2 w-[min(38rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-white shadow-xl transition-all duration-200",
        open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
      )}
    >
      <div className="flex items-start gap-3 border-b border-border bg-gradient-to-r from-primary/[0.07] via-transparent to-accent/[0.07] px-5 py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm ring-1 ring-border">
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="max-h-[min(28rem,calc(100vh-10rem))] overflow-y-auto p-3">
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {groups.map((group) => (
            <section key={group.stream}>
              <p className="px-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary/80">
                {group.label}
              </p>
              <div className="mt-1.5 space-y-1">
                {group.courses.map((course) => (
                  <Link
                    key={course.slug}
                    href={course.href}
                    onClick={onClose}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-transparent px-2.5 py-2 text-sm text-foreground transition-all hover:border-primary/15 hover:bg-primary/5 hover:text-primary"
                  >
                    <span className="min-w-0 truncate">{course.name}</span>
                    <ArrowRight className="size-3 shrink-0 -translate-x-0.5 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3">
        <p className="text-xs font-medium text-muted-foreground">
          {totalCourses} program{totalCourses === 1 ? "" : "s"} in {label}
        </p>
        <Link
          href="/courses"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/8"
        >
          View all programs
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

// Renders just the course-group list for one mobile drill-down panel. Kept
// out of the DOM entirely while its panel isn't active (see MobilePanelStack)
// so a large taxonomy never bloats the mobile drawer's node count.
function MobileCategoryGroups({
  groups,
  onNavigate,
}: {
  groups: ProgrammeMenuGroup[];
  onNavigate: (href: string) => void;
}) {
  return (
    <div className="space-y-5 px-5 py-4 sm:px-7">
      {groups.map((group) => (
        <section key={group.stream}>
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{group.label}</p>
          <div className="mt-1 space-y-0.5">
            {group.courses.map((course) => (
              <Link
                key={course.slug}
                href={course.href}
                onClick={(event) => {
                  // Closing the full-screen drawer makes it inert before Link can
                  // complete its default action on some mobile browsers. Navigate
                  // first through the router so the selected finder filter is kept.
                  event.preventDefault();
                  onNavigate(course.href);
                }}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/40 hover:text-primary"
              >
                <span>{course.name}</span>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// A single tappable row on the mobile drawer's root list (a category, or a
// direct link like "Universities").
function MobileMenuRow({
  icon,
  label,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8">{icon}</span>
        <span className="text-sm font-semibold">{label}</span>
      </span>
      <ChevronDown className="size-4 -rotate-90 text-muted-foreground" />
    </>
  );
  const className =
    "flex w-full items-center justify-between border-b border-border/70 bg-white px-5 py-4 text-left text-foreground transition-colors hover:bg-muted/40 sm:px-7";

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function SiteHeaderInner() {
  const pathname = usePathname();
  const router = useRouter();
  const navCountries = useNavCountries();
  const navCourses = useNavCourses();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [courseMenuOpen, setCourseMenuOpen] = useState<string | null>(null);
  // Which drill-down panel the mobile drawer is showing: null = root list,
  // "countries" = the countries panel, or a mobile category id. Kept separate
  // from courseMenuOpen (desktop-only) so resizing the viewport can never let
  // the two menus bleed state into each other.
  const [mobilePanel, setMobilePanel] = useState<string | null>(null);
  const countriesMenuRef = useRef<HTMLDivElement | null>(null);
  const courseMenuRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const filteredNavCountries = navCountries;
  const programmeGroups = useMemo(
    () => groupProgrammeNavigationCourses(navCourses),
    [navCourses],
  );

  // Shared category taxonomy for both the mobile drawer's drill-down panel
  // and the desktop sub-row. Desktop uses shortLabel (space is tight in a
  // single-line pill bar); mobile uses the fuller label since it lists
  // categories vertically with room to spare.
  const mobileProgrammeCategories = useMemo(() => {
    const categories = [
      {
        id: "engineering",
        label: "Engineering & Computing",
        shortLabel: "Engineering",
        description: "Core engineering, IT & computing degrees.",
        icon: Cpu,
        streams: ["engineering", "computing-information-systems"],
      },
      {
        id: "medicine",
        label: "Medicine & Health Sciences",
        shortLabel: "Medicine",
        description: "Medicine, nursing, dental, pharmacy & allied health.",
        icon: Stethoscope,
        streams: [
          "medicine", "nursing", "dental", "pharmacy", "physiotherapy",
          "public-health-allied-health", "veterinary",
        ],
      },
      {
        id: "business",
        label: "Business & Economics",
        shortLabel: "Business",
        description: "MBA, business, economics & hospitality management.",
        icon: BriefcaseBusiness,
        streams: ["business", "economics-commerce", "hospitality"],
      },
      {
        id: "law",
        label: "Law & Public Policy",
        shortLabel: "Law & Policy",
        description: "Law, public policy & international relations.",
        icon: Scale,
        streams: ["law", "public-policy-international-relations"],
      },
      {
        id: "sciences",
        label: "Sciences & Environment",
        shortLabel: "Sciences",
        description: "Natural sciences, maths, environment & agriculture.",
        icon: FlaskConical,
        streams: ["natural-sciences", "mathematics-statistics", "environment-sustainability", "agriculture"],
      },
      {
        id: "arts",
        label: "Arts, Media & Design",
        shortLabel: "Arts & Media",
        description: "Arts, humanities, media, design & social sciences.",
        icon: Palette,
        streams: [
          "arts-humanities", "design-creative-arts", "media-communication",
          "social-sciences", "psychology", "education", "architecture",
        ],
      },
    ].map((category) => ({
      ...category,
      groups: programmeGroups.filter((group) => category.streams.includes(group.stream)),
    })).filter((category) => category.groups.length > 0);

    const categorizedStreams = new Set(categories.flatMap((category) => category.streams));
    const otherGroups = programmeGroups.filter((group) => !categorizedStreams.has(group.stream));
    if (otherGroups.length > 0) {
      categories.push({
        id: "more-programs",
        label: "More Programs",
        shortLabel: "More",
        description: "Every other program we cover, all in one place.",
        icon: Grid2X2,
        streams: [],
        groups: otherGroups,
      });
    }

    return categories;
  }, [programmeGroups]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Publishes the header's real rendered height (both rows, including the
  // desktop category sub-row that only appears at lg+) as a CSS variable so
  // viewport-height sections like the homepage hero can subtract the exact
  // value instead of a hard-coded rem guess that drifts out of sync with the
  // nav (e.g. when the category row wraps or the tagline changes).
  useLayoutEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const setHeaderHeightVar = () => {
      document.documentElement.style.setProperty("--site-header-h", `${node.offsetHeight}px`);
    };
    setHeaderHeightVar();
    const observer = new ResizeObserver(setHeaderHeightVar);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Locks page scroll while the mobile drawer or any desktop dropdown
  // (countries panel, programme menus) is open, so scrolling inside the
  // dropdown never bleeds through to the page behind it.
  useEffect(() => {
    const shouldLock = mobileOpen || countriesOpen || courseMenuOpen !== null;
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, countriesOpen, courseMenuOpen]);

  // Reset the drill-down panel whenever the drawer closes, so reopening it
  // always starts back at the root list rather than wherever it was left.
  useEffect(() => {
    if (!mobileOpen) {
      setMobilePanel(null);
    }
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
  const navigateMobile = useCallback((href: string) => {
    router.push(href);
    setMobileOpen(false);
  }, [router]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const countriesActive = isActive("/countries");
  const universitiesActive = isActive("/universities");
  const studentsActive = isActive("/students");
  const newsActive = isActive("/news");
  const blogActive = isActive("/blog");

  return (
    <>
      <header
        ref={headerRef}
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

          {/* Desktop main nav */}
          <nav className="pointer-events-none absolute inset-x-0 hidden items-center justify-center gap-0.5 xl:flex">
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

            <Link
              href="/students"
              className={cn(
                "pointer-events-auto flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                studentsActive
                  ? "bg-primary/8 text-primary"
                  : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
              )}
            >
              <UsersRound className="size-3.5 text-primary/65" />
              Talk to a student
            </Link>

            <Link
              href="/news"
              className={cn(
                "pointer-events-auto flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                newsActive
                  ? "bg-primary/8 text-primary"
                  : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
              )}
            >
              <Newspaper className="size-3.5 text-primary/65" />
              News
            </Link>

            <Link
              href="/blog"
              className={cn(
                "pointer-events-auto flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                blogActive
                  ? "bg-primary/8 text-primary"
                  : "text-foreground/70 hover:bg-black/5 hover:text-foreground",
              )}
            >
              <BookOpen className="size-3.5 text-primary/65" />
              Blog
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="ml-auto hidden items-center gap-2 xl:flex">
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
          <div className="ml-auto flex items-center gap-1 xl:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-black/5"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {/* Desktop sub-row: program category shortcuts (same categorisation as the mobile drawer) */}
        <nav
          ref={courseMenuRef}
          className="hidden flex-wrap items-center justify-center gap-x-0.5 gap-y-1 border-t border-white/15 bg-[linear-gradient(90deg,var(--primary)_0%,var(--primary)_24%,var(--accent)_100%)] px-4 py-1.5 xl:flex"
        >
          {mobileProgrammeCategories.map(({ id, label, shortLabel, description, icon: Icon, groups }) => {
            const open = courseMenuOpen === id;
            return (
              <div key={id} className="relative shrink-0">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-haspopup="menu"
                  onClick={() => {
                    setCountriesOpen(false);
                    setCourseMenuOpen(open ? null : id);
                  }}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-1.5 text-[0.8rem] font-medium whitespace-nowrap transition-colors",
                    open ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/12 hover:text-white",
                  )}
                >
                  <Icon className="size-3.5 text-white/75" />
                  {shortLabel}
                  <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} />
                </button>
                <ProgrammeMenuPanel
                  icon={Icon}
                  label={label}
                  description={description}
                  groups={groups}
                  open={open}
                  onClose={() => setCourseMenuOpen(null)}
                />
              </div>
            );
          })}
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 xl:hidden",
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
          "fixed inset-0 z-50 flex h-full w-full flex-col bg-white shadow-drawer transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] xl:hidden",
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

        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* Root panel: direct links plus one row per category. Always
              mounted (it's cheap), but the heavy per-category course lists
              below are lazy — only the active drill-down panel mounts them. */}
          <div
            inert={mobilePanel !== null}
            className={cn(
              "absolute inset-0 flex flex-col overflow-y-auto bg-white transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]",
              mobilePanel !== null ? "-translate-x-full" : "translate-x-0",
            )}
          >
            <div className="border-b border-border/70 px-5 py-4 sm:px-7">
              <SearchPalette
                variant="mobile-menu"
                onOpen={closeMobile}
                enableShortcut={false}
              />
            </div>
            <nav className="mx-auto flex w-full max-w-3xl flex-1 flex-col bg-white pb-4">
              <MobileMenuRow
                icon={<MapPinned className="size-4 text-primary" />}
                label="Countries"
                onClick={() => setMobilePanel("countries")}
              />
              <MobileMenuRow
                icon={<University className="size-4 text-primary" />}
                label="Universities"
                href="/universities"
                onClick={closeMobile}
              />
              <MobileMenuRow
                icon={<Grid2X2 className="size-4 text-primary" />}
                label="Programs"
                onClick={() => setMobilePanel("programs")}
              />
              <MobileMenuRow
                icon={<UsersRound className="size-4 text-primary" />}
                label="Talk to a student"
                href="/students"
                onClick={closeMobile}
              />
              <MobileMenuRow
                icon={<Newspaper className="size-4 text-primary" />}
                label="News & events"
                href="/news"
                onClick={closeMobile}
              />
              <MobileMenuRow
                icon={<BookOpen className="size-4 text-primary" />}
                label="Blog"
                href="/blog"
                onClick={closeMobile}
              />
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

          {/* Drill-down panel: only its own content is mounted, and only
              while it's the active panel, so switching categories never
              accumulates DOM nodes for categories the user hasn't opened. */}
          <div
            inert={mobilePanel === null}
            className={cn(
              "absolute inset-0 flex flex-col overflow-y-auto bg-white transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]",
              mobilePanel !== null ? "translate-x-0" : "translate-x-full",
            )}
          >
            {mobilePanel !== null ? (
              <>
                <button
                  type="button"
                  onClick={() => setMobilePanel(
                    mobilePanel === "countries" || mobilePanel === "programs" ? null : "programs",
                  )}
                  className="sticky top-0 z-10 flex w-full items-center gap-2 border-b border-border bg-white/95 px-5 py-4 text-left text-sm font-semibold text-foreground backdrop-blur sm:px-7"
                >
                  <ChevronLeft className="size-4 text-muted-foreground" />
                  {mobilePanel === "countries"
                    ? "Countries"
                    : mobilePanel === "programs"
                      ? "Programs"
                    : mobileProgrammeCategories.find((category) => category.id === mobilePanel)?.label}
                </button>
                <div className="mx-auto w-full max-w-3xl flex-1">
                  {mobilePanel === "countries" ? (
                    <div className="space-y-1 px-5 py-4 sm:px-7">
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
                  ) : mobilePanel === "programs" ? (
                    <div className="space-y-1 px-5 py-4 sm:px-7">
                      {mobileProgrammeCategories.map(({ id, label, icon: Icon }) => (
                        <MobileMenuRow
                          key={id}
                          icon={<Icon className="size-4 text-primary" />}
                          label={label}
                          onClick={() => setMobilePanel(id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <MobileCategoryGroups
                      groups={mobileProgrammeCategories.find((category) => category.id === mobilePanel)?.groups ?? []}
                      onNavigate={navigateMobile}
                    />
                  )}
                </div>
              </>
            ) : null}
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
