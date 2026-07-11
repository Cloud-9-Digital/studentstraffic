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
  hostelOverview?: string;
  indianFoodSupport?: string;
  safetyOverview?: string;
  studentSupport?: string;
  whyChoose: string[];
  thingsToConsider: string[];
  bestFitFor: string[];
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
  budgetUsd?: number | null;
  preferredCountries: string[];
};

export type CallBooking = {
  bookingId: number;
  peerId: number;
  fullName: string;
  courseName?: string | null;
  currentYearOrBatch?: string | null;
  photoUrl?: string | null;
  universityName: string;
  universitySlug: string;
  bookingStatus: string;
  createdAt?: string | null;
};

export type GuideConversation = {
  id: number;
  peerId: number;
  bookingId: number | null;
  displayName: string;
  subtitle: string;
  universityName: string;
  universitySlug: string;
  lastMessageText: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  counterpartLastReadAt?: string | null;
};

export type GuideConversationStarter = {
  peerId: number;
  bookingId?: number;
  peerName: string;
  universityName: string;
  universitySlug: string;
  bookingStatus: string;
  conversationId: number | null;
  lastMessageAt: string | null;
};

export type GuideMessage = {
  id: number;
  conversationId: number;
  senderUserId: string;
  senderName: string | null;
  body: string;
  createdAt: string | null;
  isMine: boolean;
};

export type GuideCallEvent = {
  id: string;
  callId: string;
  direction: "incoming" | "outgoing";
  status: string;
  createdAt: string | null;
  answeredAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
};

export type CallTokenResponse = {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
  call: {
    id: string;
    status: string;
    peerName: string;
    callerName: string | null;
    universityName: string;
    isPeerParticipant: boolean;
  };
};

export type IncomingCall = {
  id: string;
  peerName: string;
  universityName: string;
  createdAt: string | null;
  status: string;
};
