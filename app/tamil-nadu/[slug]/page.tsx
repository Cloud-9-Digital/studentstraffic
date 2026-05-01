import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Globe,
  GraduationCap,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import {
  getTamilNaduCityPage,
  getTamilNaduCityPages,
} from "@/lib/data/tamil-nadu-local";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getCountryHref,
  getTamilNaduCityHref,
  getTamilNaduHubHref,
} from "@/lib/routes";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";
import { ensureNonEmptyStaticParams } from "@/lib/static-params";

export async function generateStaticParams() {
  return ensureNonEmptyStaticParams(
    getTamilNaduCityPages().map((page) => ({ slug: page.slug })),
    { slug: "chennai" },
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getTamilNaduCityPage(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return buildIndexableMetadata({
    title: `Best MBBS Abroad Consultant in ${page.city} | Expert Guidance & Counselling`,
    description: `Looking for MBBS abroad consultant in ${page.city}? Get expert guidance on studying medicine in Russia, Georgia, Vietnam, Kyrgyzstan. Compare costs, verify NMC recognition. Free counselling for ${page.city} students.`,
    path: getTamilNaduCityHref(page.slug),
    keywords: [
      `mbbs abroad consultant in ${page.city}`,
      `best mbbs abroad consultant ${page.city}`,
      `mbbs abroad counselling in ${page.city}`,
      `study mbbs abroad from ${page.city}`,
      `mbbs abroad guidance ${page.city}`,
      `medical education consultant ${page.city}`,
      `${page.city} mbbs abroad`,
      `mbbs abroad ${page.city}`,
    ],
  });
}

export default async function TamilNaduCityPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getTamilNaduCityPage(slug);

  if (!page) {
    notFound();
  }

  const path = getTamilNaduCityHref(page.slug);
  const relatedCities = getTamilNaduCityPages()
    .filter((item) => item.slug !== page.slug)
    .slice(0, 6);

  const structuredData = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Tamil Nadu", path: getTamilNaduHubHref() },
      { name: page.city, path },
    ]),
    getWebPageStructuredData({
      path,
      name: `Best MBBS Abroad Consultant in ${page.city}`,
      description: page.metaDescription,
    }),
    getFaqStructuredData(page.faq, path),
  ];

  return (
    <>
      <JsonLd data={getStructuredDataGraph(structuredData)} />

      {/* Hero Section */}
      <section className="border-b border-border bg-white">
        <div className="container-shell py-16 md:py-20">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <ChevronRight className="size-4" />
            <Link href={getTamilNaduHubHref()} className="transition-colors hover:text-primary">
              Tamil Nadu
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{page.city}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2">
              <MapPin className="size-4 text-accent" />
              <span className="text-sm font-semibold text-accent">{page.city}, Tamil Nadu</span>
            </div>

            <h1 className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight text-primary md:text-6xl lg:text-7xl">
              Best MBBS Abroad Consultant in {page.city}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {page.heroSummary}
            </p>

            <div className="mt-8">
              <CounsellingDialog
                triggerContent={
                  <>
                    <Phone className="size-5" />
                    Get Free Counselling
                  </>
                }
                triggerVariant="accent"
                triggerSize="lg"
                ctaVariant={`tamil_nadu_${page.slug}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* What Students Ask */}
      <section className="border-b border-border bg-muted/30 py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-12 max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Common Questions from {page.city} Students
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              These are the most frequent questions we receive from students and parents in {page.city}.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {page.commonQuestions.map((question, index) => (
              <div key={index} className="rounded-xl border border-border bg-white p-6">
                <div className="flex size-12 items-center justify-center rounded-lg bg-accent/10 font-display text-xl font-bold text-accent">
                  {index + 1}
                </div>
                <p className="mt-4 font-medium leading-relaxed text-foreground">{question}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Countries */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-12 max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Recommended Countries for {page.city} Students
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Based on budget patterns, preferences, and successful outcomes from students in {page.city}.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {page.destinationFocus.map((dest) => (
              <Link
                key={dest.slug}
                href={getCountryHref(dest.slug)}
                className="group rounded-xl border border-border bg-white p-8 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                  <Globe className="size-7 text-primary transition-colors group-hover:text-white" />
                </div>

                <h3 className="mt-6 font-display text-2xl font-bold text-primary group-hover:text-accent">
                  {dest.country}
                </h3>

                <p className="mt-4 leading-relaxed text-muted-foreground">{dest.reason}</p>

                <div className="mt-6 flex items-center gap-2 font-semibold text-accent">
                  <span>View Country Details</span>
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="border-b border-border bg-muted/30 py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-12 max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Complete MBBS Abroad Guidance for {page.city}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              End-to-end support from country selection to university admission and beyond.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-5 rounded-xl border border-border bg-white p-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-heading">Country & University Selection</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Compare Russia, Georgia, Vietnam, Kyrgyzstan based on budget, climate, language, and career outcomes.
                  Selection universities matching your NEET score and preferences.
                </p>
              </div>
            </div>

            <div className="flex gap-5 rounded-xl border border-border bg-white p-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-heading">NMC Recognition Verification</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Verify university against NMC and WDOMS databases. Understand FMGE/NExT requirements.
                  Get complete clarity on medical licensing for practice in India.
                </p>
              </div>
            </div>

            <div className="flex gap-5 rounded-xl border border-border bg-white p-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-heading">Complete Cost Breakdown</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Detailed 6-year cost including tuition, hostel, food, insurance, travel.
                  Compare with private medical colleges in Tamil Nadu. No hidden charges.
                </p>
              </div>
            </div>

            <div className="flex gap-5 rounded-xl border border-border bg-white p-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-heading">Admission & Documentation</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Complete application support, document preparation, visa guidance, and pre-departure orientation
                  for students from {page.city}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-12 max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Detailed answers to help {page.city} students and parents make informed decisions.
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {page.faq.map((item, index) => (
              <div key={index} className="rounded-xl border border-border bg-white p-8">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-semibold text-accent">
                    Q
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-heading">{item.question}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Cities */}
      {relatedCities.length > 0 && (
        <section className="border-b border-border bg-muted/30 py-16 md:py-20">
          <div className="container-shell">
            <div className="mb-12 flex items-end justify-between gap-4">
              <div className="max-w-3xl">
                <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
                  MBBS Abroad Guidance in Other Tamil Nadu Cities
                </h2>
              </div>
              <Link
                href={getTamilNaduHubHref()}
                className="shrink-0 text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
              >
                View All Cities
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCities.map((city) => (
                <Link
                  key={city.slug}
                  href={getTamilNaduCityHref(city.slug)}
                  className="group rounded-xl border border-border bg-white p-6 transition-all hover:border-primary hover:shadow-md"
                >
                  <h3 className="font-display text-2xl font-bold text-primary group-hover:text-accent">
                    {city.city}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {city.heroSummary}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-accent">
                    <span>View Details</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container-shell text-center">
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
            Ready to Plan Your MBBS Abroad from {page.city}?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Get guidance on country selection, college options, cost planning, and NMC recognition.
            Students and parents can both join the counselling call.
          </p>
          <div className="mt-8">
            <CounsellingDialog
              triggerContent={
                <>
                  <Phone className="size-5" />
                  Request Free Counselling
                </>
              }
              triggerVariant="accent"
              triggerSize="lg"
              ctaVariant={`tamil_nadu_${page.slug}_bottom`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
