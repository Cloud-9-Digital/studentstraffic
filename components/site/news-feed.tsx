"use client";

import { useState } from "react";
import Image from "next/image";

import type { NewsArticle, NewsGroup } from "@/lib/news";

// ── Helpers ───────────────────────────────────────────────────────────────

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function SourceLine({
  domain,
  name,
  publishedAt,
  size = 16,
}: {
  domain: string | null;
  name: string;
  publishedAt: string;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {domain ? (
        <Image
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
          alt={name}
          width={size}
          height={size}
          className="shrink-0 rounded object-contain"
          unoptimized
        />
      ) : (
        <span
          style={{ width: size, height: size, fontSize: size * 0.45 }}
          className="flex shrink-0 items-center justify-center rounded bg-muted font-bold uppercase text-muted-foreground"
        >
          {name.slice(0, 2)}
        </span>
      )}
      <span className="truncate text-[0.7rem] font-medium text-muted-foreground">{name}</span>
      <span className="text-muted-foreground/40">·</span>
      <span className="shrink-0 text-[0.7rem] text-muted-foreground">{timeAgo(publishedAt)}</span>
    </div>
  );
}

// ── Featured card (top-left of Top Stories) ───────────────────────────────

function FeaturedCard({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/25 hover:shadow-sm"
    >
      {article.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        </div>
      )}
      <div className={`flex flex-1 flex-col p-4 ${!article.imageUrl ? "justify-center py-8" : ""}`}>
        <SourceLine
          domain={article.sourceDomain}
          name={article.source}
          publishedAt={article.publishedAt}
        />
        <p
          className={`mt-2 font-display font-semibold leading-snug text-foreground group-hover:text-primary ${
            article.imageUrl ? "text-base md:text-lg" : "text-xl md:text-2xl"
          }`}
        >
          {article.title}
        </p>
      </div>
    </a>
  );
}

// ── Compact row (right sidebar of Top Stories) ────────────────────────────

function SideArticleRow({ article, last }: { article: NewsArticle; last: boolean }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-start gap-3 py-3.5 transition hover:bg-muted/30 ${last ? "" : "border-b border-border/60"}`}
    >
      <div className="min-w-0 flex-1">
        <SourceLine
          domain={article.sourceDomain}
          name={article.source}
          publishedAt={article.publishedAt}
          size={14}
        />
        <p className="mt-1 line-clamp-3 text-sm font-medium leading-5 text-foreground group-hover:text-primary">
          {article.title}
        </p>
      </div>
      {article.imageUrl && (
        <div className="relative mt-0.5 h-16 w-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
    </a>
  );
}

// ── Article card (topic section grids) ───────────────────────────────────

function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/25 hover:shadow-sm"
    >
      {article.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        </div>
      )}
      <div className={`flex flex-1 flex-col p-3 ${!article.imageUrl ? "py-4" : ""}`}>
        <SourceLine
          domain={article.sourceDomain}
          name={article.source}
          publishedAt={article.publishedAt}
          size={14}
        />
        <p className="mt-1.5 line-clamp-3 flex-1 text-sm font-medium leading-5 text-foreground group-hover:text-primary">
          {article.title}
        </p>
      </div>
    </a>
  );
}

// ── Top Stories section ───────────────────────────────────────────────────

function TopStoriesSection({ articles }: { articles: NewsArticle[] }) {
  const [featured, ...rest] = articles;
  if (!featured) return null;

  return (
    <div>
      <h2 className="mb-4 font-display text-xl font-bold text-heading">Top stories</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <FeaturedCard article={featured} />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card px-4">
          {rest.slice(0, 4).map((a, i) => (
            <SideArticleRow key={a.url} article={a} last={i === Math.min(rest.length, 4) - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Topic section ─────────────────────────────────────────────────────────

function TopicSection({ group }: { group: NewsGroup }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? group.articles : group.articles.slice(0, 6);
  const hasMore = group.articles.length > 6;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-heading">{group.label}</h2>
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-medium text-primary transition hover:text-primary/80"
          >
            {expanded ? "Show less" : `See all ${group.articles.length}`}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {shown.map((a) => (
          <ArticleCard key={a.url} article={a} />
        ))}
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────

export function NewsFeed({ groups }: { groups: NewsGroup[] }) {
  const safeGroups = Array.isArray(groups) ? groups : [];
  const topStories = safeGroups
    .flatMap((g) => g.articles)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <TopStoriesSection articles={topStories} />
      {safeGroups.map((group) => (
        <TopicSection key={group.slug} group={group} />
      ))}
      <p className="pb-2 text-center text-xs text-muted-foreground/40">
        News sourced from publicly available feeds. Content belongs to the original publishers.
      </p>
    </div>
  );
}
