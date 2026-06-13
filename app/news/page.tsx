import type { Metadata } from "next";
import Link from "next/link";

import { buildIndexableMetadata } from "@/lib/metadata";
import { getNewsArticles } from "@/lib/news";
import { NewsFeed } from "@/components/site/news-feed";

export const metadata: Metadata = buildIndexableMetadata({
  title: "News | Study Abroad, Education & Career Updates | Students Traffic",
  description:
    "Latest news on study abroad, higher education, university admissions, career pathways, and policy changes — curated for Indian students.",
  path: "/news",
});

export default async function NewsPage() {
  const articles = await getNewsArticles();

  return (
    <main>
      {/* Page header */}
      <section className="border-b border-border py-10 md:py-14">
        <div className="container-shell">
          <div className="max-w-2xl space-y-3">
            <h1 className="font-display text-3xl font-bold text-heading md:text-4xl">
              News
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              Latest updates across study abroad, higher education, university
              admissions, career pathways, and policy changes — curated for
              Indian students.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-shell space-y-6">
          {articles.length === 0 ? (
            <p className="rounded-2xl border border-border bg-muted/30 px-6 py-10 text-center text-sm text-muted-foreground">
              No articles available right now. Check back soon.
            </p>
          ) : (
            <NewsFeed articles={articles} />
          )}

          <p className="text-center text-xs text-muted-foreground/50">
            News sourced from publicly available feeds. Content belongs to the
            original publishers.
          </p>
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
