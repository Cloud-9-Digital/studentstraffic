/**
 * Seed batch 4: Safety for Female Students
 * Run: node scripts/seed-blogs-batch4.mjs
 */
import { readFileSync } from "fs";
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
  envContent.split("\n").filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^['"]|['"]$/g,"")]; })
);
cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET });

// We're reusing the student life cover image since it fits perfectly and we hit the generation quota.
const BRAIN = "/Users/bharat/.gemini/antigravity/brain/6120125f-960e-4e07-a96e-a884a178093f";

async function uploadImage(localPath, publicId) {
  try { const e = await cloudinary.api.resource(publicId); console.log(`  [skip] ${publicId}`); return e.secure_url; } catch {}
  const r = await cloudinary.uploader.upload(localPath, { public_id: publicId, overwrite: false });
  console.log(`  [ok] ${r.secure_url}`); return r.secure_url;
}

const posts = [
  {
    slug: "is-mbbs-abroad-safe-for-female-students-2026",
    category: "Student Life",
    // Reusing the general student life image which features a group of Indian medical students
    coverLocalPath: join(BRAIN, "blog_student_life_abroad_1774959012010.png"),
    coverPublicId: "studentstraffic/blog/indian-student-life-mbbs-abroad-2026", 
    title: "Is MBBS Abroad Safe for Indian Female Students? A Parent's Guide (2026)",
    excerpt: "The primary concern for every parent sending their daughter abroad for MBBS is safety. An honest assessment of hostel security, city crime rates, cultural attitudes, and practical advice for female students in medical universities across Russia, Central Asia, and East Europe.",
    metaTitle: "Is MBBS Abroad Safe for Indian Girls? 2026 Reality Check | Students Traffic",
    metaDescription: "Are Russia, Kazakhstan, and Georgia safe for Indian female medical students? Complete safety guide covering hostels, city life, and what parents need to know.",
    content: `## The Primary Concern for Parents

When discussing MBBS abroad, students focus on the NEET cutoff, the hospital quality, and the weather. But parents, particularly those of female students, have exactly one primary question before all others: **"Is it strictly safe to send my daughter 4,000 kilometers away for six years?"**

It is a completely valid concern. 

Every year, thousands of Indian girls enroll in medical universities in Russia, Kazakhstan, Georgia, Bangladesh, and Uzbekistan. The objective reality on the ground in these countries is often fundamentally different from the perceptions held back home. This guide provides an unfiltered assessment of safety for female students pursuing MBBS abroad in 2026.

---

## Global Safety Perceptions vs. Reality

It is a common misconception that emerging nations or former Soviet republics are inherently dangerous. In reality, the day-to-day street safety in cities like Moscow, Almaty, or Tbilisi often surpasses many major Indian metropolitan areas in terms of female security and freedom of movement.

### 1. General Street Safety and Violent Crime
Violent crime against international students is exceptionally rare across the primary MBBS abroad destinations.
*   **Russia:** Major cities like Moscow, St. Petersburg, and Kazan are heavily policed with extensive CCTV surveillance. Street harassment is culturally unacceptable and legally penalized.
*   **Georgia (Tbilisi):** Frequently ranks among the top 20 safest countries globally. Walking in Tbilisi late at night is generally considered safe. Police are helpful and untainted by petty corruption.
*   **Kazakhstan (Almaty/Nur-Sultan):** Very safe for international students. The visible police presence is high.
*   **Bangladesh:** Highly conservative society; the street environment is functionally identically to tier-2 Indian cities, but university campuses maintain extreme security.

*Rule of thumb:* Petty crime (pickpocketing in crowded markets or on public transport) does exist, particularly in Russia and Kyrgyzstan, as it does in any global city. But physical violence or targeted harassment of Indian female students is statistically anomalies.

---

## The Hostel Environment: Security and Infrastructure

The most important physical environment for safety is the university hostel, where a student will spend the majority of her non-clinical time.

**Separate vs. Co-ed Hostels:**
*   Most state medical universities in Russia and Kazakhstan operate **co-ed** hostel buildings, but individual floors, wings, or specific apartments (blocks) are strictly segregated by gender. 
*   **Bangladesh** maintains completely separate, highly secure hostels for female students with strict entry and exit times.
*   If separate hostels are a strict non-negotiable requirement for a parent, Bangladesh, specific universities in Uzbekistan, and select private universities in Georgia are the best choices.

**Hostel Security Features:**
*   **Access Control:** Almost all university-operated hostels now use electronic access cards or biometric entry.
*   **Guards:** 24/7 security guards (often older, strict local staff known as "Dezhurnaya" in Russian-speaking countries). No unauthorized visitors are permitted, especially past evening curfew hours.
*   **Curfews:** Most Russian and Central Asian universities enforce a hostel curfew (typically between 10:00 PM and 11:30 PM). 
*   **Cameras:** Surveillance in all common areas, corridors, and kitchens.

**Private Flats vs. University Hostels:**
While living in a rented private apartment becomes an option in Year 3 or 4, we strongly advise female students to remain in the university hostel for at least the first two years. Hostels provide a built-in peer support network and institutional security that private landlords cannot offer.

---

## Cultural Attitudes Toward Indian Women

*   **Respectful Distance:** The prevailing culture in Russia, Georgia, and Central Asia is one of respectful distance. The physical boundary issues sometimes experienced in crowded South Asian public spaces are not the cultural norm there.
*   **The Foreigner Factor:** Locals generally view Indian students purely as transient academics. In countries like Kazakhstan and Uzbekistan, there is a strong cultural affinity for Indians.
*   **Attire:** In Russia and Georgia, the culture is quite liberal, and female students can dress as they please. In Uzbekistan, Kyrgyzstan, and Bangladesh, dressing modestly (e.g., covering shoulders and knees) is not legally mandated but is culturally appreciated and attracts less unwanted attention in local markets.

---

## Country-by-Country Safety Breakdown

| Country | Street Safety | Hostel Strictness | Cultural Vibe |
|---|---|---|---|
| **Georgia** | ⭐⭐⭐⭐⭐ | Medium | Highly hospitable, European, extremely safe at night. |
| **Russia** | ⭐⭐⭐⭐ | High | Regulated, strict hostel rules, heavy CCTV reliance. |
| **Kazakhstan** | ⭐⭐⭐⭐ | High | Friendly, structured, strong institutional support. |
| **Uzbekistan** | ⭐⭐⭐⭐ | High | Conservative, orderly, strong police presence. |
| **Bangladesh**| ⭐⭐⭐ | Extreme | Feels like a strict Indian boarding school. Extremely regulated. |
| **Kyrgyzstan**| ⭐⭐⭐ | Medium | Safe on campus; petty theft in city markets requires caution. |

---

## 5 Practical Safety Rules for Female Students Abroad

While the environment is generally safe, safety is also a habit. We advise all students (male and female) to adhere strictly to these basic urban survival protocols:

1.  **The "Buddy System" at Night:** For the first year, never travel alone after dark. If returning from the library or clinical postings late, always travel with a classmate.
2.  **Use Registered Cabs Only:** Do not hail random cars off the street (a common practice in some Central Asian countries). Always use official ride-hailing apps like Yandex Go (the Uber of Russia/CIS) where the driver's identity, car number, and route are tracked and shareable via GPS.
3.  **Local Emergency Numbers:** Memorize the local equivalent of 100/112, the number of the Indian Embassy duty officer, and the University's International Dean. Save these on speed-dial.
4.  **Do Not Engage in Local Nightlife Unprepared:** If exploring local cafes or clubs on weekends, do so only in a group, and never leave drinks unattended. Most universities strongly advise against frequenting late-night establishments.
5.  **Keep Your Passport Secure:** Never carry your original passport to local markets or clinical postings unless absolutely required for university registration. Carry a laminated color photocopy and a digital scan on your phone.

---

## The Verdict for Parents

**Yes, pursuing MBBS abroad is safe for female Indian students.** 

If you choose a recognized government medical university in a stable country, the institutional structure is designed to protect its international students. The universities understand that their reputation in India—their largest source of international tuition—depends entirely on the well-being of their students.

The primary challenges your daughter will face are not physical safety, but rather extreme winter adaptability, learning to cook for herself, and the academic pressure of preparing for the NExT/FMGE exams. 

If she is mature enough to handle those academic and lifestyle challenges, the surrounding environment will be secure enough to support her.`,
  }
];

async function run() {
  console.log("=== Blog Seeder: Batch 4 ===\n");
  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();
  try {
    for (const post of posts) {
      console.log(`\nPost: ${post.slug}`);
      const coverUrl = await uploadImage(post.coverLocalPath, post.coverPublicId);
      const r = await client.query(
        `INSERT INTO blog_posts (slug,title,excerpt,content,cover_url,category,meta_title,meta_description,status,reading_time_minutes,published_at,created_at,updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'published',$9,$10,$10,$10)
         ON CONFLICT (slug) DO UPDATE SET
           title=EXCLUDED.title,excerpt=EXCLUDED.excerpt,content=EXCLUDED.content,
           cover_url=EXCLUDED.cover_url,category=EXCLUDED.category,
           meta_title=EXCLUDED.meta_title,meta_description=EXCLUDED.meta_description,
           status='published',reading_time_minutes=EXCLUDED.reading_time_minutes,
           published_at=EXCLUDED.published_at,updated_at=EXCLUDED.updated_at
         RETURNING id,slug`,
        [post.slug,post.title,post.excerpt,post.content,coverUrl??null,
         post.category,post.metaTitle,post.metaDescription,
         Math.ceil(readingTime(post.content).minutes),new Date()]
      );
      console.log(`  ✓ Upserted [${r.rows[0].id}]: ${r.rows[0].slug}`);
    }
  } finally { client.release(); await pool.end(); }
  console.log("\n✅ Batch 4 done!\n");
}
run().catch(e => { console.error(e); process.exit(1); });
