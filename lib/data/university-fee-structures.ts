export type HostelOption = {
  sharing: string;
  amountPerYear: string;
};

export type OneTimeCharge = {
  label: string;
  amount: string;
};

export type UniversityFeeStructure = {
  universityName: string;
  universitySlug: string;
  semestersPerYear: number;
  semesterFee: string;
  annualFee: string;
  registrationFee: string;
  totalUniversityFee: string;
  singlePaymentFee?: string;
  hostelOptions: HostelOption[];
  oneTimeCharges: OneTimeCharge[];
  totalOneTimeCharges: string;
  notes: string[];
};

const universityFeeStructures: Record<string, UniversityFeeStructure> = {
  "dong-a-university-college-of-medicine": {
    universityName: "Dong A University",
    universitySlug: "dong-a-university-college-of-medicine",
    semestersPerYear: 2,
    semesterFee: "$2,250",
    annualFee: "$4,500",
    registrationFee: "₹1,10,000 (~$1,214)",
    totalUniversityFee: "$27,000",
    hostelOptions: [
      { sharing: "4 Sharing", amountPerYear: "$2,500 / year" },
      { sharing: "3 Sharing", amountPerYear: "$2,700 / year" },
      { sharing: "2 Sharing", amountPerYear: "$2,850 / year" },
    ],
    oneTimeCharges: [
      { label: "Student visa, flight ticket & health insurance", amount: "₹76,000" },
      { label: "Ministry authentication & processing fee", amount: "₹1,60,000" },
      { label: "Documentation fee", amount: "₹50,000" },
    ],
    totalOneTimeCharges: "₹2,86,000 (~$3,158)",
    notes: [
      "Visa & health insurance to be renewed by students from 2nd year.",
      "₹100 caution deposit in 1st year — non-refundable.",
      "Amounts may vary with exchange rates at time of payment.",
      "2-sharing rooms subject to availability on a first-come-first-serve basis.",
      "Electricity bill paid separately on a monthly basis.",
      "All payments to be made before departing to Vietnam.",
      "Hostel fee is an estimate — contact your counsellor for the final figure.",
    ],
  },
  "phan-chau-trinh-university": {
    universityName: "Phan Chau Trinh University",
    universitySlug: "phan-chau-trinh-university",
    semestersPerYear: 2,
    semesterFee: "$2,600",
    annualFee: "$5,200",
    registrationFee: "₹1,10,000 (~$1,214)",
    totalUniversityFee: "$31,200",
    singlePaymentFee: "$26,250",
    hostelOptions: [
      { sharing: "4 Sharing", amountPerYear: "$2,400 / year" },
      { sharing: "3 Sharing", amountPerYear: "$2,600 / year" },
      { sharing: "2 Sharing", amountPerYear: "$2,750 / year" },
    ],
    oneTimeCharges: [
      { label: "Student visa, flight ticket & health insurance", amount: "₹76,000" },
      { label: "Ministry authentication & processing fee", amount: "₹1,60,000" },
      { label: "Documentation fee", amount: "₹50,000" },
    ],
    totalOneTimeCharges: "₹2,86,000 (~$3,158)",
    notes: [
      "Visa & health insurance to be renewed by students from 2nd year.",
      "₹100 caution deposit in 1st year — non-refundable.",
      "Amounts may vary with exchange rates at time of payment.",
      "Premium rooms available for 2-sharing and 3-sharing — contact your counsellor.",
      "2-sharing rooms subject to availability on a first-come-first-serve basis.",
      "Electricity bill paid separately on a monthly basis.",
      "All payments to be made before departing to Vietnam.",
    ],
  },
  "dai-nam-university-faculty-of-medicine": {
    universityName: "Dai Nam University",
    universitySlug: "dai-nam-university-faculty-of-medicine",
    semestersPerYear: 3,
    semesterFee: "$1,367",
    annualFee: "$4,101",
    registrationFee: "₹1,10,000 (~$1,214)",
    totalUniversityFee: "$24,606",
    singlePaymentFee: "$20,915",
    hostelOptions: [
      { sharing: "6 Sharing", amountPerYear: "$1,900 / year" },
      { sharing: "4 Sharing", amountPerYear: "$2,200 / year" },
      { sharing: "2 Sharing", amountPerYear: "$3,100 / year" },
    ],
    oneTimeCharges: [
      { label: "Student visa, flight ticket & health insurance", amount: "₹76,000" },
      { label: "Ministry authentication & processing fee", amount: "₹1,60,000" },
      { label: "Documentation fee", amount: "₹50,000" },
    ],
    totalOneTimeCharges: "₹2,86,000 (~$3,158)",
    notes: [
      "Visa & health insurance to be renewed by students from 2nd year.",
      "₹100 caution deposit in 1st year — non-refundable.",
      "Amounts may vary with exchange rates at time of payment.",
      "2-sharing rooms subject to availability on a first-come-first-serve basis.",
      "Electricity bill paid separately on a monthly basis.",
      "All payments to be made before departing to Vietnam.",
    ],
  },
  "buon-ma-thuot-medical-university": {
    universityName: "Buon Ma Thuot Medical University",
    universitySlug: "buon-ma-thuot-medical-university",
    semestersPerYear: 2,
    semesterFee: "$2,500",
    annualFee: "$5,000",
    registrationFee: "₹1,10,000 (~$1,214)",
    totalUniversityFee: "$30,000",
    hostelOptions: [
      { sharing: "4 Sharing", amountPerYear: "$2,400 / year" },
      { sharing: "3 Sharing", amountPerYear: "$2,500 / year" },
      { sharing: "2 Sharing", amountPerYear: "$2,600 / year" },
    ],
    oneTimeCharges: [
      { label: "Student visa, flight ticket & health insurance", amount: "₹76,000" },
      { label: "Ministry authentication & processing fee", amount: "₹1,60,000" },
      { label: "Documentation fee", amount: "₹50,000" },
    ],
    totalOneTimeCharges: "₹2,86,000 (~$3,158)",
    notes: [
      "Visa & health insurance to be renewed by students from 2nd year.",
      "₹100 caution deposit in 1st year — non-refundable.",
      "Amounts may vary with exchange rates at time of payment.",
      "Premium rooms available for 2-sharing — contact your counsellor.",
      "2-sharing rooms subject to availability on a first-come-first-serve basis.",
      "Electricity bill paid separately on a monthly basis.",
      "All payments to be made before departing to Vietnam.",
    ],
  },
};

export function getFeeStructuresForSlugs(slugs: string[]): UniversityFeeStructure[] {
  return slugs.flatMap((slug) =>
    universityFeeStructures[slug] ? [universityFeeStructures[slug]] : []
  );
}
