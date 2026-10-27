# Government College of Technology, Coimbatore — research handoff

**Result:** 10 supported full-time undergraduate offerings pass the actual catalogue schema and isolated migration reader. No database, media upload, remote publication, commit or shared-ledger mutation was performed by this researcher. This is **not** a numbered migration or a claim of complete publication readiness.

Canonical slug: `government-college-of-technology-coimbatore`
Official domain: `gct.ac.in`
Batch: second ten-institution Tamil Nadu rolling batch; GCT is its tenth member.
Reviewed: 27 October 2026. Integrator: `publish_tamil_nadu_pilot`.

## Deliverables

| Artifact | Meaning |
|---|---|
| `payload.draft.json` | Actual schema-shaped draft: one institution, 10 UG offerings, 10 existing canonical categories, 138 evidence records, 12 FAQs and complete supported narratives. |
| `validation-report.json` | Real `catalogPayloadSchema` and isolated `readContentMigrations` success; zero expired evidence. |
| `validate-offline.cjs` | Reproducible offline validation. Creates and removes an OS temporary directory; does not reserve a migration. |
| `programme-inventory.csv`, `programme-inventory.md`, `programme-records.json` | Complete 52-record inventory and directory/current-source reconciliation. |
| `held-programmes.json`, `holds.json` | Exact degree/mode holds, historical exclusions, access blockers and remaining media/integration work. |
| `evidence.json`, `source-register.json` | Claim-level evidence and retrieval receipts; source retrieval alone never means accepted publication evidence. |
| `freshness-check.json` | Independent remote-ledger/original68, local immutable identities, remote search, four live API alias routes and identity distinctions. |
| `taxonomy-mappings.json`, `taxonomy-proposals.json` | Existing mappings; no new taxonomy required for the supported payload. |
| `media-manifest.json` | Source provenance and explicit logo hold; **not an executable approved upload manifest**. |
| `scope.json`, `artifact-index.json` | Scope/authority boundaries and integration-oriented artifact list. |

## Supported versus held

- **Validated offline:** B.E. Civil, Mechanical, Electrical and Electronics, Electronics and Communication, Production, Electronics and Instrumentation, Computer Science and Engineering, CSE (Artificial Intelligence and Machine Learning); B.Tech. Information Technology and Industrial Biotechnology.
- **37 degree/mode records held:** four working-professional B.E. branches; eleven M.E. specialisations; nine doctoral disciplines in both FT/PT modes; four additional doctoral subjects whose current mode is unverified.
- **Five non-payload records:** historically suspended M.Sc. Applied Chemistry and part-time M.E. Computer Science; unconfirmed aggregator-only M.S.; honours/minor options within parent awards, not independent admissions.

The legacy programme directory omits AI&ML. The current TNEA 2026 college booklet, current-linked UG regulations and department list establish the tenth UG programme. Do not remove it merely to match the outdated directory. Conversely, do not turn the PG/working-professional/doctoral rows into publishable offerings by copying TNEA first-year conditions.

## Key evidence and bounded interpretations

1. **Identity and freshness:** TNEA college 2005, Thadagam Road, Coimbatore 641013; AICTE permanent ID 1-410916521. Distinct from Coimbatore Institute of Technology. Remote ledger and original68 had no match; all four canonical/alias live API routes returned structured 404 `not_found`. The integrator's subsequent local `researching` row is the authorised claim, not a pre-existing published match.
2. **Admission audience:** TNEA 2026 first-year route, not unrestricted international admission. Exact academic/vocational marks, nativity/schooling/parent-service conditions, OCI/PIO exception and Sri Lankan Tamil refugee exception are represented. The CSV's `open_to_international` means those narrow documented exceptions only; the payload explicitly uses `availability: restricted`.
3. **Language/duration:** UG regulations establish English and four years/eight semesters. Unknown future intake months are omitted in both arrays, with explicit omission evidence.
4. **Fees:** The dated 2026–27 NFG/BC/MBC fee certificate provides tuition INR 2,000 and college charges totalling INR 6,780. Its introductory whole-course wording is ambiguous, so the annual tuition basis is separately corroborated by the official current-linked fee table's explicit **per annum** heading. The older table's first-year combined total is **not** reused as a current total. Fee category is narrow; there is no unsupported general/foreign fee, USD conversion or extrapolated full-course amount.
5. **Hostel:** Current college certificate states INR 7,000 annual hostel charges plus approximately INR 2,800/month boarding, and itself computes an eleven-month INR 37,800 estimate. Current TNEA profile says vegetarian messes for men and women; older pages saying both diets are not used.
6. **Recognition:** One independently verified Grade A UGC Sections 2(f)/12B listing is used. Its legacy Bharathiar affiliation column is **not** treated as current affiliation; the current Anna University affiliated-college list corroborates Anna affiliation. Do not promote historical AICTE/NBA/NAAC statements into a blanket current badge.
7. **PG access blocker:** Official 2026 CEAP degree-matrix, vacancy and GATE-instruction PDFs returned HTTP 503 and web open timeouts. Search snippets are discovery only. M.E. names, duration and English are verified, but full current branch-entry/category/document requirements remain held.

## Media — explicit remaining gate

- `sources/cover-block.png`: official homepage image, HTTP 200 `image/png`, 1685×933; visually reviewed. Suitable source candidate, not uploaded.
- `sources/crest-original.png`: 203×264 faithful image-object extraction from official mandatory-disclosure PDF page 1; visually reviewed against the white PDF page. It is **not** a standalone HTTP `image/*` source or an intact browser-saved image. The logo remains held for an approved source/provenance decision or replacement. Do not directly execute this research manifest.
- The official 503×78 composite masthead was rejected as a low-quality individual logo tile.
- Public hosted logo/cover fields are intentionally absent. Attribution is retained, but attribution does not establish upload approval. The serial integrator/user-stage publisher must resolve media and run the documented Cloudinary/media workflow with valid hosted URLs.

## Reproduce

From repository root:

```bash
python3 research-drafts/india/tn-rolling-20261027/government-college-of-technology-coimbatore/build-packet.py
node --import tsx research-drafts/india/tn-rolling-20261027/government-college-of-technology-coimbatore/validate-offline.cjs
python3 research-drafts/india/tn-rolling-20261027/government-college-of-technology-coimbatore/finalize-packet.py
```

Keep large raw PDFs/HTML local unless selected evidence is needed for review. Do not stage the whole source-download directory indiscriminately. Integrator should revalidate after any editorial/media changes and retain held records outside the public payload.
