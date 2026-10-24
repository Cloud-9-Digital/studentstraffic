export const ENQUIRY_RECEIPT_COOKIE = "st_enquiry_receipt";
export const enquiryReceiptCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/thank-you",
  maxAge: 15 * 60,
};

type EnquiryReceipt = { name: string; interest: string; eventId: string; expiresAt: number };

export function encodeEnquiryReceipt(
  input: { fullName: string; interest: string; eventId: string },
  now = Date.now(),
) {
  const receipt: EnquiryReceipt = {
    name: input.fullName.trim().replace(/\s+/g, " ").slice(0, 100),
    interest: input.interest.trim().slice(0, 200),
    eventId: input.eventId,
    expiresAt: now + enquiryReceiptCookieOptions.maxAge * 1000,
  };
  return encodeURIComponent(JSON.stringify(receipt));
}

export function storeEnquiryReceipt(
  cookieStore: { set(name: string, value: string, options: typeof enquiryReceiptCookieOptions): unknown },
  input: { fullName: string; interest: string; eventId: string },
) {
  cookieStore.set(ENQUIRY_RECEIPT_COOKIE, encodeEnquiryReceipt(input), enquiryReceiptCookieOptions);
}

export function readEnquiryReceipt(value: string | undefined, eventId: string | undefined, now = Date.now()): EnquiryReceipt | undefined {
  if (!value || !eventId) return undefined;
  try {
    const receipt = JSON.parse(decodeURIComponent(value));
    if (
      typeof receipt.name !== "string" || !receipt.name.trim() || receipt.name.length > 100 ||
      typeof receipt.interest !== "string" || receipt.interest.length > 200 ||
      receipt.eventId !== eventId || typeof receipt.expiresAt !== "number" || receipt.expiresAt <= now
    ) return undefined;
    return receipt;
  } catch {
    return undefined;
  }
}

/** Old bookmarked confirmations may still carry a URL slug instead of a display name. */
export function formatEnquiryInterest(interest?: string) {
  const value = interest?.trim().slice(0, 200);
  if (!value || value === "study-abroad") return "study abroad";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(value)) return value;
  const acronyms: Record<string, string> = { jp: "J.P.", mba: "MBA", mbbs: "MBBS", uk: "UK", usa: "USA" };
  return value.split("-").map((word, index) => acronyms[word] ??
    (index > 0 && ["of", "and", "in", "the", "for"].includes(word) ? word : word[0].toUpperCase() + word.slice(1)),
  ).join(" ");
}
