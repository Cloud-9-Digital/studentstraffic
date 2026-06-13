"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { NewsArticle } from "@/lib/news";

const BATCH = 15;

export function NewsFeed({ articles }: { articles: NewsArticle[] }) {
  const [visible, setVisible] = useState(BATCH);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible((v) => Math.min(v + BATCH, articles.length));
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [articles.length]);

  const shown = articles.slice(0, visible);
  const allLoaded = visible >= articles.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {shown.map((article, i) => (
        <ArticleRow
          key={article.url}
          article={article}
          last={i === shown.length - 1 && allLoaded}
        />
      ))}

      {/* Sentinel — IntersectionObserver watches this */}
      <div ref={sentinelRef} aria-hidden>
        {allLoaded ? (
          <p className="px-5 py-4 text-center text-xs text-muted-foreground/40">
            You&apos;re all caught up
          </p>
        ) : (
          <div className="flex items-center justify-center gap-2 px-5 py-4">
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/30 [animation-delay:0ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/30 [animation-delay:150ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/30 [animation-delay:300ms]" />
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleRow({ article, last }: { article: NewsArticle; last: boolean }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-start gap-3 px-5 py-3.5 transition hover:bg-muted/40 ${last ? "" : "border-b border-border/60"}`}
    >
      <div className="mt-0.5 shrink-0">
        <SourceFavicon domain={article.sourceDomain} name={article.source} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-5 text-foreground group-hover:text-primary">
          {article.title}
        </p>
        <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
          {article.source}
        </p>
      </div>
    </a>
  );
}

function SourceFavicon({ domain, name }: { domain: string | null; name: string }) {
  if (!domain) {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-[0.55rem] font-bold uppercase text-muted-foreground">
        {name.slice(0, 2)}
      </span>
    );
  }
  return (
    <Image
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt={name}
      width={24}
      height={24}
      className="size-6 shrink-0 rounded object-contain"
      unoptimized
    />
  );
}
