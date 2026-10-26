import assert from "node:assert/strict";
import test from "node:test";

import {
  getRewrittenUrl,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";

import {
  HOME_LINK_HEADER,
  getHomeLinkHeader,
  getHomeLinkHeaderRule,
  isMcpServerEnabled,
  getMarkdownRewrites,
  requestsMarkdown,
} from "@/lib/agent-discovery";

const nextConfig = {
  async rewrites() {
    return getMarkdownRewrites();
  },
  async headers() {
    return [getHomeLinkHeaderRule(true)];
  },
};

const BROWSER_ACCEPT =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";

async function rewriteFor(path: string, accept?: string) {
  const response = await unstable_getResponseFromNextConfig({
    url: `https://www.studentstraffic.com${path}`,
    nextConfig,
    headers: accept ? { accept } : {},
  });
  return { response, rewritten: getRewrittenUrl(response) };
}

test("only an Accept header naming text/markdown asks for markdown", () => {
  assert.equal(requestsMarkdown("text/markdown"), true);
  assert.equal(requestsMarkdown("text/markdown, text/html;q=0.9"), true);
  assert.equal(requestsMarkdown("text/html, text/markdown;q=0.5"), true);
  assert.equal(requestsMarkdown(BROWSER_ACCEPT), false);
  assert.equal(requestsMarkdown("*/*"), false);
  assert.equal(requestsMarkdown(""), false);
  assert.equal(requestsMarkdown(null), false);
});

test("markdown requests are rewritten to the /md route handlers", async () => {
  const cases: Array<[string, string]> = [
    ["/", "/md/home"],
    ["/university/jamia-millia-islamia", "/md/university/jamia-millia-islamia"],
    ["/university/jamia-millia-islamia-faq", "/md/university/jamia-millia-islamia-faq"],
    ["/countries/georgia", "/md/country/georgia"],
    ["/jmi-btech-computer-engineering", "/md/programme/jmi-btech-computer-engineering"],
  ];
  for (const [path, destination] of cases) {
    const { rewritten } = await rewriteFor(path, "text/markdown");
    assert.equal(rewritten, `https://www.studentstraffic.com${destination}`, path);
  }
});

test("browsers keep the HTML route", async () => {
  for (const path of ["/", "/university/jamia-millia-islamia", "/countries/georgia", "/jmi-btech-computer-engineering"]) {
    const { rewritten } = await rewriteFor(path, BROWSER_ACCEPT);
    assert.equal(rewritten, null, path);
  }
});

test(".md URLs map to the same handlers regardless of Accept", async () => {
  const cases: Array<[string, string]> = [
    ["/index.md", "/md/home"],
    ["/university/jamia-millia-islamia.md", "/md/university/jamia-millia-islamia"],
    ["/countries/georgia.md", "/md/country/georgia"],
    ["/jmi-btech-computer-engineering.md", "/md/programme/jmi-btech-computer-engineering"],
  ];
  for (const [path, destination] of cases) {
    const { rewritten } = await rewriteFor(path);
    assert.equal(rewritten, `https://www.studentstraffic.com${destination}`, path);
  }
});

test("nested and asset paths are never negotiated", async () => {
  for (const path of ["/blog/some-post", "/_next/static/chunk.js", "/icon.png"]) {
    const { rewritten } = await rewriteFor(path, "text/markdown");
    assert.equal(rewritten, null, path);
  }
});

test("programme-style negotiation runs after static routes", () => {
  const { beforeFiles, afterFiles } = getMarkdownRewrites();
  // A beforeFiles /:slug rule would shadow /about, /contact and other static pages.
  assert.ok(!beforeFiles.some((rule) => rule.source === "/:slug([^/.]+)" && rule.has));
  assert.ok(afterFiles.some((rule) => rule.source === "/:slug([^/.]+)" && rule.has));
});

test("the home page HTML advertises agent resources with RFC 8288 links", async () => {
  const { response } = await rewriteFor("/", BROWSER_ACCEPT);
  assert.equal(response.headers.get("link"), HOME_LINK_HEADER);
  assert.match(HOME_LINK_HEADER, /<\/llms\.txt>; rel="describedby"/);
  assert.match(HOME_LINK_HEADER, /<\/\.well-known\/agent-skills\/index\.json>; rel="describedby"/);
  assert.match(HOME_LINK_HEADER, /<\/index\.md>; rel="alternate"; type="text\/markdown"/);
  assert.match(HOME_LINK_HEADER, /<\/\.well-known\/api-catalog>; rel="api-catalog"/);

  const markdown = await rewriteFor("/", "text/markdown");
  assert.equal(markdown.response.headers.get("link"), null);
  const other = await rewriteFor("/about", BROWSER_ACCEPT);
  assert.equal(other.response.headers.get("link"), null);
});

test("the api-catalog link follows the MCP kill switch", () => {
  assert.equal(isMcpServerEnabled(undefined), true);
  assert.equal(isMcpServerEnabled("true"), true);
  assert.equal(isMcpServerEnabled("false"), false);
  assert.equal(isMcpServerEnabled(" FALSE "), false);
  assert.equal(isMcpServerEnabled("0"), false);
  assert.match(getHomeLinkHeader(true), /rel="api-catalog"/);
  assert.doesNotMatch(getHomeLinkHeader(false), /api-catalog/);
  assert.match(getHomeLinkHeader(false), /<\/llms\.txt>; rel="describedby"/);
  assert.equal(getHomeLinkHeaderRule(false).headers[0].value, getHomeLinkHeader(false));
});
