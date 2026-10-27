# NIFT Chennai — complete source-link publishing preparation

**Ready for the requested local media-preparation step. Not direct database apply.**

This belongs to original Tamil Nadu batch 2 / PR #4. It contains all eight current core degrees with positively evidenced regular and international admissions, distinct qualification/age rules, English medium, current native tuition quotes, full student-facing narratives and 68 evidence records. No fake hosted URLs or numbered migration is included.

This institution-scoped handoff does not change repository publishing policy. The canonical hosted-media, ledger and locked migration checks still apply at the user's local publication stage.

## Included and reviewed

- `payload.source.json`: six B.Des specialisations, B.F.Tech Apparel Production and M.F.M. Current 2026 admissions dates are explicitly historical, not future application promises.
- `audience-crosswalk.json`: exact 2026 official rules. Both regular and international UG routes require age under 24; the regular five-year SC/ST/PwD relaxation is not automatically attributed to the international route. Foreign qualifications require prescribed equivalence. International UG selection uses SAT; M.F.M uses GMAT.
- `programme-inventory.csv` and `.md`: 29 rows. Twelve short courses, seven campus-specific lateral leads and a national PhD lead remain individually held for named missing facts; the common Foundation Programme is non-award curriculum. No blanket research-degree exclusion.
- `taxonomy-review.json`: two neutral award categories integrated into `lib/data/program-taxonomy.ts`. B.F.Tech is not engineering B.Tech; M.F.M is not MBA. Six B.Des offerings reuse existing `bdes`.
- Exact annual NRI-category tuition is INR 907,000 for 2026–27, independently checked against the explicitly annual Chennai table. Regular-category INR 150,000 is a separate semester quote, never annualised. Other charges and living costs remain separate.
- `media-sources.json`: immutable original source URLs, byte hashes, dimensions, visual review and official identifying-asset basis. No open licence or ownership/endorsement claim is invented.

### Original media links

- [Official NIFT Chennai logo](https://nift.ac.in/chennai/themes/nift/images/Microsite_logos/4_Chennai_Microsite_logo.png): 497×106 original campus crest/wordmark, independently checked on white; original bytes unchanged.
- [Official Chennai campus photograph](https://nift.ac.in/chennai/sites/default/files/2026-10/4_Chennai.jpg): 1570×700 original frontage image supplied by the campus website, with visible institutional identity; no generated or cropped substitute.

The eight degree admissions/audience/fee facts and both original image HTTP responses were independently rechecked on 2026-10-27. The only remaining execution stages are user-local media hosting and the unchanged controlled migration/publication workflow. Other inventory rows remain explicitly outside this payload, not implicitly approved.

## 1. Offline verification

Run from the repository root after installing the project's dependencies:

```sh
node --import tsx content-preparation/tn-batch2-20261027/national-institute-of-fashion-technology-chennai/prepare-local.mjs --validate
node --import tsx --test content-preparation/tn-batch2-20261027/national-institute-of-fashion-technology-chennai/prepare-local.test.mjs
```

Verified: actual schema/isolated reader passes eight offerings, zero expired evidence; 12 safety tests pass. Existing repository regression tests are a separate stage. No live Cloudinary upload, final hosted-asset check, numbered-migration validation or DB apply was run here.

## 2. Prepare actual hosted media locally

Choose **one** route. Both preserve source hashes and refuse to overwrite the output file.

### A — local operator explicitly uploads the two reviewed originals

Use the existing local project's Cloudinary environment injection. The script loads the normal Next.js environment stack only when this explicit flag is used. It does **not** need `DATABASE_URL` and does not write the database.

```sh
node --import tsx content-preparation/tn-batch2-20261027/national-institute-of-fashion-technology-chennai/prepare-local.mjs --upload-media --output /tmp/nift-prepared-payload.json
```

It verifies source bytes, reconciles deterministic checksum-qualified asset IDs before upload, refuses to overwrite an asset with different provenance, retains a local `.media-map.json` checkpoint, verifies hosted original bytes and reruns the actual reader. An interrupted upload is not blindly repeated: review the checkpoint and reconcile using the same public IDs. `--validate` cannot be combined with upload.

### B — use originals already uploaded by the operator

Create a local JSON mapping with `logo` and `cover` objects, each containing the actual `secureUrl` returned by Cloudinary and the corresponding `sourceSha256` from `media-sources.json`:

```sh
node --import tsx content-preparation/tn-batch2-20261027/national-institute-of-fashion-technology-chennai/prepare-local.mjs --media-map /path/to/nift-media-map.json --output /tmp/nift-prepared-payload.json
```

Only actual `https://res.cloudinary.com/.../image/upload/...` mappings are accepted. Do not use transformed/recompressed versions: the returned bytes must match the reviewed originals. A changed source, failed HTTP response, HTML body or checksum mismatch stops preparation for review, rather than being silently accepted.

## 3. Normal controlled migration workflow

After preparation succeeds, follow `docs/content-seeding-runbook.md`:

1. Recheck latest remote main, the shared ledger, aliases and live API. Original68 remains untouched. Coordinate any existing claim rather than overriding another owner.
2. Claim/reconcile NIFT Chennai using `scripts/university-queue.ts`; use `content:reserve` to allocate the next migration ID. Never choose a number manually. Copy the verified prepared payload into that reserved bundle.
3. Link that exact migration ID and payload path through the queue's controlled update command, then run scoped offline validation: `node --import tsx scripts/migrate-content.ts --validate --id <reserved-id>`. Run full offline validation and inspect all pending bundles before the controlled publication window.
4. Commit the final complete immutable migration and coordinated ledger state before applying. The apply runner is not scoped: do not accidentally apply unrelated pending bundles.
5. The authorized local operator performs the existing migration/media/cache workflow and verifies the actual public page/API and both hosted assets before recording `published` or supplying a live URL.

The preparation folder intentionally cannot be discovered by the normal apply-all migration reader. No numbered reservation, shared remote-ledger claim, main merge or live publication is claimed by this handoff.
