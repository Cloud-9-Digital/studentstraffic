# University Guide Draft Workflow

This folder is for source-backed university research batches that can be loaded
into the catalog as soon as the content is complete enough to publish honestly.

Use this workflow when turning a WDOMS university name into a full Students
Traffic guide:

1. Research from official university and official admissions or tuition pages.
2. Capture the exact source URLs and the date you checked them.
3. Write honest summaries. Do not guess fees, intake, medium, or hostel claims.
4. Set `published: true` for universities and programs once the source trail is
   complete and the page is ready to go live.
5. Save the result as a JSON batch in this folder.
6. Import with `npm run db:import:guide-drafts`.

Ground rules:

- Use WDOMS only as a name registry or cross-reference, not as the main
  content source.
- Tuition and intake claims must come from official university or official
  admissions pages.
- Preserve the official fee currency and amount in the draft even if USD
  normalization still needs review.
- If the school does not publish a reliable figure, keep the university out of
  the public finder and note that the fee is pending official confirmation.
- Do not overwrite live published universities or programs with weaker or less
  current information.

Recommended file naming:

- `research/university-guides/russia/batch-001.json`
- `research/university-guides/georgia/batch-001.json`
- `research/university-guides/kyrgyzstan/batch-001.json`
- `research/university-guides/uzbekistan/batch-001.json`

Minimum content standard per university:

- One verified program offering
- Three `whyChoose` bullets
- Three `thingsToConsider` bullets
- Three `bestFitFor` bullets
- Three FAQs
- Official website
- Source list with checked dates

Importer behavior:

- Inserts or updates universities and program offerings using the `published`
  values provided in the research batch
- Skips existing live published guides
- Skips countries that are not in the `countries` table yet
