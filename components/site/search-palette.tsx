"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

const SearchPalettePanel = dynamic(
  () =>
    import("@/components/site/search-palette-panel").then(
      (mod) => mod.SearchPalettePanel
    ),
  { ssr: false }
);

export function SearchPalette({
  variant = "icon",
  onOpen,
  enableShortcut = true,
}: {
  variant?: "icon" | "mobile-menu";
  onOpen?: () => void;
  enableShortcut?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const openPalette = useCallback(() => {
    setReady(true);
    setOpen(true);
    onOpen?.();
  }, [onOpen]);

  const closePalette = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (enableShortcut && (e.metaKey || e.ctrlKey) && e.key === "k") {
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
  }, [enableShortcut, open, openPalette, closePalette]);

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        aria-label="Search"
        className={cn(
          "flex items-center border border-primary/20 bg-primary/8 text-primary transition-all hover:border-primary/30 hover:bg-primary/14",
          variant === "mobile-menu"
            ? "h-12 w-full gap-3 rounded-2xl px-4 text-left"
            : "h-9 w-9 justify-center rounded-xl",
        )}
      >
        <Search className="size-[18px]" strokeWidth={1.75} />
        {variant === "mobile-menu" ? (
          <span className="text-sm font-medium text-foreground/70">
            Search universities, courses or countries
          </span>
        ) : null}
      </button>

      {ready ? <SearchPalettePanel open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
