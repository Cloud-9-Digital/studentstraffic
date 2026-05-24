"use client";

import { SessionProvider } from "next-auth/react";
import { ShortlistProvider } from "@/lib/shortlist-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ShortlistProvider>{children}</ShortlistProvider>
    </SessionProvider>
  );
}
