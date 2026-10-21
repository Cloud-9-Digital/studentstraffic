/**
 * Chatbot tuning knobs, in one place so cost and abuse limits are reviewable
 * without reading the route handler.
 */

// Re-exported so server modules have one import for chatbot constants; the
// value itself lives in branding.ts, which is safe for the client bundle.
export { CHATBOT_NAME } from "@/lib/chatbot/branding";

/**
 * Overridable per environment. Chat is a high-volume, latency-sensitive
 * surface: `effort: "low"` below keeps the per-answer cost far lower than the
 * model tier alone suggests, and a cheaper model can be swapped in from the
 * environment without a deploy of this file.
 */
export const CHATBOT_MODEL = process.env.CHATBOT_MODEL?.trim() || "claude-opus-5-5";

/**
 * Chat answers are short and grounded in tool results, so this is a safety
 * ceiling against a runaway generation, not a target length.
 */
export const CHATBOT_MAX_TOKENS = 2048;

/** How many grounding round-trips one answer may make before we stop looping. */
export const MAX_TOOL_ITERATIONS = 6;

/** Longest single question we accept. Anything longer is a paste, not a question. */
export const MAX_USER_MESSAGE_CHARS = 1500;

/**
 * Turns of history replayed to the model. The transcript keeps everything; this
 * only bounds what each request pays for.
 */
export const MAX_HISTORY_MESSAGES = 24;

/** Hard stop per conversation, so one tab cannot bill indefinitely. */
export const MAX_MESSAGES_PER_CONVERSATION = 60;

/** Narrative catalogue fields are page-length. Tool results get a lede only. */
export const NARRATIVE_CLIP_CHARS = 700;

/**
 * How much of each lookup's result the transcript keeps. It rides in the row
 * every answer already writes, so it costs no extra query — the cap keeps a
 * full dossier from quietly multiplying the size of every stored message.
 */
export const TRANSCRIPT_RESULT_CHARS = 4000;

export function isChatbotConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}
