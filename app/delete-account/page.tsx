import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/constants";
import { buildNoIndexMetadata } from "@/lib/metadata";

// Linked from the Play Store data safety section as the account deletion URL.
export const metadata: Metadata = buildNoIndexMetadata(
  {
    title: "Delete your Students Traffic account",
    description:
      "How to delete your Students Traffic app account and the data linked to it.",
  },
  { canonicalPath: "/delete-account" }
);

const deletionMailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
  "Delete my Students Traffic account"
)}`;

const steps = [
  {
    title: "Delete it in the app",
    body: "Open the Students Traffic app, go to Profile, scroll to Account and tap Delete account, then confirm. Your account is deleted straight away.",
  },
  {
    title: "Or ask us by email",
    body: "If you no longer have the app, email us from the address you registered with and ask us to delete your account. We confirm by reply and complete the deletion within 30 days.",
  },
] as const;

const deletedData = [
  "Your account: name, email address, phone number and password",
  "Your profile, shortlist and applications",
  "Your Mira chats, guide conversations and call history",
  "Push-notification tokens for your devices",
] as const;

export default function DeleteAccountPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading
          eyebrow="Account deletion"
          title="Delete your Students Traffic account"
          description="Students Traffic is operated by Cloud 9 Digital. You can delete your app account and the data linked to it at any time."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardContent className="space-y-2 p-6">
                <h2 className="text-sm font-semibold text-foreground">
                  {step.title}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  {step.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="text-sm font-semibold text-foreground">
              What we delete
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-muted-foreground">
              {deletedData.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm leading-7 text-muted-foreground">
              Counselling enquiries already passed to our admissions team are
              deleted within 30 days of your request, unless an admission you
              are actively pursuing needs them. Voice calls are never recorded.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="text-sm font-semibold text-foreground">
              Request deletion by email
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Email{" "}
              <Link
                href={deletionMailto}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {siteConfig.email}
              </Link>{" "}
              with the subject &ldquo;Delete my Students Traffic account&rdquo;.
              Read our{" "}
              <Link
                href="/privacy"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                privacy policy
              </Link>{" "}
              for how we handle your information.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
