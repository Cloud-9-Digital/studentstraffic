import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildNoIndexMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildNoIndexMetadata(
  {
    title: "Thank You",
    description: "Your Students Traffic enquiry has been received.",
  },
  {
    canonicalPath: "/thank-you",
  }
);

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <section className="section-space">
      <div className="container-shell">
        <Suspense fallback={<ThankYouCard />}>
          <ThankYouDetails searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}

async function ThankYouDetails({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const source = Array.isArray(params.source) ? params.source[0] : params.source;
  const interest = Array.isArray(params.interest)
    ? params.interest[0]
    : params.interest;

  return <ThankYouCard source={source} interest={interest} />;
}

function ThankYouCard({
  source,
  interest,
}: {
  source?: string;
  interest?: string;
}) {
  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="space-y-4">
        <CardTitle className="font-display text-heading text-5xl tracking-tight">
          Your enquiry is now part of the Students Traffic lead pipeline.
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-muted-foreground">
        <p>
          We captured this enquiry with page attribution
          {source ? ` from ${source}` : ""} and the current interest
          {interest ? ` around ${interest}` : ""}.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/universities">Continue exploring universities</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
