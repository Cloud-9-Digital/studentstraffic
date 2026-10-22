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
    title: "Who we are",
    body: "Students Traffic (studentstraffic.com and the Students Traffic app for Android and iOS) is owned and operated by Cloud 9 Digital. References to \"we\" and \"us\" on this page mean Cloud 9 Digital.",
  },
  {
    title: "Information we collect",
    body: "We collect the details you submit through enquiry and counselling forms, such as your name, phone number, email address, country of residence, course interest, country preference, and any additional notes you choose to share.",
  },
  {
    title: "The Students Traffic app",
    body: "If you create an app account we store your name, email address, phone number, a hashed password, and the profile details, shortlist and applications you add. We store a push-notification token so we can alert you to messages and calls, the messages you exchange with student guides, and records of voice calls (who called, when and for how long). Voice calls are carried in real time through Agora and are not recorded. The app uses the microphone only during a call you start or answer.",
  },
  {
    title: "Mira, our AI assistant",
    body: "When you chat with Mira, your messages are sent to Anthropic to generate replies and the conversation is stored with your account (or your device, if you are signed out) so we can continue it and improve answers. Don't share sensitive personal information in the chat. If you ask Mira to arrange counselling or a student introduction, the details you confirm are saved as an enquiry.",
  },
  {
    title: "Service providers",
    body: "We use service providers to run Students Traffic: hosting and databases, Google Firebase for push notifications, Agora for voice calls, Anthropic for Mira, WATI for WhatsApp messages you ask us to send, and our admissions CRM for counselling follow-up. They process data only on our instructions. We do not sell personal information and the app shows no ads.",
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
    title: "Deleting your account",
    body: "In the app, open Profile and tap Delete account. This immediately deletes your account, profile, shortlist, applications, Mira chats, guide conversations, call history and push tokens. You can also request deletion without the app at studentstraffic.com/delete-account. Enquiries already passed to our counselling team are deleted within 30 days of your request unless an active admission needs them.",
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
