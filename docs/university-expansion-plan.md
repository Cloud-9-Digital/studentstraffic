# University & Program Expansion Plan

Standing plan for adding universities/programs to the site. Read alongside
`docs/university-pipeline-architecture.md` (schema + pipeline mechanics — this file is strategy/
sequencing, that file is "how the pipeline works").

## Scope

**Current:** all approved catalogue streams may be published worldwide: Medicine, Medical
PG/Residency, Dentistry, Nursing, Pharmacy, Engineering, Business/MBA, Law, Architecture,
Arts, Sciences and the other families in `programme-taxonomy.md`. Every record must still use
the complete validated publishing workflow, primary sources and an exact taxonomy match.

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
  omit-don't-fabricate) as it writes rather than leaving that to a separate step. For each new
  university this stage now starts with the programme inventory required by
  `docs/content-seeding-runbook.md` §1b (`research/<country>-programme-inventory/<slug>.csv` + `.md`)
  and packages full coverage of every `open_to_international` programme, not a representative sample,
  resolving taxonomy `GAP:` rows before handing off to Stage B.
- **Stage B — Verify+Publish (one agent, same batch):** adversarially checks each draft (sources,
  audience-specific eligibility restrictions, dedup, programme-inventory coverage and resolved
  taxonomy gaps, and logo/cover media present and legible), then itself runs the publish workflow —
  content and media applied in the same session — for everything that passes. Holds + logs anything
  that fails, same as before.

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

**For program-only additions to already-published universities:** don't run the full discovery
pipeline, and the programme-inventory-first stage (§1b in the runbook) does not apply — it is scoped
to net-new university additions. One agent researches the programme facts, packages them in a
numbered content migration and stops at `validated`. The controlled integrator applies the
migration; the historical direct `add-program-offerings.mjs` path is not permitted from a research
session.

## Content-migration operating model (2026-07-19)

The two agent stages above remain the research and verification stages, but direct database publishing
is superseded by a third, user-triggered publication stage:

1. **Discover + research:** create source-backed local payloads without `DATABASE_URL` access.
2. **Verify + package:** create one immutable directory under `content-migrations/NNNN-scope/` for
   the reviewed batch; holds remain local and are logged as before.
3. **Controlled publish:** the user runs `npm run content:migrate -- --apply` in a deliberate
   publication window. The runner applies every pending reviewed bundle and records its ID/checksum
   in the target environment's `content_migrations` ledger.

Stage B may prepare a full reviewed batch autonomously, but may not connect to or publish to the
database. Corrections use a new numbered migration; use `scripts/unpublish-university.ts --slug
<slug>` only when unpublishing is the intended remedy. This replaces earlier standing authorization
for agents to publish direct to the database.

### Mixed Codex/Claude execution (2026-07-25)

Codex and Claude may research separate 3-6 university batches concurrently in the same workspace.
They share `research/university-publishing-ledger.csv`, but all ownership transitions go through the
locked `queue:*` commands. Each agent edits only its assigned payload files, performs its own
source-backed research without nested agents and stops at `validated`.

Reserve final migration numbers through `content:reserve`; never infer the next number manually.
Deterministic offline validation replaces a routine second-model review. Cross-audit approximately
one in ten universities and every unfamiliar new-country batch. One user-controlled integrator runs
the pending migrations together so research does not keep Neon awake.

For programme-only additions to already-published universities, skip net-new discovery but still
research, validate and package the entries as a content migration. Do not run
`add-program-offerings.mjs` directly from a research session. If the user does run the legacy
importer (via `npx tsx`), every entry must carry a verified `medium` (no `Not confirmed` / `TBC` /
`Unknown` / `N/A` placeholders) and a non-empty `instructionLanguages` array from
`lib/catalogue-facets.ts`; otherwise the whole file is rejected before any write. The same rules
apply to `publish-university-draft.ts`. Canonical content migrations additionally support unknown
language through explicit omission evidence (see `docs/university-pipeline-architecture.md`).

## Country/scope priority queue

**Latest checkpoint — 25 October 2026, group24:** migrations through0295 are applied. The resumed Tamil Nadu work has added83institution profiles and2,380programmes; counts include college profiles and exclude pre-resume baselines. Count applied payload checkpoints, not temporarilyvalidated forward ledger rows. Group24 added78programmes across DSIRT19, PKDas2, KVELL3, Annamalai7 and Presidency47, while SKU44identity was updated with stableURLs. Six mediauploads and1,232batched evidence rows succeeded; publicationpoolsclosed. The68-row primaryscope now has63published,4held and1researching exactcanonicalmatches, no unmatched names; see research/tamil-nadu-scope-reconciliation-20261025.csv foraliases/holds. Currentcomplete nextgroup0296–98: Madras80(78new), Sathyabama23(22new), SIMATS26(22new). Bharathidasan, VIT andBIHERcurrentcore rescues continueoffline. Earlier next-assignment notes below arehistorical.

Unknown teaching language and intake dates no longer hold otherwise verified current programmes: publish empty controlled arrays with explicit omission evidence, keep them out of those filters, and retain exact identity, qualification, duration and applicable professional-approval gates. Continue source research offline; reserve only complete bundles and apply reviewed groups in short database windows.

**2026-10-24 user-directed Tamil Nadu continuation:** resume the existing shared-ledger work before
claiming more institutions. The reviewed publication batch covers Kongu Engineering College, Periyar
Maniammai Institute of Science & Technology, Bharathiar University, Bharathidasan University,
Panimalar Engineering College and Shiv Nadar University Chennai (including the verified SSN
new-entry transition). These institutions' supported offerings have been published; remaining
programme-level holds stay in their inventories.
Preserve programme-level evidence holds and distinguish historical intake baselines from future
application windows. Saveetha SIMATS and Sathyabama remain follow-up candidates with explicit
source gaps. VISTAS, BIHER and Madurai Kamaraj University retain precise evidence holds; the inherited
Vel Tech draft is held for identity, inventory and payload reconstruction.
Use the batch run report for applied migration IDs and live verification, rather than treating a
claim, reservation or delegated assignment as publication. Independent sources may provide
discovery and corroboration alongside primary evidence; credibility and claim scope determine use.

**2026-10-25 grouped continuation:** Alagappa University (verified MBA Logistics), Tamil Nadu
National Law University (hybrid Fisheries Law and Policy diploma) and Rajalakshmi Engineering
College (verified domestic undergraduate portfolio and MBA) were applied together as migrations
0194–0196, with official logo/cover media in the same window. Other programme and applicant-route
holds remain in their inventories. Keep the three offline research slots active as workers finish;
Vel Tech (34 offerings), Hindustan Institute of Technology and Science (38) and Periyar University
Salem (4) were published together as migrations 0197–0199. Tamil Nadu Dr Ambedkar Law University
retains documented programme-level holds. The next completed group comprises Annamalai University (8 offerings), AMET Chennai (28), Tamil Nadu
Dr. J. Jayalalithaa Fisheries University (20) and B.S. Abdur Rahman Crescent Institute (54), migrations
0200–0203, applied together with scoped search and cache refresh. The next group published Indian Maritime University (24 offerings), Tamil Nadu
Physical Education and Sports University (5), and IIITDM Kancheepuram (18), migrations 0204–0206, with six reviewed media assets.
The three current offline assignments are Sri Sairam Engineering College, St Peter’s Institute of
Higher Education and Research, and Chennai Mathematical Institute. Collect validated bundles for a
deliberate grouped apply; do not poll or connect to the database during research.

**2026-07-20 Vietnam Medicine quality pass:** the first gold-standard correction bundle covers Dai
Nam University, Dong A University, Buon Ma Thuot Medical University and Can Tho University of
Medicine and Pharmacy. The full 30-slug inventory and the release/hold rules are recorded in
[`vietnam-medicine-gold-standard.md`](./vietnam-medicine-gold-standard.md).
Complete the priority-2 international-route review before adding new Vietnam universities. Existing
local Medicine records are not international English MBBS inventory until current eligibility,
language, intake and fee evidence establishes that route.

**Prominence-first rule (2026-07-12):** for general catalogue expansion, prioritise widely searched,
internationally recognised universities that attract substantial cross-border student interest.
Balance institutional prominence, international programme breadth and likely student search intent;
do not exhaust a country through small regional institutions before covering its major universities.
This is a sequencing rule, not permission to make unsourced ranking claims in public copy. Continue
to publish only verified facts, complete postgraduate coverage and exact taxonomy matches.

**Market balance (2026-07-12):** prioritise the USA, UK and Canada as core high-demand study-abroad
markets. Where a country foundation is absent, publish one complete authoritative country record with
the first major university before expanding further institutions in that country. Continue Germany,
Italy and other destinations, but do not let repeated same-country batches crowd out the core markets.

1. **Fill existing gaps (in progress / next up):** 6 published universities currently have zero
   published programs (live database audit, 2026-07-11) — cheapest possible win, no new discovery
   needed; package as a content migration (the legacy `add-program-offerings.mjs` now requires
   `medium` + `instructionLanguages` on every entry and is deprecated).
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
- **Current queue position:** (1) apply or review the packaged four-university Vietnam Medicine
  correction; (2) research the Vietnam priority-2 international-route list in two small batches;
  (3) resume the Russian University of Medicine fee-conflict follow-up and Russia discovery pass;
  then (4) continue new countries in the priority order above.
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

**Published Tamil Nadu group (25 October 2026):** migrations 0207–0210 contain Sri Sairam
Engineering College (15 offerings), Chennai Mathematical Institute (6), SPIHER Avadi (27), and
SIMATS occupational therapy (4). Their complete inventories retain programme and applicant-route
holds. SVCE, Sathyabama and IIT Madras are the current offline research assignments. Keep new
unreviewed payloads outside the executable migration sequence during a controlled grouped apply.

**Published grouped continuation:** SVCE Pennalur (11 verified undergraduate offerings,0211), CMI/SIMATS
canonical city-facet correction (0212, existing10offerings preserved), and Sathyabama Marine Biology
(1 programme,0213). Next offline research: Madras Christian College, IIT Madras and VISTAS.

**Reviewed next bundle:** Loyola College Chennai (0214),45regular degree/shift offerings.
Four vocational awards were added through the closed same-course-set Kaushal crosswalk alongside
41named dated-medium routes;8other current degree/shift routes remain held. Collect the next
reviewed bundles for a grouped publication window while agents research offline.

**Published grouped window (0214–0216):** Loyola College Chennai45, IIT Madras74 and Madras Christian College25 offerings (144 total) are published with all six reviewed media assets assigned. VISTAS, NIT Tiruchirappalli and Presidency College continue offline; no unreviewed payload enters the executable sequence during the apply.

**Published group8 (0217–0219):** Presidency College Chennai2 restricted hearing-impaired routes, NIT Tiruchirappalli46 and PSG College of Arts & Science79 (127 total) are published with all six reviewed media assets assigned. VISTAS campus reconciliation, TNAU and PSG College of Technology continue offline outside the executable migration sequence during this window.

**Published group 25 (0296–0298, 25 October 2026):** University of Madras now has 80 offerings, Sathyabama 23 and SIMATS 26, adding 122 programmes. Resumed publication through 0298 totals 83 new institution profiles (including colleges) and 2,502 additional programmes, counted from applied payload snapshots rather than transient queue statuses. Source-backed native fee labels and reviewed media are published together; research remains offline between grouped publication windows. Bharathidasan, VIT and BIHER are the next bounded portfolio expansions.

**Published group 26 with immediate correction (0299–0302):** Bharathidasan now has 47 offerings, VIT 32 and BIHER 49 exact constituent medical awards. Live-profile reconciliation caught and corrected three Orthopaedics/Paediatrics slug collisions through immutable-safe 0302; offline validation now rejects such duplicates. Resumed applied publication totals 84 institution profiles and 2,619 unique programme additions. The primary 68-university scope is 64 published and four held for actual evidence conflicts. Amrita, Sri Ramachandra and SRM portfolio expansion continues offline; unknown language/intake alone does not hold an otherwise verified award.

**Published group 27 (0303–0305):** Amrita46, SRM73 and Sri Ramachandra98 offerings add 197 verified programmes, reaching 84 new institution profiles and 2,816 unique additional programmes in the resumed applied run. Existing campus/audience restrictions stay exact; unsupported inherited language claims are omitted, and six Sri Ramachandra full-course USD prices replace derived annual averages. Public profile counts/known fee labels and two replacement official covers are verified. Next bounded rescue group: Chettinad, Pachaiyappa’s College and Shiv Nadar University Chennai; Annamalai own-department research continues offline.

**Published group 28 (0306–0308):** Chettinad34, Pachaiyappa’s College24 and Shiv Nadar University Chennai26 offerings add 53 programmes. Applied resumed publication now totals 84 institution profiles and 2,869 unique programme additions. The original records remain unchanged; exact native tuition waivers, limited fee categories and prior-cohort indicative prices retain their scope. Annamalai, TANUVAS and Tamil Nadu Physical Education and Sports University continue bounded offline portfolio rescues.

**Published group 29 (0309,0311–0316):** Seven reviewed bundles add 144 programmes and two profiles. Resumed applied totals are 86 institution profiles and 3,013 unique programme additions, based on explicit applied receipts; reserved0310 is excluded. Sai University45, TNPESU12, TANUVAS13, Annamalai73, MCC54, TNNLU2 and TNTEU1 retain exact campus, qualifications and native fee scope. The primary68-university scope is66 published and2 held. Karpagam, Ethiraj and PMIST full forwards are prepared offline for the next grouped window.

**Published group30 (0317–0319):** Karpagam33, PMIST57 and Ethiraj39 add79 programme offerings. Resumed applied totals are86 institution profiles and3,092 unique programme additions. All50 baseline programme objects/media are preserved;75 new native fee quotes retain semester or indicative first-year basis internally. Public checks passed all3 exact API counts,101 known fee labels and9 HTTP/H1 pages. No schema, UI or taxonomy change.
