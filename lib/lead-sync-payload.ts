type QueryParamValue = string | string[];
type ClientContext = Record<
  string,
  string | number | boolean | null | string[]
>;

export type LeadKind =
  | "general_enquiry"
  | "seminar_enquiry"
  | "seminar_registration"
  | "peer_request"
  | "peer_connection"
  | "wati_inbound";

export type LeadSyncPayload = {
  websiteLeadId?: number;
  handoffVersion?: string;
  leadKind?: LeadKind;
  sourceCategory?: string;
  acquisitionChannel?: string;
  primaryInterestType?: "university" | "country" | "course" | "seminar" | "general";
  primaryInterestValue?: string;
  submittedAt: string;
  fullName: string;
  phone: string;
  email?: string;
  fatherName?: string;
  alternatePhone?: string;
  city?: string;
  seminarEvent?: string;
  interestedCountry?: string;
  budgetRange?: string;
  needsFmgeSession?: boolean;
  documentUrl?: string;
  documentType?: string;
  userState?: string;
  neetScore?: number;
  courseSlug?: string;
  countrySlug?: string;
  universitySlug?: string;
  sourcePath: string;
  sourceUrl?: string;
  sourceQuery: Record<string, QueryParamValue>;
  pageTitle?: string;
  ctaVariant: string;
  notes?: string;
  documentReferrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  gbraid?: string;
  wbraid?: string;
  ttclid?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  acceptLanguage?: string;
  clientContext: ClientContext;
};
