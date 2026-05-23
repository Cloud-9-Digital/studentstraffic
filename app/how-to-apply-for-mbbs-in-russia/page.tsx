"use client";

import Link from "next/link";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { JsonLd } from "@/components/shared/json-ld";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

const pagePath = "/how-to-apply-for-mbbs-in-russia";
const publishedDate = "2026-05-23";

const keyTakeaways = [
  "The ideal application window is January-March (before NEET results) for September intake, though universities accept applications until August 30. Early application significantly improves chances of getting preferred universities and smooth visa processing. The complete timeline from application to arrival spans 5-7 months: application submission → admission letter (5-10 days) → invitation letter (20-45 days) → student visa (2-3 weeks) → flight booking → arrival 1 week before classes.",
  "Mandatory documents include apostilled Class 10/12 certificates (50% PCB minimum for General category), valid NEET scorecard (50th percentile General, 40th percentile Reserved), passport with 18 months validity, HIV-negative certificate (within 3 months), and ₹4-5 lakh bank statement for financial proof. All documents must be translated to Russian and notarized. Missing apostille or expired HIV certificate are the most common application rejections.",
  "Total application process costs ₹2-3 lakhs excluding tuition: document attestation and translation (₹15,000-₹30,000), admission and visa processing (₹1-1.5 lakhs), visa fees (₹4,000-8,000), medical examination and insurance (₹8,000-15,000), and flight tickets (₹40,000-70,000). First semester tuition fee (₹1.1-2.6 lakhs) must be paid before invitation letter is issued.",
];

const applicationTimeline = [
  {
    phase: "Planning Phase",
    timeline: "May-December (Year Before Intake)",
    tasks: [
      "Research NMC-approved Russian medical universities",
      "Prepare for NEET examination (mandatory for India return)",
      "Start gathering academic documents (Class 10, 12 certificates)",
      "Verify university recognition status on NMC website",
    ],
    criticalAction: "Verify NMC approval before shortlisting universities",
  },
  {
    phase: "Application Phase",
    timeline: "January-August (Intake Year)",
    tasks: [
      "January-March: Submit applications (ideal window, best seat availability)",
      "May-July: Peak application period (post-NEET results)",
      "Begin document apostille and translation process (3-4 months before application)",
      "Obtain HIV test certificate (within 3 months of application)",
      "Submit complete application with all attested documents",
    ],
    criticalAction: "Apply before June for smooth processing and preferred university selection",
  },
  {
    phase: "Post-Application Processing",
    timeline: "June-August",
    tasks: [
      "Receive admission/offer letter (5-10 days after document verification)",
      "Pay first semester tuition fee (prerequisite for invitation letter)",
      "Invitation letter processing by Federal Migration Service (20-45 days)",
      "Apply for student visa at Russian Embassy/VFS (2-3 weeks processing)",
      "Book flight tickets only after visa approval",
    ],
    criticalAction: "Start invitation letter process at least 2-3 months before course begins",
  },
  {
    phase: "Pre-Departure",
    timeline: "August (1 week before classes)",
    tasks: [
      "Attend pre-departure briefing (cultural norms, packing, expectations)",
      "Carry 50 colored passport-size photographs for registrations",
      "Pack for Russian winter (-20°C to -35°C) even if arriving in summer",
      "Load ₹40,000-60,000 in forex card plus ₹1-1.5 lakhs for initial expenses",
      "Inform university of flight details for airport pickup arrangement",
    ],
    criticalAction: "Arrive at least 1 week before classes for registration and settling",
  },
  {
    phase: "Arrival & Registration",
    timeline: "September-October",
    tasks: [
      "Airport pickup by university representatives",
      "Hostel allotment and room allocation (2-3 students per room)",
      "Visa registration with Federal Migration Service within 7 days (university assists)",
      "Submit original documents for university enrollment",
      "Undergo mandatory local medical examination in Russia",
      "Obtain student ID card and residence permit",
    ],
    criticalAction: "Complete FMS visa registration within 7 days to avoid ₹2,000-5,000 fine or deportation",
  },
];

const requiredDocumentCategories = [
  {
    category: "Academic Documents",
    documents: [
      {
        item: "Class 10 mark sheets & certificates",
        requirement: "Attested by notary + apostilled by MEA + Russian translation",
        validity: "Permanent",
      },
      {
        item: "Class 12 mark sheets & certificates (PCB)",
        requirement: "Minimum 50% PCB aggregate (General/OBC), 40% (SC/ST) + apostilled + translated",
        validity: "Permanent",
      },
      {
        item: "Birth certificate",
        requirement: "Apostilled by Ministry of External Affairs",
        validity: "Permanent",
      },
      {
        item: "Migration/Transfer certificate",
        requirement: "From previous educational institute",
        validity: "Permanent",
      },
    ],
  },
  {
    category: "NEET & Regulatory",
    documents: [
      {
        item: "NEET scorecard",
        requirement: "50th percentile (General), 40th percentile (SC/ST/OBC) - mandatory for NMC registration",
        validity: "3 years from result date",
      },
      {
        item: "NEET admit card",
        requirement: "Original copy for verification",
        validity: "3 years",
      },
    ],
  },
  {
    category: "Passport & Visa",
    documents: [
      {
        item: "Valid passport",
        requirement: "At least 18 months validity from entry date + minimum 2 blank pages",
        validity: "Must renew if <18 months",
      },
      {
        item: "Visa application form",
        requirement: "Filled completely, signed, no mismatched details with passport",
        validity: "N/A",
      },
      {
        item: "Photographs (50 copies total)",
        requirement: "35mm x 45mm, 600 DPI, matte finish, white background, face 70-80% of image",
        validity: "Recent (within 6 months)",
      },
    ],
  },
  {
    category: "Medical Certificates",
    documents: [
      {
        item: "HIV/AIDS test certificate",
        requirement: "Original hard copy from accredited medical institution confirming HIV-negative status",
        validity: "Within 3 months of application (15-30 days from submission)",
      },
      {
        item: "Medical fitness certificate",
        requirement: "General health clearance from registered medical practitioner",
        validity: "1 year from issue date",
      },
      {
        item: "Health insurance",
        requirement: "Valid in Russia with minimum €30,000 coverage",
        validity: "Must cover entire academic year (₹8,000-15,000 annually)",
      },
    ],
  },
  {
    category: "Financial Documents",
    documents: [
      {
        item: "Bank statements",
        requirement: "₹4-5 lakhs balance (student's or parents' account) for 1-year expenses proof",
        validity: "3-6 months recent",
      },
      {
        item: "First semester tuition fee payment proof",
        requirement: "₹1.1-2.6 lakhs paid to university (prerequisite for invitation letter)",
        validity: "Current academic year",
      },
      {
        item: "Sponsorship letter (if applicable)",
        requirement: "Affidavit from sponsor + sponsor's bank statement + ID proof + relationship proof",
        validity: "Current",
      },
    ],
  },
];

const commonMistakes = [
  {
    mistake: "Applying to non-NMC approved universities",
    consequence: "Degree invalid in India despite 6 years investment and ₹35-50 lakh cost",
    howToAvoid: "Verify university on NMC's approved foreign medical institutions list at nmc.org.in before payment. Students Traffic maintains updated NMC-approved Russia university database verified monthly.",
    severity: "Critical",
  },
  {
    mistake: "Proceeding without valid NEET qualification",
    consequence: "Cannot appear for FMGE/NExT screening, cannot obtain NMC registration for India practice",
    howToAvoid: "Ensure NEET scorecard shows qualifying percentile (50th/40th) and is valid for 3 years from admission date. Verify NMC FMGL Regulations 2021 compliance.",
    severity: "Critical",
  },
  {
    mistake: "Missing apostille or incorrect translation",
    consequence: "Application rejection, visa denial, or registration issues upon arrival",
    howToAvoid: "All educational documents must be apostilled by MEA and translated to Russian by notary from Russian Embassy. Keep originals + apostilled copies + Russian translations in separate folders.",
    severity: "High",
  },
  {
    mistake: "Expired HIV certificate or wrong validity period",
    consequence: "Immediate visa rejection (most common documentation error)",
    howToAvoid: "HIV test must be conducted within 3 months before application submission. Certificate remains valid 15-30 days only. Time visa application accordingly.",
    severity: "High",
  },
  {
    mistake: "Leaving visa application to last minute",
    consequence: "Rushed processing, potential flight delays, admission year loss if visa denied",
    howToAvoid: "Start invitation letter process 2-3 months before course begins. Factor 20-45 days for invitation + 2-3 weeks for visa processing.",
    severity: "High",
  },
  {
    mistake: "Trusting fake agents with unrealistic promises",
    consequence: "Financial loss, admission to unrecognized universities, NEET bypass fraud",
    howToAvoid: "Red flags: '100% assured admission', 'no NEET required for India practice', 'guaranteed FMGE clearance'. Verify agent credentials and university recognition independently.",
    severity: "Critical",
  },
  {
    mistake: "Ignoring Russian language preparation",
    consequence: "Passive clinical training (Russian patients don't speak English), poor internship outcomes",
    howToAvoid: "Start basic Russian language learning from Year 1. Clinical effectiveness in Years 4-6 depends heavily on Russian communication ability.",
    severity: "Medium",
  },
  {
    mistake: "Underestimating total application process costs",
    consequence: "Financial stress mid-process, incomplete applications, delayed visa",
    howToAvoid: "Budget ₹2-3 lakhs for application process (excluding tuition): attestation ₹15,000-30,000, processing ₹1-1.5 lakhs, visa ₹4,000-8,000, flights ₹40,000-70,000.",
    severity: "Medium",
  },
];

const visaProcessSteps = [
  {
    step: "Obtain invitation letter",
    duration: "20-45 days (3-6 weeks)",
    requirements: [
      "Valid admission letter from Russian university",
      "First semester tuition fee payment confirmation",
      "Passport copy with 18 months validity",
    ],
    cost: "Included in university fees",
    notes: "Processed by Federal Migration Service via university. Start 2-3 months before course begins.",
  },
  {
    step: "Gather visa documents",
    duration: "1-2 weeks (if documents ready)",
    requirements: [
      "Original invitation letter from university",
      "Valid passport (18 months validity, 2 blank pages)",
      "HIV-negative certificate (within 3 months, original hard copy)",
      "Medical fitness certificate",
      "Health insurance (€30,000 minimum coverage)",
      "Educational transcripts (apostilled + translated)",
      "Bank statements (₹4-5 lakhs balance)",
      "15 passport photographs (35mm x 45mm specifications)",
      "NEET scorecard",
      "Signed visa application form",
    ],
    cost: "₹15,000-30,000 (attestation + translation)",
    notes: "All documents must match exactly across passport, application, and supporting papers.",
  },
  {
    step: "Submit visa application",
    duration: "1 day (appointment at VFS/Embassy)",
    requirements: [
      "Complete document set as per checklist",
      "Visa application fee payment",
    ],
    cost: "₹4,000-8,000",
    notes: "Book VFS appointment in advance. Generally no personal interview required for Indian students (90-95% success rate).",
  },
  {
    step: "Visa processing",
    duration: "2-3 weeks (standard) or 3-7 days (expedited)",
    requirements: [
      "Wait for embassy processing",
    ],
    cost: "Extra fee for expedited processing",
    notes: "Standard processing sufficient if started early. Expedite only if urgent.",
  },
  {
    step: "Collect passport with visa",
    duration: "1 day",
    requirements: [
      "Passport collection receipt",
    ],
    cost: "None",
    notes: "Verify visa details immediately: validity period, spelling of name, passport number accuracy.",
  },
  {
    step: "Post-arrival visa registration",
    duration: "Within 7 days of arrival",
    requirements: [
      "Fill 'Arrival Notification of Foreign Citizen' form",
      "Submit to Multifunctional Center (MFC) or Post Office",
      "University assists with this process",
    ],
    cost: "₹2,000-5,000 fine if not registered within 7 days",
    notes: "Mandatory registration with Federal Migration Service. Failure can result in deportation.",
  },
];

const faqItems = [
  {
    question: "How to apply for MBBS in Russia for Indian students?",
    answer:
      "The application process involves: (1) Research and shortlist NMC-approved universities (January-March ideal window); (2) Prepare documents including apostilled Class 10/12 certificates, NEET scorecard (50th/40th percentile), passport (18 months validity), and HIV-negative certificate (within 3 months); (3) Submit online application with translated documents; (4) Receive admission letter (5-10 days); (5) Pay first semester tuition fee; (6) Obtain invitation letter (20-45 days); (7) Apply for student visa (2-3 weeks); (8) Book flight after visa approval; (9) Arrive 1 week before classes for registration. Total timeline: 5-7 months from application to arrival.",
  },
  {
    question: "When should I start the application process for Russia MBBS?",
    answer:
      "Ideal application window is January-March (before NEET results) for September intake, though universities accept applications until August 30. Early application (before June) significantly improves chances of getting preferred universities, smooth visa processing, and seat availability since admissions operate on first-come, first-served basis. Start document apostille and translation process 3-4 months before application submission. The complete timeline spans 5-7 months, so starting in January ensures comfortable processing time.",
  },
  {
    question: "What documents are required for MBBS admission in Russia?",
    answer:
      "Mandatory documents include: (1) Academic: Class 10/12 mark sheets and certificates (apostilled by MEA + Russian translation), minimum 50% PCB for General category, 40% for SC/ST; (2) NEET: Valid scorecard showing 50th percentile (General) or 40th percentile (Reserved categories); (3) Passport with 18 months validity and 2 blank pages; (4) Medical: HIV-negative certificate (within 3 months, original hard copy), medical fitness certificate, health insurance (€30,000 coverage); (5) Financial: Bank statements showing ₹4-5 lakhs, first semester tuition fee payment proof; (6) 50 passport photographs (35mm x 45mm specifications). All documents must be apostilled and translated to Russian.",
  },
  {
    question: "How much does the Russia MBBS application process cost?",
    answer:
      "Total application process costs ₹2-3 lakhs excluding tuition: (1) Document attestation, apostille, and Russian translation: ₹15,000-30,000; (2) Admission and visa processing (consultancy, documentation support): ₹1-1.5 lakhs; (3) Visa application fee: ₹4,000-8,000; (4) Medical examination, HIV test, and health insurance: ₹8,000-15,000; (5) Flight tickets: ₹40,000-70,000 (return). Additionally, first semester tuition fee (₹1.1-2.6 lakhs) must be paid before invitation letter is issued. Budget ₹4-6 lakhs total for first-year expenses including application costs.",
  },
  {
    question: "Can I apply directly to Russian universities or do I need an agent?",
    answer:
      "Direct application is possible but comes with challenges: navigating Russian systems, language barriers, time differences, slow bureaucratic processes, and extensive documentation requirements. Agency-assisted applications provide: NMC-approved university verification, complete documentation support (apostille, translation), visa application guidance, pre-departure briefings, airport pickup arrangements, and ongoing support throughout the course. While not mandatory, agencies are highly recommended especially for first-time international students. At Students Traffic, we maintain updated NMC compliance databases and have processed 1,200+ Russia MBBS applications with 95%+ visa success rate.",
  },
  {
    question: "How long does the Russia student visa take to process?",
    answer:
      "The complete visa timeline includes: (1) Invitation letter processing: 20-45 days (3-6 weeks) by Federal Migration Service after first semester tuition payment; (2) Visa application preparation: 1-2 weeks (gathering documents, attestation, translation); (3) Visa processing: 2-3 weeks standard (can be expedited to 3-7 days with extra fee). Total timeline from tuition payment to visa approval: 6-10 weeks. Start the invitation letter process at least 2-3 months before course begins. Generally no personal interview required for Indian students (90-95% approval rate). Visa must be registered with FMS within 7 days of arrival in Russia.",
  },
  {
    question: "What are the most common mistakes in Russia MBBS applications?",
    answer:
      "Critical mistakes to avoid: (1) Applying to non-NMC approved universities (makes degree invalid in India despite ₹35-50 lakh investment); (2) Proceeding without valid NEET qualification (cannot obtain NMC registration for India practice); (3) Missing apostille or incorrect Russian translation (application rejection); (4) Expired HIV certificate (most common visa rejection - must be within 3 months, valid only 15-30 days); (5) Leaving visa application to last minute (rushed processing, potential admission year loss); (6) Trusting fake agents claiming '100% assured admission', 'no NEET required', or 'guaranteed FMGE clearance'; (7) Underestimating total costs (budget ₹2-3 lakhs for application process excluding tuition).",
  },
  {
    question: "How does Students Traffic help with Russia MBBS applications?",
    answer:
      "Students Traffic provides end-to-end application support: (1) NMC-approved university verification (monthly updated database); (2) Academic profile assessment and university shortlisting based on budget (₹35-50 lakhs total) and career goals; (3) Complete documentation guidance (apostille, translation, attestation) with checklist tracking; (4) Visa application support with 95%+ success rate; (5) Pre-departure briefings covering cultural adaptation, packing, Russian winter preparation; (6) Airport pickup coordination and on-arrival hostel assistance; (7) Connection to 1,200+ Russia MBBS graduates for first-hand insights. Our focus is NMC compliance verification and realistic expectation-setting rather than over-promising unrealistic outcomes.",
  },
];

export default function RussiaMbbsApplicationPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "How to Apply for MBBS in Russia 2026: Complete Application Guide",
      description:
        "Step-by-step Russia MBBS application guide for Indian students: timeline (January-August), required documents (NEET, apostille, HIV certificate), visa process (20-45 days), costs (₹2-3 lakhs), and common mistakes to avoid.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "How to Apply for MBBS in Russia",
        path: pagePath,
      },
    ]),
    getFaqStructuredData(faqItems, pagePath),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent/10 via-background to-background px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            Updated for 2026 intake cycle
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            How to apply for MBBS in Russia: Complete step-by-step guide
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground sm:text-2xl sm:leading-10">
            The complete Russia MBBS application process for Indian students: timeline (January-August), required documents, NMC compliance verification, visa processing (5-7 months total), and avoiding common mistakes that lead to application rejection or India-return complications.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/countries/russia"
              className="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
            >
              Read full Russia guide
            </Link>
            <CounsellingDialog
              triggerContent={<>Get application support</>}
              triggerClassName="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
              plainTrigger
              title="Need Russia MBBS application guidance?"
              description="Our team will help you verify NMC-approved universities, prepare complete documentation (apostille, translation), and navigate the visa process with 95%+ success rate."
              ctaVariant="application-russia-hero"
              courseSlug="mbbs"
              countrySlug="russia"
              notes="Interest: How to apply for MBBS in Russia - Application support"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/5 to-background p-8 sm:p-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Critical application insights
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              What families must understand about Russia MBBS applications
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {keyTakeaways.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-border/60 bg-background/80 p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-display text-xl font-bold text-accent">
                    {idx + 1}
                  </div>
                  <p className="text-base leading-7 text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-blue-900">
                  Students Traffic's application verification approach
                </p>
                <p className="mt-1 text-sm leading-6 text-blue-800">
                  At Students Traffic, we maintain a monthly-updated database of NMC-approved Russian medical universities and have processed 1,200+ Russia MBBS applications with 95%+ visa success rate. Our application support includes NMC compliance verification, complete documentation guidance (apostille, translation), visa processing assistance, and connection to current Russia MBBS students for first-hand campus insights. We verify every university against NMC's Foreign Medical Institutions list before shortlisting to avoid the critical mistake of admission to unrecognized institutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Application timeline: Month-by-month guide
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            The complete Russia MBBS application spans 5-7 months from submission to arrival. Understanding this timeline helps families plan documentation, finances, and avoid rushed processing.
          </p>

          <div className="mt-10 space-y-6">
            {applicationTimeline.map((phase, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="bg-gradient-to-r from-accent/10 to-background px-6 py-4 sm:px-8">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {phase.phase}
                    </h3>
                    <span className="rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-accent">
                      {phase.timeline}
                    </span>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <ul className="space-y-3">
                    {phase.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-3 text-base leading-7 text-foreground">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-2">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-amber-900">Critical action</p>
                        <p className="mt-1 text-sm leading-6 text-amber-800">{phase.criticalAction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Required documents checklist
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Complete documentation is critical for application approval. Missing apostille or expired HIV certificate are the most common rejection reasons. All documents must be apostilled by MEA and translated to Russian.
          </p>

          <div className="mt-10 space-y-8">
            {requiredDocumentCategories.map((category, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/30 px-6 py-4">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {category.category}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Document
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Requirement
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Validity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {category.documents.map((doc, dIdx) => (
                        <tr key={dIdx} className="hover:bg-muted/20">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            {doc.item}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {doc.requirement}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {doc.validity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Visa process: Step-by-step breakdown
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            The Russia student visa process takes 6-10 weeks total from tuition payment to approval. Understanding each step helps families plan timing and avoid rushed processing that leads to errors.
          </p>

          <div className="mt-10 space-y-6">
            {visaProcessSteps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 font-display text-xl font-bold text-accent">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        {step.step}
                      </h3>
                      <span className="rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-accent">
                        {step.duration}
                      </span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {step.requirements.map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <span className="font-semibold text-foreground">Cost: {step.cost}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{step.notes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Common mistakes and how to avoid them
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Understanding these common application mistakes helps families avoid costly errors that lead to rejection, financial loss, or India-return complications despite ₹35-50 lakh investment.
          </p>

          <div className="mt-10 space-y-6">
            {commonMistakes.map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="flex items-start gap-6 p-6 sm:p-8">
                  <div className="flex-shrink-0">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        item.severity === "Critical"
                          ? "bg-red-100 text-red-600"
                          : item.severity === "High"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.severity === "Critical"
                            ? "bg-red-100 text-red-700"
                            : item.severity === "High"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.severity} Severity
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                      {item.mistake}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      <strong className="text-foreground">Consequence:</strong> {item.consequence}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-foreground">
                      <strong>How to avoid:</strong> {item.howToAvoid}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>

          <div className="mt-10 space-y-4">
            {faqItems.map((item, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-border bg-card shadow-sm"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 p-6 font-display text-lg font-semibold text-foreground transition hover:text-accent">
                  <span className="flex-1">{item.question}</span>
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground transition group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="border-t border-border px-6 pb-6 pt-4">
                  <p className="text-base leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Need application and visa support?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Students Traffic provides end-to-end Russia MBBS application support: NMC compliance verification, documentation guidance (apostille, translation), visa processing assistance with 95%+ success rate, and connection to current Russia MBBS students for campus insights.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CounsellingDialog
              triggerContent={<>Talk to application counsellor</>}
              triggerClassName="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
              plainTrigger
              title="Russia MBBS application consultation"
              description="Share your academic profile (Class 12 marks, NEET score) and budget. We'll help you with NMC-approved university shortlisting, complete documentation, and visa processing."
              ctaVariant="application-russia-bottom"
              courseSlug="mbbs"
              countrySlug="russia"
              notes="Interest: How to apply for MBBS in Russia - Bottom application support CTA"
            />
            <Link
              href="/countries/russia"
              className="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
            >
              Read full Russia guide
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
