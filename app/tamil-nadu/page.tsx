import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, Clock, FileText, Globe, GraduationCap, IndianRupee, MapPin, Phone, Shield, Users } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import {
  getTamilNaduCityPages,
  getTamilNaduHubStats,
} from "@/lib/data/tamil-nadu-local";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getCountryHref,
  getTamilNaduCityHref,
  getTamilNaduHubHref,
} from "@/lib/routes";
import {
  getBreadcrumbStructuredData,
  getCollectionPageStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
} from "@/lib/structured-data";

export const metadata: Metadata = buildIndexableMetadata({
  title: "Best MBBS Abroad Consultant in Tamil Nadu | Expert Guidance for Medical Students",
  description:
    "Leading MBBS abroad consultant in Tamil Nadu. Expert guidance for studying medicine in Russia, Georgia, Vietnam, Kyrgyzstan. Compare countries, costs, NMC recognition. Free counselling.",
  path: getTamilNaduHubHref(),
  keywords: [
    "best MBBS abroad consultant Tamil Nadu",
    "MBBS abroad counselling Tamil Nadu",
    "study MBBS abroad from Tamil Nadu",
    "medical education consultant Tamil Nadu",
    "MBBS abroad guidance Chennai Coimbatore",
  ],
});

export default function TamilNaduHubPage() {
  const pages = getTamilNaduCityPages();
  const stats = getTamilNaduHubStats();
  const path = getTamilNaduHubHref();

  const topCountries = [
    { name: "Russia", slug: "russia", students: "High", recognition: "NMC Approved", cost: "₹15-25L total", duration: "6 years", language: "English/Russian" },
    { name: "Georgia", slug: "georgia", students: "Very High", recognition: "WHO Listed", cost: "₹20-30L total", duration: "6 years", language: "English" },
    { name: "Vietnam", slug: "vietnam", students: "Growing", recognition: "NMC Approved", cost: "₹18-28L total", duration: "6 years", language: "English" },
    { name: "Kyrgyzstan", slug: "kyrgyzstan", students: "High", recognition: "NMC Approved", cost: "₹12-20L total", duration: "5 years", language: "English/Russian" },
  ];

  const faqItems = [
    {
      question: "Which country is best for MBBS abroad from Tamil Nadu?",
      answer:
        "Russia and Georgia are the most popular choices. Russia offers established medical universities with lower costs (₹15-25L total), while Georgia provides English-medium programs in modern cities (₹20-30L total). Vietnam is gaining popularity for Southeast Asian proximity. The best choice depends on your budget, NEET score, and climate preference.",
    },
    {
      question: "Can I practice in Tamil Nadu after MBBS abroad?",
      answer:
        "Yes. You must clear the NExT (National Exit Test) after graduation to get your medical license in India. All universities we recommend are NMC-approved and their graduates are eligible for NExT. After clearing NExT and completing mandatory internship, you can practice anywhere in India including Tamil Nadu.",
    },
    {
      question: "How does MBBS abroad cost compare to private medical colleges in Tamil Nadu?",
      answer:
        "Private MBBS in Tamil Nadu costs ₹50L-₹1.5Cr for 5.5 years. MBBS abroad ranges from ₹12-30L total for 6 years depending on country. Countries like Russia, Kyrgyzstan, and Vietnam are significantly more affordable while maintaining NMC recognition and good education standards.",
    },
    {
      question: "What is the total cost including living expenses?",
      answer:
        "Total 6-year cost includes: tuition fees, hostel, food, health insurance, visa, travel, and miscellaneous expenses. Budget countries: ₹12-20L (Kyrgyzstan, Uzbekistan). Mid-range: ₹15-25L (Russia, Vietnam). Premium: ₹20-30L (Georgia). We provide detailed year-wise cost breakdowns during counselling.",
    },
    {
      question: "How do I verify if a university is NMC approved?",
      answer:
        "Check the NMC website's list of approved foreign medical institutions. We verify each university against both NMC and WDOMS (WHO database). During counselling, we show you exactly how to verify recognition status and explain what to look for in official documentation.",
    },
    {
      question: "What NEET score is required for MBBS abroad?",
      answer:
        "For NMC recognition, you need to pass NEET (qualifying percentile: 50th for General, 40th for SC/ST/OBC). There is no minimum NEET score requirement for admission to most foreign universities. However, having a higher score improves your chances at top universities. We help you shortlist universities based on your actual NEET score.",
    },
    {
      question: "Is the MBBS degree from abroad valid in India?",
      answer:
        "Yes, if the university is listed in the NMC (National Medical Commission) approved foreign institutions list. After graduation, you must clear NExT exam and complete mandatory internship to practice in India. We only recommend NMC-approved universities to ensure your degree is recognized.",
    },
    {
      question: "What is the admission process and timeline?",
      answer:
        "Admission process: (1) Choose country and university (2) Submit application with NEET scorecard, 12th marksheet, passport (3) Receive admission letter (4) Pay first-year fees (5) Apply for visa (6) Travel for semester start. Timeline: Applications start in May-June, admissions in August-September. Complete process takes 2-3 months.",
    },
    {
      question: "Do I need to learn a foreign language?",
      answer:
        "For countries offering English-medium programs (Georgia, Vietnam, some Russian universities, Kyrgyzstan), English is sufficient for the entire course. However, learning basic local language helps with daily life and hospital internships. Some Russian universities teach in Russian medium - we clearly indicate this during counselling.",
    },
    {
      question: "What about safety and living conditions?",
      answer:
        "All recommended countries have established Indian student communities. Universities provide secure hostel accommodation with Indian food options. We share details about climate, safety measures, Indian embassy contact, and student support systems. Many Tamil Nadu students are already studying in these countries.",
    },
    {
      question: "Can my parents visit during the course?",
      answer:
        "Yes, parents can apply for tourist visas to visit. Most universities have parent visit weeks during semester breaks. We provide guidance on visa procedures for family visits.",
    },
    {
      question: "What documents are required for admission?",
      answer:
        "Required documents: (1) NEET scorecard (2) 10th and 12th marksheets (3) Passport (4) Birth certificate (5) Medical fitness certificate (6) Passport-size photographs (7) Migration certificate (8) No objection certificate. We provide a complete checklist and help with document preparation.",
    },
  ];

  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "Tamil Nadu", path },
    ]),
    getCollectionPageStructuredData({
      path,
      name: "MBBS Abroad Consultant Tamil Nadu",
      description:
        "Professional MBBS abroad counselling services for Tamil Nadu students across all major cities.",
    }),
    getFaqStructuredData(faqItems, path),
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-border bg-white">
        <div className="container-shell py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2">
              <MapPin className="size-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Tamil Nadu</span>
            </div>

            <h1 className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight text-primary md:text-6xl lg:text-7xl">
              Best MBBS Abroad Consultant in Tamil Nadu
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Expert guidance for students from Chennai, Coimbatore, Madurai, Trichy, and across Tamil Nadu.
              Compare countries, understand true costs, verify NMC recognition, and plan your complete MBBS abroad journey with India's leading medical education consultancy.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <CounsellingDialog
                triggerContent={
                  <>
                    <Phone className="size-5" />
                    Get Free Counselling
                  </>
                }
                triggerVariant="accent"
                triggerSize="lg"
                ctaVariant="tamil_nadu_hub"
              />
            </div>
          </div>

          {/* Key Services Grid */}
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="size-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-heading">Country & University Comparison</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Detailed comparison of Russia, Georgia, Vietnam, Kyrgyzstan, and Uzbekistan. Evaluate based on budget, climate, language medium, cultural adaptation, and long-term career outcomes.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="size-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-heading">NMC Recognition & Licensing</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Complete verification of university recognition status. Guidance on FMGE/NExT exam preparation, eligibility criteria, and complete medical licensing pathway for practicing in India after graduation.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="size-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-heading">University Selection & Admission</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Personalized university shortlisting based on your NEET score, budget, preferred language medium, city preferences, and long-term medical specialization goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete MBBS Abroad Process */}
      <section className="border-b border-border bg-muted/30 py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-12 max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Complete MBBS Abroad Process for Tamil Nadu Students
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Step-by-step guidance from initial counselling to medical practice in India
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                step: "1",
                title: "Free Counselling & Country Selection",
                description: "Book a counselling session to discuss your NEET score, budget, preferences, and career goals. We help you compare Russia, Georgia, Vietnam, Kyrgyzstan, and Uzbekistan based on total cost, language medium, climate, and return-to-India pathway. Understand NMC recognition requirements and verify university eligibility.",
                icon: <Users className="size-6 text-primary" />,
              },
              {
                step: "2",
                title: "University Shortlisting & Admission",
                description: "Receive personalized university recommendations based on your profile. Review detailed information about each university including fees structure, hostel facilities, teaching medium, clinical exposure, and pass rates. Submit applications with required documents: NEET scorecard, 12th marksheet, passport, and photographs. Receive admission confirmation within 2-4 weeks.",
                icon: <FileText className="size-6 text-primary" />,
              },
              {
                step: "3",
                title: "Fee Payment & Documentation",
                description: "Pay first-year tuition fees through secure banking channels. Complete document attestation from MEA and embassy. Prepare complete dossier including medical fitness certificate, police clearance, birth certificate, and migration certificate. We provide document checklist and verification support throughout this process.",
                icon: <IndianRupee className="size-6 text-primary" />,
              },
              {
                step: "4",
                title: "Visa Processing & Travel",
                description: "Apply for student visa with invitation letter from university. Submit passport, admission letter, medical insurance, and fee payment proof. Visa processing takes 2-3 weeks. We provide pre-departure briefing covering travel arrangements, airport pickup, currency exchange, essential items checklist, and first-week orientation.",
                icon: <Globe className="size-6 text-primary" />,
              },
              {
                step: "5",
                title: "6-Year MBBS Education",
                description: "Complete 5-6 year MBBS program including preclinical studies (2 years), clinical rotations (3 years), and hospital internship (1 year). Medium of instruction in English for most universities. Indian student community support, hostel accommodation with Indian food options, and semester-wise academic guidance provided.",
                icon: <GraduationCap className="size-6 text-primary" />,
              },
              {
                step: "6",
                title: "NExT Exam & Medical Practice in India",
                description: "Clear National Exit Test (NExT) after graduation for medical license in India. NExT replaced FMGE as the single licensing exam. Complete 1-year compulsory rotating internship in India. Register with State Medical Council and National Medical Commission. Begin medical practice in Tamil Nadu or anywhere in India as qualified MBBS doctor.",
                icon: <Shield className="size-6 text-primary" />,
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 rounded-xl border border-border bg-white p-6">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 font-display text-2xl font-bold text-accent">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-heading">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Coverage */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-12">
            <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              MBBS Abroad Guidance Across Tamil Nadu
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              We provide expert MBBS abroad counselling to students across all major cities in Tamil Nadu.
              Each city page includes location-specific guidance, common questions from local students, cost comparisons with Tamil Nadu private colleges, and tailored country recommendations.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((city) => (
              <Link
                key={city.slug}
                href={getTamilNaduCityHref(city.slug)}
                className="group rounded-xl border border-border bg-white p-6 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold text-primary group-hover:text-accent">
                      {city.city}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {city.heroSummary}
                    </p>
                  </div>
                  <ArrowRight className="ml-4 size-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent" />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {city.destinationFocus.slice(0, 3).map((dest) => (
                    <span
                      key={dest.slug}
                      className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {dest.country}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Countries Detailed */}
      <section className="border-b border-border bg-muted/30 py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-12">
            <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Top MBBS Destinations for Tamil Nadu Students
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              Comprehensive comparison of the most popular countries for MBBS abroad. These destinations are frequently chosen by Tamil Nadu students based on affordability, quality of medical education,
              NMC recognition, safety, and successful return-to-India outcomes.
            </p>
          </div>

          <div className="space-y-6">
            {topCountries.map((country) => (
              <Link
                key={country.slug}
                href={getCountryHref(country.slug)}
                className="group flex flex-col gap-6 rounded-xl border border-border bg-white p-8 transition-all hover:border-primary hover:shadow-md lg:flex-row"
              >
                <div className="flex-1">
                  <h3 className="font-display text-3xl font-bold text-primary group-hover:text-accent">
                    MBBS in {country.name}
                  </h3>
                  <div className="mt-6 grid gap-6 sm:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Popularity
                      </p>
                      <p className="mt-1 font-semibold text-heading">{country.students} Demand</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Recognition
                      </p>
                      <p className="mt-1 font-semibold text-heading">{country.recognition}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Duration
                      </p>
                      <p className="mt-1 font-semibold text-heading">{country.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Language
                      </p>
                      <p className="mt-1 font-semibold text-heading">{country.language}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Total 6-Year Cost
                    </p>
                    <p className="mt-1 text-2xl font-bold text-heading">{country.cost}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Including tuition, hostel, food, insurance, and travel
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 font-semibold text-accent lg:flex-col lg:justify-center">
                  <span>View Details</span>
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Extended */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-12 max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Why Tamil Nadu Students Trust Our MBBS Abroad Guidance
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We understand the specific concerns, budget considerations, and career aspirations of Tamil Nadu families planning MBBS abroad.
              Our counselling approach is built on transparency, accurate information, and long-term student success.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-heading">Complete Cost Transparency</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Detailed breakdown of total 6-year cost including tuition fees, hostel charges, food expenses, health insurance, visa fees, travel costs, and miscellaneous expenses.
                    We provide year-wise cost projections so you can plan your budget accurately. No hidden fees, no surprises during the admission process or throughout the course duration.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-heading">NMC & WDOMS Verification</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Every recommended university is cross-verified against National Medical Commission (NMC) approved foreign institutions list and World Directory of Medical Schools (WDOMS).
                    We explain FMGE/NExT exam requirements, eligibility criteria, pass rates, and complete medical licensing procedure for practicing in India after graduation.
                    We show you exactly how to independently verify recognition status on official websites.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-heading">Return-to-India Career Pathway</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Comprehensive guidance on the complete journey from graduation to medical practice in India. This includes NExT exam preparation timeline, coaching recommendations,
                    compulsory rotating internship requirements in India, State Medical Council and NMC registration procedures, and establishing your medical practice in Tamil Nadu or anywhere in India.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-heading">Realistic Country & University Comparison</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Honest, detailed comparison covering climate adaptation (cold winters in Russia vs moderate climate in Georgia/Vietnam), language barrier challenges,
                    cultural differences, safety considerations, quality of medical education, hospital infrastructure for clinical training, pass rates in licensing exams,
                    and long-term career implications. We don't push any single country - we help you make an informed decision based on your specific circumstances.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-heading">NEET Score-Based University Shortlisting</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Personalized university recommendations matched to your actual NEET score, budget constraints, preferred language medium (English vs Russian),
                    city size preferences (metropolitan vs smaller cities), and long-term medical specialization aspirations. We consider your complete academic profile
                    including 12th marks and overall academic performance to suggest the best-fit universities.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-heading">Comparison with Private MBBS in Tamil Nadu</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Detailed cost-benefit analysis comparing MBBS abroad with private medical colleges in Tamil Nadu. Private MBBS in Tamil Nadu costs ₹50L-₹1.5Cr for 5.5 years
                    while MBBS abroad ranges from ₹12-30L total for 6 years. We help you evaluate quality of education, infrastructure, clinical exposure, and career outcomes
                    to make the best decision for your medical career and family budget.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-heading">Tamil Nadu Student Community Support</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Connect with current students from Tamil Nadu already studying in these countries. Access to alumni network for firsthand experiences about university life,
                    hostel facilities, food options, climate adaptation, and academic environment. We facilitate interaction with students from Chennai, Coimbatore, Madurai,
                    and other Tamil Nadu cities who have successfully completed MBBS abroad and are now practicing in India.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-heading">Complete Documentation Support</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    End-to-end assistance with document preparation, MEA attestation, embassy verification, visa application, fee payment procedures, and travel arrangements.
                    We provide detailed checklists for each stage, review all documents before submission, and ensure everything is properly attested and authenticated
                    to avoid delays or rejections during the admission and visa process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Questions - Expanded */}
      <section className="border-b border-border bg-muted/30 py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-12 max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Frequently Asked Questions About MBBS Abroad from Tamil Nadu
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive answers to the most common questions from Tamil Nadu students and parents about studying MBBS abroad
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="rounded-xl border border-border bg-white p-8">
                <h3 className="font-semibold text-heading">{item.question}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Breakdown Section */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-12 max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Complete Cost Breakdown for MBBS Abroad
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Transparent, detailed cost analysis for 6-year MBBS programs across different countries
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl border border-border bg-white">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-4 text-left font-semibold text-heading">Expense Category</th>
                  <th className="p-4 text-left font-semibold text-heading">Russia</th>
                  <th className="p-4 text-left font-semibold text-heading">Georgia</th>
                  <th className="p-4 text-left font-semibold text-heading">Vietnam</th>
                  <th className="p-4 text-left font-semibold text-heading">Kyrgyzstan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Tuition Fees (6 years)</td>
                  <td className="p-4 text-muted-foreground">₹12-18L</td>
                  <td className="p-4 text-muted-foreground">₹15-22L</td>
                  <td className="p-4 text-muted-foreground">₹14-20L</td>
                  <td className="p-4 text-muted-foreground">₹8-14L</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Hostel (6 years)</td>
                  <td className="p-4 text-muted-foreground">₹2-4L</td>
                  <td className="p-4 text-muted-foreground">₹3-5L</td>
                  <td className="p-4 text-muted-foreground">₹2-4L</td>
                  <td className="p-4 text-muted-foreground">₹2-3L</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Food (6 years)</td>
                  <td className="p-4 text-muted-foreground">₹3-5L</td>
                  <td className="p-4 text-muted-foreground">₹3-6L</td>
                  <td className="p-4 text-muted-foreground">₹2-4L</td>
                  <td className="p-4 text-muted-foreground">₹2-4L</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Insurance & Visa</td>
                  <td className="p-4 text-muted-foreground">₹1.5-2L</td>
                  <td className="p-4 text-muted-foreground">₹1.5-2.5L</td>
                  <td className="p-4 text-muted-foreground">₹1-2L</td>
                  <td className="p-4 text-muted-foreground">₹1-1.5L</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Travel & Miscellaneous</td>
                  <td className="p-4 text-muted-foreground">₹1.5-2.5L</td>
                  <td className="p-4 text-muted-foreground">₹2-3L</td>
                  <td className="p-4 text-muted-foreground">₹1.5-2.5L</td>
                  <td className="p-4 text-muted-foreground">₹1-2L</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-4 font-bold text-heading">Total Estimated Cost</td>
                  <td className="p-4 font-bold text-heading">₹15-25L</td>
                  <td className="p-4 font-bold text-heading">₹20-30L</td>
                  <td className="p-4 font-bold text-heading">₹18-28L</td>
                  <td className="p-4 font-bold text-heading">₹12-20L</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-accent/5 p-6">
            <h3 className="font-semibold text-heading">Cost Comparison with Private MBBS in Tamil Nadu</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Private medical colleges in Tamil Nadu charge between ₹50 lakhs to ₹1.5 crores for the complete 5.5-year MBBS course.
              In comparison, MBBS abroad costs ₹12-30 lakhs total for 6 years including all expenses. This represents a savings of ₹20-90 lakhs
              depending on the country chosen. All recommended foreign universities are NMC-approved and provide quality medical education
              with good clinical exposure and hospital infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-primary py-16 md:py-20">
        <div className="container-shell text-center">
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
            Ready to Start Your MBBS Abroad Journey from Tamil Nadu?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Book a free counselling session with our MBBS abroad experts. Get personalized guidance on country selection, university shortlisting,
            cost planning, NMC recognition verification, and complete admission support. We help Tamil Nadu students achieve their dream of becoming doctors through affordable MBBS abroad programs.
          </p>
          <div className="mt-8">
            <CounsellingDialog
              triggerContent={
                <>
                  <Phone className="size-5" />
                  Book Free Counselling Now
                </>
              }
              triggerVariant="accent"
              triggerSize="lg"
              ctaVariant="tamil_nadu_hub_bottom"
            />
          </div>
        </div>
      </section>

      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </>
  );
}
