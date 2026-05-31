import Link from "next/link";
import type { Metadata } from "next";

import { CounsellingCtaButton } from "@/components/site/counselling-cta-button";
import { JsonLd } from "@/components/shared/json-ld";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

const pagePath = "/free-mbbs-in-abroad-for-indian-students";
const publishedDate = "2026-05-21";

export const metadata: Metadata = buildIndexableMetadata({
  title:
    "Free MBBS in Abroad for Indian Students: Truth, Scholarships & Best Paths",
  description:
    "Can Indian students study MBBS abroad for free? Get the honest 2026 answer, realistic scholarship options, NMC checks, hidden costs, and the safest low-cost paths.",
  path: pagePath,
  openGraphType: "article",
  keywords: [
    "free mbbs in abroad for indian students",
    "how to study mbbs abroad for free",
    "mbbs abroad scholarship for indian students",
    "tuition free mbbs abroad",
    "low cost mbbs abroad for indian students",
    "nmc rules for mbbs abroad",
  ],
});

const keyTakeaways = [
  "There is almost no true zero-cost MBBS abroad path for Indian students. In most cases, 'free' means tuition support, not free living, travel, insurance, visa, books, and exam costs.",
  "The strongest officially visible opportunity right now is the Russian Federation scholarship route, which the Government of India publicized for the 2026-27 academic year with 300 scholarships across disciplines including medicine.",
  "India's Ministry of Education also clearly says it does not run a general Government of India scheme that funds Indians to pursue higher studies abroad. That is why many online 'free MBBS' claims are misleading.",
  "For students who want to keep the option of returning to India, NMC/FMGL compliance checks matter as much as fees. A cheaper seat is not a good deal if the degree structure creates registration risk later.",
];

const realisticPaths = [
  {
    title: "Government scholarship seats",
    summary:
      "Rare, competitive, and highly valuable. These are the closest thing to genuinely free or near-free MBBS abroad.",
    details:
      "The Russian Federation notice for the 2026-27 cycle publicly mentions 300 scholarships for Indian citizens, includes medicine, and says the scholarship covers tuition fees. That is meaningful, but it is not a blanket promise of a fully free 6-year journey.",
  },
  {
    title: "Public-university systems with lower tuition",
    summary:
      "Some countries are often marketed as tuition-free or low-tuition in search results, but they usually come with tough entry barriers.",
    details:
      "The catch is usually one or more of these: local-language learning, highly competitive entrance exams, limited international seats, slower admissions, and living costs that remain fully your responsibility.",
  },
  {
    title: "Partial university scholarships",
    summary:
      "This is the most common reality for Indian students: not free MBBS abroad, but reduced tuition.",
    details:
      "Typical discounts are partial and profile-based. A university may reduce first-year tuition, waive part of hostel cost, or provide a merit scholarship after enrollment. These help, but they rarely erase the full program cost.",
  },
  {
    title: "Smart low-cost planning instead of 'free' chasing",
    summary:
      "For most families, the best outcome comes from choosing a compliant, lower-risk country and controlling total cost honestly.",
    details:
      "That means comparing tuition, hostel, food, travel, documentation, exam costs, and future licensing risks together rather than chasing a flashy '100% scholarship' headline.",
  },
];

const hiddenCosts = [
  "Hostel or rent",
  "Food and daily living",
  "Health insurance and medical tests",
  "Visa, FRRO or renewal formalities where applicable",
  "Flight tickets and baggage",
  "University registration, lab, or document fees",
  "Local language training during clinical years in some countries",
  "Licensing-exam preparation and return-to-India paperwork",
];

const redFlags = [
  "The consultant says 'free MBBS' but cannot show the official scholarship notice or university scholarship policy in writing.",
  "The quoted scholarship is huge, but the original base tuition is suspiciously inflated.",
  "You are told not to worry about NMC or India-return rules because 'everyone goes'.",
  "The course structure, clinical training, or internship arrangement is explained vaguely.",
  "The admissions team pushes immediate payment before giving written fee structure, refund terms, and university-issued offer details.",
];

const actionPlan = [
  "The India-return pathway is assessed first. FMGL and NMC compliance are non-negotiable before any other factor is considered.",
  "We shortlist by total 6-year cost — not only by tuition headline.",
  "Every 'free' or scholarship route is verified to be official, recurring, and documented for the current cycle before it is presented to a family.",
  "The full cost after the scholarship — hostel, food, visa, insurance, language, exams, and travel — is modelled and presented alongside the headline saving.",
  "Scholarship routes are compared against low-cost MBBS abroad alternatives so families make a decision based on the full picture.",
  "Every financial commitment is confirmed in writing before any seat-booking amount is collected.",
];

const faqItems = [
  {
    question: "Is free MBBS in abroad really possible for Indian students?",
    answer:
      "It is possible only in very limited, highly competitive situations. For most Indian students, the realistic outcome is reduced tuition or a partial scholarship, not a completely free MBBS journey.",
  },
  {
    question: "Which country currently has the clearest official scholarship signal for Indian students in medicine?",
    answer:
      "The public 2026-27 Russian Federation scholarship notice is one of the clearest official signals because it explicitly includes medicine and says tuition is covered. Students still need to verify the university, medium, structure, and remaining living expenses.",
  },
  {
    question: "Does the Government of India give a general MBBS abroad scholarship to all Indian students?",
    answer:
      "No. The Ministry of Education states it does not administer a general Government of India scheme that provides scholarship, fellowship, financial assistance, or loan support to pursue higher studies abroad.",
  },
  {
    question: "Can a scholarship make MBBS abroad fully free from start to finish?",
    answer:
      "Sometimes tuition may be covered, but the full journey is rarely free. Students still commonly pay for living, travel, insurance, visa work, books, and other academic expenses.",
  },
  {
    question: "Should I choose a scholarship seat over a regular low-cost MBBS abroad seat?",
    answer:
      "Only if the scholarship route is genuine and the university remains a strong fit on compliance, language, internship, and long-term licensing questions. A scholarship does not fix a weak academic or regulatory pathway.",
  },
  {
    question: "What is better for most families: chasing free MBBS abroad or planning affordable MBBS abroad properly?",
    answer:
      "For most families, affordable and compliant planning wins. A transparent low-cost path is usually safer than a glamorous 'free MBBS' promise that later breaks on hidden costs or regulatory issues.",
  },
];

const officialSources = [
  {
    label: "Government of India: Russian Federation scholarships for 2026-27",
    href: "https://www.education.gov.in/sites/upload_files/mhrd/files/Scholarships_Russia_Federation_AY_2026_27.pdf",
    note: "Public notice says 300 scholarships, includes medicine, and states tuition is covered.",
  },
  {
    label: "Ministry of Education: External scholarships guidance",
    href: "https://www.education.gov.in/en/scholarships-education-loan-2",
    note: "States the Ministry does not administer a general scheme funding Indians to pursue higher studies abroad.",
  },
  {
    label: "NMC rules and regulations",
    href: "https://www.nmc.org.in/rules-regulations-nmc/",
    note: "Primary reference point for Indian students verifying the medical licensing pathway.",
  },
  {
    label: "NMC FMG FAQs",
    href: "https://www.nmc.org.in/MCIRest/open/getDocument?path=%2FDocuments%2FPublic%2FPortal%2FLatestNews%2F20220222165635.pdf",
    note: "Useful explanatory FAQ alongside the formal regulations.",
  },
];

export default function FreeMbbsAbroadPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Free MBBS in Abroad for Indian Students",
      description:
        "A realistic 2026 guide on whether Indian students can study MBBS abroad for free, including scholarship routes, NMC checks, hidden costs, and practical planning advice.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Free MBBS in Abroad for Indian Students",
        path: pagePath,
      },
    ]),
    getFaqStructuredData(faqItems, pagePath),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent/10 via-background to-background px-6 py-16 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30%),linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-5 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            Updated on 21 May 2026
          </div>
          <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Free MBBS in Abroad for Indian Students: the honest 2026 answer
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            If you are searching for <strong>free MBBS in abroad for Indian students</strong>, the short answer is this:
            <span className="font-medium text-foreground"> truly free MBBS abroad is rare</span>, but there are still real scholarship routes,
            lower-cost systems, and smarter ways to make an overseas medical degree affordable without falling for fake promises.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/mbbs-abroad"
              className="rounded-full bg-foreground px-5 py-3 font-medium text-background transition hover:opacity-90"
            >
              Explore MBBS abroad options
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-muted"
            >
              Get a realistic shortlist
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Quick answer
              </h2>
              <div className="mt-6 space-y-4">
                {keyTakeaways.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border/70 bg-background p-4 text-base leading-7 text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                What “free MBBS abroad” usually means in real life
              </h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
                <p>
                  Many top search results use phrases like <em>study MBBS abroad for free</em>, <em>tuition-free MBBS abroad</em>, or
                  <em> fully funded MBBS scholarship</em>. The problem is that these phrases often combine very different things:
                  scholarship seats, low-tuition countries, public universities, and marketing discounts.
                </p>
                <p>
                  For Indian families, a better question is not <em>“Is MBBS abroad free?”</em> but
                  <strong className="text-foreground"> “How much of the total cost can genuinely be reduced, and what risks remain?”</strong>
                </p>
                <p>
                  A route can still be excellent even if it is not free. What matters is whether the student gets a serious medical degree,
                  predictable clinical training, manageable total cost, and a licensing pathway that still makes sense years later.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                The realistic ways Indian students reduce MBBS abroad cost
              </h2>
              <div className="mt-6 grid gap-5">
                {realisticPaths.map((path) => (
                  <div
                    key={path.title}
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                  >
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {path.title}
                    </h3>
                    <p className="mt-2 text-base font-medium text-foreground/90">
                      {path.summary}
                    </p>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                      {path.details}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                The strongest official example right now: Russia scholarship route
              </h2>
              <div className="mt-6 rounded-3xl border border-accent/20 bg-accent/5 p-6 sm:p-8">
                <p className="text-base leading-8 text-foreground">
                  Based on the Government of India public notice for the <strong>2026-27</strong> cycle, the Russian Federation announced
                  <strong> 300 scholarships for Indian citizens</strong>. The notice explicitly includes <strong>medicine</strong> and says the
                  scholarship <strong>covers tuition fees</strong>.
                </p>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  That makes it one of the most credible answers to the “free MBBS abroad” question. But students should still read it correctly:
                  tuition coverage is not the same as a zero-cost medical journey. You still need to evaluate living expenses, university allocation,
                  language realities, medical program structure, and future compliance for practice plans.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                A major myth to avoid
              </h2>
              <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
                <p className="text-base leading-8 text-foreground">
                  India&apos;s Ministry of Education says it <strong>does not administer a general scheme</strong> that provides scholarship,
                  fellowship, financial assistance, or loan support for Indians to pursue higher studies abroad.
                </p>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  This is exactly why so many “Government scholarship for free MBBS abroad” claims fall apart when families ask for the official notice.
                  If someone says a broad Government of India MBBS abroad scheme exists for everyone, ask for the current official document immediately.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Before fees, check the India-return pathway
              </h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
                <p>
                  Students who may want to return to India after graduation should not choose a university only because it looks cheap or because a
                  scholarship sounds attractive. The safer approach is to verify the <strong className="text-foreground">full degree structure</strong>:
                  duration, teaching medium, clinical training, internship design, and documentation.
                </p>
                <p>
                  The NMC rules and FAQ materials are the right starting point here. In practical terms, you should treat every “free” or “discounted”
                  MBBS offer as secondary to the larger question of whether the foreign medical degree path stays usable for your long-term career.
                </p>
                <p>
                  A weak pathway does not become safe just because the first-year tuition is lower.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Hidden costs most search results underplay
              </h2>
              <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {hiddenCosts.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Red flags when someone promises free MBBS abroad
              </h2>
              <div className="mt-6 space-y-3">
                {redFlags.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-base leading-7 text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                A better plan than chasing the perfect headline
              </h2>
              <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <ol className="space-y-4">
                  {actionPlan.map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                        {index + 1}
                      </div>
                      <p className="pt-0.5 text-base leading-7 text-muted-foreground">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Source-backed checks
              </h2>
              <div className="mt-6 grid gap-4">
                {officialSources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:border-accent/30 hover:bg-accent/5"
                  >
                    <div className="text-lg font-semibold text-foreground">
                      {source.label}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {source.note}
                    </p>
                  </a>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                FAQs
              </h2>
              <div className="mt-6 space-y-4">
                {faqItems.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                  >
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-base leading-8 text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Best next reads
              </h2>
              <div className="mt-5 space-y-3">
                <Link
                  href="/mbbs-abroad"
                  className="block rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  MBBS abroad admission overview
                </Link>
                <Link
                  href="/blog"
                  className="block rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Read the latest blog guides
                </Link>
                <Link
                  href="/students"
                  className="block rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Talk to students already abroad
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-accent/20 bg-accent/5 p-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                The practical takeaway
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                The right goal for most families is not “free MBBS abroad at any cost.” It is
                <strong className="text-foreground"> affordable, documented, and low-regret MBBS abroad</strong>.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40 px-6 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-background p-8 shadow-sm sm:p-10">
          <h2 className="font-display text-3xl font-semibold text-foreground">
            Final word
          </h2>
          <div className="mt-5 space-y-5 text-base leading-8 text-muted-foreground">
            <p>
              If you searched for <strong>free MBBS in abroad for Indian students</strong>, the best answer is not a fantasy list. It is a filter.
              Use this topic to separate real scholarship routes from sales language.
            </p>
            <p>
              When a route is genuine, it survives simple questions: Is the scholarship official? What exactly does it cover? What costs remain? Is the
              medical degree structure still safe for my future plans? If those answers are clear, you may have found something valuable. If they stay vague,
              walk away.
            </p>
          </div>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
