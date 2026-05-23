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

const pagePath = "/mbbs-in-russia-fees";
const publishedDate = "2026-05-23";

const keyTakeaways = [
  "MBBS in Russia fees range from ₹2.6-15 lakhs per year tuition across 50+ NMC-approved universities. Budget universities (Sevastopol ₹2.6L, Ural State ₹2.95L, North Ossetian ₹3.1L) offer the lowest fees, mid-range universities (Bashkir ₹4.32L, Kursk ₹4.5L, Volgograd ₹4L) provide balanced cost-quality, while premium universities (Kazan Federal ₹5.94L, RUDN ₹8.5L, First Moscow State ₹10L) command higher fees for top rankings and Moscow/St. Petersburg location.",
  "Total 6-year cost including tuition, hostel, food, travel, and expenses: ₹28-34 lakhs (budget scenario in tier-2 cities), ₹43-52 lakhs (medium budget at federal universities), or ₹71-103 lakhs (premium Moscow/SPB universities). This is 50-70% cheaper than Indian private medical colleges charging ₹60 lakhs-₹2.2 crores, making Russia the most cost-effective MBBS option for students who didn't secure government college seats.",
  "Hidden costs families must budget: one-time Year 1 expenses (₹2-3.7 lakhs for visa, document attestation, flights, winter clothing, settlement), annual recurring costs (₹58,000-1.3 lakhs for insurance, study materials, travel home), city-specific variations (Moscow living costs ₹36-59 lakhs over 6 years vs Crimea ₹13-21 lakhs), and currency fluctuation impacts (5-7% annual USD-INR variation affecting total cost by ₹1.6-3.2 lakhs).",
];

const universityFees = [
  {
    university: "Sevastopol State University",
    city: "Sevastopol",
    tier: "Budget",
    annualTuition: "₹2,60,000",
    sixYearTuition: "₹15,60,000",
    annualHostel: "₹36,000-60,000",
    sixYearTotal: "₹17,76,000-20,16,000",
    nmc: "Yes",
  },
  {
    university: "Ural State Medical University",
    city: "Yekaterinburg",
    tier: "Budget",
    annualTuition: "₹2,95,000",
    sixYearTuition: "₹17,70,000",
    annualHostel: "₹40,000",
    sixYearTotal: "₹20,10,000",
    nmc: "Yes",
  },
  {
    university: "North Ossetian State Medical Academy",
    city: "Vladikavkaz",
    tier: "Budget",
    annualTuition: "₹3,10,000",
    sixYearTuition: "₹18,60,000",
    annualHostel: "₹36,000",
    sixYearTotal: "₹20,76,000",
    nmc: "Yes",
  },
  {
    university: "Tula State University",
    city: "Tula",
    tier: "Budget",
    annualTuition: "₹2,80,000",
    sixYearTuition: "₹16,80,000",
    annualHostel: "₹25,000",
    sixYearTotal: "₹18,30,000",
    nmc: "Yes",
  },
  {
    university: "Crimea Federal University",
    city: "Simferopol",
    tier: "Mid-range",
    annualTuition: "₹3,54,000",
    sixYearTuition: "₹21,24,000",
    annualHostel: "₹50,000",
    sixYearTotal: "₹24,24,000",
    nmc: "Yes",
  },
  {
    university: "St. Petersburg State Medical University",
    city: "St. Petersburg",
    tier: "Mid-range",
    annualTuition: "₹3,30,000",
    sixYearTuition: "₹19,80,000",
    annualHostel: "₹60,000",
    sixYearTotal: "₹23,40,000",
    nmc: "Yes",
  },
  {
    university: "Bashkir State Medical University",
    city: "Ufa",
    tier: "Mid-range",
    annualTuition: "₹4,32,000",
    sixYearTuition: "₹25,92,000",
    annualHostel: "₹50,000",
    sixYearTotal: "₹28,92,000",
    nmc: "Yes",
  },
  {
    university: "Kursk State Medical University",
    city: "Kursk",
    tier: "Mid-range",
    annualTuition: "₹4,50,000",
    sixYearTuition: "₹27,00,000",
    annualHostel: "₹55,000",
    sixYearTotal: "₹30,30,000",
    nmc: "Yes",
  },
  {
    university: "Volgograd State Medical University",
    city: "Volgograd",
    tier: "Mid-range",
    annualTuition: "₹4,00,000",
    sixYearTuition: "₹24,00,000",
    annualHostel: "₹55,000",
    sixYearTotal: "₹27,30,000",
    nmc: "Yes",
  },
  {
    university: "Perm State Medical University",
    city: "Perm",
    tier: "Mid-range",
    annualTuition: "₹4,00,000",
    sixYearTuition: "₹24,00,000",
    annualHostel: "₹42,000",
    sixYearTotal: "₹26,52,000",
    nmc: "Yes",
  },
  {
    university: "Kazan Federal University",
    city: "Kazan",
    tier: "Federal",
    annualTuition: "₹5,94,000",
    sixYearTuition: "₹35,64,000",
    annualHostel: "₹16,000",
    sixYearTotal: "₹36,60,000",
    nmc: "Yes",
  },
  {
    university: "RUDN University",
    city: "Moscow",
    tier: "Premium",
    annualTuition: "₹8,50,000",
    sixYearTuition: "₹51,00,000",
    annualHostel: "₹1,70,000",
    sixYearTotal: "₹61,20,000",
    nmc: "Yes",
  },
  {
    university: "First Moscow State Medical University",
    city: "Moscow",
    tier: "Premium",
    annualTuition: "₹10,00,000",
    sixYearTuition: "₹60,00,000",
    annualHostel: "₹2,00,000",
    sixYearTotal: "₹72,00,000",
    nmc: "Yes",
  },
];

const totalCostScenarios = [
  {
    scenario: "Budget (Tier-2 City)",
    examples: "Sevastopol, Ural State, North Ossetian, Tula",
    year1Breakdown: [
      "Tuition: ₹2.6-3L",
      "Hostel: ₹36,000-60,000",
      "Food (self-cooking): ₹54,000-72,000",
      "Transport: ₹12,000",
      "Mobile/Internet: ₹6,000",
      "Personal: ₹24,000",
      "One-time expenses: ₹2L",
      "Insurance: ₹10,000",
    ],
    year1Total: "₹6.02-7.14 lakhs",
    annualYears2to6: "₹4.57-5.39 lakhs",
    sixYearGrandTotal: "₹28.87-34.09 lakhs",
    savings: "₹31-70 lakhs vs Indian private colleges",
  },
  {
    scenario: "Medium (Federal Universities)",
    examples: "Bashkir, Kursk, Perm, Crimea, Volgograd",
    year1Breakdown: [
      "Tuition: ₹4-5L",
      "Hostel: ₹50,000-80,000",
      "Food (Indian mess): ₹96,000-1.2L",
      "Transport: ₹18,000",
      "Mobile/Internet: ₹8,000",
      "Personal: ₹36,000",
      "One-time expenses: ₹2.5L",
      "Insurance: ₹12,000",
    ],
    year1Total: "₹8.7-10.24 lakhs",
    annualYears2to6: "₹6.9-8.44 lakhs",
    sixYearGrandTotal: "₹43.2-52.44 lakhs",
    savings: "₹17-62 lakhs vs Indian private colleges",
  },
  {
    scenario: "Premium (Moscow/Top-Tier)",
    examples: "Kazan Federal, RUDN, First Moscow State",
    year1Breakdown: [
      "Tuition: ₹8-12L",
      "Hostel (Moscow): ₹1.2-2L",
      "Food (mixed): ₹1.2-1.8L",
      "Transport: ₹30,000",
      "Mobile/Internet: ₹14,000",
      "Personal: ₹48,000",
      "One-time expenses: ₹3L",
      "Insurance: ₹15,000",
    ],
    year1Total: "₹14.47-19.87 lakhs",
    annualYears2to6: "₹11.32-16.72 lakhs",
    sixYearGrandTotal: "₹71.07-103.47 lakhs",
    savings: "₹0-47 lakhs vs Indian private colleges (comparable)",
  },
];

const hiddenCosts = [
  {
    category: "One-Time Year 1 Expenses",
    items: [
      "Visa fees & processing: ₹5,000-12,000",
      "Document attestation (MEA apostille): ₹5,000-15,000",
      "Translation to Russian: ₹8,000-15,000",
      "Medical examination & HIV test: ₹5,000-10,000",
      "Flight tickets (India-Russia return): ₹35,000-80,000",
      "Winter clothing essentials: ₹15,000-25,000",
      "Initial settlement (bedding, utensils): ₹10,000-15,000",
    ],
    total: "₹1.2-3.7 lakhs",
    notes: "These costs are incurred once in Year 1 but families often forget to budget for them alongside tuition.",
  },
  {
    category: "Annual Recurring Costs",
    items: [
      "Health insurance: ₹8,000-15,000/year",
      "Visa renewal/extension: ₹5,000-10,000/year",
      "Books & study materials: ₹10,000-25,000/year",
      "Annual travel home: ₹35,000-80,000/year",
      "Winter clothing replacement: ₹5,000-8,000/year",
    ],
    total: "₹58,000-1.3 lakhs/year",
    notes: "Multiply by 5 years (Years 2-6) for accurate 6-year budgeting. Annual travel home is optional but most students visit once per year.",
  },
  {
    category: "Currency Fluctuation",
    items: [
      "USD-INR volatility: 5-7% annual variation",
      "Impact on ₹40L budget: ±₹1.6-3.2L over 6 years",
      "RUB-INR volatility: 3-5% variation",
      "Protection strategies: Forward contracts, USD deposits",
    ],
    total: "₹1.6-3.2 lakhs risk",
    notes: "Exchange rates can significantly impact total cost. Budget conservatively assuming unfavorable rates.",
  },
  {
    category: "City-Specific Variations",
    items: [
      "Moscow living: ₹36-59L over 6 years",
      "St. Petersburg: ₹29-49L over 6 years",
      "Kazan: ₹19-30L over 6 years",
      "Volgograd: ₹16-24L over 6 years",
      "Crimea: ₹13-21L over 6 years",
    ],
    total: "₹17-38 lakhs difference",
    notes: "Choosing tier-2 city over Moscow saves ₹17-38 lakhs in living costs alone over 6 years. This doesn't compromise NMC recognition.",
  },
  {
    category: "Clinical Years (Years 5-6)",
    items: [
      "Additional hospital transport: ₹5,000-10,000/year",
      "Professional attire (white coats): ₹5,000-10,000",
      "Medical equipment (stethoscope, etc.): ₹3,000-8,000",
      "Extra reference books: ₹8,000-15,000/year",
    ],
    total: "₹13,000-28,000/year",
    notes: "Clinical posting years require additional investments beyond standard tuition and hostel fees.",
  },
];

const indiaComparison = [
  {
    category: "Indian Government Colleges",
    examples: "AIIMS, State Government Colleges",
    annualFees: "₹6,000-1,00,000",
    totalCost: "₹30,000-5.5 lakhs (5.5 years)",
    accessibility: "NEET rank 1-20,000 (General), extremely competitive",
    comparison: "Cheapest option but hardest to access (< 5% acceptance rate)",
  },
  {
    category: "Indian Private Colleges (All India Quota)",
    examples: "Mid-tier private medical colleges",
    annualFees: "₹7-30 lakhs/year",
    totalCost: "₹38.5 lakhs-₹1.65 crores (5.5 years)",
    accessibility: "NEET rank 20,000-2,00,000, high competition",
    comparison: "Russia (₹28-52L) is 30-70% cheaper than this option",
  },
  {
    category: "Indian NRI Quota",
    examples: "Private colleges NRI seats",
    annualFees: "₹12.5-30 lakhs/year",
    totalCost: "₹70 lakhs-₹2.2 crores (5.5 years)",
    accessibility: "No NEET rank required, USD payment, limited seats",
    comparison: "Russia (₹28-52L) is 60-75% cheaper than NRI quota",
  },
  {
    category: "Indian Management Quota",
    examples: "Deemed universities, private colleges",
    annualFees: "₹12-40 lakhs/year",
    totalCost: "₹60 lakhs-₹1.5 crores (5.5 years)",
    accessibility: "Moderate NEET rank, capitation fees, limited transparency",
    comparison: "Russia offers better value at ₹28-52L with NMC recognition",
  },
  {
    category: "Russia MBBS (Budget)",
    examples: "Tier-2 city universities",
    annualFees: "₹2.6-5 lakhs/year",
    totalCost: "₹28-34 lakhs (6 years)",
    accessibility: "Qualifying NEET score (50th/40th percentile), no rank competition",
    comparison: "50-80% cheaper than Indian private options with same NMC validity",
  },
  {
    category: "Russia MBBS (Medium)",
    examples: "Federal universities",
    annualFees: "₹4-6 lakhs/year",
    totalCost: "₹43-52 lakhs (6 years)",
    accessibility: "Same NEET requirements, better FMGE pass rates (25-45%)",
    comparison: "Comparable cost to lower-end Indian private but with international exposure",
  },
];

const costSavingStrategies = [
  {
    strategy: "Choose Tier-2 City University",
    savings: "₹17-38 lakhs over 6 years",
    how: "Select universities in Kazan, Volgograd, Crimea, Ufa instead of Moscow/St. Petersburg. NMC recognition remains same but living costs drop 50-70%.",
    examples: "Bashkir (Ufa) vs RUDN (Moscow): Save ₹32L over 6 years",
  },
  {
    strategy: "Self-Cooking vs Indian Mess",
    savings: "₹24,000-48,000 per year (₹1.44-2.88L over 6 years)",
    how: "Form cooking groups of 3-4 students, buy groceries from local markets, cook staple Indian meals. Invest ₹5,000 in basic kitchen equipment Year 1.",
    examples: "Shared cooking: ₹4,500/month vs Indian mess ₹10,000/month",
  },
  {
    strategy: "University Hostel vs Private Accommodation",
    savings: "₹84,000-1.8 lakhs per year (₹5-10.8L over 6 years)",
    how: "Choose university-provided hostels (₹3,000-8,000/month) instead of private apartments (₹25,000-40,000/month).",
    examples: "Moscow: University hostel ₹35,000/month vs private ₹60,000/month",
  },
  {
    strategy: "Early Flight Booking & Off-Season Travel",
    savings: "₹15,000-40,000 per trip (₹90,000-2.4L over 6 years)",
    how: "Book flights 3-4 months in advance, travel during off-peak seasons (avoid December-January, June-July), use budget airlines, consider connecting flights.",
    examples: "Advanced booking: ₹40,000 vs last-minute ₹80,000",
  },
  {
    strategy: "Scholarship Applications",
    savings: "25-100% tuition reduction (₹7.8-60L over 6 years)",
    how: "Apply for Russian Government Scholarship (100% tuition + stipend), University Merit Scholarships (25-50% reduction), Open Door Russia Scholarship.",
    examples: "Russian Govt Scholarship: Save ₹24L+ over 6 years",
  },
  {
    strategy: "Bulk Purchase from India",
    savings: "₹5,000-10,000 per year (₹30,000-60,000 over 6 years)",
    how: "Bring 6-12 months supply of Indian spices, masalas, pickles, snacks from India. These cost 2-3x in Russia.",
    examples: "1kg garam masala: ₹300 India vs ₹900 Russia",
  },
  {
    strategy: "Student Transport Pass",
    savings: "₹8,000-12,000 per year (₹48,000-72,000 over 6 years)",
    how: "Get student metro/bus passes (50-80% discount), walk to nearby universities, cycle in warmer months.",
    examples: "Student pass ₹1,200/month vs regular ₹2,500/month",
  },
  {
    strategy: "Education Loan Optimization",
    savings: "₹30,000-80,000 per year in tax savings (₹2.4-6.4L over 8 years)",
    how: "Section 80E allows full interest deduction with no upper limit. Choose longer tenure (15 years vs 10 years) to maximize tax benefit years.",
    examples: "₹40L loan: Save ₹60,000-1.2L/year in taxes for 8 years",
  },
];

const faqItems = [
  {
    question: "What is the total MBBS in Russia fees for Indian students including all expenses?",
    answer:
      "Total MBBS in Russia fees for 6 years range from ₹28.87-34.09 lakhs (budget scenario: tier-2 cities like Sevastopol ₹2.6L/year tuition, university hostel ₹36,000-60,000/year, self-cooking ₹54,000-72,000/year), ₹43.2-52.44 lakhs (medium scenario: federal universities like Bashkir ₹4.32L/year, Indian mess ₹96,000-1.2L/year), or ₹71.07-103.47 lakhs (premium scenario: Moscow universities like First Moscow State ₹10L/year, Moscow hostel ₹1.2-2L/year). This includes tuition, hostel, food, transport, insurance, study materials, annual travel home, and all one-time Year 1 expenses (₹2-3.7L for visa, documents, flights, winter clothing).",
  },
  {
    question: "Which Russian university has the lowest MBBS fees for Indian students?",
    answer:
      "Sevastopol State University has the lowest annual MBBS fees at ₹2,60,000/year (265,000 RUB / $3,300), totaling ₹15.6 lakhs for 6-year tuition. With hostel (₹36,000-60,000/year) and living expenses, the total 6-year cost is ₹17.76-20.16 lakhs tuition + hostel only. Other low-cost options include Ural State Medical University (₹2.95L/year), Tula State University (₹2.8L/year), North Ossetian State Medical Academy (₹3.1L/year). All are NMC-approved and offer English-medium MBBS. However, students should verify clinical training quality and FMGE pass rates alongside fees before finalizing.",
  },
  {
    question: "How does MBBS in Russia fees compare with Indian private medical colleges?",
    answer:
      "MBBS in Russia (₹28-52 lakhs total for 6 years) is 50-70% cheaper than Indian private medical colleges charging ₹60 lakhs-₹2.2 crores for 5.5 years. Specific comparison: Russia budget option (₹28-34L) saves ₹31-70L vs Indian private colleges (₹60L-1.65Cr), Russia medium option (₹43-52L) saves ₹17-62L, Russia premium (₹71-103L) is comparable to lower-end Indian private but with international exposure. Indian government colleges (₹30,000-5.5L) remain cheapest but require NEET rank 1-20,000 (< 5% acceptance), while Russia accepts qualifying NEET score (50th/40th percentile) without rank competition. Same NMC recognition and FMGE requirement applies to both.",
  },
  {
    question: "What are the hidden costs in MBBS in Russia fees that families should know?",
    answer:
      "Hidden costs beyond tuition include: (1) One-time Year 1: ₹1.2-3.7L (visa ₹5,000-12,000, document attestation ₹15,000-30,000, flights ₹35,000-80,000, winter clothing ₹15,000-25,000, settlement ₹10,000-15,000); (2) Annual recurring Years 2-6: ₹58,000-1.3L/year (insurance ₹8,000-15,000, books ₹10,000-25,000, annual travel ₹35,000-80,000, visa renewal ₹5,000-10,000); (3) Currency fluctuation: 5-7% USD-INR variation impacts ₹40L budget by ±₹1.6-3.2L; (4) City variations: Moscow living ₹36-59L vs Crimea ₹13-21L over 6 years (₹23-38L difference); (5) Clinical years: Extra ₹13,000-28,000/year for hospital transport, professional attire, medical equipment. Total hidden costs: ₹8-15L over 6 years.",
  },
  {
    question: "Can I get education loan for MBBS in Russia fees?",
    answer:
      "Yes, Indian banks and NBFCs provide education loans covering 80-100% of Russia MBBS fees. Public sector banks (SBI, Bank of Baroda) offer ₹7.5 lakhs unsecured or up to ₹1.5 crores secured at 8.25-11.5% p.a. interest. Private banks (HDFC, ICICI) and NBFCs (Avanse, Auxilo, Credila) offer ₹50 lakhs-₹1 crore unsecured at 11-17% p.a. with 7-14 day approval. Government schemes like PM-Vidyalaxmi provide collateral-free loans with 3% interest subsidy (families earning ≤₹8 lakhs on loans ≤₹10 lakhs). Loans cover tuition, hostel, travel, books, insurance; require 15% margin money (₹5.25-7.5L for ₹35-50L total cost). Section 80E tax benefit allows full interest deduction (no upper limit) for 8 years, saving ₹30,000-80,000/year.",
  },
  {
    question: "What is the fee payment structure for MBBS in Russia?",
    answer:
      "Russia MBBS fees are typically paid semester-wise (every 6 months) or annually, with first semester requiring payment before arrival. Payment methods: direct bank transfer from Indian bank to Russian university account, demand draft in USD, or cash payment after arrival. Universities accept USD (most common), RUB, or INR through authorized consultants. First-year breakdown: pay ₹1.1-2.6L (half annual tuition) before arrival + ₹10,000-30,000 hostel deposit + ₹40,000-1.2L processing fee. Late payment penalties: 0.5-2% per week after 7-15 day grace period, academic suspension after 30-60 days non-payment. Years 2-6: flexibility for annual or semester-wise payment. Budget for 5-7% currency fluctuation and verify payment deadlines to avoid penalties.",
  },
  {
    question: "How can I save money on MBBS in Russia fees?",
    answer:
      "Top cost-saving strategies: (1) Choose tier-2 city university (Kazan, Volgograd, Crimea) instead of Moscow/SPB: save ₹17-38L over 6 years; (2) Self-cooking vs Indian mess: save ₹1.44-2.88L; (3) University hostel vs private accommodation: save ₹5-10.8L; (4) Early flight booking & off-season travel: save ₹90,000-2.4L; (5) Apply for Russian Government Scholarship (100% tuition + stipend): save ₹24L+; (6) Student transport pass: save ₹48,000-72,000; (7) Bulk purchase spices/snacks from India: save ₹30,000-60,000; (8) Education loan with Section 80E tax benefit: save ₹2.4-6.4L over 8 years. Total potential savings: ₹25-50L by choosing budget university in tier-2 city with smart living strategies, without compromising NMC recognition or education quality.",
  },
  {
    question: "How does Students Traffic help with Russia MBBS fees planning?",
    answer:
      "Students Traffic provides comprehensive fee planning support: (1) Total cost modeling across low/medium/high budget scenarios (₹28-103L) based on family's financial profile and city preferences; (2) University fee comparison across 50+ NMC-approved options with exact annual tuition (₹2.6-15L range) and 6-year projections; (3) Hidden cost identification including one-time Year 1 expenses (₹2-3.7L), annual recurring costs (₹58,000-1.3L), currency fluctuation impacts (±₹1.6-3.2L), and city-specific variations (Moscow ₹36-59L vs Crimea ₹13-21L living costs); (4) Education loan facilitation connecting families with 15+ lenders (SBI, HDFC, Credila) offering optimal rates (8.25-17% p.a.) and terms; (5) Cost-saving strategy counseling identifying ₹25-50L potential savings through tier-2 city selection, hostel choices, cooking arrangements, scholarship applications, and tax optimization. Our fee planning ensures families budget accurately for 6-year commitment rather than reacting only to first-year quotes.",
  },
];

export default function RussiaMbbsFeesPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "MBBS in Russia Fees 2026: Complete Cost Breakdown for Indian Students",
      description:
        "Comprehensive Russia MBBS fees guide: university-wise fees (₹2.6-15L/year), total 6-year costs (₹28-103L), India comparison, hidden costs, city-wise variations, cost-saving strategies, and education loan options for Indian students.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "MBBS in Russia", path: "/countries/russia" },
      {
        name: "MBBS in Russia Fees",
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
            Updated for 2026-27 academic year
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            MBBS in Russia fees: Complete cost breakdown for Indian students
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground sm:text-2xl sm:leading-10">
            Comprehensive fees guide covering 50+ NMC-approved universities: annual tuition (₹2.6-15L), total 6-year costs (₹28-103L including living expenses), India comparison (50-70% savings vs private colleges), hidden costs families miss, city-wise variations, and cost-saving strategies.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/countries/russia"
              className="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
            >
              Read full Russia guide
            </Link>
            <CounsellingDialog
              triggerContent={<>Get fee planning support</>}
              triggerClassName="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
              plainTrigger
              title="Need Russia MBBS fee planning guidance?"
              description="Our team will help you model total 6-year costs across budget scenarios, identify hidden expenses, and compare university fees matching your family's budget."
              ctaVariant="fees-russia-hero"
              courseSlug="mbbs"
              countrySlug="russia"
              notes="Interest: MBBS in Russia fees - Fee planning support"
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
              Critical fee insights
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              What families must understand about Russia MBBS fees
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
                  Students Traffic's fee planning approach
                </p>
                <p className="mt-1 text-sm leading-6 text-blue-800">
                  At Students Traffic, we help families model total 6-year costs across low/medium/high budget scenarios (₹28-103L) based on city preferences (Moscow vs tier-2), living arrangements (hostel vs private), and lifestyle choices (self-cooking vs mess). Our fee planning includes hidden cost identification (one-time ₹2-3.7L Year 1, recurring ₹58,000-1.3L annually, currency fluctuation ±₹1.6-3.2L risk), education loan facilitation connecting with 15+ lenders (8.25-17% p.a. rates), and cost-saving strategy counseling identifying ₹25-50L potential savings through tier-2 city selection, scholarship applications, and smart living strategies. We compare 50+ NMC-approved universities with exact fees rather than relying on generic Russia cost estimates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            University-wise MBBS fees: 13 NMC-approved examples
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Exact annual tuition and total costs for budget, mid-range, federal, and premium Russian medical universities. All are NMC-approved and offer English-medium MBBS. Fees shown are for 2026-27 academic year.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      University
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      City
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Tier
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Annual Tuition
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      6-Year Tuition
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Annual Hostel
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      6-Year Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {universityFees.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {row.university}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {row.city}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            row.tier === "Budget"
                              ? "bg-green-100 text-green-700"
                              : row.tier === "Mid-range"
                                ? "bg-blue-100 text-blue-700"
                                : row.tier === "Federal"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {row.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-accent">
                        {row.annualTuition}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {row.sixYearTuition}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {row.annualHostel}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {row.sixYearTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-900">
                  Important note on total costs
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  The "6-Year Total" column shows tuition + hostel only. Add ₹10-15 lakhs for food, transport, insurance, study materials, annual travel, and one-time Year 1 expenses (visa, documents, flights, winter clothing) for accurate 6-year budget. See total cost scenarios section below for complete breakdowns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Total 6-year cost scenarios: Low, medium, premium
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Complete cost breakdowns including tuition, hostel, food, transport, insurance, study materials, annual travel home, and all one-time Year 1 expenses. Choose scenario matching your family's budget and city preferences.
          </p>

          <div className="mt-10 space-y-8">
            {totalCostScenarios.map((scenario, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="bg-gradient-to-r from-accent/10 to-background px-6 py-4 sm:px-8">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl font-semibold text-foreground">
                      {scenario.scenario}
                    </h3>
                    <span className="rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent">
                      {scenario.sixYearGrandTotal}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <strong>Universities:</strong> {scenario.examples}
                  </p>
                </div>
                <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Year 1 Breakdown</p>
                    <ul className="mt-3 space-y-1.5">
                      {scenario.year1Breakdown.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2 text-sm leading-6 text-foreground">
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 rounded-xl bg-accent/10 p-3">
                      <p className="text-sm font-semibold text-foreground">Year 1 Total: {scenario.year1Total}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Years 2-6 (Annual)</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{scenario.annualYears2to6}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Includes tuition, hostel, food, transport, insurance, study materials, annual travel home
                    </p>

                    <div className="mt-6">
                      <p className="text-sm font-semibold text-muted-foreground">Cost Savings vs India</p>
                      <p className="mt-2 text-sm leading-6 text-green-700">
                        {scenario.savings}
                      </p>
                    </div>

                    <div className="mt-6 rounded-xl bg-muted/30 p-3">
                      <p className="text-xs font-semibold text-foreground">
                        6-Year Grand Total: {scenario.sixYearGrandTotal}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {scenario.year1Total} (Year 1) + {scenario.annualYears2to6} × 5 years
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
            Hidden costs families often miss
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Beyond tuition and hostel fees listed by universities, these additional costs total ₹8-15 lakhs over 6 years. Budget accurately by including one-time Year 1 expenses, annual recurring costs, currency risks, city variations, and clinical year extras.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {hiddenCosts.map((cost, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {cost.category}
                </h3>
                <ul className="mt-4 space-y-2">
                  {cost.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2 text-sm leading-6 text-foreground">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-3">
                  <p className="text-sm font-semibold text-foreground">{cost.total}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{cost.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Russia vs India: Complete cost comparison
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Russia MBBS (₹28-52L for mid-tier options) costs 50-70% less than Indian private colleges (₹60L-₹2.2Cr) while offering same NMC recognition and FMGE requirement. Only Indian government colleges (under 5% acceptance rate) are cheaper.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Examples
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Annual Fees
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Total Cost
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Accessibility
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {indiaComparison.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {row.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {row.examples}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-accent">
                        {row.annualFees}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {row.totalCost}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {row.accessibility}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-green-900">
                    Russia advantage
                  </p>
                  <p className="mt-1 text-sm leading-6 text-green-800">
                    Budget Russia universities (₹28-34L) save ₹31-70L vs Indian private colleges while maintaining NMC recognition. No donations, no capitation fees, transparent pricing.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900">
                    Same final outcome
                  </p>
                  <p className="mt-1 text-sm leading-6 text-blue-800">
                    Both Russian and Indian MBBS require NMC registration and FMGE/NExT clearance for India practice. Degree recognition is equal - the difference is upfront cost and accessibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Cost-saving strategies: Save ₹25-50 lakhs
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Smart decisions on city selection, accommodation, food arrangements, travel booking, and scholarship applications can reduce total 6-year costs by ₹25-50 lakhs without compromising NMC recognition or education quality.
          </p>

          <div className="mt-10 space-y-6">
            {costSavingStrategies.map((strategy, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 font-display text-lg font-bold text-green-700">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {strategy.strategy}
                      </h3>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        {strategy.savings}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-foreground">
                      <strong>How:</strong> {strategy.how}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      <strong>Example:</strong> {strategy.examples}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-gradient-to-br from-accent/5 to-background p-8">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Combined savings potential
            </h3>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Combining tier-2 city selection (₹17-38L savings) + university hostel (₹5-10.8L savings) + self-cooking (₹1.44-2.88L savings) + early flight booking (₹90,000-2.4L savings) + scholarship (₹7.8-60L savings if successful) = <strong className="text-foreground">₹25-50 lakhs total reduction</strong> in 6-year MBBS costs.
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Students Traffic helps families identify which cost-saving strategies match their comfort level and budget priorities without compromising clinical training quality or India-return pathway.
            </p>
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
            Need personalized Russia MBBS fee planning?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Students Traffic provides complete fee modeling across low/medium/high budget scenarios (₹28-103L), university-wise fee comparison for 50+ NMC-approved options, hidden cost identification (₹8-15L often missed), education loan facilitation (8.25-17% p.a. rates), and cost-saving strategy counseling identifying ₹25-50L potential savings.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CounsellingDialog
              triggerContent={<>Get fee planning consultation</>}
              triggerClassName="rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background shadow-lg transition hover:opacity-90"
              plainTrigger
              title="Russia MBBS fee planning consultation"
              description="Share your budget range, city preferences, and lifestyle expectations. We'll model accurate 6-year costs, identify hidden expenses, and suggest optimal universities matching your financial profile."
              ctaVariant="fees-russia-bottom"
              courseSlug="mbbs"
              countrySlug="russia"
              notes="Interest: MBBS in Russia fees - Bottom fee planning consultation"
            />
            <Link
              href="/countries/russia"
              className="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
            >
              Read full Russia guide
            </Link>
            <Link
              href="/education-loan-for-mbbs-in-russia"
              className="rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-foreground shadow-sm transition hover:bg-muted"
            >
              Education loan guide
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
