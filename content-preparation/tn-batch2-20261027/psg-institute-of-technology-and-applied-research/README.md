# PSG iTech — complete source-link publishing preparation

**Ready for the requested local media-preparation step. Not direct database apply.**

Fixed Tamil Nadu batch 2 / PR #4. Nine fully sourced first-year engineering UG offerings, nine existing canonical categories, 170 evidence records, supported institutional narratives and 13 FAQs. The complete 23-row inventory remains alongside this selected content; postgraduate, B.Des, doctoral and other-mode rows are individually held or excluded rather than silently dropped.

This institution-scoped handoff does not change canonical hosted-media, shared-claim, immutable-migration or publishing rules.

## Independent content review

- Exact institution is **PSG Institute of Technology and Applied Research, Neelambur**, not PSG College of Technology at Peelamedu. The UGC's own autonomous register names this campus (row 1138), with autonomy valid 2024–25 to 2033–34 under Anna University.
- The current **2026–27 AICTE-issued EoA**, application 1-46222375435 dated 18 May 2026, covers the nine included engineering branches. The government TNEA 2026 matrix independently maps the exact nine branch codes to college **2377**, pages 114–115.
- **Robotics and AI:** the college-information booklet marks the new RI branch subject to Anna University approval. The EoA identifies it as an approved new course, and the separate current government matrix explicitly includes RI counselling seats. This supports the verified counselling route, not a fabricated final affiliation letter or a claim of currently vacant seats. The condition remains in `audience-crosswalk.json` and the inventory.
- Audience is the positively verified **academic-stream TNEA government-quota route**. All nativity/schooling/parent-service exceptions are stated. The narrow Tamil Nadu-native OCI/PIO route excludes those born abroad after **4 March 2021**; Sri Lankan Tamil refugee applicants must have studied in Tamil Nadu and provide the exact identification documents. No global foreign, NRI, management-quota, vocational or lateral-entry route is promoted.
- Four-year duration and English teaching/examination language are supported by current engineering regulations. Unknown future intake months remain omitted; no application-open or current-vacancy claim is made.
- Annual tuition remains on request for the exact applicant/allotment category. The older combined institutional fee table and category-unclear third-party whole-course totals are not relabelled as current annual tuition. Public copy requests a complete cost plan including accommodation and other charges.
- All included programmes have their own entry criteria, ordered counselling steps and academic/application documents. Unverified PG and B.Des prerequisites are not copied from engineering UG rules.

## Reviewed original media links

- [Official PSG iTech crest](https://psgitech.ac.in/design/assets/images/PSG_logo.png): intact 600×731 PNG, blue/red iTech identity legible on white; not a tiny favicon or another PSG institution's logo.
- [Official Neelambur campus courtyard](https://psgitech.ac.in/uploads/main_website/image_slider/active/11.webp): intact 1774×900 WebP photograph, actual courtyard and institutional plaque visible.

Original URLs, official page provenance, SHA-256 hashes, dimensions and accepted identification/editorial-campus basis are in `media-sources.json`. No open licence, ownership transfer or endorsement is claimed. Fresh HTTP 200 image responses matched the reviewed original bytes, and actual pixels were independently inspected. Public hosted-media fields remain absent until the user's explicit local step succeeds.

## 1. Offline verification

Run from the repository root after installing the project's dependencies:

```sh
node --import tsx content-preparation/tn-batch2-20261027/psg-institute-of-technology-and-applied-research/prepare-local.mjs --validate
node --import tsx --test content-preparation/tn-batch2-20261027/psg-institute-of-technology-and-applied-research/prepare-local.test.mjs
```

Verified: actual schema/isolated reader passes nine offerings, zero expired evidence; 12 safety tests pass. Existing repository regression tests are a separate stage. No live Cloudinary upload, final hosted-asset check, numbered-migration validation or DB apply was run here.

## 2. Prepare actual hosted media locally

Choose **one** route. Both preserve source hashes and refuse to overwrite the output file.

### A — local operator explicitly uploads the two reviewed originals

Use the existing local project's Cloudinary environment injection. The script loads the normal Next.js environment stack only when this explicit flag is used. It does **not** need `DATABASE_URL` and does not write the database.

```sh
node --import tsx content-preparation/tn-batch2-20261027/psg-institute-of-technology-and-applied-research/prepare-local.mjs --upload-media --output /tmp/psg-prepared-payload.json
```

It verifies source bytes, reconciles deterministic checksum-qualified asset IDs before upload, refuses to overwrite an asset with different provenance, retains a local `.media-map.json` checkpoint, verifies hosted original bytes and reruns the actual reader. An interrupted upload is not blindly repeated: review the checkpoint and reconcile using the same public IDs. `--validate` cannot be combined with upload.

### B — use originals already uploaded by the operator

Create a local JSON mapping with `logo` and `cover` objects, each containing the actual `secureUrl` returned by Cloudinary and the corresponding `sourceSha256` from `media-sources.json`:

```sh
node --import tsx content-preparation/tn-batch2-20261027/psg-institute-of-technology-and-applied-research/prepare-local.mjs --media-map /path/to/psg-media-map.json --output /tmp/psg-prepared-payload.json
```

Only actual `https://res.cloudinary.com/.../image/upload/...` mappings are accepted. Do not use transformed/recompressed versions: the returned bytes must match the reviewed originals. A changed source, failed HTTP response, HTML body or checksum mismatch stops preparation for review, rather than being silently accepted.

## 3. Normal controlled migration workflow

After preparation succeeds, follow `docs/content-seeding-runbook.md`:

1. Recheck latest remote main, the shared ledger, aliases and live API. Original68 remains untouched. Coordinate any existing claim rather than overriding another owner.
2. Claim/reconcile PSG iTech using `scripts/university-queue.ts`; use `content:reserve` to allocate the next migration ID. Never choose a number manually. Copy the verified prepared payload into that reserved bundle.
3. Link that exact migration ID and payload path through the queue's controlled update command, then run scoped offline validation: `node --import tsx scripts/migrate-content.ts --validate --id <reserved-id>`. Run full offline validation and inspect all pending bundles before the controlled publication window.
4. Commit the final complete immutable migration and coordinated ledger state before applying. The apply runner is not scoped: do not accidentally apply unrelated pending bundles.
5. The authorized local operator performs the existing migration/media/cache workflow and verifies the actual public page/API and both hosted assets before recording `published` or supplying a live URL.

The preparation folder intentionally cannot be discovered by the normal apply-all migration reader. No numbered reservation, shared remote-ledger claim, main merge or live publication is claimed by this handoff.
