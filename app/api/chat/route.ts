import { anthropic, type AnthropicLanguageModelOptions } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  tool,
  toUIMessageStream,
  type ModelMessage,
} from "ai";
import { cookies, headers } from "next/headers";
import { z } from "zod";

import { getIpAddress } from "@/app/_actions/form-helpers";
import {
  CHATBOT_MAX_TOKENS,
  CHATBOT_MODEL,
  isChatbotConfigured,
  MAX_HISTORY_MESSAGES,
  MAX_TOOL_ITERATIONS,
  MAX_USER_MESSAGE_CHARS,
} from "@/lib/chatbot/config";
import {
  recordAssistantMessage,
  recordUserMessage,
  startOrResumeConversation,
} from "@/lib/chatbot/conversations";
import { shortlistUniversities } from "@/lib/chatbot/actions";
import {
  compareUniversities,
  findPrograms,
  findStudentPeers,
  getCountryBrief,
  getUniversityDossier,
  listDestinations,
  searchSite,
  type KnowledgeResult,
} from "@/lib/chatbot/knowledge";
import {
  buildPageContextNote,
  CHATBOT_SYSTEM_PROMPT,
} from "@/lib/chatbot/system-prompt";
import { intakeMonthCodes, teachingLanguageCodes } from "@/lib/catalogue-facets";
import type { MiraUIMessage } from "@/lib/chatbot/ui-messages";
import type { ChatbotToolCallRecord } from "@/lib/data/types";
import { buildViewerNote, getChatViewer } from "@/lib/chatbot/viewer";
import { rateLimit } from "@/lib/rate-limit";
import { logPublicRouteRequest } from "@/lib/route-observability";
import { getTrackingSnapshot } from "@/lib/tracking";

/**
 * The chat endpoint.
 *
 * Built on the AI SDK's UI message stream so the dock receives typed parts —
 * text, tool calls with their state, and our own data parts — instead of a
 * bespoke protocol. The agentic loop is the SDK's: `stopWhen` lets the model
 * look things up and then answer, and every tool call is streamed to the client
 * as it happens, which is what makes the dock's visible steps possible.
 *
 * The grounding rule is unchanged and lives in lib/chatbot/knowledge.ts: the
 * model may only state what a tool returned, and fees are pre-formatted so
 * "on request" cannot become a number.
 */

export const maxDuration = 60;

const BOT_USER_AGENT_PATTERN =
  /bot|crawl|crawler|spider|slurp|preview|facebookexternalhit|telegram|discord|linkedinbot|google-extended|headless/i;

const pageSchema = z
  .object({
    path: z.string().trim().min(1).max(512),
    url: z.string().trim().max(1024).optional(),
    title: z.string().trim().max(300).optional(),
  })
  .optional();

const chatRequestSchema = z.object({
  id: z.string().trim().max(128).optional(),
  messages: z.array(z.any()).min(1),
  conversationId: z.string().trim().min(1).max(64).optional(),
  page: pageSchema,
});

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9-]+$/, "Slugs are lowercase words joined by hyphens.");

function isTrustedBrowserRequest(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";

  if (!userAgent || BOT_USER_AGENT_PATTERN.test(userAgent)) {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  logPublicRouteRequest({ route: "api/chat", request, sampleRate: 0.1 });

  // A crawler is turned away whether or not the assistant is configured, and
  // learns nothing about how it is configured.
  if (!isTrustedBrowserRequest(request)) {
    return errorResponse("Request blocked.", 403);
  }

  if (!isChatbotConfigured()) {
    return errorResponse(
      "The assistant is not switched on yet. Please use the WhatsApp or call buttons and a counsellor will help.",
      503
    );
  }

  let body: z.infer<typeof chatRequestSchema>;

  try {
    body = chatRequestSchema.parse(await request.json());
  } catch {
    return errorResponse("I could not read that message.", 400);
  }

  const uiMessages = body.messages as MiraUIMessage[];
  const latest = uiMessages.at(-1);

  const latestText =
    latest?.role === "user"
      ? latest.parts
          .filter(
            (part): part is { type: "text"; text: string } =>
              part.type === "text"
          )
          .map((part) => part.text)
          .join("\n")
          .trim()
      : "";

  if (!latestText || latestText.length > MAX_USER_MESSAGE_CHARS) {
    return errorResponse(
      "Could you try that again a little shorter?",
      400
    );
  }

  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const ipAddress = getIpAddress(headerStore);
  const identifier = ipAddress ?? "unknown";

  const [burst, hourly] = await Promise.all([
    rateLimit(`chat:burst:${identifier}`, { limit: 8, window: 60_000 }),
    rateLimit(`chat:hourly:${identifier}`, { limit: 60, window: 60 * 60_000 }),
  ]);

  if (!burst.success) {
    return errorResponse(
      "You are sending messages faster than I can think. Give me a few seconds and try again.",
      429
    );
  }

  if (!hourly.success) {
    return errorResponse(
      "You have reached the chat limit for this hour. A counsellor can pick this up on WhatsApp straight away.",
      429
    );
  }

  const tracking = getTrackingSnapshot(cookieStore, {});

  const conversation = await startOrResumeConversation({
    publicId: body.conversationId,
    visitorId: tracking.visitorId ?? null,
    page: body.page,
    referrer: headerStore.get("referer"),
    userAgent: headerStore.get("user-agent"),
    ipAddress,
  });

  if (conversation.exhausted) {
    return errorResponse(
      "This conversation has run long — start a new one, or carry on with a counsellor on WhatsApp.",
      429
    );
  }

  await recordUserMessage(conversation.id, latestText);

  const pageNote = buildPageContextNote(body.page);
  const viewerNote = buildViewerNote(await getChatViewer());
  const startedAt = Date.now();

  const stream = createUIMessageStream<MiraUIMessage>({
    originalMessages: uiMessages,
    execute: async ({ writer }) => {
      const toolRecords: ChatbotToolCallRecord[] = [];

      /** Shared wrapper: run the lookup, stream its UI, record what happened. */
      const wrap = async (
        name: string,
        input: Record<string, unknown>,
        run: () => Promise<KnowledgeResult>,
        cardTitle?: (outcome: KnowledgeResult) => string
      ) => {
        const toolStartedAt = Date.now();
        let outcome: KnowledgeResult;

        try {
          outcome = await run();
        } catch (error) {
          console.error(`[chat] tool ${name} failed`, error);
          toolRecords.push({
            name,
            input,
            outcome: "error",
            durationMs: Date.now() - toolStartedAt,
          });
          return {
            error: "lookup_failed",
            note: "That lookup failed. Tell the visitor you could not check it rather than guessing.",
          };
        }

        toolRecords.push({
          name,
          input,
          outcome: outcome.outcome,
          durationMs: Date.now() - toolStartedAt,
        });

        if (outcome.cards?.length) {
          writer.write({
            type: "data-universities",
            data: {
              title: cardTitle?.(outcome) ?? "From our catalogue",
              cards: outcome.cards,
            },
          });

          // A tuition comparison earns its place only when there are enough
          // publishable figures to compare — three is the floor, below which a
          // bar chart is just a number wearing a costume. Programmes whose fee
          // is "on request" carry no numeric value and so never appear.
          const chartPoints = outcome.cards
            .filter(
              (card): card is typeof card & { annualFeeUsd: number } =>
                typeof card.annualFeeUsd === "number" && card.annualFeeUsd > 0
            )
            .sort((left, right) => left.annualFeeUsd - right.annualFeeUsd)
            .slice(0, 6)
            .map((card) => ({
              label: card.name,
              value: card.annualFeeUsd,
              formatted: card.annualFee,
              href: card.href,
            }));

          if (chartPoints.length >= 3) {
            writer.write({
              type: "data-feeChart",
              data: { title: "Annual tuition, lowest first", points: chartPoints },
            });
          }
        }

        if (outcome.links?.length) {
          writer.write({
            type: "data-links",
            data: { links: outcome.links },
          });
        }

        return outcome.result;
      };

      const tools = {
        search_site: tool({
          description:
            "Free-text search across every published Students Traffic page: universities, programmes, destinations, courses, guides and articles. Use this first when you do not already know the exact slug of what the visitor means, and to resolve a name they typed into a slug for the other tools.",
          inputSchema: z.object({
            query: z.string().trim().min(2).max(200),
            limit: z.number().int().min(1).max(12).optional(),
          }),
          execute: async (input) =>
            wrap("search_site", input, () => searchSite(input)),
        }),

        find_programs: tool({
          description:
            "Shortlist published programmes against the visitor's real constraints — destination, course, budget, teaching language, intake month, public or private. Use it whenever they give two or more constraints, in any stream — an MBA in Australia under $40,000, English-taught engineering in Germany, nursing in Ireland with a September intake. Sorted by annual tuition, lowest first. Setting a budget excludes programmes whose fee we may not publish, so every result carries a real figure.",
          inputSchema: z.object({
            countrySlug: slugSchema.optional(),
            courseSlug: slugSchema.optional(),
            city: z.string().trim().min(1).max(120).optional(),
            level: z.string().trim().min(1).max(60).optional(),
            minAnnualTuitionUsd: z.number().int().min(0).max(200_000).optional(),
            maxAnnualTuitionUsd: z.number().int().min(0).max(200_000).optional(),
            teachingLanguage: z.enum(teachingLanguageCodes).optional(),
            intakeMonth: z.enum(intakeMonthCodes).optional(),
            universityType: z.enum(["Public", "Private"]).optional(),
            limit: z.number().int().min(1).max(10).optional(),
          }),
          execute: async (input) => {
            if (Object.keys(input).length === 0) {
              return {
                error: "no_filters",
                note: "Give at least one filter, or use list_destinations for an overview.",
              };
            }

            return wrap(
              "find_programs",
              input,
              () => findPrograms(input),
              (outcome) => {
                const result = outcome.result as {
                  totalMatches?: number;
                  showing?: number;
                };
                return result.totalMatches && result.showing
                  ? `${result.showing} of ${result.totalMatches} matches`
                  : "Matching programmes";
              }
            );
          },
        }),

        get_university: tool({
          description:
            "Everything published about one university: programmes with fees and intakes, recognition, hostel and food, city and safety, student support and its FAQ. Resolve the name to a slug with search_site first.",
          inputSchema: z.object({ slug: slugSchema }),
          execute: async (input) =>
            wrap(
              "get_university",
              input,
              () => getUniversityDossier(input),
              () => "University profile"
            ),
        }),

        compare_universities: tool({
          description:
            "Side-by-side comparison of two to four universities on fees, duration, teaching language, intakes, recognition and trade-offs. Use it when the visitor names more than one, or asks which is better.",
          inputSchema: z.object({ slugs: z.array(slugSchema).min(2).max(4) }),
          execute: async (input) =>
            wrap(
              "compare_universities",
              input,
              () => compareUniversities(input),
              () => "Side by side"
            ),
        }),

        get_destination: tool({
          description:
            "What we publish about one destination, plus how much of it we actually cover: published university and programme counts, the courses available and the real annual tuition range. Use it for country-level questions and before claiming any coverage.",
          inputSchema: z.object({ slug: slugSchema }),
          execute: async (input) =>
            wrap("get_destination", input, () => getCountryBrief(input)),
        }),

        list_destinations: tool({
          description:
            "Every destination and course Students Traffic currently publishes. Use it to answer 'where can I study X' or 'do you cover Y', and to resolve a name to a slug.",
          inputSchema: z.object({}),
          execute: async () =>
            wrap("list_destinations", {}, () => listDestinations()),
        }),

        find_student_peers: tool({
          description:
            "Find students currently at a university who have agreed to talk to applicants. Use it when the visitor asks what a place is really like, about hostels, food, safety or daily life, or whether they can speak to someone there — the honest answer to those is often a current student rather than our page.",
          inputSchema: z.object({ universitySlug: slugSchema }),
          execute: async (input) =>
            wrap("find_student_peers", input, () => findStudentPeers(input)),
        }),

        request_peer_connection: tool({
          description:
            "Open a short form asking to be introduced to a current student at a university. Call it only after find_student_peers showed someone is available and the visitor has said they want an introduction. A counsellor brokers the introduction; you never share a student's contact details.",
          inputSchema: z.object({
            universitySlug: slugSchema,
            universityName: z.string().trim().min(1).max(200),
            reason: z
              .string()
              .trim()
              .min(3)
              .max(300)
              .describe(
                "One short line, addressed to the visitor, saying what they will get out of it."
              ),
          }),
          execute: async (input) => {
            toolRecords.push({
              name: "request_peer_connection",
              input,
              outcome: "peer form shown",
              durationMs: 0,
            });

            writer.write({ type: "data-peerRequest", data: input });

            return {
              shown: true,
              note: "The introduction form is open in the chat. Tell the visitor it is there. Do not ask for their phone number yourself, and do not promise a particular student will reply.",
            };
          },
        }),

        shortlist_universities: tool({
          description:
            "Save universities to the visitor's shortlist so they can come back to them. Use it when they say to save, keep or shortlist something, or clearly settle on a few options. Saving needs an account — if the result says the visitor is not signed in, tell them plainly that saving needs one rather than implying it worked.",
          inputSchema: z.object({
            slugs: z.array(slugSchema).min(1).max(8),
          }),
          execute: async (input) => {
            const startedAt = Date.now();
            const result = await shortlistUniversities(input.slugs);

            toolRecords.push({
              name: "shortlist_universities",
              input,
              outcome: result.requiresSignIn
                ? "sign-in required"
                : `${result.added.length} added`,
              durationMs: Date.now() - startedAt,
            });

            writer.write({
              type: "data-shortlist",
              data: {
                added: result.added,
                alreadyThere: result.alreadyThere,
                requiresSignIn: result.requiresSignIn,
              },
            });

            return result;
          },
        }),

        request_counselling_callback: tool({
          description:
            "Open a short, secure form in the chat for the visitor's name, phone and state so a counsellor can call back. Call this only after the visitor has agreed to a callback or asked for counselling — never pre-emptively and never to gate information. Never ask for a phone number or email yourself; this form is the only way those are collected.",
          inputSchema: z.object({
            reason: z.string().trim().min(3).max(300),
            countrySlug: slugSchema.optional(),
            courseSlug: slugSchema.optional(),
            universitySlug: slugSchema.optional(),
          }),
          execute: async (input) => {
            toolRecords.push({
              name: "request_counselling_callback",
              input,
              outcome: "callback form shown",
              durationMs: 0,
            });

            writer.write({
              type: "data-leadRequest",
              data: {
                reason: input.reason,
                interest: {
                  countrySlug: input.countrySlug,
                  courseSlug: input.courseSlug,
                  universitySlug: input.universitySlug,
                },
              },
            });

            return {
              shown: true,
              note: "The callback form is now open in the chat. Tell the visitor it is there. Do not ask for their phone number or email yourself, and do not call this tool again unless they ask.",
            };
          },
        }),
      };

      // AI SDK 7 rejects system messages inside `messages`; system instructions
      // go through `instructions`. Its object form still accepts
      // providerOptions, which is what lets the prompt carry a cache
      // breakpoint: the prefix is byte-identical on every request, so all but
      // the first read of it bills at the cache rate.
      const modelMessages: ModelMessage[] = await convertToModelMessages(
        uiMessages.slice(-MAX_HISTORY_MESSAGES)
      );

      // Page and viewer context ride on the last user turn rather than the
      // instructions, so they sit after the cached prefix and never
      // invalidate it.
      const contextNotes = [pageNote, viewerNote].filter(Boolean).join("\n");

      if (contextNotes) {
        const lastUserIndex = modelMessages.findLastIndex(
          (message) => message.role === "user"
        );

        const target = modelMessages[lastUserIndex];

        // Narrowed to the user role so the content union is the narrow
        // (text | image | file) one a text part can be appended to.
        if (target?.role === "user") {
          target.content =
            typeof target.content === "string"
              ? `${target.content}\n\n${contextNotes}`
              : [...target.content, { type: "text", text: contextNotes }];
        }
      }

      const result = streamText({
        model: anthropic(CHATBOT_MODEL),
        instructions: {
          role: "system",
          content: CHATBOT_SYSTEM_PROMPT,
          providerOptions: {
            anthropic: { cacheControl: { type: "ephemeral" } },
          },
        },
        messages: modelMessages,
        tools,
        // Look things up, then answer. Without this the model would stop after
        // its first tool call and never produce prose.
        stopWhen: isStepCount(MAX_TOOL_ITERATIONS),
        maxOutputTokens: CHATBOT_MAX_TOKENS,
        providerOptions: {
          anthropic: {
            // Chat reasoning is shallow — pick a tool, read it, answer — and
            // effort is the cost lever on this model, where thinking cannot be
            // switched off.
            effort: "low",
          } satisfies AnthropicLanguageModelOptions,
        },
        onError: ({ error }) => {
          console.error("[chat] stream error", error);
        },
        onFinish: async ({ text, usage, finishReason }) => {
          try {
            await recordAssistantMessage(conversation.id, {
              content: text,
              toolCalls: toolRecords,
              model: CHATBOT_MODEL,
              inputTokens: usage.inputTokens,
              cachedInputTokens: usage.inputTokenDetails?.cacheReadTokens,
              outputTokens: usage.outputTokens,
              latencyMs: Date.now() - startedAt,
              stopReason: finishReason,
            });
          } catch (error) {
            console.error("[chat] transcript write failed", error);
          }
        },
      });

      writer.merge(
        toUIMessageStream({
          stream: result.stream,
          sendStart: false,
          // The browser holds this id so reopening the dock continues the same
          // stored conversation instead of orphaning it.
          messageMetadata: () => ({ conversationId: conversation.publicId }),
        })
      );
    },
    onError: (error) => {
      console.error("[chat] ui stream failed", error);
      return "Sorry — something went wrong on my side. Please try again, or use the WhatsApp button and a counsellor will pick it up.";
    },
  });

  return createUIMessageStreamResponse({ stream });
}
