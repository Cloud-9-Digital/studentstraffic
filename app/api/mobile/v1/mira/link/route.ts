import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/lib/db/server";
import { programOfferings, universities } from "@/lib/db/schema";
import { mobileError, mobilePublicJson, mobileValidationError } from "@/lib/mobile/http";

/**
 * Resolves a website path from one of Mira's answers to an app screen.
 *
 * The app maps /university/* and /countries/* on its own. A programme page is
 * a bare root slug on the web (/{offering-slug}), indistinguishable from a
 * guide or an article without asking the catalogue — so this answers that one
 * question: is this path a published programme, and at which university? The
 * app opens that university with the programme selected; anything else stays
 * on the website.
 */

const querySchema = z.object({
  path: z
    .string()
    .trim()
    .regex(/^\/[a-z0-9-]+\/?$/, "Only a single-segment path can be a programme page."),
});

export async function GET(request: Request) {
  const parsed = querySchema.safeParse({
    path: new URL(request.url).searchParams.get("path") ?? "",
  });
  if (!parsed.success) return mobileValidationError(parsed.error);

  const db = getDb();
  if (!db) return mobileError("unavailable", "Service unavailable.", 503);

  const slug = parsed.data.path.replace(/^\/|\/$/g, "");

  const [program] = await db
    .select({ universitySlug: universities.slug })
    .from(programOfferings)
    .innerJoin(universities, eq(universities.id, programOfferings.universityId))
    .where(and(eq(programOfferings.slug, slug), eq(universities.published, true)))
    .limit(1);

  return mobilePublicJson({
    target: program
      ? { screen: "university" as const, universitySlug: program.universitySlug, programSlug: slug }
      : null,
  });
}
