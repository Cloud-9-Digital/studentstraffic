import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import { SectionHeading } from "@/components/site/section-heading";
import { TrackedContactLink } from "@/components/site/tracked-contact-link";
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
  title: "Privacy Policy",
  description:
    "How Students Traffic collects, uses, stores, and protects enquiry and admissions information.",
  path: "/privacy",
});

const privacySections = [
  {
    title: "Information we collect",
    body: "We collect the details you submit through enquiry and counselling forms, such as your name, phone number, email address, course interest, country preference, and any additional notes you choose to share.",
  },
  {
    title: "How we use it",
    body: "We use this information to respond to your enquiry, recommend suitable universities, support applications, improve our website experience, and understand which pages are helping students most.",
  },
  {
    title: "When we may share it",
    body: "We may share relevant student details with partner universities or admissions-processing teams only when that is necessary to progress a counselling request or application that you want us to help with.",
  },
  {
    title: "Retention and protection",
    body: "We keep enquiry and admissions records only for as long as they are useful for support, operational review, legal compliance, or follow-up communication, and we limit internal access to teams involved in admissions and support.",
  },
  {
    title: "Your choices",
    body: "You can ask us to update or delete the personal information you have shared with us, subject to any record-keeping obligations that apply to active admissions or compliance needs.",
  },
  {
    title: "Third-party links",
    body: "This site links to universities, embassies, and other third-party websites. Their privacy practices are separate from ours, so please review their own policies before submitting information to them.",
  },
] as const;

export default function PrivacyPage() {
  const path = "/privacy";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path },
    ]),
    getWebPageStructuredData({
      path,
      name: "Students Traffic Privacy Policy",
      description:
        "Privacy policy covering how Students Traffic handles enquiry and admissions data.",
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell space-y-12">
        <SectionHeading
          eyebrow="Privacy Policy"
          title="How we handle student information"
          description="Students Traffic is built around enquiries and admissions support, so this page explains what we collect, why we collect it, and how you can reach us about your information."
        />

        <ContentTrustPanel lastReviewed={catalogReviewedAt} />

        <div className="grid gap-4 md:grid-cols-2">
          {privacySections.map((section) => (
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
              Contact for privacy requests
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              If you want to review, correct, or remove the details you have
              shared with Students Traffic, contact us at{" "}
              <Link
                href={`mailto:${siteConfig.email}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {siteConfig.email}
              </Link>{" "}
              or call{" "}
              <TrackedContactLink
                channel="call"
                location="privacy_page_call"
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {siteConfig.phone}
              </TrackedContactLink>
              .
            </p>
          </CardContent>
        </Card>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
