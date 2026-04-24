import "dotenv/config";

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
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

neonConfig.webSocketConstructor = WebSocket;

const hasDatabase = Boolean(process.env.DATABASE_URL);
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

function section(title, body) {
  return `## ${title}\n\n${body}`;
}

function bullets(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function numbered(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
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
        `<text x="96" y="${220 + index * 82}" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700" fill="#16324F">${escapeXml(line)}</text>`
    )
    .join("");

  const chipsSvg = post.chips
    .map((chip, index) => {
      const x = 96 + index * 238;
      return `
        <rect x="${x}" y="658" rx="18" ry="18" width="210" height="58" fill="#FFFFFF" stroke="${post.accent}" stroke-width="2" />
        <text x="${x + 105}" y="695" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#16324F">${escapeXml(chip)}</text>
      `;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1600" height="900" fill="#F7F2EA"/>
  <rect x="0" y="0" width="1600" height="18" fill="${post.accent}"/>
  <rect x="1118" y="92" width="390" height="714" rx="34" fill="#16324F"/>
  <circle cx="1420" cy="174" r="54" fill="${post.accent}" fill-opacity="0.15"/>
  <circle cx="1296" cy="698" r="104" fill="${post.accent}" fill-opacity="0.12"/>
  <rect x="96" y="124" width="360" height="44" rx="22" fill="${post.accent}" fill-opacity="0.14"/>
  <text x="118" y="154" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="${post.accent}">${escapeXml(post.kicker)}</text>
  ${titleSvg}
  <text x="96" y="510" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="500" fill="#42566B">Long-form decision guide for Indian students and parents</text>
  <rect x="96" y="564" width="920" height="2" fill="#D7CFC1"/>
  ${chipsSvg}
  <text x="1164" y="214" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF">Students Traffic</text>
  <text x="1164" y="254" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">Editorial Cover</text>
  <rect x="1164" y="308" width="232" height="1" fill="#46627D"/>
  <text x="1164" y="386" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#FFFFFF">Built for families who need</text>
  <text x="1164" y="438" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">clarity before any booking.</text>
  <text x="1164" y="474" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">Better fit. Lower risk.</text>
  <text x="1164" y="510" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#D7E1EA">Smarter admission planning.</text>
  <rect x="1164" y="590" width="208" height="56" rx="18" fill="${post.accent}"/>
  <text x="1268" y="626" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#FFFFFF">${escapeXml(post.badge)}</text>
</svg>`;
}

async function uploadCover(post, localPath) {
  if (!hasCloudinary) return null;
  const uploaded = await cloudinary.uploader.upload(localPath, {
    public_id: post.publicId,
    overwrite: true,
    resource_type: "image",
  });
  return uploaded.secure_url;
}

const bosniaCta = `---

## How Students Traffic Can Help You Evaluate Bosnia More Carefully

Bosnia can look attractive because it sits inside Europe, offers English-medium medicine at selected universities, and still feels less over-marketed than some crowded MBBS abroad destinations. But that does not make it self-explanatory. Students Traffic helps families compare the exact university, tuition structure, admission realism, student-support setup, and India-return fit before any commitment is made.

If Bosnia is on your shortlist, use [Students Traffic counselling support](/contact), our [country guides](/blog), and [student connect](/students) before paying any booking amount.`;

const malaysiaCta = `---

## How Students Traffic Can Help You Judge Malaysia Without Cost Illusion

Malaysia is not a low-cost MBBS abroad route. It is a premium English-medium option that may work well for the right family and feel financially heavy for the wrong one. Students Traffic helps families compare total tuition burden, campus model, student-fit, university quality, and post-degree planning before prestige turns into pressure.

If Malaysia is on your shortlist, use [Students Traffic counselling support](/contact), our [fee comparison guides](/blog/mbbs-abroad-fees-country-comparison-2026), and [peer conversations](/students) before moving money.`;

const postNeetCta = `---

## How Students Traffic Can Help in the First Two Weeks After NEET

The first 14 days after NEET are where many families get rushed into weak decisions. Students Traffic helps families compare drop-year logic, private MBBS in India, and MBBS abroad using score context, budget reality, university fit, and document readiness rather than panic or sales pressure.

If you want a calmer post-NEET decision process, use [Students Traffic counselling support](/contact), our [MBBS abroad guides](/blog), and [student connect](/students) before choosing a path.`;

function buildBosniaGuide() {
  return [
    "# MBBS in Bosnia 2026: Complete Guide for Indian Students on Fees, English Medical Programs, Eligibility, and Long-Term Fit",
    "",
    "MBBS in Bosnia is not yet a mass-market choice for Indian students in the way Russia, Kazakhstan, Georgia, or Kyrgyzstan are. That is exactly why many families are curious about it. When a destination is less crowded, it often feels cleaner, safer, or more serious. Sometimes that instinct helps. Sometimes it simply means the destination has not been examined hard enough.",
    "",
    "For Indian families, Bosnia in 2026 should be treated as a selective European option, not as a shortcut. It offers English-medium medical education at specific institutions, a six-year structure that feels familiar to many international applicants, and a lower-profile environment than some over-advertised destinations. At the same time, it demands a more careful level of verification on recognition, university quality, fee clarity, and long-term India-return planning.",
    "",
    "This guide is written for students and parents who want a real decision framework rather than brochure language. It focuses on what Bosnia may actually look like for an Indian student: where the English-medium pathways appear to exist, what public fee signals currently show, what student-life tradeoffs matter, what recognition checks should happen before any payment, and which type of family should seriously compare Bosnia against other options.",
    "",
    section(
      "Why Bosnia Enters the MBBS Abroad Conversation at All",
      `Bosnia becomes interesting for some families because it sits inside Europe without carrying the same marketing noise as bigger MBBS abroad destinations. That creates a perception of quality, calm, and better everyday life. Sometimes those expectations are partly justified. Bosnia offers a European setting, selected English-medium medicine pathways, and universities that present a structured academic proposition to international students.

But a family should still ask the harder question: why Bosnia instead of a more established destination for Indian medical students?

For some students, the answer may be:

${bullets([
  "they want a Europe-based pathway rather than a CIS-heavy option",
  "they prefer a destination that feels less crowded by aggressive consultant marketing",
  "they are comfortable with a smaller Indian-student ecosystem if the academic environment looks more stable",
  "they are willing to evaluate a destination at the university level instead of choosing only by country popularity"
])}

For other families, Bosnia may simply feel emotionally safer because it sounds European and less chaotic. That emotional reaction is understandable, but it is not enough. A medical degree is too long and too expensive to choose by atmosphere alone. Bosnia deserves attention only if the specific university, the language reality, the cost structure, and the recognition pathway all survive scrutiny.`
    ),
    section(
      "What the Public English-Medium Signals Look Like in 2026",
      `The two public Bosnia signals most families will encounter first are from the Faculty of Medicine at the University of Sarajevo and from the Faculty of Medicine at the University of Mostar.

The Sarajevo faculty publicly presents an International Medical Degree Program in English. Its international-studies pages describe a six-year integrated medicine route and position the program as a full medical degree track for international applicants. Public enrollment materials for the 2025/2026 cycle also listed a tuition figure of 12,000 BAM per academic year for that international medical program.

The University of Mostar's Faculty of Medicine also publicly promotes Medical Studies in English. Its admissions material for the 2026/2027 cycle has shown a six-year structure, limited seat availability, and a visible annual tuition signal of 18,000 BAM for the English-track medical studies offer.

These public fee signals are useful because they immediately show Bosnia is not a cheap hidden MBBS country in a simplistic sense. Sarajevo sits in a more mid-range European band. Mostar can move significantly higher. The family should therefore evaluate Bosnia as a university-specific proposition rather than as a single-cost destination.`
    ),
    section(
      "What Bosnia Is Not",
      `It is important to define Bosnia correctly by removing a few common assumptions.

Bosnia is not:

${bullets([
  "an ultra-low-budget MBBS abroad alternative",
  "a destination where country-level European branding should replace university-level verification",
  "a market where Indian families can safely skip recognition checks just because the campus looks serious",
  "a place that automatically provides the large Indian-community comfort some students depend on",
  "a destination that should be chosen without understanding city, hostel, and administrative support realities"
])}

That matters because many poor MBBS abroad decisions begin with misclassification. When families classify Bosnia as a budget country, they under-plan. When they classify it as automatically superior because it is in Europe, they stop asking hard questions. When they classify it as equivalent to any other Bosnia university, they miss the fact that medical outcomes are created at the institutional level, not the passport-map level.`
    ),
    section(
      "Recognition, WDOMS, and India-Return Reality",
      `For Indian students, the biggest Bosnia decision is not whether the country sounds impressive. It is whether the exact university and exact program satisfy the recognition pathway you will later depend on.

At a minimum, families should independently verify:

${numbered([
  "whether the university appears in the World Directory of Medical Schools",
  "whether the specific program and graduation pathway align with current Indian regulatory expectations for foreign medical graduates",
  "whether the student has valid NEET eligibility for the admission year",
  "whether the structure, internship exposure, and documentation pathway will create problems later during return-to-India licensing steps"
])}

Families should be extremely careful with the phrase NMC approved when used casually by agents. Recognition language is often simplified in sales conversations. The right question is not whether an agent says the destination is valid. The right question is whether you can independently verify the university's global listing status and whether the degree pathway remains compatible with the Indian screening and registration process that applies when you return.`
    ),
    section(
      "How the Fee Story Should Be Read",
      `Bosnia's public fee signals already tell an important story. A Sarajevo-style annual fee around 12,000 BAM and a Mostar-style annual fee around 18,000 BAM place Bosnia in a zone where the total financial burden can vary sharply depending on university choice.

At rough April 2026 exchange levels, that means the tuition band alone can feel like:

${bullets([
  "mid-₹6 lakh per year range for a 12,000 BAM structure before living costs",
  "around ₹10 lakh per year range for an 18,000 BAM structure before living costs"
])}

Those are editorial conversions, not the number families should pay against blindly. Live bank rates, transfer costs, local charges, and yearly revisions all matter. But the directional lesson is clear: Bosnia is not a one-price destination. Two Bosnia options may differ materially in total six-year cost.

Families also need to add:

${bullets([
  "hostel or private accommodation",
  "food and city spending",
  "visa and residence costs",
  "insurance and administrative charges",
  "travel between India and Bosnia",
  "emergency reserve and possible exam-support spending"
])}`
    ),
    section(
      "Who Bosnia May Fit Well",
      `Bosnia can make sense for a student profile that is more selective than impulsive.

It may fit better when:

${bullets([
  "the family wants a Europe-based route but still needs some fee discipline",
  "the student is comfortable being part of a smaller Indian-student ecosystem",
  "the family is willing to compare exact universities rather than choosing a country headline",
  "the student values a quieter environment over a very large peer cluster",
  "the family can fund the route without stretching into chronic financial anxiety"
])}

In those cases, Bosnia can become a serious shortlist candidate. A student who wants a structured campus environment, can manage a smaller support circle, and has a family willing to verify things properly may find Bosnia attractive.`
    ),
    section(
      "Who Should Be More Cautious",
      `Bosnia is usually a weaker fit for families who want certainty without doing verification work. That is not criticism. It is a planning fact.

The following profiles should slow down:

${bullets([
  "families whose budget is already tight enough that fee variation between universities becomes dangerous",
  "students who rely heavily on a large Indian peer ecosystem for emotional stability",
  "families who are attracted mainly by the word Europe but have not tested city and university realities",
  "students who need highly visible agent support at every operational step",
  "families who have not yet clarified the India-return licensing path and want to assume it will work out later"
])}

Bosnia can also be a weak choice when the student is choosing it mainly to avoid a drop year quickly. Speed is a poor reason to choose any long medical route.`
    ),
    section(
      "Academic Structure, Language, and Clinical Comfort",
      `Public materials from Sarajevo and Mostar indicate a six-year medicine structure delivered in English for international pathways. That solves one question but not all of them.

Families should still ask:

${bullets([
  "how much of the actual teaching is comfortably accessible to Indian students in practice",
  "whether clinical interaction later depends on local-language comfort",
  "how faculty communication works outside formal admission language",
  "what academic support exists if a student struggles after arrival"
])}

This is one of the most important gaps in many MBBS abroad conversations. A university can honestly advertise an English-medium pathway while the day-to-day clinical ecosystem still includes local-language realities that affect comfort, exposure, and confidence. The safest way to think is this: English-medium on paper is the entry point, not the full lived reality.`
    ),
    section(
      "City Life, Accommodation, and Student Experience",
      `Bosnia should also be evaluated city by city, not just country by country. Sarajevo and Mostar do not necessarily feel the same for an Indian student in terms of pace, climate, campus rhythm, and support expectations.

Students should think through:

${bullets([
  "whether accommodation is university-managed, assisted, or self-sourced",
  "how close daily housing is to the teaching environment",
  "what food adaptation may look like over months, not just in week one",
  "how much independence the student really has today",
  "how the student handles a smaller South Asian social circle"
])}

A student who is academically capable can still struggle if everyday life becomes too isolating or disorganized. Families often underweight this because living conditions do not look academically prestigious. But daily comfort affects attendance, study discipline, and resilience over six years.`
    ),
    section(
      "Admission Workflow and Document Reality",
      `One reason students misread Bosnia is that they focus on the destination before they understand the admission workflow. The country begins to feel attractive, and only later do they ask whether the document process, timeline, and operational sequencing actually suit them.

Families should expect the following kinds of tasks in any serious Bosnia pathway:

${numbered([
  "document collection and academic-record review",
  "passport validity confirmation",
  "program-specific application or eligibility checks",
  "written clarification on tuition and payment sequencing",
  "visa and residence-process preparation",
  "accommodation planning before arrival"
])}

None of these steps are unusual by global standards. What matters is whether they are handled clearly. It is also wise to preserve every document cleanly from the start. Bosnia is not a destination where sloppy administration should be normalized. If you are choosing a lower-volume, more niche option, your process discipline should rise, not fall.`
    ),
    section(
      "Questions to Ask Current Students Before You Believe the Brochure",
      `No Bosnia shortlist should become final without student conversations wherever possible. When a destination is less crowded in the Indian market, real student feedback becomes even more valuable because the family has fewer peer-level assumptions to rely on.

The most useful questions are not vague ones like Is it good? Better questions include:

${bullets([
  "What became harder after arrival than the university page suggested?",
  "How manageable is the academic language in actual classes and clinical settings?",
  "How much support did you receive in the first month?",
  "What living-cost or accommodation surprises caught students off guard?",
  "Would you choose the same university again if you started over?"
])}

Families should also try to understand who the university is a weak fit for. That question is often more revealing than asking who it suits well.`
    ),
    section(
      "Bosnia vs More Popular MBBS Abroad Destinations",
      `Bosnia enters the shortlist as a different type of decision from Russia, Kazakhstan, or Kyrgyzstan.

Compared with more popular destinations, Bosnia may offer:

${bullets([
  "a more niche European positioning",
  "potentially calmer branding and less market noise",
  "selected English-medium medical pathways that feel academically deliberate"
])}

But it may also offer:

${bullets([
  "less Indian-community depth than high-volume countries",
  "less familiar consultant infrastructure for many Indian families",
  "less room for lazy assumptions because every university must be checked carefully"
])}

That is why Bosnia is rarely a default option. It is a comparison option. A good Bosnia decision usually happens after the family already understands why it is not choosing the more common routes.`
    ),
    section(
      "A Practical Bosnia Decision Checklist",
      `Before Bosnia reaches your final shortlist, the family should be able to answer all of these clearly:

${numbered([
  "Which exact Bosnia university are we evaluating, and why that one?",
  "What is the visible fee structure from public or written institutional sources?",
  "What living-cost range should we assume conservatively?",
  "What does the recognition and India-return verification show for this exact route?",
  "What does current student feedback say about academics, language, and support?",
  "Are we choosing Bosnia because it fits, or because it merely sounds respectable?"
])}

If the family cannot answer those questions, Bosnia is not yet a real option. It is only a curiosity.`
    ),
    section(
      "Quick FAQ",
      `**Is Bosnia a low-cost MBBS abroad country?**

Not automatically. Public fee signals show meaningful variation by university, and the total cost depends heavily on the exact institution, city, and living setup.

**Does English-medium medicine exist in Bosnia?**

Yes, public university materials from Sarajevo and Mostar show English-track medicine pathways, but families should still verify delivery reality, clinical language comfort, and student-support conditions.

**Can Indian students rely on country-level validity claims?**

No. Recognition and India-return planning should always be checked at the university and program level.

**Who should seriously compare Bosnia?**

Families who want a Europe-based option, can fund it honestly, and are willing to verify details rather than choose by reputation alone.`
    ),
    section(
      "Final Take",
      `Bosnia in 2026 is best understood as a niche European medical option for Indian students who are willing to compare carefully. It is not a panic choice, not an auto-premium choice, and not a universal bargain. It becomes interesting only when the exact university, fee structure, language reality, and India-return pathway all look defensible together.

If your family approaches Bosnia with evidence, it can become a meaningful shortlist candidate. If your family approaches it with assumption, it can become just another expensive MBBS abroad mistake dressed up as a less common idea. The quality of the decision therefore depends less on Bosnia itself and more on how rigorously you evaluate it.`
    ),
    "",
    bosniaCta,
  ].join("\n");
}

function buildMalaysiaGuide() {
  return [
    "# MBBS in Malaysia 2026: Complete Guide for Indian Students on Fees, English-Medium Medicine, Eligibility, and Whether the Premium Cost Is Worth It",
    "",
    "MBBS in Malaysia attracts a very different type of student than the traditional low-cost MBBS abroad routes. Families do not usually look at Malaysia because it is the cheapest option. They look at it because it appears more polished, more English-friendly, more urban, and in some cases more internationally aligned. That makes Malaysia appealing. It also makes it easy to underestimate how premium the route can become.",
    "",
    "For Indian students in 2026, Malaysia should not be treated as a generic study medicine abroad destination. It should be treated as a high-cost, English-medium, university-driven decision. Some public program structures in Malaysia look academically strong and internationally oriented. At the same time, the total tuition signal at visible institutions can place Malaysia far above the budget range many families mentally associate with MBBS abroad.",
    "",
    "This guide is for students and parents who want a serious answer to a practical question: when does Malaysia make sense, and when does it become an expensive idea that only sounds good on paper? To answer that, we need to look at public fee signals, university models, recognition thinking, student fit, and the type of family that can sustainably support a Malaysia pathway over the full degree cycle.",
    "",
    section(
      "Why Malaysia Gets Attention From Indian Families",
      `Malaysia offers a few things that immediately stand out in the MBBS abroad market.

${bullets([
  "English-medium teaching is much easier to find and understand on public university pages.",
  "The country often feels culturally easier to process than colder or more remote destinations.",
  "Urban infrastructure, food variety, and travel connectivity can look more comfortable for Indian families.",
  "Some institutions present themselves with an international academic image that appeals to families seeking a more premium route."
])}

That combination creates a powerful first impression. Families see English, modern campuses, and a more approachable environment, then assume Malaysia may be a cleaner alternative to CIS countries. That instinct is not irrational. But it still needs a hard financial and strategic filter.`
    ),
    section(
      "What the Public Fee Signals Already Tell You",
      `One of the fastest ways to understand Malaysia is to look at public tuition figures from visible institutions.

International Medical University's public medicine page currently shows a total tuition figure of RM 692,680 for the full medicine pathway. The University of Cyberjaya's international-fees page has shown an MBBS structure at RM 450,000, alongside a visible tuition waiver that brings the payable figure to RM 380,000 in the displayed schedule, with separate administrative and visa-related charges still relevant. RCSI & UCD Malaysia Campus has publicly shown a total medicine-fee signal of EUR 155,000 for international students under its published model.

These numbers matter because they break a common illusion immediately. Malaysia is not competing with low-cost MBBS abroad destinations. It is competing with premium international pathways.`
    ),
    section(
      "What Makes Malaysia Academically Different",
      `Malaysia's public medical-program ecosystem often feels more structured and international-facing than many mass-market MBBS abroad pitches. Some universities clearly present long-form medicine tracks, international admissions, and modern campus identity. That is part of the reason Malaysia appeals to families who want something that feels more institution-led than agent-led.

Possible academic advantages include:

${bullets([
  "clearer English-medium communication on official websites",
  "a campus environment that may feel more familiar to international students",
  "stronger everyday comfort for students who struggle with severe climate or food adjustment",
  "a perception of better administrative organization at selected institutions"
])}

But none of that means Malaysia is automatically the best choice. Academic polish has a price. Families must decide whether that price improves the student's odds enough to justify the difference.`
    ),
    section(
      "Who Malaysia May Fit Well",
      `Malaysia can make sense for a narrower but very real student profile.

It may be a stronger fit when:

${bullets([
  "the family can comfortably fund a premium medical education without becoming cash-flow fragile",
  "the student values a more English-dominant environment and wants to reduce language friction",
  "the family is comparing Malaysia not with budget CIS routes, but with other premium private or international medical options",
  "the student may adapt better in a more urban, connected, and culturally familiar Asian environment",
  "the family is not choosing only by tuition minimization"
])}

For those families, Malaysia can represent a deliberate quality-over-cheapest-cost decision.`
    ),
    section(
      "Who Should Be Much More Careful",
      `Malaysia is usually a weak fit for families who are emotionally drawn to the environment but structurally unprepared for the cost.

Be cautious if:

${bullets([
  "the family is already looking for education-loan dependence to make the route barely work",
  "the student could be well-served by a less expensive but still defensible medical pathway",
  "the family is comparing Malaysia against low-cost MBBS abroad routes using only first impressions",
  "one parent wants the prestige of a premium foreign degree but the household budget does not support that ambition comfortably",
  "the plan assumes no cost escalation, no exchange-rate pressure, and no emergency spending over multiple years"
])}

Malaysia can also become risky when students choose it mainly because it feels safer or more modern than other abroad destinations.`
    ),
    section(
      "Recognition and Return-to-India Planning",
      `For Indian families, no discussion of Malaysia is complete without recognition thinking. The exact university and degree pathway must be verified independently for return-to-India relevance.

That means checking:

${numbered([
  "the university's listing and public standing in recognized global medical directories",
  "whether the exact pathway the student joins aligns with current foreign medical graduate expectations relevant to India",
  "the student's NEET eligibility status",
  "whether any transnational or partner-campus structure creates documentation or pathway questions that should be clarified before admission"
])}

This matters especially in Malaysia because some institutions market themselves in strongly international terms. Families may assume that an internationally branded campus is therefore automatically simple for Indian return planning. That is not a safe assumption.`
    ),
    section(
      "Malaysia Is Not a Budget-Country Comparison",
      `One of the biggest mistakes families make is comparing Malaysia to Kazakhstan, Kyrgyzstan, or other low-cost routes as if the only variable is destination preference.

Malaysia belongs in a different comparison bucket. It should be compared more honestly against:

${bullets([
  "premium private MBBS in India where the family is already prepared for a large spend",
  "other high-cost English-medium international medicine pathways",
  "the student's need for a more comfortable and English-forward living environment"
])}

If a family compares Malaysia only against the cheapest abroad fee tables, Malaysia will look unreasonable. When a destination lives in a premium bracket, the question becomes: what additional value is the family truly buying, and is that value worth the extra financial load?`
    ),
    section(
      "Student Life, Food, Culture, and Everyday Comfort",
      `Malaysia's everyday-life advantage is one of its strongest hidden selling points. For many Indian students, climate adjustment, food familiarity, travel access, and urban living matter more than they admit initially. A student who feels physically and socially settled often studies more consistently.

Possible Malaysia advantages at the daily-life level include:

${bullets([
  "less intimidating food adaptation for many Indian students",
  "city life that may feel more internationally accessible",
  "better comfort for students who are anxious about remote or extremely cold destinations",
  "easier emotional buy-in from parents who are deeply worried about harsh adaptation"
])}

But even here, the family should stay realistic. Daily comfort does not eliminate academic pressure, financial pressure, or licensing pressure. It simply changes the type of friction the student experiences.`
    ),
    section(
      "University Models in Malaysia Are Not All the Same",
      `Another reason Malaysia needs careful evaluation is that the visible university models are not identical. Some pathways are presented as fully local campus-based medicine degrees. Some carry strong international branding. Some are part of a transnational or partner-linked structure. Each model creates a slightly different academic and financial story.

That matters for three reasons. First, the student experience can differ. Second, the fee story can differ dramatically. Third, recognition and documentation questions can differ by structure. The more internationally branded or partner-linked the pathway, the more carefully the family should verify exactly what degree is awarded, what the training sequence looks like, and how all documents line up for later use.`
    ),
    section(
      "Living Costs, Lifestyle Creep, and the Premium Trap",
      `Malaysia's environment can be a real advantage, but it can also create a hidden budgeting problem: lifestyle creep. When a city feels more comfortable, accessible, and familiar, students and parents sometimes loosen spending discipline without noticing.

Possible pressure points include:

${bullets([
  "private accommodation upgrades over time",
  "frequent food delivery or eating-out habits",
  "higher routine transport and personal-comfort spending in urban settings",
  "more casual domestic travel or lifestyle purchases because the environment feels easier"
])}

Families should therefore set expectations early. What type of monthly lifestyle is actually sustainable? What is the emergency buffer? What happens if the student wants better housing after the first year? These are not side questions. In premium destinations, they are part of the core risk analysis.`
    ),
    section(
      "A Better Way to Judge the Cost",
      `Instead of asking whether Malaysia is expensive in abstract terms, families should ask whether the cost is proportionate to the family's capacity and the student's needs.

Use this lens:

${numbered([
  "Can we pay the route without turning every future year into a financial negotiation?",
  "Are we buying meaningful academic and environment advantages, or are we buying comfort branding?",
  "Would a lower-cost but credible route still meet the student's long-term goals just as well?",
  "Will the student actually use the environmental advantages Malaysia offers, or are we paying premium fees for emotional reassurance alone?"
])}

That framework changes the conversation. It stops Malaysia from being evaluated as good or bad and starts evaluating it as proportionate or disproportionate.`
    ),
    section(
      "Questions Every Family Should Ask Before Shortlisting Malaysia",
      `Before Malaysia becomes a serious option, the family should ask:

${bullets([
  "What is the total tuition and what extra administrative charges are separate?",
  "What are the visa, renewal, and living-cost implications beyond tuition?",
  "What exactly is the campus model and degree structure?",
  "What current student feedback says about academic rigor and support?",
  "What is our backup if the budget becomes tighter after the first year?",
  "Why are we choosing Malaysia instead of a lower-cost or India-based option?"
])}

Weak answers to these questions usually mean the family is attracted to the image of Malaysia rather than to a fully processed decision.`
    ),
    section(
      "A Simple Malaysia Suitability Test for Families",
      `Before placing Malaysia on the final shortlist, families should run a blunt suitability test.

Ask:

${numbered([
  "If the same total spend were needed inside India private MBBS, would we still accept it calmly?",
  "Are we choosing Malaysia for the student, or for our own emotional comfort with a polished environment?",
  "Can we still sustain the route if exchange-rate movement, yearly fee adjustments, or lifestyle costs rise modestly?",
  "Would the student actually use the English-medium and urban-comfort advantages enough to justify the premium?"
])}

Malaysia should survive not only admiration but also arithmetic. When a destination survives both, the family can move forward with much more confidence.`
    ),
    section(
      "Malaysia vs Private MBBS in India",
      `This is one of the most important comparisons and one that families often avoid. If Malaysia is financially plausible, then private MBBS in India may also be part of the real comparison set.

The family should compare both on:

${bullets([
  "total cost across the degree",
  "living-away-from-home reality",
  "quality of daily student experience",
  "long-term licensing and career planning",
  "financial stress on the household",
  "the student's maturity and adaptation profile"
])}

For some families, India private MBBS will still be more sensible despite the cost. For others, Malaysia may feel like a better use of the same spending band if the student strongly prefers an international environment and the university fit is stronger.`
    ),
    section(
      "Quick FAQ",
      `**Is Malaysia a budget-friendly MBBS abroad option?**

No. Public tuition figures show that Malaysia sits in a premium band for international medical education.

**Why do some families still prefer it?**

Because the English-medium environment, urban comfort, and university presentation may feel stronger and easier than some lower-cost destinations.

**Should Malaysia be compared with Kazakhstan or Kyrgyzstan only?**

Not really. A fairer comparison often includes premium private MBBS in India and other higher-cost international options.

**Who benefits most from Malaysia?**

Families that can afford a premium route calmly and students who will genuinely benefit from the English-forward, more comfortable environment.`
    ),
    section(
      "Final Take",
      `Malaysia in 2026 is best treated as a premium medical-education choice for Indian students, not as a generic MBBS abroad destination. Its public fee signals are high, its appeal is real, and its fit is highly dependent on family finances and student profile.

If your family can fund Malaysia honestly and the student will benefit materially from the environment it offers, it may be worth serious consideration. But if the attraction is mostly emotional while the budget is fragile, Malaysia can become one of the costliest forms of hesitation in the MBBS abroad market. The right decision is therefore not whether Malaysia looks attractive. It is whether Malaysia remains sensible after the numbers and the long-term plan are fully visible.

In practical terms, Malaysia belongs on the shortlist only after the family has accepted the premium band fully, compared it against India and other serious options, and still believes the value holds. That is the standard a premium destination should meet.`
    ),
    "",
    malaysiaCta,
  ].join("\n");
}

function buildPostNeetGuide() {
  return [
    "# After NEET 2026: What Indian Students Should Do in the First 14 Days Before Choosing MBBS Abroad, Private MBBS, or a Drop Year",
    "",
    "The first 14 days after NEET are some of the most emotionally dangerous days in the entire medical-admission cycle. The exam is over, but certainty is not. Students feel relief, fear, overconfidence, regret, exhaustion, and comparison pressure almost at the same time. Families feel a similar mixture. That emotional state creates a market opportunity for rushed advice, premature counseling calls, and decisions made before the mind has actually caught up with the moment.",
    "",
    "That is why the period immediately after NEET matters so much. Not because all decisions must be taken quickly, but because the wrong emotional habits formed in those 14 days can distort every later decision about private MBBS in India, MBBS abroad, or a drop year. Families that use the first two weeks well usually end up comparing better. Families that use them badly often feel pushed, confused, and financially exposed very early.",
    "",
    "This guide is designed to help Indian students and parents use those 14 days properly. It is not a motivational speech and not a sales funnel disguised as urgency. It is a practical post-NEET operating plan: what to do in the first 48 hours, when to begin score-based thinking, how to organize documents, when to talk about private MBBS or abroad options, how to avoid consultant pressure, and what a smart family should know before the decision market becomes noisy.",
    "",
    section(
      "Why the First 14 Days Matter So Much",
      `The NEET cycle does not end when the paper ends. It changes shape. Before the exam, stress is about performance. After the exam, stress becomes about interpretation and direction.

Students suddenly face:

${bullets([
  "memory-based answer debates",
  "pressure from relatives asking what the score will be",
  "friends announcing confidence or panic online",
  "agents and counsellors trying to open admission conversations early",
  "parents wondering whether to think about India private MBBS, MBBS abroad, or another attempt"
])}

That combination is dangerous because the family may start making strategic decisions while still in an unstable emotional state. The first 14 days should therefore be used to slow emotional volatility, improve factual clarity, and build decision readiness. This is a preparation phase, not a payment phase.`
    ),
    section(
      "Days 1 to 2: Recover Before You Interpret",
      `The first 48 hours after NEET should be about decompression, not destiny.

Students should:

${bullets([
  "sleep properly",
  "reduce answer-discussion exposure",
  "avoid treating memory-based debates as final truth",
  "resist the temptation to define their entire future in one evening"
])}

Parents should:

${bullets([
  "avoid constant score interrogation",
  "avoid comparing the student with cousins or neighbors",
  "avoid inviting extended-family judgement into the house immediately",
  "allow the student's nervous system to settle before launching planning conversations"
])}

One practical rule helps a lot: for the first two days, no major education decision should be spoken as if it is final. Discussion is fine. Finality is not.`
    ),
    section(
      "Days 3 to 4: Organize Facts, Not Theories",
      `Once the immediate emotional dust settles, the family should move into factual organization.

Organize:

${bullets([
  "NEET application records and admit-card copies",
  "photo ID records",
  "Class 10 and Class 12 documents",
  "passport status if MBBS abroad may become relevant",
  "basic budget notes: what the family can truly spend, not what it hopes it can spend"
])}

Families should also start writing down three separate questions instead of mixing them:

${numbered([
  "What result range do we realistically expect?",
  "What options does that result range open or close?",
  "What can the family actually sustain financially and emotionally?"
])}`
    ),
    section(
      "Days 5 to 7: Build a Pathway Comparison, Not a Panic Story",
      `By the middle of the second week, the family should begin comparing pathways properly. This is where most households go wrong. Instead of running a comparison, they run a panic story.

A proper comparison should include three columns:

| Path | What to compare |
|---|---|
| Private MBBS in India | seat realism, full cost, family comfort, location fit |
| MBBS abroad | recognition, six-year affordability, country-university fit, student readiness |
| Drop year | probability of meaningful score improvement, student's emotional stamina, household environment |

Once families start comparing like this, weak arguments collapse quickly. Many decisions that felt urgent suddenly look incomplete.`
    ),
    section(
      "How to Think About a Drop Year Honestly",
      `A drop year should not be treated as either a noble sacrifice or a humiliating failure. It is simply one strategic option. The question is whether it is a strong option for this particular student in 2026.

It becomes more reasonable when:

${bullets([
  "the student was genuinely close to the needed outcome",
  "the student still has energy for one more disciplined cycle",
  "the household can support a calmer and more structured preparation year",
  "there is a clear improvement plan rather than a vague hope of doing better"
])}

It becomes weaker when:

${bullets([
  "the student is emotionally burnt out",
  "the previous preparation pattern was unstable and no real correction exists",
  "the home environment is full of pressure and criticism",
  "the family is choosing a repeat year mainly because it cannot emotionally accept abroad or private options"
])}`
    ),
    section(
      "How to Think About Private MBBS in India",
      `Private MBBS in India should be evaluated with the same honesty as MBBS abroad. Families often do the opposite. They evaluate India emotionally and abroad analytically, or vice versa. That leads to poor comparison.

The correct questions are:

${bullets([
  "What is the realistic fee burden across the full course, not just the first demand?",
  "Is the family comfortable with the financing pressure?",
  "Would the student do better academically and emotionally staying within India?",
  "Would another option offer a similar or better outcome with less strain?"
])}

The first two weeks after NEET are a good time to gather structure, not to emotionally lock into a private college option because it feels safe.`
    ),
    section(
      "How to Think About MBBS Abroad in the First 14 Days",
      `The best use of the first two post-NEET weeks for MBBS abroad is preparation, not commitment.

Families should use this period to:

${bullets([
  "understand which countries are even worth comparing",
  "organize documents that later matter for abroad admissions",
  "check passport validity and major paperwork gaps",
  "write the real six-year budget range",
  "start learning the difference between country-level marketing and university-level verification"
])}

Families should avoid:

${bullets([
  "paying booking amounts because the exam emotion is still high",
  "believing any single agent list without verification",
  "assuming every English-medium option is automatically suitable",
  "treating abroad as one category with one cost and one outcome"
])}`
    ),
    section(
      "The Document Work That Makes Later Decisions Easier",
      `One of the best uses of the first 14 days is quiet document readiness. This creates momentum without forcing a final choice.

Prepare:

${bullets([
  "NEET-related records",
  "Class 10 and Class 12 marksheets and certificates",
  "passport and passport validity check",
  "photos and digital folder backups",
  "basic identity documents used in future applications"
])}

This may sound administrative, but it has a strategic effect. Families who prepare documents calmly after NEET are less likely to panic later when a genuine opportunity appears.`
    ),
    section(
      "The Budget Conversation Families Should Have in Week Two",
      `Almost every weak medical-admission decision contains one common flaw: the family discussed emotion before it discussed money honestly.

In week two after NEET, the household should sit down and answer:

${numbered([
  "What is our real total budget, not our socially acceptable answer?",
  "How much can come from savings without destabilizing the family?",
  "How much dependence on loan or staggered payments are we realistically prepared for?",
  "What level of recurring yearly pressure can we carry without constant household conflict?"
])}

If the budget conversation is postponed, every later option looks superficially possible. Once the budget is written honestly, the shortlist improves immediately.`
    ),
    section(
      "How to Handle Counsellors, Agents, and Unsolicited Advice",
      `The first two weeks after NEET are peak noise season. Everyone seems to have advice. Many people also have a commercial interest.

Families should create a rule:

${bullets([
  "no payment decision in the first emotional wave",
  "no verbal promise accepted without written detail",
  "no country or university trusted only because it is repeated often",
  "no disrespect for the student's emotional condition while planning"
])}

The first 14 days should make the family more resistant to pressure, not more dependent on it.`
    ),
    section(
      "What Students Should Not Do in the Post-NEET Social-Media Spiral",
      `The post-NEET internet is one of the fastest ways to damage clarity. Students who are tired, uncertain, and comparison-sensitive often start consuming short-form content that turns every option into either a miracle or a disaster.

Students should avoid:

${bullets([
  "reel-based college decisions built on one fee line or one hostel clip",
  "score-prediction obsession that changes mood every few hours",
  "influencer-style advice from people who do not know the family's financial reality",
  "announcement culture where friends present half-decisions as certainty",
  "doom-scrolling through comments that turn every route into a social-status fight"
])}

The healthier rule is this: use long-form, written, comparable information for planning. Use direct conversations with trusted people for clarification. Treat fast, emotionally charged content as noise until proven otherwise.`
    ),
    section(
      "What Parents Usually Underestimate",
      `Parents often think their job after NEET is to gather options quickly. In reality, their more important job is to regulate the environment in which options are being discussed.

Parents usually underestimate:

${bullets([
  "how exhausted the student still is even after the exam is over",
  "how strongly relatives and family pride can distort decision quality",
  "how fast money conversations become emotional if budget reality is delayed",
  "how much damage one rushed booking amount can do if the family is not aligned"
])}

The strongest parents in this period are the ones who can hold the household in a calm, evidence-seeking mode.`
    ),
    section(
      "The Questions That Should Exist Before Any Booking Amount",
      `A surprising number of bad post-NEET decisions happen because the family allows payment to arrive before clarity. That order should always be reversed.

Before any booking amount is considered for MBBS abroad or a private-medical option, the family should be able to answer:

${bullets([
  "What exactly are we paying for right now?",
  "Is the amount refundable, partly refundable, or non-refundable under written terms?",
  "What documents or confirmations do we receive immediately after payment?",
  "What major questions about budget, recognition, or student fit are still unresolved?"
])}

The right order is simple: compare first, verify second, pay third. Most post-NEET damage happens when that order is reversed.`
    ),
    section(
      "A 14-Day Operating Plan You Can Actually Follow",
      `Here is a simple practical structure:

${numbered([
  "Days 1 to 2: rest, reduce answer-debate noise, do not finalize anything.",
  "Days 3 to 4: organize documents and write budget reality.",
  "Days 5 to 7: compare private MBBS, MBBS abroad, and drop year on the same sheet.",
  "Days 8 to 10: eliminate obviously weak options and identify what still needs verification.",
  "Days 11 to 14: speak only to serious advisors, ask written questions, and refine the shortlist."
])}

This plan works because it follows emotional reality. It does not demand that the family become perfectly logical overnight.`
    ),
    section(
      "What a Strong Family Usually Does Better",
      `Families that handle the post-NEET phase well usually share a few habits.

${bullets([
  "They do not confuse urgency with intelligence.",
  "They write down the budget instead of speaking around it.",
  "They compare all serious pathways under the same criteria.",
  "They protect the student's mental state instead of treating the student like a project.",
  "They ask for clarity before money moves."
])}

These habits sound simple, but they create a huge advantage.`
    ),
    section(
      "Quick FAQ",
      `**Should we decide anything major in the first 48 hours after NEET?**

No. Use that time for recovery, not finality.

**Is it okay to explore MBBS abroad in the first 14 days?**

Yes, but mainly for document readiness, budgeting, and country-level orientation, not rushed booking.

**How do we know if a drop year is realistic?**

Check whether the student still has energy, a real improvement plan, and a home environment that can support another cycle constructively.

**When should the family start serious counselling conversations?**

After the initial emotional shock settles and after the budget and pathway comparison have been written down clearly.`
    ),
    section(
      "Final Take",
      `The first 14 days after NEET 2026 should not be used to prove courage, save face, or satisfy relatives. They should be used to build clarity. A student who has just finished one of the most stressful exams in India does not need immediate life verdicts. The student needs rest, structure, documents, budget honesty, and a comparison framework.

Families that do that well usually make cleaner decisions about private MBBS, MBBS abroad, or a drop year. Families that skip those steps often spend the next few months correcting choices that should never have been rushed. In other words, the smartest thing to do immediately after NEET is not to move fastest. It is to think in the right order.

That order is simple and powerful: calm first, documents second, budget third, comparison fourth, commitment last. Students who follow that sequence usually feel less trapped and families who follow it usually spend less money correcting avoidable mistakes over time. It also protects confidence during a very noisy decision window.`
    ),
    "",
    postNeetCta,
  ].join("\n");
}

const posts = [
  {
    slug: "mbbs-in-bosnia-2026-complete-guide-indian-students",
    title:
      "MBBS in Bosnia 2026: Complete Guide for Indian Students on Fees, English Medical Programs, Eligibility, and Long-Term Fit",
    excerpt:
      "A detailed MBBS in Bosnia 2026 guide for Indian students covering English-medium medicine, Sarajevo and Mostar fee signals, recognition checks, student fit, living costs, and whether Bosnia deserves a place on your shortlist.",
    category: "MBBS Abroad",
    metaTitle: "MBBS in Bosnia 2026 for Indian Students | Fees & Fit Guide",
    metaDescription:
      "Explore MBBS in Bosnia 2026 for Indian students. Understand English medical programs, public fee signals, recognition checks, living costs, and whether Bosnia is a smart Europe option.",
    publicId:
      "studentstraffic/blog/mbbs-in-bosnia-2026-complete-guide-indian-students",
    filename: "mbbs-in-bosnia-2026-complete-guide-indian-students.svg",
    kicker: "MBBS Abroad",
    badge: "Bosnia Guide",
    accent: "#4D6C8D",
    titleLines: ["MBBS in Bosnia", "2026 Guide for", "Indian Students"],
    chips: ["Europe", "Fees", "Fit"],
    content: buildBosniaGuide(),
  },
  {
    slug: "mbbs-in-malaysia-2026-complete-guide-indian-students",
    title:
      "MBBS in Malaysia 2026: Complete Guide for Indian Students on Fees, English-Medium Medicine, Eligibility, and Whether the Premium Cost Is Worth It",
    excerpt:
      "A long-form MBBS in Malaysia 2026 guide for Indian students covering public tuition signals from leading universities, English-medium learning, living comfort, recognition thinking, and whether Malaysia justifies its premium cost.",
    category: "MBBS Abroad",
    metaTitle: "MBBS in Malaysia 2026 for Indian Students | Fees Guide",
    metaDescription:
      "Understand MBBS in Malaysia 2026 for Indian students with public tuition signals, English-medium medical study options, recognition checks, and a practical premium-cost comparison.",
    publicId:
      "studentstraffic/blog/mbbs-in-malaysia-2026-complete-guide-indian-students",
    filename: "mbbs-in-malaysia-2026-complete-guide-indian-students.svg",
    kicker: "MBBS Abroad",
    badge: "Malaysia Guide",
    accent: "#6B8152",
    titleLines: ["MBBS in Malaysia", "2026 Guide for", "Indian Students"],
    chips: ["English", "Premium", "Compare"],
    content: buildMalaysiaGuide(),
  },
  {
    slug: "after-neet-2026-first-14-days-plan-mbbs-abroad-private-mbbs-drop-year",
    title:
      "After NEET 2026: What Indian Students Should Do in the First 14 Days Before Choosing MBBS Abroad, Private MBBS, or a Drop Year",
    excerpt:
      "A practical post-NEET 2026 guide for Indian students and parents covering the first 14 days after the exam, document readiness, budget honesty, drop-year thinking, private MBBS comparison, and how to avoid rushed MBBS abroad decisions.",
    category: "Admissions Strategy",
    metaTitle:
      "After NEET 2026: First 14 Days Plan for Students and Parents",
    metaDescription:
      "Use this after-NEET 2026 first-14-days plan to compare MBBS abroad, private MBBS, and a drop year with better budget clarity, document readiness, and calmer decision-making.",
    publicId:
      "studentstraffic/blog/after-neet-2026-first-14-days-plan-mbbs-abroad-private-mbbs-drop-year",
    filename:
      "after-neet-2026-first-14-days-plan-mbbs-abroad-private-mbbs-drop-year.svg",
    kicker: "Admissions Strategy",
    badge: "Post-NEET Plan",
    accent: "#A06942",
    titleLines: ["After NEET 2026", "Your First 14", "Days Plan"],
    chips: ["Decide", "Compare", "Avoid Panic"],
    content: buildPostNeetGuide(),
  },
];

async function run() {
  if (!hasDatabase) {
    throw new Error("DATABASE_URL is missing.");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    const results = [];

    for (const post of posts) {
      const coverPath = join(outDir, post.filename);
      writeFileSync(coverPath, renderFallbackSvg(post), "utf8");
      const coverUrl = await uploadCover(post, coverPath);
      const minutes = Math.max(1, Math.ceil(readingTime(post.content).minutes));
      const count = post.content.trim().split(/\s+/).length;

      const response = await client.query(
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
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,'published',$9,NOW(),NOW(),NOW()
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          cover_url = COALESCE(EXCLUDED.cover_url, blog_posts.cover_url),
          category = EXCLUDED.category,
          meta_title = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description,
          status = 'published',
          reading_time_minutes = EXCLUDED.reading_time_minutes,
          updated_at = NOW(),
          published_at = COALESCE(blog_posts.published_at, EXCLUDED.published_at)
        RETURNING id, slug, cover_url, status, published_at`,
        [
          post.slug,
          post.title,
          post.excerpt,
          post.content,
          coverUrl,
          post.category,
          post.metaTitle,
          post.metaDescription,
          minutes,
        ]
      );

      results.push({
        ...response.rows[0],
        wordCount: count,
        readingTimeMinutes: minutes,
      });
    }

    const artifactPath = join(
      artifactDir,
      "students-traffic-blogs-2026-04-22-published.json"
    );
    writeFileSync(
      artifactPath,
      JSON.stringify(
        {
          publishedAt: new Date().toISOString(),
          posts: results,
        },
        null,
        2
      )
    );
    console.log(JSON.stringify(results, null, 2));
    console.log(`artifact=${artifactPath}`);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
