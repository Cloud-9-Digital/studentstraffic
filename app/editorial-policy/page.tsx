import type { Metadata } from "next";
import { CheckCircle2, Shield, FileCheck, Users, RefreshCw, AlertCircle, Calendar } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { ContentTrustPanel } from "@/components/site/content-trust-panel";
import {
  catalogReviewedAt,
  editorialPrinciples,
  governancePublishedAt,
  contentAuthorName,
  contentAuthorRole,
  contentAuthorBio,
  methodologySteps,
} from "@/lib/content-governance";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Editorial Policy & Content Standards | Students Traffic",
  description:
    "Learn how Students Traffic verifies MBBS abroad university information, fees, admissions data, and student reviews. Our commitment to accuracy and transparency for Indian students.",
  path: "/editorial-policy",
});

const qualityStandards = [
  {
    icon: Shield,
    title: "Accuracy First",
    description: "Every university profile, fee structure, and admission detail is verified against official sources before publication.",
  },
  {
    icon: RefreshCw,
    title: "Regular Updates",
    description: "We review and update all university data quarterly, with immediate corrections when admission criteria or fees change.",
  },
  {
    icon: FileCheck,
    title: "Source Verification",
    description: "All information is cross-checked with university websites, official documents, and regulatory body databases.",
  },
  {
    icon: Users,
    title: "Student Reviews",
    description: "Reviews are verified through email confirmation and moderated to ensure genuine student experiences.",
  },
];

const editorialProcess = [
  {
    step: "1",
    title: "Research & Collection",
    description: "We gather data from official university sources, regulatory bodies like NMC/MCI, and verified student feedback.",
  },
  {
    step: "2",
    title: "Verification",
    description: "Our team cross-checks fees, intake numbers, recognition status, and admission criteria with multiple authoritative sources.",
  },
  {
    step: "3",
    title: "Expert Review",
    description: "Content is reviewed by our admissions team who have experience counseling students for MBBS abroad programs.",
  },
  {
    step: "4",
    title: "Publication & Monitoring",
    description: "After publishing, we continuously monitor for changes in university policies, fees, or recognition status.",
  },
];

const transparencyCommitments = [
  "We clearly label sponsored content and maintain editorial independence",
  "We disclose when university information is pending verification",
  "We publish correction notices when significant errors are found",
  "We don't alter student reviews except for language or privacy concerns",
  "We maintain a public record of major content updates and changes",
];

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
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/5 via-background to-accent/5 px-6 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            <Shield className="h-4 w-4" />
            Our Commitment to Accuracy
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Editorial Policy & Content Standards
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            How we verify university information, validate student reviews, and maintain the highest standards of accuracy for families planning MBBS abroad.
          </p>

          <ContentTrustPanel lastReviewed={catalogReviewedAt} />
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="px-6 py-16 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Why You Can Trust Our Information
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              Choosing the right medical university abroad is a life-changing decision. We take the responsibility of providing accurate information seriously.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {qualityStandards.map((standard) => (
              <div key={standard.title} className="text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                  <standard.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {standard.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {standard.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Principles */}
      <section className="bg-gray-50 px-6 py-16 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Our Editorial Principles
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              These core principles guide every piece of content we publish:
            </p>
          </div>

          <div className="space-y-6">
            {editorialPrinciples.map((principle, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <p className="text-base leading-7 text-foreground">
                  {principle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Process */}
      <section className="px-6 py-16 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Our Content Verification Process
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              Every university profile goes through a rigorous 4-step verification process
            </p>
          </div>

          <div className="space-y-8">
            {editorialProcess.map((item, index) => (
              <div key={item.step} className="relative">
                {index < editorialProcess.length - 1 && (
                  <div className="absolute left-6 top-16 h-full w-0.5 bg-gradient-to-b from-accent/30 to-transparent" />
                )}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-display text-lg font-bold text-accent-foreground shadow-sm">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-grow pb-8">
                    <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Methodology */}
      <section className="bg-accent/5 px-6 py-16 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              How We Verify University Information
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Our methodology for ensuring data accuracy:
            </p>
          </div>

          <div className="space-y-6">
            {methodologySteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
                    {index + 1}
                  </div>
                </div>
                <p className="text-base leading-relaxed text-foreground">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Commitments */}
      <section className="px-6 py-16 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Our Transparency Commitments
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              We believe in complete transparency about how we handle information:
            </p>
          </div>

          <ul className="space-y-5">
            {transparencyCommitments.map((commitment, index) => (
              <li key={index} className="flex gap-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-accent" />
                <span className="text-base leading-relaxed text-foreground">
                  {commitment}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 px-6 py-16 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Meet Our Content Team
            </h2>
          </div>

          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent font-display text-2xl font-bold text-accent-foreground">
              {contentAuthorName.charAt(0)}
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {contentAuthorName}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">
                {contentAuthorRole}
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {contentAuthorBio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-accent px-6 py-12 sm:px-8 md:py-16 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-bold text-accent-foreground sm:text-3xl">
            Questions About Our Editorial Standards?
          </h2>
          <p className="mt-4 text-base text-accent-foreground/80">
            We're committed to transparency. If you have questions about how we verify information or want to report an error, please reach out to us.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-background px-6 py-3 font-semibold text-foreground shadow-lg transition hover:bg-background/90"
            >
              Contact Our Team
            </a>
            <a
              href="mailto:editorial@studentstraffic.com"
              className="inline-flex items-center justify-center rounded-lg border-2 border-accent-foreground/20 px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-foreground/10"
            >
              Report an Error
            </a>
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
