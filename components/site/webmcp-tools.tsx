"use client";

import { useEffect } from "react";

import { getModelContext, registerSiteTools } from "@/lib/webmcp";

/**
 * Registers read-only WebMCP tools (lib/webmcp.ts) after hydration when the
 * browser exposes a model context. Renders nothing and does nothing
 * otherwise. Unregisters on unmount.
 */
export function WebMcpTools() {
  useEffect(() => {
    const context = getModelContext();
    if (!context) return;

    const controller = new AbortController();
    registerSiteTools(
      context,
      {
        origin: window.location.origin,
        fetch: window.fetch.bind(window),
        navigate: (url) => window.location.assign(url),
      },
      controller.signal,
    );
    return () => controller.abort();
  }, []);

  return null;
}
