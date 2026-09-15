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
