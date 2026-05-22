import type { Metadata } from "next";

import { CommercialSeoGuidePage } from "@/components/site/commercial-seo-guide-page";
import { buildIndexableMetadata } from "@/lib/metadata";

const pagePath = "/mbbs-admission-in-russia";
const publishedDate = "2026-05-23";

export const metadata: Metadata = buildIndexableMetadata({
  title: "MBBS Admission in Russia 2026 for Indian Students | Eligibility, Documents & Timeline",
  description:
    "Understand MBBS admission in Russia for Indian students with the real eligibility, documents, step-by-step timeline, NEET implications, and mistakes that delay admission.",
  path: pagePath,
  openGraphType: "article",
  keywords: [
    "mbbs admission in russia",
    "how to apply for mbbs in russia",
    "mbbs in russia eligibility for indian students",
    "mbbs admission process in russia",
    "study mbbs in russia for indian students",
  ],
});

const keyTakeaways = [
  "MBBS admission in Russia is simpler than India private-college admission, but it is not a random seat-booking process. The real work is checking university fit, documents, visa timing, and India-return compliance before you pay.",
  "For Indian students, the biggest practical filters are Class 12 PCB marks, a valid passport, clean documents, and NEET if you want the option to practise in India after graduation.",
  "The commercial SERP for this keyword is full of vague consultant pages. A page that gives the actual sequence, document list, and timeline has a real chance to rank and convert.",
];

const sections = [
  {
    title: "Who should use this page",
    paragraphs: [
      "This page is for students and parents comparing Russian medical universities after NEET, especially families who want to understand the process before paying a registration amount.",
      "The intent behind this keyword is not academic curiosity. It is practical and commercial: people want to know whether they are eligible, what documents are needed, how long it takes, and what can go wrong.",
    ],
  },
  {
    title: "Basic eligibility for Indian students",
    bullets: [
      "Class 12 with Physics, Chemistry, and Biology as core subjects.",
      "Minimum PCB percentage depends on the university and your reservation category, but the safe working assumption is to meet the usual NMC-linked overseas-medical threshold before shortlisting.",
      "A valid NEET-UG score is essential if you want to preserve the India-return pathway after graduating abroad.",
      "A valid passport with enough remaining validity for invitation, visa, and travel processing.",
      "A student profile that matches the university's intake timing, document rules, and hostel availability.",
    ],
  },
  {
    title: "How MBBS admission in Russia usually works",
    cards: [
      {
        title: "1. University shortlist",
        body:
          "First shortlist universities by budget, city, English-medium delivery, hostel setup, and India-return fit. Admission should start with university selection, not a consultant telling you the next 'available seat'.",
      },
      {
        title: "2. Document review",
        body:
          "Your passport, Class 10 and 12 documents, NEET scorecard if relevant, photographs, and identity details are reviewed before the university issues an offer or invitation workflow begins.",
      },
      {
        title: "3. Application and offer",
        body:
          "The chosen university or its authorised channel reviews the file and issues the provisional admission or acceptance paperwork used for the invitation and visa process.",
      },
      {
        title: "4. Invitation and visa",
        body:
          "Once the invitation is issued, the visa file is prepared. This is where timing matters, because late invitation processing or missing medical paperwork can push a student dangerously close to intake.",
      },
      {
        title: "5. Departure and on-campus registration",
        body:
          "After visa approval, the student travels, completes local registration, hostel check-in, and university enrolment. Families should know exactly what is paid before departure and what is paid on arrival.",
      },
      {
        title: "6. Academic start",
        body:
          "Most Russia intakes for these programs are in September. That means students who start serious admission work too late can lose choice quality even if seats technically remain.",
      },
    ],
  },
  {
    title: "Documents families should keep ready",
    bullets: [
      "Class 10 marksheet and certificate.",
      "Class 12 marksheet and certificate.",
      "NEET scorecard if the student wants the India-return pathway.",
      "Valid passport.",
      "Passport-size photographs in the format requested by the university and visa process.",
      "Medical fitness and any embassy or university-specific medical paperwork required during visa processing.",
      "Migration or transfer documents where applicable.",
    ],
  },
  {
    title: "Where most Russia admission delays happen",
    paragraphs: [
      "The biggest delay points are usually not university rejection. They are late passport work, poor-quality document scans, mismatch between student profile and university expectation, and underestimating invitation or visa processing time.",
      "Another common issue is chasing the cheapest Russia seat first and only later asking whether the university is the right fit for English delivery, hostel support, and India-return planning. By then, families have often already paid a non-refundable amount.",
    ],
  },
  {
    title: "What this means commercially for Indian families",
    paragraphs: [
      "If your goal is admission in Russia, the right next step is not filling ten enquiry forms. It is getting a shortlist that matches your budget, NEET status, preferred city, and return-to-India plan.",
      "The reason this page should convert is simple: families searching this keyword are already close to action. They need clarity, not generic country praise.",
    ],
  },
];

const faqItems = [
  {
    question: "Is MBBS admission in Russia difficult for Indian students?",
    answer:
      "Compared with Indian private-college competition, admission is operationally easier, but that does not mean every university is automatically the right fit. The hard part is choosing the right university and keeping the India-return pathway safe.",
  },
  {
    question: "Can I get MBBS admission in Russia without NEET?",
    answer:
      "Some universities may process admission, but if you want to practise in India after graduation, you should treat NEET as essential before joining the program.",
  },
  {
    question: "When should I start the Russia admission process?",
    answer:
      "Start several months before the September intake so you have time for shortlisting, offer paperwork, invitation processing, visa work, and travel without settling for the last available option.",
  },
  {
    question: "What is the most important document in the Russia MBBS admission process?",
    answer:
      "There is no single document. The real requirement is a clean file: academic records, passport, and any India-return planning documents like NEET should all be ready early.",
  },
  {
    question: "Should I choose the cheapest university first and ask questions later?",
    answer:
      "No. Fee matters, but university fit, medium, city, hostel support, and pathway risk matter more than a cheap headline number.",
  },
];

const officialSources = [
  {
    label: "Study in Russia official portal",
    href: "https://www.studyinrussia.ru/en/",
    note:
      "Official portal used to understand the broad admission flow, applicant status, document preparation, and university choice process.",
  },
  {
    label: "Study in Russia applicant instruction guide",
    href: "https://education-in-russia.com/settings/static/media/Instruction%28en%29.pdf",
    note:
      "Shows the practical application flow on the official Russia admissions platform, including profile completion, application creation, document upload, and verification steps.",
  },
  {
    label: "NMC information desk for students studying abroad",
    href: "https://www.nmc.org.in/information-desk/for-students-to-study-in-abroad",
    note:
      "Primary India-side reference for students planning foreign medical education and wanting to preserve the pathway back to India.",
  },
  {
    label: "NMC FMGL 2021 FAQ",
    href: "https://www.nmc.org.in/MCIRest/open/getDocument?path=%2FDocuments%2FPublic%2FPortal%2FLatestNews%2F20220222165635.pdf",
    note:
      "Useful for understanding the rules that matter later when an Indian student returns after a foreign medical degree.",
  },
];

export default function MbbsAdmissionInRussiaPage() {
  return (
    <CommercialSeoGuidePage
      path={pagePath}
      title="MBBS Admission in Russia for Indian Students: the practical 2026 guide"
      updatedOn="Updated on 23 May 2026"
      kicker="Russia admissions"
      summary="If you are planning MBBS admission in Russia, the real decision is not whether admission is possible. It is whether you are choosing the right university, preparing the right documents, and entering on a pathway that still makes sense for India-return goals later."
      publishedDate={publishedDate}
      countrySlug="russia"
      primaryHref="/mbbs-in-russia"
      primaryLabel="Explore MBBS in Russia"
      secondaryHref="/contact"
      secondaryLabel="Talk to admissions team"
      keyTakeaways={keyTakeaways}
      sections={sections}
      faqItems={faqItems}
      officialSources={officialSources}
      leadTitle="Get a Russia admission shortlist"
      leadDescription="We can help you filter Russian universities by budget, NEET status, medium, city, and India-return fit before you start paying registration charges."
      notes="Interest: MBBS admission in Russia"
    />
  );
}
