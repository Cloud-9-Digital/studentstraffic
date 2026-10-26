# Tamil Nadu brochures, batch 1

Checked 2026-10-26. Research only: no database writes, uploads or commits. Manifest: `research/brochures/tamil-nadu-batch1.json` (consumed by `npx tsx scripts/apply-brochures.ts tamil-nadu-batch1 --dry-run`).

Scope: India ledger rows with status `published` or `validated` whose latest `payload_file` mentions "Tamil Nadu" in the university `summary` or `cityProfile`. That gives **83 institutions**. Note that `jss-academy-of-higher-education-and-research` (Mysuru) qualifies because of its Ooty campus.

Result: **40 found**, **43 not found**, 0 skipped.

Verification: every found URL returned `%PDF-` in its first bytes, and its total size (from `Content-Range`/`Content-Length`, or a streamed byte count capped at 40 MB) is at most 40 MiB. Only headers and first bytes were fetched; no files are kept. Where a file prints no year in its text layer, the academic year is inferred from the server's upload/last-modified date, and the note says so.

## Found

| Institution | Title | Year | Size | Notes |
|---|---|---|---|---|
| Vellore Institute of Technology (`vellore-institute-of-technology`) | [Integrated M.Sc. information brochure 2026](https://vit.ac.in/files/prospectus/Int-M.Sc-Information-Brochure-2026.pdf) | 2026-27 | 5.2 MB | Programme-specific. Main VITEEE prospectus (vit.ac.in/files/VITEEE/VITEEE_Prospectus.pdf, 117.9 MB) and NRI prospectus 2026 (78.8 MB) exceed 40 MB. |
| Amrita Vishwa Vidyapeetham (`amrita-vishwa-vidyapeetham`) | [AEEE 2026 information handbook (B.Tech admissions)](https://webfiles.amrita.edu/2025/11/aeee-2026-information-handbook.pdf) | 2026-27 | 1.1 MB | Engineering UG handbook. Also: M.Tech 2026 handbook, B.Sc. (Hons) Physics brochure. |
| SRM Institute of Science and Technology (`srm-institute-of-science-and-technology`) | [Admission brochure 2026-27](https://webstor.srmist.edu.in/web_assets/downloads/2026/srm-admission-brochure-2026-2027.pdf) | 2026-27 | 6.3 MB |  |
| JSS Academy of Higher Education & Research (`jss-academy-of-higher-education-and-research`) | [UG and PG pharmacy information brochure 2026-27](https://jssaherstoragenew.blob.core.windows.net/jssuudstorage/webnotification/admission/A24_2363.pdf) | 2026-27 | 9.1 MB | No consolidated prospectus; programme brochures only. Pharmacy chosen because the Tamil Nadu (Ooty) campus is JSS College of Pharmacy. Others: allied health, M.Sc. life sciences, M.A. clinical psychology, MBBS counselling scheme 2026. |
| Kalasalingam Academy of Research and Education (`kalasalingam-academy-of-research-and-education`) | [Admission brochure 2026](https://www.kalasalingam.ac.in/wp-content/uploads/2025/12/Brochure2026.pdf) | 2026-27 | 3.4 MB | Uploaded December 2025 for the 2026 intake. |
| Arul Tharum VPMM College of Engineering and Technology (`arul-tharum-vpmm-college-of-engineering-and-technology`) | [VPMM Group of Institutions brochure (2025)](https://engineering.vpmm.in/content/PDF/vpmm_group_of_institution_brochure.pdf) | 2025-26 | 6.4 MB | Group-level brochure; academic year inferred from April 2025 upload date, not printed year. |
| Anna University (`anna-university`) | [CEAP 2026 information booklet (M.E./M.Tech./M.Arch./M.Plan. admissions)](https://cfa.annauniv.edu/cfa/pdf/CEAP_BOOKLET_INFORMATION_2026.pdf) | 2026-27 | 1.9 MB | PG admissions booklet. UG B.E. admission is via the state TNEA counselling brochure (static.tneaonline.org), which is not Anna University's own domain, so it was not used. Also: TANCET 2026 bulletin. |
| University of Madras (`university-of-madras`) | [Prospectus 2026-27 (university departments, CBCS)](https://egovernance.unom.ac.in/CBCS2627/download/Prospectus.pdf) | 2026-27 | 1.6 MB | Also: B.Sc. blended prospectus. |
| Dhanalakshmi Srinivasan College of Engineering and Technology (`dhanalakshmi-srinivasan-college-of-engineering-and-technology`) | [Admission brochure (2026 intake)](https://dscet.ac.in/assets/pdf/DSCETbrouchre-admission.pdf) | 2026-27 | 0.8 MB | Year inferred from April 2026 upload date; no year is printed in the file's text layer. |
| Bharathidasan University (`bharathidasan-university`) | [Regular admissions prospectus 2026-27](https://oms.bdu.ac.in/admissions/assets/docs/bdu-regular-admissions-2026-2027-prospectus.pdf) | 2026-27 | 0.8 MB |  |
| Madurai Kamaraj University (`madurai-kamaraj-university`) | [Admission notification and prospectus 2026-27](https://admissions.mkuniversity.ac.in/Prospectus.pdf) | 2026-27 | 1.4 MB |  |
| Vel Tech Rangarajan Dr Sagunthala R&D Institute of Science and Technology (`vel-tech-rangarajan-dr-sagunthala-rd-institute-of-science-and-technology`) | [VTUEEE 2026 information brochure (B.Tech admissions)](https://veltech.edu.in/brochure/VTUEEE_2026%20Brochure.pdf) | 2026-27 | 3.6 MB | Also: M.Tech brochure 2026, MBA brochure 2026, law brochure 2026. |
| Shiv Nadar University Chennai (`shiv-nadar-university-chennai`) | [Prospectus 2026-27](https://www.snuchennai.edu.in/wp-content/uploads/2026/04/SNU-Chennai-Prospectus-2026-27.pdf) | 2026-27 | 2.9 MB |  |
| Alagappa University (`alagappa-university`) | [Prospectus 2026-27](https://www.alagappauniversity.ac.in/docs/Admission_notification/ALU_Prospectus_2026-2027.pdf) | 2026-27 | 2.5 MB |  |
| Tamil Nadu Dr. Ambedkar Law University (`tamil-nadu-dr-ambedkar-law-university`) | [School of Excellence in Law prospectus 2026-27](https://tndalu.emsecure.in/Documents/Prospectus%20%202026-2027%20-%20School%20of%20Excellence%20in%20Law.pdf) | 2026-27 | 0.9 MB | Hosted on the university's admission portal tndalu.emsecure.in, which tndalu.ac.in links to. |
| Annamalai University (`annamalai-university`) | [Pharm.D. (six-year and post-baccalaureate) prospectus 2026-27](https://annamalaiuniversity.ac.in/adm/downloads/2026/prospectus/Engg_Pharm.D_Six_Year_Prospectus_2026-27.pdf) | 2026-27 | 1.1 MB | Only programme prospectuses for 2026-27 are posted (Pharm.D., Ph.D., PG extension centres). The 2025-26 B.E. (43.5 MB), Agri UG (121.8 MB) and two-year PG (131.2 MB) prospectuses exceed 40 MB. |
| Periyar University (`periyar-university`) | [University departments prospectus 2025-26](https://www.periyaruniversity.ac.in/Documents/2025/CDC/Prospectus.pdf) | 2025-26 | 4.1 MB |  |
| Tamil Nadu Dr. J. Jayalalithaa Fisheries University (`tamil-nadu-dr-j-jayalalithaa-fisheries-university`) | [UG admission prospectus 2026-27](https://admission.tnjfu.ac.in/Documents/TN/Notification/PROSPECTUS.pdf) | 2026-27 | 37.0 MB | 38.8 MB, close to the 40 MB limit. Linked from the 2026 UG admission portal; year inferred from May 2026 upload date. Also: PG programme prospectuses 2026-27. |
| Tamil Nadu Teachers Education University (`tamil-nadu-teachers-education-university`) | [M.Ed. brochure 2026-27](https://www.tnteu.ac.in/admin/file_storage/cms/10001%20-%20%20M.Ed.%20Brochure%20-%20(2026-2027)%20-%2012.06.2026.pdf.pdf.pdf.pdf) | 2026-27 | 2.4 MB | Programme-specific (the university's own direct-admission programme). |
| Sri Venkateswara College of Engineering (`sri-venkateswara-college-of-engineering`) | [Prospectus 2026](https://www.svce.ac.in/wp-content/uploads/2026/03/PROSPECTUS-2026.pdf) | 2026-27 | 5.5 MB | Also: SVCE brochure 2026. |
| Loyola College Chennai (`loyola-college-chennai`) | [Prospectus 2026-27](https://www.loyolacollege.edu/docs/pdf/Prospectus080526.pdf) | 2026-27 | 9.8 MB | The PDF behind the official 2026-27 prospectus flipbook (docs/Prospectus2026-2027.html). |
| National Institute of Technology Tiruchirappalli (`national-institute-of-technology-tiruchirappalli`) | [Integrated Teacher Education Programme (B.Sc. B.Ed.) admission brochure 2026-27](https://www.nitt.edu/home/admissions/bscbed/Admission%20Brochure_Integrated%20Teacher%20Education%20Programme_B.Sc.%20B.Ed._2026-27.pdf) | 2026-27 | 2.8 MB | B.Tech admission runs through national JoSAA counselling, with no NITT brochure. Also: M.A. admissions brochure 2026-27, MBA brochures. |
| PSG College of Arts & Science (`psg-college-of-arts-and-science`) | [Self-financing programmes brochure 2026-27](https://www.psgcas.ac.in/admissions/files/SF-2026-27_Brochure.pdf) | 2026-27 | 3.6 MB | Also: aided programmes brochure (year not stated). |
| Tamil Nadu Agricultural University (`tamil-nadu-agricultural-university`) | [UG admission brochure 2026-27](https://ucanapplym.s3.ap-south-1.amazonaws.com/TNAU+UG+Brochure+2026-2027+-+(13.05.2026).pdf) | 2026-27 | 1.8 MB | File is served from the official admission portal's storage bucket, linked from tnau.ucanapply.com. Also: UG prospectus (7.1 MB) and diploma brochure 2026-27. |
| Tamil Nadu Veterinary and Animal Sciences University (`tamil-nadu-veterinary-and-animal-sciences-university`) | [UG prospectus 2026-27](https://adm.tanuvas.ac.in/menudoc/New%20Doc/TANUVAS%20UG%20Prospectus%2022.05.2026.pdf) | 2026-27 | 19.3 MB | Also: PG prospectus 2025-26. |
| Karunya Institute of Technology and Sciences (`karunya-institute-of-technology-and-sciences`) | [All-course brochure 2026-27](https://admissions.karunya.edu/sites/admissions/files/uploads/brochures/2026/AllCourseBrochure_2026-27.pdf) | 2026-27 | 34.3 MB | Also: admission and scholarship brochure 2026. |
| Karpagam Academy of Higher Education (`karpagam-academy-of-higher-education`) | [University brochure (2025)](https://kahedu.edu.in/n/wp-content/uploads/2025/03/KAHE-BROCHURE.pdf) | 2025-26 | 11.7 MB | Year inferred from March 2025 upload date. Also: architecture brochure. |
| The Gandhigram Rural Institute (`gandhigram-rural-institute`) | [Prospectus 2026-27](https://www.ruraluniv.ac.in/includes/admissions/2026/pdf/Prospectus_202627.pdf) | 2026-27 | 2.3 MB |  |
| Sri Krishna Knowledge Foundation (`sri-krishna-arts-and-science-college-coimbatore`) | [Prospectus brochure (August 2026 edition)](https://sku.edu.in/wp-content/uploads/2026/08/Prospect-Brochure.pdf) | 2026-27 | 0.3 MB | Year inferred from August 2026 upload date. |
| Central University of Tamil Nadu (`central-university-of-tamil-nadu`) | [International admissions brochure 2025-26](https://cutn.ac.in/wp-content/uploads/2025/05/CUTN_International_Admission_Brochure-2025-26_042025.pdf) | 2025-26 | 0.7 MB | Domestic admission runs through NTA CUET; the CUET bulletins hosted on cutn.ac.in are NTA documents, so they were not used. |
| Manonmaniam Sundaranar University (`manonmaniam-sundaranar-university`) | [PG prospectus 2026-27](https://www.msuniv.ac.in/images/admission/PG_Prospectus.pdf) | 2026-27 | 0.7 MB | Year inferred from the file's creation date (25 April 2026). Also: integrated PG, AICTE, diploma and extension prospectuses. |
| Takshashila University (`takshashila-university`) | [Admission brochure 2025](https://takshashilauniv.ac.in/wp-content/uploads/2025/04/TU-2025-BROCHURE.pdf) | 2025-26 | 4.1 MB |  |
| Dhanalakshmi Srinivasan University (`dhanalakshmi-srinivasan-university`) | [University brochure (2023 edition)](https://www.dsuniversity.ac.in/pdf/DSU-Brochure.pdf) | unknown | 10.1 MB | Older than 2025-26: file uploaded August 2023, with no year printed. |
| Chettinad Academy of Research and Education (`chettinad-academy-of-research-and-education`) | [MBBS information bulletin 2026-27](https://caremedicine.care.edu.in/assets/images/MBBS_CHRI_Information_Bulletin_2026_27.pdf) | 2026-27 | 0.8 MB | Programme-specific. Also: MD/MS information bulletin 2026-27. Other programme prospectuses on care.edu.in date from 2020-2023. |
| Tamil Nadu Open University (`tamil-nadu-open-university`) | [Prospectus, calendar-year 2026 session](https://www.tnou.ac.in/Documents/2026/KVS/CY2026PROSPECTUS06022026.pdf) | 2026 | 1.0 MB | Also: academic-year 2025 prospectus. |
| C. Abdul Hakeem College (Autonomous), Melvisharam (`c-abdul-hakeem-college-melvisharam`) | [Day college prospectus 2020-21 (older edition)](https://cahc.edu.in/wp-content/uploads/2021/07/Day-College-Prospectus-20-21.pdf) | 2020-21 | 4.1 MB | Older than 2025-26. This is the only prospectus linked from the official prospectus page; an evening college 2020-21 prospectus is also listed. |
| Auxilium College, Vellore (`auxilium-college-vellore`) | [Admission prospectus 2026-27](https://admission.auxiliumcollege.edu.in/Content/assets/applicant_dashboard/Prospectus.pdf) | 2026-27 | 12.2 MB | Year inferred from January 2026 upload date on the live admission portal. |
| Thiagarajar College, Madurai (`thiagarajar-college-madurai`) | [Prospectus 2025-26](https://www.tcarts.in/college-2026-Pros.pdf) | 2025-26 | 33.2 MB | Titled 2025-2026 inside the file even though the filename says 2026. |
| Fatima College, Madurai (`fatima-college-madurai`) | [UG prospectus 2026-27](https://fatimacollegemdu.org/ufiles/Admission/2026-2027/UG-Prospectus.pdf) | 2026-27 | 9.4 MB | Also: PG prospectus 2026-27. |
| Tagore Engineering College (`tagore-engineering-college`) | [2024 admission leaflet (older edition)](https://tagore-engg.ac.in/pdf/2024-Admission-Leaflets-TEC-Final.pdf) | 2024-25 | 1.8 MB | Older than 2025-26. The other 'TEC E brochure' file was last modified in 2020. |

## Not found

| Institution | Reason |
|---|---|
| Sardar Raja College of Engineering (`sardar-raja-college-of-engineering`) | No brochure on src.org.in; research only records state TNEA/TANCET bulletins, which are not the college's own. |
| Joy University (`joy-university`) | Site has a 'Download Brochure' menu link, but it is script-driven and no PDF URL could be found in the HTML or search index. |
| Nellai College of Engineering (`nellai-college-of-engineering`) | No brochure on nce.ac.in; only the state TNEA bulletin is recorded. |
| Rajas Institute of Allied Health Sciences (`rajas-institute-of-allied-health-sciences`) | No brochure or prospectus PDF found on riahs.rmi.net.in. |
| Shanmugha Arts, Science, Technology & Research Academy (`shanmugha-arts-science-technology-and-research-academy`) | No brochure PDF on sastra.edu or the sas.sastra.edu counselling portal; admissions are shown as HTML pages only. |
| Sathyabama Institute of Science and Technology (`sathyabama-institute-of-science-and-technology`) | Official 2026 prospectus found (sist.sathyabama.ac.in/website/download/2026 - PROSPECTUS - SATHYABAMA - 11.02.2026.pdf), but it is 250.6 MB, over the 40 MB limit. |
| J.P. College of Engineering (`jp-college-of-engineering`) | No brochure on jpcoe.ac.in; only the state TNEA bulletin and the mandatory disclosure. |
| Periyar Maniammai University (`periyar-maniammai-university`) | Only a Ph.D. admission 2026 PDF and news bulletins on pmu.edu; no UG brochure. The admission portal is login-gated. |
| Bharathiar University (`bharathiar-university`) | The only prospectus PDF found ('DEC 2025 PROSPECTUS') is a Ph.D. prospectus. The UG/PG 2026-27 admissions pages link no prospectus PDF. |
| Kongu Engineering College (`kongu-engineering-college`) | Site is a JavaScript app; only an MCA brochure (year unknown), the policy manual and the mandatory disclosure turned up. No admission brochure. |
| Tamil Nadu National Law University (`tamil-nadu-national-law-university`) | Admission brochures (2027-28 UG, PGDFLP 2026-27) are linked only as Google Drive files, not hosted on the university's domain. |
| Tamil Nadu Physical Education and Sports University (`tamil-nadu-physical-education-and-sports-university`) | Only 'Admission Notification 2026' on tnpesu.org; no prospectus PDF. |
| Sri Sairam Engineering College (`sri-sairam-engineering-college`) | No admission brochure on sairam.edu.in; only syllabi, event brochures and the mandatory disclosure. |
| Madras Christian College (`madras-christian-college`) | 2026-27 admission page links the online application only; no prospectus PDF on mcc.edu.in. |
| Presidency College (`presidency-college-chennai`) | Admission runs through the state TNGASA portal; pcc.ac.in has only schedules and rank lists, with no prospectus. |
| PSG College of Technology (`psg-college-of-technology`) | No 2026 prospectus PDF on psgtech.edu; only the mandatory disclosure, academic calendar and event brochures. |
| Women's Christian College, Chennai (`womens-christian-college-chennai`) | Official 2026-27 prospectus exists (wcc.edu.in/wp-content/uploads/2026/04/Prospectus-2026-27-Final-Version.pdf), but the server returns HTTP 403 to scripted requests, both curl and Node fetch with the apply script's headers, so apply-brochures.ts would fail. It needs manual download or a different fetch route. |
| Queen Mary’s College, Chennai (`queen-marys-college-chennai`) | Admission runs through TNGASA; the site has only rank lists. No prospectus. |
| Kongunadu Arts and Science College, Coimbatore (`kongunadu-arts-and-science-college`) | Prospectus page tops out at Aided Prospectus 2025-26, and the site was unreachable from this environment (connection failure), so no file could be verified. |
| Mother Teresa Women's University (`mother-teresa-womens-university`) | Only a 2026-27 'programmes offered' notification and an old CDOE 'proposed' prospectus on a legacy subdomain; no current admission prospectus. |
| Tamil Nadu Dr. J. Jayalalithaa Music and Fine Arts University (`tamil-nadu-dr-j-jayalalithaa-music-and-fine-arts-university`) | No brochure or prospectus PDF found on tnjjmfau.in. |
| Sai University (`sai-university`) | Only a 2023-24 academic brochure link turned up in search, and no PDF URL was found on the site. |
| Ponnaiyah Ramajayam Institute of Science and Technology (`ponnaiyah-ramajayam-institute-of-science-and-technology`) | No admission brochure on prist.ac.in (only an R&D brochure page and accreditation documents). |
| Noorul Islam Centre for Higher Education (`noorul-islam-centre-for-higher-education`) | Official admission brochure is 2024-25 (admission.niuniv.net/portal/admissionbrochure2425.pdf) and 148.6 MB, over the 40 MB limit. |
| NMV University (`nmv-university`) | Page 'Admission Brochure 2026-27' exists, but it embeds no downloadable PDF (no file link in the HTML). |
| St Joseph University (`st-joseph-university-villupuram`) | Only a School of Law brochure 2024 (programme-specific, older); no main admission brochure. |
| Vinayaka Mission's Research Foundation (`vinayaka-missions-research-foundation`) | Only consultancy brochures and per-programme instruction PDFs; the general prospectus is a 2024-25 flipbook. No downloadable main admission prospectus. |
| National Institute of Technical Teachers Training and Research, Chennai (`national-institute-of-technical-teachers-training-and-research-chennai`) | No admission brochure PDF found on nitttrc.ac.in. |
| The Tamil Nadu Dr. M.G.R. Medical University (`the-tamil-nadu-dr-mgr-medical-university`) | Medical admission runs through the state selection committee; the university site has only per-course application forms and notifications, with no prospectus. |
| Rathinam Global (`rathinam-global`) | Homepage 'Download Brochure' button is script-driven and gated; no PDF URL is exposed. |
| Dhanalakshmi Srinivasan Institute of Research and Technology (`dhanalakshmi-srinivasan-institute-of-research-and-technology`) | No brochure or prospectus PDF found on dsirt.edu.in. |
| Quaid-E-Millath Government College for Women, Chennai (`quaid-e-millath-government-college-for-women-chennai`) | Government college admitted through TNGASA; only 'admission guidelines/counselling' notices, no prospectus. |
| Dr. Ambedkar Government Arts College (Autonomous), Chennai (`dr-ambedkar-government-arts-college-chennai`) | Government college admitted through TNGASA; only a department admission notice, no prospectus. |
| Government Arts and Science College, Thiruvottiyur, Chennai (`government-arts-science-college-thiruvottiyur-chennai`) | Government college admitted through TNGASA; no prospectus on the site. |
| Rajeswari Vedachalam Government Arts College, Chengalpattu (`rajeswari-vedachalam-government-arts-college-chengalpattu`) | Government college admitted through TNGASA; no prospectus on the site. |
| Muthurangam Government Arts College (Autonomous), Vellore (`muthurangam-government-arts-college-vellore`) | Government college admitted through TNGASA; only a 2024-25 PG admission notice, which is not a prospectus. |
| Government Thirumagal Mills College, Gudiyatham (`government-thirumagal-mills-college-gudiyatham`) | Government college admitted through TNGASA; no prospectus on the site. |
| Voorhees College, Vellore (`voorhees-college-vellore`) | The UG portal tells applicants to read the prospectus, but no prospectus PDF is linked (only a programme eligibility PDF). |
| The American College, Madurai (`the-american-college-madurai`) | E-prospectus page exists, but no PDF URL is exposed in the page HTML. |
| Kathir College of Engineering (`kathir-college-of-engineering`) | 'Admission e-brochure' page has no brochure PDF (only policy documents and the mandatory disclosure). |
| M.I.E.T. Engineering College (`miet-engineering-college`) | No admission brochure on miet.edu; only the mandatory disclosure, regulations and accreditation documents. |
| Dhanalakshmi College of Engineering (`dhanalakshmi-college-of-engineering`) | No admission brochure on dce.edu.in; only the state TNEA bulletin, academic schedule and accreditation documents. |
| Jerusalem College of Engineering (`jerusalem-college-of-engineering`) | Only event/FDP brochures and a brochure JPG image; no admission brochure PDF. |

## Older than 2025-26 (included, labelled in title)

- `c-abdul-hakeem-college-melvisharam`: day college prospectus 2020-21
- `tagore-engineering-college`: 2024 admission leaflet (2024-25)
- `dhanalakshmi-srinivasan-university`: university brochure uploaded August 2023, no year printed

## Caveats for the apply run

- `tamil-nadu-dr-j-jayalalithaa-fisheries-university` is 38.8 MB, close to the limit, so the upload may be slow.
- `tamil-nadu-agricultural-university` is served from the admission vendor's S3 bucket that backs the official portal `tnau.ucanapply.com`. `tamil-nadu-dr-ambedkar-law-university` is served from its official admission portal `tndalu.emsecure.in`, which `tndalu.ac.in` links to. Drop either entry if only first-party domains are acceptable.
- `central-university-of-tamil-nadu` uses the international admissions brochure (2025-26). Domestic admission is via NTA CUET.
- `thiagarajar-college-madurai`: the search-index extract of the file shows a 2025-2026 heading despite the 2026 filename.
- `womens-christian-college-chennai` has a valid 2026-27 prospectus, but the host returns 403 to scripted fetches, so it is excluded from the manifest.
- `sathyabama-institute-of-science-and-technology` (250.6 MB), VIT's main VITEEE prospectus (117.9 MB), Annamalai's B.E./Agri/PG prospectuses and NICHE's brochure (148.6 MB) exceed 40 MB.
