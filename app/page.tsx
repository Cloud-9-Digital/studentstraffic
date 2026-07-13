import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  ShieldCheck,
  Globe,
  Search,
  FileCheck,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

import { JsonLd } from "@/components/shared/json-ld";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { HeroSearch } from "@/components/site/hero-search";
import { Button } from "@/components/ui/button";
import { getCountryCount } from "@/lib/data/catalog";
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
  title: "Study Abroad Consultants for Indian Students | Students Traffic",
  description:
    "Students Traffic is a one-stop study-abroad platform for Indian students — compare universities, fees, and eligibility across countries and programs, with free counselling and admissions support.",
  path: "/",
  keywords: [
    "study abroad for Indian students",
    "study abroad consultants India",
    "universities abroad for Indian students",
    "MBBS abroad for Indian students",
    "study abroad admissions guidance",
    "study abroad platform India",
    "universities in Russia Georgia Vietnam",
    "study abroad counselling India",
  ],
});

const startingPoints = [
  {
    Icon: Compass,
    title: "Browse Colleges",
    description: "Explore medical colleges in India and abroad. Compare fees, NMC recognition, intake dates, and admission requirements.",
    href: "/universities",
    cta: "View all colleges",
  },
  {
    Icon: Globe,
    title: "Countries We Serve",
    description: "We have offices in Russia, Georgia, Vietnam, Kyrgyzstan, and more. See complete country guides and support details.",
    href: "/countries",
    cta: "Explore countries",
  },
  {
    Icon: BookOpen,
    title: "Admission Guides",
    description: "Complete guides on NEET requirements, FMGE preparation, program eligibility, and total cost planning for medical education abroad.",
    href: "/guides",
    cta: "Read guides",
  },
] as const;

export default async function HomePage() {
  const countriesCount = await getCountryCount();
  const path = "/";
  const structuredDataItems = [
    getBreadcrumbStructuredData([{ name: "Home", path }]),
    getCollectionPageStructuredData({
      path,
      name: "Students Traffic Home",
      description:
        "Homepage for Students Traffic, helping Indian students evaluate universities, compare options, and get admissions guidance.",
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <>
      {/* Hero Section - Above the fold */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center bg-background">
        {/* Background Pattern — clipped separately so dropdown isn't cut off */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(15,61,55,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(15,61,55,0.06)_0%,transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%230f3d37\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>

        <div className="container-shell relative px-4 py-12 text-center md:px-6 md:py-16">
          <div className="mx-auto max-w-5xl space-y-6 md:space-y-8">
            {/* Main Heading */}
            <h1 className="font-display text-[2.75rem] font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-heading">Study abroad</span>
              <span className="mt-2 block italic text-accent">the right way</span>
            </h1>

            {/* Description */}
            <p className="mx-auto max-w-[30ch] text-base leading-relaxed text-muted-foreground sm:max-w-lg sm:text-lg md:text-xl">
              Free guidance for Indian students across countries, universities, and programs — college selection, admissions, and application support included.
            </p>

            {/* Search */}
            <div className="mx-auto max-w-2xl">
              <HeroSearch />
            </div>

            {/* CTA Buttons */}
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <CounsellingDialog
                triggerContent={
                  <>
                    Request free counselling
                    <ArrowRight className="size-4" />
                  </>
                }
                triggerSize="lg"
                triggerClassName="w-full sm:w-auto"
              />
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/universities">Browse colleges</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative overflow-hidden border-t border-border/40 bg-muted/30 py-12 md:py-16">
        {/* Diagonal lines pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%230f3d37\" fill-opacity=\"1\" fill-rule=\"evenodd\"%3E%3Cpath d=\"M0 40L40 0H20L0 20M40 40V20L20 40\"/%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="container-shell relative px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "3,000+", label: "Students Successfully Placed", icon: Users },
              { value: `${countriesCount}+`, label: "Countries with Our Offices", icon: Globe },
              { value: "6 Years", label: "Complete Student Support", icon: ShieldCheck },
              { value: "100%", label: "Free FMGE Coaching", icon: BookOpen },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="mx-auto mb-3 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary md:size-14">
                  <Icon className="size-6 md:size-7" />
                </div>
                <div className="font-display text-3xl font-bold tracking-tight text-heading md:text-4xl">
                  {value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground md:text-base">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground md:text-base">
            Every college listing includes verified fees, NMC recognition status, and honest reviews from real students — no hidden charges.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Decorative background elements */}
        <div className="absolute left-0 top-20 size-64 -translate-x-1/3 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-20 right-0 size-96 translate-x-1/3 rounded-full bg-primary/10 blur-3xl" />

        <div className="container-shell relative px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-heading md:text-4xl lg:text-5xl">
              Complete admission to graduation support
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              We&apos;re with you every step - from college selection to FMGE success
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:mt-16 md:gap-8 lg:grid-cols-2">
            {[
              {
                step: "01",
                icon: Search,
                title: "College Selection & Admission",
                description: "Expert counseling to choose the right college based on your NEET score, budget, and career goals. Complete admission process support.",
                image: "/images/home/explore-compare.jpg",
                imageAlt: "Student and parent comparing medical college options on a laptop",
              },
              {
                step: "02",
                icon: FileCheck,
                title: "Documentation & Visa",
                description: "We handle all paperwork, applications, document verification, and visa assistance. Our offices coordinate with universities directly.",
                image: "/images/home/expert-guidance.jpg",
                imageAlt: "Education counsellor speaking with a student and parent",
              },
              {
                step: "03",
                icon: Globe,
                title: "On-Ground Support Abroad",
                description: "Our staff in every country assists with airport pickup, accommodation, university registration, and local orientation.",
                image: "/images/home/apply-confidence.jpg",
                imageAlt: "Student preparing admission documents with counselling support",
              },
              {
                step: "04",
                icon: BookOpen,
                title: "6-Year Support & FMGE Coaching",
                description: "Free FMGE coaching, academic guidance, and student welfare support throughout your entire MBBS journey until graduation.",
                image: "/images/home/start-journey.jpg",
                imageAlt: "Students arriving at a modern university campus with luggage",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted/50">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 md:p-8">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">
                    Step {item.step}
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-heading md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="relative overflow-hidden border-y border-border/40 bg-muted/20 py-16 md:py-24">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%230f3d37\" fill-opacity=\"1\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"3\"/%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="container-shell relative px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-heading md:text-4xl lg:text-5xl">
              Start exploring
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Choose where you&apos;d like to begin your MBBS journey
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-3">
            {[
              {
                ...startingPoints[0],
                image: "/images/home/college-finder.jpg",
                imageAlt: "Student browsing medical college options on a laptop",
              },
              {
                ...startingPoints[1],
                image: "/images/home/country-options.jpg",
                imageAlt: "Family comparing study destinations with a counsellor",
              },
              {
                ...startingPoints[2],
                image: "/images/home/fees-eligibility-tools.jpg",
                imageAlt: "Student planning MBBS fees and eligibility with a calculator",
              },
            ].map(({ title, description, href, cta, image, imageAlt }) => (
              <Link
                key={title}
                href={href}
                className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/50">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-heading">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {description}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                    {cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Talk to Real Students - Feature Section */}
      <section className="relative overflow-hidden border-y border-border/40 bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        {/* Wavy pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"100\" height=\"20\" viewBox=\"0 0 100 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z\" fill=\"%230f3d37\" fill-opacity=\"1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E")' }} />

        <div className="container-shell relative px-4 md:px-6">
          {/* Heading - Always at top */}
          <div className="mb-8 md:mb-12">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#25d366]/10 px-4 py-2 text-xs font-semibold text-[#25d366] md:text-sm">
              <WhatsAppIcon className="size-4" />
              WhatsApp Connect
            </div>

            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-heading md:text-4xl lg:text-5xl">
              Talk to real students
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Connect directly with Indian students already studying at universities abroad. Get honest, unfiltered answers about campus life, fees, safety, and everything in between.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="mt-8 space-y-4">
                {[
                  {
                    title: "Direct WhatsApp Access",
                    description: "Chat with current students on WhatsApp - no middlemen, no sales pressure.",
                  },
                  {
                    title: "Honest Reviews",
                    description: "Ask about hostels, food, faculty, exams, and daily life from those living it.",
                  },
                  {
                    title: "Make Informed Decisions",
                    description: "Get the real picture before you commit to a university.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-heading">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button asChild size="lg" variant="default" className="w-full sm:w-auto">
                  <Link href="/students">
                    Browse Student Profiles
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 p-6 md:p-8 lg:aspect-auto lg:h-full">
              <div className="flex size-full items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-xs text-white md:px-4 md:py-3 md:text-sm">
                        How are the hostel facilities?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-xs text-foreground shadow-sm md:px-4 md:py-3 md:text-sm">
                        Pretty good! Clean rooms, wifi works well.
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-xs text-white md:px-4 md:py-3 md:text-sm">
                        What about safety?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-xs text-foreground shadow-sm md:px-4 md:py-3 md:text-sm">
                        Very safe. Campus security is 24/7.
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground md:text-sm">
                    <div className="size-2 animate-pulse rounded-full bg-[#25d366]" />
                    Real student conversations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,61,55,0.05)_0%,transparent_50%)]" />

        <div className="container-shell relative px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%230f3d37\" fill-opacity=\"1\"%3E%3Cpath d=\"M0 38V0h2v38H0zm6 0V0h2v38H6zm6 0V0h2v38h-2zm6 0V0h2v38h-2zm6 0V0h2v38h-2zm6 0V0h2v38h-2zm6 0V0h2v38h-2zM0 0h40v2H0V0zm0 6h40v2H0V6zm0 6h40v2H0v-2zm0 6h40v2H0v-2zm0 6h40v2H0v-2zm0 6h40v2H0v-2zm0 6h40v2H0v-2z\" fill-opacity=\"0.5\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

            {/* Heading - Always at top */}
            <div className="p-8 pb-0 md:p-12 md:pb-0 lg:hidden">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <Sparkles className="size-4" />
                Complete Admission Support
              </div>

              <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-heading md:text-4xl">
                Get started with your MBBS admission
              </h2>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                Share your NEET score and preferences. Our counsellors will guide you on college selection, complete the admission process, and support you for 6 years.
              </p>
            </div>

            <div className="grid lg:grid-cols-2">
              {/* Content - Desktop heading included */}
              <div className="order-2 flex flex-col justify-center p-8 pt-6 md:p-12 md:pt-8 lg:order-1 lg:p-16">
                {/* Desktop heading */}
                <div className="hidden lg:block">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
                    <Sparkles className="size-4" />
                    Complete Admission Support
                  </div>

                  <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-heading md:text-4xl lg:text-5xl">
                    Get started with your MBBS admission
                  </h2>

                  <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                    Share your NEET score and preferences. Our counsellors will guide you on college selection, complete the admission process, and support you for 6 years.
                  </p>
                </div>

                <div className="mt-6 space-y-3 lg:mt-8">
                  {[
                    { icon: CheckCircle2, text: "Free Counselling & Admission Support" },
                    { icon: BookOpen, text: "Free FMGE Coaching (Worth ₹2+ Lakhs)" },
                    { icon: Globe, text: "On-Ground Support in All Countries" },
                    { icon: ShieldCheck, text: "6-Year Student Welfare & Guidance" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <item.icon className="size-3" />
                      </div>
                      <p className="text-sm text-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10">
                  <CounsellingDialog
                    triggerContent={
                      <>
                        Start Your Journey
                        <ArrowRight className="size-5" />
                      </>
                    }
                    triggerSize="lg"
                    triggerClassName="w-full sm:w-auto"
                    ctaVariant="home_cta_footer"
                  />
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                    <Link href="/universities">View Colleges</Link>
                  </Button>
                </div>
              </div>

              {/* Image - Shows after heading on mobile, on right on desktop */}
              <div className="relative order-1 min-h-[280px] overflow-hidden bg-muted/50 md:min-h-[360px] lg:order-2 lg:min-h-[560px]">
                <Image
                  src="/images/home/ready-mbbs-journey.jpg"
                  alt="Student and parent receiving MBBS admission counselling"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
