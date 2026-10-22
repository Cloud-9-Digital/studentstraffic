import type { Metadata } from "next";

import { buildNoIndexMetadata } from "@/lib/metadata";

// Account pages are not search content; without this they inherited the root
// layout's index/follow and homepage canonical.
export const metadata: Metadata = buildNoIndexMetadata({
  title: "Log in",
  alternates: { canonical: null },
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
