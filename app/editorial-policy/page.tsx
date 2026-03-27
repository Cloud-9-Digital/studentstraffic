import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import {
  catalogReviewedAt,
  editorialPrinciples,
  governancePublishedAt,
} from "@/lib/content-governance";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Editorial Policy",
  description:
    "The editorial standards Students Traffic uses for university, destination, fee, and admissions content.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  const path = "/editorial-policy";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Editorial Policy", path },
    ]),
    getWebPageStructuredData({
      path,
      name: "Students Traffic Editorial Policy",
      description:
        "Editorial principles for catalog, comparison, and destination content on Students Traffic.",
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <SectionHeading
          eyebrow="Editorial Policy"
          title="How we decide what gets published and updated"
          description="Students Traffic is designed to help students compare options clearly, so the editorial standard is built around usefulness, traceability, and revision discipline."
        />

        <ContentTrustPanel
          lastReviewed={catalogReviewedAt}
          sourceSummary="Policy maintained by Bharath and applied across catalog, destination, and comparison pages."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {editorialPrinciples.map((principle) => (
            <Card key={principle}>
              <CardContent className="p-6 text-sm leading-7 text-muted-foreground">
                {principle}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Research preference",
              body: "We prefer current university and public admissions materials over recycled brochure language or derivative summaries.",
            },
            {
              title: "Revision rule",
              body: "When important facts change, our preferred action is to revise or remove the affected content instead of leaving stale guidance live.",
            },
            {
              title: "Reader priority",
              body: "Pages should help students make a decision: compare options, understand tradeoffs, and know what to verify next.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="space-y-2 p-6">
                <h2 className="text-sm font-semibold text-foreground">{item.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
