import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Home,
  IdCard,
  Phone,
  Plane,
  ShieldPlus,
} from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CountryFlag } from "@/components/site/country-flag";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { RegulatoryAdvisoryPanel } from "@/components/site/regulatory-advisory-panel";
import { TrackedContactLink } from "@/components/site/tracked-contact-link";
import { UniversityCard } from "@/components/site/university-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  catalogReviewedAt,
  formatContentDate,
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
import { getCountryRegulatoryAdvisory } from "@/lib/data/regulatory-advisories";
import {
  getCountryHref,
} from "@/lib/routes";

export async function generateStaticParams() {
  const slugs = await getLandingPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

async function getLandingPageRouteData(slug: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("catalog");

  const page = await getLandingPageBySlug(slug);

  if (!page) {
    return {
      page: null,
      context: null,
    };
  }

  const context = await getLandingPageContext(page);

  return {
    page,
    context,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { page, context } = await getLandingPageRouteData(slug);

  if (!page) return { title: "Page Not Found" };
  const keywords = [
    page.title,
    context.country && context.course
      ? `${context.course.shortName} in ${context.country.name}`
      : `${page.courseSlug} in ${page.countrySlug}`,
    context.country ? `study in ${context.country.name}` : undefined,
    context.course ? `${context.course.shortName} abroad` : undefined,
    context.country && context.course
      ? `${context.course.shortName} in ${context.country.name} for Indian students`
      : undefined,
    context.country && context.course
      ? `${context.course.shortName} fees in ${context.country.name}`
      : undefined,
    context.country && context.course
      ? `${context.course.shortName} eligibility in ${context.country.name}`
      : undefined,
    context.country && context.course
      ? `top colleges for ${context.course.shortName} in ${context.country.name}`
      : undefined,
    context.country && context.course
      ? `${context.course.shortName} admission in ${context.country.name}`
      : undefined,
    context.country && context.course
      ? `NMC recognition ${context.course.shortName} in ${context.country.name}`
      : undefined,
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
  const { page, context } = await getLandingPageRouteData(slug);

  if (!page) notFound();

  if (!context.country || !context.course) notFound();

  const country = context.country;
  const course = context.course;
  const countryAdvisory = getCountryRegulatoryAdvisory(country.slug);
  const path = `/${page.slug}`;
  const previewPrograms = context.featuredPrograms;
  const feeStructures = getFeeStructuresForSlugs(page.featuredUniversitySlugs);
  const heroQuickFacts = page.atAGlance?.slice(0, 4) ?? [];
  const pageSearchTopics = [
    previewPrograms.length
      ? { href: "#universities", label: `Top colleges in ${country.name}` }
      : null,
    heroQuickFacts.length || feeStructures.length
      ? { href: heroQuickFacts.length ? "#quick-facts" : "#fees", label: `${page.title} fees` }
      : null,
    page.eligibility ? { href: "#eligibility", label: "Eligibility" } : null,
    page.admissionSteps?.length ? { href: "#admission", label: "Admission process" } : null,
    page.hostelInfo || page.livingCostBreakdown?.length
      ? { href: page.hostelInfo ? "#hostel" : "#living-cost", label: "Hostel & living cost" }
      : null,
    page.faq.length ? { href: "#faq", label: "FAQ" } : null,
  ].filter(Boolean) as { href: string; label: string }[];
  const relatedSearchLinks = [
    {
      href: getCountryHref(country.slug),
      title: `Study in ${country.name}`,
      description: `Country guide, visa basics, student life, safety, and practical planning for Indian students.`,
    },
    {
      href: `/universities?country=${country.slug}&course=${course.slug}`,
      title: `${course.shortName} colleges in ${country.name}`,
      description: `See the full college list, fees, city filters, and college details before you apply.`,
    },
    {
      href: "/budget",
      title: `${course.shortName} fees and budget planning`,
      description: "Compare fee bands, total budget, and affordability before choosing colleges.",
    },
    {
      href: "/compare",
      title: `Compare ${course.shortName} options`,
      description: `Compare countries and colleges before choosing the right ${course.shortName} pathway.`,
    },
  ];
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
  const serviceSupportSection = (
    <section className="deferred-render border-b border-border bg-primary py-14 md:py-20">
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Students Traffic
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-heading-contrast md:text-4xl">
              We guide, place, and support you into the right university.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
              Once we understand your budget, NEET status, and university fit,
              we guide you through admission, visa, and departure support from
              start to finish.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Plane className="size-5 text-white/80" />,
                  label: "Flight ticket",
                  desc: `We book your travel to ${country.name}`,
                },
                { icon: <IdCard className="size-5 text-white/80" />, label: "Student visa", desc: "Full visa application handled by us" },
                { icon: <ShieldPlus className="size-5 text-white/80" />, label: "Health insurance", desc: "Arranged before you depart" },
                { icon: <CheckCircle2 className="size-5 text-white/80" />, label: "Document support", desc: "Apostille and ministry authentication handled" },
                { icon: <GraduationCap className="size-5 text-white/80" />, label: "University application", desc: "Submitted directly on your behalf" },
                { icon: <Home className="size-5 text-white/80" />, label: "Hostel booking", desc: "Accommodation sorted before arrival" },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 rounded-xl border border-white/10 bg-white/8 px-4 py-4">
                  <span className="mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-0.5 text-xs leading-5 text-white/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0 lg:text-right">
            <div className="inline-flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-10 py-8 text-center">
              <span className="font-display text-5xl font-bold text-white">3,000+</span>
              <span className="mt-2 text-sm text-white/60">students guided abroad</span>
              <div className="mt-5 border-t border-white/15 pt-5">
                <CounsellingDialog
                  triggerContent={<>Start your application <ArrowRight className="size-4" /></>}
                  triggerSize="lg"
                  triggerClassName="bg-accent text-white hover:bg-accent-strong"
                  title="Start your application"
                  description="We handle everything from application to landing — visa, flight, health insurance, document legalisation, and hostel. Share your details and we'll be in touch within 24 hours."
                  submitLabel="Start my application"
                  ctaVariant="landing_service_cta"
                  countrySlug={country.slug}
                  courseSlug={course.slug}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

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

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/55">
                <span>
                  Updated{" "}
                  <span className="font-medium text-white/72">
                    {formatContentDate(catalogReviewedAt)}
                  </span>
                </span>
                <span className="hidden text-white/25 sm:inline">•</span>
                <span>Made for Indian students and parents</span>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <CounsellingDialog
                  triggerContent={<>Get admission guidance <ArrowRight className="size-4" /></>}
                  triggerSize="lg"
                  triggerClassName="bg-accent text-white shadow-cta hover:bg-accent-strong hover:shadow-cta-hover"
                  title={`Get admitted — ${page.title}`}
                  description={`Leave your number and our counsellors will call you. We help with applications, documents, and the next admission steps for students and parents.`}
                  submitLabel="Request a free counselling call"
                  ctaVariant="landing_hero_cta"
                  countrySlug={country.slug}
                  courseSlug={course.slug}
                />
                <Button
                  asChild
                  size="lg"
                  className="bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25"
                >
                  <TrackedContactLink
                    channel="call"
                    location="landing_page_hero_call"
                    href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  >
                    <Phone className="size-4" />
                    Call us
                  </TrackedContactLink>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-whatsapp/20 text-white ring-1 ring-whatsapp/50 hover:bg-whatsapp/35"
                >
                  <TrackedContactLink
                    channel="whatsapp"
                    location="landing_page_hero_whatsapp"
                    href={`https://wa.me/${siteConfig.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </TrackedContactLink>
                </Button>
              </div>

              {pageSearchTopics.length ? (
                <div className="mt-8 max-w-2xl">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/50">
                    Most searched on this page
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {pageSearchTopics.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-sm text-white/82 transition-colors hover:border-white/25 hover:bg-white/12 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* ── Right: standard lead form ── */}
            <div className="hidden lg:block lg:justify-self-end">
              <DeferredLeadForm
                sourcePath={path}
                ctaVariant="landing_sidebar"
                title={`Get guidance on ${page.title}`}
                description="Share your details and our counsellors will guide you toward the right college options and the next admission steps."
                countrySlug={country.slug}
                courseSlug={course.slug}
              />
            </div>
          </div>
        </div>
      </section>

      {heroQuickFacts.length ? (
        <section id="quick-facts" className="border-b border-border bg-[#f7f4ed] py-10 md:py-12">
          <div className="container-shell">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Quick facts
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-heading sm:text-3xl">
                    Key details before you apply
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                  Updated {formatContentDate(catalogReviewedAt)}. Use these numbers
                  to understand fees, eligibility, hostel, and admission support
                  before you speak with our team.
                </p>
              </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {heroQuickFacts.map((row) => (
                <div
                  key={row.label}
                  className="rounded-2xl border border-border bg-white px-5 py-4"
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

      {countryAdvisory ? (
        <section className="border-b border-border bg-[#fff8f2] py-10 md:py-12">
          <div className="container-shell">
            <RegulatoryAdvisoryPanel advisory={countryAdvisory} />
          </div>
        </section>
      ) : null}

      {/* ── Universities ─────────────────────────────────────────────────── */}
        <section id="universities" className="deferred-render border-b border-border py-14 md:py-20">
        <div className="container-shell">
          <div className="mb-10">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Top colleges for {page.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              Compare college options, fee levels, and city choices before you
              decide where to apply.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {previewPrograms.map((program, index) => (
              <UniversityCard
                key={program.offering.slug}
                program={program}
                imagePriority={index < 2}
              />
            ))}
          </div>


        </div>
      </section>

      {/* ── Fee Structures ───────────────────────────────────────────────── */}
      {feeStructures.length > 0 && (
        <section id="fees" className="deferred-render border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {page.title} fees in 2026
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Verified fee breakdowns for colleges that have shared their 2026
              structure. Amounts are in USD unless stated otherwise, so families
              can compare tuition, hostel, and one-time charges clearly.
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
      <section className="deferred-render border-b border-border py-14 md:py-20">
        <div className="container-shell">
          <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Why Indian students choose {page.title}
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
        <section className="deferred-render border-b border-border py-14 md:py-20">
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
        <section className="deferred-render border-b border-border py-14 md:py-20">
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

      {/* ── NEET Notice ──────────────────────────────────────────────────── */}
      <section className="deferred-render border-b border-border bg-amber-50 py-10 md:py-12">
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
                    Some foreign universities may not ask for NEET UG during
                    admissions, but that does not override Indian eligibility
                    rules for future screening or licensing.
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

      {/* ── Eligibility Criteria ─────────────────────────────────────────── */}
      {page.eligibility ? (
        <section id="eligibility" className="deferred-render border-b border-border py-14 md:py-20">
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
        <section id="admission" className="deferred-render border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {page.title} admission process
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
        <section className="deferred-render border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Documents required for {page.title}
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
        <section className="deferred-render border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {page.title} syllabus overview
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
      {/* ── Intake Timeline ──────────────────────────────────────────────── */}
      {page.intakeTimeline?.length ? (
        <section id="timeline" className="deferred-render border-b border-border bg-[#faf8f4] py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {page.title} application and intake timeline
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              A month-by-month guide on when to apply and prepare for {country.name}.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {page.intakeTimeline.map((item, i) => (
                <div key={item.milestone} className="relative rounded-2xl border border-border bg-white px-5 py-5 pb-6">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary mb-3">
                    {i + 1}
                  </span>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
                    {item.timeline}
                  </p>
                  <h3 className="mt-2 font-display text-base font-semibold text-heading">
                    {item.milestone}
                  </h3>
                  {item.details && (
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {item.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Itemized Living Costs ────────────────────────────────────────── */}
      {page.livingCostBreakdown?.length ? (
        <section id="living-cost" className="deferred-render border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {page.title} living cost per month
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              An itemized breakdown of typical student expenses.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-border max-w-3xl">
              <div className="grid grid-cols-2 border-b border-border bg-[#f7f5f0] px-5 py-3">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Expense Category
                </span>
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground text-right">
                  Estimated Cost (USD)
                </span>
              </div>
              {page.livingCostBreakdown.map((row, i) => (
                <div
                  key={row.item}
                  className={`grid grid-cols-2 items-center px-5 py-4 ${i > 0 ? "border-t border-border/60" : ""}`}
                >
                  <span className="text-sm font-medium text-foreground">{row.item}</span>
                  <span className="text-right text-sm text-muted-foreground">{row.cost}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Challenges & Reality Check ───────────────────────────────────── */}
      {page.challenges?.length ? (
        <section className="deferred-render border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <div className="mb-8">
              <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl text-red-900">
                Challenges & reality check
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                We believe in full transparency. Here are the genuine challenges students face and how to navigate them.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {page.challenges.map((challenge, index) => (
                <div key={index} className="flex gap-4 rounded-2xl border border-red-200 bg-[#fdfaf8] px-6 py-6 ring-1 ring-inset ring-red-100">
                  <AlertTriangle className="mt-1 size-5 shrink-0 text-red-600" />
                  <div>
                    <h3 className="font-display text-base font-semibold text-red-950">
                      {challenge.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-red-900/80">
                      {challenge.realityCheck}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}


      {/* ── Hostel & Accommodation ───────────────────────────────────────── */}
      {page.hostelInfo ? (
        <section id="hostel" className="deferred-render border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {page.title} hostel and accommodation
            </h2>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground">
              {page.hostelInfo}
            </p>
          </div>
        </section>
      ) : null}

      {/* ── Scholarships ─────────────────────────────────────────────────── */}
      {page.scholarshipInfo ? (
        <section className="deferred-render border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Scholarships and financial support for {page.title}
            </h2>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground">
              {page.scholarshipInfo}
            </p>
          </div>
        </section>
      ) : null}

      {/* ── Career Opportunities ─────────────────────────────────────────── */}
      {page.careerOpportunities?.length ? (
        <section className="deferred-render border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Career after {page.title}
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

      <section className="deferred-render border-b border-border bg-[#faf8f4] py-14 md:py-20">
        <div className="container-shell">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Students also search for
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
              Related pages to check before applying
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              These pages help students move from a country-level search into
              actual college comparison, fee planning, and next-step decisions.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedSearchLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-border bg-white px-5 py-5 transition-colors hover:border-primary/30 hover:bg-primary/[0.03]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-heading">
                    {item.title}
                  </h3>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {serviceSupportSection}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {page.faq.length > 0 && (
        <section id="faq" className="deferred-render border-b border-border py-14 md:py-20">
          <div className="container-shell">
            <div className="mb-10">
              <h2 className="font-display text-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Common questions about {page.title}
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full divide-y divide-border">
              {page.faq.map((item, i) => (
                <AccordionItem key={item.question} value={`faq-${i}`} className="border-none">
                  <AccordionTrigger className="py-4 text-left text-sm font-semibold leading-snug text-heading hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="deferred-render py-14 md:py-20">
        <div className="container-shell">
          <div className="overflow-hidden rounded-2xl bg-primary">
            <div className="px-8 py-12 md:px-14 md:py-16 lg:flex lg:items-center lg:justify-between lg:gap-12">
              <div className="lg:max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  Admission support
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-heading-contrast md:text-4xl">
                  Ready to apply? We handle everything, free of charge.
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  3,000+ students have already trusted us with their overseas
                  medical applications. Our team manages the full process, so
                  you do not need to visit an office until it is time to board
                  your flight.
                </p>
                <ul className="mt-6 space-y-2">
                  {[
                    "University application submitted on your behalf",
                    "Student visa, flight ticket & health insurance arranged",
                    "Document legalisation & ministry authentication handled",
                    "Hostel booked before you arrive",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                      <CheckCircle2 className="size-4 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 shrink-0 space-y-3 lg:mt-0 lg:w-80">
                <CounsellingDialog
                  triggerContent="Start my application"
                  triggerVariant="accent"
                  triggerSize="lg"
                  triggerClassName="w-full"
                  title="Start your application"
                  description={`Leave your number and we will call you within one business day. We help with application, documents, visa, and departure planning for students and parents.`}
                  submitLabel="Yes, call me"
                  ctaVariant="landing_bottom_cta"
                  countrySlug={country.slug}
                  courseSlug={course.slug}
                />
                <Button asChild size="lg" variant="outline" className="w-full border-white/20 bg-white/8 text-white hover:bg-white/18 hover:text-white">
                  <Link href={`/universities?country=${country.slug}&course=${course.slug}`}>
                    See all colleges
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
