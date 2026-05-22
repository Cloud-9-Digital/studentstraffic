import type { Metadata } from "next";

import { CountryFeesPage, buildCountryFeesMetadata } from "@/components/site/country-fees-page";
import { getProgramsForCountry } from "@/lib/data/catalog";

const path = "/mbbs-in-vietnam-fees";
const publishedDate = "2026-05-22";
const updatedDate = "2026-05-22";

export const metadata: Metadata = buildCountryFeesMetadata({
  path,
  title: "MBBS in Vietnam Fees 2026 for Indian Students | Tuition, Hostel & Total Cost",
  description:
    "Check MBBS in Vietnam fees for Indian students with tuition, hostel and food estimates, total cost planning, and current university-level comparison.",
  primaryKeyword: "mbbs in vietnam fees",
  secondaryKeywords: [
    "cost of mbbs in vietnam",
    "mbbs in vietnam for indian students fees",
    "mbbs fees in vietnam",
    "study mbbs in vietnam",
  ],
});

export default async function MbbsInVietnamFeesPage() {
  const programs = (await getProgramsForCountry("vietnam")).filter(
    (program) => program.course.slug === "mbbs",
  );

  return (
    <CountryFeesPage
      path={path}
      title="MBBS in Vietnam Fees 2026 for Indian Students"
      description="Check MBBS in Vietnam fees for Indian students with tuition, hostel and food estimates, total cost planning, and current university-level comparison."
      publishedDate={publishedDate}
      updatedDate={updatedDate}
      primaryKeyword="mbbs in vietnam fees"
      secondaryKeywords={[
        "cost of mbbs in vietnam",
        "mbbs in vietnam for indian students fees",
        "mbbs fees in vietnam",
        "study mbbs in vietnam",
      ]}
      countryName="Vietnam"
      countrySlug="vietnam"
      intro="MBBS in Vietnam fees are a smaller search cluster than Russia, but the intent is highly commercial and much easier to win if the page answers the real student questions fast: which universities are actually affordable, what hostel plus food might cost, and whether the lower fee still comes with a practical India-return pathway."
      feeExplainer={[
        "Vietnam fee intent is usually a shortlist-stage query. Families searching cost, fees, or fee structure are already comparing options, so this page stays practical instead of generic.",
        "Vietnam often wins on affordability plus proximity to India, but public and private universities do not sit in the same cost band. University-level comparison still matters.",
        "The most useful Vietnam fee view is annual tuition plus hostel and food estimate, because that is how most Indian families actually plan the six-year budget.",
        "A lower Vietnam fee can still be the wrong choice if medium, hospital training, and India-return fit are weak. Cost should narrow the list, not finish the decision on its own.",
      ]}
      faq={[
        {
          question: "Is MBBS in Vietnam cheaper than Russia for Indian students?",
          answer:
            "In many cases, yes. Vietnam often has a lower overall budget path than Russia, especially when students value shorter flights, lower travel friction, and English-facing programs. The exact answer still depends on the university and city.",
        },
        {
          question: "What should families include in the Vietnam MBBS cost, apart from tuition?",
          answer:
            "Families should include hostel or rent, food, insurance, visa work, travel, and any university-level registration or practical charges. Looking only at tuition can make the real total feel lower than it is.",
        },
        {
          question: "Can I use this page as the MBBS in Vietnam fee structure page?",
          answer:
            "Yes. This page is designed to cover the full Vietnam fee-intent cluster, including MBBS in Vietnam fees, cost of MBBS in Vietnam, and fee structure comparisons for Indian students.",
        },
        {
          question: "Should I choose Vietnam only because the fee looks low?",
          answer:
            "No. Vietnam is a strong cluster because it combines lower competition and workable affordability, but students should still compare English-medium reality, Indian student support, and long-term licensing fit before choosing a university.",
        },
      ]}
      programs={programs}
    />
  );
}
