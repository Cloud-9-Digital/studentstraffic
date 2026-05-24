"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { getUserShortlistSlugs } from "@/app/_actions/get-shortlists";

interface ShortlistContextValue {
  isShortlisted: (slug: string) => boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
}

const ShortlistContext = createContext<ShortlistContextValue>({
  isShortlisted: () => false,
  add: () => {},
  remove: () => {},
});

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [slugs, setSlugs] = useState<Set<string>>(new Set());
  const fetched = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || fetched.current) return;
    fetched.current = true;
    getUserShortlistSlugs().then((list) => setSlugs(new Set(list)));
  }, [status]);

  // Reset when user logs out
  useEffect(() => {
    if (status === "unauthenticated") {
      setSlugs(new Set());
      fetched.current = false;
    }
  }, [status]);

  const isShortlisted = useCallback((slug: string) => slugs.has(slug), [slugs]);

  const add = useCallback((slug: string) => {
    setSlugs((prev) => new Set([...prev, slug]));
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
  }, []);

  return (
    <ShortlistContext.Provider value={{ isShortlisted, add, remove }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  return useContext(ShortlistContext);
}
