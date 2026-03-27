import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  catalogReviewedAt,
  editorialPrinciples,
  governancePublishedAt,
  methodologySteps,
} from "@/lib/content-governance";
import { siteConfig } from "@/lib/constants";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "About Students Traffic",
  description:
    "Learn how Students Traffic helps Indian students compare universities, validate study-abroad information, and get shortlist support.",
  path: "/about",
});

export default function AboutPage() {
  const path = "/about";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "About", path },
    ]),
    getWebPageStructuredData({
      path,
      name: "About Students Traffic",
      description:
        "How Students Traffic approaches university discovery, student guidance, and editorial review.",
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <div className="hero-panel px-6 py-8 md:px-10 md:py-10">
          <div className="max-w-4xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
              About Students Traffic
            </p>
            <h1 className="font-display text-heading-contrast text-5xl font-semibold tracking-tight md:text-6xl">
              Verified study-abroad guidance built for real student decisions.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-white/80">
              {siteConfig.name} helps Indian students compare universities,
              tuition, destinations, and admissions paths without relying on
              vague brochure copy. We focus on structured comparisons, clear
              source trails, and free counselling support.
            </p>
          </div>
        </div>

        <ContentTrustPanel
          lastReviewed={catalogReviewedAt}
          sourceSummary="Students Traffic catalog data, official university sources, and publicly referenced recognition materials."
        />

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="What We Do"
              title="How the platform helps students"
              description="We combine catalog structure, editorial review, and counsellor support so students can move from browsing to shortlist decisions with more confidence."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Compare universities with a consistent view of fees, duration, city, medium, and support.",
                "Highlight high-intent decision questions such as affordability, recognition, intake timing, and fit.",
                "Keep lead attribution and page context tied to enquiries so follow-up is relevant.",
                "Create routes and summaries that search engines, LLMs, and AI agents can understand and cite cleanly.",
              ].map((item) => (
                <Card key={item}>
                  <CardContent className="p-5 text-sm leading-7 text-muted-foreground">
                    {item}
                  </CardContent>
                </Card>
              ))}
            </div>

            <SectionHeading
              eyebrow="Editorial Standards"
              title="Principles behind the content"
              description="These standards guide how we publish university and destination information."
            />
            <div className="space-y-4">
              {editorialPrinciples.map((principle, index) => (
                <div key={principle} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-muted-foreground">{principle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-border/90">
              <CardContent className="space-y-4 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Our workflow
                </p>
                <div className="space-y-3">
                  {methodologySteps.map((step) => (
                    <p key={step} className="text-sm leading-7 text-muted-foreground">
                      {step}
                    </p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild>
                    <Link href="/methodology">Read methodology</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/editorial-policy">Editorial policy</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/90">
              <CardContent className="space-y-3 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Contact
                </p>
                <p className="text-sm leading-7 text-muted-foreground">
                  Need help with a shortlist or want to verify a university
                  detail? Reach us directly through the contact page or from any
                  counselling form on the site.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">Open contact page</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
