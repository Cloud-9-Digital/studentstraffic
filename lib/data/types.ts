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

export type UniversityGalleryImage = {
  url: string;
  alt: string;
  caption?: string;
};

export type University = {
  slug: string;
  countrySlug: string;
  name: string;
  city: string;
  type: "Public" | "Private";
  logoUrl?: string;
  coverImageUrl?: string;
  galleryImages: UniversityGalleryImage[];
  establishedYear: number;
  summary: string;
  featured: boolean;
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
  updatedAt?: string;
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
  officialProgramUrl: string;
  medium: "English" | "English + Local Support" | "Vietnamese";
  teachingPhases: TeachingPhase[];
  yearlyCostBreakdown: YearlyCostBreakdown[];
  licenseExamSupport: string[];
  intakeMonths: string[];
  featured: boolean;
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

export type LandingPage = {
  slug: string;
  courseSlug: string;
  countrySlug: string;
  title: string;
  kicker: string;
  summary: string;
  heroHighlights: string[];
  reasonsToChoose: string[];
  editorialNotes: string[];
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

/** Lean projection used by the finder card list — strips all rich-text fields */
export type FinderCardProgram = {
  university: {
    slug: string;
    name: string;
    city: string;
    type: "Public" | "Private";
    logoUrl?: string;
    coverImageUrl?: string;
    galleryImages: UniversityGalleryImage[];
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
    featured: boolean;
  };
};

export type FinderOptions = {
  countries: Country[];
  courses: Course[];
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
