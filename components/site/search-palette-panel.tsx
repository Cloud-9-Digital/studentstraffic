"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  MapPin,
  Search,
  X,
} from "lucide-react";

import type { Suggestion } from "@/app/api/suggestions/route";
import { CountryFlag } from "@/components/site/country-flag";
import {
  footerPopularRoutes,
  guideNav,
  navCourses,
  navDestinations,
} from "@/lib/constants";

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
      { label: "Guides", href: "/guides", flag: null },
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
] as const;

export function SearchPalettePanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const routeKeyRef = useRef("");

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }

    setQuery("");
    setSuggestions([]);
    setLoading(false);
    abortRef.current?.abort();
    abortRef.current = null;
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const routeKey = `${pathname}?${searchParams.toString()}`;

    if (!open) {
      routeKeyRef.current = routeKey;
      return;
    }

    if (routeKeyRef.current && routeKeyRef.current !== routeKey) {
      onOpenChange(false);
    }

    routeKeyRef.current = routeKey;
  }, [open, onOpenChange, pathname, searchParams]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();
    abortRef.current = null;

    if (!open || query.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      abortRef.current = controller;

      try {
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data: Suggestion[] = await res.json();
        if (requestIdRef.current !== requestId || controller.signal.aborted) {
          return;
        }
        setSuggestions(data);
      } catch {
        if (controller.signal.aborted) {
          return;
        }
        setSuggestions([]);
      } finally {
        if (requestIdRef.current === requestId && !controller.signal.aborted) {
          setLoading(false);
        }
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [open, query]);

  function closePalette() {
    onOpenChange(false);
  }

  function navigateTo(href: string) {
    closePalette();
    router.push(href);
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    navigateTo(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closePalette}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
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
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                >
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
          {query.length >= 2 && (
            <div className="p-2">
              {suggestions.length > 0 ? (
                <>
                  {suggestions.map((suggestion) => {
                    const Icon = typeIcon[suggestion.type];

                    return (
                      <Link
                        key={suggestion.href}
                        href={suggestion.href}
                        onClick={(event) => {
                          event.preventDefault();
                          navigateTo(suggestion.href);
                        }}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-background">
                          <Icon className="size-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {suggestion.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.subtitle}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {typeLabel[suggestion.type]}
                        </span>
                      </Link>
                    );
                  })}

                  <div className="mt-1 border-t border-border pt-1">
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                    >
                      <Search className="size-4 shrink-0 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        See all results for{" "}
                        <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>
                      </span>
                      <ArrowRight className="ml-auto size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </>
              ) : !loading ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No results for{" "}
                  <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>
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
                        onClick={(event) => {
                          event.preventDefault();
                          navigateTo(item.href);
                        }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        {item.flag ? (
                          <CountryFlag
                            countryCode={item.flag}
                            alt={item.label}
                            width={18}
                            height={13}
                            className="shrink-0 rounded-sm shadow-flag"
                          />
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
                  onClick={(event) => {
                    event.preventDefault();
                    navigateTo("/search");
                  }}
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
  );
}
