import type { ProgramSection } from "@/lib/university-sections";

export function getProgramSectionSummary(section: ProgramSection | null, props: { courseShortName: string; universityName: string; hasFee: boolean; feeIsAnnual: boolean }) {
  switch (section) {
    case "admissions":
      return `How to apply for ${props.courseShortName} at ${props.universityName} — step-by-step process, documents required, and application timeline.`;
    case "eligibility":
      return `Eligibility criteria and academic qualifications needed to apply for ${props.courseShortName} at ${props.universityName}.`;
    case "fees":
      if (props.hasFee && !props.feeIsAnnual) return `Available programme fees for ${props.courseShortName} at ${props.universityName}. Plan your application and college budget.`;
      return `Year-wise ${props.courseShortName} fee breakdown at ${props.universityName} — annual tuition, hostel costs, and total program cost in USD.`;
    case "recognition":
      return `Recognition and accreditation status of ${props.courseShortName} at ${props.universityName} — badges and official verification links.`;
    default:
      return `Academic structure, teaching phases, and curriculum for ${props.courseShortName} at ${props.universityName}.`;
  }
}
