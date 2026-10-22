// Mira's messages as the app holds them. The shape is the AI SDK's UIMessage,
// the same one the website dock uses (lib/chatbot/ui-messages.ts on the web),
// so the conversation can be sent back to the server exactly as it arrived.
// The data parts below mirror MiraDataParts there; keep the two in step.

export type MiraUniversityCard = {
  slug: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  href: string;
  annualFee: string;
  annualFeeUsd?: number;
  courses: string[];
  medium: string;
  intakes: string[];
};

export type MiraLink = { label: string; href: string };

export type MiraLeadRequest = {
  reason: string;
  interest?: { countrySlug?: string; courseSlug?: string; universitySlug?: string };
};

export type MiraPeerRequest = { universitySlug: string; universityName: string; reason: string };

export type MiraToolState = "input-streaming" | "input-available" | "output-available" | "output-error";

export type MiraToolPart = {
  type: `tool-${string}`;
  toolCallId: string;
  state: MiraToolState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

export type MiraPart =
  | { type: "text"; text: string }
  | { type: "step-start" }
  | MiraToolPart
  | { type: "data-universities"; data: { title: string; cards: MiraUniversityCard[] } }
  | { type: "data-links"; data: { links: MiraLink[] } }
  | { type: "data-feeChart"; data: { title: string; points: Array<{ label: string; value: number; formatted: string; href?: string }> } }
  | { type: "data-leadRequest"; data: MiraLeadRequest }
  | { type: "data-peerRequest"; data: MiraPeerRequest }
  | { type: "data-shortlist"; data: { added: string[]; alreadyThere: string[]; requiresSignIn: boolean } };

export type MiraMessage = {
  id: string;
  role: "user" | "assistant";
  parts: MiraPart[];
  metadata?: { conversationId?: string };
};

/** Where Mira was opened from, which shapes her starters and her page context. */
export type MiraContext = { universitySlug: string; universityName: string } | null;

export function isToolPart(part: MiraPart): part is MiraToolPart {
  return part.type.startsWith("tool-");
}
