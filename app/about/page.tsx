import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileCheck, Globe, MessageCircle, Search, ShieldCheck, Users } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { Button } from "@/components/ui/button";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "About Students Traffic",
  description:
    "Students Traffic helps Indian students find and apply to the best universities abroad — with transparent comparisons, verified information, and free end-to-end admissions support.",
  path: "/about",
});

const pillars = [
  {
    Icon: Search,
    label: "Transparent Comparisons",
    heading: "See the full picture",
    body: "Honest, side-by-side comparisons of fees, programs, cities, and recognition — so you can choose the best option, not just the one marketed loudest.",
  },
  {
    Icon: ShieldCheck,
    label: "Verified Information",
    heading: "Data you can rely on",
    body: "Every university listing is verified against current admissions materials. No inflated numbers, no outdated fees, no vague promises.",
  },
  {
    Icon: Users,
    label: "End-to-End Admissions",
    heading: "With you from start to visa",
    body: "Our award-winning counsellors handle everything — shortlisting, applications, documents, and visa — across countries and streams, completely free.",
  },
] as const;

const journey = [
  {
    Icon: Globe,
    step: "01",
    heading: "Explore your options",
    body: "Browse universities across Russia, Vietnam, Georgia, and more. Compare fees, programs, cities, and recognition side by side.",
  },
  {
    Icon: MessageCircle,
    step: "02",
    heading: "Talk to a counsellor",
    body: "Our experts understand your goals, academic background, and budget — and recommend the universities that are genuinely the best fit for you.",
  },
  {
    Icon: FileCheck,
    step: "03",
    heading: "We handle your application",
    body: "From filling forms to preparing documents, we manage the entire admissions process so you can focus on getting ready for the move.",
  },
  {
    Icon: ArrowRight,
    step: "04",
    heading: "Arrive confident",
    body: "Visa done. Seat confirmed. Our support doesn't stop at admission — we stay with you through pre-departure and beyond.",
  },
] as const;

export default function AboutPage() {
  const path = "/about";
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "About", path },
    ]),
    getWebPageStructuredData({
      path,
      name: "About Students Traffic",
      description:
        "Students Traffic helps Indian students find and apply to the best universities abroad — with transparent comparisons and free expert admissions support.",
    }),
  ];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="section-space border-b border-border">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                About Students Traffic
              </p>
              <h1 className="font-display text-5xl font-semibold leading-[1.06] tracking-tight text-heading sm:text-6xl lg:text-7xl">
                Transparent guidance.
                <br />
                <span className="italic text-accent">Better decisions.</span>
              </h1>
              <p className="max-w-lg text-base leading-8 text-muted-foreground">
                We help students across India find and apply to the best
                universities abroad — with honest comparisons, verified
                information, and end-to-end admissions support from
                award-winning counsellors who have taken over 2,000 students
                from enquiry to enrolment.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <CounsellingDialog
                  triggerContent={
                    <>
                      Talk to a counsellor{" "}
                      <ArrowRight className="size-4" />
                    </>
                  }
                  triggerVariant="accent"
                />
                <Button asChild variant="outline">
                  <Link href="/universities">Explore universities</Link>
                </Button>
              </div>

              {/* Stats — visible on mobile below CTAs, hidden on lg (shown right) */}
              <div className="grid grid-cols-2 gap-3 pt-2 lg:hidden">
                {[
                  { number: "2,000+", label: "Students enrolled" },
                  { number: "6+", label: "Study destinations" },
                  { number: "100%", label: "Free service" },
                  { number: "Award", label: "Winning counsellors" },
                ].map(({ number, label }) => (
                  <div key={label} className="rounded-xl border border-border bg-muted/40 px-4 py-3">
                    <p className="text-2xl font-bold text-heading">{number}</p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — credential cards, desktop only */}
            <div className="hidden grid-cols-2 gap-4 lg:grid">
              {[
                {
                  number: "2,000+",
                  label: "Students enrolled",
                  note: "Across countries & streams",
                  highlight: true,
                },
                {
                  number: "6+",
                  label: "Study destinations",
                  note: "Russia, Georgia, Vietnam & more",
                  highlight: false,
                },
                {
                  number: "100%",
                  label: "Free service",
                  note: "No fees, no obligations",
                  highlight: false,
                },
                {
                  number: "Award",
                  label: "Winning counsellors",
                  note: "Recognised expert guidance",
                  highlight: false,
                },
              ].map(({ number, label, note, highlight }) => (
                <div
                  key={label}
                  className={
                    highlight
                      ? "flex flex-col gap-1.5 rounded-2xl bg-primary p-6"
                      : "flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-6"
                  }
                >
                  <p className={`text-3xl font-bold ${highlight ? "text-accent" : "text-heading"}`}>
                    {number}
                  </p>
                  <p className={`text-sm font-semibold ${highlight ? "text-white" : "text-foreground"}`}>
                    {label}
                  </p>
                  <p className={`text-xs ${highlight ? "text-white/60" : "text-muted-foreground"}`}>
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────────── */}
      <section className="section-space border-b border-border">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Why We Exist
            </p>
            <h2 className="mt-6 font-display text-3xl font-semibold leading-[1.18] tracking-tight text-primary sm:text-4xl lg:text-5xl">
              Students deserve{" "}
              <span className="italic text-accent">real options</span>
              {" "}and real support —{" "}
              not a sales pitch.
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground">
              Most consultancies push students toward universities that pay them
              the highest commissions. We built Students Traffic to do the
              opposite — give students the clearest, most honest view of their
              options, then back it with genuine admissions expertise to get
              them there.
            </p>
          </div>
        </div>
      </section>

      {/* ── Three pillars ─────────────────────────────────────────────────── */}
      <section className="section-space border-b border-border">
        <div className="container-shell">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              What We Do
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-heading md:text-5xl">
              Information and admissions,
              <br />
              <span className="italic">under one roof.</span>
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3">
            {pillars.map(({ Icon, label, heading, body }) => (
              <div key={label} className="flex flex-col gap-6 bg-background p-8 md:p-10">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-white">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {label}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-heading">
                    {heading}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Admissions journey ────────────────────────────────────────────── */}
      <section className="section-space border-b border-border">
        <div className="container-shell">
          <div className="section-tint rounded-3xl px-8 py-14 md:px-14 md:py-16">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                How It Works
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-heading md:text-5xl">
                From first search
                <br />
                <span className="italic">to enrolled.</span>
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {journey.map(({ Icon, step, heading, body }) => (
                <div
                  key={step}
                  className="flex gap-5 rounded-2xl border border-border/50 bg-white/70 p-6 backdrop-blur-sm"
                >
                  <div className="mt-0.5 shrink-0">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white">
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-semibold text-foreground">{heading}</p>
                    <p className="text-sm leading-7 text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="section-space">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Free · No obligations
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-heading md:text-5xl">
              Ready to find your
              <br />
              <span className="italic">perfect programme?</span>
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Talk to one of our counsellors — they'll understand your goals and
              walk you through the best options across countries and streams,
              completely free.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <CounsellingDialog
                triggerContent={
                  <>
                    Get free counselling{" "}
                    <ArrowRight className="size-4" />
                  </>
                }
                triggerVariant="accent"
              />
              <Button asChild variant="outline">
                <Link href="/universities">Browse universities</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
