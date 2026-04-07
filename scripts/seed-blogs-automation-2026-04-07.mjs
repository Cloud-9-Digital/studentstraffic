import "dotenv/config";

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { config as loadEnv } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { neonConfig, Pool } from "@neondatabase/serverless";
import readingTime from "reading-time";
import { WebSocket } from "ws";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, ".tmp", "generated-blog-covers");
const artifactDir = join(root, ".tmp", "blog-automation-artifacts");

mkdirSync(outDir, { recursive: true });
mkdirSync(artifactDir, { recursive: true });

for (const file of [join(root, ".env.local"), join(root, ".env")]) {
  if (existsSync(file)) {
    loadEnv({ path: file, override: false });
  }
}

neonConfig.webSocketConstructor = WebSocket;

if (!process.env.GEMINI_API_KEY) {
  process.env.GEMINI_API_KEY = "REMOVED_GEMINI_API_KEY";
}

const hasDatabase = Boolean(process.env.DATABASE_URL);
const hasGemini = Boolean(process.env.GEMINI_API_KEY);
const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const studentsTrafficVietnamCta = `---

## How Students Traffic Can Support Your Vietnam Shortlist

Students Traffic works as an admission support partner for Indian families comparing MBBS in Vietnam. The focus is not to push one university blindly. It is to help students compare cities, fee structures, clinical pathways, and paperwork before money is committed.

If you want a cleaner shortlist, use [Students Traffic's peer connect](/students) to speak with students already studying abroad and reach out for admissions guidance when you are ready to move from research to application.`;

const studentsTrafficRussiaCta = `---

## How Students Traffic Can Support Your Russia Shortlist

Students Traffic works as an admission support partner for Indian families comparing MBBS in Russia. The focus is not to push one university blindly. It is to help students compare city fit, fees, banking practicality, language transition, and India-return planning before money is committed.

If you want a cleaner shortlist, use [Students Traffic's peer connect](/students) to speak with students already studying abroad and reach out for admissions guidance when you are ready to move from research to application.`;

const russiaValidityAddendum = `
---

## A University-Level Validation Worksheet Families Should Complete Before Any Booking Amount

The easiest way to stop making emotional Russia decisions is to force the conversation into a worksheet.

Before paying any admission amount, families should try to fill the following points in writing for the exact university they are considering:

| Question | What you should collect |
|---|---|
| Exact program name | Offer letter, admission form, and university communication should match cleanly |
| Duration | Full study period and any internship component should be documentable |
| Medium of instruction | Ask for a written explanation, not only a spoken assurance |
| Clinical language transition | How and when Russian becomes important in patient settings |
| Hospital pathway | Which hospitals are actually used for training and how consistently |
| Local registration logic | Whether the degree is part of a proper medical pathway in Russia itself |
| Student-support structure | International office, hostel, arrival support, and academic help |
| India-return planning | Whether the family understands NEET, future licensing, and exam preparation expectations |

If the counsellor cannot help build that worksheet, the family is not buying clarity. They are buying confidence theatre.

That distinction matters because Russia is a six-year decision, not a one-week sales process.

---

## A Better Way to Think About "Valid in India"

Many families want a yes-or-no answer because they are tired, anxious, and under time pressure.

That is understandable.

But a better mental model is:

**validity is accumulated by disciplined choices over six years.**

Those choices include:

- joining with the right eligibility mindset
- choosing a university that is easier to defend on paper
- preserving every meaningful academic and admission document
- not treating later clinical-language adaptation casually
- preparing for the India-return licensing path early rather than late

This is why one student can study in a familiar Russian university and still feel strong at the point of return, while another spends six years constantly unsure whether the paperwork and academic pathway will hold up.

The difference is rarely luck alone.

It is usually the quality of decision-making at the beginning.

---

## Which Family Profiles Usually Handle Russia Better

Russia is not equally suitable for every student.

It tends to work better for students who:

- can tolerate climate hardship without losing routine
- are willing to treat Russian language as a real academic task
- do not need excessive hand-holding to stay disciplined
- can learn inside a large, sometimes traditional university environment
- have families who think in systems, not shortcuts

Russia tends to become harder for students who:

- rely heavily on comfort and familiarity
- resist local-language learning beyond survival phrases
- choose only by low fees
- assume a familiar country name automatically removes all risk
- postpone documentation discipline until the final years

That does not mean such students can never succeed in Russia.

It means the margin for sloppy decision-making is smaller than many admissions pitches suggest.

---

## Questions Parents Should Ask in a Counselling Call

Parents often ask broad questions and get broad answers back.

Try asking sharper questions:

1. What is the exact qualification title issued at the end of the course?
2. How is the medium of instruction described in writing?
3. What happens to language expectations in years 3 to 6?
4. Which hospitals take international students, and from which year?
5. Is the internship or houseman-ship structure clearly documented?
6. What documents should the family preserve from day one for later India-return use?
7. How many Indian students are in the current batch, and what do senior students say about clinical years rather than first-year life?
8. If payment routes change, what is the backup plan and who explains it responsibly?

Those questions change the quality of the conversation immediately.

Weak counsellors become vague.

Strong counsellors become specific.

That alone is useful screening.

---

## The Safest Operational Habit: Build a Six-Year Document Vault

Families should create a cloud folder and one physical file from the beginning.

Keep copies of:

- passport and visa records
- offer letter and admission confirmation
- fee receipts
- hostel records
- medium-of-instruction letters if issued
- student ID and university registration papers
- academic transcripts
- internship-related documentation
- any degree or licensing-support paperwork collected later

Students change phones. Emails get buried. Agents disappear. Staff change. University websites get redesigned.

Your own archive is what protects the future narrative of the degree.

That may sound administrative, but for foreign medical education it is part of risk management.

---

## A 30-Minute Final Due-Diligence Exercise Before You Say Yes

Families do not always need a giant research project before deciding.

But they do need one calm half-hour where they stop listening to sales talk and answer a few hard questions honestly.

Try this:

### Step 1: Write the university name and the real reason you are choosing it

If the real reason is only one of these:

- low fees
- familiar country name
- "many Indians go there"
- "the agent said seats are filling fast"

then the family is not ready yet.

The reason should be stronger:

- better-documented program structure
- stronger city fit
- stronger hospital pathway
- better support for the student's profile

### Step 2: Write the top three known strengths

Examples:

- older university with clearer medical identity
- stronger hospital network
- larger Indian student base

### Step 3: Write the top three unresolved doubts

Examples:

- unclear clinical-language transition
- weak paperwork from counsellor
- uncertainty about total cost or payment route

### Step 4: Ask whether the doubts are being answered with documents or only reassurance

That one step alone eliminates a lot of bad decisions.

If the family is getting only reassurance, the process is still immature.

---

## Final Practical Verdict

Russia remains one of the more serious MBBS-abroad pathways available to Indian students because it has institutional depth, long-running medical universities, and a larger alumni trail than many newer destinations.

But Russia is only a good answer when the family behaves like a document-driven buyer, not like a brochure-driven buyer.

If you treat the country name as enough, you are taking a risk.

If you treat the university, language pathway, hospital depth, and paperwork as the real decision points, Russia can still be a strong and durable route for the right student profile.`;

const vietnamRankingAddendum = `
---

## How Families Should Use This Ranking Instead of Treating It Like a Trophy Table

The biggest mistake families make with rankings is assuming rank 1 automatically means best fit.

That is not how this shortlist should be used.

A better method is to create three buckets:

### Bucket A: Prestige-first public options

This is where families compare universities such as Hanoi Medical University and UMP Ho Chi Minh City.

These options are best for students who want:

- stronger institutional weight
- more traditional public-school depth
- a university name that feels easier to defend in serious comparison

### Bucket B: Balanced public-value options

This is where schools like Hue, CTUMP, and Thai Nguyen become attractive.

These often work well for families who want:

- credible public-university structure
- a calmer city than the biggest metros
- stronger value discipline

### Bucket C: Private guided-environment options

This is where Duy Tan, Phan Chau Trinh, and Dai Nam become important.

These can suit families who want:

- more structured support
- newer infrastructure
- a more managed transition into Vietnamese student life

If families sort universities this way, they stop comparing unlike-for-unlike.

That improves decision quality much faster than arguing whether rank 3 is "better" than rank 5 in the abstract.

---

## A Budget-Based Shortlisting Framework

Here is a more useful way to shortlist Vietnam universities by financial reality:

| Budget posture | Best comparison type |
|---|---|
| Cost-disciplined but still serious | Thai Nguyen, Hue, CTUMP, Dai Nam |
| Comfortable mid-range with city focus | CTUMP, Hue, Dai Nam, PCTU |
| Premium private or bigger-brand private | Duy Tan, Hong Bang, selected metro private options |
| Prestige-first public route | Hanoi Medical University, UMP Ho Chi Minh City |

This matters because a family that can realistically afford one kind of university should not waste weeks emotionally attached to another kind of university it may not finally choose.

The right shortlist is one the family can actually sustain for six years.

---

## The Questions That Separate a Good Vietnam University from a Merely Marketed One

When comparing any Vietnam university, ask:

1. How clearly can the hospital pathway be described year by year?
2. What is the real language bridge into clinical years?
3. Is the university's medicine story stronger than its marketing story?
4. Does the city support long-term student living, not just first-impression comfort?
5. If the student is India-return focused, how clean is the document trail likely to be?

A university that answers those questions well usually deserves attention even if it is not the loudest advertised name.

That is why ranking should support judgement, not replace judgement.`;

const vietnamComparisonAddendum = `
---

## Three Real-World Decision Scenarios

Families often understand country comparisons better when they imagine themselves inside a realistic scenario instead of reading only general theory.

### Scenario 1: The family wants the smoothest daily-life adjustment

This family is not obsessed with legacy prestige. They care about:

- climate that feels manageable
- easier food and lifestyle adjustment
- less intimidating distance from India
- a calmer emotional experience for parents

For this profile, Vietnam often becomes the strongest starting point.

Why?

Because the overall adaptation burden is usually lower than Russia, while the pricing logic can still stay more disciplined than many Georgia pathways.

### Scenario 2: The family values older medical-university ecosystems

This family is willing to tolerate more climate hardship and language pressure if the university system feels more established.

For this profile, Russia remains relevant because its long medical-education history and wider set of public universities give families more options at different budget bands.

But this same family should still avoid assuming that every Russian university inherits the same strength.

### Scenario 3: The family wants English-friendly first impressions

This family is highly sensitive to how easy the beginning feels:

- smaller country
- compact urban life
- simpler onboarding story
- heavy English-medium pitch

This is where Georgia often wins attention.

But Georgia also needs the sharpest cost and clinical questioning because comfort in the first conversation does not automatically mean strongest six-year value.

---

## A Cleaner Decision Matrix for Students

Use this as a self-check before choosing a country:

| If you are the kind of student who... | Country that may fit better |
|---|---|
| needs warmth, food familiarity, and a calmer adaptation arc | Vietnam |
| can handle cold, distance, and a tougher language transition for a wider university market | Russia |
| wants a compact, marketing-friendly, easier-feeling start and is ready to verify value carefully | Georgia |

Students often fail not because the country was impossible, but because the chosen country was a personality mismatch.

That is why self-awareness belongs inside admissions strategy.

---

## What the First 12 Months Usually Feel Like

The first year shapes the emotional reality of MBBS abroad more than most brochures admit.

### In Vietnam

Students often spend year one understanding the city, food system, classroom rhythm, and the broader social environment. The adjustment is real, but for many students it feels manageable enough that they can still preserve academic routine without being overwhelmed by weather or isolation.

### In Russia

The first year often asks more of the student emotionally:

- climate shock
- longer separation from home
- operational adaptation in a more unfamiliar environment
- the early realization that local language matters more than expected

Some students become stronger because of that. Others become exhausted by it.

### In Georgia

The first year often feels easier socially and logistically, which is one reason families become comfortable with it quickly. The risk is that comfort at the start can make families less strict about deeper clinical and value questions.

That is why first-year comfort should be treated as a useful benefit, not as proof of final superiority.

---

## Budget Stress Changes the Country Decision More Than Families Expect

A country that looks attractive at first can become the wrong country once the family stops using headline tuition and starts using six-year budgeting.

This is where the three-country comparison becomes more practical:

- if the family needs a more controlled balance between cost and liveability, Vietnam often looks stronger
- if the family wants the widest possible pricing spectrum and is willing to absorb more adaptation pressure, Russia stays important
- if the family is already stretched financially, Georgia should be reviewed carefully because an easy first impression can hide a more premium long-term spend than expected

Families should not ask only, "Can we pay the first year?"

They should ask:

- can we sustain six years without panic?
- can we fund emergency travel if needed?
- can we support coaching or India-return preparation later?
- can we absorb currency movement, hostel variation, and hidden setup costs?

The country choice becomes much clearer when budgeting is treated as a long-term system rather than a first-payment problem.

---

## One Final Rule: Choose the Hardest Truth, Not the Easiest Pitch

If Vietnam fits your child better but Russia sounds more prestigious in casual conversation, choose fit.

If Russia fits your child's resilience and academic style better but Vietnam sounds easier, choose fit.

If Georgia feels smoother in the sales call but the value is still unclear, slow down and verify more.

The best country is usually the one whose difficult truths your family understands clearly before admission.

That is the route most likely to hold up over six years.

---

## The Three Notes Every Family Should Write Down Before the Final Call

Before you confirm any destination, write these three lines on paper:

1. **Why this country fits our child better than the other two**
2. **What the biggest risk is and how we plan to manage it**
3. **Which university inside this country we trust most and why**

If the family cannot answer those three lines clearly, the country decision is still not ready.

That final exercise sounds simple, but it forces the comparison to become concrete.

And concrete thinking is what turns an MBBS-abroad decision from a marketing choice into a workable six-year plan.

Families who slow down long enough to write those answers usually choose better, negotiate better, and regret less later.

## Final Buying Advice for Parents

If you are choosing between Vietnam, Russia, and Georgia, do not ask only:

"Which country is best?"

Ask:

- Which country fits my child?
- Which country fits our actual six-year budget?
- Which country's adjustment pressure is realistic for our family?
- Which university inside that country is easiest to defend on academics, documentation, and student fit?

Those four questions prevent the majority of avoidable mistakes.

The winning country is not the one with the loudest pitch.

It is the one your student can survive, learn in, and return from with the strongest overall outcome.`;

function loadPostFromSource(filePath, startLine, endExclusiveLine, context) {
  const sourceLines = readFileSync(filePath, "utf8").split("\n");
  const objectSource = sourceLines
    .slice(startLine - 1, endExclusiveLine)
    .join("\n")
    .replace(/,\s*$/, "");

  return vm.runInNewContext(`(${objectSource})`, context);
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function renderFallbackSvg(post) {
  const titleSvg = post.titleLines
    .map(
      (line, index) =>
        `<text x="96" y="${240 + index * 84}" font-family="Arial, Helvetica, sans-serif" font-size="66" font-weight="700" fill="#16324F">${escapeXml(line)}</text>`
    )
    .join("");

  const chipsSvg = post.chips
    .map((chip, index) => {
      const x = 96 + index * 220;
      return `
        <rect x="${x}" y="664" rx="18" ry="18" width="188" height="56" fill="#FFFFFF" stroke="${post.accent}" stroke-width="2" />
        <text x="${x + 94}" y="700" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#16324F">${escapeXml(chip)}</text>
      `;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1600" height="900" fill="#F7F2EA"/>
  <rect x="0" y="0" width="1600" height="18" fill="${post.accent}"/>
  <rect x="1112" y="88" width="392" height="724" rx="34" fill="#16324F"/>
  <circle cx="1418" cy="176" r="54" fill="${post.accent}" fill-opacity="0.16"/>
  <circle cx="1280" cy="698" r="104" fill="${post.accent}" fill-opacity="0.12"/>
  <rect x="96" y="122" width="286" height="44" rx="22" fill="${post.accent}" fill-opacity="0.14"/>
  <text x="118" y="152" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="${post.accent}">${escapeXml(post.kicker)}</text>
  ${titleSvg}
  <text x="96" y="494" font-family="Arial, Helvetica, sans-serif" font-size="33" font-weight="500" fill="#42566B">Long-form organic traffic guide for Indian medical aspirants</text>
  <rect x="96" y="568" width="930" height="2" fill="#D7CFC1"/>
  ${chipsSvg}
  <text x="1160" y="214" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF">Students Traffic</text>
  <text x="1160" y="254" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">Editorial Cover</text>
  <rect x="1160" y="308" width="236" height="1" fill="#46627D"/>
  <text x="1160" y="386" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#FFFFFF">Why this guide matters</text>
  <text x="1160" y="438" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">Smarter comparisons.</text>
  <text x="1160" y="474" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">Cleaner shortlists.</text>
  <text x="1160" y="510" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">Better admissions decisions.</text>
  <rect x="1160" y="590" width="214" height="56" rx="18" fill="${post.accent}"/>
  <text x="1267" y="626" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#FFFFFF">${escapeXml(post.badge)}</text>
</svg>`;
}

async function fetchAsInlineData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch reference image: ${url}`);
  }

  const mimeType = response.headers.get("content-type") ?? "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());

  return {
    inline_data: {
      mime_type: mimeType,
      data: buffer.toString("base64"),
    },
  };
}

async function generateImage(post, outputFile) {
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: post.coverPrompt }, await fetchAsInlineData(post.styleReferenceUrl)],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K",
      },
    },
  };

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent",
    {
      method: "POST",
      headers: {
        "x-goog-api-key": process.env.GEMINI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status} ${text.slice(0, 300)}`);
  }

  const data = JSON.parse(text);
  const part = data?.candidates?.[0]?.content?.parts?.find(
    (item) => item.inlineData?.data
  );

  if (!part?.inlineData?.data) {
    throw new Error(`No image returned by Gemini: ${text.slice(0, 300)}`);
  }

  writeFileSync(outputFile, Buffer.from(part.inlineData.data, "base64"));
}

async function buildCover(post) {
  const outputFile = join(outDir, post.filename);

  if (hasGemini && post.coverPrompt) {
    try {
      await generateImage(post, outputFile);
      console.log(`Generated Gemini cover for ${post.slug}.`);
      return outputFile;
    } catch (error) {
      console.warn(
        `Gemini image generation failed for ${post.slug}; using fallback SVG instead: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  writeFileSync(outputFile, renderFallbackSvg(post), "utf8");
  console.log(`Created fallback cover for ${post.slug}.`);
  return outputFile;
}

async function uploadCover(post, localPath) {
  if (!hasCloudinary) {
    return null;
  }

  const ext = localPath.endsWith(".svg") ? "svg" : "jpg";
  const publicId = post.publicId;

  try {
    const existing = await cloudinary.api.resource(publicId);
    if (existing?.secure_url) {
      console.log(`Reusing Cloudinary asset for ${post.slug}.`);
      return existing.secure_url;
    }
  } catch {
    // no-op
  }

  const uploaded = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    format: ext,
  });

  console.log(`Uploaded cover for ${post.slug}.`);
  return uploaded.secure_url;
}

const posts = [
  {
    ...loadPostFromSource(
      join(root, "scripts", "seed-russia-blog-cluster.mjs"),
      28,
      360,
      { studentsTrafficRussiaCta }
    ),
    content: `${loadPostFromSource(
      join(root, "scripts", "seed-russia-blog-cluster.mjs"),
      28,
      360,
      { studentsTrafficRussiaCta }
    ).content}\n\n${russiaValidityAddendum}`,
    publicId: "studentstraffic/blog/is-mbbs-in-russia-valid-in-india-nmc-next-neet",
    filename: "is-mbbs-in-russia-valid-in-india-cover.jpg",
    styleReferenceUrl:
      "https://res.cloudinary.com/dlh6tmx7h/image/upload/v1775057455/studentstraffic/blog/best-russian-medical-universities-india.jpg",
    kicker: "Russia Compliance Guide",
    titleLines: ["Is MBBS in Russia", "Valid in India?"],
    chips: ["NMC", "NEET", "NExT 2026"],
    accent: "#B63A2B",
    badge: "Russia 2026",
    coverPrompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Russia university cover as a style reference only for tone, spacing, typography discipline, and polished editorial feel.

Required exact visible text:
Is MBBS in Russia Valid in India?
NMC • NEET • NExT 2026

Visual direction:
- warm white or light ivory background
- bold navy headline
- subtle Russia and India map silhouettes in the background
- document-validation and medical-compliance theme
- visual elements like passport, degree certificate, shield, checklist, hospital cross, stethoscope, and a clean connection path from study abroad to India-return planning
- calm, trustworthy, authoritative editorial infographic design

Important:
- keep the text spelled exactly as written
- no logos, no watermarks, no fake seals
- no cluttered paragraphs or unreadable labels
- do not make it look political or legalistic; it should feel modern, helpful, and highly legible on mobile`,
  },
  {
    ...loadPostFromSource(
      join(root, "scripts", "seed-vietnam-blog-cluster.mjs"),
      28,
      365,
      { studentsTrafficVietnamCta }
    ),
    content: `${loadPostFromSource(
      join(root, "scripts", "seed-vietnam-blog-cluster.mjs"),
      28,
      365,
      { studentsTrafficVietnamCta }
    ).content}\n\n${vietnamRankingAddendum}`,
    publicId:
      "studentstraffic/blog/best-vietnam-medical-universities-for-indian-students-ranking",
    filename: "best-vietnam-medical-universities-cover.jpg",
    styleReferenceUrl:
      "https://res.cloudinary.com/dlh6tmx7h/image/upload/v1775127931/studentstraffic/blog/mbbs-vietnam-fees-2026-total-cost-guide.jpg",
    kicker: "Vietnam Ranking Guide",
    titleLines: ["Best Medical Universities", "in Vietnam 2026"],
    chips: ["Recognition", "Cost", "Clinical Depth"],
    accent: "#1F7A5B",
    badge: "Vietnam 2026",
    coverPrompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Vietnam fees cover as a style reference only for visual tone, spacing, color discipline, and clean editorial infographic feel.

Required exact visible text:
Best Medical Universities in Vietnam 2026
For Indian Students
Recognition • Cost • Clinical Depth

Visual direction:
- warm white or light ivory background
- bold navy headline
- subtle Vietnam map silhouette in the background
- elegant ranked university comparison scene with premium medical-campus cues
- include 4 to 5 clean comparison blocks or ranking ribbons, but keep them graphical rather than dense tables
- visual hints of teaching hospitals, academic buildings, stethoscope, medal, graduation cap, and clipboard
- polished, trustworthy, authoritative editorial design
- made for organic blog traffic, not a flashy ad

Important:
- text must be highly legible on desktop and mobile
- do not add logos, watermarks, agent branding, or fake university seals
- do not invent long paragraphs or tiny unreadable labels
- keep the design balanced and premium`,
  },
  {
    ...loadPostFromSource(
      join(root, "scripts", "seed-vietnam-blog-cluster.mjs"),
      1803,
      2152,
      { studentsTrafficVietnamCta }
    ),
    content: `${loadPostFromSource(
      join(root, "scripts", "seed-vietnam-blog-cluster.mjs"),
      1803,
      2152,
      { studentsTrafficVietnamCta }
    ).content}\n\n${vietnamComparisonAddendum}`,
    publicId:
      "studentstraffic/blog/mbbs-in-vietnam-vs-russia-vs-georgia-for-indian-students",
    filename: "mbbs-vietnam-vs-russia-vs-georgia-cover.jpg",
    styleReferenceUrl:
      "https://res.cloudinary.com/dlh6tmx7h/image/upload/v1775127931/studentstraffic/blog/mbbs-vietnam-fees-2026-total-cost-guide.jpg",
    kicker: "Three-Country Comparison",
    titleLines: ["Vietnam vs Russia vs", "Georgia for MBBS"],
    chips: ["Fees", "Lifestyle", "India Return"],
    accent: "#D97624",
    badge: "Compare 2026",
    coverPrompt: `Create a premium 16:9 website blog cover for an education consultancy article.
Use the attached Vietnam fees cover as a style reference only for tone, spacing, and clean editorial infographic quality.

Required exact visible text:
MBBS in Vietnam vs Russia vs Georgia 2026
Which Is Better for Indian Students?

Visual direction:
- warm white or light ivory background
- bold navy headline
- elegant three-country comparison layout with clean country markers or map silhouettes
- subtle medical and study-abroad cues like hospital, airplane path, documents, stethoscope, and comparison arrows
- clear visual contrast between the three options without using heavy flag designs
- should feel authoritative, balanced, and editorial, not flashy

Important:
- keep the text spelled exactly as written
- no logos, no watermarks, no cluttered tiny labels
- maintain strong mobile legibility`,
  },
];

async function publishPosts() {
  if (!hasDatabase) {
    console.log("DATABASE_URL missing; skipping database publish.");
    return [];
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    const inserted = [];

    for (const post of posts) {
      console.log(`\nPost: ${post.slug}`);
      const coverLocalPath = await buildCover(post);
      const coverUrl = (await uploadCover(post, coverLocalPath)) ?? post.coverUrl ?? null;
      const now = new Date();

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
        RETURNING id, slug`,
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
          now,
        ]
      );

      inserted.push({
        id: result.rows[0].id,
        slug: result.rows[0].slug,
        title: post.title,
        coverUrl,
      });
      console.log(`Upserted ${post.slug}.`);
    }

    return inserted;
  } finally {
    client.release();
    await pool.end();
  }
}

async function main() {
  console.log("=== Blog Automation: 2026-04-07 ===");
  const published = await publishPosts();
  const artifactPath = join(artifactDir, "blog-automation-2026-04-07.json");

  writeFileSync(
    artifactPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        hasDatabase,
        hasGemini,
        hasCloudinary,
        posts: posts.map((post) => ({
          slug: post.slug,
          title: post.title,
          category: post.category,
        })),
        published,
      },
      null,
      2
    )
  );

  console.log(`Wrote artifact: ${basename(artifactPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
