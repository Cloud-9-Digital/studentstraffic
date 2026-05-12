/**
 * Publish: NEET UG 2026 Cancelled explainer
 * Run: node scripts/seed-neet-ug-2026-cancelled.mjs
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { WebSocket } from "ws";
import readingTime from "reading-time";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envContent = readFileSync(join(root, ".env"), "utf8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [
        line.slice(0, index).trim(),
        line.slice(index + 1).trim().replace(/^['"]|['"]$/g, ""),
      ];
    })
);

const LOCAL_COVER_PATH = "/public/guides/neet-ug-2026-cancelled-cover.png";
const CLOUDINARY_ID = "studentstraffic/blog/neet-ug-2026-cancelled-cover";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const post = {
  slug: "neet-ug-2026-cancelled-what-happened-re-exam-cbi-probe",
  category: "Latest Updates",
  title:
    "NEET UG 2026 Cancelled: What Happened, Why the 3 May Exam Was Scrapped, and What Students Should Do Next",
  excerpt:
    "NEET UG 2026, held on 3 May 2026, was cancelled on 12 May 2026 after the NTA said it had reviewed inputs from central agencies and law-enforcement findings. Here is the full timeline, what is officially confirmed, what is still unclear, and what MBBS aspirants should do now.",
  metaTitle:
    "NEET UG 2026 Cancelled: Timeline, Reason, Re-Exam, CBI Probe, and Next Steps",
  metaDescription:
    "A detailed NEET UG 2026 cancellation explainer with the 3 May to 12 May timeline, official facts, reported developments, re-exam status, CBI probe, and what students should do next.",
  content: `## NEET UG 2026 Has Been Cancelled. Here Is the Verified Situation.

As of **12 May 2026**, the **NEET (UG) 2026 examination conducted on 3 May 2026 has been cancelled** and will be conducted again on a fresh date to be announced separately.

That is the core confirmed fact.

Everything beyond that needs to be separated carefully into:

1. **What has been officially confirmed**
2. **What has been widely reported by credible outlets**
3. **What students still do not know yet**

This article is written in that order so families do not confuse verified updates with rumours.

---

## What Is Officially Confirmed

The following points are supported by official NTA channels and official NTA web properties:

- **NEET (UG) 2026 was conducted on Sunday, 3 May 2026**
- **NTA had publicly said it was prepared for the smooth and secure conduct of the exam**
- **NTA released the provisional answer key after the exam**
- **On 12 May 2026, NTA announced that the 3 May 2026 exam had been cancelled**
- **A fresh exam will be held on dates to be notified separately**

The cancellation wording carried by multiple reports says the decision followed inputs examined by NTA in coordination with central agencies and investigative findings shared by law-enforcement agencies, with approval of the Government of India.

At the time of writing, **NTA has not yet published the new re-exam date on the main NEET website**.

---

## The Timeline: What Happened Between 19 April and 12 May 2026

### 1. Mid-April to end-April: leak rumours were publicly denied

Before the exam, NTA and major news outlets reported that fake paper-leak messages were circulating online. Students were told to rely only on official notices and verified handles.

This matters because it shows the public message before the exam was not "there may be a compromise," but effectively "ignore rumours and trust official channels."

### 2. 30 April to 3 May: the exam was presented as tightly secured

In the final run-up to the exam, NTA issued advisories on dress code, biometric exceptions, and exam-day conduct. It also published a notice saying it was fully prepared for secure conduct of NEET (UG) 2026 on **3 May 2026**.

That created the impression that the examination system was intact.

### 3. 3 May 2026: NEET UG 2026 was held

The exam took place in the scheduled **2 PM to 5 PM** window across India and overseas centres.

For lakhs of students, that should have been the decisive exam day for the 2026 MBBS cycle.

### 4. 6 May 2026: provisional answer key was released

NTA moved into the normal post-exam process and published the provisional answer key and recorded responses workflow.

This is one of the reasons the cancellation shocked students and parents: the exam process had already visibly moved ahead into answer-key review rather than being paused immediately after test day.

### 5. 12 May 2026: the entire 3 May exam was cancelled

On **12 May 2026**, the position changed completely. NTA announced that the examination conducted on 3 May 2026 would be cancelled and re-conducted later.

Multiple credible outlets also reported that the **Government of India ordered a CBI probe** into the matter.

---

## Why Was NEET UG 2026 Cancelled?

Here we need to be precise.

### What the official side has said

The official wording widely reproduced by major outlets does **not** go into a full public evidentiary explanation. Instead, it says the cancellation followed:

- inputs examined by NTA
- coordination with central agencies
- investigative findings shared by law-enforcement agencies
- approval of the Government of India

### What has been widely reported

Several major outlets have linked the decision to **paper-leak allegations and related irregularities**, with some reports pointing specifically to **Rajasthan, including Sikar**, as an important part of the emerging story.

### What remains unclear

As of **12 May 2026**, the following are still unclear in public official detail:

- exactly what evidence led to the cancellation decision
- whether the compromise was localized or system-wide
- whether any candidate-specific score processing will survive
- the date of the re-examination
- the revised result timeline

So the honest answer is:

**The exam stands cancelled. The broader reasons have been linked in reporting to leak allegations and investigation inputs, but the full official public evidence record is still not out.**

---

## What This Means for Students Right Now

### 1. The 3 May 2026 attempt no longer counts

Students should proceed on the assumption that the **3 May 2026 NEET attempt has no admission value** because the exam itself has been cancelled.

### 2. The next valid score will come only from the re-exam

Until NTA conducts the re-test and declares results, there is **no valid 2026 NEET UG score from the cancelled exam** for MBBS admissions.

### 3. Counselling timelines may shift

Because NEET UG drives MBBS admissions across India, any fresh exam date will almost certainly affect:

- result timelines
- counselling calendars
- private college decision timing
- MBBS abroad application planning for students who need a valid NEET score

### 4. MBBS abroad aspirants should not misunderstand this

If you are planning **MBBS abroad**, this cancellation does **not** mean NEET has disappeared.

Indian students who want a valid long-term pathway back to India still need a **valid qualifying NEET score** under current NMC rules for foreign medical education planning.

So for MBBS abroad aspirants, the practical implication is:

**You still need to prepare for the re-exam seriously.**

---

## What Students Should Do Next

### Keep doing these five things

1. **Track only official channels**
   Use [NTA](https://www.nta.ac.in/) and the official [NEET portal](https://exams.nta.ac.in/NEET/) as your primary sources.

2. **Do not treat social-media screenshots as final**
   In a situation like this, recycled screenshots, fake date cards, and edited notices spread very quickly.

3. **Preserve your exam documents**
   Keep your admit card, application details, confirmation page, ID proof copy, and any answer-key downloads.

4. **Shift back into preparation mode**
   Emotionally, students feel they are being forced to relive the same exam. That is real. But strategically, the best move is to protect readiness for a short-notice re-test.

5. **Avoid making irreversible admission decisions too early**
   Do not rush into an expensive private-seat booking, a management-quota commitment, or a questionable overseas "guaranteed admission" deal just because the official process has become uncertain for a few days.

---

## What Parents Should Understand

Parents often make mistakes in this exact kind of uncertainty window:

- overreacting to rumours
- freezing preparation because "the government will sort it out"
- paying agents early to reduce anxiety

The stronger approach is calmer:

- wait for the official re-exam announcement
- keep documents organised
- protect your child from constant WhatsApp panic
- maintain study rhythm without turning the house into a pressure cooker

This is a systems failure. It should not become a family decision failure too.

---

## The Bigger Trust Problem

The cancellation is not just an exam-calendar issue.

It is a trust issue.

Students sat for one of the most competitive exams in India under the assumption that:

- security arrangements were working
- official denials of leak rumours could be trusted
- the post-exam answer-key process meant the exam remained valid

When an exam is cancelled after all of that, the emotional damage is not limited to logistics. It changes how students and parents interpret every later notice.

That is why the next official steps matter so much:

- the re-exam date must come quickly
- communication must be clear
- the investigative process must not stay vague for too long

---

## For MBBS Abroad Students: One Important Warning

Some agents will try to exploit this moment.

Expect to hear sales lines like:

- "NEET is cancelled, so you can go abroad without it"
- "No need to wait for the re-exam, seats are closing"
- "We can secure admission first and fix compliance later"

Treat those claims as dangerous.

If you want a degree pathway that remains usable in India, **do not assume the cancellation removes the NEET requirement for foreign medical education**. It does not.

Related:
[MBBS Abroad Without NEET 2026: Why It's a Career Trap](/blog/mbbs-abroad-without-neet-truth-2026)  
[NEET Cutoff for MBBS Abroad 2026](/blog/neet-cutoff-for-mbbs-abroad-2026)  
[After NEET 2026: What to Do in the First 14 Days](/blog/after-neet-2026-first-14-days-plan-mbbs-abroad-private-mbbs-drop-year)

---

## Frequently Asked Questions

**Q: Has NEET UG 2026 really been cancelled?**

Yes. The **3 May 2026 NEET UG exam has been cancelled** and NTA has said it will be held again on a fresh date to be announced separately.

**Q: Was the exam cancelled officially on 12 May 2026?**

Yes. Reporting across major outlets attributes the announcement to NTA's official communication on **12 May 2026**.

**Q: Has the re-exam date been announced yet?**

At the time of writing, **no fresh date has been published on the official NEET website**.

**Q: Does this mean NEET is permanently abolished for 2026?**

No. The current position is **cancellation of the 3 May exam and re-conduct of NEET UG 2026**, not abolition of the exam.

**Q: If I want to study MBBS abroad, can I ignore the re-exam?**

That would be a risky assumption. Under the current NMC framework, Indian students still need a **valid qualifying NEET score** for a compliant foreign medical education path.

---

## Sources Reviewed for This Article

### Official and primary references

- [NTA main website](https://www.nta.ac.in/)
- [Official NEET examination portal](https://exams.nta.ac.in/NEET/)
- [NTA Notice Board Archive](https://www.nta.ac.in/NoticeBoardArchive)
- [NTA notice: "NTA Fully Prepared for Smooth and Secure Conduct of NEET (UG) 2026 on 3rd May 2026"](https://nta.ac.in/Download/Notice/Notice_20260502215114.pdf)

### Reporting reviewed for the cancellation and probe developments

- [Business Standard: Centre cancels NEET-UG 2026 amid paper leak allegations; re-test to follow](https://www.business-standard.com/education/news/centre-cancels-neet-ug-2026-amid-paper-leak-allegations-re-test-to-follow-126051200552_1.html)
- [India Today Best Colleges: NTA cancels NEET UG 2026 exam held on May 3, new examination dates to be announced soon](https://bestcolleges.indiatoday.in/news-detail/nta-cancels-neet-ug-2026-exam-held-on-may-3-new-examination-dates-to-be-announced-soon-9399)
- [India Today Best Colleges: NEET UG 2026 cancelled: reason behind decision and re-exam date, know what's next?](https://bestcolleges.indiatoday.in/news-detail/neet-ug-2026-cancelled-reason-behind-decision-and-re-exam-date-know-whats-next-9405)
- [India Today Best Colleges: NEET UG 2026 paper leak row explained](https://bestcolleges.indiatoday.in/news-detail/neet-ug-2026-paper-leak-row-explained-whatsapp-guess-paper-leak-allegations-and-ntas-response-9401)
- [Careers360: NEET UG 2026 cancelled; NTA to announce re-NEET dates soon](https://medicine.careers360.com/articles/neet-ug-2026-cancelled)
- [Times of India: NTA NEET UG 2026 answer key released](https://timesofindia.indiatimes.com/education/news/nta-neet-ug-2026-answer-key-released-at-neet-nta-nic-in-check-direct-link-omr-sheet-and-objection-details-here/amp_articleshow/130859603.cms)
- [Times of India: NEET UG 2026 paper leak rumours dismissed, NTA issues advisory to aspirants](https://timesofindia.indiatimes.com/education/news/neet-ug-2026-paper-leak-rumours-dismissed-nta-issues-advisory-to-aspirants/articleshow/130629066.cms)
- [NDTV: NEET UG 2026 exam on May 3: biometric exception details and guidelines](https://www.ndtv.com/education/neet-ug-2026-exam-may-3-check-biometrics-exception-details-and-guidelines-here-11429568)
- [NDTV: NTA issues warning over fake paper leak claims on social media](https://www.ndtv.com/education/neet-ug-2026-exam-nta-issues-warning-over-fake-paper-leak-claims-on-social-media-11427329/amp/1)

This article is based on the sources above and should be read as a **dated explainer as of 12 May 2026**. It will need updating once NTA publishes the re-exam date and any fuller official explanation.`,
};

async function uploadImage(localPath, publicId) {
  try {
    const existing = await cloudinary.api.resource(publicId);
    return existing.secure_url;
  } catch {}

  const uploaded = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    overwrite: false,
    resource_type: "image",
  });
  return uploaded.secure_url;
}

async function run() {
  const localCoverPath = join(root, LOCAL_COVER_PATH);
  if (!existsSync(localCoverPath)) {
    throw new Error(`Missing cover image: ${LOCAL_COVER_PATH}`);
  }

  console.log("=== Publish blog: NEET UG 2026 Cancelled explainer ===\n");

  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();

  try {
    const publishedAt = new Date();
    const coverUrl = await uploadImage(localCoverPath, CLOUDINARY_ID);
    const result = await client.query(
      `INSERT INTO blog_posts (
        slug,
        title,
        excerpt,
        content,
        cover_url,
        category,
        meta_title,
        meta_description,
        status,
        reading_time_minutes,
        published_at,
        created_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'published',$9,$10,$10,$10)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        cover_url = EXCLUDED.cover_url,
        category = EXCLUDED.category,
        meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description,
        status = 'published',
        reading_time_minutes = EXCLUDED.reading_time_minutes,
        published_at = EXCLUDED.published_at,
        updated_at = EXCLUDED.updated_at
      RETURNING id, slug, cover_url`,
      [
        post.slug,
        post.title,
        post.excerpt,
        post.content,
        coverUrl,
        post.category,
        post.metaTitle,
        post.metaDescription,
        Math.ceil(readingTime(post.content).minutes),
        publishedAt,
      ]
    );

    const row = result.rows[0];
    console.log(`✓ Upserted [${row.id}] ${row.slug}`);
    console.log(`✓ Cover: ${row.cover_url}`);
    console.log(`✓ Read time: ${Math.ceil(readingTime(post.content).minutes)} min`);
    console.log(`✓ Words: ~${post.content.split(/\s+/).filter(Boolean).length}`);
  } finally {
    client.release();
    await pool.end();
  }

  console.log("\n✅ Publish complete.\n");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
