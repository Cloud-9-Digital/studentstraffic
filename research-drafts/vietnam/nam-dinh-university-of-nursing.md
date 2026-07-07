# Research: Nam Dinh University of Nursing (NDUN) — HELD, NOT PUBLISHED

Status: **ok = false**. Research is thorough and multi-sourced, but the page cannot honestly
pass the publish gate for an India-audience nursing landing page because there is no
corroborated evidence of an English-taught program or an international/Indian-student
admissions pathway at this university. Publishing a `bsc-nursing` program card with an
invented "medium" or "officialProgramUrl" would violate the no-fabrication rule.

## Key facts (corroborated, multi-source)

- **Name (English)**: Nam Dinh University of Nursing (NDUN)
- **Name (Vietnamese)**: Trường Đại học Điều dưỡng Nam Định
- **Type**: Public university (Đại học công lập), under Vietnam's Ministry of Health (Bộ Y tế)
- **Founding lineage**:
  - Predecessor "Nam Dinh School of Physical Assistants" (Trường Y sỹ Nam Định) founded 8 September 1960
  - Renamed "Trường THYT Nam Hà"; upgraded to "Nam Dinh Medical College" (Trường Cao đẳng Y tế Nam Định) by Decision 65/HĐBT (12 Sept 1981)
  - Briefly merged into Thai Binh University of Medicine (1988–1991), then separated again (Decision 797/BYT-QĐ, 13 Aug 1991)
  - Upgraded to full university status as "Nam Dinh University of Nursing" on **26 February 2004** by Prime Minister's Decision No. 24/2004/QĐ-TTg — this is the year used as `establishedYear` for the modern university entity
  - (One English-language aggregator, studyinvietnam.edu.vn, describes a further "upgrade" in 2014 calling it "the first public university of Nursing in Vietnam" — this appears to refer to accreditation/status milestones rather than a second founding; the Vietnamese Wikipedia article and the Vietnamese university-ranking site VNUR both cite 2004 as the founding/establishment decision date, so 2004 was treated as the authoritative establishedYear.)
- **Location**: 257 Hàn Thuyên Street, Nam Định ward (formerly Nam Định city). Following Vietnam's 2025 provincial merger, this address now administratively sits in Ninh Bình province; the campus/city itself is still referred to as Nam Định.
- **Current Rector (Hiệu trưởng)**: TTND. TS. Trương Tuấn Anh (since Oct 2020)
- **Undergraduate (Cử nhân) programs offered**: Nursing (Điều dưỡng, code 7720301), Midwifery (Hộ sinh, code 7720302), Nutrition (Dinh dưỡng, code 7720401)
- **Postgraduate programs**: PhD in Nursing, Master of Nursing, Nursing Specialist Level I, Midwifery Specialist Level I
- **Faculties/departments**: Nursing–Midwifery; Clinical Medicine; Basic Medicine; Public Health; Basic Sciences
- **Scale**: ~2,000 full-time undergraduate students (Nursing, Midwifery, Public Health, Nutrition, plus bridging/upgrade bachelor programs) and 150–200 postgraduate learners; 306 staff (194 faculty, incl. 1 Associate Professor, 12 PhDs, 28 senior lecturers) plus 73 visiting lecturers from national/international universities and hospitals (per studyinvietnam.edu.vn).
- **International cooperation found**: A 2019 cohort of Lao students from Oudomxay Province, Laos, studied at NDUN under what appears to be a bilateral/regional government arrangement — not a general international-admissions or English-medium track. The university's official site has a "Hợp tác quốc tế" (International Cooperation) menu section, but its content could not be retrieved (see Access Issues below), and no English-taught program was corroborated anywhere.
- Studyinvietnam.edu.vn (aggregator) also mentions unspecified "scholarship" ties to partner institutions in Brunei, Canada, Thailand, Australia and Russia — this appeared only in a search-engine summary of that page; the underlying page itself could not be fetched to verify wording, so it is NOT included in structured facts.

## Why this does NOT meet the publish gate for an India-audience page

1. **No confirmed English-taught program.** Every discoverable primary and secondary source
   (official site's own Vietnamese content structure, Vietnamese Wikipedia infobox/body,
   VNUR ranking profile, studyinvietnam.edu.vn aggregator) describes NDUN's Cử nhân
   (Bachelor) programs — Nursing, Midwifery, Nutrition — as regular Vietnamese-medium
   domestic degree programs. No official page, official program URL, or credible
   secondary source states these are offered in English or specifically open to
   international/Indian applicants.
2. **No international/Indian admissions pathway found.** The only corroborated
   international-student activity is a 2019 Lao government-cooperation cohort — a narrow,
   non-general arrangement, not evidence of an open India-facing admissions track.
3. **The publish gate requires, for any program row, an explicit `courseSlug`
   (e.g. `bsc-nursing`), `officialProgramUrl`, and `medium` of instruction.** Fabricating
   "English" as the medium, or fabricating an official program URL for an
   English-taught nursing degree that was never confirmed to exist, would violate the
   exhaustive-then-omit / never-fabricate rule. Since NO program with a confirmed
   English medium and courseSlug could be established, `structuredFacts.programs` cannot
   be honestly populated with >=1 valid entry.
4. Given (1)-(3), the whole publish attempt is held rather than forced through with
   invented specifics.

## Access issues encountered (documented for future re-attempts)

- The official domain `https://ndun.edu.vn` and its HTTP variant, and the newer
  `https://new.ndun.edu.vn` mirror, were both attempted via `curl -sL -A "Mozilla/5.0"`.
  - HTTPS to `ndun.edu.vn` repeatedly failed with a TLS/schannel renegotiation error
    (curl exit code 56, "server closed abruptly (missing close_notify)"); HTTP redirected
    similarly and failed (exit 52, empty reply).
  - `new.ndun.edu.vn` pages loaded over HTTP, but all inner pages returned only the
    shared nav/footer template with an empty `<title></title>` and no route-specific
    body content (e.g. `/tuyen-sinh.html`, `/hop-tac-quoc-te.html`, `/dao-tao-dai-hoc.html`
    all returned byte-identical boilerplate apart from a live visitor counter),
    indicating the actual content is client-side-rendered / not present in the static
    HTML this fetch method can retrieve.
  - `studyinvietnam.edu.vn` (a Vietnam MOET-adjacent study-in-Vietnam directory) timed out
    on every direct `curl` attempt (curl exit 28), so it was only used via WebSearch's
    own indexed summary/snippet of that page — treated as a secondary, lower-confidence
    source and not relied upon for anything not corroborated elsewhere.
  - `en.wikipedia.org` has NO article for "Nam Dinh University of Nursing" (confirmed —
    search redirect page, not a real article). The Vietnamese-language Wikipedia article
    (`vi.wikipedia.org/wiki/Trường_Đại_học_Điều_dưỡng_Nam_Định`) DOES exist and was
    successfully fetched; it was the single most detailed/reliable structured source.
  - `vnur.vn` (Vietnam University Ranking, a Vietnamese university-ranking site) fetched
    successfully and corroborated founding year (2004), public status, and official
    website URL.
  - `heraldopenaccess.us` (an open-access journal host) fetched successfully; it hosts a
    2021 published paper on NDUN's Master's in Nursing program (joint with University of
    Medicine and Pharmacy, Ho Chi Minh City) — useful for confirming postgraduate nursing
    training exists, but not for undergraduate/international admissions specifics.

## Sources consulted (labelled URLs)

1. Nam Dinh University of Nursing — official site (English homepage, listed but NOT
   successfully fetched due to TLS errors): https://ndun.edu.vn/home.html/en
2. Nam Dinh University of Nursing — official site (Vietnamese root, NOT successfully
   fetched — TLS/HTTP errors): https://ndun.edu.vn/ and http://ndun.edu.vn/
3. Nam Dinh University of Nursing — newer official mirror, homepage (fetched
   successfully, confirms faculty list incl. "Khoa Điều dưỡng - Hộ sinh" and nav
   structure incl. "Hợp tác quốc tế" / international cooperation menu item, "Tuyển sinh
   Đại học" / undergraduate admissions menu item): http://new.ndun.edu.vn/
4. Nam Dinh University of Nursing — Vietnamese Wikipedia article (fetched successfully;
   primary structured-facts source: founding lineage, 2004 university-status decision,
   address, leadership, undergraduate/postgraduate program list, faculties, awards):
   https://vi.wikipedia.org/wiki/Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_%C4%90i%E1%BB%81u_d%C6%B0%E1%BB%A1ng_Nam_%C4%90%E1%BB%8Bnh
5. VNUR.VN (Vietnam University Ranking) — NDUN profile (fetched successfully; confirms
   founding year 2004, public type, official website URL, admission code "YDD"):
   https://vnur.vn/truong-dai-hoc-dieu-duong-nam-dinh/
6. studyinvietnam.edu.vn — NDUN detail page (direct fetch timed out repeatedly; used only
   via WebSearch's indexed summary as a secondary/lower-confidence source for scale and
   staffing figures, and the "upgraded ... 2014" claim, which is noted but not used as the
   primary establishedYear): http://studyinvietnam.edu.vn/detail-university/university-of-nam-dinh-nursing-511.html
7. Herald Open Access Journal — "Training Master's in Nursing Program of Nam Dinh
   University of Nursing and University of Medicine and Pharmacy, Ho Chi Minh City"
   (fetched successfully; confirms existence of a joint Master's in Nursing program,
   2017-2018 cohort study): https://www.heraldopenaccess.us/openaccess/training-master-s-in-nursing-program-of-nam-dinh-university-of-nursing-and-university-of-medicine-and-pharmacy-ho-chi-minh-city
8. WebSearch aggregated snippets referencing a 2019 Lao (Oudomxay Province) student
   cohort at NDUN, and unverified mentions of scholarship ties with institutions in
   Brunei, Canada, Thailand, Australia, and Russia (used only as directional context,
   NOT included in structured facts because the underlying pages could not be
   independently fetched/verified).

## What was OMITTED and why

- **All program entries** (Bachelor of Nursing / Midwifery / Nutrition): omitted from
  `structuredFacts.programs` because no source confirms an English medium of instruction
  or an official program URL/admissions pathway usable by Indian/international students.
  Publishing these as `bsc-nursing` course cards with a fabricated medium or program URL
  would violate the no-fabrication rule.
- **Tuition/fees**: not researched in depth given the above blocker, but no reliable
  figures were surfaced in passing either.
- **INC (Indian Nursing Council) / regulator framing**: entirely omitted. Since there is
  no confirmed pathway for Indian nursing students at all, asserting or even
  hedging INC-recognition language would be premature and potentially misleading.
  If NDUN is revisited later, this would need fresh, explicit confirmation of any
  degree-recognition status before any regulator is named.
- **The 2014 "first public nursing university" upgrade claim**: mentioned in the .md
  research notes above for completeness/context, but not used as the authoritative
  `establishedYear` (2004 was used instead, since it is corroborated by two independent,
  more primary-feeling sources — Vietnamese Wikipedia's cited government decision number,
  and VNUR's ranking profile — versus a single aggregator's paraphrase).

## Recommendation for future re-attempts

- Re-try official site access with a different fetch method/IP (the TLS renegotiation
  failure looks like a server-side or network-path quirk, not a hard block) — if the
  official "Hợp tác quốc tế" (international cooperation) and "Tuyển sinh" (admissions)
  pages can be read in full, they may reveal an English-taught track or an explicit
  international-student admissions channel not currently visible.
- If no such pathway is ever found, NDUN is likely not a good net-new addition to the
  India-audience Vietnam guide roster in its current form, since it has no verifiable
  door open to Indian applicants (unlike more clearly international-facing Vietnamese
  institutions such as Dai Nam University, VinUniversity, etc., which explicitly
  advertise English-medium nursing/medical tracks for foreign students).
