# LICET — complete source-link publishing preparation

**Ready for the requested local media-preparation step. Not direct database apply.**

This is the first complete source-link handoff in Tamil Nadu batch 2 / PR #4. It is separate from the older held research candidates in that PR. The user uploads media and owns final local publication; no keys belong in chat or Git.

This is a one-off LICET handoff requested by the user, not a change to repository-wide publishing policy. The canonical runbook and its mandatory hosted-media/publication gates remain unchanged.

## Included

- `payload.source.json`: full institution content, six current UG offerings, six existing canonical courses, exact admissions/documents/audience scope, native fee evidence and **89 evidence records**. No fake hosted URLs.
- `media-sources.json`: original logo and cover image links, SHA-256, dimensions, visual review, rights basis and attribution.
- `programme-inventory.csv`: all 15 inventory rows. All six current first-year degrees are included; historical/lateral/research leads remain individually excluded or held, not invented as admitting awards.
- `audience-crosswalk.json`: government TNEA directory code 1450, six branch codes, and exact restricted eligibility. This is **not unrestricted foreign/NRI admission**. The positive OCI/PIO/refugee rules, not AICTE's “No” quota columns, support the scope.
- `prepare-local.mjs`: bounded upload-only / existing-map preparation. It never imports a database client, edits the queue, reserves a migration or applies content.

### Original media links

- [Official LICET crest](https://licet.ac.in/wp-content/uploads/2021/02/Artboard-%E2%80%93-3-1-150x150.png): intact 150×150 institutional identifying mark, legible on white. Official-brand identification basis; no open licence or endorsement claimed.
- [Original LICET campus photograph](https://upload.wikimedia.org/wikipedia/commons/4/47/LICET.jpg): 4000×3000, by **Praveen rijal**, photographed in 2019, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), [source/licence record](https://commons.wikimedia.org/wiki/File:LICET.jpg). Original diagonal composition is retained. Public credit and licence/source URLs are included in the rendered campus-environment text as well as media provenance.

## 1. Offline verification

Run from the repository root after installing the project's dependencies:

```sh
node --import tsx content-preparation/tn-batch2-20261027/loyola-icam-college-of-engineering-and-technology/prepare-local.mjs --validate
node --import tsx --test content-preparation/tn-batch2-20261027/loyola-icam-college-of-engineering-and-technology/prepare-local.test.mjs
```

Verified: actual schema/isolated reader passes six offerings, zero expired evidence; 11 safety tests pass. Existing repository regression tests are a separate stage. No live Cloudinary upload, final hosted-asset check, numbered-migration validation or DB apply was run here.

## 2. Prepare actual hosted media locally

Choose **one** route. Both preserve source hashes and refuse to overwrite the output file.

### A — local operator explicitly uploads the two reviewed originals

Use the existing local project's Cloudinary environment injection. The script loads the normal Next.js environment stack only when this explicit flag is used. It does **not** need `DATABASE_URL` and does not write the database.

```sh
node --import tsx content-preparation/tn-batch2-20261027/loyola-icam-college-of-engineering-and-technology/prepare-local.mjs --upload-media --output /tmp/licet-prepared-payload.json
```

It verifies source bytes, reconciles deterministic checksum-qualified asset IDs before upload, refuses to overwrite an asset with different provenance, retains a local `.media-map.json` checkpoint, verifies hosted original bytes and reruns the actual reader. An interrupted upload is not blindly repeated: review the checkpoint and reconcile using the same public IDs. `--validate` cannot be combined with upload.

### B — use originals already uploaded by the operator

Create a local JSON mapping with `logo` and `cover` objects, each containing the actual `secureUrl` returned by Cloudinary and the corresponding `sourceSha256` from `media-sources.json`:

```sh
node --import tsx content-preparation/tn-batch2-20261027/loyola-icam-college-of-engineering-and-technology/prepare-local.mjs --media-map /path/to/licet-media-map.json --output /tmp/licet-prepared-payload.json
```

Only actual `https://res.cloudinary.com/.../image/upload/...` mappings are accepted. Do not use transformed/recompressed versions: the returned bytes must match the reviewed originals. A changed source, failed HTTP response, HTML body or checksum mismatch stops preparation for review, rather than being silently accepted.

## 3. Normal controlled migration workflow

After preparation succeeds, follow `docs/content-seeding-runbook.md`:

1. Recheck latest remote main, the shared ledger, aliases and live API. Original68 remains untouched. Coordinate any existing claim rather than overriding another owner.
2. Claim/reconcile LICET using `scripts/university-queue.ts`; use `content:reserve` to allocate the next migration ID. Never choose a number manually. Copy the verified prepared payload into that reserved bundle.
3. Link that exact migration ID and payload path through the queue's controlled update command, then run scoped offline validation: `node --import tsx scripts/migrate-content.ts --validate --id <reserved-id>`. Run full offline validation and inspect all pending bundles before the controlled publication window.
4. Commit the final complete immutable migration and coordinated ledger state before applying. The apply runner is not scoped: do not accidentally apply unrelated pending bundles.
5. The authorized local operator performs the existing migration/media/cache workflow and verifies the actual public page/API and both hosted assets before recording `published` or supplying a live URL.

The preparation folder intentionally cannot be discovered by the normal apply-all migration reader. No numbered reservation, shared remote-ledger claim, main merge or live publication is claimed by this handoff.
