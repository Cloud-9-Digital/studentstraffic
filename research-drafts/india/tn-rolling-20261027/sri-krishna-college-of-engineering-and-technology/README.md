# Sri Krishna College of Engineering and Technology — research handoff

**HOLD — institution year conflict, logo contrast, audience verification**
Checked: 2026-10-27. Research owner: `research_tn_rolling_batch_f`. Integrator: `publish_tamil_nadu_pilot`.

## Useful result first

All 16 current taught programmes are drafted, including 11 undergraduate engineering awards, the five-year integrated M.Tech CSE, M.E. CSE, M.E. Structural, new M.Tech Data Science and MBA. The common 2022 undergraduate regulations explicitly cover integrated entry and English instruction, resolving that earlier drafting gap.

- Current taught inventory: **16**. All inventory/discovery rows: **34**.
- Complete schema-shaped candidate: **16 programmes** in `payload.candidate.json`.
- Actual `catalogPayloadSchema` and `readContentMigrations` offline checks passed; see `payload.*.validation.json`. These results are **not** a reserved migration, ledger `validated` state, publication approval or live application.
- Every university narrative field is filled with institution-specific prose; FAQ count is 10 for PSG/SKCET and 11 for SREC. No medical/MBBS template or unrelated university facts were copied.
- Canonical mappings use the current registry; no shared taxonomy edits. Exact official awards stay on offerings.
- Exact-slug public live API was 404; remote ledger, remote exact-name code search, migrations and original 68 checks were independently clean before integration claims. See `deduplication.json`.

## Publication decision and exact holds

The institution homepage and about page say 1998; engineering AICTE 2026 approval says 1997. The candidate mandatory establishedYear is 1998 only for structural review, with an omit/conflict evidence record: it is not fact-cleared. The official white-wordmark logo fails on a white surface; no favicon or ranking logo is substituted. Foreign approval is positive forEEE, IT and Mechanical only; concrete foreign qualification/selection still needs verification. No and absent columns are not converted to nationality bans.

The undated official fee table has explicit annual rates but no academic-year heading. The URL upload directory does not justify calling these 2025–26 confirmed tuition. The five-year integrated programme has no international/NRI columns in its separate approval table.

The `payload.candidate.json` files are deliberately named candidates because schema success does not resolve these factual holds. Do not blindly move a candidate into a numbered migration. Media upload/rendering and final serial integration remain with the integrator/user; no Cloudinary URL is fabricated.


## Exact input selection

`publication-scope.json` is the integration decision record. `payload.candidate.json` is the full shape/framework research candidate and contains the explicit unresolved audience or institution holds.

**No publication input is recommended yet.** Retain the complete candidate for research handoff; resolve the named factual holds before serial packaging.

Reproduce the actual offline checks from the repository root with `node --import tsx research-drafts/india/tn-rolling-20261027/sri-krishna-college-of-engineering-and-technology/validate-offline.ts`. The checker uses a disposable `/tmp` fixture and deletes it; it does not reserve a content migration or access a database.

## Artifacts

- `programme-inventory.csv` — canonical 15-column full taught inventory plus explicit doctoral, working-professional and legacy discovery holds.
- `programme-inventory.md` — scope, row counts and source decisions.
- `programme-review.json` — per-current-programme pass/hold distinctions.
- `payload.candidate.json` — complete research draft, not unconditional publication input.
- `taxonomy-review.json` — registry mappings and genuine unverified research-award rows.
- `media-manifest.json` — official asset URLs, HTTP/image receipts and visual-review outcomes. Raw `media/` assets remain local and are not committed. No media upload occurred.
- `fee-research.json` — primary/secondary comparison; no whole-course annualisation or invented USD conversion.
- `source-index.json` — public URL/HTTP/hash receipts. Full raw pages, extracted text, PDF/OCR and image files stay local, outside Git delivery.
- `source-binaries.json` — large original PDFs retained under `/tmp/tn-f-source-archive/sri-krishna-college-of-engineering-and-technology/`; they were excluded from this handoff tree, not silently lost. Re-download from original URLs if that temporary archive expires.

## Evidence and limits

The independent recognition is the UGC autonomous-college register for PSG/SKCET and Anna University’s affiliated-college directory for SREC. Institution-hosted AICTE approvals were read separately for current programme identity and the exact quota columns. No NAAC/NBA ranking badge is inferred from institutional marketing or media artwork.

Unknown intake months stay empty, with explicit omit evidence. English comes from read regulations or the explicit international-admissions statement, not from website language. Fee quotes retain native currency, original period, category uncertainty and date scope. Historical fees do not become confirmed 2026–27 annual tuition.

### Access / permission status

No tool approval denial, pending write, uncertain mutation or restricted-database operation occurred. HTTP 503/timeouts and page-content gaps are source availability/factual issues, not permission denials. A failed local SVG renderer was recovered using the installed Sharp renderer; no remote asset was changed. No email, admissions enquiry, database request, media upload, migration reservation, shared queue edit, commit or push was performed.

### Integration authority

The parent confirms the user wants fresh Tamil Nadu universities delivered to GitHub; the user will pull locally and publish. Only the serial integrator owns shared claims, reservations and GitHub delivery. This handoff does not authorize the research agent to publish to the live database.
