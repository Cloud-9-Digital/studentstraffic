# GCT Coimbatore — complete source-link publishing preparation

**Ready for the requested local media-preparation step. Not direct database apply.**

Original Tamil Nadu batch 2 / PR #4. Includes all ten current full-time first-year UG degrees, ten existing canonical categories, 138 evidence records, complete supported institutional/student-life narratives and 12 FAQs. It does not assert that held PG/research/working-professional routes are admission-ready.

This institution-scoped handoff leaves the canonical hosted-media, shared-claim and locked migration publication rules unchanged.

## Content and scope review

- Current government TNEA 2026 directory, college code **2005**, independently establishes all ten branch codes including CSE (AI & ML), omitted by an older college directory. No obsolete nine-programme total is reused.
- `audience-crosswalk.json` preserves exact academic/vocational marks, TNEA nativity/schooling/parent-service conditions and the narrowly allowed Tamil Nadu-native OCI/PIO/refugee routes. The OCI/PIO exclusion for people born abroad after 4 March 2021 is explicit. **No general foreign-national or NRI route is inferred.** Exact refugee documents are included.
- `programme-inventory.csv` and `.md`: **52 rows**. Ten included; 37 individually held current degree/mode records and five historical/discovery/embedded options. Research degrees are not blanket-excluded; their exact authority/entry/mode gaps remain recorded.
- `payload.source.json`: confirmed INR 2,000 annual tuition only for the **non-first-graduate BC/MBC** category. The dated 2026–27 certificate establishes the amount; the current-linked fee table independently labels the same tuition **per annum**. No amount is annualised, no foreign/general tariff is inferred, and the older combined INR 12,415 total is not asserted current. The source-period interpretation is transparent in the crosswalk.
- Independent UGC 2(f)/12B recognition is retained. The register's historical Bharathiar affiliation column is not used as current; Anna University affiliation has separate current support. No blanket current AICTE/NBA/NAAC badge is fabricated.
- Unknown future intake dates are omitted rather than guessed; 2026 admissions rules are labelled by cycle.

## Reviewed original media links

- [Official high-resolution GCT crest](https://gct.ac.in/sites/gct.ac.in/files/update_0.png): **681×884** original PNG, unchanged and visibly legible on white at 160px display height. The college also links this full-resolution brand asset as `rel=icon`; this is disclosed, not concealed. It is not a small favicon fallback, cropped masthead, PDF extraction or regenerated logo. It resolves the earlier PDF-only source hold under the runbook's suitable high-resolution-brand-asset rule.
- [Official GCT campus photograph](https://gct.ac.in/sites/gct.ac.in/files/home%20gallery/block.png): **1685×933** original campus walkway/building photograph, independently visually checked and HTTP/image/hash reverified.

Both use the repository's factual official institutional-identification/campus-context basis. No open licence, ownership transfer or endorsement is claimed. Original source URLs, hashes, dimensions and exact provenance are in `media-sources.json`; public hosted-media fields remain absent until the user's local preparation succeeds.

## 1. Offline verification

Run from the repository root after installing the project's dependencies:

```sh
node --import tsx content-preparation/tn-batch2-20261027/government-college-of-technology-coimbatore/prepare-local.mjs --validate
node --import tsx --test content-preparation/tn-batch2-20261027/government-college-of-technology-coimbatore/prepare-local.test.mjs
```

Verified: actual schema/isolated reader passes ten offerings, zero expired evidence; 12 safety tests pass. Existing repository regression tests are a separate stage. No live Cloudinary upload, final hosted-asset check, numbered-migration validation or DB apply was run here.

## 2. Prepare actual hosted media locally

Choose **one** route. Both preserve source hashes and refuse to overwrite the output file.

### A — local operator explicitly uploads the two reviewed originals

Use the existing local project's Cloudinary environment injection. The script loads the normal Next.js environment stack only when this explicit flag is used. It does **not** need `DATABASE_URL` and does not write the database.

```sh
node --import tsx content-preparation/tn-batch2-20261027/government-college-of-technology-coimbatore/prepare-local.mjs --upload-media --output /tmp/gct-prepared-payload.json
```

It verifies source bytes, reconciles deterministic checksum-qualified asset IDs before upload, refuses to overwrite an asset with different provenance, retains a local `.media-map.json` checkpoint, verifies hosted original bytes and reruns the actual reader. An interrupted upload is not blindly repeated: review the checkpoint and reconcile using the same public IDs. `--validate` cannot be combined with upload.

### B — use originals already uploaded by the operator

Create a local JSON mapping with `logo` and `cover` objects, each containing the actual `secureUrl` returned by Cloudinary and the corresponding `sourceSha256` from `media-sources.json`:

```sh
node --import tsx content-preparation/tn-batch2-20261027/government-college-of-technology-coimbatore/prepare-local.mjs --media-map /path/to/gct-media-map.json --output /tmp/gct-prepared-payload.json
```

Only actual `https://res.cloudinary.com/.../image/upload/...` mappings are accepted. Do not use transformed/recompressed versions: the returned bytes must match the reviewed originals. A changed source, failed HTTP response, HTML body or checksum mismatch stops preparation for review, rather than being silently accepted.

## 3. Normal controlled migration workflow

After preparation succeeds, follow `docs/content-seeding-runbook.md`:

1. Recheck latest remote main, the shared ledger, aliases and live API. Original68 remains untouched. Coordinate any existing claim rather than overriding another owner.
2. Claim/reconcile GCT Coimbatore using `scripts/university-queue.ts`; use `content:reserve` to allocate the next migration ID. Never choose a number manually. Copy the verified prepared payload into that reserved bundle.
3. Link that exact migration ID and payload path through the queue's controlled update command, then run scoped offline validation: `node --import tsx scripts/migrate-content.ts --validate --id <reserved-id>`. Run full offline validation and inspect all pending bundles before the controlled publication window.
4. Commit the final complete immutable migration and coordinated ledger state before applying. The apply runner is not scoped: do not accidentally apply unrelated pending bundles.
5. The authorized local operator performs the existing migration/media/cache workflow and verifies the actual public page/API and both hosted assets before recording `published` or supplying a live URL.

The preparation folder intentionally cannot be discovered by the normal apply-all migration reader. No numbered reservation, shared remote-ledger claim, main merge or live publication is claimed by this handoff.
