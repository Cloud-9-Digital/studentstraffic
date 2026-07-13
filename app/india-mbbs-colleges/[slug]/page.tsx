import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { catalogReviewedAt, formatContentDate } from "@/lib/content-governance";
import {
  getIndiaMbbsCollegeBySlug,
  getIndiaMbbsCollegeSlugs,
} from "@/lib/data/india-mbbs";
import { buildIndexableMetadata } from "@/lib/metadata";
import { getIndiaMbbsCollegeHref, getIndiaMbbsCollegesHref } from "@/lib/routes";
import {
  getBreadcrumbStructuredData,
  getFaqStructuredData,
  getStructuredDataGraph,
  getWebPageStructuredData,
} from "@/lib/structured-data";
import { ensureNonEmptyStaticParams } from "@/lib/static-params";

const STATIC_COLLEGE_SAMPLE_SIZE = 1;

function getDatePart(value?: string) {
  return value?.slice(0, 10);
}

function buildOverview(college: NonNullable<Awaited<ReturnType<typeof getIndiaMbbsCollegeBySlug>>>) {
  const program = college.programs.find((item) => item.courseName === "MBBS") ?? college.programs[0];
  const location = college.cityName
    ? `${college.cityName}, ${college.stateName}`
    : college.stateName;
  const seats = program?.annualIntakeSeats
    ? `${program.annualIntakeSeats} MBBS seats`
    : "MBBS intake listed in NMC data";
  const management = college.managementType
    ? `${college.managementType.toLowerCase()} medical college`
    : "medical college";

  return `${college.collegeName} is a ${management} in ${location}. Students can review ${seats}, year of inception, university affiliation, and current source-backed admissions information before shortlisting the college.`;
}

export async function generateStaticParams() {
  const colleges = await getIndiaMbbsCollegeSlugs(STATIC_COLLEGE_SAMPLE_SIZE);
  return ensureNonEmptyStaticParams(
    colleges.map((college) => ({ slug: college.slug })),
    { slug: "__india-college-fallback__" },
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const college = await getIndiaMbbsCollegeBySlug(slug);

  if (!college) {
    return { title: "College Not Found" };
  }

  const description =
    college.editorialContent.overview?.trim() || buildOverview(college);
  const location = college.cityName
    ? `${college.cityName}, ${college.stateName}`
    : college.stateName;

  return buildIndexableMetadata({
    title: `${college.collegeName} MBBS Admission 2026 | Seats, Location, Details`,
    description,
    path: getIndiaMbbsCollegeHref(college.slug),
    keywords: [
      college.collegeName,
      `${college.collegeName} MBBS`,
      `${college.collegeName} admission 2026`,
      `${college.collegeName} seats`,
      `${college.collegeName} ${location}`,
      college.collegeCode,
      college.universityName,
      college.stateName,
    ].filter(Boolean) as string[],
  });
}

export default async function IndiaMbbsCollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const college = await getIndiaMbbsCollegeBySlug(slug);

  if (!college) {
    notFound();
  }

  const overview = college.editorialContent.overview?.trim() || buildOverview(college);
  const location = college.cityName
    ? `${college.cityName}, ${college.stateName}`
    : college.stateName;
  const reviewedAt =
    getDatePart(college.editorialContent.reviewedAt) ??
    getDatePart(college.updatedAt) ??
    catalogReviewedAt;
  const path = getIndiaMbbsCollegeHref(college.slug);
  const faq = college.editorialContent.faq ?? [];
  const primaryProgram = college.programs.find((item) => item.courseName === "MBBS") ?? college.programs[0];

  const structuredData = getStructuredDataGraph([
    getBreadcrumbStructuredData([
      { name: "Home", path: "/" },
      { name: "India MBBS Colleges", path: getIndiaMbbsCollegesHref() },
      { name: college.collegeName, path },
    ]),
    getWebPageStructuredData({
      path,
      name: college.collegeName,
      description: overview,
      datePublished: reviewedAt,
      dateModified: reviewedAt,
    }),
    {
      "@type": "CollegeOrUniversity",
      "@id": `${path}#institution`,
      name: college.collegeName,
      url: path,
      address: {
        "@type": "PostalAddress",
        addressLocality: college.cityName,
        addressRegion: college.stateName,
        addressCountry: "India",
      },
      identifier: college.collegeCode,
      parentOrganization: college.universityName
        ? {
            "@type": "Organization",
            name: college.universityName,
          }
        : undefined,
      description: overview,
    },
    faq.length ? getFaqStructuredData(faq, path) : null,
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-surface-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark to-surface-dark-2" />
        <div className="hero-grid-lines absolute inset-0 pointer-events-none" />
        <div className="container-shell relative py-10 md:py-16">
          <div className="max-w-4xl space-y-5">
            <Link
              href={getIndiaMbbsCollegesHref()}
              className="inline-flex text-sm font-medium text-white/70 transition hover:text-white"
            >
              Back to India MBBS colleges
            </Link>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/10 text-white hover:bg-white/10">
                  {college.managementType ?? "Medical College"}
                </Badge>
                <Badge className="bg-white/10 text-white hover:bg-white/10">
                  {location}
                </Badge>
                {college.collegeCode ? (
                  <Badge className="bg-white/10 text-white hover:bg-white/10">
                    Code {college.collegeCode}
                  </Badge>
                ) : null}
              </div>

              <div className="space-y-3">
                <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  {college.collegeName}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-white/70 md:text-base">
                  {overview}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <FactCard
                label="Location"
                value={location}
              />
              <FactCard
                label="MBBS seats"
                value={primaryProgram?.annualIntakeSeats?.toString() ?? "Check source"}
              />
              <FactCard
                label="Year of inception"
                value={primaryProgram?.yearOfInception?.toString() ?? "Check source"}
              />
              <FactCard
                label="Source"
                value={college.sourceAuthority}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <ContentSection
              title="College Snapshot"
              body={`This page combines imported ${college.sourceAuthority}-linked facts with your editorial content layer, so each college page can start with real data and then grow into a stronger admissions page over time.`}
            />

            {college.editorialContent.whyChoose?.length ? (
              <ListSection
                title="Why students shortlist this college"
                items={college.editorialContent.whyChoose}
              />
            ) : null}

            {college.editorialContent.admissionProcess?.length ? (
              <ListSection
                title="Admission process"
                items={college.editorialContent.admissionProcess}
              />
            ) : null}

            {college.editorialContent.campusFacilities?.length ? (
              <ListSection
                title="Campus and facilities"
                items={college.editorialContent.campusFacilities}
              />
            ) : null}

            {college.editorialContent.hostelInfo ? (
              <ContentSection
                title="Hostel and student living"
                body={college.editorialContent.hostelInfo}
              />
            ) : null}

            {college.editorialContent.internshipInfo ? (
              <ContentSection
                title="Clinical exposure and internship"
                body={college.editorialContent.internshipInfo}
              />
            ) : null}

            {college.editorialContent.feesNote ? (
              <ContentSection
                title="Fee note"
                body={college.editorialContent.feesNote}
              />
            ) : null}

            {college.editorialContent.cutoffNote ? (
              <ContentSection
                title="Cutoff note"
                body={college.editorialContent.cutoffNote}
              />
            ) : null}

            <section className="space-y-4 rounded-3xl border border-border bg-card p-5 md:p-7">
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-semibold text-heading">
                  Programs and intake
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Use this as the factual layer for the page. If you want richer content later, keep these source-backed rows and add editorial context above them.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-0 py-3 font-semibold text-heading">Program</th>
                      <th className="px-4 py-3 font-semibold text-heading">Seats</th>
                      <th className="px-4 py-3 font-semibold text-heading">Started</th>
                      <th className="px-4 py-3 font-semibold text-heading">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {college.programs.map((program) => (
                      <tr key={program.slug} className="border-b border-border/70 last:border-b-0">
                        <td className="px-0 py-3 font-medium text-foreground">
                          {program.courseName}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {program.annualIntakeSeats ?? "N/A"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {program.yearOfInception ?? "N/A"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {program.sourceUrl ? (
                            <a
                              href={program.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent underline underline-offset-2"
                            >
                              Official source
                            </a>
                          ) : (
                            college.sourceAuthority
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {faq.length ? (
              <section id="faq" className="space-y-4 rounded-3xl border border-border bg-card p-5 md:p-7">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-semibold text-heading">
                    FAQs
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Keep these answers specific to the college and update them whenever admissions or intake details change.
                  </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {faq.map((item, index) => (
                    <AccordionItem key={item.question} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-base font-semibold text-heading">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-7 text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ) : null}
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-5">
              <h2 className="font-display text-xl font-semibold text-heading">
                Content governance
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Reviewed</dt>
                  <dd className="font-medium text-foreground">
                    {formatContentDate(reviewedAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Affiliating university</dt>
                  <dd className="font-medium text-foreground">
                    {college.universityName ?? "Not listed in current import"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Data source</dt>
                  <dd className="font-medium text-foreground">
                    {college.sourceAuthority}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5">
              <h2 className="font-display text-xl font-semibold text-heading">
                How to manage real content
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Store only verified copy in the editorial content JSON for this college. Keep facts like seats, course names, and codes in the import tables so future NMC refreshes do not overwrite your human-reviewed page sections.
              </p>
              {college.sourceUrl ? (
                <a
                  href={college.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-semibold text-accent underline underline-offset-2"
                >
                  View source file
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <JsonLd data={structuredData} />
    </>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-medium tracking-[0.12em] text-white/55 uppercase">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function ContentSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="space-y-3 rounded-3xl border border-border bg-card p-5 md:p-7">
      <h2 className="font-display text-2xl font-semibold text-heading">
        {title}
      </h2>
      <p className="text-sm leading-7 text-muted-foreground">
        {body}
      </p>
    </section>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="space-y-4 rounded-3xl border border-border bg-card p-5 md:p-7">
      <h2 className="font-display text-2xl font-semibold text-heading">
        {title}
      </h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-border/80 bg-muted/20 px-4 py-3 text-sm leading-7 text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
