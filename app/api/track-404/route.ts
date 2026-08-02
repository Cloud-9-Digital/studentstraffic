import { after } from "next/server";
import { z } from "zod";

import { getIpAddress } from "@/app/_actions/form-helpers";
import { getDb } from "@/lib/db/server";
import { notFoundEvents } from "@/lib/db/schema";

const track404Schema = z.object({
  path: z.string().trim().min(1),
});

const botUserAgentPattern =
  /bot|crawl|crawler|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|linkedinbot|google-extended|gpt|claude|perplexity/i;

export async function POST(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";

  if (botUserAgentPattern.test(userAgent)) {
    return new Response(null, { status: 204 });
  }

  const parsed = track404Schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return new Response(null, { status: 400 });
  }

  const referrer = request.headers.get("referer");
  const ipAddress = getIpAddress({
    get(name: string) {
      return request.headers.get(name);
    },
  });

  after(async () => {
    const db = getDb();

    if (!db) {
      return;
    }

    await db.insert(notFoundEvents).values({
      path: parsed.data.path,
      referrer,
      userAgent,
      ipAddress,
    });
  });

  return new Response(null, { status: 204 });
}
