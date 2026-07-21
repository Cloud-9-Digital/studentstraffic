# Content migrations

Research agents must create complete, source-backed catalogue payloads here and must not publish them directly.

Each publishable batch is an immutable directory named with a four-digit sequence:

```text
content-migrations/
  0001-canada-university-batch/
    manifest.json
    payload.json
```

`manifest.json` must contain:

```json
{
  "version": 1,
  "id": "0001-canada-university-batch",
  "description": "Publish the approved Canada university batch.",
  "createdAt": "2026-07-19",
  "payload": "payload.json"
}
```

The payload uses the validated catalogue-payload schema. Validate it offline with `npm run content:validate`.
Before the first use in an environment, apply the schema migration with `npm run db:migrate`.
After review, apply all pending bundles with `npm run content:migrate -- --apply`.

Framework payloads use an explicit programme `fee` object (`confirmed`, `indicative` or
`on_request`) and a private root `evidence` array. Each evidence record maps one material claim to
its source grade, checked date and review-by date. Grade C discovery sources, stale evidence,
unsupported fee treatment and banned filler fail the offline validator. Do not add sources or
source URLs to public copy.

The target database records every applied ID and checksum in `content_migrations`. Never edit an applied bundle; create the next numbered migration to correct or extend published content.
