import type { Metadata } from "next";

import { CommercialSeoGuidePage } from "@/components/site/commercial-seo-guide-page";
import { buildIndexableMetadata } from "@/lib/metadata";

const pagePath = "/mbbs-in-russia-eligibility-for-indian-students";
const publishedDate = "2026-05-23";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS in Russia Eligibility for Indian Students 2026 | PCB, NEET, Age & Documents",
  description:
    "Check MBBS in Russia eligibility for Indian students with the real rules that matter: PCB marks, NEET, age, passport readiness, and the mistakes that break the pathway later.",
  path: pagePath,
  openGraphType: "article",
  keywords: [
    "mbbs in russia eligibility for indian students",
    "mbbs in russia eligibility",
    "eligibility criteria for mbbs in russia",
    "study mbbs in russia for indian students",
    "mbbs in russia neet eligibility",
  ],
});

const keyTakeaways = [
  "The real Russia-eligibility question is not just whether a university will take your application. It is whether your profile still supports the medical pathway you want later, especially if India-return matters.",
  "The main filters families should think about are PCB background, the practical minimum academic profile, NEET if the student wants to practise in India later, age, passport readiness, and clean supporting documents.",
  "This keyword deserves its own page because students searching eligibility are closer to action than broad-country traffic. They want to know if they personally qualify, not just whether Russia is affordable.",
];

const sections = [
  {
    title: "Who this page is for",
    paragraphs: [
      "This page is for Indian students and parents asking a direct question: do we actually qualify to study MBBS in Russia, and if yes, what is the safe next step?",
      "That intent is different from broad country research. Eligibility searchers are usually already comparing paperwork, marks, NEET status, and timeline.",
    ],
  },
  {
    title: "Core eligibility checkpoints",
    bullets: [
      "Class 12 with Physics, Chemistry, and Biology as the core subject combination.",
      "A workable PCB score that supports overseas medical admission and makes sense under the India-return framework the student is planning around.",
      "A valid NEET-UG score if the student wants the option to practise medicine in India after graduating abroad.",
      "Minimum age expectation aligned with overseas medical admission norms.",
      "A valid passport with enough remaining validity for offer, invitation, visa, and travel processing.",
    ],
  },
  {
    title: "Why NEET changes the eligibility conversation",
    paragraphs: [
      "A common mistake in the Russia market is talking only about university admission and not about long-term eligibility. Some universities may be willing to process the application, but Indian families should treat NEET as a pathway issue, not just a formality.",
      "If the student wants to return and practise in India later, NEET should be handled correctly before the course begins. That one decision affects the value of the entire degree later.",
    ],
  },
  {
    title: "Documents that decide whether your profile is actually ready",
    cards: [
      {
        title: "Academic proof",
        body:
          "Class 10 and 12 documents should be clear, consistent, and ready for submission in the required format. Poor scans, mismatched names, or last-minute corrections often create delays.",
      },
      {
        title: "Identity and passport",
        body:
          "A valid passport is not a late-stage formality. If it is missing or too close to expiry, the entire admission timeline becomes fragile.",
      },
      {
        title: "NEET scorecard",
        body:
          "If India-return matters, the NEET scorecard becomes part of eligibility planning, not just a separate counselling conversation.",
      },
      {
        title: "Medical and visa paperwork",
        body:
          "Some students think they are eligible because the university says yes, but they are not truly ready until the visa and medical-document side is also under control.",
      },
    ],
  },
  {
    title: "Cases where families should pause before applying",
    bullets: [
      "The student has not handled NEET but still expects a clean India-return pathway later.",
      "The family is chasing a fast admission promise without understanding whether the university fits the student's academic and language comfort level.",
      "The passport is delayed or document names do not match across records.",
      "The student is applying because Russia is cheaper than India, but nobody has verified the full long-term pathway.",
    ],
  },
  {
    title: "What to do after confirming basic eligibility",
    paragraphs: [
      "Once eligibility looks workable, the next task is not to pay immediately. It is to choose the right Russia universities by budget, city, English-medium reality, hostel setup, and pathway clarity.",
      "That is the commercial opportunity behind this keyword: families who have crossed the eligibility check are ready for shortlisting and counselling, not just content consumption.",
    ],
  },
];

const faqItems = [
  {
    question: "What is the minimum eligibility for MBBS in Russia for Indian students?",
    answer:
      "The student should have Class 12 with PCB, the right age profile, passport readiness, and a NEET-qualified pathway if they intend to practise in India later.",
  },
  {
    question: "Is NEET compulsory for MBBS in Russia?",
    answer:
      "For Indian students who want to preserve the India-return pathway, NEET should be treated as compulsory before the program begins.",
  },
  {
    question: "Can low marks still allow MBBS admission in Russia?",
    answer:
      "Admission may still be possible in some cases, but the right question is whether the overall profile still supports a sensible university choice and long-term pathway.",
  },
  {
    question: "Is passport validity part of MBBS eligibility in Russia?",
    answer:
      "Yes. Even if the academic profile is acceptable, weak passport readiness can delay or derail the process.",
  },
  {
    question: "What should I do after confirming eligibility?",
    answer:
      "Move to shortlisting. The best next step is comparing the right Russia universities for your budget, city comfort, and India-return goals.",
  },
];

const officialSources = [
  {
    label: "NMC notice on qualifying NEET for studying medicine abroad",
    href: "https://www.nmc.org.in/wp-content/uploads/Eligibility-Notice/20210319060622.pdf",
    note:
      "Important official notice because NEET is a major part of foreign-medical eligibility planning for Indian students.",
  },
  {
    label: "NMC information desk for students planning to study abroad",
    href: "https://www.nmc.org.in/information-desk/for-students-to-study-in-abroad",
    note:
      "Useful official guidance page for students checking their pathway before choosing a foreign medical program.",
  },
  {
    label: "Study in Russia admissions platform",
    href: "https://www.studyinrussia.ru/en/",
    note:
      "Official Russia-facing platform that helps students understand how university choice, deadlines, and application steps are handled.",
  },
  {
    label: "Study in Russia applicant instruction guide",
    href: "https://education-in-russia.com/settings/static/media/Instruction%28en%29.pdf",
    note:
      "Shows how the official Russia-side applicant workflow works once the student is actually ready to apply.",
  },
];

export default function MbbsInRussiaEligibilityPage() {
  return (
    <CommercialSeoGuidePage
      path={pagePath}
      title="MBBS in Russia eligibility for Indian students: the 2026 checklist that actually matters"
      updatedOn="Updated on 23 May 2026"
      kicker="Eligibility and readiness"
      summary="Eligibility for Russia is not just about getting an application accepted. It is about making sure the student's academic, NEET, passport, and document profile supports a Russia pathway that still makes sense later."
      publishedDate={publishedDate}
      countrySlug="russia"
      primaryHref="/mbbs-in-russia"
      primaryLabel="Explore MBBS in Russia"
      secondaryHref="/contact"
      secondaryLabel="Check my eligibility"
      keyTakeaways={keyTakeaways}
      sections={sections}
      faqItems={faqItems}
      officialSources={officialSources}
      leadTitle="Need a Russia eligibility check?"
      leadDescription="We can review your marks, NEET status, passport readiness, and shortlist fit before you move into the Russia admission process."
      notes="Interest: MBBS in Russia eligibility for Indian students"
    />
  );
}
