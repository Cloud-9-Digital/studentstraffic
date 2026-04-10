"use client";

import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import { trackContactClick, trackContactClickServer } from "@/lib/analytics";

type TrackedContactLinkProps = ComponentPropsWithoutRef<"a"> & {
  channel: "call" | "whatsapp";
  location: string;
};

export const TrackedContactLink = forwardRef<
  HTMLAnchorElement,
  TrackedContactLinkProps
>(function TrackedContactLink(
  { channel, location, onClick, href, ...props },
  ref
) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const pagePath =
      typeof window !== "undefined" ? window.location.pathname : undefined;
    const pageUrl =
      typeof window !== "undefined" ? window.location.href : undefined;

    trackContactClick(channel, {
      location,
      href,
      page_path: pagePath,
    });

    if (pagePath) {
      trackContactClickServer({
        channel,
        location,
        href,
        pagePath,
        pageUrl,
      });
    }

    onClick?.(event);
  };

  return <a ref={ref} href={href} onClick={handleClick} {...props} />;
});
