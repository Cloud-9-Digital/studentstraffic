import { useCallback, useEffect, useRef, useState } from "react";
import { fetch as expoFetch } from "expo/fetch";

import { mobileClient } from "../../api/mobileClient";
import { isToolPart, type MiraContext, type MiraMessage, type MiraPart, type MiraToolPart } from "./types";

// Talks to /api/mobile/v1/mira, which runs the same turn as the website's
// /api/chat and streams the same AI SDK UI message stream (server-sent events,
// one JSON chunk per `data:` line). React Native's own fetch cannot read a
// response as it arrives, so this uses expo/fetch and folds each chunk into the
// assistant message the way the SDK's useChat would on the web.

export const MIRA_MAX_INPUT_CHARS = 1500;

export type MiraStatus = "ready" | "submitted" | "streaming";

type Chunk = { type: string; [key: string]: any };

// One conversation survives closing and reopening Mira, as the web dock keeps
// one per browser tab. Opening her about a different university starts afresh.
let stored: { key: string; messages: MiraMessage[] } | null = null;

function contextKey(context: MiraContext) {
  return context ? `university:${context.universitySlug}` : "general";
}

export function miraPage(context: MiraContext) {
  return context
    ? { path: `/university/${context.universitySlug}`, title: `${context.universityName} (Students Traffic app)` }
    : { path: "/mobile-app/mira", title: "Ask Mira (Students Traffic app)" };
}

let idCounter = 0;
function newId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

/**
 * What goes back to the server. Tool calls that never finished (a stopped
 * turn) are dropped: a call without its result is not a valid model message.
 */
function forRequest(messages: MiraMessage[]) {
  return messages.map((message) => ({
    ...message,
    parts: message.parts.filter((part) => !isToolPart(part) || part.state === "output-available" || part.state === "output-error"),
  }));
}

/** Applies one stream chunk to the assistant message being built. Mutates `draft`. */
function applyChunk(draft: MiraMessage, chunk: Chunk, textIndex: Map<string, number>): string | null {
  const findTool = (toolCallId: string) =>
    draft.parts.find((part): part is MiraToolPart => isToolPart(part) && part.toolCallId === toolCallId);

  switch (chunk.type) {
    case "start":
      if (chunk.messageId) draft.id = chunk.messageId;
      if (chunk.messageMetadata) draft.metadata = { ...draft.metadata, ...chunk.messageMetadata };
      return null;
    case "message-metadata":
    case "finish":
      if (chunk.messageMetadata) draft.metadata = { ...draft.metadata, ...chunk.messageMetadata };
      return null;
    case "start-step":
      draft.parts.push({ type: "step-start" });
      return null;
    case "text-start":
      textIndex.set(chunk.id, draft.parts.length);
      draft.parts.push({ type: "text", text: "" });
      return null;
    case "text-delta": {
      let index = textIndex.get(chunk.id);
      if (index === undefined) {
        index = draft.parts.length;
        textIndex.set(chunk.id, index);
        draft.parts.push({ type: "text", text: "" });
      }
      const part = draft.parts[index] as { type: "text"; text: string };
      draft.parts[index] = { type: "text", text: part.text + chunk.delta };
      return null;
    }
    case "tool-input-start":
      draft.parts.push({ type: `tool-${chunk.toolName}`, toolCallId: chunk.toolCallId, state: "input-streaming" });
      return null;
    case "tool-input-available": {
      const existing = findTool(chunk.toolCallId);
      if (existing) Object.assign(existing, { state: "input-available", input: chunk.input });
      else draft.parts.push({ type: `tool-${chunk.toolName}`, toolCallId: chunk.toolCallId, state: "input-available", input: chunk.input });
      return null;
    }
    case "tool-output-available": {
      const existing = findTool(chunk.toolCallId);
      if (existing) Object.assign(existing, { state: "output-available", output: chunk.output });
      return null;
    }
    case "tool-input-error":
    case "tool-output-error": {
      const existing = findTool(chunk.toolCallId);
      if (existing) Object.assign(existing, { state: "output-error", errorText: chunk.errorText, input: chunk.input ?? existing.input });
      return null;
    }
    case "error":
      return typeof chunk.errorText === "string" ? chunk.errorText : "Something went wrong on my side.";
    default:
      if (chunk.type.startsWith("data-") && !chunk.transient) {
        draft.parts.push({ type: chunk.type, data: chunk.data } as MiraPart);
      }
      return null;
  }
}

/** Splits complete server-sent events off the front of a byte buffer. */
function takeEvents(buffer: Uint8Array): { events: Uint8Array[]; rest: Uint8Array } {
  const events: Uint8Array[] = [];
  let start = 0;
  // "\n" is ASCII and never part of a multi-byte UTF-8 sequence, so cutting at
  // a blank line cannot split a character — which matters because TextDecoder
  // on native has no streaming mode.
  for (let i = 0; i < buffer.length - 1; i++) {
    if (buffer[i] === 10 && buffer[i + 1] === 10) {
      events.push(buffer.subarray(start, i));
      start = i + 2;
      i += 1;
    }
  }
  return { events, rest: buffer.slice(start) };
}

function concat(a: Uint8Array, b: Uint8Array) {
  const out = new Uint8Array(a.length + b.length);
  out.set(a);
  out.set(b, a.length);
  return out;
}

export function useMiraChat(context: MiraContext) {
  const key = contextKey(context);
  const [messages, setMessages] = useState<MiraMessage[]>(() => (stored?.key === key ? stored.messages : []));
  const [status, setStatus] = useState<MiraStatus>("ready");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    stored = { key, messages };
  }, [key, messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const conversationId = [...messages].reverse().find((message) => message.metadata?.conversationId)?.metadata?.conversationId;

  const send = useCallback(async (raw: string) => {
    const text = raw.trim().slice(0, MIRA_MAX_INPUT_CHARS);
    if (!text || abortRef.current) return;

    const userMessage: MiraMessage = { id: newId("user"), role: "user", parts: [{ type: "text", text }] };
    const history = [...messagesRef.current, userMessage];
    const draft: MiraMessage = { id: newId("mira"), role: "assistant", parts: [] };
    const textIndex = new Map<string, number>();
    const controller = new AbortController();
    abortRef.current = controller;

    setMessages(history);
    setStatus("submitted");
    setError(null);

    const publish = () => setMessages([...history, { ...draft, parts: draft.parts.map((part) => ({ ...part })) }]);

    try {
      const response = await expoFetch(`${mobileClient.apiUrl}/api/mobile/v1/mira`, {
        method: "POST",
        headers: { ...(await mobileClient.authHeaders()), "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({
          messages: forRequest(history),
          conversationId: [...history].reverse().find((message) => message.metadata?.conversationId)?.metadata?.conversationId,
          page: miraPage(context),
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Mira could not answer just now. Please try again.");
      }

      setStatus("streaming");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer: Uint8Array = new Uint8Array(0);
      let streamError: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const { events, rest } = takeEvents(concat(buffer, value));
        buffer = rest;

        for (const event of events) {
          for (const line of decoder.decode(event).split("\n")) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              streamError = applyChunk(draft, JSON.parse(payload), textIndex) ?? streamError;
            } catch {
              // A malformed chunk loses one fragment, never the whole answer.
            }
          }
        }
        // One render per network read rather than per token.
        if (events.length) publish();
      }

      publish();
      if (streamError) setError(streamError);
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : "Mira could not answer just now. Please try again.");
      }
      if (draft.parts.length) publish();
    } finally {
      abortRef.current = null;
      setStatus("ready");
    }
  }, [context]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  return { messages, status, error, conversationId, send, stop, reset };
}
