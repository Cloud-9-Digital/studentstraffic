import type { Metadata } from "next";

import {
  CountryShortlistPage,
  buildCountryShortlistMetadata,
} from "@/components/site/country-shortlist-page";
import { getProgramsForCountry } from "@/lib/data/catalog";

const path = "/best-mbbs-colleges-in-russia-for-indian-students";
const publishedDate = "2026-05-23";
const updatedDate = "2026-05-23";

const shortlistedUniversitySlugs = [
  "kazan-state-medical-university",
  "bashkir-state-medical-university",
  "privolzhsky-research-medical-university",
  "astrakhan-state-medical-university",
  "altai-state-medical-university",
];

export const metadata: Metadata = buildCountryShortlistMetadata({
  path,
  title: "Best MBBS Colleges in Russia for Indian Students 2026 | Fees, Cities & Best Fit",
  description:
    "Compare the best MBBS colleges in Russia for Indian students with tuition, city context, medium, and shortlist guidance built for real admission decisions.",
  primaryKeyword: "best mbbs colleges in russia for indian students",
  secondaryKeywords: [
    "top medical universities in russia for indian students",
    "mbbs university in russia",
    "best universities in russia for mbbs",
    "medical colleges in russia for indian students",
  ],
});

export default async function BestRussiaMbbsCollegesPage() {
  const countryPrograms = (await getProgramsForCountry("russia")).filter(
    (program) => program.course.slug === "mbbs",
  );
  const programByUniversitySlug = new Map(
    countryPrograms.map((program) => [program.university.slug, program]),
  );
  const programs = shortlistedUniversitySlugs
    .map((slug) => programByUniversitySlug.get(slug))
    .filter((program): program is NonNullable<typeof program> => Boolean(program));

  return (
    <CountryShortlistPage
      path={path}
      title="Best MBBS Colleges in Russia for Indian Students 2026"
      description="Compare the best MBBS colleges in Russia for Indian students with tuition, city context, medium, and shortlist guidance built for real admission decisions."
      publishedDate={publishedDate}
      updatedDate={updatedDate}
      primaryKeyword="best mbbs colleges in russia for indian students"
      secondaryKeywords={[
        "top medical universities in russia for indian students",
        "mbbs university in russia",
        "best universities in russia for mbbs",
        "medical colleges in russia for indian students",
      ]}
      countryName="Russia"
      countrySlug="russia"
      intro="Search results for the best MBBS colleges in Russia usually mix rankings, fee tables, and consultant promotions. Indian families need something more useful: which Russian universities are actually worth shortlisting first, what each one costs, what kind of city and student environment it offers, and who it is best suited for."
      quickTakeaways={[
        "The best Russian MBBS college for one student may be the wrong choice for another. Budget, climate comfort, city size, and India-return planning all change the right shortlist.",
        "Russia is still one of the biggest MBBS abroad demand clusters in India because it offers many established public universities instead of just one or two famous names.",
        "Students should compare university-level fit, not just rankings. Hospital exposure, English-medium delivery, hostel support, and Indian student ecosystem matter more in real life.",
        "This page works best alongside the Russia fees page, because families usually shortlist by quality first and then pressure-test the budget.",
      ]}
      shortlistFramework={[
        "We are prioritizing universities that are already strong decision points for Indian students: established public institutions, recognizable city ecosystems, and workable fee bands.",
        "The Russia SERP often uses ranking language, but shortlisting should be done by fit: who wants legacy brand value, who wants a calmer city, who wants lower cost, and who can handle tougher winters.",
        "No university here should be chosen only because it sounds famous. Always pair the shortlist with the full university page, fee page, and India-return planning questions before paying any amount.",
        "If two colleges seem similar on paper, city and student-support reality often becomes the tie-breaker. That is why this page is built as a shortlist tool, not just a top-10 article.",
      ]}
      faq={[
        {
          question: "Which is the best MBBS college in Russia for Indian students?",
          answer:
            "There is no single best university for every student. Kazan often appeals to students who want a strong legacy name and larger city environment, while other universities may be better for lower budget or calmer city preferences. The right choice depends on your budget, climate comfort, and clinical-learning expectations.",
        },
        {
          question: "Should I choose a Russian MBBS college by ranking alone?",
          answer:
            "No. Ranking lists are not enough for admission decisions. Indian students should compare city, hostel support, medium reality, fee structure, and hospital exposure before finalizing a Russian university.",
        },
        {
          question: "Are all top MBBS colleges in Russia equally affordable?",
          answer:
            "No. Russia has a broad cost spread. Some established public universities remain relatively affordable, while others sit in a higher tuition band because of city, brand, or program positioning.",
        },
        {
          question: "What should I read after this Russia shortlist page?",
          answer:
            "The best next step is to compare the Russia fee page and then open the individual university profiles you are serious about. That gives you a practical shortlist instead of a broad list you cannot act on.",
        },
      ]}
      programs={programs}
    />
  );
}
