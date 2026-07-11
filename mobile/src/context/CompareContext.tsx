import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type CompareItem = {
  slug: string;
  name: string;
  country: string;
  tuitionUsd: number;
};

type CompareContextType = {
  items: CompareItem[];
  add: (item: CompareItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  isIn: (slug: string) => boolean;
};

const CompareContext = createContext<CompareContextType>({
  items: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
  isIn: () => false,
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  const add = useCallback((item: CompareItem) => {
    setItems(prev => {
      if (prev.some(i => i.slug === item.slug)) return prev;
      if (prev.length >= 3) return prev; // max 3
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems(prev => prev.filter(i => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isIn = useCallback(
    (slug: string) => items.some(i => i.slug === slug),
    [items],
  );

  const value = useMemo(() => ({ items, add, remove, clear, isIn }), [items, add, remove, clear, isIn]);

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
