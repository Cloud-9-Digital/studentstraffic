import type { Metadata } from "next";
import Link from "next/link";

import { buildIndexableMetadata } from "@/lib/metadata";
import { getNewsGroups } from "@/lib/news";
import { NewsFeed } from "@/components/site/news-feed";

export const metadata: Metadata = buildIndexableMetadata({
  title: "News | Study Abroad, Education & Career Updates | Students Traffic",
  description:
    "Latest news on study abroad, higher education, university admissions, career pathways, and policy changes — curated for Indian students.",
  path: "/news",
});

export default async function NewsPage() {
  const groups = await getNewsGroups();
  const hasArticles = groups.some((g) => g.articles.length > 0);

  return (
    <main>
      {/* Masthead */}
      <section className="border-b border-border bg-[#faf8f4] py-8 md:py-12">
        <div className="container-shell">
          <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary/70">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Updated every 2 hours
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-heading md:text-5xl">
            News
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Study abroad, higher education, university admissions, career
            pathways, and policy changes — curated and filtered for Indian
            students.
          </p>
        </div>
      </section>

      <section className="py-6 md:py-10">
        <div className="container-shell">
          {!hasArticles ? (
            <p className="rounded-2xl border border-border bg-muted/30 px-6 py-10 text-center text-sm text-muted-foreground">
              No articles available right now. Check back soon.
            </p>
          ) : (
            <NewsFeed groups={groups} />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-10">
        <div className="container-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-semibold text-heading">
                Have questions about studying abroad?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Our counsellors track regulatory changes and university
                approvals before you do. Free consultation.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <a
                href="tel:+919176162888"
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                Call us
              </a>
              <Link
                href="/universities"
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
              >
                Find universities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
