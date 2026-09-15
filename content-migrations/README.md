# Content migrations

Research agents must create complete, source-backed catalogue payloads here and must not publish them directly.

Reserve a sequence safely when multiple Codex/Claude agents are packaging:

```text
npm run content:reserve -- --name canada-batch --description "Publish the reviewed Canada university batch."
```

Do not select the next number manually. The reservation command locks the sequence and creates the
directory plus manifest; the assigned agent then writes `payload.json`.

Until the assigned agent finishes, a reservation may contain only `manifest.json`. The offline
validator and publisher report and skip these incomplete reservations; they are not migrations and
cannot be applied. Once `payload.json` is added, the same numbered reservation is included in the
next validation/apply run.

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

The payload uses the validated catalogue-payload schema. During concurrent packaging, validate only
the assigned bundle with `npm run content:validate -- --id <migration-id>` so another agent's
incomplete reservation does not block the check. The controlled integrator runs unscoped
`npm run content:validate` across the complete sequence before publication.
Before the first use in an environment, apply the schema migration with `npm run db:migrate`.
After review, apply all pending bundles with `npm run content:migrate -- --apply`.

Framework payloads use an explicit programme `fee` object (`confirmed`, `indicative` or
`on_request`) and a private root `evidence` array. Each evidence record maps one material claim to
its source grade, checked date and review-by date. Grade C discovery sources, unsupported fee
treatment and banned filler fail the offline validator. Do not add sources or source URLs to public
copy.

Review-by expiry is time-based, so it is not a structural failure:

- `npm run content:validate` prints every expired review-by date as a `Warning:` line and still
  exits 0 when nothing else is wrong.
- `npm run content:migrate` (check) and `npm run content:migrate -- --apply` read
  `content_migrations` and apply the same rule: expired evidence in an **applied** bundle is a
  warning; expired evidence in a **pending** bundle is an error that stops the run before any write.
  The one exception is a pending bundle whose every university is superseded by a later bundle that
  is also pending, because that later bundle overwrites the same universities in the same run.
- The fix for expired evidence on published content is a superseding correction bundle, never an
  edit to the applied bundle.

### Corrections and the supersede rule

A later-numbered bundle may republish a university that an earlier bundle already published:

1. Reserve a new bundle with `npm run content:reserve` and copy the university's full payload from
   the earlier bundle (do not edit the earlier bundle), then change only the corrected copy and
   evidence.
2. Point that university's single ledger row at the NEWEST bundle: `migration_id` and
   `payload_file` name the new bundle, status `validated` (it becomes `published` after apply).
3. Eligibility then treats every earlier bundle containing that slug as historical. A ledger row
   still pointing at the earlier bundle while a newer one exists fails with an explicit error naming
   the newer bundle; so does a row pointing at any unrelated bundle.

Applying the superseding bundle goes through the normal publish path: the university and its
programmes are upserted by slug, that university's evidence rows are replaced, and refresh sends
only entity-scoped cache tags (`university:<slug>`, `university-programs:<slug>`, country, course
and city programme tags).

Offering `medium` must be a short language label (e.g. `English / Russian`) with delivery detail in `mediumNote`; only the 18 frozen, already-applied bundles in `LEGACY_FREE_TEXT_MEDIUM_MIGRATION_IDS` (`scripts/lib/content-migrations.ts`) are grandfathered with free-text mediums, and new bundles are never added to that list.

The target database records every ID, checksum and state in `content_migrations`. `db_applied` means
the catalogue transaction committed but search/cache refresh still needs to finish; the next apply
command resumes that refresh. `applied` means the complete publish workflow finished. Never edit an
applied bundle; create the next numbered migration to correct or extend published content.
