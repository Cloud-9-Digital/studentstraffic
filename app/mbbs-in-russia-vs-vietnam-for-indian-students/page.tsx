import type { Metadata } from "next";

import {
  CountryComparisonPage,
  buildCountryComparisonMetadata,
} from "@/components/site/country-comparison-page";

const path = "/mbbs-in-russia-vs-vietnam-for-indian-students";
const publishedDate = "2026-05-23";
const updatedDate = "2026-05-23";

export const metadata: Metadata = buildCountryComparisonMetadata({
  path,
  title: "MBBS in Russia vs Vietnam for Indian Students 2026 | Fees, Medium & Best Fit",
  description:
    "Compare MBBS in Russia vs Vietnam for Indian students with fees, English-medium reality, climate, travel, shortlist quality, and the better fit for admissions.",
  primaryKeyword: "mbbs in russia vs vietnam for indian students",
  secondaryKeywords: [
    "russia vs vietnam mbbs",
    "which is better russia or vietnam for mbbs",
    "mbbs in vietnam vs russia",
    "russia or vietnam for mbbs for indian students",
  ],
});

const quickAnswer = [
  "Russia is usually the stronger option when a family wants a larger and older public-university ecosystem with more established India-facing awareness and a wider spread of university choices.",
  "Vietnam usually feels stronger when the student wants warmer climate, shorter travel from India, and a more comfortable English-facing experience during the overall academic journey.",
  "The better country depends on the student profile. Price-sensitive families often start with Russia, while adaptation-sensitive families often end up choosing Vietnam after comparing language, weather, and city comfort honestly.",
];

const comparisonRows = [
  {
    criterion: "Overall market size",
    leftValue:
      "Russia offers a much larger MBBS ecosystem for Indian students, with more long-known public universities and a bigger range of city options.",
    rightValue:
      "Vietnam is smaller and more selective, which can make shortlisting cleaner but also means fewer legacy names to compare.",
    verdict:
      "Russia wins for breadth. Vietnam wins for a narrower, easier-to-explain shortlist.",
  },
  {
    criterion: "Tuition and total cost planning",
    leftValue:
      "Russia can still look cheaper at the lower end, especially when families are open to second-tier cities and older public institutions.",
    rightValue:
      "Vietnam often stays competitive because travel, food, and hostel planning can feel more predictable, especially at tie-up universities with simplified annual packages.",
    verdict:
      "Russia can win on absolute tuition floor. Vietnam often feels easier on overall budget clarity.",
  },
  {
    criterion: "Medium and local-language pressure",
    leftValue:
      "Russian MBBS pages still need honest explanation around Russian language adaptation, especially once students move closer to patient-facing training.",
    rightValue:
      "Vietnam is easier to position when families want an English-first story, though clinical exposure can still benefit from basic Vietnamese adaptation.",
    verdict:
      "Vietnam usually feels easier for language comfort. Russia needs stronger adaptation commitment.",
  },
  {
    criterion: "Climate and day-to-day adaptation",
    leftValue:
      "Russia demands more adaptation because winters are harsher and lifestyle change can feel bigger for many Indian students.",
    rightValue:
      "Vietnam feels more familiar for many families because of warmer climate, shorter flights, and an easier everyday transition.",
    verdict:
      "Vietnam is usually the easier adjustment.",
  },
  {
    criterion: "University-level due diligence",
    leftValue:
      "Russia has a deeper public track record, but that can still mislead students into thinking every university is equally good just because the country is famous.",
    rightValue:
      "Vietnam requires sharper university-level shortlisting because the market is newer for Indian families and public information is thinner.",
    verdict:
      "Both require due diligence. Vietnam needs more active shortlisting discipline.",
  },
  {
    criterion: "Parent comfort and travel",
    leftValue:
      "Russia can feel psychologically farther from India, both because of travel time and the perceived lifestyle gap.",
    rightValue:
      "Vietnam is easier to explain to parents who care about proximity, easier visits, and lower lifestyle shock.",
    verdict:
      "Vietnam usually wins on parent comfort.",
  },
];

const finalVerdict = [
  "Choose Russia if the student wants a larger, older MBBS-abroad ecosystem and is comfortable trading easier climate and language comfort for more university breadth.",
  "Choose Vietnam if the student wants a more travel-friendly, climate-friendly, and English-facing experience and is willing to shortlist universities more carefully instead of relying on country reputation alone.",
  "If a family is split, the fastest way to decide is to compare the Russia fee page, the Vietnam fee page, and then shortlist 3 universities from each country. Country-level opinion becomes much clearer once real universities are on the table.",
];

const faq = [
  {
    question: "Which is better for MBBS, Russia or Vietnam?",
    answer:
      "Neither country is automatically better for everyone. Russia can be better for students who want a larger and longer-established public-university ecosystem, while Vietnam can be better for students who care more about climate, proximity to India, and an easier English-facing experience.",
  },
  {
    question: "Is MBBS in Vietnam cheaper than Russia?",
    answer:
      "Not always on raw tuition alone. Russia can still be cheaper at the low end, but Vietnam can feel more predictable once hostel, food, and travel are included. The right comparison is total six-year planning, not just a single annual tuition figure.",
  },
  {
    question: "Is Vietnam easier than Russia for Indian students?",
    answer:
      "Vietnam is often easier on climate, travel, and general lifestyle adaptation. Russia can still work very well, but students usually need stronger adjustment readiness for weather and local-language reality.",
  },
  {
    question: "Should I choose Russia or Vietnam only by country reputation?",
    answer:
      "No. The final decision should be made after comparing real universities, city fit, fee structure, and how clearly each option can be explained to parents. Country branding alone is not enough for a serious MBBS decision.",
  },
];

export default function RussiaVsVietnamPage() {
  return (
    <CountryComparisonPage
      path={path}
      title="MBBS in Russia vs Vietnam for Indian Students 2026"
      description="Compare MBBS in Russia vs Vietnam for Indian students with fees, English-medium reality, climate, travel, shortlist quality, and the better fit for admissions."
      publishedDate={publishedDate}
      updatedDate={updatedDate}
      primaryKeyword="mbbs in russia vs vietnam for indian students"
      secondaryKeywords={[
        "russia vs vietnam mbbs",
        "which is better russia or vietnam for mbbs",
        "mbbs in vietnam vs russia",
        "russia or vietnam for mbbs for indian students",
      ]}
      intro="This comparison keyword sits much closer to admission than a generic country guide. Families searching Russia vs Vietnam are usually down to two real options and want one thing: which country is the better fit for their budget, comfort level, and long-term medical plan. The useful answer is not a dramatic winner. It is a profile-based decision."
      quickAnswer={quickAnswer}
      leftCountry={{
        name: "Russia",
        label: "Best fit when",
        href: "/mbbs-in-russia",
        strengths: [
          "You want a larger public-university ecosystem with more established India-facing awareness.",
          "You are comfortable handling colder climate and stronger local-language adaptation over time.",
          "You want more city and university variety before making the final shortlist.",
        ],
        cautions: [
          "Language adaptation is a bigger real-life issue than many glossy pages admit.",
          "Climate and distance can feel harder for some students and parents.",
          "The country is big enough that weak shortlists still happen easily.",
        ],
      }}
      rightCountry={{
        name: "Vietnam",
        label: "Best fit when",
        href: "/mbbs-in-vietnam",
        strengths: [
          "You want shorter travel from India and a more familiar climate.",
          "You want an easier English-facing story for parents and student comfort.",
          "You prefer a tighter shortlist instead of comparing dozens of universities.",
        ],
        cautions: [
          "Public information is thinner, so university-level due diligence matters more.",
          "Students should not confuse a friendlier country image with automatically better universities.",
          "Clinical-language comfort is still better handled honestly, not assumed away.",
        ],
      }}
      comparisonRows={comparisonRows}
      finalVerdict={finalVerdict}
      faq={faq}
      nextReads={[
        { href: "/mbbs-in-russia-fees", label: "MBBS in Russia fees" },
        { href: "/mbbs-in-vietnam-fees", label: "MBBS in Vietnam fees" },
        {
          href: "/best-mbbs-colleges-in-russia-for-indian-students",
          label: "Best MBBS colleges in Russia",
        },
        {
          href: "/medical-colleges-in-vietnam",
          label: "Medical colleges in Vietnam",
        },
      ]}
    />
  );
}
