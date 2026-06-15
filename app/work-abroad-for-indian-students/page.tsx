import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Globe2,
  GraduationCap,
  HeartPulse,
  MapPin,
  Plane,
  TrendingUp,
  Users,
} from "lucide-react";

import { CounsellingCtaButton } from "@/components/site/counselling-cta-button";
import { CountryFlag } from "@/components/site/country-flag";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { JsonLd } from "@/components/shared/json-ld";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";

const pagePath = "/work-abroad-for-indian-students";

export const metadata: Metadata = buildIndexableMetadata({
  title:
    "Work Abroad for Indian Students | Global Career Pathways, Salaries & How to Apply",
  description:
    "Explore genuine work-abroad pathways for Indian students — Germany nursing, Japan caregiving, Canada PR, Gulf opportunities, and more. Understand salaries, eligibility, and the step-by-step process before you apply.",
  path: pagePath,
  openGraphType: "website",
  keywords: [
    "work abroad for indian students",
    "work abroad after graduation india",
    "jobs abroad for indians",
    "overseas jobs for indian students",
    "germany nursing jobs for indian nurses",
    "canada pr pathway for indian students",
    "work in japan for indians",
    "global career opportunities for indian graduates",
  ],
});

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const heroDestinationTiles = [
  {
    name: "Germany",
    flagCode: "de",
    highlight: "Nursing · Ausbildung",
    gradient: "from-[#1a2d4a]/80 to-[#0d1f35]/60",
  },
  {
    name: "Canada",
    flagCode: "ca",
    highlight: "Nursing · PR pathway",
    gradient: "from-[#7c1a1a]/80 to-[#3d0a0a]/60",
  },
  {
    name: "Japan",
    flagCode: "jp",
    highlight: "Caregiving · SSW",
    gradient: "from-[#5c1a1a]/80 to-[#1a1a2d]/60",
  },
  {
    name: "UAE & Gulf",
    flagCode: "ae",
    highlight: "Healthcare · Engineering",
    gradient: "from-[#1a3a2a]/80 to-[#0d2a1a]/60",
  },
] as const;

const programs = [
  {
    country: "Germany",
    flagCode: "de",
    programName: "Registered Nursing (Gesundheits- und Krankenpflege)",
    jobsAvailable: "40,000+ open roles",
    salaryRange: "€2,800 – €3,500 / month",
    keyRequirement: "BSc Nursing + German B1/B2",
    visaType: "Skilled Worker Visa (§18a AufenthG)",
    prEligible: true,
    href: "/germany-nursing-career-pathway",
    ctaLabel: "Germany Nursing guide",
    description:
      "Germany has a structural nursing shortage. Indian nurses with a BSc and German language clearance can enter a recognition process that leads to full licensure, permanent residency, and eventual citizenship. The salary is significantly above India's hospital pay, and federal support for relocation is available.",
    accentColor: "bg-[#1a2d4a]",
    tagColor: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    country: "Germany",
    flagCode: "de",
    programName: "Ausbildung (Vocational Training)",
    jobsAvailable: "15,000+ training posts",
    salaryRange: "€1,100 – €1,300 / month",
    keyRequirement: "Class 12 + German B1 + any degree",
    visaType: "Training Visa (§16a AufenthG)",
    prEligible: true,
    href: null,
    ctaLabel: null,
    description:
      "Ausbildung is a dual vocational training route — you study and earn simultaneously. No German degree or prior work experience is required. Programs in mechatronics, nursing assistance, hospitality, and IT are open to Indian graduates. Completion leads to a qualified worker status with a path to permanent residency.",
    accentColor: "bg-[#1a2d4a]",
    tagColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  {
    country: "Canada",
    flagCode: "ca",
    programName: "Nursing + Permanent Residency Pathway",
    jobsAvailable: "30,000+ nursing vacancies",
    salaryRange: "CAD $5,500 – $7,500 / month",
    keyRequirement: "BSc Nursing + NCLEX-RN + IELTS 7.0",
    visaType: "Express Entry / Provincial Nominee",
    prEligible: true,
    href: "/canada-nursing-pr-pathway",
    ctaLabel: "Canada Nursing PR guide",
    description:
      "Canada actively recruits internationally trained nurses under Express Entry and multiple Provincial Nominee Programs. Indian nurses with NCLEX-RN clearance and a strong IELTS score can build a clear path to Canadian permanent residency within two to three years of starting work.",
    accentColor: "bg-[#7c1a1a]",
    tagColor: "bg-red-100 text-red-800 border-red-200",
  },
  {
    country: "Japan",
    flagCode: "jp",
    programName: "Specified Skilled Worker — Caregiving",
    jobsAvailable: "5,000+ annual intake",
    salaryRange: "¥220,000 – ¥280,000 / month",
    keyRequirement: "JLPT N4 + Caregiving Skill Test",
    visaType: "Specified Skilled Worker (SSW-1)",
    prEligible: true,
    href: null,
    ctaLabel: null,
    description:
      "Japan's SSW program was introduced to address a national care workforce shortage. Indian applicants need Japanese language certification at N4 level and a passing score on the Caregiving Skills Evaluation Test. SSW-1 status is renewable; SSW-2 (available in some sectors) leads toward permanent residency.",
    accentColor: "bg-[#5c1a1a]",
    tagColor: "bg-rose-100 text-rose-800 border-rose-200",
  },
  {
    country: "UAE",
    flagCode: "ae",
    programName: "Healthcare & Engineering Professionals",
    jobsAvailable: "Large ongoing demand",
    salaryRange: "AED 8,000 – 20,000 / month",
    keyRequirement: "Degree + DHA / MOH / HAAD licence (health)",
    visaType: "Employment Residence Visa",
    prEligible: false,
    href: null,
    ctaLabel: null,
    description:
      "The UAE has no income tax and a large Indian professional community across healthcare, engineering, finance, and hospitality. Healthcare professionals need regulatory clearance from DHA (Dubai), HAAD (Abu Dhabi), or MOH. Engineers and finance professionals enter on employer-sponsored visas. No PR route exists, but the tax-free salary is a major draw.",
    accentColor: "bg-[#1a3a2a]",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
] as const;

const journeySteps = [
  {
    phase: "Prepare",
    icon: GraduationCap,
    title: "Qualify and document your credentials",
    body: "This phase is about making your Indian qualifications readable abroad. Depending on the country, that means getting transcripts attested, clearing a language test (German B1, IELTS, JLPT), and where required, passing a licensure exam like the NCLEX-RN. We help you understand which steps apply to your specific profile and target country — before you start spending money on the wrong preparation.",
  },
  {
    phase: "Apply",
    icon: Briefcase,
    title: "Find the right role and get the offer letter",
    body: "A job offer from a recognised employer is the foundation of your work visa application. For Germany, the process also involves credential recognition by the relevant state authority (Bezirksregierung). We help identify employers open to internationally trained professionals and guide the application sequence so you're not submitting blindly.",
  },
  {
    phase: "Land",
    icon: Plane,
    title: "Secure your visa and relocate",
    body: "Work visa applications for skilled routes involve financial proof, health insurance, the offer letter, and attested documents. For some countries like Germany and Canada, the process also requires biometrics and an appointment at the embassy or VFS. Timeline from offer to arrival typically runs 3–6 months depending on the country and document readiness.",
  },
  {
    phase: "Grow",
    icon: TrendingUp,
    title: "Build your career and plan your residency",
    body: "Once established, most skilled work routes allow dependant visas for family, salary progression, and after a qualifying period, permanent residency or settlement applications. Germany offers PR after five years of contributions; Canada after two to three years on an Express Entry pathway. Understanding the residency clock from day one changes how you plan your early years.",
  },
] as const;

const profileTypes = [
  {
    num: "01",
    title: "BSc Nursing graduates",
    Icon: HeartPulse,
    description:
      "Germany and Canada have active recruitment pipelines for Indian nurses. A BSc from an NMC-recognised college, a language clearance (B1 German or IELTS 7.0 for Canada), and the right licensure test are the entry conditions. Both countries offer permanent residency timelines. This is the most structured opportunity currently available for Indian healthcare graduates.",
  },
  {
    num: "02",
    title: "Engineering and technical graduates",
    Icon: TrendingUp,
    description:
      "Germany recognises Indian engineering degrees under equivalency frameworks. Graduates in mechanical, civil, electrical, and IT disciplines can apply for skilled worker visas and enter the job market directly. The UAE also absorbs large numbers of Indian engineers across construction, energy, and infrastructure projects.",
  },
  {
    num: "03",
    title: "Recent graduates open to vocational training",
    Icon: GraduationCap,
    description:
      "Germany's Ausbildung program is available to Indian graduates who are willing to complete a two- to three-year vocational qualification while earning a training salary. This path does not require a German degree. It leads to a qualified worker status and a route to permanent residency, with living costs partly covered during training.",
  },
  {
    num: "04",
    title: "Students planning ahead from Year 1",
    Icon: Globe2,
    description:
      "Students currently in nursing, engineering, or health programs can use the study years to start German or Japanese language preparation, understand the licensure requirements for their target country, and plan the financial and document readiness needed before graduation. Starting early collapses the gap between graduation and first foreign salary.",
  },
] as const;

const whyItMatters = [
  {
    label: "2–5× higher salary",
    description:
      "Nurses in Germany earn four to five times more than the median hospital salary in Indian metros, even accounting for cost of living. Engineers in the UAE earn tax-free.",
    Icon: TrendingUp,
  },
  {
    label: "Permanent residency pathways",
    description:
      "Germany, Canada, and Japan all have structured routes from skilled employment to permanent residency. This is not just a job — it's a life-building decision.",
    Icon: MapPin,
  },
  {
    label: "Active employer demand",
    description:
      "Germany, Japan, and Canada have structural workforce shortages, not cyclical ones. The jobs exist because the local population cannot fill them — this creates a durable window for qualified Indians.",
    Icon: Briefcase,
  },
  {
    label: "Family and settlement support",
    description:
      "Most skilled worker routes allow dependant visas. Once the primary applicant is settled, spouses and children can join — and in Germany, dependants can work and study freely.",
    Icon: Users,
  },
] as const;

const faqs = [
  {
    question: "Which country offers the best work-abroad opportunity for Indian nurses?",
    answer:
      "Germany and Canada are currently the most accessible and structured options. Germany has the largest volume of open nursing roles and a clear recognition process for Indian BSc qualifications. Canada has multiple provincial pathways and Express Entry routes that lead to permanent residency. Japan's caregiving pathway is also open but requires Japanese language at N4 level, which adds preparation time. The best option depends on your language readiness, salary expectations, and how quickly you want to move.",
  },
  {
    question: "Do I need a job offer before applying for a work visa?",
    answer:
      "For Germany, yes — a binding job offer from a German employer is required for the Skilled Worker Visa (§18a/18b AufenthG). For Canada's Express Entry, a job offer increases your CRS score but is not mandatory; PR can be achieved without one in some streams. Japan's SSW requires passing skills and language tests first, then finding an employer. We help connect qualified applicants with employers who recruit internationally trained professionals.",
  },
  {
    question: "How long does the entire process take from India to first day at work?",
    answer:
      "Realistically, plan for 9 to 18 months from the decision to move to your first working day abroad. Language preparation alone takes 6–12 months for German B2. Credential recognition in Germany can run 3–6 months. Canadian NCLEX-RN registration adds 3–4 months after IELTS. Visa processing runs 2–3 months in most cases. Starting early — ideally while still studying — significantly compresses this timeline.",
  },
  {
    question: "Can Indian nursing degree holders practise abroad without re-qualifying?",
    answer:
      "Not automatically. Each country has its own recognition process. Germany requires a formal equivalency assessment (Gleichwertigkeitsprüfung) by the relevant state authority, which may require an adaptation course or compensatory measures. Canada requires NCLEX-RN licensure. UAE requires registration with DHA, HAAD, or MOH. Recognition is achievable in most cases for BSc graduates from recognised Indian colleges, but it is a process that needs to be started early.",
  },
  {
    question: "What is Germany Ausbildung and is it relevant for Indian graduates?",
    answer:
      "Ausbildung is Germany's dual vocational training system — you spend three days a week working with an employer and two days in vocational school, while earning a monthly training stipend of roughly €1,100–1,300. It is open to Indian graduates who hold German language proficiency at B1 level. Sectors include nursing assistance, mechatronics, IT, and hospitality. After completion, you receive a German vocational qualification and can transition to a skilled worker visa. It is a structured route for graduates who want to enter Germany without an advanced degree equivalency.",
  },
  {
    question: "Is working abroad permanent, or is it possible to return to India later?",
    answer:
      "That is entirely your choice. Many Indian professionals build a career abroad for 5–10 years, gain permanent residency, save aggressively, and then return — or settle permanently. Nothing about working abroad locks you into staying. The pathways are designed for people who want stable, long-term careers. If you later want to return, the skills, savings, and foreign work experience you build have significant value in the Indian market as well.",
  },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function WorkAbroadForIndianStudentsPage() {
  const structuredData = getStructuredDataGraph([
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Work Abroad for Indian Students", path: pagePath },
    ]),
    getCollectionPageStructuredData({
      path: pagePath,
      name: "Work abroad for Indian students — global career pathways",
      description:
        "Hub page covering work-abroad programs for Indian students: Germany nursing, Ausbildung, Canada PR, Japan caregiving, UAE, and more.",
    }),
    getFaqStructuredData(
      faqs.map((f) => ({ question: f.question, answer: f.answer })),
      pagePath
    ),
  ]);

  return (
    <>
      {/* ================================================================== */}
      {/* HERO                                                                 */}
      {/* ================================================================== */}
      <section className="relative overflow-hidden border-b border-border/60 bg-[linear-gradient(145deg,#f0f6ee_0%,#fbfaf8_48%,#eef4fb_100%)]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(15,61,55,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(233,123,59,0.08),transparent_30%)]" />

        <div className="container-shell relative grid items-center gap-10 py-14 md:py-18 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 lg:py-20">
          {/* Text */}
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Global Opportunities · India to World
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,5vw,4.2rem)] font-bold leading-[1.02] tracking-tight text-heading">
              Work abroad as an Indian — and build a career that lasts
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              Germany, Canada, Japan, and the Gulf have real, documented demand
              for Indian professionals. This page explains each pathway honestly
              — what you earn, what you need, how long it takes, and where it
              leads — so you can decide with a full picture rather than a
              consultant's shortlist.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CounsellingCtaButton
                label="Talk to a career advisor"
                title="Plan your work-abroad move"
                description="Leave your number and we will call you with guidance on which pathway fits your qualification, language readiness, and career goals."
                className="rounded-full bg-foreground px-5 py-3 font-semibold text-background transition hover:opacity-90"
                ctaVariant="work-abroad-hero"
              />
              <Link
                href="#programs"
                className="rounded-full border border-border bg-background/80 px-5 py-3 font-medium text-foreground transition hover:bg-background"
              >
                Explore programs
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              {["Germany · 40,000+ nursing roles", "Canada · PR in 2–3 years", "Japan · SSW open to Indians"].map(
                (signal) => (
                  <div key={signal} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {signal}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Destination tile mosaic */}
          <div className="grid grid-cols-2 gap-3">
            {heroDestinationTiles.map((tile) => (
              <div
                key={tile.name}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 shadow-sm"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tile.gradient}`}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <div className="flex items-center gap-1.5">
                    <CountryFlag
                      countryCode={tile.flagCode}
                      alt={`${tile.name} flag`}
                      width={20}
                      height={14}
                      className="rounded-sm"
                    />
                    <span className="text-xs font-semibold text-white/90">
                      {tile.name}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-white/60">
                    {tile.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* WHY IT MATTERS — four benefit strips                                */}
      {/* ================================================================== */}
      <section className="bg-[#f7f6f3] py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Why This Matters
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-heading">
              What working abroad actually means for Indian professionals
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              This isn't about a short stint abroad. The countries below have
              structural shortages that create genuine long-term pathways —
              not just temporary postings.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {whyItMatters.map(({ label, description, Icon }) => (
              <div
                key={label}
                className="flex gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <Icon className="size-5 text-accent" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-heading">
                    {label}
                  </p>
                  <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PROGRAMS — detailed program cards                                    */}
      {/* ================================================================== */}
      <section id="programs" className="section-space border-t border-border/50 scroll-mt-6">
        <div className="container-shell">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Open Programs
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-heading">
              Global work pathways for Indian students and graduates
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              Each program below is a genuine, documented route — not a
              consultant package. Salary ranges, job counts, and requirements
              are based on publicly available government and employer data.
            </p>
          </div>

          <div className="space-y-5">
            {programs.map((program) => (
              <div
                key={`${program.country}-${program.programName}`}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                {/* Card header */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <CountryFlag
                      countryCode={program.flagCode}
                      alt={`${program.country} flag`}
                      width={32}
                      height={22}
                      className="rounded-sm shadow-sm"
                    />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        {program.country}
                      </p>
                      <h3 className="font-display text-lg font-bold text-heading">
                        {program.programName}
                      </h3>
                    </div>
                  </div>
                  {program.prEligible && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      PR eligible
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-0 divide-x divide-border/60 border-b border-border/60 md:grid-cols-4">
                  {[
                    { label: "Open roles", value: program.jobsAvailable },
                    { label: "Monthly salary", value: program.salaryRange },
                    { label: "Key requirement", value: program.keyRequirement },
                    { label: "Visa type", value: program.visaType },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-heading">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Description + CTA */}
                <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-end sm:p-6">
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                    {program.description}
                  </p>
                  {program.href ? (
                    <Link
                      href={program.href}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2 text-sm font-semibold text-heading transition hover:bg-muted"
                    >
                      {program.ctaLabel}
                      <ArrowRight className="size-4" />
                    </Link>
                  ) : (
                    <CounsellingCtaButton
                      label="Get program details"
                      title={`Learn more about ${program.programName}`}
                      description={`Our advisors can walk you through the requirements, timeline, and application process for ${program.country} — including employers who recruit Indian professionals.`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2 text-sm font-semibold text-heading transition hover:bg-muted"
                      ctaVariant="work-abroad-program"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* HOW IT WORKS — four-phase journey timeline                          */}
      {/* ================================================================== */}
      <section className="section-space border-t border-border/50 bg-[#f7f6f3]">
        <div className="container-shell max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            The Process
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-heading">
            How a work-abroad move actually unfolds
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Most failed attempts happen because people start at step three
            without completing step one. Here is the real sequence.
          </p>

          <div className="relative mt-12">
            {/* Vertical line */}
            <div className="absolute left-[18px] top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />

            <div className="space-y-0">
              {journeySteps.map((step, i) => (
                <div key={step.phase} className="relative flex gap-6 pb-10 last:pb-0">
                  {/* Node */}
                  <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-white text-sm font-bold text-accent shadow-sm">
                    {i + 1}
                  </div>
                  {/* Content */}
                  <div className="flex-1 rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <step.icon className="size-4 text-accent" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                        {step.phase}
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-heading">{step.title}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* WHO THIS IS FOR — profile list + sidebar CTA                        */}
      {/* ================================================================== */}
      <section className="section-space border-t border-border/50">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Profile list */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Who This Is For
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-heading">
                Four profiles — and what the right path looks like for each
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                The best work-abroad route depends on your degree, language
                readiness, timeline, and long-term goals. Not every program
                fits every profile.
              </p>

              <div className="mt-10 divide-y divide-border/70">
                {profileTypes.map(({ num, title, Icon, description }) => (
                  <div key={num} className="flex gap-5 py-6 first:pt-0 last:pb-0">
                    <span className="font-display text-[2.5rem] font-bold leading-none text-border">
                      {num}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-accent" />
                        <h3 className="font-display text-lg font-semibold text-heading">
                          {title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar cards */}
            <div className="flex flex-col gap-4 self-start lg:sticky lg:top-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Globe2 className="size-4 text-accent" />
                  <p className="text-sm font-semibold text-heading">
                    Not sure which path fits you?
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  We review your degree, language level, target country, and
                  timeline to identify the shortest viable route to a work visa.
                </p>
                <div className="mt-5">
                  <CounsellingCtaButton
                    label="Get a pathway assessment"
                    title="Work-abroad pathway assessment"
                    description="Leave your number and we will call you to match your profile to the right country, visa type, and first steps."
                    className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
                    ctaVariant="work-abroad-profile"
                  />
                </div>
              </div>

              {/* What we check */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <p className="text-sm font-semibold text-heading">
                  What we verify before recommending a pathway
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "Is your degree recognised in the target country?",
                    "What language level do you need — and how long to reach it?",
                    "Is employer sponsorship required or optional?",
                    "What is the realistic timeline from India to first salary?",
                    "Does the country offer permanent residency on this visa?",
                  ].map((item) => (
                    <div key={item} className="flex gap-2.5">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <p className="text-xs leading-6 text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ                                                                 */}
      {/* ================================================================== */}
      <section className="section-space border-t border-border/50 bg-[#f7f6f3]">
        <div className="container-shell max-w-4xl">
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Common questions
            </div>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-heading">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-border bg-card shadow-sm transition hover:border-accent/30"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-6 py-5">
                  <span className="font-display text-lg font-semibold text-heading transition group-hover:text-accent">
                    {item.question}
                  </span>
                  <ChevronDown className="mt-0.5 size-5 shrink-0 text-accent transition group-open:rotate-180" />
                </summary>
                <div className="border-t border-border/50 px-6 pb-5 pt-4">
                  <p className="text-base leading-relaxed text-muted-foreground">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* BOTTOM CTA — dark inverted section with lead form                   */}
      {/* ================================================================== */}
      <section className="bg-[#0b1a14] px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a87c]">
                Ready to plan your move?
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white lg:text-4xl">
                Get a work-abroad plan built around your actual profile
              </h2>
              <p className="mt-4 text-base leading-8 text-white/60">
                We help Indian students and graduates identify the right
                country, confirm their qualification is recognised, and build a
                step-by-step plan — language, credentials, employer, visa —
                without spending money on steps that don't apply to them.
              </p>

              {/* Country flags strip */}
              <div className="mt-8 flex items-center gap-3">
                <span className="text-xs font-medium text-white/40">We support</span>
                {(["de", "ca", "jp", "ae", "gb"] as const).map((code) => (
                  <CountryFlag
                    key={code}
                    countryCode={code}
                    alt={`${code} flag`}
                    width={28}
                    height={20}
                    className="rounded-sm opacity-80 shadow transition hover:opacity-100"
                  />
                ))}
                <span className="text-xs font-medium text-white/40">&amp; more</span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/germany-nursing-career-pathway"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#e8a87c] hover:underline"
                >
                  Germany Nursing guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/canada-nursing-pr-pathway"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#e8a87c] hover:underline"
                >
                  Canada Nursing PR guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <DeferredLeadForm
                sourcePath={pagePath}
                ctaVariant="work-abroad-bottom"
                title="Plan your work-abroad move"
                description="Share your details and our team will call you with guidance on the right pathway, credential steps, and what to prepare first."
                submitLabel="Request callback"
                notes="Interest: work abroad for Indian students"
                embedded
                stacked
              />
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
