"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import {
  getResidenceCountryName,
  RESIDENCE_COUNTRIES,
  RESIDENCE_COUNTRY_ALIASES,
  type ResidenceCountryCode,
} from "@/lib/residence-countries";
import { cn } from "@/lib/utils";

type CountrySelectProps = {
  id?: string;
  /** Name of the hidden input that carries the ISO code in the form submission. */
  name: string;
  value: string;
  onChange: (code: ResidenceCountryCode) => void;
  placeholder?: string;
  className?: string;
  invalid?: boolean;
  floating?: boolean;
  hideSearchPlaceholder?: boolean;
};

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

const SEARCH_INDEX = RESIDENCE_COUNTRIES.map(([code, name]) => ({
  code,
  name,
  haystack: [name, code, ...(RESIDENCE_COUNTRY_ALIASES[code] ?? [])].map(normalize),
}));

/**
 * Searchable country picker. Inline mode remains available for embedded forms;
 * floating mode keeps a modal's form rows from expanding when the list opens.
 */
export function CountrySelect({
  id,
  name,
  value,
  onChange,
  placeholder = "Select country",
  className,
  invalid = false,
  floating = false,
  hideSearchPlaceholder = false,
}: CountrySelectProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const matches = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return SEARCH_INDEX;

    // Prefix matches first ("in" → India before Argentina), then substrings.
    const prefix = SEARCH_INDEX.filter((entry) =>
      entry.haystack.some((text) => text.startsWith(needle))
    );
    const rest = SEARCH_INDEX.filter(
      (entry) =>
        !prefix.includes(entry) &&
        entry.haystack.some((text) => text.includes(needle))
    );
    return [...prefix, ...rest];
  }, [query]);

  useEffect(() => {
    if (!open) return;

    searchRef.current?.focus();

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const openList = () => {
    setQuery("");
    const selectedIndex = SEARCH_INDEX.findIndex((entry) => entry.code === value);
    setActiveIndex(Math.max(selectedIndex, 0));
    setOpen(true);
  };

  const choose = (code: ResidenceCountryCode) => {
    onChange(code);
    setOpen(false);
  };

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      // Never let Enter in the search box submit the surrounding lead form.
      event.preventDefault();
      const match = matches[activeIndex];
      if (match) choose(match.code);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    }
  };

  const selectedName = getResidenceCountryName(value);

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        className={cn(
          "flex h-11 w-full min-w-0 items-center rounded-xl border border-input bg-transparent px-4 pr-9 text-left text-sm leading-normal shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          invalid && "border-destructive ring-[3px] ring-destructive/20",
          selectedName ? "text-foreground" : "text-muted-foreground",
          className
        )}
      >
        <span className="truncate">{selectedName ?? placeholder}</span>
      </button>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      {open ? (
        <div className={cn("rounded-xl border border-border bg-card shadow-lg", floating ? "absolute inset-x-0 top-full z-30 mt-1.5" : "mt-1.5")}>
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onSearchKeyDown}
              placeholder={hideSearchPlaceholder ? undefined : "Search country"}
              aria-label="Search country"
              aria-controls={listId}
              aria-activedescendant={
                matches[activeIndex] ? `${listId}-${matches[activeIndex].code}` : undefined
              }
              autoComplete="off"
              className="h-10 w-full min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground md:text-sm"
            />
          </div>
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Countries"
            className={cn("overflow-y-auto overscroll-contain py-1", floating ? "max-h-28" : "max-h-56")}
          >
            {matches.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No country found</li>
            ) : (
              matches.map((entry, index) => (
                <li
                  key={entry.code}
                  id={`${listId}-${entry.code}`}
                  data-index={index}
                  role="option"
                  aria-selected={entry.code === value}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => choose(entry.code)}
                  onPointerMove={() => setActiveIndex(index)}
                  className={cn(
                    "cursor-pointer px-3 py-2 text-sm text-foreground",
                    index === activeIndex && "bg-muted",
                    entry.code === value && "font-medium"
                  )}
                >
                  {entry.name}
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
