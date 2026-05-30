import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { getAllAuthors, getAuthor, isValidAuthorSlug } from "@/lib/authors";
import { absoluteUrl } from "@/lib/metadata";
import { getProfilePageStructuredData } from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidAuthorSlug(slug)) return {};
  const author = getAuthor(slug);
  const url = absoluteUrl(`/author/${slug}`);
  return {
    title: `${author.name} — ${author.title} | StudentsTraffic`,
    description: author.bio,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title: `${author.name} — ${author.title}`,
      description: author.bio,
      siteName: "StudentsTraffic",
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isValidAuthorSlug(slug)) notFound();
  const author = getAuthor(slug);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={getProfilePageStructuredData(author)} />

      {/* Top nav back link */}
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex w-[min(1380px,calc(100%-2rem))] items-center gap-2 py-4 text-sm text-muted-foreground">
          <Link
            href="/"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Home
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground">{author.name}</span>
        </div>
      </div>

      {/* Identity strip */}
      <div className="border-b border-border/60 bg-muted/20 py-14 md:py-20">
        <div className="mx-auto w-[min(860px,calc(100%-2rem))]">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Avatar */}
            <div className="relative">
              <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/10 text-3xl font-bold tracking-tight text-accent ring-4 ring-accent/10 md:size-28 md:text-4xl">
                {author.initials}
              </div>
              <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-green-500 ring-2 ring-background">
                <span className="size-2 rounded-full bg-white" />
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-heading md:text-4xl">
                {author.name}
              </h1>
              <p className="text-sm font-medium text-accent">{author.title}</p>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                {author.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-[min(860px,calc(100%-2rem))] py-14 md:py-20">
        <div className="space-y-16">

          {/* Personal promise / quote */}
          <div className="relative rounded-2xl bg-accent/6 px-8 py-8 md:px-12 md:py-10">
            <Quote className="absolute left-6 top-6 size-8 text-accent/25 md:size-10" />
            <blockquote className="relative pl-4 text-base font-medium italic leading-8 text-foreground/80 md:text-lg md:leading-9">
              {author.promise}
            </blockquote>
            <p className="mt-4 text-sm font-medium text-accent">— {author.name.split(" ")[0]}</p>
          </div>

          {/* Story */}
          <div>
            <h2 className="mb-8 font-display text-2xl font-semibold tracking-tight text-heading">
              The story behind the work
            </h2>
            <div className="space-y-6">
              {author.longBio.map((para, i) => (
                <p key={i} className="text-base leading-8 text-muted-foreground">
                  {para}
                </p>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
