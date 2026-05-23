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

const pagePath = "/education-loan-for-mbbs-in-russia";
const publishedDate = "2026-05-23";

const keyTakeaways = [
  "Russia MBBS total cost (₹35-50 lakhs for 6 years) is fundable through secured loans (₹7.5 lakhs+, 8.25-11.5% p.a. interest with property/FD collateral) or unsecured loans (up to ₹7.5 lakhs from PSU banks, ₹50 lakhs-₹1 crore from private banks/NBFCs at 11-17% p.a.). Government schemes like PM-Vidyalaxmi offer collateral-free loans with 3% interest subsidy for families earning up to ₹8 lakhs annually on loans up to ₹10 lakhs.",
  "Loan approval requires NMC-approved university admission letter (impossible to get loan without this), minimum 50% Class 12 PCB marks, valid NEET scorecard, co-applicant with ₹30,000-50,000+ monthly income, and CIBIL score 685+ (ideally 750+). Application timeline: 2-4 weeks for public sector banks (SBI, Bank of Baroda), 2-3 weeks for private banks (HDFC, ICICI), 7-14 days for NBFCs (Credila, Avanse, Auxilo).",
  "Repayment begins after course completion plus 6 months-1 year moratorium, with 10-15 year tenure typical. For a ₹40 lakh loan at 10% p.a. over 15 years, EMI is approximately ₹43,000/month. Section 80E tax benefit allows full interest deduction (no upper limit) for up to 8 years, saving ₹30,000-80,000 annually depending on tax bracket. Total interest paid over loan lifetime can be 40-70% of principal amount.",
];

const loanTypes = [
  {
    type: "Secured Loans (With Collateral)",
    loanAmount: "₹7.5 lakhs - ₹1.5 crores",
    interestRate: "8.25% - 11.5% p.a.",
    requirements: "Property, FDs (75-80% LTV), NSC (up to 100%), LIC policies (75-100%), government securities worth 110-150% of loan",
    bestFor: "Loans above ₹7.5 lakhs where family owns property or substantial FDs",
    examples: "SBI (8.55-11.15%), Bank of Baroda (8.55%+), Canara Bank (7.25-10.10%)",
  },
  {
    type: "Unsecured Loans (Without Collateral)",
    loanAmount: "₹7.5 lakhs (PSU banks), up to ₹1 crore (private banks/NBFCs)",
    interestRate: "11% - 17% p.a.",
    requirements: "Third-party guarantor (₹4-7.5 lakh range), strong co-applicant income (₹30,000-50,000+/month), CIBIL 700+",
    bestFor: "Families without property collateral or seeking faster processing (7-14 days NBFCs)",
    examples: "ICICI (up to ₹1 crore at 11.25%+), Avanse (16.5-19.5%), Auxilo (9.5-14%)",
  },
  {
    type: "PM-Vidyalaxmi Scheme",
    loanAmount: "Up to full tuition + expenses",
    interestRate: "Market rates - 3% subsidy (families earning ≤₹8 lakhs on loans ≤₹10 lakhs)",
    requirements: "Collateral-free, guarantor-free, NMC-approved university admission, family income documentation",
    bestFor: "Families earning up to ₹8 lakhs annually seeking subsidized loans without collateral",
    examples: "₹3,600 crore outlay (2024-31), unified portal for streamlined application",
  },
  {
    type: "CSIS (Interest Subsidy)",
    loanAmount: "Any amount",
    interestRate: "Full interest subsidy during moratorium",
    requirements: "Family income up to ₹4.5 lakhs annually",
    bestFor: "Economically weaker sections where government pays all interest during course period + 1 year",
    examples: "Operational since 2009, covers course duration plus one year moratorium",
  },
  {
    type: "NBFC Fast-Track Loans",
    loanAmount: "Up to ₹50 lakhs+ without collateral",
    interestRate: "9.5% - 19.5% p.a.",
    requirements: "Admission letter, CIBIL 700+, income proof, faster processing (7-14 days, some 48 hours)",
    bestFor: "Urgent funding needs, bank rejections due to collateral absence, faster approval needed",
    examples: "HDFC Credila (48-hour priority), Avanse (7 days), Auxilo (7 days), InCred (11-13.5%)",
  },
];

const majorLenders = [
  {
    lender: "State Bank of India (SBI)",
    loanLimit: "Up to ₹1.5 crores",
    interestRate: "8.55% - 11.15% p.a.",
    processing: "4-8 weeks",
    highlights: [
      "Global Ed-Vantage and Scholar Loan schemes",
      "10% margin for Global Ed scheme",
      "No processing fee up to ₹20 lakhs",
      "Most trusted PSU bank with extensive branch network",
    ],
    suitable: "Families with property collateral seeking lowest interest rates and established banking relationships",
  },
  {
    lender: "Bank of Baroda",
    loanLimit: "Up to ₹80 lakhs (highest PSU limit)",
    interestRate: "8.55%+ p.a.",
    processing: "3-6 weeks",
    highlights: [
      "Baroda Scholar scheme specialized for education",
      "No processing fee up to ₹7.5 lakhs",
      "Strong international education loan experience",
      "0.50% interest concession for female students",
    ],
    suitable: "Higher loan amounts (₹40-80 lakhs) with property collateral, female students seeking concession",
  },
  {
    lender: "HDFC Bank",
    loanLimit: "Up to ₹1.5 crores",
    interestRate: "9.5% - 11.5% p.a.",
    processing: "2-3 weeks",
    highlights: [
      "15-year repayment tenure",
      "0% loan margin for tuition fees",
      "No processing fee up to ₹7.5 lakhs",
      "Faster approval than PSU banks",
    ],
    suitable: "Families seeking faster processing (2-3 weeks) with competitive private bank rates",
  },
  {
    lender: "ICICI Bank",
    loanLimit: "Up to ₹2 crores (₹1 crore unsecured)",
    interestRate: "10.25%+ p.a. secured, 11.25%+ unsecured",
    processing: "2-3 weeks",
    highlights: [
      "Highest unsecured loan limit (₹1 crore)",
      "Strong digital application process",
      "Specialized education loan division",
      "Pre-approved offers for existing customers",
    ],
    suitable: "Families without collateral seeking unsecured loans up to ₹1 crore with faster processing",
  },
  {
    lender: "HDFC Credila",
    loanLimit: "Varies by university (up to ₹50 lakhs+)",
    interestRate: "Competitive floating rates",
    processing: "48 hours for priority universities, 2-3 weeks standard",
    highlights: [
      "Covers WFME-listed universities (includes NMC-approved Russia)",
      "48-hour processing for priority list",
      "Up to 10-year repayment",
      "Specialized MBBS abroad expertise",
    ],
    suitable: "Urgent funding needs with NMC-approved university admission, seeking NBFC speed with competitive rates",
  },
  {
    lender: "Avanse / Auxilo / InCred",
    loanLimit: "Up to ₹50 lakhs+ unsecured",
    interestRate: "Avanse 16.5-19.5%, Auxilo 9.5-14%, InCred 11-13.5%",
    processing: "7-14 days (some 24-48 hours)",
    highlights: [
      "Fastest approval (7-14 days)",
      "No collateral required for most amounts",
      "Flexible eligibility criteria",
      "Specialized in education sector",
    ],
    suitable: "Bank rejections, urgent funding, families without collateral, flexible credit profiles",
  },
];

const loanCoverageBreakdown = [
  {
    category: "Tuition Fees",
    covered: "100% (largest expense)",
    typical: "₹2.2-5.2 lakhs/year × 6 years = ₹13-31 lakhs",
    notes: "Direct transfer to university account, disbursed semester-wise or annually per fee schedule",
  },
  {
    category: "Living Expenses",
    covered: "Hostel fees, food, local transport",
    typical: "₹84,000-₹2.4 lakhs/year (₹7,000-20,000/month hostel) + ₹1-1.5 lakhs/year food",
    notes: "Disbursed to student account periodically (quarterly/semester), some lenders cap living expenses at 20-30% of tuition",
  },
  {
    category: "Travel",
    covered: "One economy return ticket to Russia",
    typical: "₹40,000-70,000 (return flight)",
    notes: "Pre-departure disbursement, some lenders allow annual visit tickets (verify with lender)",
  },
  {
    category: "Books & Equipment",
    covered: "Textbooks, laptop, medical equipment",
    typical: "₹50,000-₹1.5 lakhs over 6 years",
    notes: "Disbursed per documented requirements, most lenders require receipts for reimbursement",
  },
  {
    category: "Miscellaneous",
    covered: "Exam fees, library, health insurance, study tours",
    typical: "₹20,000-50,000/year",
    notes: "Caution deposits (up to 10% of tuition), health insurance if applicable, covered per lender policy",
  },
  {
    category: "Total Loan Requirement",
    covered: "Full Russia MBBS expenses",
    typical: "₹35-50 lakhs for 6-year program",
    notes: "Margin money: 15% standard (student/family pays ₹5.25-7.5 lakhs upfront for ₹35-50 lakh total cost)",
  },
];

const approvalChecklist = [
  {
    requirement: "NMC-approved university admission",
    why: "Loan impossible without admission letter from recognized institution",
    howToVerify: "Check university on NMC's Foreign Medical Institutions list at nmc.org.in before applying",
    impact: "Critical - Application rejected immediately without proper admission proof",
  },
  {
    requirement: "Minimum 50% Class 12 PCB marks",
    why: "Banks assess academic capability and default risk based on performance",
    howToVerify: "Class 12 mark sheets showing Physics, Chemistry, Biology aggregate",
    impact: "High - Below 50% reduces approval chances significantly",
  },
  {
    requirement: "Valid NEET scorecard",
    why: "NMC mandates NEET for India-return pathway; banks verify regulatory compliance",
    howToVerify: "NEET scorecard showing 50th percentile (General) or 40th percentile (Reserved) within 3-year validity",
    impact: "Critical - Without NEET, banks reject loan as degree becomes unusable in India",
  },
  {
    requirement: "Co-applicant income ₹30,000-50,000+/month",
    why: "Banks assess repayment capacity based on family income and FOIR (below 40%)",
    howToVerify: "Last 3 months salary slips + 6-month bank statements + ITRs (2-3 years)",
    impact: "High - Insufficient income leads to rejection or requires additional guarantor",
  },
  {
    requirement: "CIBIL score 685+ (ideally 750+)",
    why: "Credit history determines approval odds and interest rates offered",
    howToVerify: "Check co-applicant CIBIL score at cibil.com or paisabazaar.com before applying",
    impact: "Critical - Below 650 almost always rejected; 685-700 marginal approval; 750+ best rates",
  },
  {
    requirement: "Collateral for loans above ₹7.5 lakhs",
    why: "Banks mitigate default risk with property/FDs worth 110-150% of loan",
    howToVerify: "Property title deed + encumbrance certificate, or FD certificates for 75-80% LTV",
    impact: "High - Without collateral, limited to ₹7.5 lakhs PSU or higher-interest NBFCs",
  },
];

const emiCalculationExamples = [
  {
    loanAmount: "₹20 lakhs",
    interestRate: "10% p.a.",
    tenure: "10 years",
    monthlyEMI: "₹26,000",
    totalInterest: "₹11.2 lakhs",
    totalRepayment: "₹31.2 lakhs",
    notes: "Suitable for low-cost universities (₹2,800-3,500 USD/year tuition), manageable EMI for ₹50,000+ household income",
  },
  {
    loanAmount: "₹30 lakhs",
    interestRate: "10% p.a.",
    tenure: "10 years",
    monthlyEMI: "₹39,000",
    totalInterest: "₹16.8 lakhs",
    totalRepayment: "₹46.8 lakhs",
    notes: "Mid-range Russia MBBS total cost, requires ₹80,000+ household income for comfortable repayment",
  },
  {
    loanAmount: "₹40 lakhs",
    interestRate: "10% p.a.",
    tenure: "15 years",
    monthlyEMI: "₹43,000",
    totalInterest: "₹37.4 lakhs",
    totalRepayment: "₹77.4 lakhs",
    notes: "Higher-cost universities or premium accommodation, 15-year tenure reduces monthly burden but increases total interest",
  },
  {
    loanAmount: "₹40 lakhs",
    interestRate: "10% p.a.",
    tenure: "10 years",
    monthlyEMI: "₹52,000",
    totalInterest: "₹22.4 lakhs",
    totalRepayment: "₹62.4 lakhs",
    notes: "Shorter tenure saves ₹15 lakhs in interest vs 15-year option, but requires ₹1 lakh+ household income",
  },
];

const faqItems = [
  {
    question: "Can I get an education loan for MBBS in Russia without collateral?",
    answer:
      "Yes, unsecured loans are available: (1) Public sector banks (SBI, Bank of Baroda) offer up to ₹7.5 lakhs without collateral, requiring third-party guarantor for ₹4-7.5 lakh range; (2) Private banks (ICICI, Axis) and NBFCs (Avanse, Auxilo, HDFC Credila) offer ₹50 lakhs to ₹1 crore unsecured loans at 11-17% p.a. interest; (3) PM-Vidyalaxmi scheme provides collateral-free, guarantor-free loans with 3% interest subsidy for families earning up to ₹8 lakhs annually. Without collateral loans require stronger co-applicant profile (CIBIL 700+, ₹50,000+ monthly income) and charge 2-5% higher interest than secured loans.",
  },
  {
    question: "What is the interest rate for education loan for MBBS in Russia?",
    answer:
      "Interest rates vary by loan type and lender: (1) Secured loans (with property/FD collateral): 8.25-11.5% p.a. from public sector banks (SBI 8.55-11.15%, Canara 7.25-10.10%), 9.5-11.5% from private banks; (2) Unsecured loans (without collateral): 11-17% p.a. from banks, 9.5-19.5% from NBFCs (Auxilo 9.5-14%, Avanse 16.5-19.5%); (3) Government schemes: PM-Vidyalaxmi offers 3% interest subsidy (families earning ≤₹8 lakhs on loans ≤₹10 lakhs), CSIS provides full interest subsidy during moratorium for families earning ≤₹4.5 lakhs. Lower rates require CIBIL score 750+, property collateral, and strong co-applicant income.",
  },
  {
    question: "How much education loan can I get for MBBS in Russia?",
    answer:
      "Loan amounts depend on lender type and collateral: (1) Public sector banks: Up to ₹7.5 lakhs unsecured, ₹80 lakhs-₹1.5 crores secured (SBI ₹1.5 crores, Bank of Baroda ₹80 lakhs); (2) Private banks: HDFC ₹1.5 crores, ICICI ₹2 crores (₹1 crore unsecured); (3) NBFCs: ₹50 lakhs+ unsecured from Credila, Avanse, Auxilo. Russia MBBS total cost is ₹35-50 lakhs for 6 years (tuition ₹13-31 lakhs + living ₹10-15 lakhs + travel, books, misc ₹5-8 lakhs). Most families take ₹30-40 lakh loans covering 85% of total cost (15% margin money paid upfront).",
  },
  {
    question: "What documents are required for Russia MBBS education loan?",
    answer:
      "Required documents include: (1) Admission: NMC-approved university offer letter (impossible to get loan without this), fee structure, academic transcripts; (2) Student: Class 10/12 mark sheets (minimum 50% PCB), NEET scorecard (mandatory for India return), passport, identity/address proof; (3) Financial: Co-applicant's last 3 months salary slips + 6-month bank statements + ITRs (2-3 years), or business proof + ITRs for self-employed; (4) Collateral (if applicable): Property title deed + tax receipts + valuation report + encumbrance certificate, or FD/LIC/NSC certificates; (5) Co-borrower/guarantor: Identity proof, address proof, income proof, credit history. Complete documentation is critical - missing papers delay approval by 2-4 weeks.",
  },
  {
    question: "How long does education loan approval take for Russia MBBS?",
    answer:
      "Approval timeline varies by lender: (1) Public sector banks: 2-4 weeks after complete document submission (SBI 4-8 weeks, Bank of Baroda 3-6 weeks); (2) Private banks: 2-3 weeks (HDFC, ICICI); (3) NBFCs: 7-14 days standard (Avanse, Auxilo), 24-48 hours for priority universities (HDFC Credila for NMC-approved institutions). Disbursement adds 1-2 weeks: tuition transferred directly to university, living expenses to student account per agreed schedule. Start application immediately upon receiving admission letter (don't wait for fee deadline) to allow 6-8 week buffer for approval, disbursement, and university payment confirmation before departure.",
  },
  {
    question: "What is the EMI for ₹40 lakh education loan for Russia MBBS?",
    answer:
      "For ₹40 lakh loan at 10% p.a. interest: (1) 10-year tenure: ₹52,000/month EMI, ₹22.4 lakhs total interest, ₹62.4 lakhs total repayment (requires ₹1 lakh+ household income); (2) 15-year tenure: ₹43,000/month EMI, ₹37.4 lakhs total interest, ₹77.4 lakhs total repayment (lower monthly burden but ₹15 lakhs extra interest). Repayment begins after course completion (6 years) plus moratorium period (6 months-1 year grace), meaning first EMI starts 7-8 years after loan disbursement. During course, interest accrues (simple or compound depending on lender) and is capitalized to principal at repayment start. Section 80E tax benefit allows full interest deduction, saving ₹30,000-80,000 annually depending on tax bracket.",
  },
  {
    question: "Can I get tax benefits on education loan for Russia MBBS?",
    answer:
      "Yes, Section 80E of Income Tax Act allows full deduction on interest paid (not principal) for education loans: (1) No upper limit on deductible interest amount; (2) Available for maximum 8 years or until interest is fully repaid, whichever is earlier; (3) Claimable by individual taxpayers (student, parents, or guardian who took the loan); (4) Applicable only under old tax regime (not new regime); (5) Loan must be from recognized financial institution or approved charitable trust. For example, ₹40 lakh loan at 10% p.a. generates ₹2-4 lakhs annual interest during initial repayment years, allowing ₹60,000-₹1.2 lakh tax savings (depending on 30% or higher tax bracket). This benefit significantly reduces effective loan cost over the 8-year deduction period.",
  },
  {
    question: "How does Students Traffic help with Russia MBBS education loans?",
    answer:
      "Students Traffic provides loan facilitation support: (1) Lender comparison across 15+ banks and NBFCs based on family's financial profile (income, collateral availability, CIBIL score); (2) NMC compliance verification ensuring university appears on lender's approved list (critical for loan approval); (3) Documentation guidance for complete submission (admission letter, financial proofs, collateral papers) to avoid 2-4 week delays; (4) Co-applicant profile optimization advising on CIBIL improvement, guarantor selection, and collateral arrangement; (5) EMI and ROI modeling showing total repayment cost across different loan structures (10 vs 15 year tenure, secured vs unsecured); (6) Connection to loan-assisted Russia MBBS students sharing first-hand repayment experiences and financial planning strategies. We work with families to secure loans matching their budget (₹35-50 lakh total cost) with optimal terms rather than pushing highest-commission lenders.",
  },
];

export default function RussiaMbbsEducationLoanPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Education Loan for MBBS in Russia 2026: Complete Financing Guide",
      description:
        "Comprehensive Russia MBBS education loan guide: loan types (secured 8.25-11.5%, unsecured 11-17%), amounts (₹7.5 lakhs-₹1.5 crores), government schemes (PM-Vidyalaxmi, CSIS), lenders (SBI, HDFC, Credila), documentation, approval timeline, EMI calculations, and tax benefits for Indian students.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Education Loan for MBBS in Russia",
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
            Updated with 2026 loan schemes
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Education loan for MBBS in Russia: Complete financing guide
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground sm:text-2xl sm:leading-10">
            Comprehensive guide to funding Russia MBBS (₹35-50 lakhs total cost): loan types (secured 8.25-11.5%, unsecured 11-17%), government schemes (PM-Vidyalaxmi 3% subsidy, CSIS full interest waiver), major lenders, documentation, approval timeline (2-8 weeks), EMI calculations, and Section 80E tax benefits.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/countries/russia"
              className="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
            >
              Read full Russia guide
            </Link>
            <CounsellingDialog
              triggerContent={<>Get loan facilitation support</>}
              triggerClassName="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
              plainTrigger
              title="Need Russia MBBS education loan guidance?"
              description="Our team will help you compare lenders, verify NMC compliance, optimize documentation, and secure loans matching your family's financial profile with optimal terms."
              ctaVariant="loan-russia-hero"
              courseSlug="mbbs"
              countrySlug="russia"
              notes="Interest: Education loan for MBBS in Russia - Loan facilitation support"
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
              Critical loan insights
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              What families must understand about Russia MBBS education loans
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
                  Students Traffic's loan facilitation approach
                </p>
                <p className="mt-1 text-sm leading-6 text-blue-800">
                  At Students Traffic, we help families compare 15+ banks and NBFCs based on financial profile (income, collateral, CIBIL score) rather than pushing highest-commission lenders. Our loan facilitation includes NMC compliance verification (ensuring university appears on lender's approved list), documentation optimization (complete submission avoiding 2-4 week delays), co-applicant profile guidance (CIBIL improvement, guarantor selection), and EMI modeling showing total repayment cost across different structures (10 vs 15 year tenure, secured vs unsecured). We connect families with loan-assisted Russia MBBS students sharing repayment experiences and financial planning strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Education loan types: Comparison & suitability
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Russia MBBS (₹35-50 lakhs total cost) is fundable through multiple loan types with different interest rates, amounts, and requirements. Understanding each type helps families choose optimal financing matching their financial profile.
          </p>

          <div className="mt-10 space-y-6">
            {loanTypes.map((type, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="bg-gradient-to-r from-accent/10 to-background px-6 py-4 sm:px-8">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {type.type}
                    </h3>
                    <span className="rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-accent">
                      {type.interestRate}
                    </span>
                  </div>
                </div>
                <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Loan Amount</p>
                    <p className="mt-1 text-base font-medium text-foreground">{type.loanAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Requirements</p>
                    <p className="mt-1 text-sm leading-6 text-foreground">{type.requirements}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm font-semibold text-muted-foreground">Best For</p>
                    <p className="mt-1 text-sm leading-6 text-foreground">{type.bestFor}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm font-semibold text-muted-foreground">Examples</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{type.examples}</p>
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
            Major lenders: Banks & NBFCs comparison
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Each lender has different loan limits, interest rates, processing times, and specializations. Choosing the right lender based on family's financial profile (collateral availability, income, CIBIL score, urgency) optimizes loan terms and approval chances.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {majorLenders.map((lender, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {lender.lender}
                  </h3>
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                    {lender.processing}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Loan Limit</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{lender.loanLimit}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Interest Rate</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{lender.interestRate}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted-foreground">Highlights</p>
                  <ul className="mt-2 space-y-1.5">
                    {lender.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-xs leading-5 text-foreground">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-foreground">Best suited for:</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{lender.suitable}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Loan coverage breakdown: What's included
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Russia MBBS education loans cover tuition, living expenses, travel, books, and miscellaneous costs. Understanding coverage helps families plan accurate loan amounts and margin money (15% standard for abroad studies).
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Expense Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Coverage
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Typical Cost
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Disbursement Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loanCoverageBreakdown.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {row.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {row.covered}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-accent">
                        {row.typical}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Loan approval checklist: Critical requirements
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Meeting these requirements improves approval chances significantly. Missing any critical requirement (NMC approval, NEET scorecard, minimum CIBIL score) leads to immediate rejection regardless of other factors.
          </p>

          <div className="mt-10 space-y-6">
            {approvalChecklist.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 font-display text-lg font-bold text-accent">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {item.requirement}
                    </h3>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Why Required</p>
                        <p className="mt-1 text-sm leading-6 text-foreground">{item.why}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">How to Verify</p>
                        <p className="mt-1 text-sm leading-6 text-foreground">{item.howToVerify}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                      <p className="text-sm leading-6 text-amber-900">
                        <strong>Impact:</strong> {item.impact}
                      </p>
                    </div>
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
            EMI calculations: Monthly repayment examples
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Understanding EMI helps families plan post-graduation finances. Repayment begins after course completion (6 years) plus moratorium (6 months-1 year), meaning first EMI starts 7-8 years after loan disbursement. Choose tenure balancing monthly affordability with total interest cost.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {emiCalculationExamples.map((example, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {example.loanAmount} Loan
                  </h3>
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-accent">
                    {example.tenure}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{example.interestRate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly EMI</p>
                    <p className="mt-1 text-base font-semibold text-accent">{example.monthlyEMI}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Interest</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{example.totalInterest}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Repayment</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{example.totalRepayment}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs leading-5 text-muted-foreground">{example.notes}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-green-900">
                  Section 80E tax benefit reduces effective cost
                </p>
                <p className="mt-1 text-sm leading-6 text-green-800">
                  Interest deduction (no upper limit) for up to 8 years saves ₹30,000-80,000 annually depending on tax bracket. For ₹40 lakh loan generating ₹2-4 lakhs annual interest during initial repayment, 30% bracket taxpayer saves ₹60,000-₹1.2 lakh per year, totaling ₹4.8-9.6 lakhs over 8-year deduction period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
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
            Need education loan facilitation support?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Students Traffic helps families compare 15+ lenders, verify NMC compliance, optimize documentation, and secure loans matching their financial profile with optimal terms (secured vs unsecured, 10 vs 15 year tenure, tax benefit maximization).
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CounsellingDialog
              triggerContent={<>Talk to loan counsellor</>}
              triggerClassName="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
              plainTrigger
              title="Russia MBBS education loan consultation"
              description="Share your financial profile (income, collateral availability, CIBIL score). We'll help you identify optimal lenders, prepare documentation, and model EMI structures matching your budget."
              ctaVariant="loan-russia-bottom"
              courseSlug="mbbs"
              countrySlug="russia"
              notes="Interest: Education loan for MBBS in Russia - Bottom loan facilitation CTA"
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
