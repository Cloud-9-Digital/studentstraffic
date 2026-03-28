"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";

const SearchPalettePanel = dynamic(
  () =>
    import("@/components/site/search-palette-panel").then(
      (mod) => mod.SearchPalettePanel
    ),
  { ssr: false }
);

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const openPalette = useCallback(() => {
    setReady(true);
    setOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
  }, []);

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

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        aria-label="Search"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary transition-all hover:bg-primary/14 hover:border-primary/30"
      >
        <Search className="size-[18px]" strokeWidth={1.75} />
      </button>

      {ready ? <SearchPalettePanel open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
