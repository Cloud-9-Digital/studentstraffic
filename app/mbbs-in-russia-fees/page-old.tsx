import type { Metadata } from "next";

import { CountryFeesPage, buildCountryFeesMetadata } from "@/components/site/country-fees-page";
import { getProgramsForCountry } from "@/lib/data/catalog";

const path = "/mbbs-in-russia-fees";
const publishedDate = "2026-05-22";
const updatedDate = "2026-05-22";

export const metadata: Metadata = buildCountryFeesMetadata({
  path,
  title: "MBBS in Russia Fees 2026 for Indian Students | Tuition, Hostel & Total Cost",
  description:
    "Check MBBS in Russia fees for Indian students with annual tuition, hostel and food estimates, total cost planning, fee structure context, and university-wise comparison.",
  primaryKeyword: "mbbs in russia fees",
  secondaryKeywords: [
    "mbbs in russia for indian students fees",
    "mbbs fees in russia for indian students",
    "mbbs in russia fees in rupees",
    "mbbs in russia fee structure",
  ],
});

export default async function MbbsInRussiaFeesPage() {
  const programs = (await getProgramsForCountry("russia")).filter(
    (program) => program.course.slug === "mbbs",
  );

  return (
    <CountryFeesPage
      path={path}
      title="MBBS in Russia Fees 2026 for Indian Students"
      description="Check MBBS in Russia fees for Indian students with annual tuition, hostel and food estimates, total cost planning, fee structure context, and university-wise comparison."
      publishedDate={publishedDate}
      updatedDate={updatedDate}
      primaryKeyword="mbbs in russia fees"
      secondaryKeywords={[
        "mbbs in russia for indian students fees",
        "mbbs fees in russia for indian students",
        "mbbs in russia fees in rupees",
        "mbbs in russia fee structure",
      ]}
      countryName="Russia"
      countrySlug="russia"
      intro="MBBS in Russia fees are one of the strongest decision-stage search clusters for Indian students because families usually want the same answer in different forms: annual tuition, total six-year cost, fee structure, and hostel or food estimate. This page is built to answer all of those in one commercial comparison view before you shortlist a Russian university."
      feeExplainer={[
        "The Russia SERP is dominated by fee-first pages, so this page answers the entire keyword family together: MBBS in Russia fees, fees for Indian students, fee structure, and fees in rupees.",
        "Students should compare annual tuition, hostel plus food estimate, and total tuition over the full course instead of reacting only to a low first-year quote or a single university ad.",
        "Russia spans a wide cost range. The cheapest university is not automatically the strongest option once city, climate, Indian food support, travel, and clinical exposure are considered.",
        "For India-return planning, the best Russia fee decision is cost plus compliance fit: medium reality, hospital training, and the student's NExT pathway all matter alongside budget.",
      ]}
      faq={[
        {
          question: "What is the MBBS in Russia fee range for Indian students?",
          answer:
            "Across the current Students Traffic catalog, annual tuition runs from lower-cost public options up to higher-fee city campuses. The better approach is to compare the exact university table on this page instead of relying on a single generic Russia fee number.",
        },
        {
          question: "What should families include in the total cost of MBBS in Russia?",
          answer:
            "Families should calculate annual tuition, hostel or rent, food, visa work, insurance, travel, winter clothing, and any one-time university charges. Russia can still be affordable compared with Indian private colleges, but total cost is always higher than tuition alone.",
        },
        {
          question: "Should I look at MBBS in Russia fees in rupees or USD?",
          answer:
            "Both are useful, but USD-style comparison tables are cleaner for cross-university analysis. Families still need the rupee equivalent for budgeting, especially after adding travel, hostel, food, visa, and winter-related costs.",
        },
        {
          question: "Does the lowest Russia MBBS fee always mean the best option?",
          answer:
            "No. The lowest-fee Russian university is not automatically the best fit. Students should compare fee structure with city livability, Indian student support, teaching medium reality, and hospital training quality.",
        },
      ]}
      programs={programs}
    />
  );
}
