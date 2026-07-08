import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import type {
  CourseStream,
  Faq,
  IndiaMbbsCollegeEditorialContent,
  LinkItem,
  PeerRequestStatus,
  PeerCallStatus,
  SearchDocument,
  StudentPeerApplicationStatus,
  StudentPeerStatus,
  ResearchSource,
  TeachingPhase,
  UniversityReviewType,
  UniversityReviewVerificationStatus,
  UniversityReviewVisibilityStatus,
  UniversityAdmissionsContent,
  YearlyCostBreakdown,
} from "@/lib/data/types";
import type { IndexableMetadataInput } from "@/lib/metadata";
import type { StudyAbroadGuidePageProps } from "@/components/site/study-abroad-guide-page";

export type UniversityResearchStructuredFacts = {
  universityName?: string;
  country?: string;
  city?: string;
  universityType?: "Public" | "Private";
  establishedYear?: number;
  officialWebsite?: string;
  programName?: string;
  programDurationYears?: number;
  mediumOfInstruction?: string;
  intakeMonths?: string[];
  annualTuitionLocal?: number;
  annualTuitionUsd?: number;
  totalTuitionUsd?: number;
  officialFeeCurrency?: string;
  hostelNote?: string;
  clinicalTrainingNote?: string;
  admissionRequirements?: string;
  recognitionNotes?: string;
  teachingHospitals?: string[];
  sourceUrls?: string[];
  lastVerifiedDate?: string;
  confidenceLevel?: "high" | "medium" | "low";
  researcherNotes?: string;
};

export type UniversityResearchDraftContent = {
  summary?: string;
  whyChoose?: string[];
  thingsToConsider?: string[];
  bestFitFor?: string[];
  campusLifestyle?: string;
  hostelOverview?: string;
  indianFoodSupport?: string;
  safetyOverview?: string;
  studentSupport?: string;
  clinicalExposure?: string;
  admissionsContent?: Record<string, unknown>;
  faq?: { question: string; answer: string }[];
  yearlyCostBreakdown?: {
    yearLabel: string;
    tuitionUsd: number;
    hostelUsd: number;
    livingUsd: number;
    totalUsd: number;
    notes?: string;
  }[];
};

type JsonValue = string | number | boolean | null | string[];
type LeadSourceQuery = Record<string, string | string[]>;
type LeadClientContext = Record<
  string,
  JsonValue
>;
type AdminAuditLogMetadata = Record<string, JsonValue>;
type IndiaMedicalSourceRow = Record<string, string | number | boolean | null>;
type UniversityResearchQueuePriority = "high" | "medium" | "low";
type UniversityResearchQueueStatus =
  | "new"
  | "researching"
  | "draft_ready"
  | "published"
  | "hold"
  | "rejected";
type UniversityResearchSourceBundle = Record<string, unknown>;

export type AdminUserRole = "owner" | "admin";

export const countries = pgTable(
  "countries",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    region: text("region").notNull(),
    summary: text("summary").notNull(),
    whyStudentsChooseIt: text("why_students_choose_it").notNull(),
    climate: text("climate").notNull(),
    currencyCode: text("currency_code").notNull(),
    metaTitle: text("meta_title").notNull(),
    metaDescription: text("meta_description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [uniqueIndex("countries_slug_idx").on(table.slug)]
);

export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    shortName: text("short_name").notNull(),
    stream: text("stream").$type<CourseStream>().notNull().default("medicine"),
    durationYears: integer("duration_years").notNull(),
    summary: text("summary").notNull(),
    metaTitle: text("meta_title").notNull(),
    metaDescription: text("meta_description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("courses_slug_idx").on(table.slug),
    index("courses_stream_idx").on(table.stream),
  ]
);

export const universities = pgTable(
  "universities",
  {
    id: serial("id").primaryKey(),
    countryId: integer("country_id")
      .notNull()
      .references(() => countries.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    city: text("city").notNull(),
    type: text("type").notNull(),
    establishedYear: integer("established_year").notNull(),
    summary: text("summary").notNull(),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(true),
    officialWebsite: text("official_website").notNull(),
    logoUrl: text("logo_url"),
    coverImageUrl: text("cover_image_url"),
    campusLifestyle: text("campus_lifestyle").notNull(),
    cityProfile: text("city_profile").notNull(),
    practicalExposure: text("practical_exposure").notNull(),
    hostelOverview: text("hostel_overview").notNull(),
    dietarySupport: text("dietary_support").notNull(),
    safetyOverview: text("safety_overview").notNull(),
    studentSupport: text("student_support").notNull(),
    whyChoose: jsonb("why_choose").$type<string[]>().notNull().default([]),
    thingsToConsider: jsonb("things_to_consider")
      .$type<string[]>()
      .notNull()
      .default([]),
    bestFitFor: jsonb("best_fit_for").$type<string[]>().notNull().default([]),
    industryPartners: text("industry_partners").array().notNull().default([]),
    recognitionBadges: text("recognition_badges").array().notNull().default([]),
    recognitionLinks: jsonb("recognition_links")
      .$type<LinkItem[]>()
      .notNull()
      .default([]),
    faq: jsonb("faq").$type<Faq[]>().notNull().default([]),
    similarUniversitySlugs: text("similar_university_slugs")
      .array()
      .notNull()
      .default([]),
    lastVerifiedAt: text("last_verified_at"),
    researchSources: jsonb("research_sources")
      .$type<ResearchSource[]>()
      .notNull()
      .default([]),
    researchNotes: text("research_notes"),
    admissionsContent: jsonb("admissions_content")
      .$type<UniversityAdmissionsContent>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("universities_slug_idx").on(table.slug),
    index("universities_country_idx").on(table.countryId),
    index("universities_country_city_idx").on(table.countryId, table.city),
  ]
);

export const programOfferings = pgTable(
  "program_offerings",
  {
    id: serial("id").primaryKey(),
    universityId: integer("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    durationYears: numeric("duration_years", { precision: 4, scale: 1, mode: "number" }).notNull(),
    annualTuitionUsd: integer("annual_tuition_usd").notNull(),
    totalTuitionUsd: integer("total_tuition_usd").notNull(),
    livingUsd: integer("living_usd").notNull(),
    officialFeeCurrency: text("official_fee_currency"),
    officialAnnualTuitionAmount: bigint("official_annual_tuition_amount", {
      mode: "number",
    }),
    officialTotalTuitionAmount: bigint("official_total_tuition_amount", {
      mode: "number",
    }),
    officialProgramUrl: text("official_program_url").notNull(),
    medium: text("medium").notNull(),
    published: boolean("published").notNull().default(true),
    teachingPhases: jsonb("teaching_phases")
      .$type<TeachingPhase[]>()
      .notNull()
      .default([]),
    yearlyCostBreakdown: jsonb("yearly_cost_breakdown")
      .$type<YearlyCostBreakdown[]>()
      .notNull()
      .default([]),
    professionalExamSupport: jsonb("professional_exam_support")
      .$type<string[]>()
      .notNull()
      .default([]),
    intakeMonths: text("intake_months").array().notNull().default([]),
    feeVerifiedAt: text("fee_verified_at"),
    fxRateDate: text("fx_rate_date"),
    fxRateSourceUrl: text("fx_rate_source_url"),
    feeNotes: text("fee_notes"),
    sourceUrls: text("source_urls").array().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("program_offerings_slug_idx").on(table.slug),
    index("program_offerings_university_idx").on(table.universityId),
    index("program_offerings_course_idx").on(table.courseId),
    index("program_offerings_fee_idx").on(table.annualTuitionUsd),
    index("program_offerings_medium_idx").on(table.medium),
  ]
);

export const cityProfiles = pgTable(
  "city_profiles",
  {
    id: serial("id").primaryKey(),
    countrySlug: text("country_slug").notNull(),
    city: text("city").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("city_profiles_country_city_idx").on(table.countrySlug, table.city),
    index("city_profiles_country_idx").on(table.countrySlug),
  ]
);

export const wdomsDirectoryEntries = pgTable(
  "wdoms_directory_entries",
  {
    id: serial("id").primaryKey(),
    countrySlug: text("country_slug").notNull(),
    countryName: text("country_name").notNull(),
    schoolId: text("school_id").notNull(),
    schoolName: text("school_name").notNull(),
    cityName: text("city_name").notNull(),
    schoolUrl: text("school_url").notNull(),
    schoolType: text("school_type"),
    operationalStatus: text("operational_status"),
    yearInstructionStarted: integer("year_instruction_started"),
    academicAffiliation: text("academic_affiliation"),
    clinicalFacilities: text("clinical_facilities"),
    clinicalTraining: text("clinical_training"),
    schoolWebsite: text("school_website"),
    mainAddress: text("main_address"),
    qualificationTitle: text("qualification_title"),
    curriculumDuration: text("curriculum_duration"),
    languageOfInstruction: text("language_of_instruction"),
    prerequisiteEducation: text("prerequisite_education"),
    foreignStudents: text("foreign_students"),
    entranceExam: text("entrance_exam"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("wdoms_directory_entries_school_id_idx").on(table.schoolId),
    index("wdoms_directory_entries_country_idx").on(table.countrySlug),
  ]
);

export const indiaMedicalColleges = pgTable(
  "india_medical_colleges",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    collegeCode: text("college_code"),
    collegeName: text("college_name").notNull(),
    stateName: text("state_name").notNull(),
    cityName: text("city_name"),
    managementType: text("management_type"),
    universityName: text("university_name"),
    sourceAuthority: text("source_authority").notNull().default("NMC"),
    sourceFileName: text("source_file_name"),
    importBatch: text("import_batch"),
    sourceUrl: text("source_url"),
    rawRow: jsonb("raw_row")
      .$type<IndiaMedicalSourceRow>()
      .notNull()
      .default({}),
    editorialContent: jsonb("editorial_content")
      .$type<IndiaMbbsCollegeEditorialContent>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("india_medical_colleges_slug_idx").on(table.slug),
    uniqueIndex("india_medical_colleges_code_idx").on(table.collegeCode),
    index("india_medical_colleges_state_idx").on(table.stateName),
    index("india_medical_colleges_management_idx").on(table.managementType),
  ],
);

export const indiaMedicalPrograms = pgTable(
  "india_medical_programs",
  {
    id: serial("id").primaryKey(),
    collegeId: integer("college_id")
      .notNull()
      .references(() => indiaMedicalColleges.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    courseName: text("course_name").notNull(),
    yearOfInception: integer("year_of_inception"),
    annualIntakeSeats: integer("annual_intake_seats"),
    sourceAuthority: text("source_authority").notNull().default("NMC"),
    sourceFileName: text("source_file_name"),
    sourceRowNumber: integer("source_row_number"),
    importBatch: text("import_batch"),
    sourceUrl: text("source_url"),
    rawRow: jsonb("raw_row")
      .$type<IndiaMedicalSourceRow>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("india_medical_programs_slug_idx").on(table.slug),
    index("india_medical_programs_college_idx").on(table.collegeId),
    index("india_medical_programs_course_idx").on(table.courseName),
  ],
);

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    fatherName: text("father_name"),
    alternatePhone: text("alternate_phone"),
    city: text("city"),
    seminarEvent: text("seminar_event"),
    seminarAttendeeCount: integer("seminar_attendee_count"),
    interestedCountry: text("interested_country"),
    budgetRange: text("budget_range"),
    needsFmgeSession: boolean("needs_fmge_session"),
    documentUrl: text("document_url"),
    documentType: text("document_type"),
    userState: text("user_state"),
    neetScore: integer("neet_score"),
    neetCategory: text("neet_category"),
    courseSlug: text("course_slug"),
    countrySlug: text("country_slug"),
    universitySlug: text("university_slug"),
    sourcePath: text("source_path").notNull(),
    sourceUrl: text("source_url"),
    sourceQuery: jsonb("source_query")
      .$type<LeadSourceQuery>()
      .notNull()
      .default({}),
    visitorId: text("visitor_id"),
    initialLandingPath: text("initial_landing_path"),
    initialLandingUrl: text("initial_landing_url"),
    initialReferrer: text("initial_referrer"),
    initialUtmLandingUrl: text("initial_utm_landing_url"),
    pageTitle: text("page_title"),
    ctaVariant: text("cta_variant").notNull(),
    notes: text("notes"),
    documentReferrer: text("document_referrer"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    gclid: text("gclid"),
    fbclid: text("fbclid"),
    gbraid: text("gbraid"),
    wbraid: text("wbraid"),
    ttclid: text("ttclid"),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    acceptLanguage: text("accept_language"),
    clientContext: jsonb("client_context")
      .$type<LeadClientContext>()
      .notNull()
      .default({}),
    crmSyncStatus: text("crm_sync_status").notNull().default("not_attempted"),
    crmSyncedAt: timestamp("crm_synced_at", { withTimezone: true }),
    crmSyncError: text("crm_sync_error"),
    crmExternalId: text("crm_external_id"),
    pabblySyncStatus: text("pabbly_sync_status")
      .notNull()
      .default("not_attempted"),
    pabblySyncedAt: timestamp("pabbly_synced_at", { withTimezone: true }),
    pabblySyncError: text("pabbly_sync_error"),
    leadSquaredSyncStatus: text("leadsquared_sync_status")
      .notNull()
      .default("not_attempted"),
    leadSquaredSyncedAt: timestamp("leadsquared_synced_at", { withTimezone: true }),
    leadSquaredSyncError: text("leadsquared_sync_error"),
    leadSquaredExternalId: text("leadsquared_external_id"),
    watiMessageStatus: text("wati_message_status")
      .notNull()
      .default("not_attempted"),
    watiTemplateName: text("wati_template_name"),
    watiLocalMessageId: text("wati_local_message_id"),
    watiWhatsappMessageId: text("wati_whatsapp_message_id"),
    watiLastEvent: text("wati_last_event"),
    watiStatusUpdatedAt: timestamp("wati_status_updated_at", { withTimezone: true }),
    watiAcceptedAt: timestamp("wati_accepted_at", { withTimezone: true }),
    watiDeliveredAt: timestamp("wati_delivered_at", { withTimezone: true }),
    watiReadAt: timestamp("wati_read_at", { withTimezone: true }),
    watiFailedAt: timestamp("wati_failed_at", { withTimezone: true }),
    watiMessageError: text("wati_message_error"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("leads_created_at_idx").on(table.createdAt),
    index("leads_phone_created_at_idx").on(table.phone, table.createdAt),
    index("leads_seminar_event_idx").on(table.seminarEvent),
    index("leads_interested_country_idx").on(table.interestedCountry),
    index("leads_source_path_idx").on(table.sourcePath),
    index("leads_visitor_id_idx").on(table.visitorId),
    index("leads_gclid_idx").on(table.gclid),
    index("leads_fbclid_idx").on(table.fbclid),
    index("leads_wati_local_message_id_idx").on(table.watiLocalMessageId),
    index("leads_wati_whatsapp_message_id_idx").on(table.watiWhatsappMessageId),
  ]
);

export const contactClickEvents = pgTable(
  "contact_click_events",
  {
    id: serial("id").primaryKey(),
    visitorId: text("visitor_id"),
    channel: text("channel").notNull(),
    location: text("location").notNull(),
    href: text("href"),
    pagePath: text("page_path").notNull(),
    pageUrl: text("page_url"),
    referrer: text("referrer"),
    initialLandingPath: text("initial_landing_path"),
    initialLandingUrl: text("initial_landing_url"),
    initialReferrer: text("initial_referrer"),
    initialUtmLandingUrl: text("initial_utm_landing_url"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    gclid: text("gclid"),
    fbclid: text("fbclid"),
    gbraid: text("gbraid"),
    wbraid: text("wbraid"),
    ttclid: text("ttclid"),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("contact_click_events_created_at_idx").on(table.createdAt),
    index("contact_click_events_visitor_id_idx").on(table.visitorId),
    index("contact_click_events_channel_idx").on(table.channel),
  ]
);

export const adminUsers = pgTable(
  "admin_users",
  {
    id: serial("id").primaryKey(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").$type<AdminUserRole>().notNull().default("owner"),
    isActive: boolean("is_active").notNull().default(true),
    createdByAdminId: integer("created_by_admin_id"),
    lastSignedInAt: timestamp("last_signed_in_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("admin_users_email_idx").on(table.email),
    index("admin_users_active_idx").on(table.isActive),
    index("admin_users_role_idx").on(table.role),
  ]
);

export const securityRateLimits = pgTable(
  "security_rate_limits",
  {
    id: serial("id").primaryKey(),
    scope: text("scope").notNull(),
    identifier: text("identifier").notNull(),
    attemptCount: integer("attempt_count").notNull().default(0),
    windowStartedAt: timestamp("window_started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    blockedUntil: timestamp("blocked_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("security_rate_limits_scope_identifier_idx").on(
      table.scope,
      table.identifier
    ),
    index("security_rate_limits_blocked_until_idx").on(table.blockedUntil),
  ]
);

export const backgroundJobs = pgTable(
  "background_jobs",
  {
    id: serial("id").primaryKey(),
    kind: text("kind").notNull(),
    status: text("status").notNull().default("pending"),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(5),
    runAfter: timestamp("run_after", { withTimezone: true }).notNull().defaultNow(),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    lastError: text("last_error"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("background_jobs_pending_idx").on(
      table.status,
      table.runAfter,
      table.createdAt
    ),
    index("background_jobs_kind_status_idx").on(table.kind, table.status),
  ]
);

export const adminAuditLogs = pgTable(
  "admin_audit_logs",
  {
    id: serial("id").primaryKey(),
    actorAdminId: integer("actor_admin_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    actorEmail: text("actor_email"),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id"),
    targetDisplay: text("target_display"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata")
      .$type<AdminAuditLogMetadata>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("admin_audit_logs_actor_idx").on(table.actorAdminId),
    index("admin_audit_logs_action_idx").on(table.action),
    index("admin_audit_logs_created_at_idx").on(table.createdAt),
  ]
);

export const studentPeers = pgTable(
  "student_peers",
  {
    id: serial("id").primaryKey(),
    universityId: integer("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    photoUrl: text("photo_url"),
    courseName: text("course_name"),
    currentYearOrBatch: text("current_year_or_batch"),
    contactPhone: text("contact_phone"),
    contactEmail: text("contact_email"),
    homeState: text("home_state"),
    homeCity: text("home_city"),
    languages: text("languages").array(),
    countryId: integer("country_id").references(() => countries.id, { onDelete: "set null" }),
    peerUserId: varchar("peer_user_id", { length: 255 }).references(() => users.id, { onDelete: "set null" }),
    status: text("status").$type<StudentPeerStatus>().notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("student_peers_university_idx").on(table.universityId),
    index("student_peers_country_idx").on(table.countryId),
    index("student_peers_status_idx").on(table.status),
    index("student_peers_user_idx").on(table.peerUserId),
  ]
);

export const peerRequests = pgTable(
  "peer_requests",
  {
    id: serial("id").primaryKey(),
    universityId: integer("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    leadId: integer("lead_id").references(() => leads.id, {
      onDelete: "set null",
    }),
    matchedPeerId: integer("matched_peer_id").references(() => studentPeers.id, {
      onDelete: "set null",
    }),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    userState: text("user_state").notNull(),
    userCity: text("user_city"),
    courseInterest: text("course_interest"),
    languagePreference: text("language_preference"),
    message: text("message"),
    sourcePath: text("source_path").notNull(),
    sourceUrl: text("source_url"),
    sourceQuery: jsonb("source_query")
      .$type<LeadSourceQuery>()
      .notNull()
      .default({}),
    pageTitle: text("page_title"),
    documentReferrer: text("document_referrer"),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    acceptLanguage: text("accept_language"),
    clientContext: jsonb("client_context")
      .$type<LeadClientContext>()
      .notNull()
      .default({}),
    status: text("status").$type<PeerRequestStatus>().notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("peer_requests_university_idx").on(table.universityId),
    index("peer_requests_lead_idx").on(table.leadId),
    index("peer_requests_status_idx").on(table.status),
    index("peer_requests_phone_idx").on(table.phone),
    index("peer_requests_created_at_idx").on(table.createdAt),
  ]
);

export const peerCallSessions = pgTable(
  "peer_call_sessions",
  {
    id: text("id").primaryKey(),
    channelName: text("channel_name").notNull(),
    universityId: integer("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    peerId: integer("peer_id")
      .notNull()
      .references(() => studentPeers.id, { onDelete: "cascade" }),
    peerUserId: varchar("peer_user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    callerUserId: varchar("caller_user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status").$type<PeerCallStatus>().notNull().default("ringing"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    answeredAt: timestamp("answered_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("peer_call_sessions_peer_idx").on(table.peerId),
    index("peer_call_sessions_peer_user_idx").on(table.peerUserId),
    index("peer_call_sessions_caller_user_idx").on(table.callerUserId),
    index("peer_call_sessions_status_idx").on(table.status),
    index("peer_call_sessions_created_at_idx").on(table.createdAt),
    index("peer_call_sessions_peer_status_expires_idx").on(
      table.peerUserId,
      table.status,
      table.expiresAt
    ),
    index("peer_call_sessions_caller_status_expires_idx").on(
      table.callerUserId,
      table.status,
      table.expiresAt
    ),
    index("peer_call_sessions_peer_caller_status_expires_idx").on(
      table.peerId,
      table.callerUserId,
      table.status,
      table.expiresAt
    ),
    uniqueIndex("peer_call_sessions_channel_idx").on(table.channelName),
  ]
);

export const peerCallBookings = pgTable(
  "peer_call_bookings",
  {
    id: serial("id").primaryKey(),
    studentUserId: varchar("student_user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    peerId: integer("peer_id")
      .notNull()
      .references(() => studentPeers.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"),
    message: text("message"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("peer_call_bookings_student_idx").on(table.studentUserId),
    index("peer_call_bookings_peer_idx").on(table.peerId),
    uniqueIndex("peer_call_bookings_unique_idx").on(table.studentUserId, table.peerId),
  ]
);

export const guideConversations = pgTable(
  "guide_conversations",
  {
    id: serial("id").primaryKey(),
    studentUserId: varchar("student_user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    peerId: integer("peer_id")
      .notNull()
      .references(() => studentPeers.id, { onDelete: "cascade" }),
    peerUserId: varchar("peer_user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lastMessageText: text("last_message_text"),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    studentLastReadAt: timestamp("student_last_read_at", { withTimezone: true }),
    peerLastReadAt: timestamp("peer_last_read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("guide_conversations_student_peer_unique_idx").on(
      table.studentUserId,
      table.peerId
    ),
    index("guide_conversations_student_last_message_idx").on(
      table.studentUserId,
      table.lastMessageAt
    ),
    index("guide_conversations_peer_last_message_idx").on(
      table.peerUserId,
      table.lastMessageAt
    ),
  ]
);

export const guideMessages = pgTable(
  "guide_messages",
  {
    id: serial("id").primaryKey(),
    conversationId: integer("conversation_id")
      .notNull()
      .references(() => guideConversations.id, { onDelete: "cascade" }),
    senderUserId: varchar("sender_user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    messageType: text("message_type")
      .$type<"text" | "system">()
      .notNull()
      .default("text"),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    editedAt: timestamp("edited_at", { withTimezone: true }),
  },
  (table) => [
    index("guide_messages_conversation_created_idx").on(
      table.conversationId,
      table.createdAt
    ),
    index("guide_messages_sender_idx").on(table.senderUserId),
  ]
);

export const universityReviews = pgTable(
  "university_reviews",
  {
    id: serial("id").primaryKey(),
    universityId: integer("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    reviewType: text("review_type").$type<UniversityReviewType>().notNull(),
    reviewerName: text("reviewer_name").notNull(),
    reviewerEmail: text("reviewer_email"),
    reviewerContext: text("reviewer_context"),
    reviewBody: text("review_body"),
    youtubeUrl: text("youtube_url"),
    youtubeVideoId: text("youtube_video_id"),
    sourcePath: text("source_path").notNull(),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    visibilityStatus: text("visibility_status")
      .$type<UniversityReviewVisibilityStatus>()
      .notNull()
      .default("live"),
    verificationStatus: text("verification_status")
      .$type<UniversityReviewVerificationStatus>()
      .notNull()
      .default("unverified"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isShort: boolean("is_short").notNull().default(false),
    starRating: integer("star_rating"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("university_reviews_university_idx").on(table.universityId),
    index("university_reviews_type_idx").on(table.reviewType),
    index("university_reviews_visibility_idx").on(table.visibilityStatus),
    index("university_reviews_featured_idx").on(table.isFeatured),
    index("university_reviews_created_at_idx").on(table.createdAt),
  ]
);

export const studentPeerApplications = pgTable(
  "student_peer_applications",
  {
    id: serial("id").primaryKey(),
    universityId: integer("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    courseName: text("course_name"),
    currentYearOrBatch: text("current_year_or_batch"),
    enrollmentStatus: text("enrollment_status").notNull(),
    homeState: text("home_state"),
    homeCity: text("home_city"),
    languages: text("languages").array(),
    photoUrl: text("photo_url"),
    proofUrl: text("proof_url").notNull(),
    message: text("message"),
    countryId: integer("country_id").references(() => countries.id, { onDelete: "set null" }),
    peerUserId: varchar("peer_user_id", { length: 255 }).references(() => users.id, { onDelete: "set null" }),
    status: text("status")
      .$type<StudentPeerApplicationStatus>()
      .notNull()
      .default("pending"),
    reviewedByAdminId: integer("reviewed_by_admin_id").references(
      () => adminUsers.id,
      { onDelete: "set null" }
    ),
    reviewNotes: text("review_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("student_peer_applications_university_idx").on(table.universityId),
    index("student_peer_applications_status_idx").on(table.status),
    index("student_peer_applications_created_at_idx").on(table.createdAt),
  ]
);

export const searchDocuments = pgTable(
  "search_documents",
  {
    id: serial("id").primaryKey(),
    documentType: text("document_type").notNull(),
    sourceSlug: text("source_slug").notNull(),
    path: text("path").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    summary: text("summary").notNull(),
    searchText: text("search_text").notNull(),
    highlights: jsonb("highlights").$type<SearchDocument["highlights"]>().notNull(),
    countrySlug: text("country_slug"),
    courseSlug: text("course_slug"),
    universitySlug: text("university_slug"),
    city: text("city"),
    featured: boolean("featured").notNull().default(false),
    annualTuitionUsd: integer("annual_tuition_usd"),
    medium: text("medium"),
    intakeMonths: text("intake_months").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("search_documents_type_slug_idx").on(
      table.documentType,
      table.sourceSlug
    ),
    index("search_documents_type_idx").on(table.documentType),
    index("search_documents_country_idx").on(table.countrySlug),
    index("search_documents_course_idx").on(table.courseSlug),
    index("search_documents_university_idx").on(table.universitySlug),
    index("search_documents_featured_idx").on(table.featured),
    index("search_documents_fee_idx").on(table.annualTuitionUsd),
  ]
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull().default(""),
    coverUrl: text("cover_url"),
    category: text("category"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    authorSlug: text("author_slug"),
    status: text("status").$type<"draft" | "published">().notNull().default("draft"),
    readingTimeMinutes: integer("reading_time_minutes"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("blog_posts_slug_idx").on(table.slug),
    index("blog_posts_status_idx").on(table.status),
    index("blog_posts_published_at_idx").on(table.publishedAt),
    index("blog_posts_status_published_at_idx").on(
      table.status,
      table.publishedAt,
    ),
    index("blog_posts_status_category_published_at_idx").on(
      table.status,
      table.category,
      table.publishedAt,
    ),
  ]
);

export const studyAbroadGuides = pgTable(
  "study_abroad_guides",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    stream: text("stream").$type<CourseStream>().notNull().default("medicine"),
    courseSlug: text("course_slug"),
    countrySlug: text("country_slug"),
    metadata: jsonb("metadata").$type<IndexableMetadataInput>().notNull(),
    page: jsonb("page").$type<StudyAbroadGuidePageProps>().notNull(),
    published: boolean("published").notNull().default(false),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    sourceUrls: jsonb("source_urls").$type<string[]>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("study_abroad_guides_slug_idx").on(table.slug),
    index("study_abroad_guides_stream_idx").on(table.stream),
    index("study_abroad_guides_published_idx").on(table.published),
    index("study_abroad_guides_course_slug_idx").on(table.courseSlug),
    index("study_abroad_guides_country_slug_idx").on(table.countrySlug),
  ]
);

export const universityResearchQueue = pgTable(
  "university_research_queue",
  {
    id: serial("id").primaryKey(),
    wdomsSchoolId: text("wdoms_school_id").notNull(),
    countrySlug: text("country_slug").notNull(),
    schoolName: text("school_name").notNull(),
    cityName: text("city_name"),
    priority: text("priority")
      .$type<UniversityResearchQueuePriority>()
      .notNull()
      .default("medium"),
    status: text("status")
      .$type<UniversityResearchQueueStatus>()
      .notNull()
      .default("new"),
    matchedUniversityId: integer("matched_university_id").references(
      () => universities.id,
      { onDelete: "set null" }
    ),
    publishedUniversitySlug: text("published_university_slug"),
    notes: text("notes"),
    lastAttemptedAt: timestamp("last_attempted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("university_research_queue_wdoms_school_id_idx").on(
      table.wdomsSchoolId
    ),
    index("university_research_queue_country_idx").on(table.countrySlug),
    index("university_research_queue_priority_idx").on(table.priority),
    index("university_research_queue_status_idx").on(table.status),
    index("university_research_queue_matched_university_idx").on(
      table.matchedUniversityId
    ),
  ]
);

export const universityResearchDrafts = pgTable(
  "university_research_drafts",
  {
    id: serial("id").primaryKey(),
    queueId: integer("queue_id")
      .notNull()
      .references(() => universityResearchQueue.id, { onDelete: "cascade" }),
    wdomsSchoolId: text("wdoms_school_id").notNull(),
    officialWebsite: text("official_website"),
    programUrl: text("program_url"),
    feesUrl: text("fees_url"),
    hostelUrl: text("hostel_url"),
    admissionUrl: text("admission_url"),
    wdomsUrl: text("wdoms_url"),
    sourceBundle: jsonb("source_bundle")
      .$type<UniversityResearchSourceBundle>()
      .notNull()
      .default({}),
    structuredFacts: jsonb("structured_facts")
      .$type<UniversityResearchStructuredFacts>()
      .notNull()
      .default({}),
    draftContent: jsonb("draft_content")
      .$type<UniversityResearchDraftContent>()
      .notNull()
      .default({}),
    qualityScore: integer("quality_score"),
    reviewNotes: text("review_notes"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("university_research_drafts_queue_id_idx").on(table.queueId),
    index("university_research_drafts_wdoms_school_id_idx").on(
      table.wdomsSchoolId
    ),
    index("university_research_drafts_verified_at_idx").on(table.verifiedAt),
  ]
);

export type CountryRow = typeof countries.$inferSelect;
export type CourseRow = typeof courses.$inferSelect;
export type UniversityRow = typeof universities.$inferSelect;
export type ProgramOfferingRow = typeof programOfferings.$inferSelect;
export type LeadInsert = typeof leads.$inferInsert;
export type LeadRow = typeof leads.$inferSelect;
export type AdminUserRow = typeof adminUsers.$inferSelect;
export type SecurityRateLimitRow = typeof securityRateLimits.$inferSelect;
export type AdminAuditLogRow = typeof adminAuditLogs.$inferSelect;
export type StudentPeerRow = typeof studentPeers.$inferSelect;
export type PeerRequestInsert = typeof peerRequests.$inferInsert;
export type PeerRequestRow = typeof peerRequests.$inferSelect;
export type PeerCallSessionRow = typeof peerCallSessions.$inferSelect;
export type PeerCallBookingRow = typeof peerCallBookings.$inferSelect;
export type UniversityReviewInsert = typeof universityReviews.$inferInsert;
export type UniversityReviewRow = typeof universityReviews.$inferSelect;
export type SearchDocumentRow = typeof searchDocuments.$inferSelect;
export type StudentPeerApplicationInsert = typeof studentPeerApplications.$inferInsert;
export type StudentPeerApplicationRow = typeof studentPeerApplications.$inferSelect;
export type UniversityResearchQueueRow = typeof universityResearchQueue.$inferSelect;
export type UniversityResearchDraftRow = typeof universityResearchDrafts.$inferSelect;
export type CityProfileRow = typeof cityProfiles.$inferSelect;
export type BackgroundJobRow = typeof backgroundJobs.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// NextAuth.js Tables (for user authentication)
// ─────────────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  phone: varchar("phone", { length: 20 }),
  neetScore: integer("neet_score"),
  budgetUsd: integer("budget_usd"),
  preferredCountries: jsonb("preferred_countries").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const mobileSessions = pgTable(
  "mobile_sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 255 }).notNull(),
    tokenPrefix: varchar("token_prefix", { length: 16 }).notNull(),
    deviceName: varchar("device_name", { length: 255 }),
    platform: varchar("platform", { length: 50 }),
    appVersion: varchar("app_version", { length: 50 }),
    pushToken: text("push_token"),
    lastUsedAt: timestamp("last_used_at", { mode: "date" }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    revokedAt: timestamp("revoked_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("mobile_sessions_token_hash_idx").on(table.tokenHash),
    index("mobile_sessions_user_idx").on(table.userId),
    index("mobile_sessions_expires_idx").on(table.expiresAt),
  ]
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.identifier, table.token] }),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// User Feature Tables (shortlists, applications, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export const userShortlists = pgTable(
  "user_shortlists",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    universityId: integer("university_id")
      .notNull()
      .references(() => universities.id, { onDelete: "cascade" }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("shortlists_user_idx").on(table.userId),
    uniqueIndex("user_university_unique").on(table.userId, table.universityId),
  ]
);

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    universitySlug: varchar("university_slug", { length: 255 }).notNull(),
    courseSlug: varchar("course_slug", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).default("draft").notNull(),
    personalInfo: jsonb("personal_info").$type<Record<string, unknown>>(),
    documents: jsonb("documents").$type<Record<string, string>>(),
    applicationData: jsonb("application_data").$type<Record<string, unknown>>(),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("applications_user_idx").on(table.userId),
    index("applications_status_idx").on(table.status),
    index("applications_university_idx").on(table.universitySlug),
  ]
);

// Type exports for auth tables
export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type AccountRow = typeof accounts.$inferSelect;
export type SessionRow = typeof sessions.$inferSelect;
export type MobileSessionRow = typeof mobileSessions.$inferSelect;
export type UserShortlistRow = typeof userShortlists.$inferSelect;
export type UserShortlistInsert = typeof userShortlists.$inferInsert;
export type ApplicationRow = typeof applications.$inferSelect;
export type ApplicationInsert = typeof applications.$inferInsert;
