import { readFileSync, existsSync } from "node:fs";
import { v2 as cloudinary } from "cloudinary";
import { neon } from "@neondatabase/serverless";
import readingTime from "reading-time";

const envText = readFileSync(".env", "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['\"]|['\"]$/g, "")];
    }),
);

const slug = "mbbs-in-nepal-vs-bangladesh-for-indian-students-2026";
const imagePath = "tmp/blog-covers/mbbs-in-nepal-vs-bangladesh-for-indian-students-2026.png";
const publicId = `studentstraffic/blog-covers/${slug}`;

const content = `# MBBS in Nepal vs Bangladesh 2026: Which Is Better for Indian Students?

If you are an Indian student comparing **MBBS in Nepal vs Bangladesh**, the better choice is not decided by country name or an advertised fee alone. **Nepal is usually the more familiar cross-border option with a shorter travel distance and a Medical Education Commission-led entrance process; Bangladesh has a more formal foreign-student application route through DGME and a large medical-college ecosystem.** For both, the university, course structure, clinical training, internship arrangement, and India-return compliance must be checked separately before you pay.

For an Indian family, the practical decision is this: choose Nepal if proximity, family access, and a clearly documented institution-specific pathway matter most; consider Bangladesh if the DGME foreign-student process, selected college, and written fee and internship terms fit your profile better. Neither country is automatically “NMC approved” as a whole. NMC compliance is assessed against the foreign medical graduate rules and the qualification and training actually completed.

## Nepal vs Bangladesh MBBS: quick answer

| Decision factor | Nepal | Bangladesh |
|---|---|---|
| Main foreign-student pathway | Check the Medical Education Commission (MEC) notices, entrance rules, and the university or college route | Apply through the Directorate General of Medical Education (DGME) foreign-student system and current circular |
| Travel and family access | Usually easier for families in North and East India because of proximity and overland or short-flight options | Short international flights are available, but city and college location still affect travel and living arrangements |
| Academic structure | Verify the exact university curriculum, duration, language, clinical years, and internship terms | Verify the exact college, university affiliation, curriculum, language, clinical years, and internship terms |
| Cost decision | Do not rely on a country average; confirm tuition, hostel, deposits, exam charges, food, travel, and currency exposure in writing | Confirm the DGME circular, college fee schedule, admission and internship charges, accommodation, and refund terms |
| India-return question | The degree and training must satisfy the NMC framework applicable to your admission date | The same NMC framework applies; Bangladesh’s foreign-student process does not replace India’s licensing requirements |
| Best fit | Students prioritising proximity and a carefully verified Nepal institution | Students comfortable with a structured foreign-student process and a carefully verified Bangladesh college |

This table is a decision framework, not a blanket ranking. Fees, seats, deadlines, university affiliations, and rules can change by intake and institution.

## What does NMC recognition mean for Nepal or Bangladesh?

For an Indian student, the important question is not “Is Nepal recognised?” or “Is Bangladesh recognised?” in the abstract. The question is whether the specific primary medical qualification and the education completed at the chosen institution meet the applicable **National Medical Commission (NMC) Foreign Medical Graduate Licentiate (FMGL) requirements**.

The NMC’s published FMGL material describes conditions that include a minimum course duration, English as the medium of instruction, a curriculum and training broadly comparable with Indian MBBS requirements, and a qualification that is recognised for registration in the country where it was awarded. The current NMC rules page also lists the FMGL Regulations 2021 and an FMG FAQ dated 8 June 2026. Regulations and public notices should be checked at the time of admission because the process can evolve.

For students admitted after 18 November 2021, NMC’s March 2026 clarification says the CRMI Regulations 2021 apply and that a one-year compulsory rotating medical internship in India is required after qualifying the applicable foreign-graduate licensing examination, subject to the conditions in the notice. This is a planning issue, not a promise of registration. A student should keep the admission letter, curriculum, attendance and clinical-training records, internship certificates, transcripts, and proof of the institution’s local recognition.

Before paying any Nepal or Bangladesh college, ask for written answers to these questions:

1. What is the awarding university and the exact primary medical qualification?
2. Is the institution authorised to teach the full programme to international students for the relevant intake?
3. What is the exact medium of instruction in lectures, practicals, clinical postings, and examinations?
4. Where do clinical rotations take place, and are they compulsory and physically onsite?
5. How is the internship structured, and what document proves its completion?
6. Can the college show its current local regulator or council status and the published curriculum?
7. Are any semesters, clinical years, or examinations delivered online?

## Admission pathway: Nepal vs Bangladesh

### How admission works in Nepal

Nepal’s Medical Education Commission operates the Entrance Registration Application (ERA). Its official registration instructions identify passport or Aadhaar documentation for foreign applicants and tell applicants to check the detailed eligibility notice before paying the application fee. The MEC portal has also published MECEE-BL notices for the 2026 cycle. That means a student should not treat an agent’s “direct admission” message as a substitute for checking the relevant MEC notice and the university’s own instructions.

Your Nepal checklist should include passport validity, Grade 12 or equivalent science transcripts, NEET evidence where required for an Indian applicant, identity documents, photographs, entrance or eligibility documents, and a written offer that names the university, programme, campus, fees, and refund terms. Confirm whether the admission is to the full medical programme or a pathway that still requires another selection step.

### How admission works in Bangladesh

Bangladesh’s DGME maintains a foreign-student application system and publishes separate circulars and eligibility lists. The DGME notices page lists the MBBS/BDS admission circular for foreign students for session 2025–26, later extensions, and eligibility-list updates. The foreign-student portal also displays the session status and provides application support information.

This route is more document-driven than a simple college-level offer. Follow the current DGME circular, upload the requested academic and identity documents, and confirm that the selected college appears in the relevant official process. Ask the institution to explain the marks-equivalence process, foreign-student category, admission confirmation, payment schedule, and what happens if a student is not included in the final eligibility or allocation outcome.

### Which pathway is easier?

Neither is automatically easier. Nepal may feel simpler geographically, but its entrance and eligibility rules still need to be followed. Bangladesh may look more centralised through DGME, but the student must meet the circular’s academic, document, and selection requirements. The smoother pathway is the one where your profile matches the current official notice and the college provides complete written documentation.

## Total cost: how should Indian families compare Nepal and Bangladesh?

Use a **five-year or full-course budget**, not just the first-year tuition quote. The total should include:

| Cost line | What to verify before signing |
|---|---|
| Tuition | Annual amount, currency, escalation, payment milestones, and whether clinical years cost more |
| Admission and deposits | Application, processing, seat confirmation, refundable deposit, and document fees |
| Hostel or rental | Compulsory hostel rules, room type, utilities, security deposit, and food |
| Academic costs | Exam, library, lab, insurance, uniform, equipment, books, and graduation charges |
| Travel and immigration | Flights or ground travel, visa or permit costs, renewals, local transport, and family visits |
| Currency risk | Whether the fee is fixed in local currency, US dollars, or Indian rupees and who absorbs exchange changes |
| India-return costs | Licensing-exam preparation, travel, documents, medical registration, and the required internship planning |

Do not compare a Nepal tuition figure with a Bangladesh tuition figure if one quote includes hostel and the other does not. Do not count a “scholarship” until you know whether it is a fee waiver, a one-time discount, a merit condition, or a marketing adjustment. Request an itemised fee sheet signed or issued by the institution, and compare the total payable amount in the currency you will actually use.

## Clinical training, language, and student life

The name of the country does not prove clinical depth. Ask for the teaching-hospital names, bed or patient exposure description, clinical rotation calendar, attendance rules, and the role of the student in supervised training. A college that cannot explain where the later-year clinical work happens is not ready for your payment.

English-medium claims also need care. English may be the formal teaching language while patient interaction requires Nepali, Bengali, or another local language. Local-language learning can be an advantage for patient communication, but it is a risk if the college treats language support as optional and does not explain how international students are prepared for clinical postings.

Nepal’s proximity can help with family visits, food familiarity, and lower travel friction for some Indian regions. Bangladesh may offer a dense urban environment and a broad range of college locations, but daily life varies sharply by city, hostel, transport, and campus support. In either country, speak to current students who are enrolled at the exact campus—not only alumni or counsellors discussing the country generally.

## Scholarships and financial planning

Families should separate **admission affordability** from a genuine scholarship. A real award should specify eligibility, duration, renewal conditions, exclusions, and whether it survives a change of college or academic performance. Ask whether a discount applies to tuition only or also to hostel, exam, registration, and internship charges.

For most Indian students, the safer plan is to prepare a full-cost budget first, then treat any scholarship as upside. Keep an emergency reserve for currency movement, health costs, delayed transfers, travel, and a possible extra term. Students Traffic can help review a scholarship claim against the official college notice and calculate the likely payable amount rather than accepting a headline discount.

## Nepal or Bangladesh: which should you choose?

Choose **Nepal** when:

- proximity and family access materially reduce your risk or cost;
- the exact university and programme provide complete curriculum, clinical, internship, and fee documents;
- you are prepared to follow the MEC and institution-specific process; and
- the India-return plan is documented before admission.

Choose **Bangladesh** when:

- the college is present in the current DGME foreign-student pathway or can show the official basis for your admission;
- the marks-equivalence, eligibility, fee, and internship steps are clear in writing;
- the campus has transparent teaching-hospital and clinical-rotation information; and
- your family is comfortable with the location, accommodation, travel, and total budget.

Pause and do more verification when a representative says “NMC approved country,” guarantees a licence or FMGE result, asks for payment to a personal account, refuses to share the official fee circular, or cannot name the awarding university. A low quote is not a saving if the course structure or documents later create an India-return problem.

## A practical 7-day decision plan

**Day 1:** Write your non-negotiables: total budget, NEET status, preferred travel distance, language comfort, and India-return goal.

**Day 2:** Shortlist two or three exact institutions in Nepal and Bangladesh; do not shortlist countries only.

**Day 3:** Download the current MEC or DGME notice and the university’s official programme and fee material.

**Day 4:** Ask each institution the seven recognition and clinical questions above and keep the replies in writing.

**Day 5:** Speak to current students from the exact campus about hostel, attendance, clinical access, hidden costs, and support.

**Day 6:** Build a full-course budget and a document folder for NMC, admission, visa, and India-return records.

**Day 7:** Have an independent counsellor review the shortlist before any deposit is paid.

Students Traffic can help with that final review: profile evaluation, Nepal-versus-Bangladesh shortlist building, fee-sheet checks, scholarship-fit review, and application support. Bring your NEET and Grade 12 details, budget, preferred intake, and any offer letter so the recommendation is based on your actual options.

## Frequently asked questions

**Q: Is MBBS in Nepal valid in India?**
It may support an India-return pathway only when the exact qualification and education meet the NMC rules applicable to your admission and you complete the required licensing and internship steps. Country-level claims are not enough.

**Q: Is MBBS in Bangladesh valid in India?**
The same principle applies. Verify the awarding institution, local recognition, curriculum, onsite clinical training, internship, and the NMC requirements before admission. Bangladesh’s DGME process does not itself grant an Indian medical licence.

**Q: Which is cheaper, Nepal or Bangladesh for MBBS?**
There is no reliable country-wide answer. Compare the institution-specific full-course total, including tuition, hostel, food, exams, deposits, travel, currency movement, and India-return costs.

**Q: Is NEET required for Indian students applying to Nepal or Bangladesh?**
Indian students should verify the current Indian and destination-country requirements for the relevant intake. Do not rely on an agent’s verbal assurance; keep the official notice and your eligibility proof.

**Q: Do I need an entrance exam for MBBS in Nepal?**
Nepal’s Medical Education Commission publishes entrance and eligibility notices. Check the current MEC pathway and the exact institution’s instructions before paying an application fee.

**Q: Can I get direct admission to MBBS in Bangladesh?**
A college may guide you through the process, but foreign-student admission is governed by current DGME circulars and eligibility procedures. Confirm your application status through the official system and keep every acknowledgement.

**Q: Is English the medium of instruction in both countries?**
Many programmes describe medical teaching in English, but the exact course must be checked. Ask how lectures, examinations, clinical documentation, and patient communication are handled at the campus you will attend.

**Q: Which country is safer for Indian students?**
Safety depends more on the city, hostel, transport, campus supervision, local support, and emergency process than on a country label. Review the exact accommodation and speak to current students and parents.

**Q: Are scholarships available for MBBS in Nepal or Bangladesh?**
Some institutions or official schemes may offer discounts or scholarships, but terms vary. Verify the award letter, renewal conditions, exclusions, and whether it is available to foreign students for your intake.

**Q: Should I choose Nepal or Bangladesh if I want to practise in India?**
Choose the exact institution with the clearest evidence of course compliance, local recognition, onsite training, records, and India-return planning. The country alone cannot answer a licensing question.

---

**Sources and verification note — checked 24 July 2026:** NMC [Rules & Regulations](https://www.nmc.org.in/rules-regulations-nmc/), including the FMGL Regulations 2021 and the 8 June 2026 FMG FAQ; NMC [March 2026 FMG public notice](https://www.nmc.org.in/MCIRest/open/getDocument?path=%2FDocuments%2FPublic%2FPortal%2FLatestNews%2FBoardPubNotice_FMG_merged.pdf); Nepal Medical Education Commission [ERA registration instructions](https://entrance.mec.gov.np/Registration/Instruction) and [official entrance portal](https://entrance.mec.gov.np/); Bangladesh DGME [foreign-student notices](https://dgme.gov.bd/pages/notices), [2025–26 foreign-student circular](https://dgme.gov.bd/site/notices/284778ef-a88a-4fdf-9117-ea67ad11bd5e/MBBS-BDS-Admission-Circular-for-Foreign-Students-Session-2025-2026), and [foreign-student application portal](https://foreignstudents.dgme.gov.bd/login). Fees, seats, deadlines, visa rules, and licensing procedures can change; verify the current official notice and exact institution before payment.`;

const post = {
  title: "MBBS in Nepal vs Bangladesh 2026: Which Is Better for Indian Students?",
  excerpt: "A practical Nepal vs Bangladesh MBBS comparison for Indian students covering admission, total cost, NMC checks, clinical training, scholarships, safety, and India-return planning.",
  category: "Comparison Guide",
  metaTitle: "MBBS in Nepal vs Bangladesh 2026 Guide",
  metaDescription: "Compare MBBS in Nepal vs Bangladesh for Indian students: fees, admission, NMC checks, clinical training, scholarships, safety, and India-return planning.",
};

async function uploadCover() {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
  try {
    const existing = await cloudinary.api.resource(publicId);
    return existing.secure_url as string;
  } catch {
    const uploaded = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      overwrite: false,
      resource_type: "image",
      format: "png",
    });
    return uploaded.secure_url;
  }
}

async function main() {
  if (!existsSync(imagePath)) throw new Error(`Missing cover image: ${imagePath}`);
  const sql = neon(env.DATABASE_URL);
  const existing = await sql.query("select id from blog_posts where slug = $1 limit 1", [slug]);
  if (existing.length) throw new Error(`Refusing to duplicate existing slug ${slug}`);
  const coverUrl = await uploadCover();
  const publishedAt = new Date();
  const rows = await sql.query(
    `insert into blog_posts (slug, title, excerpt, content, cover_url, category, meta_title, meta_description, author_slug, status, reading_time_minutes, published_at, created_at, updated_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'published',$10,$11,$11,$11)
     returning id, slug, title, cover_url, status, author_slug, published_at, reading_time_minutes`,
    [slug, post.title, post.excerpt, content, coverUrl, post.category, post.metaTitle, post.metaDescription, "bharat-vasireddy", Math.ceil(readingTime(content).minutes), publishedAt],
  );
  console.log(JSON.stringify({ ...rows[0], wordCount: content.trim().split(/\s+/).length, coverUrl }, null, 2));
}

main().catch((error) => { console.error(error); process.exit(1); });
