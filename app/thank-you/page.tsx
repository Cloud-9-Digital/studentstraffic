import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { ThankYouAnalytics } from "@/components/site/thank-you-analytics";
import { buildNoIndexMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildNoIndexMetadata(
  { title: "Thank You", description: "Your Students Traffic enquiry has been received." },
  { canonicalPath: "/thank-you" },
);

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const source = Array.isArray(params.source) ? params.source[0] : params.source;
  const interest = Array.isArray(params.interest) ? params.interest[0] : params.interest;
  const isNeetPredictor = source === "/neet-college-predictor";
  const heading = isNeetPredictor
    ? "Your NEET prediction request has been received."
    : interest
      ? `Your enquiry about ${interest} has been received.`
      : "Your request has been received.";

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent">
        <div className="container-shell relative py-12 md:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-black/10">
                <Check className="size-7" strokeWidth={2.5} />
              </div>
              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Enquiry received</p>
              <h1 className="mx-auto mt-4 max-w-[17ch] font-display text-5xl font-semibold leading-[1.04] tracking-tight text-white md:text-6xl lg:text-7xl">
                {heading}
              </h1>

              <ThankYouAnalytics source={source} interest={interest} />
              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/70 md:text-lg">
                {isNeetPredictor
                  ? "Your NEET college prediction request is in. We will send the results to your email."
                  : interest
                    ? `Our counsellor will call you about ${interest}.`
                    : "Our counsellor will call you about your enquiry."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-10 md:py-14">
        <div className="flex flex-col justify-between gap-5 rounded-[1.5rem] border border-border bg-background p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/60">While you wait</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-heading">Explore universities and programmes.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Compare options before your counselling call.</p>
          </div>
          <Link href="/universities" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong">
            Explore universities
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
