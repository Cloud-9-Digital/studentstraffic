import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Globe2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
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

const pagePath = "/scholarships-for-indian-students-to-study-abroad";

export const metadata: Metadata = buildIndexableMetadata({
  title:
    "Scholarships for Indian Students to Study Abroad | What They Cover, Who Wins & How to Plan",
  description:
    "Understand what study-abroad scholarships actually cover for Indian students — full funding, partial support, and tuition waivers — with named examples, planning guidance, and country-specific guides.",
  path: pagePath,
  openGraphType: "website",
  keywords: [
    "scholarships for indian students to study abroad",
    "study abroad scholarship for indian students",
    "scholarships abroad for indian students",
    "how to get scholarship to study abroad from india",
    "daad scholarship for indian students",
    "study abroad funding guide for indian students",
  ],
});

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const heroCountryTiles = [
  {
    name: "Germany",
    flagCode: "de",
    highlight: "No tuition fees",
    image:
      "https://res.cloudinary.com/dlh6tmx7h/image/upload/v1779736142/studentstraffic/countries/germany-scholarship-hero.jpg",
    gradient: "from-[#1a2d4a]/80 to-[#0d1f35]/60",
  },
  {
    name: "Australia",
    flagCode: "au",
    highlight: "Merit awards",
    image: "/images/countries/australia-hero.webp",
    gradient: "from-[#7c3210]/80 to-[#3d1a08]/60",
  },
  {
    name: "Russia",
    flagCode: "ru",
    highlight: "Govt. quota MBBS",
    image:
      "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=600&q=80",
    gradient: "from-[#5c1a1a]/80 to-[#1a2d4a]/60",
  },
  {
    name: "UK & Europe",
    flagCode: "gb",
    highlight: "Chevening · Erasmus",
    image: null,
    gradient: "from-[#1a1a5c]/80 to-[#2d1a4a]/60",
  },
] as const;

const scholarshipTypes = [
  {
    label: "Full funding",
    tag: "Rare — highly competitive",
    tagColor: "bg-emerald-100 text-emerald-800",
    Icon: GraduationCap,
    accentColor: "bg-emerald-500",
    description:
      "Tuition + monthly living stipend + travel allowance. DAAD Research Grants, Erasmus Mundus joint Masters, Chevening (UK), Australia Awards. Genuinely available — but only for students with a strong GPA, defined research goal, or leadership track record who apply 12–18 months early.",
    reality:
      "Most full scholarships go to students with a strong GPA, research background, or sector relevance. If you're applying cold with average marks, treat these as stretch targets, not a fallback.",
  },
  {
    label: "Partial support",
    tag: "Most common",
    tagColor: "bg-blue-100 text-blue-800",
    Icon: BadgeIndianRupee,
    accentColor: "bg-blue-500",
    description:
      "Reduces tuition by 20–75%. Accommodation, visa, health insurance, flights, and living costs come from your pocket. University-issued merit scholarships and many country-based awards land here. The most realistic category for most Indian students.",
    reality:
      "Always calculate net annual payable before treating a partial scholarship as a budget solution. A 50% waiver at ₹18 lakh/year still leaves ₹9 lakh plus living costs.",
  },
  {
    label: "Tuition waiver",
    tag: "Common in Europe",
    tagColor: "bg-amber-100 text-amber-800",
    Icon: ShieldCheck,
    accentColor: "bg-amber-500",
    description:
      "Zero or near-zero tuition by policy — German public universities, some Nordic and French programs. Living costs of ₹7–15 lakh per year still apply. Often called a 'scholarship' in consultant marketing, but it's actually structural, not awarded.",
    reality:
      "Germany no-tuition is real. But Blocked Account requirements, health insurance, and city rent mean most students budget ₹8–12 lakh per year anyway.",
  },
] as const;

const scholarshipGuides = [
  {
    title: "Study in Germany with scholarship",
    href: "/study-in-germany-with-scholarship",
    label: "Country scholarship guide",
    flagCode: "de",
    countryName: "Germany",
    description:
      "DAAD grants, state-foundation funding, and the real monthly costs that remain after tuition is zero. Built for students seriously comparing Germany.",
    image:
      "https://res.cloudinary.com/dlh6tmx7h/image/upload/v1779736142/studentstraffic/countries/germany-scholarship-hero.jpg",
    imagePlaceholderGradient: "from-[#1a2d4a] to-[#0d1a2e]",
  },
  {
    title: "MBBS in Russia with scholarship",
    href: "/mbbs-in-russia-with-scholarship",
    label: "Medical scholarship guide",
    flagCode: "ru",
    countryName: "Russia",
    description:
      "Official Russian government quota, university-level waivers, and what the consultant 'scholarship' usually turns out to be on the ground.",
    image:
      "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=600&q=80",
    imagePlaceholderGradient: "from-[#5c1a1a] to-[#1a2d4a]",
  },
  {
    title: "Free MBBS abroad for Indian students",
    href: "/free-mbbs-in-abroad-for-indian-students",
    label: "Reality-check guide",
    flagCode: null,
    countryName: "Multiple countries",
    description:
      "Separates genuinely low-cost MBBS routes from misleading headlines, and explains the NMC conditions that make 'free MBBS' only half the story.",
    image: null,
    imagePlaceholderGradient: "from-[#1a3a1a] to-[#0d2a1a]",
  },
  {
    title: "Study in Australia for Indian students",
    href: "/study-in-australia-for-indian-students",
    label: "Destination planning guide",
    flagCode: "au",
    countryName: "Australia",
    description:
      "Australia Awards, university merit scholarships, and how to read Australian funding offers before treating them as a cost solution.",
    image: "/images/countries/australia-hero.webp",
    imagePlaceholderGradient: "from-[#7c3210] to-[#3d1a08]",
  },
] as const;

const namedScholarships = [
  {
    name: "DAAD",
    country: "Germany",
    flagCode: "de",
    type: "Research / Masters / Doctoral",
    covers: "Full stipend + travel + health cover",
    tagColor: "bg-[#eef2f8] text-[#355e8a] border-[#c8d8ef]",
  },
  {
    name: "Erasmus Mundus",
    country: "European Union",
    flagCode: "eu",
    type: "Joint Masters",
    covers: "Full tuition + monthly allowance + travel",
    tagColor: "bg-[#fffbe8] text-[#7a5c00] border-[#ffe599]",
  },
  {
    name: "Chevening",
    country: "United Kingdom",
    flagCode: "gb",
    type: "Masters",
    covers: "Full tuition + living stipend + flights",
    tagColor: "bg-[#eef1f8] text-[#1a2d5a] border-[#c4cfea]",
  },
  {
    name: "Australia Awards",
    country: "Australia",
    flagCode: "au",
    type: "Masters / Doctoral",
    covers: "Full tuition + living + establishment allowance",
    tagColor: "bg-[#fdf2ee] text-[#7c3210] border-[#f0c4ae]",
  },
  {
    name: "MEXT",
    country: "Japan",
    flagCode: "jp",
    type: "Undergrad / Research / Doctoral",
    covers: "Full tuition + monthly stipend + airfare",
    tagColor: "bg-[#fff0f0] text-[#8b1a1a] border-[#f5c0c0]",
  },
  {
    name: "Russian Govt. Quota",
    country: "Russia",
    flagCode: "ru",
    type: "MBBS / Engineering (UG)",
    covers: "Tuition support for quota seats",
    tagColor: "bg-[#f0f2f8] text-[#1a2d5a] border-[#c4cfea]",
  },
] as const;

const profileTypes = [
  {
    num: "01",
    title: "The research-track Masters student",
    Icon: BookOpen,
    description:
      "Strong GPA, a defined research interest, a thesis topic scoped. DAAD, Erasmus Mundus, and bilateral government schemes become genuinely accessible. Application needs to be started at least 15 months before intended intake.",
  },
  {
    num: "02",
    title: "The work-experience applicant",
    Icon: GraduationCap,
    description:
      "2–5 years post-graduation work, a clear sector goal, a leadership or policy narrative. Chevening and program-specific professional awards open up meaningfully at this stage.",
  },
  {
    num: "03",
    title: "The affordability-first family",
    Icon: BadgeIndianRupee,
    description:
      "Targeting the lowest net payable rather than a specific scholarship brand. Germany, parts of France, and Eastern Europe offer real low-tuition routes without requiring a named scholarship at all.",
  },
  {
    num: "04",
    title: "The MBBS student with NEET",
    Icon: Globe2,
    description:
      "A valid NEET score unlocks the India-return NMC pathway. Russian quota, partial university waivers, and managed-intake programs are the realistic scholarship routes for this group.",
  },
] as const;

const planningSteps = [
  {
    title: "Decide where and what you want to study before you chase funding",
    body: "Scholarship availability is country- and course-specific. Students who start with a destination and a program have a much clearer view of which awards are actually relevant — and which ones consultants recycle for every student regardless of fit.",
  },
  {
    title: "We confirm whether the scholarship is real, current, and open to Indian nationals",
    body: "Some awards have closed cycles, income conditions, or nationality restrictions that rule out most Indian applicants. We confirm this from the official programme source — not from agent materials — before a scholarship is presented to a family as a viable option.",
  },
  {
    title: "Work out your actual annual cost, not just the tuition number",
    body: "Accommodation, health insurance, visa fees, city living, proof-of-funds, and travel all add to what you pay each year. A scholarship that reduces tuition by ₹5 lakh while your city costs ₹8 lakh in living expenses is a partial help — not a solution.",
  },
  {
    title: "Make sure the university is the right choice even without the funding",
    body: "If the only reason a university is on your shortlist is that a scholarship might make it affordable, you need a backup plan. The university's academic quality, placement record, city, and India-return implications should all hold up independently.",
  },
  {
    title: "Give your scholarship application the same time you give your admission",
    body: "Named awards ask for a statement of purpose, academic references, language test scores, and sometimes a portfolio or interview. Most top scholarships close 9–15 months before intake. Starting after you've confirmed your admission is usually too late.",
  },
] as const;

const faqs = [
  {
    question: "Can Indian students actually get full scholarships to study abroad?",
    answer:
      "Yes, but only for a competitive subset of programs and applicants. DAAD, Erasmus Mundus, Chevening, and Australia Awards offer genuinely full funding, but they are competitive, cycle-specific, and require a strong academic or professional profile. Most Indian students studying abroad use partial support, low-tuition country routes, or self-funded pathways. Full scholarships should be treated as a serious application goal rather than an expected default.",
  },
  {
    question: "Is NEET required to get scholarships for MBBS abroad?",
    answer:
      "NEET is required for the India-return pathway under NMC rules, not as a scholarship entry criterion. Russian government quota and partial waivers do not depend on NEET directly, but any student planning to practice in India after completing an MBBS abroad needs a valid NEET score. Without it, the degree cannot be recognised for Indian practice regardless of which scholarship funded the course.",
  },
  {
    question: "How does Germany study-for-free actually work?",
    answer:
      "Most German public universities charge no tuition, or a semester administrative fee of €150–300. This is a structural policy, not a named scholarship. Living costs remain: accommodation, health insurance, food, and transport typically run €700–900 per month depending on city. Students need to demonstrate financial capacity via a Blocked Account. The no-tuition route is real, but the affordability story is more nuanced than 'free study in Germany'.",
  },
  {
    question: "What happens if I don't get the scholarship I applied for?",
    answer:
      "This is why university-first shortlisting matters. If the scholarship was the only reason a university was financially viable, you need a backup plan. Students should shortlist universities they can genuinely fund independently, then apply for scholarships to reduce that cost — not bank on them to make an unaffordable option possible.",
  },
  {
    question: "When should I apply for scholarships?",
    answer:
      "Most competitive government and university scholarships open 9–18 months before the intake. DAAD deadlines fall 12–15 months before the program start. Chevening opens in August for the following year's September intake. University-level merit awards sometimes run parallel to the regular admission cycle. The biggest mistake is to start researching scholarships after applying for admission — the two processes should run together.",
  },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ScholarshipsForIndianStudentsToStudyAbroadPage() {
  const structuredData = getStructuredDataGraph([
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Scholarships Abroad", path: pagePath },
    ]),
    getCollectionPageStructuredData({
      path: pagePath,
      name: "Scholarships for Indian students to study abroad",
      description:
        "Scholarship planning hub linking country and MBBS scholarship guides for Indian students.",
    }),
    getFaqStructuredData(
      faqs.map((f) => ({ question: f.question, answer: f.answer })),
      pagePath
    ),
  ]);

  return (
    <>
      {/* ================================================================== */}
      {/* HERO — split layout: text left, country-tile mosaic right           */}
      {/* ================================================================== */}
      <section className="relative overflow-hidden border-b border-border/60 bg-[linear-gradient(145deg,#f6efe7_0%,#fbfaf8_48%,#eef4fb_100%)]">
        {/* radial accents */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(214,97,0,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(53,94,138,0.08),transparent_30%)]" />

        <div className="container-shell relative grid items-center gap-10 py-14 md:py-18 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14 lg:py-20">
          {/* Text */}
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Scholarships · India to World
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,5vw,4.2rem)] font-bold leading-[1.02] tracking-tight text-heading">
              Scholarships for Indian students to study abroad
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              Most scholarship searches start with the wrong question. This hub
              explains what scholarships actually cover, which named awards are
              genuinely accessible to Indian students, and how to build a plan
              that holds whether or not the funding comes through.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CounsellingCtaButton
                label="Get scholarship counselling"
                title="Request your scholarship counselling call"
                description="Leave your number and we will call you with guidance on countries, scholarships, university fit, and the next admission step that matches your profile."
                className="rounded-full bg-foreground px-5 py-3 font-semibold text-background transition hover:opacity-90"
                ctaVariant="scholarship-hub-hero"
                formVariant="scholarship"
              />
              <Link
                href="/guides"
                className="rounded-full border border-border bg-background/80 px-5 py-3 font-medium text-foreground transition hover:bg-background"
              >
                Explore all guides
              </Link>
            </div>
          </div>

          {/* Country tile mosaic */}
          <div className="grid grid-cols-2 gap-3">
            {heroCountryTiles.map((tile) => (
              <div
                key={tile.name}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 shadow-sm"
              >
                {tile.image ? (
                  <Image
                    src={tile.image}
                    alt={`${tile.name} study abroad`}
                    fill
                    sizes="(min-width:1024px) 200px, 45vw"
                    unoptimized={tile.image.startsWith("/")}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient.replace("from-", "from-").replace("to-", "to-")}`} />
                )}
                {/* dark overlay for legibility */}
                <div className={`absolute inset-0 bg-gradient-to-t ${tile.gradient} opacity-75`} />
                {/* content */}
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
      {/* SCHOLARSHIP TYPES — horizontal strips on a light grey bg            */}
      {/* ================================================================== */}
      <section className="bg-[#f7f6f3] py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Understand First
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-heading">
              What "scholarship" actually means — and what it doesn't
            </h2>
          </div>

          <div className="space-y-4">
            {scholarshipTypes.map(({ label, tag, tagColor, Icon, accentColor, description, reality }) => (
              <div
                key={label}
                className="grid overflow-hidden rounded-2xl border border-border bg-white shadow-sm md:grid-cols-[200px_minmax(0,1fr)_minmax(0,1fr)]"
              >
                {/* Left label strip */}
                <div className="flex flex-col justify-between gap-4 border-b border-border/60 p-5 md:border-b-0 md:border-r">
                  <div>
                    <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${accentColor}/10`}>
                      <Icon className={`size-5 ${accentColor.replace("bg-", "text-")}`} />
                    </div>
                    <p className="font-display text-xl font-bold text-heading">{label}</p>
                  </div>
                  <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${tagColor}`}>
                    {tag}
                  </span>
                </div>

                {/* Description */}
                <div className="border-b border-border/60 p-5 md:border-b-0 md:border-r">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What it covers</p>
                  <p className="mt-2 text-sm leading-7 text-foreground">{description}</p>
                </div>

                {/* Reality check */}
                <div className="bg-muted/40 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reality check</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{reality}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* GUIDE CARDS — horizontal image+content cards                        */}
      {/* ================================================================== */}
      <section className="section-space border-t border-border/50">
        <div className="container-shell">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Country &amp; Course Guides
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-heading">
              Choose the guide that matches your actual plan
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              Each guide covers one specific route — what's real, what cost remains, and how to build an application that competes.
            </p>
          </div>

          <div className="space-y-4">
            {scholarshipGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Image panel */}
                <div className="relative hidden w-[180px] shrink-0 sm:block md:w-[220px]">
                  {guide.image ? (
                    <Image
                      src={guide.image}
                      alt={`${guide.countryName} scholarship`}
                      fill
                      sizes="220px"
                      unoptimized={guide.image.startsWith("/")}
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${guide.imagePlaceholderGradient}`} />
                  )}
                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
                  {/* flag badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/40 px-2 py-1 backdrop-blur-sm">
                    {guide.flagCode ? (
                      <CountryFlag
                        countryCode={guide.flagCode}
                        alt={`${guide.countryName} flag`}
                        width={18}
                        height={13}
                        className="rounded-sm"
                      />
                    ) : (
                      <Globe2 className="size-3.5 text-white/80" />
                    )}
                    <span className="text-[11px] font-semibold text-white/90">
                      {guide.countryName}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/60 px-3 py-0.5 text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                        {/* Flag visible on mobile where image is hidden */}
                        {guide.flagCode && (
                          <span className="sm:hidden">
                            <CountryFlag
                              countryCode={guide.flagCode}
                              alt={`${guide.countryName} flag`}
                              width={16}
                              height={11}
                              className="rounded-sm"
                            />
                          </span>
                        )}
                        {guide.label}
                      </span>
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-heading sm:text-2xl">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {guide.description}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-border/60 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-heading">
                      Read the full guide
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* NAMED SCHOLARSHIPS — flag-led award cards                          */}
      {/* ================================================================== */}
      <section className="section-space border-t border-border/50 bg-[#f7f6f3]">
        <div className="container-shell">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Named Awards
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-heading">
              Scholarships Indian students actually use
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              Well-established programs with real funding and a track record. Each has genuine eligibility conditions — we confirm these from official sources before presenting any scholarship as an option.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {namedScholarships.map((s) => (
              <div
                key={s.name}
                className="flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                {/* Header: flag + country */}
                <div className="flex items-center gap-2">
                  <CountryFlag
                    countryCode={s.flagCode}
                    alt={`${s.country} flag`}
                    width={28}
                    height={20}
                    className="rounded-sm shadow-sm"
                  />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {s.country}
                  </span>
                </div>

                {/* Scholarship name */}
                <h3 className="mt-3 font-display text-2xl font-bold text-heading">
                  {s.name}
                </h3>

                {/* Type tag */}
                <span className={`mt-2 self-start rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.tagColor}`}>
                  {s.type}
                </span>

                {/* Coverage */}
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted/40 p-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-xs leading-5 text-muted-foreground">{s.covers}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-6 text-muted-foreground">
            Scholarship cycles, eligibility conditions, and award values change each year. We track these from official programme sources.
          </p>
        </div>
      </section>

      {/* ================================================================== */}
      {/* WHO WINS — editorial numbered list                                  */}
      {/* ================================================================== */}
      <section className="section-space border-t border-border/50">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Profile list */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Who Wins Scholarships
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-heading">
                Four profiles — and what funding looks like for each
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                The right strategy depends on your course level, academic record, goals, and how early you start.
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

            {/* Profile CTA card */}
            <div className="flex flex-col gap-4 self-start">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-accent" />
                  <p className="text-sm font-semibold text-heading">
                    Not sure which profile fits you?
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  We review your academic profile, course goals, and budget together to point you at the scholarship routes that actually make sense for your situation.
                </p>
                <div className="mt-5">
                  <CounsellingCtaButton
                    label="Talk to a scholarship advisor"
                    title="Request your scholarship profile review"
                    description="Leave your number and we will call you to discuss scholarship routes, admission fit, and how to structure your application."
                    className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
                    ctaVariant="scholarship-hub-profile"
                    formVariant="scholarship"
                  />
                </div>
              </div>

              {/* Quick checklist */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <p className="text-sm font-semibold text-heading">
                  What we confirm before shortlisting
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "Is this scholarship running in the current cycle?",
                    "Does it cover tuition only, or living costs too?",
                    "What is the net annual cost after the award?",
                    "Does the student's academic profile meet the selection criteria?",
                    "Is the university the right fit independently of the scholarship?",
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
      {/* PLANNING TIMELINE — vertical line with steps                        */}
      {/* ================================================================== */}
      <section className="section-space border-t border-border/50 bg-[#f7f6f3]">
        <div className="container-shell max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            5-Step Planning Guide
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-heading">
            How we evaluate every scholarship for Indian students abroad
          </h2>

          <div className="relative mt-12">
            {/* Vertical line */}
            <div className="absolute left-[18px] top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />

            <div className="space-y-0">
              {planningSteps.map((step, i) => (
                <div key={step.title} className="relative flex gap-6 pb-10 last:pb-0">
                  {/* Node */}
                  <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-white text-sm font-bold text-accent shadow-sm">
                    {i + 1}
                  </div>
                  {/* Content */}
                  <div className="flex-1 rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <p className="font-semibold text-heading">{step.title}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ                                                                 */}
      {/* ================================================================== */}
      <section className="section-space border-t border-border/50">
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
      {/* BOTTOM CTA — dark inverted section                                  */}
      {/* ================================================================== */}
      <section className="bg-[#0b1a14] px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a87c]">
                Ready to plan?
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white lg:text-4xl">
                Get a scholarship shortlist built around your actual profile
              </h2>
              <p className="mt-4 text-base leading-8 text-white/60">
                We help students identify the right country, right university, and the funding routes that realistically match their academic profile — without the generic scholarship list that doesn't account for eligibility.
              </p>

              {/* Country flags strip */}
              <div className="mt-8 flex items-center gap-3">
                <span className="text-xs font-medium text-white/40">We cover</span>
                {(["de", "au", "ru", "gb", "jp"] as const).map((code) => (
                  <CountryFlag
                    key={code}
                    countryCode={code}
                    alt={`${code} flag`}
                    width={28}
                    height={20}
                    className="rounded-sm opacity-80 shadow transition hover:opacity-100"
                  />
                ))}
                <span className="text-xs font-medium text-white/40">& more</span>
              </div>

              <div className="mt-8">
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#e8a87c] hover:underline"
                >
                  Browse all study-abroad guides
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <DeferredLeadForm
                sourcePath={pagePath}
                ctaVariant="scholarship-hub-bottom"
                title="Get free scholarship counselling"
                description="Share your details and our team will call you with guidance on scholarships, university shortlisting, and the next step."
                submitLabel="Request callback"
                formVariant="scholarship"
                notes="Interest: scholarships for Indian students to study abroad"
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
