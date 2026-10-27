# Madras School of Economics — complete source-link publishing preparation

**Ready for the requested local media-preparation step. Not direct database apply.**

Fixed Tamil Nadu batch 2 / PR #4. Seven complete taught routes: Integrated MA Economics, five MA specialisations and MSc Data Science. Four neutral course categories, 101 evidence records and 12 FAQs. The full 16-row inventory preserves both unresolved MBAs, two doctoral-mode holds, two non-separate integrated exits and three historical/legacy exclusions.

This institution-scoped handoff does not change canonical hosted-media, shared-claim or locked immutable-migration requirements.

## Independent content review

- **Independent statutory recognition:** the UGC's own Annual Report 2022–23, printed pages 95 and 142, identifies MSE in the institutions-established-under-State-Legislature category and names its recognition date, 1 April 2021. The named table is as of 31 March 2023. This is not a newly retrieved 2026 order, deemed-university designation, NAAC grade or programme-by-programme accreditation. The unavailable state Act was not pretended to have been read.
- **Current programme rules:** the exact 2026 integrated-MA, MA and MSc brochures define their own qualification, mathematics, age and category requirements. MA/MSc current official pages explicitly provide 2026 NRI/foreign entry points; MSc separately provides its specified GATE route. The current MSc brochure overrides the old AY 2025 parenthesis still pasted in its webpage body.
- **Standing foreign policy:** the current MA academic page links its April 2025 ordinance; the 2026 MSc brochure expressly refers to its programme ordinance. Those standing documents supply equivalence, authenticated records, translations, passports and conditional English-test requirements. Their old dates, fees, seat counts and office details are not transferred into current content. Foreign admissions are not inferred solely from a generic international webpage.
- Indian reservation concessions are not automatically assigned to foreign applicants. NRI form access does not automatically grant the foreign-national entrance-test exemption. The integrated programme does not inherit MA/MSc English thresholds.
- **Native-period fees:** current MA foreign tuition is USD 4,333 per semester; MSc is USD 6,934 per semester. Separate infrastructure and one-time charges remain separate. The integrated 2026–27 handbook, page 14, labels the first three years as the BA stage: foreign tuition USD 3,025 or NRI USD 1,815 per semester, plus USD 750 semester infrastructure and USD 500 one-time admission/processing. It says MA fees apply in years 4–5. No semester amount is multiplied into annual tuition, and no fixed five-year total is fabricated.
- MA financial assurance (USD 5,000 bank balance or the stated government undertaking) differs from MSc (USD 10,000). These are documentation requirements, not tuition.
- Teaching medium and future intake dates remain unpopulated where not expressly evidenced. An English subject, proficiency rule or website is not proof of teaching language.
- A distinct neutral `master-quantitative-finance` category is added for MA Applied Quantitative Finance rather than misclassifying it as MBA or MSc Finance. Existing economics specialisations retain `master-economics`; no prior category is reclassified.

## Reviewed original media links

- [Official MSE book emblem and wordmark](https://mse.ac.in/wp-content/uploads/2021/11/BLUE-1-.png): intact 500×500 PNG with cyan letters, red/white book and dark-red tagline, visually legible on white.
- [Official Chennai campus building and gardens](https://mse.ac.in/wp-content/uploads/2021/09/final-image.jpg): intact 1600×500 JPEG; genuine campus photograph, no watermark or synthetic scene.

Original URLs, hashes, dimensions and accepted official institutional-identification/editorial-campus basis are in `media-sources.json`. No open licence, ownership transfer or endorsement is claimed. Fresh HTTP 200 image bytes matched the reviewed originals. Hosted-media fields remain absent until the operator completes the explicit local stage.

## Retained limits

The MSc-page-linked Google form returned 401; its internal fields were not inspected or bypassed. The named 2026 entry point and independently readable core policy/document requirements are verified. Both MBAs remain held for conflicting entry conditions and applicable approval evidence; research awards remain held for exact discipline/mode qualification and duration. None is promoted just to complete inventory counts.

## 1. Offline verification

Run from the repository root after installing the project's dependencies:

```sh
node --import tsx content-preparation/tn-batch2-20261027/madras-school-of-economics/prepare-local.mjs --validate
node --import tsx --test content-preparation/tn-batch2-20261027/madras-school-of-economics/prepare-local.test.mjs
```

Verified: actual schema/isolated reader passes seven offerings, zero expired evidence; 12 safety tests pass. Existing repository regression tests are a separate stage. No live Cloudinary upload, final hosted-asset check, numbered-migration validation or DB apply was run here.

## 2. Prepare actual hosted media locally

Choose **one** route. Both preserve source hashes and refuse to overwrite the output file.

### A — local operator explicitly uploads the two reviewed originals

Use the existing local project's Cloudinary environment injection. The script loads the normal Next.js environment stack only when this explicit flag is used. It does **not** need `DATABASE_URL` and does not write the database.

```sh
node --import tsx content-preparation/tn-batch2-20261027/madras-school-of-economics/prepare-local.mjs --upload-media --output /tmp/mse-prepared-payload.json
```

It verifies source bytes, reconciles deterministic checksum-qualified asset IDs before upload, refuses to overwrite an asset with different provenance, retains a local `.media-map.json` checkpoint, verifies hosted original bytes and reruns the actual reader. An interrupted upload is not blindly repeated: review the checkpoint and reconcile using the same public IDs. `--validate` cannot be combined with upload.

### B — use originals already uploaded by the operator

Create a local JSON mapping with `logo` and `cover` objects, each containing the actual `secureUrl` returned by Cloudinary and the corresponding `sourceSha256` from `media-sources.json`:

```sh
node --import tsx content-preparation/tn-batch2-20261027/madras-school-of-economics/prepare-local.mjs --media-map /path/to/mse-media-map.json --output /tmp/mse-prepared-payload.json
```

Only actual `https://res.cloudinary.com/.../image/upload/...` mappings are accepted. Do not use transformed/recompressed versions: the returned bytes must match the reviewed originals. A changed source, failed HTTP response, HTML body or checksum mismatch stops preparation for review, rather than being silently accepted.

## 3. Normal controlled migration workflow

After preparation succeeds, follow `docs/content-seeding-runbook.md`:

1. Recheck latest remote main, the shared ledger, aliases and live API. Original68 remains untouched. Coordinate any existing claim rather than overriding another owner.
2. Claim/reconcile Madras School of Economics using `scripts/university-queue.ts`; use `content:reserve` to allocate the next migration ID. Never choose a number manually. Copy the verified prepared payload into that reserved bundle.
3. Link that exact migration ID and payload path through the queue's controlled update command, then run scoped offline validation: `node --import tsx scripts/migrate-content.ts --validate --id <reserved-id>`. Run full offline validation and inspect all pending bundles before the controlled publication window.
4. Commit the final complete immutable migration and coordinated ledger state before applying. The apply runner is not scoped: do not accidentally apply unrelated pending bundles.
5. The authorized local operator performs the existing migration/media/cache workflow and verifies the actual public page/API and both hosted assets before recording `published` or supplying a live URL.

The preparation folder intentionally cannot be discovered by the normal apply-all migration reader. No numbered reservation, shared remote-ledger claim, main merge or live publication is claimed by this handoff.
