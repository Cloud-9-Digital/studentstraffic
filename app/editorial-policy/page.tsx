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
  title: "Editorial Policy | Students Traffic",
  description:
    "How Students Traffic verifies university, destination, fee, and admissions information before publishing it.",
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
        "Verification principles for catalog, comparison, and destination information on Students Traffic.",
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <SectionHeading
          eyebrow="Information Check Process"
          title="How we verify information before students rely on it"
          description="Students Traffic is designed to help students make admissions decisions with confidence, so our publishing standard is built around usefulness, traceability, and revision discipline."
        />

        <ContentTrustPanel
          lastReviewed={catalogReviewedAt}
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
              title: "Preferred sources",
              body: "We prefer current university and public admissions materials over recycled brochure language or copied summaries.",
            },
            {
              title: "Update discipline",
              body: "When important facts change, our preferred action is to revise or remove the affected information instead of leaving stale guidance live.",
            },
            {
              title: "Student-first use",
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
