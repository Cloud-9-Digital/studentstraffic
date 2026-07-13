import type { Metadata } from "next";

import {
  CountryShortlistPage,
  buildCountryShortlistMetadata,
} from "@/components/site/country-shortlist-page";
import { listFinderPrograms } from "@/lib/data/catalog";

const path = "/best-mbbs-universities-in-vietnam-for-indian-students";
const publishedDate = "2026-05-23";
const updatedDate = "2026-05-23";

const shortlistedUniversitySlugs = [
  "can-tho-university-medicine-pharmacy",
  "hue-university-medicine-pharmacy",
  "dai-nam-university-faculty-of-medicine",
  "dong-a-university-college-of-medicine",
  "phan-chau-trinh-university",
  "buon-ma-thuot-medical-university",
];

export const metadata: Metadata = buildCountryShortlistMetadata({
  path,
  title:
    "Best MBBS Universities in Vietnam for Indian Students 2026 | Fees, Cities & Best Fit",
  description:
    "Compare the best MBBS universities in Vietnam for Indian students with tuition, city context, English-medium fit, and shortlist guidance built for admissions.",
  primaryKeyword: "best mbbs universities in vietnam for indian students",
  secondaryKeywords: [
    "top medical universities in vietnam for indian students",
    "best medical colleges in vietnam",
    "medical colleges in vietnam for indian students",
    "mbbs in vietnam for indian students",
  ],
});

export default async function BestVietnamMbbsUniversitiesPage() {
  const countryPrograms = await listFinderPrograms({ country: "vietnam", course: "mbbs" });
  const programByUniversitySlug = new Map(
    countryPrograms.map((program) => [program.university.slug, program]),
  );
  const programs = shortlistedUniversitySlugs
    .map((slug) => programByUniversitySlug.get(slug))
    .filter((program): program is NonNullable<typeof program> => Boolean(program));

  return (
    <CountryShortlistPage
      path={path}
      title="Best MBBS Universities in Vietnam for Indian Students 2026"
      description="Compare the best MBBS universities in Vietnam for Indian students with tuition, city context, English-medium fit, and shortlist guidance built for admissions."
      publishedDate={publishedDate}
      updatedDate={updatedDate}
      primaryKeyword="best mbbs universities in vietnam for indian students"
      secondaryKeywords={[
        "top medical universities in vietnam for indian students",
        "best medical colleges in vietnam",
        "medical colleges in vietnam for indian students",
        "mbbs in vietnam for indian students",
      ]}
      countryName="Vietnam"
      countrySlug="vietnam"
      intro="This keyword is more commercial than a generic Vietnam destination page because families are already asking for the best options, not whether Vietnam exists as an MBBS destination. The useful version of a 'best universities' page should not be a random top-10 ranking. It should help Indian students understand which Vietnam universities deserve shortlist priority first and why."
      quickTakeaways={[
        "The best Vietnam MBBS university is usually the one that balances fee comfort, city fit, and how clearly parents can understand the option, not just the one with the flashiest pitch.",
        "Vietnam shortlist pages rank well when they answer a real admissions question quickly: which universities are actually worth opening first.",
        "Public and private Vietnam universities play different roles in a shortlist. Some bring stronger legacy comfort, others are easier on packaging, support, and student adaptation.",
        "This page works best when used together with the Vietnam fees page and the live university profiles, so families move from ranking curiosity to a real shortlist.",
      ]}
      shortlistFramework={[
        "We are not treating all Vietnam universities as equal. This shortlist prioritizes the universities most likely to matter in actual Indian student counselling conversations.",
        "The public universities help anchor credibility and hospital ecosystem discussion, while selected private universities matter because they are more actively marketed, easier to explain, and often more responsive for Indian admissions.",
        "The Vietnam SERP is still relatively open compared with Russia, so a cleaner shortlist page can win by being more decision-focused than generic brochure content.",
        "If two Vietnam universities look similar on fees, city comfort and how confidently the option can be explained to parents usually become the tie-breaker.",
      ]}
      faq={[
        {
          question: "Which are the best MBBS universities in Vietnam for Indian students?",
          answer:
            "There is no single best option for every student. Can Tho and Hue often appeal to families who want stronger public-university comfort, while selected private universities can work well when student support, city preference, and practical admissions handling matter more.",
        },
        {
          question: "Are the best Vietnam MBBS universities always the most expensive ones?",
          answer:
            "No. A higher fee does not automatically mean a better fit. Some students do better with a more practical, support-friendly university in the right city than with a university that only sounds more premium on paper.",
        },
        {
          question: "Should I choose a Vietnam university only from a ranking list?",
          answer:
            "No. Rankings can help with discovery, but the final decision should come from fee planning, city comfort, medium clarity, and the full university profile, not from a top-10 article alone.",
        },
        {
          question: "What should I open after this page?",
          answer:
            "The strongest next move is to compare the Vietnam fee page and then open the individual university pages for the 2 to 4 options you are genuinely considering. That is where the shortlist becomes actionable.",
        },
      ]}
      programs={programs}
    />
  );
}
