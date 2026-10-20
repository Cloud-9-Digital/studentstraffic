import type { UIMessage } from "ai";

import type {
  ChatLeadRequest,
  ChatLink,
  ChatUniversityCard,
} from "@/lib/chatbot/types";

/**
 * The typed message shape shared by the route and the dock.
 *
 * Everything the UI renders beyond prose travels as a *data part* rather than
 * being parsed back out of the model's text. The model writes sentences; the
 * server writes the cards, the links and the lead form. That split is what
 * makes a rendered fee figure impossible to hallucinate — it never passed
 * through the model on its way to the screen.
 */

export type MiraDataParts = {
  /** University cards from one lookup, rendered under the answer. */
  universities: {
    /** Short heading for the group, e.g. "3 of 201 matches". */
    title: string;
    cards: ChatUniversityCard[];
  };
  /** Pages the answer leaned on. */
  links: {
    links: ChatLink[];
  };
  /** A compact tuition comparison, drawn only from publishable fees. */
  feeChart: {
    title: string;
    points: Array<{
      label: string;
      value: number;
      formatted: string;
      href?: string;
    }>;
  };
  /** Opens the inline callback form. */
  leadRequest: ChatLeadRequest;
  /** Opens the inline form that asks to be introduced to a student. */
  peerRequest: {
    universitySlug: string;
    universityName: string;
    reason: string;
  };
  /** Confirms what was saved to the visitor's shortlist. */
  shortlist: {
    added: string[];
    alreadyThere: string[];
    requiresSignIn: boolean;
  };
};

export type MiraMessageMetadata = {
  conversationId?: string;
};

export type MiraUIMessage = UIMessage<MiraMessageMetadata, MiraDataParts>;
