export type AdvisorySource = {
  label: string;
  url?: string;
};

export type UniversityRegulatoryAdvisory = {
  status: "named" | "network";
  title: string;
  body: string;
};

export type CountryRegulatoryAdvisory = {
  countrySlug: string;
  label: string;
  updatedAt: string;
  title: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sources: AdvisorySource[];
  universityNotesBySlug?: Record<string, UniversityRegulatoryAdvisory>;
};

const countryRegulatoryAdvisories: Record<string, CountryRegulatoryAdvisory> = {
  uzbekistan: {
    countrySlug: "uzbekistan",
    label: "NMC alert",
    updatedAt: "2026-04-01",
    title:
      "Indian students considering MBBS in Uzbekistan should treat admissions as a high-caution decision",
    summary:
      "In an alert note dated 1 April 2026, NMC told Indian students to exercise extreme caution before taking MBBS-equivalent admission in Uzbekistan. The note says FMGL 2021 non-compliance on course duration, English-medium teaching, clinical training, or internship may make students ineligible for registration in India.",
    keyPoints: [
      "The alert names Bukhara State Medical Institute, Samarkand State Medical University, Tashkent State Medical University, and TIT Institute of Medical Sciences, Bangalore linked to the TSMU Termez Branch offshore model.",
      "NMC says the Embassy of India in Tashkent flagged concerns around intake beyond capacity, weak hands-on training, non-English teaching conditions, and agent-led malpractice.",
      "NMC reiterates that FMGL 2021 requires at least 54 months of study in one institution, a 12-month internship at the same university, English-medium instruction, and compliant clinical training.",
      "NMC says failure to meet these conditions can result in ineligibility for registration to practise medicine in India.",
    ],
    actionItems: [
      "Ask for written proof of course duration, English-medium delivery, clinical rotations, and internship structure before paying any advance.",
      "Verify the exact university or branch directly with NMC and the Indian Embassy instead of relying on agents or WhatsApp claims.",
      "Avoid offshore, split-campus, transfer-style, or branch arrangements that can break the single-institution FMGL pathway.",
      "Treat low fees as secondary until the India-return licensing pathway is documented clearly in writing.",
    ],
    sources: [
      {
        label: "NMC alert note dated 1 Apr 2026",
      },
      {
        label: "NMC public notice dated 22 Nov 2024",
        url:
          "https://www.nmc.org.in/ActivitiWebClient/open/getDocument?path=%2FDocuments%2FPublic%2FPortal%2FLatestNews%2Fdocument-113_merged.pdf",
      },
      {
        label: "NMC advisory dated 19 May 2025",
        url:
          "https://www.nmc.org.in/ActivitiWebClient/open/getDocument?path=%2FDocuments%2FPublic%2FPortal%2FLatestNews%2FAdvisory+2.pdf",
      },
      {
        label: "MEA advisory for students pursuing higher education in Uzbekistan",
        url: "https://www.mea.gov.in/images/pdf/advisory-uzbekistan.pdf",
      },
    ],
    universityNotesBySlug: {
      "bukhara-state-medical-institute-abu-ali-ibn-sino": {
        status: "named",
        title:
          "Bukhara State Medical Institute is explicitly named in the 1 April 2026 NMC alert",
        body:
          "NMC specifically lists Bukhara State Medical Institute in its Uzbekistan alert and says students should verify FMGL 2021 compliance before admission or payment.",
      },
      "samarkand-state-medical-university": {
        status: "named",
        title:
          "Samarkand State Medical University is explicitly named in the 1 April 2026 NMC alert",
        body:
          "NMC specifically lists Samarkand State Medical University in its Uzbekistan alert and links the wider warning to Embassy concerns on standards, language, and training quality.",
      },
      "termez-branch-tsmu": {
        status: "named",
        title:
          "Complaints involving the TSMU Termez Branch model are referenced in the 1 April 2026 NMC alert",
        body:
          "NMC says it received complaints alleging serious FMGL 2021 violations by TSMU Termez Branch in association with TIT Institute of Medical Sciences, Bangalore under an offshore-campus model.",
      },
      "chirchik-branch-tsmu": {
        status: "network",
        title:
          "This page belongs to the TSMU network named in the 1 April 2026 NMC alert",
        body:
          "The alert does not explicitly name the Chirchik branch. This is an inference from the branch's TSMU affiliation, so students should seek branch-specific written clarification from NMC, the university, and the Indian Embassy before paying.",
      },
    },
  },
};

export function getCountryRegulatoryAdvisory(
  slug: string
): CountryRegulatoryAdvisory | null {
  return countryRegulatoryAdvisories[slug] ?? null;
}

export function getUniversityRegulatoryAdvisory(
  countrySlug: string,
  universitySlug: string
): UniversityRegulatoryAdvisory | null {
  return (
    getCountryRegulatoryAdvisory(countrySlug)?.universityNotesBySlug?.[
      universitySlug
    ] ?? null
  );
}
