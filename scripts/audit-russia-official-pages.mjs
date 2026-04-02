import fs from "node:fs/promises";
import path from "node:path";

import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

const OUTPUT_PATH = path.join(
  process.cwd(),
  "lib",
  "data",
  "russia-official-page-audit.json",
);

function extractTitle(html) {
  return (
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() ??
    ""
  );
}

function extractSnippet(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
}

function classifyPage({ status, title, snippet }) {
  if (status >= 400) {
    return "broken";
  }

  const combined = `${title} ${snippet}`.toLowerCase();

  if (
    combined.includes("page not found") ||
    combined.includes("404") ||
    combined.includes("article not found")
  ) {
    return "broken";
  }

  if (
    combined.includes("casino") ||
    combined.includes("игровые автоматы") ||
    combined.includes("бет") ||
    combined.includes("ставк")
  ) {
    return "suspicious";
  }

  return "ok";
}

async function fetchAudit(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; StudentsTrafficAudit/1.0)",
      accept: "text/html,application/xhtml+xml",
    },
    signal: controller.signal,
  });

  try {
    const html = await response.text();
    const title = extractTitle(html);
    const snippet = extractSnippet(html);

    return {
      status: response.status,
      finalUrl: response.url,
      title,
      snippet,
      classification: classifyPage({
        status: response.status,
        title,
        snippet,
      }),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing.");
  }

  const sql = neon(process.env.DATABASE_URL);
  const universities = await sql`
    select
      u.slug,
      u.name,
      u.official_website,
      p.official_program_url
    from universities u
    join countries c on c.id = u.country_id
    left join lateral (
      select official_program_url
      from program_offerings p
      where p.university_id = u.id and p.published = true
      order by p.updated_at desc nulls last, p.id desc
      limit 1
    ) p on true
    where c.slug = 'russia' and u.published = true
    order by u.slug asc
  `;

  const checkedAt = new Date().toISOString().slice(0, 10);
  async function auditUniversity(university) {
    if (!university.official_program_url) {
      return {
        slug: university.slug,
        name: university.name,
        checkedAt,
        officialWebsite: university.official_website,
        officialProgramUrl: null,
        classification: "missing",
        status: null,
        finalUrl: null,
        title: "",
        snippet: "",
      };
    }

    try {
      const audit = await fetchAudit(university.official_program_url);
      return {
        slug: university.slug,
        name: university.name,
        checkedAt,
        officialWebsite: university.official_website,
        officialProgramUrl: university.official_program_url,
        ...audit,
      };
    } catch (error) {
      return {
        slug: university.slug,
        name: university.name,
        checkedAt,
        officialWebsite: university.official_website,
        officialProgramUrl: university.official_program_url,
        classification: "error",
        status: null,
        finalUrl: null,
        title: "",
        snippet: String(error),
      };
    }
  }

  const concurrency = 8;
  const results = [];

  for (let index = 0; index < universities.length; index += concurrency) {
    const chunk = universities.slice(index, index + concurrency);
    const chunkResults = await Promise.all(chunk.map(auditUniversity));
    results.push(...chunkResults);
  }

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(results, null, 2)}\n`, "utf8");
  console.log(`Wrote ${results.length} Russia official-page audits to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
