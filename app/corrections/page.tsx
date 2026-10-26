import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/shared/json-ld";
import { SectionHeading } from "@/components/site/section-heading";
import { TrackedContactLink } from "@/components/site/tracked-contact-link";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/constants";
import { catalogReviewedAt, governancePublishedAt } from "@/lib/content-governance";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

const path = "/corrections";
const description =
  "Found a wrong fee, date or eligibility rule on Students Traffic? Tell us on WhatsApp or email. We re-check the official source and update the page.";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Corrections Policy",
  description,
  path,
});

const steps = [
  {
    title: "We re-check the official source",
    body: "Every reported error is checked against the university's, regulator's or admissions authority's current official documents — not against other websites.",
  },
  {
    title: "We update the page",
    body: "If the information was wrong or out of date, we correct it and the page's \"Updated on\" date changes to the date of the fix.",
  },
  {
    title: "We flag what changed",
    body: "When a correction changes something a student may already have acted on — a fee, an eligibility rule, a recognition status or a deadline — we say so on the page itself.",
  },
  {
    title: "We tell you the outcome",
    body: "If you reported the error and left a contact, we let you know whether the page was changed and why.",
  },
] as const;

export default function CorrectionsPage() {
  const structuredData = getStructuredDataGraph([
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Editorial Policy", path: "/editorial-policy" },
      { name: "Corrections", path },
    ]),
    getWebPageStructuredData({
      path,
      name: "Students Traffic Corrections Policy",
      description,
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ]);

  return (
    <section className="section-space">
      <div className="container-shell max-w-4xl space-y-12">
        <SectionHeading
          as="h1"
          eyebrow="Corrections"
          title="Spotted an error? Tell us."
          description="Fees, deadlines and admission rules change often. If something on Students Traffic is wrong or out of date, we want to fix it quickly."
        />

        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-heading">
            How to report an error
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            Send us the page link, what is wrong, and — if you have it — a link to
            the official document that shows the correct information.
          </p>
          <div className="flex flex-wrap gap-3">
            <TrackedContactLink
              channel="whatsapp"
              location="corrections_page_whatsapp"
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              WhatsApp us
            </TrackedContactLink>
            <a
              href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Correction request")}`}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
            >
              Email {siteConfig.email}
            </a>
            <Link
              href="/contact"
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary"
            >
              Contact page
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-heading">
            How we handle corrections
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step) => (
              <Card key={step.title}>
                <CardContent className="space-y-2 p-6">
                  <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{step.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <p className="text-sm leading-7 text-muted-foreground">
          Read how we research and review information in our{" "}
          <Link href="/editorial-policy" className="text-accent hover:underline">
            editorial policy
          </Link>{" "}
          and{" "}
          <Link href="/methodology" className="text-accent hover:underline">
            methodology
          </Link>
          .
        </p>
      </div>
      <JsonLd data={structuredData} />
    </section>
  );
}
