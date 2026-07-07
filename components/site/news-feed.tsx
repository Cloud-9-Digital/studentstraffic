"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import type { NewsArticle, NewsGroup } from "@/lib/news";
import { cn } from "@/lib/utils";

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

// Deterministic per-topic accent so the same section always reads the same
// color across the tabs, lead story, and card accent bars.
const TOPIC_ACCENTS: Record<string, { bar: string; tag: string; tagText: string; dot: string }> = {
  "mbbs-medical": {
    bar: "bg-primary",
    tag: "bg-primary/8 border-primary/20",
    tagText: "text-primary",
    dot: "bg-primary",
  },
  "study-abroad": {
    bar: "bg-accent",
    tag: "bg-accent-soft border-accent/20",
    tagText: "text-accent-strong",
    dot: "bg-accent",
  },
  exams: {
    bar: "bg-[#a06030]",
    tag: "bg-[#fff3e6] border-[#e3b98a]/40",
    tagText: "text-[#8a5225]",
    dot: "bg-[#a06030]",
  },
  "other-programs": {
    bar: "bg-[#3f6f6a]",
    tag: "bg-[#eef5f4] border-[#3f6f6a]/25",
    tagText: "text-[#2f5450]",
    dot: "bg-[#3f6f6a]",
  },
};

const FALLBACK_ACCENT = TOPIC_ACCENTS["mbbs-medical"];

function accentFor(slug: string) {
  return TOPIC_ACCENTS[slug] ?? FALLBACK_ACCENT;
}

// ── Source / metadata line ───────────────────────────────────────────────

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
    <div className="flex min-w-0 items-center gap-1.5">
      {domain ? (
        <Image
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
          alt=""
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
      <span className="truncate text-[0.7rem] font-semibold text-foreground/70">{name}</span>
      <span aria-hidden className="shrink-0 text-muted-foreground/40">·</span>
      <span className="shrink-0 text-[0.7rem] text-muted-foreground">{timeAgo(publishedAt)}</span>
    </div>
  );
}

// ── Lead story (top of page, biggest headline) ───────────────────────────

function LeadStory({ article, topicSlug }: { article: NewsArticle; topicSlug: string }) {
  const accent = accentFor(topicSlug);
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid gap-0 overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/25 hover:shadow-sm md:grid-cols-2"
    >
      <div
        className={cn(
          "relative order-1 aspect-video w-full overflow-hidden md:aspect-auto md:min-h-[280px]",
          !article.imageUrl && "flex items-center justify-center bg-[#0f3d37]",
        )}
      >
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            unoptimized
            priority
          />
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 px-8 py-12 text-center">
            <div
              aria-hidden
              className="hero-grid-lines absolute inset-0 opacity-30"
            />
            <span className="relative font-display text-2xl font-semibold text-white/90">
              {article.source}
            </span>
            <span className="relative text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/45">
              Top story
            </span>
          </div>
        )}
      </div>
      <div className="order-2 flex flex-col justify-center p-5 md:p-8">
        <span
          className={cn(
            "mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]",
            accent.tag,
            accent.tagText,
          )}
        >
          <span className={cn("size-1.5 rounded-full", accent.dot)} aria-hidden />
          Top story
        </span>
        <p className="font-display text-2xl font-semibold leading-[1.15] tracking-tight text-heading group-hover:text-primary md:text-3xl">
          {article.title}
        </p>
        <div className="mt-4">
          <SourceLine
            domain={article.sourceDomain}
            name={article.source}
            publishedAt={article.publishedAt}
            size={18}
          />
        </div>
      </div>
    </a>
  );
}

// ── Standard article card (grid) ─────────────────────────────────────────

function NewsCard({ article, topicSlug }: { article: NewsArticle; topicSlug: string }) {
  const accent = accentFor(topicSlug);

  if (!article.imageUrl) {
    // Text-forward treatment: topic-colored accent bar down the left edge,
    // generous padding so it reads as an intentional card, not a broken image slot.
    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card pl-4 pr-4 py-4 transition hover:border-primary/25 hover:shadow-sm sm:pl-5 sm:pr-5"
      >
        <span className={cn("absolute inset-y-0 left-0 w-1", accent.bar)} aria-hidden />
        <SourceLine
          domain={article.sourceDomain}
          name={article.source}
          publishedAt={article.publishedAt}
          size={14}
        />
        <p className="mt-2.5 line-clamp-4 flex-1 font-display text-base font-semibold leading-snug text-foreground group-hover:text-primary">
          {article.title}
        </p>
      </a>
    );
  }

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/25 hover:shadow-sm"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          unoptimized
        />
        <span
          className={cn("absolute left-3 top-3 h-1 w-8 rounded-full", accent.bar)}
          aria-hidden
        />
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <SourceLine
          domain={article.sourceDomain}
          name={article.source}
          publishedAt={article.publishedAt}
          size={14}
        />
        <p className="mt-2 line-clamp-3 flex-1 text-sm font-medium leading-5 text-foreground group-hover:text-primary">
          {article.title}
        </p>
      </div>
    </a>
  );
}

// ── Secondary row (compact, used in sidebar-style lists) ─────────────────

function SecondaryRow({ article, topicSlug, last }: { article: NewsArticle; topicSlug: string; last: boolean }) {
  const accent = accentFor(topicSlug);
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-start gap-3 py-3.5 transition hover:bg-muted/30",
        !last && "border-b border-border/60",
      )}
    >
      <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", accent.dot)} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-medium leading-5 text-foreground group-hover:text-primary">
          {article.title}
        </p>
        <div className="mt-1.5">
          <SourceLine
            domain={article.sourceDomain}
            name={article.source}
            publishedAt={article.publishedAt}
            size={14}
          />
        </div>
      </div>
      {article.imageUrl && (
        <div className="relative mt-0.5 h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-lg">
          <Image src={article.imageUrl} alt="" fill className="object-cover" unoptimized />
        </div>
      )}
    </a>
  );
}

// ── Topic tabs (horizontally scrollable pill row on mobile) ──────────────

function TopicTabs({
  groups,
  active,
  onChange,
}: {
  groups: NewsGroup[];
  active: string;
  onChange: (slug: string) => void;
}) {
  return (
    <div className="sticky top-16 z-40 -mx-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:static sm:mx-0 sm:rounded-full sm:border sm:bg-background sm:px-1.5 sm:py-1.5 sm:backdrop-blur-none">
      <div
        className="flex gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-visible sm:py-0 [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="News topics"
      >
        <TopicPill label="All stories" active={active === "all"} onClick={() => onChange("all")} />
        {groups.map((group) => (
          <TopicPill
            key={group.slug}
            label={group.label}
            active={active === group.slug}
            dotClassName={accentFor(group.slug).dot}
            onClick={() => onChange(group.slug)}
          />
        ))}
      </div>
    </div>
  );
}

function TopicPill({
  label,
  active,
  onClick,
  dotClassName,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  dotClassName?: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition",
        active
          ? "bg-primary text-white shadow-sm"
          : "border border-border bg-card text-foreground/70 hover:border-primary/30 hover:text-foreground",
      )}
    >
      {dotClassName && !active ? (
        <span className={cn("size-1.5 rounded-full", dotClassName)} aria-hidden />
      ) : null}
      {label}
    </button>
  );
}

// ── Topic section (used in "All stories" view) ───────────────────────────

const SECONDARY_ROW_STEP = 6;

function TopicSection({ group }: { group: NewsGroup }) {
  const [visible, setVisible] = useState(SECONDARY_ROW_STEP);
  if (!group.articles.length) return null;

  const [lead, ...rest] = group.articles;
  const shownRest = rest.slice(0, visible);
  const remaining = rest.length - shownRest.length;
  const accent = accentFor(group.slug);

  return (
    <section className="scroll-mt-28" id={group.slug} aria-labelledby={`${group.slug}-heading`}>
      <div className="mb-4 flex items-center gap-2.5 sm:mb-5">
        <span className={cn("h-4 w-1 rounded-full", accent.bar)} aria-hidden />
        <h2
          id={`${group.slug}-heading`}
          className="font-display text-lg font-bold tracking-tight text-heading sm:text-xl"
        >
          {group.label}
        </h2>
        <span className="text-xs font-medium text-muted-foreground/60">
          {group.articles.length}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <NewsCard article={lead} topicSlug={group.slug} />
        </div>
        {shownRest.length > 0 ? (
          <div
            className={cn(
              "overflow-hidden rounded-2xl border border-border bg-card px-4 sm:px-5",
              // Cap the row list's own height once it grows past a comfortable
              // read length so a ~20-article topic scrolls inside its own box
              // instead of pushing the whole page into an endless wall.
              shownRest.length > 8 && "max-h-[32rem] overflow-y-auto",
            )}
          >
            {shownRest.map((a, i) => (
              <SecondaryRow
                key={a.url}
                article={a}
                topicSlug={group.slug}
                last={i === shownRest.length - 1}
              />
            ))}
          </div>
        ) : null}
      </div>

      {remaining > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + SECONDARY_ROW_STEP)}
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-primary transition hover:border-primary/30"
          >
            See {Math.min(remaining, SECONDARY_ROW_STEP)} more
          </button>
        </div>
      )}
    </section>
  );
}

// ── Single-topic view (grid of cards, used when a tab is selected) ───────

function TopicGrid({ group }: { group: NewsGroup }) {
  const [visible, setVisible] = useState(9);
  const shown = group.articles.slice(0, visible);
  const hasMore = group.articles.length > visible;

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((a) => (
          <NewsCard key={a.url} article={a} topicSlug={group.slug} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + 9)}
            className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30"
          >
            Show more
          </button>
        </div>
      )}
    </section>
  );
}

// ── Root export ───────────────────────────────────────────────────────────

export function NewsFeed({ groups }: { groups: NewsGroup[] }) {
  const safeGroups = useMemo(() => (Array.isArray(groups) ? groups.filter((g) => g.articles.length > 0) : []), [groups]);
  const [activeTopic, setActiveTopic] = useState<string>("all");

  const topStory = useMemo(() => {
    let best: { article: NewsArticle; topicSlug: string } | null = null;
    for (const group of safeGroups) {
      const [first] = group.articles;
      if (!first) continue;
      if (!best || first.publishedAt.localeCompare(best.article.publishedAt) > 0) {
        best = { article: first, topicSlug: group.slug };
      }
    }
    return best;
  }, [safeGroups]);

  const activeGroup = activeTopic === "all" ? null : safeGroups.find((g) => g.slug === activeTopic) ?? null;

  return (
    <div className="space-y-8 sm:space-y-10">
      <TopicTabs groups={safeGroups} active={activeTopic} onChange={setActiveTopic} />

      {activeTopic === "all" ? (
        <>
          {topStory ? <LeadStory article={topStory.article} topicSlug={topStory.topicSlug} /> : null}

          <div className="space-y-8 divide-y divide-border/60 sm:space-y-10 [&>section]:pt-8 sm:[&>section]:pt-10 [&>section:first-child]:pt-0">
            {safeGroups.map((group) => (
              <TopicSection key={group.slug} group={group} />
            ))}
          </div>
        </>
      ) : activeGroup ? (
        <TopicGrid group={activeGroup} />
      ) : null}

      <p className="pb-2 text-center text-xs text-muted-foreground/40">
        News sourced from publicly available feeds. Content belongs to the original publishers.
      </p>
    </div>
  );
}
