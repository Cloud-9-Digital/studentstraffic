import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { SectionHeading } from "@/components/site/section-heading";
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
  title: "Terms of Service",
  description:
    "Terms governing the use of Students Traffic and its study-abroad admissions guidance services.",
  path: "/terms",
});

const termsSections = [
  {
    title: "Using the website",
    body: "Students Traffic is intended to help students and families choose universities abroad, evaluate options, and request admissions support. You should use the site lawfully and avoid submitting false, misleading, or unauthorized information.",
  },
  {
    title: "Admissions guidance scope",
    body: "Our team helps with counselling, admissions planning, application support, and related admissions guidance. Final decisions on admission, visas, eligibility, fees, and recognition remain with universities, regulators, embassies, and other third parties.",
  },
  {
    title: "Content accuracy",
    body: "We aim to keep tuition, intake, recognition, and admissions content current, but universities and regulators can change details without notice. Students should confirm critical facts before making payments or decisions.",
  },
  {
    title: "Third-party services and websites",
    body: "This website may link to university portals, embassy resources, payment providers, or external services. Those services operate under their own terms and policies, and Students Traffic is not responsible for their content or actions.",
  },
  {
    title: "Student responsibility",
    body: "You are responsible for checking your own eligibility, reviewing official university documents, meeting deadlines, and providing accurate academic and personal information during admissions or visa processes.",
  },
  {
    title: "Service changes",
    body: "We may update the site, our counselling workflows, and these terms as the business and admissions environment evolve. Continued use of the website after updates means you accept the revised terms.",
  },
] as const;

export default function TermsPage() {
  const path = "/terms";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Terms of Service", path },
    ]),
    getWebPageStructuredData({
      path,
      name: "Students Traffic Terms of Service",
      description:
        "Terms covering the use of Students Traffic and its admissions guidance services.",
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <SectionHeading
          eyebrow="Terms of Service"
          title="Rules for using Students Traffic"
          description="These terms explain the responsibilities that apply when you browse the site, submit an enquiry, or use Students Traffic for admissions guidance."
        />

        <ContentTrustPanel lastReviewed={catalogReviewedAt} />

        <div className="grid gap-4 md:grid-cols-2">
          {termsSections.map((section) => (
            <Card key={section.title}>
              <CardContent className="space-y-2 p-6">
                <h2 className="text-sm font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  {section.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="text-sm font-semibold text-foreground">
              Contact for terms questions
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Questions about these terms can be sent to{" "}
              <Link
                href={`mailto:${siteConfig.email}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {siteConfig.email}
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
