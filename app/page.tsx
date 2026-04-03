import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { HeroSearch } from "@/components/site/hero-search";
import { PeerUniversitiesSection } from "@/components/site/peer-universities-section";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import {
  catalogReviewedAt,
  governancePublishedAt,
} from "@/lib/content-governance";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS Abroad | Compare 500+ Universities for Indian Students",
  description:
    "Compare 500+ MBBS universities across Russia, Georgia, Kazakhstan, Vietnam, and Kyrgyzstan — fees, NMC recognition, eligibility, and free admissions counselling.",
  path: "/",
  keywords: [
    "MBBS abroad for Indian students",
    "study abroad universities India",
    "medical universities abroad fees",
    "MBBS abroad NMC recognized",
    "study abroad university finder India",
    "MBBS Russia Georgia Vietnam Kyrgyzstan",
    "low cost MBBS abroad",
  ],
});

const journeySteps = [
  {
    step: "01",
    title: "Research destinations",
    body: "Country guides covering costs, recognition, cities, and student life — before you choose a single university.",
  },
  {
    step: "02",
    title: "Compare universities",
    body: "Filter 500+ programs by country, fees, intake, and medium. Explore your options in minutes.",
  },
  {
    step: "03",
    title: "Hear from real students",
    body: "Read reviews, watch videos, and message enrolled peers. Get answers agents won't give you.",
  },
  {
    step: "04",
    title: "Apply with free support",
    body: "Our counsellors handle admissions, applications, documents, and visa — completely free.",
  },
] as const;

const startingPoints = [
  {
    Icon: Compass,
    title: "University Finder",
    description: "500+ MBBS programs. Filter by country, fees, intake, and NMC recognition.",
    href: "/universities",
    cta: "Browse universities",
  },
  {
    Icon: BookOpen,
    title: "Study Destinations",
    description: "Country guides for Russia, Georgia, Vietnam, Kyrgyzstan & more — fees, cities, recognition.",
    href: "/countries",
    cta: "Explore destinations",
  },
  {
    Icon: GraduationCap,
    title: "MBBS & Planning Guides",
    description: "Eligibility, NEET cutoffs, FMGE prep, and total cost breakdowns by country.",
    href: "/guides",
    cta: "Read the guides",
  },
] as const;

const trustPoints = [
  {
    title: "500+ programs, fully detailed",
    body: "Fees, hostel costs, NMC recognition, intake dates, and eligibility — all on one page per program. No chasing information across multiple sources.",
  },
  {
    title: "Real reviews from real students",
    body: "Text and video reviews from enrolled students on academics, hostels, faculty, and city life. See what the experience actually looks like.",
  },
  {
    title: "Talk to current students directly",
    body: "Connect with Indian students already at the university before you apply. Unfiltered answers on fees, hostels, and clinical training — from peers, not agents.",
  },
] as const;

export default async function HomePage() {
  const path = "/";
  const structuredDataItems = [
    getBreadcrumbStructuredData([{ name: "Home", path }]),
    getCollectionPageStructuredData({
      path,
      name: "Students Traffic Home",
      description:
        "Homepage for Students Traffic, helping Indian students explore study-abroad options, compare universities, and get free admissions guidance.",
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <>
      <section className="py-20 md:py-28 lg:py-32">
        <div className="container-shell text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            India&apos;s Most Transparent MBBS Abroad Platform
          </p>

          <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Study MBBS abroad —{" "}
            <span className="italic text-accent">the right way.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
            Compare fees. Read real reviews. Talk to enrolled peers.
          </p>

          <div className="mt-8">
            <HeroSearch />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <CounsellingDialog
              triggerContent={
                <>
                  Get Free Counselling
                  <ArrowRight className="size-4" />
                </>
              }
              triggerSize="lg"
            />
            <Button asChild size="lg" variant="outline">
              <Link href="/universities">Explore universities</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {[
              { value: "3,000+", label: "Students enrolled" },
              { value: "500+", label: "Universities listed" },
              { value: "10+", label: "Countries covered" },
              { value: "100%", label: "Free service" },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="font-semibold text-heading">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <div className="container-shell">
          <SectionHeading
            title="How it works"
            description="From first search to enrolment — every step covered."
            align="center"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {journeySteps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
                  Step {item.step}
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-heading">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <div className="container-shell">
          <SectionHeading
            title="Where do you want to start?"
            description="Pick the section that matches where you are in your research."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {startingPoints.map(({ Icon, title, description, href, cta }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-heading">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-accent">
                  {cta}
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section className="border-t border-border py-16 md:py-20">
        <div className="container-shell">
          <SectionHeading
            title="Why students choose us"
            description="Real information. Real reviews. Real support."
            align="center"
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {trustPoints.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white">
                  <ShieldCheck className="size-4" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-heading">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PeerUniversitiesSection />

      <section className="border-t border-border py-16 md:py-20">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-primary px-8 py-12 text-white shadow-2xl md:px-12 md:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%)]" />
            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                  Free Counselling
                </p>
                <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-heading-contrast md:text-5xl">
                  Want a shortlist that actually fits your budget and goals?
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
                  Share a few details and we&apos;ll help you narrow your options
                  with clear next steps, realistic budget guidance, and a more
                  confident plan.
                </p>
              </div>

              <DeferredLeadForm
                sourcePath="/"
                ctaVariant="home_cta"
                title="Get your personalised shortlist"
                description="Share your details and we&apos;ll follow up with guidance that matches where you are."
                className="lg:justify-self-end"
              />
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
