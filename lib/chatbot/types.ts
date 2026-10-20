/**
 * Domain types shared by the chat route and the dock.
 *
 * The message/stream contract itself lives in `ui-messages.ts` (the AI SDK's
 * typed `UIMessage`); these are the payloads carried inside its data parts.
 * Deliberately free of `server-only` imports so the client bundle can use them.
 */

export type ChatUniversityCard = {
  slug: string;
  name: string;
  city: string;
  country: string;
  /** Lowercase ISO code for the flag, e.g. "ge". */
  countryCode: string;
  href: string;
  /** Pre-formatted by the same helpers the site uses, e.g. "$4,500" or "Fee plan on request". */
  annualFee: string;
  /**
   * The same figure as a number, set only when the fee is one we may publish.
   * Absent for "on request" programmes, which is what keeps them out of charts
   * rather than being plotted as a zero.
   */
  annualFeeUsd?: number;
  courses: string[];
  medium: string;
  intakes: string[];
};

export type ChatLink = {
  label: string;
  href: string;
};

/**
 * What the chat panel needs to collect before it can hand a lead to counselling.
 * The model asks for these conversationally; the widget renders a short inline
 * form so the visitor is never made to type a phone number into a chat bubble.
 */
export type ChatLeadRequest = {
  reason: string;
  /** Pre-filled from what the conversation already established. */
  interest?: {
    countrySlug?: string;
    courseSlug?: string;
    universitySlug?: string;
  };
};
