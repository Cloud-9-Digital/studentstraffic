# Easwari Engineering College — complete source-link local preparation

**Ready for the requested local media-preparation step; not direct database apply.**

Fixed Tamil Nadu batch 2 / PR #4. This packet contains 15 complete first-year academic-stream government-quota TNEA offerings, 13 existing canonical course categories, 177 evidence records and 13 FAQs. Its full 31-row inventory preserves the seven separately advertised postgraduate and other doctoral/historical holds; it is not a claim that every discovery row is publishable.

## Independently reviewed scope

- Anna University’s own affiliated-college roster identifies the autonomous institution, examination code 3106 and TNEA code 1304. The existing establishment-year source is retained; Easwari is not substituted for an SRM university campus.
- DTE’s current 2026 college directory, printed page 60 / PDF page 101, explicitly records **approved intake for all 15 selected branches** at the exact Ramapuram campus. Its separate current academic counselling matrix matches the same branches. This is independent state approved-intake/counselling evidence—not a claim that a separate current AICTE EoA, year-specific affiliation renewal or NBA order was retrieved. Snapshot counselling seats are not represented as current vacancies.
- All six TNEA Indian schooling/nativity/parent-service categories are stated, alongside the exact Tamil Nadu-native OCI/PIO exception (excluding those born abroad after 4 March 2021) and Sri Lankan Tamil refugee route with its conditional identification documents. No unrestricted foreign/NRI, management, vocational or lateral-entry route is implied.
- Qualifications, four-year duration, branch-specific counselling steps and academic/application documents are explicit. Medium and future intake months are unknown and omitted with evidence; they are not inferred from an English website or an old academic calendar.
- The official admissions portal provides institution narratives and exact programme names, including the CSBS-specific TCS partnership. No placement percentage, salary or guaranteed overseas-study benefit is published.
- Tuition is on request for the applicant’s category. The government table separates annual room, electricity, mess and transport components, but the inspected page does not explicitly label currency. Numerical public living-cost claims have therefore been omitted rather than silently assigning INR. The native source remains available for the operator’s review; no annualisation or combined tuition total is invented.

## Original media links

- [Official Easwari identity](https://cdn.npfs.co/uploads/template/468/5084/publish/images/EEC-LOGO.png?1733490597): 301×119 PNG, complete crest and dark institutional wordmark legible on white.
- [Official Galileo Block campus original](https://cdn.npfs.co/uploads/template/468/5084/publish/images/why/City%20Green%20Campus.jpg?1764582201): 500×500 JPEG, actual building/signage and trees. This is a square source, not a high-resolution panorama; the original is not cropped or artificially enlarged.

Both exact URLs are embedded by the [official admissions portal](https://registration.srmeaswari.ac.in/). Independent ordinary HTTP requests returned 200 image responses with the exact reviewed hashes. Actual source pixels were inspected. The accepted provenance basis is factual institutional identification and campus-context editorial illustration; no open licence, express copyright permission, ownership transfer or endorsement is asserted. `media-sources.json` and payload attribution retain the original sources. Hosted-image fields remain absent until the explicit local stage.

The earlier main-site access denials remain respected. The separate observed public admissions portal and its embedded CDN originals were independently accessible; no cookie, header spoofing, proxy or challenge bypass was used. Raw source pages, forms, images, full PDFs and secret material are excluded from this delivery.

## Validation and publication boundary

Actual strict schema and isolated migration reader: **15 programmes, 177 evidence records, zero expired evidence**. Twelve generated safety tests pass, separate from the existing repository regression suite. Canonical and alias live APIs returned structured 404 at 13:24 UTC, but concurrent user-local publication makes a final recheck mandatory.

No database access, media upload, remote shared-ledger claim, numbered reservation, main merge or live publication was performed. Other programme holds remain in `retained-holds.json`; source-link readiness is not permission to apply every historical research draft in the PR.

## 1. Offline verification

Run from the repository root after installing the project's dependencies:

```sh
node --import tsx content-preparation/tn-batch2-20261027/easwari-engineering-college/prepare-local.mjs --validate
node --import tsx --test content-preparation/tn-batch2-20261027/easwari-engineering-college/prepare-local.test.mjs
```

Verified: actual schema/isolated reader passes 15 offerings, zero expired evidence; 12 safety tests pass. Existing repository regression tests are a separate stage. No live Cloudinary upload, final hosted-asset check, numbered-migration validation or DB apply was run here.

## 2. Prepare actual hosted media locally

Choose **one** route. Both preserve source hashes and refuse to overwrite the output file.

### A — local operator explicitly uploads the two reviewed originals

Use the existing local project's Cloudinary environment injection. The script loads the normal Next.js environment stack only when this explicit flag is used. It does **not** need `DATABASE_URL` and does not write the database.

```sh
node --import tsx content-preparation/tn-batch2-20261027/easwari-engineering-college/prepare-local.mjs --upload-media --output /tmp/easwari-prepared-payload.json
```

It verifies source bytes, reconciles deterministic checksum-qualified asset IDs before upload, refuses to overwrite an asset with different provenance, retains a local `.media-map.json` checkpoint, verifies hosted original bytes and reruns the actual reader. An interrupted upload is not blindly repeated: review the checkpoint and reconcile using the same public IDs. `--validate` cannot be combined with upload.

### B — use originals already uploaded by the operator

Create a local JSON mapping with `logo` and `cover` objects, each containing the actual `secureUrl` returned by Cloudinary and the corresponding `sourceSha256` from `media-sources.json`:

```sh
node --import tsx content-preparation/tn-batch2-20261027/easwari-engineering-college/prepare-local.mjs --media-map /path/to/easwari-media-map.json --output /tmp/easwari-prepared-payload.json
```

Only actual `https://res.cloudinary.com/.../image/upload/...` mappings are accepted. Do not use transformed/recompressed versions: the returned bytes must match the reviewed originals. A changed source, failed HTTP response, HTML body or checksum mismatch stops preparation for review, rather than being silently accepted.

## 3. Normal controlled migration workflow

After preparation succeeds, follow `docs/content-seeding-runbook.md`:

1. Recheck latest remote main, the shared ledger, aliases and live API. Original68 remains untouched. Coordinate any existing claim rather than overriding another owner.
2. Claim/reconcile Easwari Engineering College using `scripts/university-queue.ts`; use `content:reserve` to allocate the next migration ID. Never choose a number manually. Copy the verified prepared payload into that reserved bundle.
3. Link that exact migration ID and payload path through the queue's controlled update command, then run scoped offline validation: `node --import tsx scripts/migrate-content.ts --validate --id <reserved-id>`. Run full offline validation and inspect all pending bundles before the controlled publication window.
4. Commit the final complete immutable migration and coordinated ledger state before applying. The apply runner is not scoped: do not accidentally apply unrelated pending bundles.
5. The authorized local operator performs the existing migration/media/cache workflow and verifies the actual public page/API and both hosted assets before recording `published` or supplying a live URL.

The preparation folder intentionally cannot be discovered by the normal apply-all migration reader. No numbered reservation, shared remote-ledger claim, main merge or live publication is claimed by this handoff.
