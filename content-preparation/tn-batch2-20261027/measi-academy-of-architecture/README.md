# MEASI Academy of Architecture — complete source-link publishing preparation

**Ready for the requested local media-preparation step. Not direct database apply.**

Original Tamil Nadu batch 2 / PR #4. One fully sourced five-year B.Arch offering, the existing `barch` category, 21 evidence records, complete supported narratives and 11 FAQs. The full current portfolio contains three degrees; both M.Arch routes remain explicitly held for exact selection/document/audience gaps. No generic postgraduate route is invented.

This institution-scoped handoff does not change the canonical hosted-media, shared-claim or locked migration rules.

## Independent content review

- The Council of Architecture's current register identifies **TN13**, MEASI Academy of Architecture, Royapettah, Anna University affiliation, **160 B.Arch places for 2026–27** and 1999 commencement. No unrelated MEASI college or doctoral programme is folded into this institution.
- The separate **2026 B.Arch** government brochure supplies the exact subject/45% academic threshold, 10+3 diploma alternative, NATA/JEE Paper 2 architecture requirement, ranking, counselling and original-document requirements. These are not copied engineering-subject rules.
- Supported scope is the restricted TNEA counselling audience, including the explicitly eligible Tamil Nadu-native OCI/PIO and Sri Lankan Tamil refugee categories. The OCI/PIO exception excludes those born abroad after 4 March 2021. Full nativity/schooling/parent-service conditions and refugee documents are retained. **No unrestricted foreign/NRI route or nationality ban is asserted.**
- Academic documents must meet the stated single-board and recognised-equivalent conditions. Unknown formal teaching medium and future intake dates remain omitted with omission evidence.
- Annual tuition remains on request, supported by the official applicant-specific payment instructions. Conflicting third-party totals are not promoted, annualised or mixed with studio/living costs.
- `programme-inventory.csv` and `.md` enumerate all three current degree awards; the two PG holds remain outside the executable content scope.

## Reviewed original media links

- [Official Academy-supplied identifying crest](https://measiarch.edu.in/wp-content/uploads/2026/10/MAA-Logo-FP.png): 112×112 intact red/green crest, visually legible on white. The crest's **1902** is MEASI trust branding, **not** the academy's establishment year (1999). No generated mark or tiny favicon substitute is used.
- [Official campus entrance photograph](https://measiarch.edu.in/wp-content/uploads/2026/09/MEASIPHOTO.jpg): 1440×960 original Royapettah courtyard/frontage with the Academy name visible, no promotional watermark or synthetic imagery.

Original URLs, source hashes, dimensions and accepted official identification/campus-context basis are in `media-sources.json`. No open licence, ownership transfer or endorsement is claimed. Both HTTP/image/hash responses and actual pixels were independently checked. Public hosted-media fields remain absent until the user's explicit local step succeeds.

## 1. Offline verification

Run from the repository root after installing the project's dependencies:

```sh
node --import tsx content-preparation/tn-batch2-20261027/measi-academy-of-architecture/prepare-local.mjs --validate
node --import tsx --test content-preparation/tn-batch2-20261027/measi-academy-of-architecture/prepare-local.test.mjs
```

Verified: actual schema/isolated reader passes one offering, zero expired evidence; 12 safety tests pass. Existing repository regression tests are a separate stage. No live Cloudinary upload, final hosted-asset check, numbered-migration validation or DB apply was run here.

## 2. Prepare actual hosted media locally

Choose **one** route. Both preserve source hashes and refuse to overwrite the output file.

### A — local operator explicitly uploads the two reviewed originals

Use the existing local project's Cloudinary environment injection. The script loads the normal Next.js environment stack only when this explicit flag is used. It does **not** need `DATABASE_URL` and does not write the database.

```sh
node --import tsx content-preparation/tn-batch2-20261027/measi-academy-of-architecture/prepare-local.mjs --upload-media --output /tmp/measi-prepared-payload.json
```

It verifies source bytes, reconciles deterministic checksum-qualified asset IDs before upload, refuses to overwrite an asset with different provenance, retains a local `.media-map.json` checkpoint, verifies hosted original bytes and reruns the actual reader. An interrupted upload is not blindly repeated: review the checkpoint and reconcile using the same public IDs. `--validate` cannot be combined with upload.

### B — use originals already uploaded by the operator

Create a local JSON mapping with `logo` and `cover` objects, each containing the actual `secureUrl` returned by Cloudinary and the corresponding `sourceSha256` from `media-sources.json`:

```sh
node --import tsx content-preparation/tn-batch2-20261027/measi-academy-of-architecture/prepare-local.mjs --media-map /path/to/measi-media-map.json --output /tmp/measi-prepared-payload.json
```

Only actual `https://res.cloudinary.com/.../image/upload/...` mappings are accepted. Do not use transformed/recompressed versions: the returned bytes must match the reviewed originals. A changed source, failed HTTP response, HTML body or checksum mismatch stops preparation for review, rather than being silently accepted.

## 3. Normal controlled migration workflow

After preparation succeeds, follow `docs/content-seeding-runbook.md`:

1. Recheck latest remote main, the shared ledger, aliases and live API. Original68 remains untouched. Coordinate any existing claim rather than overriding another owner.
2. Claim/reconcile MEASI Academy of Architecture using `scripts/university-queue.ts`; use `content:reserve` to allocate the next migration ID. Never choose a number manually. Copy the verified prepared payload into that reserved bundle.
3. Link that exact migration ID and payload path through the queue's controlled update command, then run scoped offline validation: `node --import tsx scripts/migrate-content.ts --validate --id <reserved-id>`. Run full offline validation and inspect all pending bundles before the controlled publication window.
4. Commit the final complete immutable migration and coordinated ledger state before applying. The apply runner is not scoped: do not accidentally apply unrelated pending bundles.
5. The authorized local operator performs the existing migration/media/cache workflow and verifies the actual public page/API and both hosted assets before recording `published` or supplying a live URL.

The preparation folder intentionally cannot be discovered by the normal apply-all migration reader. No numbered reservation, shared remote-ledger claim, main merge or live publication is claimed by this handoff.
