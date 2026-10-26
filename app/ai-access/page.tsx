import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/shared/json-ld";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { isMcpServerEnabled } from "@/lib/agent-discovery";
import { siteConfig } from "@/lib/constants";
import { catalogReviewedAt, governancePublishedAt } from "@/lib/content-governance";
import { absoluteUrl, buildIndexableMetadata } from "@/lib/metadata";
import {
  AI_ACCESS_PATH,
  API_CATALOG_PATH,
  COUNSELLING_PATH,
  MCP_ENDPOINT_PATH,
  MCP_RATE_LIMITS,
  MCP_SERVER_CARD_PATH,
  PUBLIC_CATALOG_LIMITS,
  PUBLIC_CATALOG_TOOLS,
} from "@/lib/public-catalog-api";
import {
  getBreadcrumbStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

const description =
  "Terms and setup for AI assistants using the Students Traffic MCP server: free, read-only, rate-limited lookups of universities and programmes with labelled fees and page links.";

export const metadata: Metadata = buildIndexableMetadata({
  title: "AI assistant access (MCP server) | Students Traffic",
  description,
  path: AI_ACCESS_PATH,
});

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-6 text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}

const textClass = "text-sm leading-7 text-muted-foreground";
const inlineCode = "rounded bg-muted px-1 py-0.5 text-xs text-foreground";
const linkClass = "text-primary underline";

export default function AiAccessPage() {
  const mcpUrl = absoluteUrl(MCP_ENDPOINT_PATH);
  const enabled = isMcpServerEnabled();

  const structuredDataItems = [
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "AI assistant access", path: AI_ACCESS_PATH },
    ]),
    getWebPageStructuredData({
      path: AI_ACCESS_PATH,
      name: `${siteConfig.name} MCP server for AI assistants`,
      description,
      datePublished: governancePublishedAt,
      dateModified: catalogReviewedAt,
    }),
  ];

  return (
    <section className="section-space">
      <div className="container-shell max-w-4xl space-y-8">
        <SectionHeading
          as="h1"
          eyebrow="AI assistant access"
          title="Students Traffic MCP server"
          description={`AI assistants can look up the ${siteConfig.name} catalogue of universities, Indian medical colleges and programmes, one question at a time, through a read-only MCP server.`}
        />

        {!enabled ? (
          <p className="rounded-lg border border-border p-4 text-sm text-foreground">
            The MCP server is paused right now. The pages on this site, and their markdown views, remain available.
          </p>
        ) : null}

        <Section title="Terms of use">
          <ul className="list-disc space-y-2 pl-5">
            <li className={textClass}>Access is free, read-only and needs no sign-in.</li>
            <li className={textClass}>
              Attribution is required: when you show or quote a result, link to the page URL it comes with on{" "}
              {siteConfig.name}.
            </li>
            <li className={textClass}>
              The server is for answering individual questions. Bulk scraping, systematic downloading or
              redistribution of the dataset, in whole or in substantial part, is not allowed.
            </li>
            <li className={textClass}>
              Access is rate-limited to {MCP_RATE_LIMITS.minute.limit} requests a minute and{" "}
              {MCP_RATE_LIMITS.day.limit} a day per IP address. Over the limit the server answers HTTP 429 with a
              Retry-After header.
            </li>
            <li className={textClass}>
              We log each tool call (tool name, a hashed IP address, user agent, timing and result size) to operate
              the service and prevent abuse. We may change, limit or revoke access at any time, for anyone.
            </li>
            <li className={textClass}>
              Fees and admission details change. Each result shows its last review date; students should confirm
              with the university or a counsellor before acting.
            </li>
          </ul>
        </Section>

        <Section title="Connect">
          <p className={textClass}>
            Streamable HTTP endpoint, stateless: <code className={inlineCode}>{mcpUrl}</code>
          </p>
          <p className={textClass}>
            Claude (Settings → Connectors → Add custom connector) and ChatGPT (developer mode → Create connector)
            take the URL directly. Claude Code:
          </p>
          <Code>{`claude mcp add --transport http studentstraffic ${mcpUrl}`}</Code>
          <p className={textClass}>Clients configured with JSON (Cursor, VS Code, Windsurf and others):</p>
          <Code>{JSON.stringify({ mcpServers: { studentstraffic: { type: "http", url: mcpUrl } } }, null, 2)}</Code>
          <p className={textClass}>Clients that only run local (stdio) servers can bridge with mcp-remote:</p>
          <Code>
            {JSON.stringify(
              { mcpServers: { studentstraffic: { command: "npx", args: ["-y", "mcp-remote", mcpUrl] } } },
              null,
              2,
            )}
          </Code>
          <p className={textClass}>
            Server card: <a className={linkClass} href={MCP_SERVER_CARD_PATH}>{absoluteUrl(MCP_SERVER_CARD_PATH)}</a>
            {" · "}API catalog (RFC 9727):{" "}
            <a className={linkClass} href={API_CATALOG_PATH}>{absoluteUrl(API_CATALOG_PATH)}</a>
          </p>
        </Section>

        <Section title="Tools">
          <ul className="space-y-2">
            {PUBLIC_CATALOG_TOOLS.map((tool) => (
              <li key={tool.name} className={textClass}>
                <code className={inlineCode}>{tool.name}</code> {tool.description}
              </li>
            ))}
          </ul>
          <p className={textClass}>
            All tools are read-only and take a slug or a search query; wildcards and empty queries are rejected.
            Results are small: {PUBLIC_CATALOG_LIMITS.searchMax} search matches, {PUBLIC_CATALOG_LIMITS.programmesMax}{" "}
            programmes per university and {PUBLIC_CATALOG_LIMITS.findMax} programme matches, each with the page URL
            for the rest. Every result includes the page URL and a link to free counselling (
            {absoluteUrl(COUNSELLING_PATH)}).
          </p>
        </Section>

        <Section title="Reading fees">
          <p className={textClass}>
            Every fee comes as a label and an amount. The label says who the fee is for: Indian students, NRI &amp;
            international, domestic or international students, or a seat quota such as Government quota.
            &quot;Approx. fees&quot; marks a reported figure that may come from a third-party source. Show the label
            with the amount, and do not estimate a fee that is not published.
          </p>
          <p className={textClass}>
            Data is the published catalogue shown on the site and updates when the editorial team publishes. Any
            single page can also be read in full as markdown by adding <code className={inlineCode}>.md</code> to
            its URL.
          </p>
        </Section>

        <p className={textClass}>
          Questions or higher limits: <Link className={linkClass} href="/contact">contact us</Link> or email{" "}
          {siteConfig.email}.
        </p>
      </div>
      <JsonLd data={getStructuredDataGraph(structuredDataItems)} />
    </section>
  );
}
