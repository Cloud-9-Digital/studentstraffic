"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ChatCardCarousel } from "@/components/site/chatbot/chat-card-carousel";
import { ChatFeeChart } from "@/components/site/chatbot/chat-fee-chart";
import { ChatLeadForm } from "@/components/site/chatbot/chat-lead-form";
import {
  ChatToolStep,
  ChatToolSteps,
} from "@/components/site/chatbot/chat-tool-step";
import { ChatUniversityCardItem } from "@/components/site/chatbot/chat-university-card";
import type { MiraUIMessage } from "@/lib/chatbot/ui-messages";
import { cn } from "@/lib/utils";

/**
 * Renders one message from its typed parts.
 *
 * Parts arrive in the order the server produced them, so an answer reads the
 * way the work happened: the lookups it made, then the prose, then the cards
 * and links those lookups returned. Nothing here re-parses the model's text —
 * every card and figure is a data part the server wrote.
 */

/**
 * Only inline formatting is allowed through. A chat column is not the place for
 * headings, images or tables, and links are internal paths the model got from a
 * tool.
 */
function AnswerMarkdown({ content }: { content: string }) {
  return (
    <div className="text-[0.9rem] leading-relaxed text-foreground [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const target = typeof href === "string" ? href : "#";

            return target.startsWith("/") ? (
              <Link
                href={target}
                className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
              >
                {children}
              </Link>
            ) : (
              <a
                href={target}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="font-medium text-accent underline decoration-accent/40 underline-offset-2"
              >
                {children}
              </a>
            );
          },
          h1: ({ children }) => <p className="font-semibold">{children}</p>,
          h2: ({ children }) => <p className="font-semibold">{children}</p>,
          h3: ({ children }) => <p className="font-semibold">{children}</p>,
          img: () => null,
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-muted px-2 py-1.5 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-border/60 px-2 py-1.5 align-top">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/** Pulls a one-line outcome out of a tool result for the step row. */
function getToolDetail(part: { output?: unknown }) {
  const output = part.output as
    | { totalMatches?: number; showing?: number; found?: boolean; matches?: unknown[] }
    | undefined;

  if (!output || typeof output !== "object") return undefined;

  if (output.found === false) return "no match";

  if (typeof output.totalMatches === "number") {
    return output.totalMatches === 0
      ? "no match"
      : `${output.totalMatches} found`;
  }

  if (Array.isArray(output.matches)) {
    return output.matches.length === 0
      ? "no match"
      : `${output.matches.length} found`;
  }

  return undefined;
}

export function ChatMessage({
  message,
  conversationId,
  onLeadSubmitted,
}: {
  message: MiraUIMessage;
  conversationId?: string;
  onLeadSubmitted: () => void;
}) {
  if (message.role === "user") {
    const text = message.parts
      .filter((part) => part.type === "text")
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("\n");

    return (
      <div className="flex justify-end">
        <div className="max-w-[88%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2 text-[0.9rem] leading-relaxed text-white">
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
      </div>
    );
  }

  const toolParts = message.parts.filter((part) =>
    part.type.startsWith("tool-")
  );

  return (
    <div className="space-y-2">
      {toolParts.length > 0 ? (
        <ChatToolSteps>
          {toolParts.map((part, index) => {
            const toolPart = part as typeof part & {
              type: string;
              state: "input-streaming" | "input-available" | "output-available" | "output-error";
              output?: unknown;
            };

            return (
              <ChatToolStep
                key={`${message.id}-tool-${index}`}
                toolName={toolPart.type.replace(/^tool-/, "")}
                state={toolPart.state}
                detail={
                  toolPart.state === "output-available"
                    ? getToolDetail(toolPart)
                    : undefined
                }
              />
            );
          })}
        </ChatToolSteps>
      ) : null}

      {message.parts.map((part, index) => {
        const key = `${message.id}-part-${index}`;

        switch (part.type) {
          case "text":
            return part.text.trim() ? (
              <AnswerMarkdown key={key} content={part.text} />
            ) : null;

          case "data-universities":
            return (
              <div key={key} className="space-y-1.5 pt-0.5">
                <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground/70">
                  {part.data.title}
                </p>
                {/* Three or more results become a carousel: in this column a
                    stack of cards buries the answer above it. */}
                {part.data.cards.length >= 3 ? (
                  <ChatCardCarousel cards={part.data.cards} />
                ) : (
                  part.data.cards.map((card) => (
                    <ChatUniversityCardItem key={`${key}-${card.slug}`} card={card} />
                  ))
                )}
              </div>
            );

          case "data-feeChart":
            return (
              <ChatFeeChart
                key={key}
                title={part.data.title}
                points={part.data.points}
              />
            );

          case "data-links":
            return (
              <div key={key} className="flex flex-wrap gap-1.5 pt-0.5">
                {part.data.links.map((link) => (
                  <Link
                    key={`${key}-${link.href}`}
                    href={link.href}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[0.7rem] font-medium text-foreground transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            );

          case "data-leadRequest":
            return (
              <ChatLeadForm
                key={key}
                request={part.data}
                conversationId={conversationId}
                onSubmitted={onLeadSubmitted}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

/** The streaming placeholder, shown before the first part of an answer lands. */
export function ChatThinking({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 py-1", className)}>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground/50"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}
