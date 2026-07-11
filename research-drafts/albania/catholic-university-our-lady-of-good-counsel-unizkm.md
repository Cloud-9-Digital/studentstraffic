# Catholic University "Our Lady of Good Counsel" (UNIZKM) — Research Document

Country: Albania | Cities: Tirana (main) / Elbasan (second campus)
Research date: 2026-07-07
Status: Draft written and gate-checked (JSON below). See `catholic-university-our-lady-of-good-counsel-unizkm.json` in this same folder for the publish-ready draft.

## Key facts (multi-source corroborated)

- **Full name**: Catholic University "Our Lady of Good Counsel" (Albanian: Universiteti Katolik Zoja e Këshillit të Mirë — hence the acronym UNIZKM)
- **Type**: Private, Catholic-affiliated, non-profit
- **Founded**: 2004
- **Campuses**: Tirana (main) and Elbasan (secondary; Elbasan nursing education traces back to a nursing school founded there in 1994)
- **Scale**: ~1,945 students across both campuses; three faculties; ~20 study programs; ~450 Italian and ~100 Albanian faculty (per Wikipedia / unirank)
- **Academic model**: Health-sciences programs are joint/double-diploma courses with established Italian public universities:
  - Medicine, Dentistry, Nursing → University of Rome "Tor Vergata"
  - Pharmacy → University of Bari
  - Graduates receive a diploma co-issued by UNIZKM and the partner Italian university, recognised in Albania, Italy and the EU.
- **Medium of instruction**: Italian (with Albanian also used), across Medicine, Dentistry, Pharmacy and Nursing. One search-engine snippet described a "Cycle Degree Course in Medicine and Surgery in English" (title only, introduced 2023-2024), but the same and other snippets explicitly stated classes are taught in Italian with no English-language option — this is a genuine ambiguity in the available (indirect, cached) source material. Because it could not be resolved with confidence, **no English-medium claim is made anywhere in the draft**; Italian is stated as the medium of instruction throughout, which is the conservative/defensible reading.

## Programs identified

| Program | Duration | Credits (ECTS) | Partner university | Medium |
|---|---|---|---|---|
| Medicine and Surgery (single-cycle) | 6 years | 360 | Rome "Tor Vergata" | Italian |
| Dentistry and Dental Prosthodontics (single-cycle) | 6 years | 360 | Rome "Tor Vergata" (implied via Faculty of Medicine) | Italian |
| Pharmacy (single-cycle master's / "Laurea Magistrale a Ciclo Unico") | 5 years | 300 | University of Bari | Italian |
| Bachelor in Nursing | 3 years | 180 | Rome "Tor Vergata" | Italian |
| Physiotherapy, Economics, Architecture | — | — | — | (not built as course entries — outside the mbbs/medical-pg/bsc-nursing/pharmacy/bds course-slug set required by the publish gate, or insufficiently corroborated for course-level detail) |

Only Medicine (mbbs), Dentistry (bds), Pharmacy (pharmacy) and Nursing (bsc-nursing) were included as structured `programs` entries because those are the course slugs the publish gate recognises and because they had sufficient corroborated program-level detail (duration, ECTS, partner, medium).

## What was OMITTED and why

1. **Tuition fees** — omitted entirely. UniPage (a third-party but relevant aggregator) explicitly notes it does not display a fee figure for this institution and directs users to check the official site. No official fee page could be fetched directly (see Access note below), so no number — real or approximate — is stated anywhere in the draft. `feeNotes`/tuition fields were left out of the program objects rather than populated with a guess or a 0.

2. **NMC / FMGE / WDOMS recognition claims** — omitted / explicitly flagged as unverified. WDOMS listing status for UNIZKM could not be confirmed via web search (searches returned unrelated "Our Lady of Good Counsel" schools in the US/Australia, not medical-directory results). Because NMC guidance generally requires English-medium teaching for FMGE/NExT eligibility, and UNIZKM's programs are corroborated as Italian-medium, the draft explicitly tells students this is a real risk/open question to verify with NMC/WDOMS directly — it does NOT assert NMC recognition, and does NOT assert non-recognition either (since that wasn't confirmed either). Same treatment for PCI (Pharmacy) and INC (Nursing) — no regulator claim asserted.

3. **On-campus hostel/dormitory details** — omitted as a confirmed fact. No official page describing a UNIZKM-run international-student dormitory could be found. The draft states this honestly and recommends private rental as the default expectation, consistent with general Albania study-abroad practice.

4. **English-medium claim for the 2023-2024 "in English" course title** — omitted/not asserted, per the ambiguity described above. Treated conservatively as Italian-medium instead.

5. **Physiotherapy, Economics, Architecture programs** — not built out as structured `programs` entries (no course-slug match in the publish gate's allowed set, and thinner corroboration at the individual-program level). Mentioned only in the narrative `summary` as part of the university's overall faculty structure.

## Access note (why no curl-fetched HTML)

`https://www.unizkm.al` is protected by a Cloudflare bot-challenge ("Just a moment..." interstitial with `cf_chl_opt`), which returns HTTP 403/challenge pages to `curl -sL -A "Mozilla/5.0"` requests rather than real content. All official-site content used in this draft was therefore sourced via WebSearch result snippets (which quote/summarize the live official pages, e.g. `unizkm.al/study/course/...`, `unizkm.al/study/faculty/...`), cross-checked against independent third-party sources (Wikipedia, UniPage, unirank, edarabia) rather than relying on the official site alone. This satisfies the multi-source rule; the official site is still cited as a source (label: official pages) since its content was directly quoted/summarized by search snippets, not fabricated.

## Full source list

1. UNIZKM official website (homepage) — https://www.unizkm.al/en — official-university
2. UNIZKM official Medicine and Surgery program page — https://www.unizkm.al/study/course/corso-di-laurea-in-medicina-e-chirurgia/en — official-program
3. UNIZKM official Faculty of Pharmacy / Pharmacy program page — https://www.unizkm.al/study/course/corso-di-laurea-magistrale-a-ciclo-unico-quinquennale-in-farmacia/en — official-program
4. UNIZKM official Bachelor in Nursing program page — https://www.unizkm.al/study/course/corso-di-laurea-in-infiermieristica/en — official-program
5. UNIZKM official Elbasan campus page — https://unizkm.al/posts/slug/universita-cattolica-nostra-signora-del-buon-consiglio-sede-di-elbasan/en — official-university
6. Our Lady of Good Counsel University — Wikipedia — https://en.wikipedia.org/wiki/Our_Lady_of_Good_Counsel_University — other
7. UniPage — Catholic University "Our Lady of Good Counsel", Tirana: price of education — https://www.unipage.net/en/4787/catholic_university_our_lady_of_good_counsel — other
8. unirank — Catholic University Our Lady of Good Counsel rankings/admissions profile — https://www.unirank.org/al/uni/catholic-university-our-lady-of-good-counsel/ — other
9. Elbasan — Wikipedia (city context) — https://en.wikipedia.org/wiki/Elbasan — other

Additional sources consulted for general context (not cited in sourceBundle but informing background/caveats):
- edarabia.com university profile page (fees & reviews) — corroborated the "no confirmed tuition figure" finding
- General web results on Tirana student life/cost of living (studyabroad101.com, expat.com, coleurope.eu) — used only for general, non-controversial city-lifestyle facts
- General web results on NMC/FMGE requirements for MBBS-abroad (metaapply.io, moksh16.com, careers360, omkarmedicom) — used only to correctly frame the English-medium/FMGE caveat, not to assert UNIZKM's own recognition status

## Gate self-check

- countrySlug: "albania" — pass
- sourceBundle.sources: 9 entries, each with label/url/kind/checkedAt, includes official site — pass (>=2)
- structuredFacts: name, city, type (Private), establishedYear (2004, number), officialWebsite, bestFitFor (5 items), programs (4 items, each with courseSlug in {mbbs,bds,pharmacy,bsc-nursing}, title, officialProgramUrl, medium, durationYears) — pass
- draftContent: all 8 narrative fields present, non-empty, checked against the actual `findWeakContentMarkers` regex list in `scripts/publish-university-draft.ts` (pending official-source research / not yet verified / internal draft / needs official.../ still needs / before publication / do not publish...) — pass
- whyChoose: 5 items (>=3), **nested inside `draftContent.whyChoose`** — pass
- thingsToConsider: 5 items (>=3), **nested inside `draftContent.thingsToConsider`** — pass
- faq: 5 items (>=3), each {question, answer}, **nested inside `draftContent.faq`** — pass
- No tuition fabricated; honest caveats included for language of instruction and unconfirmed regulator recognition — pass

**Correction (2026-07-07, resumed session)**: an earlier version of this file had `whyChoose`/`thingsToConsider`/`faq` placed at the JSON **top level** (siblings of `draftContent`) instead of nested inside `draftContent`. `scripts/publish-university-draft.ts`'s `validateDraft()` reads these from `draftContent.whyChoose` / `draftContent.thingsToConsider` / `draftContent.faq`, and `scripts/seed-university-draft.ts` passes the top-level `draftContent` object through to the DB as-is — so the old file shape would have failed the publish gate (`whyChoose<3`, `thingsToConsider<3`, `faq<3`) despite the content itself already existing. Fixed by moving all three arrays inside `draftContent`. Re-validated against a script that mirrors `validateDraft()`'s exact logic: **no issues, gate passes.**

## Outcome

`ok = true` — draft is gate-passing (verified against the real gate logic in `scripts/publish-university-draft.ts`, not just a visual read) and durably saved. No DB publish was performed as part of this research task (out of scope for this agent); publishing would use `scripts/seed-university-draft.ts --file <path>` followed by `scripts/publish-university-draft.ts --queue-id <id>`.
