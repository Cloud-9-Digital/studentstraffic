import type { Metadata } from "next";

import {
  CountryShortlistPage,
  buildCountryShortlistMetadata,
} from "@/components/site/country-shortlist-page";
import { listFinderPrograms } from "@/lib/data/catalog";

const path = "/medical-colleges-in-vietnam";
const publishedDate = "2026-05-23";
const updatedDate = "2026-05-23";

const shortlistedUniversitySlugs = [
  "can-tho-university-medicine-pharmacy",
  "hue-university-medicine-pharmacy",
  "hong-bang-international-university-medicine",
  "dai-nam-university-faculty-of-medicine",
  "dong-a-university-college-of-medicine",
  "phan-chau-trinh-university",
  "buon-ma-thuot-medical-university",
  "vinuniversity-college-health-sciences",
];

export const metadata: Metadata = buildCountryShortlistMetadata({
  path,
  title: "Medical Colleges in Vietnam for Indian Students 2026 | Fees, Cities & Best Fit",
  description:
    "Compare medical colleges in Vietnam for Indian students with tuition, city context, English-medium options, and shortlist guidance built for admission decisions.",
  primaryKeyword: "medical colleges in vietnam",
  secondaryKeywords: [
    "best medical universities in vietnam for indian students",
    "mbbs colleges in vietnam",
    "study mbbs in vietnam",
    "mbbs in vietnam for indian students",
  ],
});

export default async function MedicalCollegesVietnamPage() {
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
      title="Medical Colleges in Vietnam for Indian Students 2026"
      description="Compare medical colleges in Vietnam for Indian students with tuition, city context, English-medium options, and shortlist guidance built for admission decisions."
      publishedDate={publishedDate}
      updatedDate={updatedDate}
      primaryKeyword="medical colleges in vietnam"
      secondaryKeywords={[
        "best medical universities in vietnam for indian students",
        "mbbs colleges in vietnam",
        "study mbbs in vietnam",
        "mbbs in vietnam for indian students",
      ]}
      countryName="Vietnam"
      countrySlug="vietnam"
      intro="Search results for medical colleges in Vietnam are still much thinner than the Russia cluster, which is a good opportunity for a clearer commercial shortlist. Indian students usually want the same things quickly: which colleges are actually worth considering, which ones are more affordable, what kind of city life they offer, and whether the English-medium and India-return planning feel realistic."
      quickTakeaways={[
        "Vietnam is not one single fee band. Public and private medical universities can feel very different in budget, city experience, and overall student support.",
        "For Indian students, Vietnam becomes stronger when proximity matters. Shorter flights, warmer climate, and easier family travel change the real-life experience a lot.",
        "The best Vietnam college is not always the cheapest one. Students should compare hospital ecosystem, city comfort, and how confidently the university can be explained to parents.",
        "This page is built as a shortlist tool first, because Vietnam decisions usually move faster when students narrow the list before talking about admission paperwork.",
      ]}
      shortlistFramework={[
        "The Vietnam SERP is still relatively open, so the best page is one that answers the shortlist question directly instead of behaving like a generic destination article.",
        "We are balancing public-university credibility, private-university accessibility, city livability, and fee practicality so that the shortlist reflects real family decision-making.",
        "Vietnam often wins when students want English-facing programs and shorter travel from India, but the university-level fit still matters more than broad country marketing.",
        "Use this shortlist with the Vietnam country page and Vietnam fees page. That three-page cluster is usually enough to move from broad interest to a real counselling conversation.",
      ]}
      faq={[
        {
          question: "Which medical college in Vietnam is best for Indian students?",
          answer:
            "There is no universal best option for every family. Public choices like Can Tho or Hue can appeal to students who want a more established medical ecosystem, while private options can be easier to position for support, city preference, or affordability depending on the university.",
        },
        {
          question: "Are medical colleges in Vietnam cheaper than private MBBS colleges in India?",
          answer:
            "In many cases, yes. Vietnam often remains meaningfully cheaper than Indian private medical colleges once families compare tuition, hostel, food, and travel together. The exact gap still depends on the university you shortlist.",
        },
        {
          question: "Should I choose Vietnam only because it is close to India?",
          answer:
            "No. Proximity is a real advantage, but it should support the decision rather than replace proper university-level comparison. Students still need to check medium, city environment, and long-term fit carefully.",
        },
        {
          question: "What should I open after this Vietnam shortlist page?",
          answer:
            "The strongest next move is to compare the Vietnam fees page and then open the individual university profiles you are serious about. That gives you a shortlist you can actually act on.",
        },
      ]}
      programs={programs}
    />
  );
}
