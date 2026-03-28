import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, GraduationCap, Wallet } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLandingPages } from "@/lib/data/catalog";
import { getBudgetGuides, getComparisonGuides } from "@/lib/discovery-pages";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import {
  getBudgetGuideHref,
  getComparisonHref,
  getLandingPageHref,
} from "@/lib/routes";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Study Abroad Guides",
  description:
    "Browse country guides, course guides, comparison pages, budget planning guides, and editorial routes that support your university shortlist.",
  path: "/guides",
});

const guideTypes = [
  {
    Icon: Compass,
    title: "Country Guides",
    description:
      "Use these when you need destination context before comparing universities.",
    href: "/countries",
  },
  {
    Icon: GraduationCap,
    title: "Course Guides",
    description:
      "Use these when you want to understand the route itself before judging institutions.",
    href: "/courses",
  },
  {
    Icon: BookOpen,
    title: "Comparison Guides",
    description:
      "Use these when your shortlist is narrowing and you want side-by-side thinking.",
    href: "/compare",
  },
  {
    Icon: Wallet,
    title: "Budget Guides",
    description:
      "Use these when price is the first constraint and you want to explore by tuition band.",
    href: "/budget",
  },
] as const;

export default async function GuidesPage() {
  const [landingPages, comparisonGuides, budgetGuides] = await Promise.all([
    getLandingPages(),
    getComparisonGuides(),
    getBudgetGuides(),
  ]);

  const featuredEditorialGuides = landingPages.slice(0, 6);
  const featuredComparisonGuides = comparisonGuides.slice(0, 4);
  const featuredBudgetGuides = budgetGuides.slice(0, 4);
  const path = "/guides";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: "Study abroad guides",
      description:
        "Guide hub for country, course, comparison, budget, and editorial research pages.",
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-16">
        <div className="rounded-3xl bg-surface-dark px-8 py-12 text-white md:px-12 md:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
            Guides
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight md:text-6xl">
            Explore the information students usually need before they decide.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/72">
            Browse destination guides, course guides, comparison pages, and
            budget planning routes designed to help students and parents make
            better study-abroad decisions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="accent">
              <Link href="/universities">
                Explore universities
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/18 hover:text-white"
            >
              <Link href="/contact">Talk to the team</Link>
            </Button>
          </div>
        </div>

        <div>
          <SectionHeading
            title="Choose the kind of research you need"
            description="Different students start with different questions. These guide types help you find the right starting point."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {guideTypes.map(({ Icon, title, description, href }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-heading">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-accent">
                  Explore
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading
            title="Editorial Guides"
            description="Long-form route pages answering common high-intent questions from search and shortlist research."
            aside={
              <Button asChild variant="outline">
                <Link href="/countries">Browse country guides</Link>
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredEditorialGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={getLandingPageHref(guide.courseSlug, guide.countrySlug)}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
                  {guide.kicker}
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                  {guide.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {guide.summary}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-accent">
                  Read guide
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              title="Comparison Guides"
              description="Helpful once you are choosing between specific institutions."
            />
            <div className="grid gap-4">
              {featuredComparisonGuides.map((guide) => (
                <Link key={guide.slug} href={getComparisonHref(guide.slug)}>
                  <Card className="h-full transition-colors hover:border-primary/30">
                    <CardContent className="space-y-3 p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Comparison guide
                      </p>
                      <h2 className="text-lg font-semibold text-foreground">
                        {guide.left.university.name} vs {guide.right.university.name}
                      </h2>
                      <p className="text-sm leading-7 text-muted-foreground">
                        Compare fees, city, medium, recognition context, and
                        shortlist fit side by side.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              title="Budget Guides"
              description="Helpful when affordability is shaping the shortlist before institution-level research."
            />
            <div className="grid gap-4">
              {featuredBudgetGuides.map((guide) => (
                <Link key={guide.slug} href={getBudgetGuideHref(guide.slug)}>
                  <Card className="h-full transition-colors hover:border-primary/30">
                    <CardContent className="space-y-3 p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {guide.course.shortName}
                      </p>
                      <h2 className="text-lg font-semibold text-foreground">
                        Under ${guide.budgetUsd.toLocaleString("en-US")}
                      </h2>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {guide.programs.length} programs currently sit inside
                        this tuition band.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card px-8 py-10 md:px-10">
          <SectionHeading
            title="Ready to move from research to shortlisting?"
            description="After you have explored the guides, you can browse all universities in one place and narrow them by the filters that matter most to you."
            aside={
              <Button asChild>
                <Link href="/universities">
                  Explore universities
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            }
          />
        </div>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
