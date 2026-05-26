import type { IndiaCollege, StudentApplication, StudentProfile, University, UniversityDetail } from "../types/domain";
import { clearToken, getToken, setToken } from "./tokenStore";

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
  };
};

async function request<T>(path: string, init?: RequestInit & { auth?: boolean }): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  headers.set("X-Platform", "ios");
  headers.set("X-App-Version", "0.1.0");

  if (init?.auth !== false) {
    const token = await getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
  if (!response.ok) {
    throw new Error(body.error?.message ?? `Request failed (${response.status})`);
  }

  return body as T;
}

function toUniversity(input: any): University {
  return {
    slug: input.slug,
    name: input.name,
    country: input.country,
    countrySlug: input.countrySlug,
    city: input.city,
    type: input.type,
    logoUrl: input.logoUrl,
    coverImageUrl: input.coverImageUrl,
    course: input.course,
    courseSlug: input.courseSlug,
    offeringSlug: input.offeringSlug,
    tuitionUsd: input.tuitionUsd ?? input.primaryOffering?.annualTuitionUsd ?? 0,
    duration: input.primaryOffering ? `${input.primaryOffering.durationYears} years` : undefined,
    medium: input.primaryOffering?.medium,
    recognition: input.recognitionBadges ?? input.recognition ?? [],
    summary: input.summary,
    fit: input.bestFitFor?.[0],
    isShortlisted: input.isShortlisted,
    imageTone: input.country === "Georgia" ? "blue" : input.country === "Kyrgyzstan" ? "coral" : "green",
  };
}

function toApplication(input: any): StudentApplication {
  return {
    id: input.id,
    universitySlug: input.universitySlug,
    universityName: input.universityName,
    universityCity: input.universityCity,
    countryName: input.countryName,
    universityLogoUrl: input.universityLogoUrl,
    course: input.courseSlug?.replace(/-/g, " ").toUpperCase() ?? "MBBS",
    courseSlug: input.courseSlug,
    status: input.status,
    nextStep:
      input.status === "submitted"
        ? "Your application has been submitted. A counsellor will review it."
        : "Complete details and submit when ready.",
    personalInfo: input.personalInfo,
    applicationData: input.applicationData,
    submittedAt: input.submittedAt,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
}

export const mobileClient = {
  apiUrl: API_URL,

  async login(email: string, password: string) {
    const result = await request<{ token: string; user: StudentProfile }>("/api/mobile/v1/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password }),
    });
    await setToken(result.token);
    return result.user;
  },

  async register(input: { name: string; email: string; phone: string; password: string }) {
    const result = await request<{ token: string; user: StudentProfile }>("/api/mobile/v1/auth/register", {
      method: "POST",
      auth: false,
      body: JSON.stringify(input),
    });
    await setToken(result.token);
    return result.user;
  },

  async logout() {
    await request<{ success: boolean }>("/api/mobile/v1/auth/logout", { method: "POST" }).catch(() => null);
    await clearToken();
  },

  async forgotPassword(email: string) {
    return request<{ success: boolean; message: string }>("/api/mobile/v1/auth/forgot-password", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email }),
    });
  },

  async getProfile() {
    const result = await request<{ user: StudentProfile }>("/api/mobile/v1/me");
    return result.user;
  },

  async updateProfile(input: Partial<StudentProfile>) {
    const result = await request<{ user: StudentProfile }>("/api/mobile/v1/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    return result.user;
  },

  async getDashboard() {
    const [profile, shortlists, applications, universities] = await Promise.all([
      this.getProfile(),
      this.getShortlists().catch(() => []),
      this.getApplications().catch(() => []),
      this.getUniversities({}).then(r => r.universities).catch(() => []),
    ]);

    return {
      profile,
      shortlistCount: shortlists.length,
      applicationCount: applications.length,
      recommended: universities.slice(0, 4),
      nextStep: applications[0]?.nextStep ?? "Explore universities and shortlist your favourites.",
    };
  },

  async getUniversities(filters: {
    q?: string;
    country?: string;
    course?: string;
    feeMin?: number;
    feeMax?: number;
    medium?: string;
    universityType?: string;
    sort?: string;
  } = {}, page = 1) {
    const params = new URLSearchParams({ pageSize: "30", page: String(page) });
    if (filters.q?.trim())        params.set("q",               filters.q.trim());
    if (filters.country)          params.set("country",          filters.country);
    if (filters.course)           params.set("course",           filters.course);
    if (filters.medium)           params.set("medium",           filters.medium);
    if (filters.universityType)   params.set("university_type",  filters.universityType);
    if (filters.sort)             params.set("sort",             filters.sort);
    if (filters.feeMin != null)   params.set("fee_min",          String(filters.feeMin));
    if (filters.feeMax != null)   params.set("fee_max",          String(filters.feeMax));

    const result = await request<{
      universities: any[];
      pagination: { hasNextPage: boolean; totalItems: number; totalPages: number };
      options: {
        countries: { slug: string; name: string }[];
        courses: { slug: string; shortName: string }[];
        mediums: string[];
        intakes: string[];
      };
    }>(`/api/mobile/v1/universities?${params.toString()}`, { auth: false });

    return {
      universities: result.universities.map(toUniversity),
      hasNextPage: result.pagination.hasNextPage,
      totalItems: result.pagination.totalItems,
      options: result.options,
    };
  },

  async getUniversity(slug: string) {
    const result = await request<{ university: any }>(`/api/mobile/v1/universities/${slug}`);
    return {
      ...toUniversity(result.university),
      ...result.university,
      tuitionUsd: result.university.primaryOffering?.annualTuitionUsd ?? 0,
    } as UniversityDetail;
  },

  async getShortlists() {
    const result = await request<{ shortlists: any[] }>("/api/mobile/v1/shortlists");
    return result.shortlists.map(u => ({ ...toUniversity(u), isShortlisted: true }));
  },

  async addShortlist(universitySlug: string) {
    return request<{ success: boolean }>("/api/mobile/v1/shortlists", {
      method: "POST",
      body: JSON.stringify({ universitySlug }),
    });
  },

  async removeShortlist(universitySlug: string) {
    return request<{ success: boolean }>("/api/mobile/v1/shortlists", {
      method: "DELETE",
      body: JSON.stringify({ universitySlug }),
    });
  },

  async getApplications() {
    const result = await request<{ applications: any[] }>("/api/mobile/v1/applications");
    return result.applications.map(toApplication);
  },

  async getApplication(id: string) {
    const result = await request<{ application: any }>(`/api/mobile/v1/applications/${id}`);
    return toApplication(result.application);
  },

  async createApplication(input: { universitySlug: string; courseSlug?: string; personalInfo?: Record<string, unknown> }) {
    const result = await request<{ application: any }>("/api/mobile/v1/applications", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return toApplication(result.application);
  },

  async updateApplication(id: string, input: Record<string, unknown>) {
    const result = await request<{ application: any }>(`/api/mobile/v1/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    return toApplication(result.application);
  },

  async getIndiaColleges(
    filters: { q?: string; state?: string; management?: string; sort?: string } = {},
    page = 1,
  ) {
    const params = new URLSearchParams({ page: String(page), pageSize: "20" });
    if (filters.q?.trim())     params.set("q",          filters.q.trim());
    if (filters.state)         params.set("state",      filters.state);
    if (filters.management)    params.set("management", filters.management);
    if (filters.sort)          params.set("sort",       filters.sort);

    const result = await request<{
      colleges: IndiaCollege[];
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
    }>(`/api/india-mbbs-finder?${params.toString()}`, { auth: false });

    return {
      colleges: result.colleges,
      totalItems: result.totalItems,
      hasNextPage: result.hasNextPage,
    };
  },

  async requestCounselling(input: {
    fullName: string;
    phone: string;
    email?: string;
    userState: string;
    neetScore?: number | null;
    universitySlug?: string;
    courseSlug?: string;
    notes?: string;
  }) {
    return request<{ success: boolean; leadId: number }>("/api/mobile/v1/counselling", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
