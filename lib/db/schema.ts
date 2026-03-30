import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type {
  Faq,
  LinkItem,
  PeerPreferredContactMode,
  PeerRequestStatus,
  SearchDocument,
  StudentPeerStatus,
  ResearchSource,
  TeachingPhase,
  UniversityReviewType,
  UniversityReviewVerificationStatus,
  UniversityReviewVisibilityStatus,
  UniversityGalleryImage,
  YearlyCostBreakdown,
} from "@/lib/data/types";

type JsonValue = string | number | boolean | null | string[];
type LeadSourceQuery = Record<string, string | string[]>;
type LeadClientContext = Record<
  string,
  JsonValue
>;
type AdminAuditLogMetadata = Record<string, JsonValue>;

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
    durationYears: integer("duration_years").notNull(),
    summary: text("summary").notNull(),
    metaTitle: text("meta_title").notNull(),
    metaDescription: text("meta_description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [uniqueIndex("courses_slug_idx").on(table.slug)]
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
    galleryImages: jsonb("gallery_images")
      .$type<UniversityGalleryImage[]>()
      .notNull()
      .default([]),
    campusLifestyle: text("campus_lifestyle").notNull(),
    cityProfile: text("city_profile").notNull(),
    clinicalExposure: text("clinical_exposure").notNull(),
    hostelOverview: text("hostel_overview").notNull(),
    indianFoodSupport: text("indian_food_support").notNull(),
    safetyOverview: text("safety_overview").notNull(),
    studentSupport: text("student_support").notNull(),
    whyChoose: jsonb("why_choose").$type<string[]>().notNull().default([]),
    thingsToConsider: jsonb("things_to_consider")
      .$type<string[]>()
      .notNull()
      .default([]),
    bestFitFor: jsonb("best_fit_for").$type<string[]>().notNull().default([]),
    teachingHospitals: text("teaching_hospitals").array().notNull().default([]),
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
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("universities_slug_idx").on(table.slug),
    index("universities_country_idx").on(table.countryId),
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
    durationYears: integer("duration_years").notNull(),
    annualTuitionUsd: integer("annual_tuition_usd").notNull(),
    totalTuitionUsd: integer("total_tuition_usd").notNull(),
    livingUsd: integer("living_usd").notNull(),
    officialFeeCurrency: text("official_fee_currency"),
    officialAnnualTuitionAmount: integer("official_annual_tuition_amount"),
    officialTotalTuitionAmount: integer("official_total_tuition_amount"),
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
    licenseExamSupport: jsonb("license_exam_support")
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

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    userState: text("user_state"),
    courseSlug: text("course_slug"),
    countrySlug: text("country_slug"),
    universitySlug: text("university_slug"),
    sourcePath: text("source_path").notNull(),
    sourceUrl: text("source_url"),
    sourceQuery: jsonb("source_query")
      .$type<LeadSourceQuery>()
      .notNull()
      .default({}),
    pageTitle: text("page_title"),
    ctaVariant: text("cta_variant").notNull(),
    notes: text("notes"),
    documentReferrer: text("document_referrer"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
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
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("leads_source_path_idx").on(table.sourcePath)]
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
    courseName: text("course_name"),
    currentYearOrBatch: text("current_year_or_batch"),
    contactPhone: text("contact_phone"),
    contactEmail: text("contact_email"),
    status: text("status").$type<StudentPeerStatus>().notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("student_peers_university_idx").on(table.universityId),
    index("student_peers_status_idx").on(table.status),
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
    courseInterest: text("course_interest"),
    preferredContactMode: text("preferred_contact_mode")
      .$type<PeerPreferredContactMode>(),
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
export type UniversityReviewInsert = typeof universityReviews.$inferInsert;
export type UniversityReviewRow = typeof universityReviews.$inferSelect;
export type SearchDocumentRow = typeof searchDocuments.$inferSelect;
