/**
 * "Next steps" on the student dashboard home: a short list of actions driven
 * by the student's current state, most urgent first. Pure so it can be tested.
 */

export type NextStepKind = "reply" | "apply" | "browse" | "preferences" | "guide";

export type NextStep = {
  kind: NextStepKind;
  title: string;
  description: string;
  href: string;
};

export type NextStepsInput = {
  /** Total unread messages across all of the student's guide conversations. */
  unreadMessages: number;
  /** The conversation with the latest unread message, if any. */
  latestUnread?: { name: string; unread: number } | null;
  shortlistCount: number;
  applicationCount: number;
  /** Guide calls/requests the student has booked (any status). */
  bookingCount: number;
  preferences: {
    neetScore: number | null;
    budgetUsd: number | null;
    preferredCountries: string[] | null;
  };
};

const MAX_STEPS = 4;

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "your guide";
}

export function missingPreferences(preferences: NextStepsInput["preferences"]): string[] {
  const missing: string[] = [];
  if (preferences.neetScore == null) missing.push("NEET score");
  if (preferences.budgetUsd == null) missing.push("budget");
  if (!preferences.preferredCountries?.length) missing.push("preferred countries");
  return missing;
}

function joinList(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function getNextSteps(input: NextStepsInput): NextStep[] {
  const steps: NextStep[] = [];

  if (input.unreadMessages > 0) {
    const latest = input.latestUnread;
    const threadUnread = latest ? Math.min(latest.unread, input.unreadMessages) : input.unreadMessages;
    const others = input.unreadMessages - threadUnread;
    steps.push({
      kind: "reply",
      title: latest
        ? `Reply to ${firstName(latest.name)} (${threadUnread} unread)`
        : `You have ${input.unreadMessages} unread ${input.unreadMessages === 1 ? "message" : "messages"}`,
      description:
        others > 0
          ? `Plus ${others} more unread in your other conversations.`
          : "Your guide is waiting for your reply.",
      href: "/dashboard/messages",
    });
  }

  if (input.shortlistCount > 0 && input.applicationCount === 0) {
    steps.push({
      kind: "apply",
      title:
        input.shortlistCount === 1
          ? "Start an application for your shortlisted university"
          : `Start an application for one of your ${input.shortlistCount} shortlisted universities`,
      description: "Pick the one you like most. We review it and guide you through admission.",
      href: "/dashboard/shortlists",
    });
  }

  if (input.shortlistCount === 0) {
    steps.push({
      kind: "browse",
      title: "Browse universities",
      description: "Save the ones you like to your shortlist so you can compare and apply.",
      href: "/universities",
    });
  }

  const missing = missingPreferences(input.preferences);
  if (missing.length > 0) {
    steps.push({
      kind: "preferences",
      title: "Complete your study preferences",
      description: `Add your ${joinList(missing)} so we can suggest universities that fit.`,
      href: "/dashboard/settings",
    });
  }

  if (input.bookingCount === 0 && input.unreadMessages === 0) {
    steps.push({
      kind: "guide",
      title: "Talk to a student guide",
      description: "Get first-hand advice from a student already studying there.",
      href: "/universities",
    });
  }

  return steps.slice(0, MAX_STEPS);
}
