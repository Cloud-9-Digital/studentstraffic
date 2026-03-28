import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CountryFlag } from "@/components/site/country-flag";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityCard } from "@/components/site/university-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  catalogReviewedAt,
} from "@/lib/content-governance";
import { navDestinations, siteConfig } from "@/lib/constants";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getCountryStructuredData,
  getCourseStructuredData,
  getFaqStructuredData,
  getItemListStructuredDataId,
  getProgramItemListStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getLandingPageBySlug,
  getLandingPageContext,
  getLandingPageSlugs,
} from "@/lib/data/catalog";
import { getFeeStructuresForSlugs } from "@/lib/data/university-fee-structures";

export async function generateStaticParams() {
  const slugs = await getLandingPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) return { title: "Page Not Found" };

  const context = await getLandingPageContext(page);
  const keywords = [
    page.title,
    `${page.courseSlug} in ${page.countrySlug}`,
    context.country ? `study in ${context.country.name}` : undefined,
    context.course ? `${context.course.shortName} abroad` : undefined,
    ...page.heroHighlights,
  ].filter(Boolean) as string[];

  return buildIndexableMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/${page.slug}`,
    keywords,
  });
}

export default async function LandingPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) notFound();

  const context = await getLandingPageContext(page);

  if (!context.country || !context.course) notFound();

  const country = context.country;
  const course = context.course;
  const path = `/${page.slug}`;
  const previewPrograms = context.featuredPrograms;
  const feeStructures = getFeeStructuresForSlugs(page.featuredUniversitySlugs);

  const countryCode = navDestinations.find(
    (d) => d.href === `/countries/${country.slug}`
  )?.countryCode;

  const countryStructuredData = getCountryStructuredData(country);
  const courseStructuredData = getCourseStructuredData(course);
  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: page.title, path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: page.title,
      description: page.metaDescription,
      aboutIds: [countryStructuredData["@id"], courseStructuredData["@id"]],
      mainEntityId: context.featuredPrograms.length
        ? getItemListStructuredDataId(path)
        : undefined,
      datePublished: catalogReviewedAt,
      dateModified: catalogReviewedAt,
    }),
    countryStructuredData,
    courseStructuredData,
    context.featuredPrograms.length
      ? getProgramItemListStructuredData({
          path,
          name: `Featured ${page.title} programs`,
          programs: context.featuredPrograms,
        })
      : null,
    page.faq.length ? getFaqStructuredData(page.faq, path) : null,
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-surface-dark pt-12 pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24">
        <div className="container-shell">
          {/* Breadcrumb */}
          <nav className="mb-10 flex items-center gap-1.5 text-xs text-white/40" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-white/65">Home</Link>
            <ChevronRight className="size-3 shrink-0" />
            <Link href="/guides" className="transition-colors hover:text-white/65">Guides</Link>
            <ChevronRight className="size-3 shrink-0" />
            <span className="text-white/55">{page.title}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-center lg:gap-16">
            {/* ── Left ── */}
            <div>
              {/* Flag + kicker */}
              <div className="mb-6 flex items-center gap-2.5">
                {countryCode && (
                  <CountryFlag
                    countryCode={countryCode}
                    alt={country.name}
                    width={22}
                    height={16}
                    className="rounded shadow-flag"
                  />
                )}
                <span className="text-sm text-white/50">{page.kicker}</span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                {page.title}
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/62">
                {page.summary}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-white shadow-cta hover:bg-accent-strong hover:shadow-cta-hover"
                >
                  <Link href="/contact">
                    Free counselling
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25"
                >
                  <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                    <Phone className="size-4" />
                    Call us
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-whatsapp/20 text-white ring-1 ring-whatsapp/50 hover:bg-whatsapp/35"
                >
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* ── Right: white form card ── */}
            <div className="hidden lg:block">
              <div className="rounded-2xl bg-white p-8 shadow-dialog">
                <p className="mb-0.5 text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
                  Free counselling
                </p>
                <h2 className="mb-6 font-display text-2xl font-semibold leading-snug text-primary">
                  Get guidance on {page.title}
                </h2>
                <LeadForm
                  sourcePath={path}
                  ctaVariant="landing_sidebar"
                  title=""
                  description=""
                  countrySlug={country.slug}
                  courseSlug={course.slug}
                  embedded
                  stacked
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── NEET Notice ──────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-amber-50 py-10 md:py-12">
        <div className="container-shell">
          <div className="flex gap-4">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-amber-900 sm:text-2xl">
                NEET UG &amp; your degree validity in India — read this before enrolling
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-amber-200 bg-white px-5 py-4">
                  <p className="mb-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-amber-600">
                    Admission
                  </p>
                  <p className="text-sm leading-6 text-amber-900">
                    Vietnam universities <span className="font-semibold">do not require NEET UG</span> for admission. You can enrol without a NEET score.
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-white px-5 py-4">
                  <p className="mb-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-amber-600">
                    Practising in India
                  </p>
                  <p className="text-sm leading-6 text-amber-900">
                    To appear for FMGE / NExT and practice medicine in India, <span className="font-semibold">NEET must have been qualified before your MBBS program began.</span> Without this, your degree has no legal standing in India.
                  </p>
                </div>
                <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                  <p className="mb-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-red-600">
                    Agent misinformation — beware
                  </p>
                  <p className="text-sm leading-6 text-red-900">
                    Some agents advise students to <span className="font-semibold">start MBBS first and appear for NEET the following year.</span> This is incorrect and harmful. NMC requires NEET qualification before program commencement — appearing after does not validate your degree. NEET scores are also valid for only 3 years from the date of result.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Universities ─────────────────────────────────────────────────── */}
      <section className="border-b border-border py-14 md:py-20">
        <div className="container-shell">
          <div className="mb-10">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Universities accepting Indian students for {page.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              These listings can help you move from information gathering into
              actual university comparison.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {previewPrograms.map((program) => (
              <UniversityCard key={program.offering.slug} program={program} />
            ))}
          </div>

          <div className="mt-8 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <p className="text-sm leading-6 text-amber-900">
              <span className="font-semibold">Only the universities listed above currently accept Indian students.</span>{" "}
              Other universities in Vietnam have not yet opened admissions for Indian applicants. Be cautious of agents or websites marketing unlisted universities — verify directly before paying any fees.
            </p>
          </div>
        </div>
      </section>

      {/* ── Fee Structures ───────────────────────────────────────────────── */}
      {feeStructures.length > 0 && (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Fee structures — 2026
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Verified fee breakdowns for universities that have shared their 2026 structure. Amounts in USD unless stated. One-time charges are shared across all universities.
            </p>

            <div className="mt-10 space-y-6">
              {feeStructures.map((fs) => (
                <div key={fs.universitySlug} className="overflow-hidden rounded-2xl border border-border">
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-[#faf8f4] px-6 py-4">
                    <h3 className="font-display text-lg font-semibold text-heading">
                      {fs.universityName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                      {fs.singlePaymentFee && (
                        <span className="text-sm text-muted-foreground">
                          Single payment:{" "}
                          <span className="font-semibold text-primary">{fs.singlePaymentFee}</span>
                          <span className="ml-1.5 text-xs line-through">{fs.totalUniversityFee}</span>
                        </span>
                      )}
                      <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                        Total: {fs.totalUniversityFee}
                      </span>
                    </div>
                  </div>

                  <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    {/* Tuition */}
                    <div className="px-6 py-5">
                      <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Tuition (Years 1–6)
                      </p>
                      <p className="text-2xl font-semibold text-heading">{fs.annualFee}</p>
                      <p className="mt-1 text-sm text-muted-foreground">per year</p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {fs.semestersPerYear} semester{fs.semestersPerYear > 1 ? "s" : ""} × {fs.semesterFee} each
                      </p>
                      <div className="mt-4 border-t border-border pt-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                          University reg. fee
                        </p>
                        <p className="text-sm font-medium text-foreground">{fs.registrationFee}</p>
                      </div>
                    </div>

                    {/* Hostel */}
                    <div className="px-6 py-5">
                      <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Hostel fee
                      </p>
                      <div className="space-y-2.5">
                        {fs.hostelOptions.map((h) => (
                          <div key={h.sharing} className="flex items-center justify-between gap-2">
                            <span className="text-sm text-muted-foreground">{h.sharing}</span>
                            <span className="text-sm font-semibold text-foreground">{h.amountPerYear}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 border-t border-border pt-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">
                          One-time charges
                        </p>
                        <div className="space-y-1.5">
                          {fs.oneTimeCharges.map((c) => (
                            <div key={c.label} className="flex items-start justify-between gap-2">
                              <span className="text-xs leading-5 text-muted-foreground">{c.label}</span>
                              <span className="shrink-0 text-xs font-semibold text-foreground">{c.amount}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                          <span className="text-xs font-semibold text-foreground">Total one-time</span>
                          <span className="text-xs font-bold text-primary">{fs.totalOneTimeCharges}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="px-6 py-5">
                      <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Important notes
                      </p>
                      <ul className="space-y-2.5">
                        {fs.notes.map((note, i) => (
                          <li key={i} className="flex gap-2.5">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent/70" />
                            <span className="text-xs leading-5 text-muted-foreground">{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why this destination ─────────────────────────────────────────── */}
      <section className="border-b border-border py-14 md:py-20">
        <div className="container-shell">
          <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Why students choose {page.title}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.reasonsToChoose.map((reason, i) => (
              <div key={i} className="rounded-2xl border border-border bg-[#faf8f4] px-6 py-5">
                <span className="mb-3 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm leading-7 text-muted-foreground">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── At a Glance ──────────────────────────────────────────────────── */}
      {page.atAGlance?.length ? (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {page.title} at a glance
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {page.atAGlance.map((row) => (
                <div
                  key={row.label}
                  className="rounded-2xl border border-border bg-[#faf8f4] px-5 py-4"
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {row.label}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-foreground">{row.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── India Comparison ─────────────────────────────────────────────── */}
      {page.indiaComparison?.length ? (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              MBBS in India vs {country.name}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              A side-by-side comparison of key factors to help you evaluate both pathways.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-border">
              <div className="grid grid-cols-3 border-b border-border bg-[#f7f5f0] px-5 py-3">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Criterion
                </span>
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground text-center">
                  India
                </span>
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground text-right">
                  {country.name}
                </span>
              </div>
              {page.indiaComparison.map((row, i) => (
                <div
                  key={row.criterion}
                  className={`grid grid-cols-3 items-start px-5 py-4 ${i > 0 ? "border-t border-border/60" : ""}`}
                >
                  <span className="text-sm font-medium text-foreground">{row.criterion}</span>
                  <span className="text-center text-sm text-muted-foreground">{row.india}</span>
                  <span className="text-right text-sm text-muted-foreground">{row.abroad}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Eligibility Criteria ─────────────────────────────────────────── */}
      {page.eligibility ? (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Eligibility criteria for Indian students
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              {page.eligibility.intro}
            </p>
            <div className="mt-8 space-y-3">
              {page.eligibility.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Admission Process ────────────────────────────────────────────── */}
      {page.admissionSteps?.length ? (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Admission process
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              A step-by-step overview of how Indian students apply for {page.title}.
            </p>
            <div className="mt-8 space-y-3">
              {page.admissionSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-7 text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Documents Required ───────────────────────────────────────────── */}
      {page.documentsRequired ? (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Documents required
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                  Educational documents
                </p>
                <ul className="space-y-3">
                  {page.documentsRequired.educational.map((doc) => (
                    <li key={doc} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-sm leading-6 text-muted-foreground">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                  Visa documents
                </p>
                <ul className="space-y-3">
                  {page.documentsRequired.visa.map((doc) => (
                    <li key={doc} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-sm leading-6 text-muted-foreground">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Syllabus Overview ────────────────────────────────────────────── */}
      {page.syllabusPhases?.length ? (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Syllabus overview
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              How the {page.title} curriculum is structured across the program.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {page.syllabusPhases.map((phase) => (
                <div
                  key={phase.phase}
                  className="rounded-2xl border border-border bg-[#faf8f4] p-5"
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {phase.years}
                  </p>
                  <h3 className="mt-2 font-display text-base font-semibold text-heading">
                    {phase.phase}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {phase.highlights.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        <span className="text-xs leading-5 text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Hostel & Accommodation ───────────────────────────────────────── */}
      {page.hostelInfo ? (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Hostel &amp; accommodation
            </h2>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground">
              {page.hostelInfo}
            </p>
          </div>
        </section>
      ) : null}

      {/* ── Scholarships ─────────────────────────────────────────────────── */}
      {page.scholarshipInfo ? (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Scholarships &amp; financial support
            </h2>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground">
              {page.scholarshipInfo}
            </p>
          </div>
        </section>
      ) : null}

      {/* ── Career Opportunities ─────────────────────────────────────────── */}
      {page.careerOpportunities?.length ? (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Career opportunities after {page.title}
            </h2>
            <ul className="mt-8 space-y-3">
              {page.careerOpportunities.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm leading-7 text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {page.faq.length > 0 && (
        <section className="border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <div className="mb-10">
              <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Common questions about {page.title}
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {page.faq.map((item) => (
                <Card key={item.question} className="rounded-2xl border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold leading-snug text-heading">
                      {item.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="container-shell">
          <div className="overflow-hidden rounded-2xl bg-primary">
            <div className="px-8 py-12 md:px-14 md:py-16 lg:flex lg:items-center lg:justify-between lg:gap-12">
              <div className="lg:max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  Free counselling
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-heading-contrast md:text-4xl">
                  Go beyond the information — hear from real students.
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  Read reviews, watch video testimonials, and connect with
                  Indian students already enrolled at these universities. When
                  you are ready to apply, our counsellors will handle everything
                  — shortlisting, applications, documents, and visa — for free.
                </p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Read reviews and watch videos from current students",
                    "Connect with enrolled peers to ask real questions",
                    "Shortlist guidance based on your NEET score and budget",
                    "Support with applications, documents, and visa",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                      <CheckCircle2 className="size-4 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 shrink-0 space-y-3 lg:mt-0 lg:w-80">
                <Button asChild size="lg" variant="accent" className="w-full">
                  <Link href="/contact">Get free counselling</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full border-white/20 bg-white/8 text-white hover:bg-white/18 hover:text-white">
                  <Link href={`/universities?country=${country.slug}&course=${course.slug}`}>
                    See all universities
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
