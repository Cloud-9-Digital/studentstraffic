/** Shared by web and mobile entry points before persisting peer communication. */
export const PEER_CONTACT_POLICY_ERROR =
  "Sharing phone numbers, email addresses or other contact details is against Students Traffic’s policy. For your safety, keep chats and calls on the app or website. Remove the contact details before sending.";

export function containsPeerContactDetails(value: string): boolean {
  const normalized = value.normalize("NFKC")
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
    .replace(/[٠-٩۰-۹०-९]/g, (digit) => {
      const code = digit.charCodeAt(0);
      const zero = code >= 0x966 ? 0x966 : code >= 0x6f0 ? 0x6f0 : 0x660;
      return String(code - zero);
    })
    .toLowerCase();
  const emailText = normalized
    .replace(/\s*(?:\[at\]|\(at\)|\bat\b)\s*/g, "@")
    .replace(/\s*(?:\[dot\]|\(dot\)|\bdot\b)\s*/g, ".");
  if (/[a-z0-9._%+-]+\s*@\s*[a-z0-9-]+\s*\.\s*[a-z]{2,}/i.test(emailText)) return true;
  // Contact URLs, URI schemes and social handles are not an in-platform channel.
  if (/(?:https?:\/\/|www\.|mailto:|tel:|sms:|whatsapp:|(?:wa\.me|t\.me|telegram\.me|instagram\.com|facebook\.com|fb\.com|snapchat\.com|discord\.(?:gg|com)|signal\.me|api\.whatsapp\.com)\b)/i.test(normalized)) return true;
  if (/(?:^|\s)@[\w.]{2,}/.test(normalized)) return true;
  if (/\b(?:whats\s*app|telegram|instagram|snapchat|discord|signal|skype)\b.{0,30}\b(?:id|handle|username|number|contact|add|dm|message)\b|\b(?:add|dm|message|find|follow|contact)\s+me\s+(?:on|at)\b/i.test(normalized)) return true;
  // Allow ordinary years and fee amounts, but reject phone-length digit sequences.
  if (/(?:\d[\s().+\-]*){10,}/.test(normalized) || /\+(?:\d[\s().\-]*){7,}/.test(normalized)) return true;
  if (/\b(?:phone|mobile|number|call me|text me|whatsapp)\b.{0,25}(?:\d[\s().+\-]*){7,}/.test(normalized)) return true;
  const numberWords = "zero|oh|one|two|three|four|five|six|seven|eight|nine";
  if (new RegExp(`\\b(?:(?:${numberWords})[\\s,.-]+){6,}(?:${numberWords})\\b`).test(normalized)) return true;
  return false;
}

export function peerSafeText(value: string): string {
  return containsPeerContactDetails(value)
    ? "[Contact details hidden. Please use in-app chat and calls.]"
    : value;
}
