"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  MapPin,
  GraduationCap,
  Building2,
  BookOpen,
} from "lucide-react";

import type { Suggestion } from "@/app/api/suggestions/route";
import {
  footerPopularRoutes,
  guideNav,
  navCourses,
  navDestinations,
} from "@/lib/constants";
import { CountryFlag } from "@/components/site/country-flag";
const typeIcon = {
  university: Building2,
  country: MapPin,
  course: GraduationCap,
  landing_page: BookOpen,
} as const;

const typeLabel = {
  university: "University",
  country: "Country",
  course: "Course",
  landing_page: "Guide",
} as const;

const quickLinks = [
  {
    heading: "Start Here",
    items: [
      { label: "Universities", href: "/universities", flag: null },
      { label: "All Guides", href: "/guides", flag: null },
      { label: "Contact", href: "/contact", flag: null },
    ],
  },
  {
    heading: "Destinations",
    items: navDestinations.map((d) => ({ label: d.name, href: d.href, flag: d.countryCode })),
  },
  {
    heading: "Courses",
    items: navCourses.map((c) => ({ label: c.name, href: c.href, flag: null })),
  },
  {
    heading: "Popular Routes",
    items: footerPopularRoutes.map((r) => ({ label: r.label, href: r.href, flag: null })),
  },
  {
    heading: "Guide Types",
    items: guideNav.slice(1).map((item) => ({ label: item.label, href: item.href, flag: null })),
  },
];

export function SearchPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSuggestions([]);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSuggestions([]);
  }, []);

  // Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          closePalette();
        } else {
          openPalette();
        }
      }
      if (e.key === "Escape") closePalette();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, openPalette, closePalette]);

  // Focus input on open
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Debounced fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    closePalette();
  }

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={openPalette}
        aria-label="Search"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary transition-all hover:bg-primary/14 hover:border-primary/30"
      >
        <Search className="size-[18px]" strokeWidth={1.75} />
      </button>

      {/* Overlay — rendered via portal to escape header's backdrop-filter stacking context */}
      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closePalette}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">

            {/* Input row */}
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                {loading ? (
                  <div className="size-4 shrink-0 animate-spin rounded-full border-2 border-muted border-t-primary" />
                ) : (
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search universities, countries, courses..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  {query ? (
                    <button type="button" onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                      <X className="size-4" />
                    </button>
                  ) : (
                    <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground sm:block">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </div>
            </form>

            <div className="max-h-[60vh] overflow-y-auto">
              {/* Autocomplete results */}
              {query.length >= 2 && (
                <div className="p-2">
                  {suggestions.length > 0 ? (
                    <>
                      {suggestions.map((s) => {
                        const Icon = typeIcon[s.type];
                        return (
                          <Link
                            key={s.href}
                            href={s.href}
                            onClick={closePalette}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                          >
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-background">
                              <Icon className="size-3.5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-foreground">{s.label}</p>
                              <p className="text-xs text-muted-foreground">{s.subtitle}</p>
                            </div>
                            <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {typeLabel[s.type]}
                            </span>
                          </Link>
                        );
                      })}
                      {/* Full search */}
                      <div className="mt-1 border-t border-border pt-1">
                        <button
                          type="button"
                          onClick={() => handleSubmit()}
                          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                        >
                          <Search className="size-4 shrink-0 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            See all results for <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>
                          </span>
                          <ArrowRight className="ml-auto size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </>
                  ) : !loading ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                      No results for <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => handleSubmit()}
                          className="text-primary hover:underline"
                        >
                          Search full catalog →
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Quick links (no query) */}
              {query.length < 2 && (
                <div className="p-3">
                  {quickLinks.map((group) => (
                    <div key={group.heading} className="mb-3 last:mb-0">
                      <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">
                        {group.heading}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closePalette}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-muted"
                          >
                            {item.flag ? (
                              <CountryFlag countryCode={item.flag} alt={item.label} width={18} height={13} className="shrink-0 rounded-sm shadow-flag" />
                            ) : (
                              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                            )}
                            <span className="font-medium text-foreground">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="mt-3 border-t border-border pt-3">
                    <Link
                      href="/search"
                      onClick={closePalette}
                      className="group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                    >
                      <Search className="size-3.5" />
                      Browse full catalog with filters
                      <ArrowRight className="ml-auto size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
