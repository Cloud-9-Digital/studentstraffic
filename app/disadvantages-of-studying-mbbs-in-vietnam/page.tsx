import Link from "next/link";
import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { buildIndexableMetadata } from "@/lib/metadata";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";

const pagePath = "/disadvantages-of-studying-mbbs-in-vietnam";
const publishedDate = "2026-05-23";

export const metadata: Metadata = buildIndexableMetadata({
  title:
    "Disadvantages of Studying MBBS in Vietnam for Indian Students 2026",
  description:
    "Get the honest disadvantages of studying MBBS in Vietnam for Indian students, including university variation, clinical-language reality, and India-return decision risks.",
  path: pagePath,
  openGraphType: "article",
  keywords: [
    "disadvantages of studying mbbs in vietnam",
    "disadvantages of studying mbbs in vietnam for indian students",
    "mbbs in vietnam disadvantages",
    "is mbbs in vietnam good for indian students",
    "mbbs in vietnam for indian students",
    "medical colleges in vietnam",
  ],
});

const keyTakeaways = [
  "The biggest disadvantage of studying MBBS in Vietnam is not cost. It is that Vietnam still has a shorter India-facing track record than Russia, so students need sharper university-level due diligence.",
  "Vietnam is easier than Russia on climate and travel, but it is not risk-free. Clinical communication, hospital ecosystem quality, and actual university depth still vary more than many glossy pages admit.",
  "Some families treat Vietnam as automatically safer because it feels closer and warmer. That can lead to weak shortlists if they stop checking medium, internship design, and the real academic environment.",
  "Vietnam can still be a very strong option for Indian students, but the country works best when students choose specific universities carefully rather than buying the destination story alone.",
];

const disadvantageCards = [
  {
    title: "Shorter India-facing track record",
    summary:
      "Vietnam is newer in the Indian MBBS decision set than Russia.",
    details:
      "That does not make Vietnam a bad option, but it does mean families have less legacy familiarity, fewer long-term anecdotal references, and a smaller public proof trail than older MBBS-abroad destinations. Students should expect to verify more things directly.",
  },
  {
    title: "Quality spread between universities",
    summary:
      "Vietnam is not one uniform MBBS market.",
    details:
      "Public and private universities can feel very different in academic depth, hospital ecosystem, student support, and how clearly they can be explained to Indian parents. The destination can look clean on paper while one university is still a poor fit.",
  },
  {
    title: "Clinical-language reality still matters",
    summary:
      "English-facing programs do not remove local-language pressure completely.",
    details:
      "Many Indian students like Vietnam because it feels easier than Russia on language, but clinical years can still involve patient interaction where basic Vietnamese helps. Students who expect zero local-language adaptation may find the transition more difficult than they planned.",
  },
  {
    title: "Over-marketing around the 'easy' feel",
    summary:
      "Vietnam is sometimes sold too softly.",
    details:
      "Because the country is close to India, warmer, and more budget-friendly than many alternatives, some agencies over-simplify the decision. That can make families underestimate the need to verify clinical exposure, university structure, and India-return planning.",
  },
  {
    title: "Public information is thinner than for Russia",
    summary:
      "Vietnam often requires more direct clarification from the university or a careful advisor.",
    details:
      "The SERP itself shows the problem: many results are promotional and repetitive, while fewer pages explain the differences between universities clearly. Students may need more guided shortlisting instead of relying on easy ranking lists.",
  },
  {
    title: "Low fees can distract from long-term fit",
    summary:
      "Vietnam's affordability is real, but it can create lazy decision-making.",
    details:
      "A cheaper university is not automatically the best one. Students still need to compare teaching environment, city fit, hospital learning context, and the practical licensing path they want after graduation.",
  },
];

const whoShouldThinkTwice = [
  "Students who want a country with the longest and most familiar India-facing MBBS history.",
  "Families who are uncomfortable making a university decision when the public information landscape still feels patchy.",
  "Students who assume English-medium marketing means zero local-language adjustment in clinical years.",
  "Students who are choosing mainly because Vietnam feels cheaper or easier, without comparing universities seriously.",
];

const mitigationSteps = [
  "Shortlist universities one by one instead of treating Vietnam as a single uniform destination.",
  "Check how the university explains clinical training, not just classroom teaching.",
  "Use the fee page and shortlist page together so low cost does not overpower better decision factors.",
  "Prefer universities you can describe clearly to parents in terms of city, support, and academic environment.",
  "Treat India-return planning as part of the admission decision from the beginning, not as a late-stage worry.",
];

const faqItems = [
  {
    question: "What is the biggest disadvantage of studying MBBS in Vietnam?",
    answer:
      "For most Indian students, the biggest disadvantage is not fees or climate. It is the need for stronger university-level due diligence because Vietnam still has a shorter India-facing decision history than older destinations like Russia.",
  },
  {
    question: "Does Vietnam have language problems in MBBS like Russia?",
    answer:
      "Usually less intensely than Russia, but local-language adaptation still matters in clinical settings. Students should not assume that an English-facing program means patient interaction will always stay fully English.",
  },
  {
    question: "Do these disadvantages mean MBBS in Vietnam is a bad idea?",
    answer:
      "No. Vietnam can be a strong option for many Indian students. The point is that the country should be shortlisted through specific universities, not sold as an automatically safe answer just because it is close and affordable.",
  },
  {
    question: "How can students reduce the risks of studying MBBS in Vietnam?",
    answer:
      "Compare universities carefully, understand the clinical environment, and avoid choosing only on the basis of low tuition or warm-weather comfort. A better shortlist usually solves most Vietnam-related risk.",
  },
  {
    question: "What should I read after this page?",
    answer:
      "The best next reads are the Vietnam country page, Vietnam fees page, and the medical colleges in Vietnam shortlist page. Together they give you a practical decision view instead of a single objection page.",
  },
];

const nextReads = [
  {
    href: "/mbbs-in-vietnam",
    label: "MBBS in Vietnam for Indian students",
  },
  {
    href: "/mbbs-in-vietnam-fees",
    label: "MBBS in Vietnam fees",
  },
  {
    href: "/medical-colleges-in-vietnam",
    label: "Medical colleges in Vietnam",
  },
];

export default function VietnamDisadvantagesPage() {
  const structuredData = getStructuredDataGraph([
    getWebPageStructuredData({
      path: pagePath,
      name: "Disadvantages of Studying MBBS in Vietnam for Indian Students",
      description:
        "An honest 2026 guide to the disadvantages of studying MBBS in Vietnam for Indian students, including university variation, clinical-language reality, and shortlist quality.",
      datePublished: publishedDate,
      dateModified: publishedDate,
    }),
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      {
        name: "Disadvantages of Studying MBBS in Vietnam",
        path: pagePath,
      },
    ]),
    getFaqStructuredData(faqItems, pagePath),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent/10 via-background to-background px-6 py-16 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30%),linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-5 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            Updated on 23 May 2026
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Disadvantages of studying MBBS in Vietnam for Indian students
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                Vietnam is often pitched as the easier, closer, and warmer alternative in MBBS abroad. Some of that is true. But families still need to understand where Vietnam can disappoint if the shortlist is weak, the university fit is poor, or the country is being chosen only because it feels simpler than Russia.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <Link
                  href="/mbbs-in-vietnam"
                  className="rounded-full bg-foreground px-5 py-3 font-medium text-background transition hover:opacity-90"
                >
                  Read MBBS in Vietnam
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-muted"
                >
                  Get a realistic shortlist
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <DeferredLeadForm
                sourcePath={pagePath}
                ctaVariant="commercial_decision_sidebar"
                title="Need help shortlisting Vietnam?"
                description="Share your details and our team will help you compare Vietnam universities based on budget, city preference, and student fit."
                courseSlug="mbbs"
                countrySlug="vietnam"
              />
            </div>
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
                The real disadvantages students should understand first
              </h2>
              <div className="mt-6 grid gap-5">
                {disadvantageCards.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                  >
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base font-medium text-foreground/90">
                      {item.summary}
                    </p>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Students who should think twice before choosing Vietnam
              </h2>
              <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {whoShouldThinkTwice.map((item) => (
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
                How students reduce these disadvantages in practice
              </h2>
              <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <ol className="space-y-4">
                  {mitigationSteps.map((step, index) => (
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
                {nextReads.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-accent/20 bg-accent/5 p-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                The practical takeaway
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Vietnam works best when the family chooses it because the
                <strong className="text-foreground"> specific university fit makes sense</strong>, not just because the country sounds easy.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}
