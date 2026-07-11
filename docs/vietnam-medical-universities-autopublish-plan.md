# Medical Universities — Autonomous Research & Auto-Publish Plan (Vietnam → Russia → Georgia)

> **Status:** DRAFTING THE PLAN (no agent has run yet, no production writes yet)
> **Last updated:** 2026-07-07
> Living document. Edit decisions here; once everything is ✅ we turn it into the agent brief and run it.
> **First target:** Vietnam. Then replicate the same agent for **Russia** and **Georgia**.

---

## Goal

Point an autonomous overnight agent at a country (Vietnam first). It discovers **medical/health universities not already on the site**, researches each from **multiple independent sources**, and **auto-publishes** them into the live catalog (`universities` + `program_offerings`) — producing honest, multi-sourced, **structured, SEO/AEO-optimised, India-focused** pages.

---

## Decisions

Legend: ✅ decided · ❓ open (needs your input) · 🔍 to be answered by the investigation pass · 🛠️ pre-run deliverable to build

### 1. Scope
- ✅ **Medical/health first.** Course types to add: **MBBS, Medical PG (residency), Nursing, Pharmacy, and other medicine-related courses.**
- ✅ **FIND NET-NEW UNIVERSITIES ONLY — ignore/skip the existing ones.** Do NOT re-research or enrich the 30 already-published Vietnam universities. Dedupe against them and only add universities not already on the site.
- ✅ **Vietnam = pilot (small net-new set). Real volume = Russia & Georgia.** Build & validate the pipeline on Vietnam's handful of net-new, then run it for Russia and Georgia where many more universities exist.

### 2. Discovery (how it finds universities)
- ✅ **Do NOT use official regulatory sources** — all official regulatory sources universities are already added.
- ✅ Discover from **all other sources**: web search, Vietnam Ministry of Education & Training / Ministry of Health lists, ranking & directory sites, credible aggregators.
- ✅ **Dedupe against the existing `universities` table** so nothing already-present is re-added.
- ✅ **Dedup strictness: CONSERVATIVE — strictly no redundant content.** When unsure whether a discovered university already exists in the DB, skip/flag it rather than risk a duplicate live page. Match across name variants/abbreviations/local-language spellings before adding anything.

### 3. Content & sourcing rules (hard requirements)
- ✅ **Multi-source, never single-source.** No page built from one official website alone — corroborate across multiple independent sources.
- ✅ **Not editorial.** Neutral, sourced, factual register — no first-person / opinion / "our take" voice.
- ✅ **Exhaustive research, then omit — never fabricate.** For any unconfirmed fact, put in **extra effort across many sources** to find it. If after thorough research it still can't be found, **leave it out and publish only what is known.** Do NOT guess, pad, or invent to fill a section.
- ✅ Store a **source bundle** (multiple source URLs per fact) with each draft.

### 4. Content structure / SEO / AEO / India-focus (🛠️ must be designed before running)
The pages must be **structured and length-disciplined**, not walls of text. "There's a section" ≠ "write thousands of words in it."
- 🛠️ **Define a content spec** per university field and per program field: what goes in each section, target length / max length, format (short paras, bullets, fact tiles, FAQ Q&As), so output is consistent and scannable.
- ✅ **SEO + AEO optimised:** structured for search engines AND answer engines (clear headings, concise factual answers, FAQ/Q&A blocks, schema/JSON-LD where the page already supports it).
- ✅ **Completely optimised for the Indian audience.** Frame everything for Indian medical aspirants, e.g.:
  - **NMC (National Medical Commission) recognition** status and what it means for practising in India.
  - **NEET eligibility** requirement, and **FMGE / NExT** licensing-exam relevance for Indian graduates.
  - **Fees in an INR-aware context** (not just local currency), total cost of study.
  - India-relevant living info (Indian food availability, hostel, community, safety) where corroborated.
  - Honest comparison framing vs studying in India, without overselling.
- 🛠️ Confirm what the existing `universities` / `program_offerings` schema fields are, and map the content spec onto them (don't invent new sections the page can't render).

### 5. Publish mode
- ✅ **Auto-publish everything** (user-authorized).
- ✅ **Hard-fail floor kept:** if identity can't be established or **no real program** is found → stays a **draft**, not published. Everything above the floor publishes automatically.

### 6a. Failure handling & end-of-run report (employee-style)
- ✅ **Content goes live by default** (auto-publish).
- ✅ **Never lose work on failure.** If the agent can't push a university live (DB write error, publish-gate hold, network/API failure, etc.), it must **keep that work locally** — persist the fully-researched draft (structured facts + generated content + source bundle) to a **local file** (and/or leave it in the `university_research_drafts` table as an un-published draft) so nothing researched is thrown away. The end report says exactly where each held-local item is saved.
- ✅ **End-of-run report document (like an employee shift report).** At the end, the agent writes a Markdown report covering:
  - Run metadata: country, start time, end time, **total duration**, model(s) used.
  - Discovery: how many universities found, from which sources; how many were **new** vs **skipped as duplicates** (conservative dedup).
  - **Per-university outcome table:** name → status (`published` / `held-local` / `skipped-duplicate` / `failed`), time spent researching, number of sources used, notable fields that couldn't be found (omitted, not fabricated).
  - **Verifiable links per university (REQUIRED):** the **live published page URL** (e.g. `/university/<slug>`) so it can be opened and checked, AND the **full list of source URLs** used to research it (the source bundle), so every published fact can be traced back to its sources. For held-local/failed items, include the source links plus the local draft file path. The whole point is the report is one-click verifiable — no claim without a link behind it.
  - Totals: **X published live**, Y held-local (with reason + local file path each), Z skipped-duplicate, plus **how many programs** added.
  - Failures/blocked: each with the error and the local-copy location.
  - Follow-ups needing human attention.
- ✅ Report saved to a predictable path (e.g. `docs/run-reports/vietnam-medical-<date>.md`) so it's easy to review each morning; reused format for Russia & Georgia runs.

### 6. Execution / environment
- ✅ **Local long-running background agent** — user's PC stays on all night (won't sleep). Remote/cloud not required.
- ✅ Writes to **production DB** (Neon) + publishes to the **live public site**. Authorized. **Reversible** (unpublish via `published` flag; queue status tracked).

### 7. Model choice (Sonnet vs Opus)
- ❓ **Awaiting your call** — my recommendation below (see "Model recommendation" section).

---

## Model recommendation

**Recommendation: hybrid, weighted to Opus — because this is auto-published live with no human review.**

- **Opus for the judgment/writing-heavy stages** — multi-source synthesis, resolving conflicting facts, deciding what's corroborated vs must-be-omitted, the publish-gate decision, and the actual SEO/AEO + India-optimised writing. When content goes live unreviewed, a wrong fee or a thin/duplicate page costs far more than the token difference; model quality pays for itself exactly here.
- **Sonnet for the cheap mechanical stages** — fetching pages, HTML→text extraction, routine parsing, dedup string-matching. No deep judgment needed; Sonnet is faster/cheaper and fine.
- **If you want one model for simplicity:** pick **Opus**, given auto-publish + India-specific accuracy (NMC/NEET/FMGE) matters and there's no human safety net.

*(Per-agent model override is supported, so hybrid is straightforward to wire.)*

---

## Open items to resolve before running

| # | Item | Status |
|---|------|--------|
| A | Dedup strictness | ✅ Conservative — strictly no redundant content |
| B | Course/scope breadth | ✅ MBBS, Medical PG, Nursing, Pharmacy, + medicine-related |
| C | Overnight vehicle | ✅ local (PC stays on) |
| D | Model | ✅ (working default) Opus for the research/writing agent(s); deterministic scripts for plumbing (fetch/dedup-check/publish). Add Sonnet offload only if investigation finds a large dumb-parsing workload. Changeable. |
| E | Content-structure spec (🛠️ deliverable) | ⏳ to design before run (feeds off investigation item 7) |

---

## 8. Additional safeguards & gaps (found in review — before running)

### Safety / quality (high priority — this is auto-publish with no per-page human review)
- ✅ **F. Pilot batch first — 1–2 universities.** Publish 1–2, you eyeball the live pages, THEN the full run. Staged auto-publish so we catch systemic quality/format problems before multiplying them.
- ✅ **G. Pre-publish verification (QA) pass — IMPLEMENT.** Before any page goes live, an **independent automated LLM verifier agent** (separate instance/prompt from the researcher-writer — NOT the same agent grading its own work; Opus, since it's the accuracy gate with no human) takes the drafted facts + the source bundle and confirms **each material claim is actually supported by a cited source** — with extra scrutiny on **recognition (NMC/WHO), fees, program duration/medium**. Anything unsupported → **hold as draft / omit**, never publish. This is distinct from the existing publish gate, which only checks structural completeness (fields filled, ≥2 sources, no placeholder text) — it does NOT check factual accuracy. G adds the factual layer.
  - **Who does it:** fully automated — the verifier is another agent, not a person. The only *human* review is (a) the F pilot pages and (b) the morning end-of-run report. So the accuracy chain is: researcher-writer (Opus) → independent verifier (Opus) → deterministic publish gate → live.
- ✅ **H. Recognition claims held to a higher bar.** NMC / WHO / directory recognition is the highest-liability claim for Indian medical aspirants — a wrong "NMC-recognised" is serious. These specifically require strong multi-source corroboration; if not clearly corroborated, state status as unclear / omit, never assert.
- ✅ **I. No duplicate/templated content (SEO).** Every page must be genuinely unique prose, not the same boilerplate reworded per university — Google penalises templated/thin content. Content spec (item E) must enforce real per-university substance.
- ✅ **J. No plagiarism / copyright.** Synthesise and rewrite facts in our own words with citations; never copy-paste source text. **University logos / cover images:** do NOT hotlink or scrape copyrighted images — leave image fields blank (or use an existing safe placeholder) unless a properly licensed image is available. (We already hit external-image issues on country heroes.)

### Mechanics (mostly bake-in; one needs investigation)
- 🔍 **K. Program → course mapping.** Every `program_offering` needs a valid `courseId`. If courses for "Medical PG / residency", "Nursing", "Pharmacy" etc. don't already exist, decide create-vs-skip per course. (Investigation item 5 lists existing courses.)
- ✅ **L. Correct `countryId` + clean slugs.** Vietnam's country id must be right; slugs generated safely with no collisions (part of dedup).
- ✅ **M. Budget / stop cap + resumability.** Cap total spend for the run; make it **resumable** — if it crashes at 3am it continues without re-publishing or duplicating (lean on queue status). Sequential (not heavily parallel) to respect web-search / model rate limits.
- ✅ **N. Internal linking (SEO).** New university pages should link to their country page and related guides/programs (repo already has related-content linking infra) — not orphan pages.
- 🔍 **O. Sitemap / indexing.** Confirm newly-published DB-driven pages automatically enter the sitemap so they get indexed.

---

## ⚠️ INVESTIGATION FINDINGS (2026-07-07) — plan premise shifts

Two headline findings from the read-only investigation:

### Finding 1 — The "research runner" is a STUB. We have to BUILD the AI brain.
- `scripts/run-university-research.ts` does **no web research and calls no LLM** — it just reshapes existing official regulatory sources data into **placeholder text** ("Pending official-source research… do not publish"). Those placeholders are exactly what the publish gate rejects, so it can never feed live pages.
- **`scripts/publish-university-draft.ts` is real and production-grade** — strict publish gate (already our hard-fail floor: needs official site, ≥2 sources, 8 filled prose fields free of placeholder markers, ≥3 items in each list, ≥3 FAQs, ≥1 valid program), idempotent upsert, sets `published=true`, triggers search-index + revalidation. **Reusable as-is.**
- **So this is a BUILD project, not a "run a script overnight" job.** The plumbing to publish exists; the *intelligence* (discover + multi-source research + write) must be built. That build is what gets reused for Russia & Georgia.

### Finding 2 — Vietnam is already ~done. Net-new is a handful, not hundreds.
- **30 Vietnam medical universities are already published** and all 29 official regulatory sources Vietnam entries are already ingested. This is already a near-complete set of Vietnam's accredited medical schools.
- **Net-new discoverable universities are likely ~0–10** (newer private faculties, or nursing/pharmacy-only schools not in official regulatory sources). An overnight "find all Vietnam medical universities" run would surface **very little**.
- Implication: the big *volume* is **Russia & Georgia**, not Vietnam. And a separate, possibly higher-value Vietnam opportunity is **enriching the existing 30 pages** to the new multi-source / India-optimised / SEO-AEO standard (they were seeded from official regulatory sources and may be thin).

### Build list — must be done before ANY autonomous run
1. 🛠️ **New research stage** (LLM + web search/fetch) that emits real, gate-passing `structured_facts` + `draft_content` + `source_bundle` (≥2 sources). Replaces the stub. **No LLM SDK / search API is in the repo today** — this needs wiring (model API + a web-search/fetch capability).
2. 🛠️ **Non-official regulatory sources queue seeding.** Schema blocker: `official-directory_school_id` is `NOT NULL + UNIQUE` on both `university_research_queue` and `university_research_drafts`, and the stub inner-joins to official regulatory sources. Options: surrogate ids (e.g. `disc-vietnam-<slug>`, zero schema change) OR a migration adding a nullable `origin` column. → build a new non-official regulatory sources seeder.
3. 🛠️ **Dedup glue for STRICT no-duplicates.** The retired directory matcher is no longer part of the pipeline. New discovery importers must deduplicate against existing university pages using generic `{name, city}` matching plus an ambiguity hold; do not publish uncertain matches.
4. 🛠️ **Add a `pharmacy` course row.** Existing medical courses: `mbbs`(13), `medical-pg`(14), `bsc-nursing`(15), `bds`(17). **No `pharmacy` course exists** and the publisher throws on an unknown course slug — insert it before running. Also: every non-MBBS program must carry an explicit `courseSlug` (publisher only auto-detects mbbs).
5. 🛠️ **Unpublish escape hatch** (`scripts/unpublish-university.ts`) — none exists today; needed to reverse a bad batch (flip `published=false` + reset queue row + revalidate).
6. ✅ **Fee policy: OMIT / "not verified" — never show a fake `0`.** If a fee can't be corroborated across sources, don't display a number; render "fee not verified — contact for latest". Requires adjusting how content is generated so the publisher's `0`-default fee never surfaces as a real figure on the page.

### Cost / feasibility
- Per net-new university ≈ **~10–20 LLM turns + ~10–20 web fetches** (Opus). A full Vietnam net-new batch ≈ **tens of LLM calls, not thousands** — trivially overnight-feasible. Russia/Georgia will be larger but same order.
- Main throttle = web-search/fetch rate limits + weak-English official sources (corroboration failures → honest omit/hold, lowering yield but keeping accuracy).

---

## Investigation pass (read-only, no prod writes) — ✅ COMPLETE (answers folded into findings above)

1. 🔍 What does `scripts/run-university-research.ts` actually do — self-contained/autonomous, or a scaffold needing per-item driving? Does it call an LLM / web search? What env/API keys does it need (search, model API, `DATABASE_URL`)?
2. 🔍 How does `scripts/publish-university-draft.ts` map draft → `universities` + `program_offerings`? Writes to production? Idempotent?
3. 🔍 How is the research **queue** seeded, and how do we seed a Vietnam queue from *non-official regulatory sources* discovery?
4. 🔍 How does dedup against existing universities work / need to be added?
5. 🔍 Can it loop autonomously (research → publish → next) unattended? Rough token/time estimate for the batch.
6. 🔍 Does the current draft-generation prompt already satisfy multi-source + non-editorial + exhaustive-then-omit + SEO/AEO + India-focus + length-discipline? If not, what needs changing?
7. 🔍 Exact `universities` / `program_offerings` field list, to build the content spec (item E) against real fields.

---

## Run procedure (finalized after investigation)

### TODAY'S EXECUTION SEQUENCE (Vietnam net-new)

Approach: research is orchestrated via **agents with web search/fetch** (the repo has no LLM/search SDK wired in, and net-new is small — building a standalone autonomous script system isn't worth it today). Results feed the **existing production publisher**. Reusable scripts get built for tomorrow's Russia/Georgia.

- **Step 1 — Discovery (read-only web).** ✅ DONE. **7 high-confidence net-new** (mostly pharmacy/nursing/health-tech/public-health — the accredited-MD set is exhausted by the existing 30), + 2 to review:
  1. Hanoi University of Pharmacy (Hanoi) — Pharmacy [official site: hup.edu.vn vs hanoipharma.edu.vn — reconcile]
  2. Nam Dinh University of Nursing (Nam Dinh) — Nursing
  3. Hai Duong Medical Technical University (Hai Duong/Hai Phong?) — Nursing/health-tech + doctors
  4. Hanoi University of Public Health (Hanoi) — Public Health
  5. Yersin University (Da Lat) — Medicine, Pharmacy, Nursing
  6. Van Lang University (HCMC) — General Medicine, Pharmacy, Nursing, Dentistry
  7. Tay Do University (Can Tho) — Pharmacy, Nursing [verify official site]
  Review: Hong Duc University (Thanh Hoa — confirm degree-level); Bac Giang (likely a college — exclude).
- **Step 1b — Foundations (safe/additive code).** ✅ DONE. `scripts/unpublish-university.ts` (escape hatch), `pharmacy` course inserted (**id=18**), `scripts/seed-nonofficial-directory-draft.ts` (surrogate `official-directory_school_id = disc-<country>-<slug>`, status `draft_ready`). Pipeline order: `seed-nonofficial-directory-draft.ts --file X.json` → `publish-university-draft.ts --queue-id N` → (`unpublish-university.ts --slug S` to reverse).
- **NOTE on fetch:** WebFetch works from the MAIN thread but was BLOCKED for the discovery SUBAGENT (permission prompts can't be answered in subagents). → Research is driven from the main thread / with confirmed fetch, not blindly delegated to subagents that may be fetch-blocked.
- **Step 2 — Research (Opus, per net-new university).** Multi-source, exhaustive-then-omit, non-editorial, India-optimised, structured per the field spec → gate-passing `structured_facts` + `draft_content` + `source_bundle` (≥2 sources). Fees OMIT when unsourced (never `0`).
- **Step 3 — Verify (independent Opus verifier, G).** Confirm each material claim (esp. NMC/WHO recognition, fees, program details) is source-backed; hold unsupported → draft.
- **Step 4 — PILOT publish 1–2 (F) → PAUSE for user review.** ✅ PUBLISHED & verified. Both PASSED independent verification, then published live:
  - Van Lang University → `/university/van-lang-university` (queue-id 68, 4 programs) — rich.
  - Hanoi University of Pharmacy → `/university/hanoi-university-of-pharmacy` (queue-id 69, 1 program) — leaner, honest caveats.
  - ⏸️ AWAITING USER REVIEW of the two live pages before publishing the remaining 5 net-new.
  - **Invocation note for future runs:** the publisher must be run as `NODE_OPTIONS="--conditions=react-server" npx tsx scripts/publish-university-draft.ts --queue-id N` (it transitively imports `server-only`; the flag resolves it to a no-op). The seeder runs with plain `npx tsx`. `.env`/`.env.local` supply `DATABASE_URL`. Typesense + revalidate auto-skip locally (non-fatal).
  - Remaining net-new (5): Nam Dinh Univ of Nursing, Hai Duong Medical Technical Univ, Hanoi Univ of Public Health, Yersin Univ, Tay Do Univ. Plus review: Hong Duc (confirm degree-level), Bac Giang (exclude — likely a college).
- **Step 5 — After user OK: publish the rest.** On any push failure → keep draft local + record.
- **Step 6 — End-of-run report** (`docs/run-reports/vietnam-medical-<date>.md`) with per-university outcomes, durations, totals, and **verifiable links** (live page URL + all source URLs).
- Then parameterize Steps 1–6 for **Russia & Georgia** (tomorrow).

---

## 🌙 OVERNIGHT GLOBAL RUN (launched 2026-07-07)

User authorized a continuous overnight autonomous run across **ALL codebase countries** (aim: add all medical/health universities worldwide). Launched as a background **Workflow** (Run ID `wf_1625606e-63b`).

Pipeline per run: query DB (countries + existing universities) → per-country **discovery** (net-new only, conservative dedupe) → **pipeline** each net-new university: research (Opus, curl+WebSearch) → independent **verify** (Opus) → **publish** (seed + publish scripts) → **end-of-run report** at `docs/run-reports/global-medical-2026-07-07.md` with verifiable links.
- Countries processed MBBS-priority first (russia, georgia, kyrgyzstan, uzbekistan, kazakhstan, china, philippines, nepal, bangladesh, ukraine, vietnam remaining, germany, then rest).
- Capped at 220 universities/run (deferred count logged, not dropped) — I relaunch for any deferred/remaining after completion to keep going overnight.
- Safeguards enforced in every agent prompt: multi-source, non-editorial, exhaustive-then-omit (never fabricate), fees omit if unsourced, recognition only if corroborated w/ correct regulator, conservative dedup, held-local on failure. Reversible via `unpublish-university.ts`.

## Notes / changelog
- 2026-07-07: Plan drafted. Confirmed: skip official regulatory sources, medical/health scope (MBBS + PG/residency + Nursing + Pharmacy + more), auto-publish w/ hard-fail floor, multi-source + non-editorial rules, **exhaustive-then-omit (never fabricate)**, **structured + SEO/AEO + India-optimised content (spec to be designed)**, local run (PC stays on), replicate for **Russia + Georgia** after Vietnam. Open: dedup strictness (A), model choice (D, rec hybrid/Opus), content-structure spec (E).
