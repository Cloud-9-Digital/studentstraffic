import { z } from "zod";

import { getIpAddress } from "@/app/_actions/form-helpers";
import { getDb } from "@/lib/db/server";
import { contactClickEvents } from "@/lib/db/schema";
import { getTrackingSnapshot } from "@/lib/tracking";

const trackContactSchema = z.object({
  channel: z.enum(["call", "whatsapp"]),
  location: z.string().trim().min(1),
  href: z.string().trim().optional(),
  pagePath: z.string().trim().min(1),
  pageUrl: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const parsed = trackContactSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return new Response(null, { status: 400 });
  }

  const db = getDb();

  if (!db) {
    return new Response(null, { status: 204 });
  }

  const cookieStore = {
    get(name: string) {
      const value = request.headers
        .get("cookie")
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`))
        ?.slice(name.length + 1);

      return value ? { value: decodeURIComponent(value) } : undefined;
    },
  };

  const tracking = getTrackingSnapshot(cookieStore, {});

  await db.insert(contactClickEvents).values({
    visitorId: tracking.visitorId,
    channel: parsed.data.channel,
    location: parsed.data.location,
    href: parsed.data.href,
    pagePath: parsed.data.pagePath,
    pageUrl: parsed.data.pageUrl,
    referrer: request.headers.get("referer"),
    initialLandingPath: tracking.initialLandingPath,
    initialLandingUrl: tracking.initialLandingUrl,
    initialReferrer: tracking.initialReferrer,
    initialUtmLandingUrl: tracking.initialUtmLandingUrl,
    utmSource: tracking.utmSource,
    utmMedium: tracking.utmMedium,
    utmCampaign: tracking.utmCampaign,
    utmTerm: tracking.utmTerm,
    utmContent: tracking.utmContent,
    gclid: tracking.gclid,
    fbclid: tracking.fbclid,
    gbraid: tracking.gbraid,
    wbraid: tracking.wbraid,
    ttclid: tracking.ttclid,
    userAgent: request.headers.get("user-agent"),
    ipAddress: getIpAddress({
      get(name: string) {
        return request.headers.get(name);
      },
    }),
  });

  return new Response(null, { status: 204 });
}
