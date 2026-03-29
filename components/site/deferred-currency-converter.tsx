"use client";

import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";

type CurrencyConverterProps = {
  rate: number;
  localCurrency: string;
  date: string;
};

export function DeferredCurrencyConverter(props: CurrencyConverterProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [CurrencyConverter, setCurrencyConverter] =
    useState<ComponentType<CurrencyConverterProps> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "280px 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || CurrencyConverter) return;

    let cancelled = false;

    import("@/components/site/currency-converter").then((mod) => {
      if (!cancelled) {
        setCurrencyConverter(() => mod.CurrencyConverter);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [CurrencyConverter, shouldLoad]);

  return (
    <div ref={containerRef}>
      {CurrencyConverter ? (
        <CurrencyConverter {...props} />
      ) : (
        <div className="rounded-[1.6rem] border border-border/70 bg-white p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="h-2.5 w-28 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
            </div>
            <div className="h-8 w-16 rounded bg-muted" />
          </div>
          <div className="mb-4 h-12 rounded-xl bg-[#f7f5f0]" />
          <div className="space-y-3">
            <div className="h-14 rounded-xl bg-[#faf8f4]" />
            <div className="mx-auto h-6 w-6 rounded-full bg-muted" />
            <div className="h-14 rounded-xl bg-[#faf8f4]" />
          </div>
        </div>
      )}
    </div>
  );
}
