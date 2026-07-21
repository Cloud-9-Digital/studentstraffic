export type FeeDetail = {
  label: string;
  amount: string;
};

export type UniversityFeeStructure = {
  universityName: string;
  universitySlug: string;
  academicYear: string;
  programmeLength: string;
  annualTuition: string;
  paymentSchedule?: string;
  totalTuition?: string;
  scholarship?: FeeDetail;
  confirmedCharges: FeeDetail[];
  notes: string[];
};

/**
 * Public fee summaries are deliberately narrow. Only academic-year-specific
 * amounts supported by a current university fee notice or admission circular
 * belong here. Partner service packages, travel, visa, insurance and hostel
 * estimates must not be blended into university tuition.
 */
const universityFeeStructures: Record<string, UniversityFeeStructure> = {
  "dong-a-university-college-of-medicine": {
    universityName: "Dong A University",
    universitySlug: "dong-a-university-college-of-medicine",
    academicYear: "2026 international intake",
    programmeLength: "6 years",
    annualTuition: "$4,500 net",
    paymentSchedule: "2 semesters × $2,250",
    totalTuition: "$27,000 net",
    scholarship: {
      label: "Published international scholarship",
      amount: "$500 each year (gross tuition: $5,000)",
    },
    confirmedCharges: [],
    notes: [
      "The university publishes the net tuition after its annual scholarship for the full six-year programme.",
      "Accommodation, visa, insurance, travel and partner service charges are separate from tuition and are not included here.",
    ],
  },
  "dai-nam-university-faculty-of-medicine": {
    universityName: "Dai Nam University",
    universitySlug: "dai-nam-university-faculty-of-medicine",
    academicYear: "Current international Medicine programme",
    programmeLength: "6 years",
    annualTuition: "$5,000",
    confirmedCharges: [],
    notes: [
      "The published figure is annual tuition for the English-medium international Medicine programme.",
      "A six-year total is not displayed because the public notice does not state that future annual tuition is fixed.",
      "Accommodation, visa, insurance, travel and partner service charges are separate from tuition and are not included here.",
    ],
  },
  "buon-ma-thuot-medical-university": {
    universityName: "Buon Ma Thuot Medical University",
    universitySlug: "buon-ma-thuot-medical-university",
    academicYear: "2026 international intake",
    programmeLength: "6 years",
    annualTuition: "$5,500",
    confirmedCharges: [],
    notes: [
      "The published figure applies to the 2026 English-taught Medicine intake for international students.",
      "A six-year total is not displayed because the admission notice publishes an annual fee rather than a fixed full-course price.",
      "Accommodation, visa, insurance, travel and partner service charges are separate from tuition and are not included here.",
    ],
  },
  "can-tho-university-medicine-pharmacy": {
    universityName: "Can Tho University of Medicine and Pharmacy",
    universitySlug: "can-tho-university-medicine-pharmacy",
    academicYear: "2026–27",
    programmeLength: "6 years",
    annualTuition: "VND 131,890,000",
    paymentSchedule: "3 payment periods in the academic year",
    confirmedCharges: [],
    notes: [
      "The amount is the university's 2026–27 international-student fee for the English programme.",
      "Medicine, Dentistry and Pharmacy are also listed at VND 5,311,000 per credit in the same fee decision.",
      "A full-course total is not displayed because the decision sets the 2026–27 rate only.",
    ],
  },
};

export function getFeeStructuresForSlugs(slugs: string[]): UniversityFeeStructure[] {
  return slugs.flatMap((slug) =>
    universityFeeStructures[slug] ? [universityFeeStructures[slug]] : []
  );
}
