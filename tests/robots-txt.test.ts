import assert from "node:assert/strict";
import test from "node:test";

import { absoluteUrl } from "@/lib/metadata";
import { buildRobotsTxt } from "@/lib/robots-txt";

// Production robots.txt before Content Signals (fetched 2026-10-26), with the
// two Content-Signal lines added. Everything else must stay byte-identical.
const EXPECTED = `User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /dashboard
Disallow: /calls/
Disallow: /login
Disallow: /register
Disallow: /llms-full.txt

User-Agent: Googlebot
User-Agent: Bingbot
User-Agent: GoogleOther
User-Agent: Applebot
User-Agent: DuckDuckBot
User-Agent: GPTBot
User-Agent: OAI-SearchBot
User-Agent: ChatGPT-User
User-Agent: ClaudeBot
User-Agent: Claude-SearchBot
User-Agent: Claude-User
User-Agent: anthropic-ai
User-Agent: PerplexityBot
User-Agent: Perplexity-User
User-Agent: Google-Extended
User-Agent: Applebot-Extended
User-Agent: meta-externalagent
User-Agent: Amazonbot
User-Agent: MistralAI-User
User-Agent: DuckAssistBot
User-Agent: CCBot
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /dashboard
Disallow: /calls/
Disallow: /login
Disallow: /register

Sitemap: https://www.studentstraffic.com/sitemap.xml
Sitemap: https://www.studentstraffic.com/universities/sitemap/0.xml
Sitemap: https://www.studentstraffic.com/programs/sitemap/0.xml
Sitemap: https://www.studentstraffic.com/compare/sitemap/0.xml
Sitemap: https://www.studentstraffic.com/news-sitemap.xml
`;

test("robots.txt matches production plus a Content-Signal line per group", () => {
  // Tests run with the local site URL; production uses www.studentstraffic.com.
  const origin = absoluteUrl("/").replace(/\/$/, "");
  const actual = buildRobotsTxt().replaceAll(origin, "https://www.studentstraffic.com");
  assert.equal(actual, EXPECTED);
});

test("Content-Signal follows the User-Agent lines of every group", () => {
  const groups = buildRobotsTxt().split("\n\n").filter((group) => group.startsWith("User-Agent"));
  assert.equal(groups.length, 2);
  for (const group of groups) {
    const lines = group.split("\n");
    const firstOther = lines.findIndex((line) => !line.startsWith("User-Agent:"));
    assert.equal(lines[firstOther], "Content-Signal: search=yes, ai-input=yes, ai-train=yes");
  }
});
