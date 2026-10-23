# Anna University - research notes (2026-10-23)

Durable notes behind `content-migrations/0149-india-anna-university`. Build: `node research-drafts/india/anna-university-build.mjs`.

## Key facts
- UGC State University, 1978, Guindy, Chennai. CEG year of starting 1794 (CEAP 2026), ACT 1944, SAP 1957.
- TNEA 2026 codes: CEG 1, ACT 2, SAP 3, MIT 4; constituent colleges 1013, 1014, 1015, 1026, 2025, 3011, 3016, 3018, 3019, 3021, 4020, 4023, 4024, 5010, 5017, 5022.
- Chennai UG domestic fee 2025-26 (latest published): regular tuition INR 6,000/semester, self-supporting INR 14,800/semester; semester totals INR 15,200 / 25,000; one-time INR 9,800; deposits INR 7,000.
- FN 2026-27: UG USD 7,500 (CEG CSE/ECE/IT/VLSI; MIT CSE/ECE/IT/AI&DS) or USD 3,750; PG USD 2,000; M.Sc. 5-year USD 5,000; processing USD 400 + 18% GST; initial deposit USD 1,000. 5% FN + 5% LDC/SIDS supernumerary seats per UG branch.
- CEAP 2026 PG tuition (year): CEG 50,400 / 75,400 (SS); ACT 40,400 / 65,400; SAP 25,700 / 38,200; MIT 26,000 / 45,000; BIT SS 26,000. Other charges CEG/ACT/SAP 15,860; MIT 40,260 / 46,280; BIT 38,260.
- M.Sc. 5-year SS 2026-27: tuition INR 17,500/semester.
- Calendars 2026-27: UG & PG classes 24 Aug 2026; PG (CEETA) 9 Jul 2026; MBA/MCA 2 Sep 2026.
- TNEA 2026: registration 3 May-5 Jun; general counselling 20 Jul-30 Aug. TANCET 9 May (MCA/MBA), CEETA-PG 10 May 2026.

## Taxonomy decisions
- Specialisations mapped to parent canonical courses (e.g. M.E. Structural -> me-mtech-civil-engineering; VLSI -> ECE; Industrial/Manufacturing/Production -> be-btech-industrial-production-engineering; AI&DS -> be-btech-data-science; Petrochemical -> chemical; Ceramic/Nano/Rubber M.Tech -> me-mtech-materials-engineering).
- 20 new canonical courses added to lib/data/program-taxonomy.ts (see final report).

## Open items for the user
- Tamil-medium B.E. (23 rows) need a `tamil` teaching-language code.
- B.Arch. needs a COA list check.
- NAAC grade, NIRF rank and NBA status were unreachable; add badges in a later correction once verified on the regulator lists.
- Domestic UG fees are the 2025-26 schedule; refresh when the 2026-27 schedule is posted.
