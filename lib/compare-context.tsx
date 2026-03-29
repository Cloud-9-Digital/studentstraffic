"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

/** Minimal serializable fields only — never pass full FinderProgram to client */
export type CompareItem = {
  slug: string;
  name: string;
  logoUrl?: string;
};

type CompareContextValue = {
  items: CompareItem[];
  toggle: (item: CompareItem) => void;
  clear: () => void;
  isSelected: (slug: string) => boolean;
  isFull: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  const toggle = useCallback((item: CompareItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.slug === item.slug)) {
        return prev.filter((i) => i.slug !== item.slug);
      }
      if (prev.length >= 4) return prev;
      return [...prev, item];
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isSelected = useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items],
  );

  return (
    <CompareContext.Provider
      value={{ items, toggle, clear, isSelected, isFull: items.length >= 4 }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
