"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function NotFoundTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const body = JSON.stringify({ path: pathname });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track-404",
        new Blob([body], { type: "application/json" })
      );
      return;
    }

    fetch("/api/track-404", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
