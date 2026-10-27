# CIPET IPT Chennai — complete source-link publishing preparation

**Ready for the requested local media-preparation step. Not direct database apply.**

Fixed Tamil Nadu batch 2 / PR #4. Two complete first-year academic-stream engineering routes: B.Tech Plastics Technology and B.E. Manufacturing Engineering. Two neutral course categories, 41 evidence records and 12 FAQs. The full 15-row inventory retains all other degree, diploma, lateral-entry and national-discovery holds/exclusions.

This institution-scoped handoff does not change the canonical hosted-media, shared-claim, immutable-migration or publication requirements.

## Independent authority and exact content scope

- The **Anna University-owned affiliated-college roster** identifies CIPET Chennai with examination code **3103** and TNEA code **1321**. This is an actual current roster retrieval, not an invented year-specific affiliation renewal order.
- The government's specifically dated **DTE/TNEA 2026 college directory**, printed page 69 / PDF 110, records approved intake 60 each for MN Manufacturing Engineering and PA Plastics Technology. Its current academic counselling matrix, PDF 56, separately names both exact branches and the Guindy campus. Snapshot counselling seats are not represented as sanctioned intake or live vacancies.
- This current independent government evidence supports the two narrow UG routes. **A separate AICTE 2026–27 EoA was not retrieved and is not claimed.** Older 2025–26 letters are not substituted. NBA details in institutional/government summary columns are not promoted as independently verified NBA badges.
- The official 2026 TNEA brochure explicitly includes CIPET Chennai among participating central-government institutions. All six Indian nativity/schooling/parent-service categories are retained, alongside the precise Tamil Nadu-native OCI/PIO exception (excluding foreign births after 4 March 2021) and educated-in-Tamil-Nadu Sri Lankan Tamil refugee route. No unrestricted foreign/NRI quota or blanket nationality ban is inferred.
- Programme-level criteria include HSC +1/+2 or accepted equivalent, PCM, 45% General /40% eligible reservation-category threshold, ordered counselling steps and exact conditional documents. The shared first-year UG prospectus cell states **age limit 21** but gives no calculation date; that date is explicitly not invented.
- Four-year duration is verified. Unknown teaching medium and future intake months remain omitted. Lateral entry, PG, MSc and diploma procedures are not copied into these records.

## Exact fee treatment

The 2026–27 first-year prospectus table explicitly labels tuition **per annum**: INR 55,000 for B.Tech Plastics, INR 50,000 for B.E. Manufacturing. It separately lists development, university/examination, admission, hostel and mess charges.

The table does not separately identify the OCI/PIO/refugee tariff. Therefore the **applicant-specific fee is on request**, while `reportedFeeQuote` retains the exact published standard annual tuition, omits an invented audience label and marks applicant scope unconfirmed. This does not mean no fee exists. No combined total is called tuition, no annualisation is performed and no Indian standard quote is silently presented as an overseas-category price.

## Reviewed original media links

- [Official intact CIPET brand asset](https://www.cipet.gov.in/images/new/cipet-logo-2-new.jpg): 530×301 JPEG, original orange/green emblem and dark CIPET/institutional wording legible on white. It replaces the weak 66px header icon. This is the intact asset linked by the public institutional page—not a masthead crop, PDF extraction or favicon.
- [Official Chennai campus entrance](https://www.cipet.gov.in/centres/cipet-chennai/img/slides/6.jpg): 1500×475 JPEG, actual centre entrance and sign. The publisher's identifying caption strip remains intact; no crop, event/ranking overlay or generated scene is introduced.

Both source links returned HTTP 200 image responses with the reviewed SHA-256 hashes. Actual source pixels were independently inspected. `media-sources.json` preserves the official identification/editorial-campus basis without claiming an open licence, ownership transfer or endorsement. Hosted-image fields remain absent until the explicit operator-local stage succeeds.

## Retained holds

Other MSc/PG/diploma/lateral routes remain individually held. No new Madras University MSc affiliation, foreign quota, independent NBA grade or year-specific AICTE/Anna renewal is asserted. The canonical and two alias APIs were structured 404 at the recorded latest check; recheck immediately before reserving/applying because other profiles are being published concurrently.

## 1. Offline verification

Run from the repository root after installing the project's dependencies:

```sh
node --import tsx content-preparation/tn-batch2-20261027/cipet-institute-of-petrochemicals-technology-chennai/prepare-local.mjs --validate
node --import tsx --test content-preparation/tn-batch2-20261027/cipet-institute-of-petrochemicals-technology-chennai/prepare-local.test.mjs
```

Verified: actual schema/isolated reader passes two offerings, zero expired evidence; 12 safety tests pass. Existing repository regression tests are a separate stage. No live Cloudinary upload, final hosted-asset check, numbered-migration validation or DB apply was run here.

## 2. Prepare actual hosted media locally

Choose **one** route. Both preserve source hashes and refuse to overwrite the output file.

### A — local operator explicitly uploads the two reviewed originals

Use the existing local project's Cloudinary environment injection. The script loads the normal Next.js environment stack only when this explicit flag is used. It does **not** need `DATABASE_URL` and does not write the database.

```sh
node --import tsx content-preparation/tn-batch2-20261027/cipet-institute-of-petrochemicals-technology-chennai/prepare-local.mjs --upload-media --output /tmp/cipet-prepared-payload.json
```

It verifies source bytes, reconciles deterministic checksum-qualified asset IDs before upload, refuses to overwrite an asset with different provenance, retains a local `.media-map.json` checkpoint, verifies hosted original bytes and reruns the actual reader. An interrupted upload is not blindly repeated: review the checkpoint and reconcile using the same public IDs. `--validate` cannot be combined with upload.

### B — use originals already uploaded by the operator

Create a local JSON mapping with `logo` and `cover` objects, each containing the actual `secureUrl` returned by Cloudinary and the corresponding `sourceSha256` from `media-sources.json`:

```sh
node --import tsx content-preparation/tn-batch2-20261027/cipet-institute-of-petrochemicals-technology-chennai/prepare-local.mjs --media-map /path/to/cipet-media-map.json --output /tmp/cipet-prepared-payload.json
```

Only actual `https://res.cloudinary.com/.../image/upload/...` mappings are accepted. Do not use transformed/recompressed versions: the returned bytes must match the reviewed originals. A changed source, failed HTTP response, HTML body or checksum mismatch stops preparation for review, rather than being silently accepted.

## 3. Normal controlled migration workflow

After preparation succeeds, follow `docs/content-seeding-runbook.md`:

1. Recheck latest remote main, the shared ledger, aliases and live API. Original68 remains untouched. Coordinate any existing claim rather than overriding another owner.
2. Claim/reconcile CIPET IPT Chennai using `scripts/university-queue.ts`; use `content:reserve` to allocate the next migration ID. Never choose a number manually. Copy the verified prepared payload into that reserved bundle.
3. Link that exact migration ID and payload path through the queue's controlled update command, then run scoped offline validation: `node --import tsx scripts/migrate-content.ts --validate --id <reserved-id>`. Run full offline validation and inspect all pending bundles before the controlled publication window.
4. Commit the final complete immutable migration and coordinated ledger state before applying. The apply runner is not scoped: do not accidentally apply unrelated pending bundles.
5. The authorized local operator performs the existing migration/media/cache workflow and verifies the actual public page/API and both hosted assets before recording `published` or supplying a live URL.

The preparation folder intentionally cannot be discovered by the normal apply-all migration reader. No numbered reservation, shared remote-ledger claim, main merge or live publication is claimed by this handoff.
