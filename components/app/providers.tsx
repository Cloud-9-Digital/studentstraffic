"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ShortlistProvider } from "@/lib/shortlist-context";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ShortlistProvider>{children}</ShortlistProvider>
    </SessionProvider>
  );
}
