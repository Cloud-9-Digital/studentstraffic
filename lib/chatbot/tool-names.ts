/**
 * Tool names and their human labels, client-safe.
 *
 * The dock renders each tool call as a visible step ("Shortlisting
 * programmes"), which is the honest version of a thinking indicator: it says
 * what the assistant is actually doing instead of pretending to ponder. Labels
 * live here so the server tool definitions and the UI cannot drift apart.
 */

export const CHATBOT_TOOL_NAMES = [
  "search_site",
  "find_programs",
  "get_university",
  "compare_universities",
  "get_destination",
  "list_destinations",
  "request_counselling_callback",
] as const;

export type ChatbotToolName = (typeof CHATBOT_TOOL_NAMES)[number];

/** Present tense while running, past tense once the result is in. */
const TOOL_LABELS: Record<ChatbotToolName, { running: string; done: string }> = {
  search_site: { running: "Searching", done: "Searched our pages" },
  find_programs: {
    running: "Shortlisting programmes",
    done: "Shortlisted programmes",
  },
  get_university: {
    running: "Reading the university profile",
    done: "Read the university profile",
  },
  compare_universities: {
    running: "Comparing universities",
    done: "Compared universities",
  },
  get_destination: {
    running: "Checking the destination",
    done: "Checked the destination",
  },
  list_destinations: {
    running: "Checking our coverage",
    done: "Checked our coverage",
  },
  request_counselling_callback: {
    running: "Opening the callback form",
    done: "Opened the callback form",
  },
};

export function getToolLabel(toolName: string, isRunning: boolean) {
  const labels = TOOL_LABELS[toolName as ChatbotToolName];

  if (!labels) {
    return isRunning ? "Checking our catalogue" : "Checked our catalogue";
  }

  return isRunning ? labels.running : labels.done;
}

export function isChatbotToolName(value: string): value is ChatbotToolName {
  return (CHATBOT_TOOL_NAMES as readonly string[]).includes(value);
}
