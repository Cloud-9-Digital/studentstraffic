import { z } from "zod";

export const mobileRegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const mobileLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Enter your password"),
});

export const mobileForgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
});

export const mobileProfilePatchSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().min(7).nullable().optional(),
  neetScore: z.number().int().min(0).max(720).nullable().optional(),
  budgetUsd: z.number().int().min(0).nullable().optional(),
  preferredCountries: z.array(z.string().trim().min(1)).optional(),
});

export const mobileShortlistSchema = z.object({
  universitySlug: z.string().trim().min(1),
  notes: z.string().trim().max(500).optional(),
});

export const mobileApplicationCreateSchema = z.object({
  universitySlug: z.string().trim().min(1),
  courseSlug: z.string().trim().min(1).default("mbbs"),
  personalInfo: z.record(z.string(), z.unknown()).optional(),
});

export const mobileApplicationPatchSchema = z.object({
  status: z.enum(["draft", "submitted"]).optional(),
  personalInfo: z.record(z.string(), z.unknown()).optional(),
  applicationData: z.record(z.string(), z.unknown()).optional(),
});

export const mobileCounsellingSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  email: z.string().trim().email().optional().or(z.literal("")),
  userState: z.string().trim().min(2, "Please enter your state."),
  neetScore: z.number().int().min(0).max(720).nullable().optional(),
  courseSlug: z.string().trim().optional(),
  countrySlug: z.string().trim().optional(),
  universitySlug: z.string().trim().optional(),
  notes: z.string().trim().max(1000).optional(),
});
