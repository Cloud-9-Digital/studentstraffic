import { z } from "zod";

import { isValidLeadPhone } from "@/lib/lead-residence";

/**
 * The chat callback form's body, shared by the website (/api/chat/lead) and
 * the mobile app (/api/mobile/v1/mira/lead) so a lead raised in either place
 * is validated identically before captureChatLead writes it.
 */

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]+$/)
  .max(120)
  .optional();

export const chatLeadSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  phone: z
    .string()
    .trim()
    .max(32)
    .refine(isValidLeadPhone, "Please enter a valid phone number."),
  residenceCountry: z.string().trim().max(2).optional(),
  // Required in captureChatLead only for students living in India.
  userState: z.string().trim().max(120).optional(),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || /\S+@\S+\.\S+/.test(value), {
      message: "Please enter a valid email address.",
    }),
  conversationId: z.string().trim().min(1).max(64).optional(),
  countrySlug: slugSchema,
  courseSlug: slugSchema,
  universitySlug: slugSchema,
  page: z.object({
    path: z.string().trim().min(1).max(512),
    url: z.string().trim().max(1024).optional(),
    title: z.string().trim().max(300).optional(),
  }),
});

export type ChatLeadBody = z.infer<typeof chatLeadSchema>;
