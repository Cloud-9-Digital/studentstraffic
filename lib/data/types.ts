export type Country = {
  slug: string;
  name: string;
  region: string;
  summary: string;
  whyStudentsChooseIt: string;
  climate: string;
  currencyCode: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt?: string;
};

export type Course = {
  slug: string;
  name: string;
  shortName: string;
  durationYears: number;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt?: string;
};

export type LinkItem = {
  label: string;
  url: string;
};

export type ResearchSource = {
  label: string;
  url: string;
  kind:
    | "official-university"
    | "official-program"
    | "official-fee"
    | "government"
    | "recognition"
    | "other";
  checkedAt: string;
  notes?: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type TeachingPhase = {
  phase: string;
  language: string;
  details: string;
};

export type YearlyCostBreakdown = {
  yearLabel: string;
  tuitionUsd: number;
  hostelUsd: number;
  livingUsd: number;
  totalUsd: number;
  notes?: string;
};

export type University = {
  slug: string;
  countrySlug: string;
  name: string;
  city: string;
  type: "Public" | "Private";
  logoUrl?: string;
  coverImageUrl?: string;
  establishedYear: number;
  summary: string;
  featured: boolean;
  published: boolean;
  officialWebsite: string;
  campusLifestyle: string;
  cityProfile: string;
  clinicalExposure: string;
  hostelOverview: string;
  indianFoodSupport: string;
  safetyOverview: string;
  studentSupport: string;
  whyChoose: string[];
  thingsToConsider: string[];
  bestFitFor: string[];
  teachingHospitals: string[];
  recognitionBadges: string[];
  recognitionLinks: LinkItem[];
  faq: Faq[];
  similarUniversitySlugs: string[];
  lastVerifiedAt?: string;
  researchSources: ResearchSource[];
  researchNotes?: string;
  admissionsContent?: UniversityAdmissionsContent;
  updatedAt?: string;
};

export type StudentPeerStatus = "active" | "inactive";

export type StudentPeerApplicationStatus = "pending" | "approved" | "rejected";

export type PeerPreferredContactMode = "Call" | "WhatsApp" | "Either";

export type PeerRequestStatus = "new" | "contacted" | "matched" | "closed";

export type StudentPeer = {
  id: number;
  universitySlug: string;
  fullName: string;
  courseName?: string;
  currentYearOrBatch?: string;
  contactPhone?: string;
  contactEmail?: string;
  status: StudentPeerStatus;
  updatedAt?: string;
};

export type PeerRequest = {
  id: number;
  universitySlug: string;
  fullName: string;
  phone: string;
  email?: string;
  userState: string;
  courseInterest?: string;
  preferredContactMode?: PeerPreferredContactMode;
  message?: string;
  status: PeerRequestStatus;
  leadId?: number;
  matchedPeerId?: number;
  createdAt?: string;
};

export type UniversityPeerAvailability = {
  universitySlug: string;
  activePeerCount: number;
  hasPeers: boolean;
};

export type ProgramOffering = {
  slug: string;
  universitySlug: string;
  courseSlug: string;
  title: string;
  durationYears: number;
  annualTuitionUsd: number;
  totalTuitionUsd: number;
  livingUsd: number;
  officialFeeCurrency?: string;
  officialAnnualTuitionAmount?: number;
  officialTotalTuitionAmount?: number;
  officialProgramUrl: string;
  medium: "English" | "English + Local Support" | "Vietnamese";
  published: boolean;
  teachingPhases: TeachingPhase[];
  yearlyCostBreakdown: YearlyCostBreakdown[];
  licenseExamSupport: string[];
  intakeMonths: string[];
  feeVerifiedAt?: string;
  fxRateDate?: string;
  fxRateSourceUrl?: string;
  feeNotes?: string;
  sourceUrls: string[];
  featured: boolean;
  updatedAt?: string;
};

export type WdomsDirectoryEntry = {
  countrySlug: string;
  countryName: string;
  schoolId: string;
  schoolName: string;
  cityName: string;
  schoolUrl: string;
  schoolType?: string;
  operationalStatus?: string;
  yearInstructionStarted?: number;
  academicAffiliation?: string;
  clinicalFacilities?: string;
  clinicalTraining?: string;
  schoolWebsite?: string;
  mainAddress?: string;
  qualificationTitle?: string;
  curriculumDuration?: string;
  languageOfInstruction?: string;
  prerequisiteEducation?: string;
  foreignStudents?: string;
  entranceExam?: string;
  routeSlug: string;
  matchedUniversitySlug?: string;
  matchedUniversityName?: string;
};

export type UniversityReviewType = "text" | "youtube_video";

export type UniversityReviewVisibilityStatus = "live" | "hidden" | "archived";

export type UniversityReviewVerificationStatus = "unverified" | "verified";

export type UniversityReview = {
  id: number;
  universitySlug: string;
  reviewType: UniversityReviewType;
  reviewerName: string;
  reviewerEmail?: string;
  reviewerContext?: string;
  reviewBody?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  starRating?: number;
  visibilityStatus: UniversityReviewVisibilityStatus;
  verificationStatus: UniversityReviewVerificationStatus;
  isFeatured: boolean;
  isShort: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type AtAGlanceRow = {
  label: string;
  value: string;
};

export type EligibilityCriteria = {
  intro: string;
  items: string[];
};

export type DocumentsRequired = {
  educational: string[];
  visa: string[];
};

export type UniversityAdmissionsContent = {
  overview?: string;
  eligibility?: EligibilityCriteria;
  admissionSteps?: string[];
  documentsRequired?: DocumentsRequired;
  deadlinesNote?: string;
  scholarshipInfo?: string;
  licensingPathway?: string[];
};

export type SyllabusPhase = {
  phase: string;
  years: string;
  highlights: string[];
};

export type IndiaComparisonRow = {
  criterion: string;
  india: string;
  abroad: string;
};

export type CostOfLivingItem = {
  category: string;
  range: string;
  notes?: string;
};

export type CostOfLiving = {
  intro: string;
  items: CostOfLivingItem[];
};

export type IntakeTimelineItem = {
  milestone: string;
  timeline: string;
  details?: string;
};

export type LivingCostItem = {
  item: string;
  cost: string;
};

export type ChallengeItem = {
  title: string;
  realityCheck: string;
};

export type LandingPage = {
  slug: string;
  courseSlug: string;
  countrySlug: string;
  title: string;
  kicker: string;
  summary: string;
  heroHighlights: string[];
  reasonsToChoose: string[];
  featuredUniversitySlugs: string[];
  faq: Faq[];
  metaTitle: string;
  metaDescription: string;
  atAGlance?: AtAGlanceRow[];
  eligibility?: EligibilityCriteria;
  admissionSteps?: string[];
  documentsRequired?: DocumentsRequired;
  syllabusPhases?: SyllabusPhase[];
  indiaComparison?: IndiaComparisonRow[];
  intakeTimeline?: IntakeTimelineItem[];
  livingCostBreakdown?: LivingCostItem[];
  challenges?: ChallengeItem[];
  hostelInfo?: string;
  scholarshipInfo?: string;
  careerOpportunities?: string[];
};

export type FinderFilters = {
  q?: string;
  country?: string;
  course?: string;
  feeMin?: number;
  feeMax?: number;
  medium?: string;
  intake?: string;
  universityType?: "Public" | "Private";
  sort?: FinderSort;
};

export type FinderSort =
  | "recommended"
  | "tuition_asc"
  | "tuition_desc"
  | "name_asc";

export type FinderProgram = {
  country: Country;
  course: Course;
  university: University;
  offering: ProgramOffering;
};

export type FinderCountryOption = {
  slug: string;
  name: string;
};

export type FinderCourseOption = {
  slug: string;
  shortName: string;
};

/** Lean projection used by the finder card list — strips all rich-text fields */
export type FinderCardProgram = {
  university: {
    slug: string;
    name: string;
    city: string;
    type: "Public" | "Private";
    logoUrl?: string;
    coverImageUrl?: string;
    featured: boolean;
  };
  country: {
    slug: string;
    name: string;
  };
  course: {
    slug: string;
    shortName: string;
  };
  offering: {
    slug: string;
    annualTuitionUsd: number;
    officialFeeCurrency?: string;
    officialAnnualTuitionAmount?: number;
    featured: boolean;
  };
};

export type FinderOptions = {
  countries: FinderCountryOption[];
  courses: FinderCourseOption[];
  mediums: ProgramOffering["medium"][];
  intakes: string[];
};

export type FinderProgramsPage = {
  programs: FinderProgram[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type FinderCardProgramsPage = {
  programs: FinderCardProgram[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type SearchDocumentType =
  | "country"
  | "course"
  | "university"
  | "program"
  | "landing_page";

export type SearchDocument = {
  documentType: SearchDocumentType;
  sourceSlug: string;
  path: string;
  title: string;
  subtitle?: string;
  summary: string;
  searchText: string;
  highlights: string[];
  countrySlug?: string;
  courseSlug?: string;
  universitySlug?: string;
  city?: string;
  featured: boolean;
  annualTuitionUsd?: number;
  medium?: string;
  intakeMonths: string[];
};

export type SearchResult = SearchDocument & {
  id: number;
  score: number;
};

export type SearchFilters = {
  q?: string;
  type?: SearchDocumentType;
  country?: string;
  course?: string;
};
