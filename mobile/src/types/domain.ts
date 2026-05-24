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
  teachingHospitals: string[];
  primaryOffering: {
    slug: string;
    courseSlug: string;
    title: string;
    durationYears: number;
    annualTuitionUsd: number;
    totalTuitionUsd: number;
    livingUsd: number;
    medium: string;
    intakeMonths: string[];
  } | null;
  offerings: Array<NonNullable<UniversityDetail["primaryOffering"]>>;
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
