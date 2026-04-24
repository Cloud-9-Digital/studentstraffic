"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const StandardAppChrome = dynamic(() =>
  import("./standard-app-chrome").then((mod) => mod.StandardAppChrome)
);

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname === "/login" || pathname.startsWith("/seminar-2026") || pathname.startsWith("/mbbs-abroad")) {
    return <div className="relative flex min-h-full flex-col">{children}</div>;
  }

  return <StandardAppChrome>{children}</StandardAppChrome>;
}
