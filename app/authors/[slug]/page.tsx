import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, BookOpen, FileSearch, Sparkles } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import {
  catalogReviewedAt,
  contentAuthorAreas,
  contentAuthorBio,
  contentAuthorName,
  contentAuthorRole,
  contentAuthorSlug,
} from "@/lib/content-governance";
import { absoluteUrl, buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

const authorPath = `/authors/${contentAuthorSlug}`;

export const metadata: Metadata = buildIndexableMetadata({
  title: `${contentAuthorName} | ${contentAuthorRole} at Students Traffic`,
  description: `${contentAuthorName} writes and reviews Students Traffic content on MBBS abroad destinations, university selection, admissions planning, and application support for Indian students.`,
  path: authorPath,
});

export async function generateStaticParams() {
  return [{ slug: contentAuthorSlug }];
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug !== contentAuthorSlug) {
    notFound();
  }

  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Authors", path: "/authors/bharath" },
      { name: contentAuthorName, path: authorPath },
    ]),
    getWebPageStructuredData({
      path: authorPath,
      name: `${contentAuthorName} author profile`,
      description: contentAuthorBio,
      datePublished: catalogReviewedAt,
      dateModified: catalogReviewedAt,
    }),
    {
      "@type": "Person",
      "@id": `${absoluteUrl(authorPath)}#person`,
      name: contentAuthorName,
      jobTitle: contentAuthorRole,
      description: contentAuthorBio,
      url: absoluteUrl(authorPath),
      worksFor: {
        "@type": "Organization",
        name: "Students Traffic",
        url: absoluteUrl("/"),
      },
      knowsAbout: contentAuthorAreas,
    },
  ];

  return (
    <>
      <section className="section-space border-b border-border">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Author profile
              </p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-heading sm:text-6xl">
                {contentAuthorName}
              </h1>
              <p className="mt-3 text-lg font-medium text-primary">
                {contentAuthorRole}
              </p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
                {contentAuthorBio}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/blog">
                    Read the latest articles
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/editorial-policy">Editorial policy</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  {
                    Icon: FileSearch,
                    title: "Content focus",
                    body: "Country guides, university selection, admissions planning, and application guidance for Indian students.",
                  },
                  {
                    Icon: BadgeCheck,
                    title: "Admissions role",
                    body: "Reviews content for clarity, traceability, and practical usefulness before it reaches students and families.",
                  },
                  {
                    Icon: Sparkles,
                    title: "Student goal",
                    body: "Help families choose the right university, avoid bad-fit options, and move confidently into admission.",
                  },
                ].map(({ Icon, title, body }) => (
                  <div key={title} className="rounded-2xl border border-border bg-background px-5 py-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4.5" />
                    </div>
                    <h2 className="mt-4 text-sm font-semibold text-heading">{title}</h2>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space border-b border-border">
        <div className="container-shell">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Areas covered
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {contentAuthorAreas.map((area) => (
                <div key={area} className="rounded-2xl border border-border bg-card px-5 py-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white">
                    <BookOpen className="size-4.5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-heading">{area}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
