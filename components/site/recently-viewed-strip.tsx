"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPinned } from "lucide-react";

import { getRecentlyViewed, type RecentlyViewedItem } from "@/lib/recently-viewed";
import { getUniversityHref } from "@/lib/routes";

export function RecentlyViewedStrip({ currentSlug }: { currentSlug: string }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed().filter((i) => i.slug !== currentSlug));
  }, [currentSlug]);

  if (items.length === 0) return null;

  return (
    <div className="py-10">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Recently viewed
      </p>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={getUniversityHref(item.slug)}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent/40 hover:bg-accent/5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
              {item.logoUrl ? (
                <Image
                  src={item.logoUrl}
                  alt={item.name}
                  width={32}
                  height={32}
                  className="h-full w-full object-contain p-0.5"
                />
              ) : (
                <span className="text-[0.5rem] font-bold text-primary">
                  {item.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPinned className="size-3 shrink-0" />
                {item.city}, {item.countryName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
