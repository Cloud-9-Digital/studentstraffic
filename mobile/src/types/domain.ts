export type University = {
  slug: string;
  name: string;
  countrySlug?: string;
  country: string;
  city: string;
  type?: string;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  course?: string;
  courseSlug?: string;
  offeringSlug?: string;
  tuitionUsd: number;
  duration?: string;
  medium?: string;
  recognition?: string[];
  summary?: string;
  fit?: string;
  isShortlisted?: boolean;
  imageTone: "green" | "blue" | "coral";
};

export type YearlyCost = {
  yearLabel: string;
  tuitionUsd: number;
  hostelUsd: number;
  livingUsd: number;
  totalUsd: number;
  notes?: string;
};

export type AdmissionsContent = {
  overview?: string;
  eligibility?: { intro: string; items: string[] };
  admissionSteps?: string[];
  documentsRequired?: { educational: string[]; visa: string[] };
  deadlinesNote?: string;
  scholarshipInfo?: string;
  licensingPathway?: string[];
};

export type Offering = {
  slug: string;
  courseSlug: string;
  title: string;
  durationYears: number;
  annualTuitionUsd: number;
  totalTuitionUsd: number;
  livingUsd: number;
  officialProgramUrl?: string;
  medium: string;
  intakeMonths: string[];
  yearlyCostBreakdown: YearlyCost[];
  feeNotes?: string;
  licenseExamSupport: string[];
};

export type UniversityDetail = University & {
  establishedYear?: number;
  officialWebsite?: string;
  campusLifestyle?: string;
  cityProfile?: string;
  clinicalExposure?: string;
  hostelOverview?: string;
  indianFoodSupport?: string;
  safetyOverview?: string;
  studentSupport?: string;
  whyChoose: string[];
  thingsToConsider: string[];
  bestFitFor: string[];
  recognitionBadges: string[];
  recognitionLinks: { label: string; url: string }[];
  teachingHospitals: string[];
  faq: { question: string; answer: string }[];
  admissionsContent?: AdmissionsContent;
  primaryOffering: Offering | null;
  offerings: Offering[];
};

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "waitlisted";

export type StudentApplication = {
  id: string;
  universitySlug: string;
  universityName: string;
  universityCity?: string | null;
  countryName?: string | null;
  universityLogoUrl?: string | null;
  course: string;
  courseSlug?: string;
  status: ApplicationStatus;
  nextStep?: string;
  personalInfo?: Record<string, unknown>;
  applicationData?: Record<string, unknown>;
  submittedAt?: string | null;
  createdAt?: string;
  updatedAt: string;
};

export type StudentProfile = {
  name: string;
  email: string;
  phone: string;
  neetScore?: number | null;
  budgetUsd?: number | null;
  preferredCountries: string[];
};
