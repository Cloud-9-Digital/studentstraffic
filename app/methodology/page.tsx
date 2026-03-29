import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import {
  catalogReviewedAt,
  governancePublishedAt,
  methodologySteps,
} from "@/lib/content-governance";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Research Methodology | Students Traffic",
  description:
    "How Students Traffic structures, reviews, and presents study-abroad university data and destination pages.",
  path: "/methodology",
});

export default function MethodologyPage() {
  const path = "/methodology";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Methodology", path },
    ]),
    getWebPageStructuredData({
      path,
      name: "Students Traffic Methodology",
      description:
        "Methodology for collecting and normalizing university, fee, and destination information on Students Traffic.",
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <SectionHeading
          eyebrow="Methodology"
          title="How the catalog is assembled"
          description="Students Traffic turns a wide range of university and destination details into a more comparable catalog so students can decide faster."
        />

        <ContentTrustPanel
          lastReviewed={catalogReviewedAt}
        />

        <div className="space-y-4">
          {methodologySteps.map((step, index) => (
            <Card key={step}>
              <CardContent className="flex gap-4 p-6">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-7 text-muted-foreground">{step}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Normalization",
              body: "Program and destination pages use shared structures for tuition, duration, location, medium, support, and admissions fit so comparisons stay readable.",
            },
            {
              title: "Editorial review",
              body: "Curated pages and summaries are reviewed through the Students Traffic editorial desk before publication and should be revisited when underlying facts change.",
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
