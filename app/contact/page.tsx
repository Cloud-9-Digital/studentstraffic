import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  catalogReviewedAt,
  governancePublishedAt,
} from "@/lib/content-governance";
import { siteConfig } from "@/lib/constants";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Contact",
  description:
    "Contact Students Traffic for university shortlisting, study-abroad guidance, and admissions support.",
  path: "/contact",
});

export default function ContactPage() {
  const path = "/contact";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Contact", path },
    ]),
    getWebPageStructuredData({
      path,
      name: "Contact Students Traffic",
      description:
        "Ways to reach Students Traffic for study-abroad and admissions guidance.",
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <SectionHeading
          eyebrow="Contact"
          title="Talk to the Students Traffic team"
          description="Reach out for shortlist support, university comparisons, or help understanding the information published on the site."
        />

        <ContentTrustPanel
          lastReviewed={catalogReviewedAt}
          sourceSummary="Direct contact channels for admissions support, research feedback, and editorial questions."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Email
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                Send us a detailed query about universities, destination fit, or
                admissions support.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`mailto:${siteConfig.email}`}>{siteConfig.email}</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Phone
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                Call for counselling and shortlist guidance during business
                hours.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                  {siteConfig.phone}
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                WhatsApp
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                Message us if you want a faster back-and-forth on shortlist and
                admissions questions.
              </p>
              <Button asChild className="w-full">
                <Link
                  href={`https://wa.me/${siteConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp us
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
