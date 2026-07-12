# University & Program Expansion Plan

Standing plan for adding universities/programs to the site. Read alongside
`docs/university-pipeline-architecture.md` (schema + pipeline mechanics — this file is strategy/
sequencing, that file is "how the pipeline works").

## Scope

**Now (Phase 1–2):** MBBS, Medical PG/Residency, BDS, Nursing, Pharmacy, and other medical/allied
health (physiotherapy, medical lab tech, etc.) — matches the `courses` table today (`mbbs`,
`medical-pg`, `bds`, `bsc-nursing`, `pharmacy`).

**Future (Phase 3, scoped but not started):** Engineering, MBA/Business, Law, Hospitality, Agriculture,
Education, and other non-medical fields, worldwide (Vietnam planned as the pilot country). Same
pipeline mechanics, reused once proven — needs new `courses` rows and country/program research
reoriented to those fields.

**2026-07-12 taxonomy update:** the first controlled Engineering and MBA/Business programme names
are defined in [`programme-taxonomy.md`](./programme-taxonomy.md) and the executable registry at
`lib/data/program-taxonomy.ts`. University research must retain each official programme title while
mapping it to an approved canonical slug. The registry is the first expansion scope, not permission
to populate course rows directly; publication still goes through the complete validated workflow.

**2026-07-12 postgraduate expansion:** selected universities must be researched for both UG and PG
programmes. The canonical registry now includes common M.Sc. computing, M.E./M.Tech Engineering,
Engineering Management, non-MBA Business master's and MBA programme groups. Agents must publish
verified master's programmes when an exact mapping exists and hold only genuinely unmatched
specialisations for taxonomy review.

**2026-07-12 global taxonomy expansion:** publication is no longer limited to medicine,
engineering and business. The executable registry now supports the major worldwide families in law,
architecture, arts/humanities, sciences, mathematics, economics/commerce, design, psychology,
allied health, media, environment, agriculture, veterinary science, education, hospitality,
aviation/maritime/logistics, public policy/international relations and information systems, plus
doctoral and professional awards. Research complete portfolios, but continue exact matching and use
the taxonomy-gap register for interdisciplinary or uncommon awards.

The same registry now also covers the existing MBBS, Medical PG, B.Sc. Nursing and Pharmacy scope.
A live-title audit found that the current `medical-pg` offerings are generic university-level
descriptions rather than named programmes, and the `pharmacy` course mixes bachelor and integrated
master awards. Do not reproduce those mappings in new batches: re-research Medical PG by speciality
and split Pharmacy offerings into the approved canonical programmes before expansion.

**2026-07-09 — the template blocker is now cleared (data still not started).** The scalability
refactor made the template capable of non-medical content: `recognition-detail-section.tsx` and
`admissions-section.tsx` are stream-aware (medical streams render the official regulatory sources/NMC/FMGE pathway
unchanged; other streams render honest, data-driven accreditation copy with a generic fallback — no
hardcoded UGC/AICTE/BCI claims). The `CourseStream` union (`lib/data/types.ts`) now includes
`business`, `law`, `hospitality`, `agriculture`, and `education` alongside the existing streams — a
pure TS-union-over-text-column change, **zero DB migration**. The medically-flavored `universities`/
`program_offerings` columns were renamed to stream-neutral names (drizzle `0054`, see
`docs/university-pipeline-architecture.md`). **What remains before data population** is domain
research on what recognition/admissions mean per non-medical field, and running the discovery
pipeline for a non-medical source — see `docs/non-medical-expansion-scope.md`. Do NOT publish any
non-medical university/program/regulatory data until that research is done.

**2026-07-09 update:** the business has confirmed it wants to actively pivot toward a multi-stream,
"one-stop destination for all streams, programs, universities and countries abroad" positioning —
this is no longer just a scoped-but-paused Vietnam pilot idea, it's the stated direction. Brand-level
copy (homepage, about page, site description) has been updated accordingly. This is copy only —
the Phase 3 technical blocker above is unchanged; no non-medical data/universities/programs exist yet
and none should be published until the recognition/admissions template redesign is done. See the
"Update 2026-07-09" section in `docs/non-medical-expansion-scope.md` for full detail.

## Pipeline shape — reduced to 2 agent stages (not 4)

Old shape (expensive): discover agent → 1 research agent *per university* → 1 verify agent *per
university* → manual publish. Roughly `1 + 2N` agent spawns for N universities, each paying fixed
context/tool-loading cost.

**Current shape:**
- **Stage A — Discover+Research (one agent, one batch of ~5–8 universities):** dedupes against the
  DB, researches and drafts the whole batch in one call, applying sourcing rules (multi-source,
  omit-don't-fabricate) as it writes rather than leaving that to a separate step.
- **Stage B — Verify+Publish (one agent, same batch):** adversarially checks each draft (sources,
  audience-specific eligibility restrictions, dedup), then itself runs the publish workflow for everything
  that passes. Holds + logs anything that fails, same as before.

That's ~2 agent spawns per batch of 6 universities instead of ~13.

**Standing authorization (confirmed 2026-07-08):** Stage B may seed+publish a full batch
autonomously — no per-university confirmation needed. Review happens after, via the run report, not
before each publish. If a run looks wrong, publishes are reversible via
`scripts/unpublish-university.ts --slug <slug>`.

**Hard rule (added 2026-07-08 after a real incident):** Stage A/B agents must research **inline,
themselves** — do not spawn nested sub-agents per university. General-purpose agents have Agent-tool
access and, if merely told "research these 6 universities," several independently chose to spawn 1-2
sub-agents per university (sometimes recursively). That recreates the old N-agents-per-university
cost one layer down and defeats the entire point of collapsing to 2 stages. Every batch-agent prompt
must explicitly say: "Do this research yourself within your own context — do not use the Agent tool
to delegate to sub-agents." If a batch is too large for one agent to handle inline, reduce the batch
size instead of letting the agent parallelize via nested spawns.

**Quality tradeoff accepted:** single-pass verification instead of a fully independent second
opinion. Mitigate with periodic spot-audits (re-check ~1 in 10 published universities against
sources) rather than double-verifying everything — cheaper and catches systemic problems without
doubling the cost of every run.

**For program-only additions to already-published universities:** don't run the full 2-stage
university pipeline. Use `scripts/add-program-offerings.mjs` directly (see
`docs/university-pipeline-architecture.md` §1b) — one agent researches program facts for a batch and
writes them straight to a JSON file for that script to insert. No discover/verify-as-separate-agent
needed since the university itself is already vetted; only the program facts need 2+ source
verification (built into the script's validation).

## Country/scope priority queue

1. **Fill existing gaps (in progress / next up):** 6 published universities currently have zero
   published programs (live database audit, 2026-07-11) — cheapest possible win, no new discovery
   needed, uses `add-program-offerings.mjs`.
2. **Fresh discovery pass on Russia** — largest existing footprint (85 universities), likely still
   has undiscovered medical schools.
3. **New high-demand countries not yet covered**, prioritized by actual Indian MBBS-aspirant demand:
   Philippines, Bangladesh, Nepal, Kazakhstan, Armenia, Poland, Bosnia, Serbia, North Macedonia,
   China. Lower priority: expanding further into already-covered expensive Western destinations
   (Canada/Germany/Italy/Lithuania/Malta) beyond what's already live, since conversion is lower for
   this audience there.

## Operating rhythm (confirmed 2026-07-08)

- **Cadence: on-demand, user-triggered.** Not scheduled/autonomous for now — the user wants to stay
  in the loop given today's incidents were only caught because they were actively watching. Revisit
  this once more batches have run cleanly.
- **Risk-proportional auditing:** new-country/new-university discovery batches get a spot-audit every
  time (unfamiliar institutions = more misattribution risk). Gap-filling on already-published
  universities gets audited periodically (~every 3rd batch), not every time — proven reliable on
  2026-07-08 (20/20 clean).
- **Current queue position:** next up is (1) Russian University of Medicine follow-up (small,
  targeted — official page fetch failed, fee figures conflicted, needs direct re-verification),
  then (2) fresh Russia discovery pass, then (3) new countries in the priority order above.
- Update this section's "current queue position" as batches complete, so the next session picks up
  from the right place without re-deriving it.

## Multi-stream pilot queue (selected 2026-07-12)

The first Engineering and MBA vertical slice is **Constructor University, Bremen, Germany**. Germany
already exists; the university does not. The locked scope and initial six programme mappings are in
[`research-scopes/constructor-university-bremen.md`](./research-scopes/constructor-university-bremen.md).

Research and publish this pilot before selecting a second multi-stream university. Its two distinct
MBA formats deliberately test whether multiple offerings can share one canonical course without
overwriting each other.

## Operational notes

- One country (or one "fill gaps" batch) per launch — don't fan out all countries/batches at once;
  this machine's concurrency cap makes that counterproductive (see
  [[project_overnight_global_run]] memory).
- Durable drafts: research agents write findings to `research-drafts/<country>/<slug>.json`
  immediately, not scratchpad — a session end mid-batch shouldn't lose research.
- Keep this file and `docs/university-pipeline-architecture.md` updated when the pipeline shape,
  scope, or priority queue changes.
