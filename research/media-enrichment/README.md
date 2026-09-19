# University media-enrichment queue

This queue is processed alphabetically from the database list of universities missing a logo or
cover image. Workers research assets offline and write one JSON batch per assigned range; they do
not upload to Cloudinary or update Neon.

Each entry must include:

```json
{
  "universitySlug": "example-university",
  "universityName": "Example University",
  "missing": ["logo", "cover"],
  "logo": {"sourceUrl": "https://official.example/logo.svg", "sourceType": "official", "rightsBasis": "official brand asset", "proposedPublicId": "example-university-logo"},
  "cover": {"sourceUrl": "https://official.example/campus.jpg", "sourceType": "official", "rightsBasis": "official institutional image", "proposedPublicId": "example-university-cover"},
  "status": "ready"
}
```

Use `status: "hold"` with an exact reason when an asset is not clearly official, reusable or
identifiable. Do not invent images, use search-result thumbnails, or expose source URLs in public
catalogue copy. A later controlled media integrator will review these batches, upload approved
assets and apply the database update.

## Batch series

- `a-*.json` plus `second-pass-patches/patch-*.json` — the original July 2026 alphabetical pass over
  universities missing a logo **or** a cover. `scripts/build-media-upload-manifest.mjs` rolls these
  (and `india-pilot-*.json`) into `reviewed-upload-manifest.json`.
- `india-pilot-*.json` — the September 2026 India pilot (logos and covers).
- `cover-pass-*.json` — the September 2026 **cover-only** pass. Scope: every published university
  whose `universities.cover_image_url` was null or empty (164 records). Rolled up into
  `cover-pass-upload-manifest.json`, which is already in the shape
  `scripts/apply-media-enrichment.ts` expects.

`cover-pass-*.json` files are deliberately **not** matched by `build-media-upload-manifest.mjs`.
Most of these slugs already appear as `ready` in an `a-*.json` batch for their *logo*, so folding
both series into one manifest would trip that script's duplicate-slug guard. Apply the cover pass
via its own manifest instead:

```sh
MEDIA_MANIFEST_PATH=research/media-enrichment/cover-pass-upload-manifest.json \
  npx tsx scripts/apply-media-enrichment.ts
```

### Rules this pass added, learned the hard way

- `sourceUrl` must be a **direct image URL**, not a Wikimedia `/wiki/File:` description page. A
  description page is `text/html`; the apply script would upload it to Cloudinary as a document.
  Resolve Commons files through the `imageinfo` API and strip any `?utm_*` query string. Commons
  hash paths cannot be guessed — take the URL from the API response.
- Verify every URL before writing it down (`200`/`206` **and** an `image/*` content-type). Hot-linked
  institutional hero banners rot fast: three sources that resolved in July returned `403` by
  September.
- Prefer landscape and >=1000px wide; record the dimensions in `rightsBasis`. Portrait files make
  poor cover cards.
- **Look at the image.** A `200 image/jpeg` says nothing about the subject. Visual checks in this
  pass caught a Vietnamese secondary school offered as a Kyrgyz university, a macOS desktop
  screenshot, a Fotolia stock file, several logos-as-covers, and a blank white placeholder.
- Search Wikimedia Commons **before** scraping institutional sites, and search in the local
  language and script — that single change turned ~100 of the July pass's holds into ready entries.
