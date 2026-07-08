import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { SectionHeading, SectionIntro, SectionKicker, getStreamIcon, getStreamLabel } from "@/components/site/country/shared";
import { formatProgramDuration } from "@/lib/utils";

export type CountryStudyField = {
  stream: string;
  universityCount: number;
  courses: Array<{
    slug: string;
    shortName: string;
    durationYears: number;
    universityCount: number;
  }>;
};

export function CountryStudyFieldsSection({
  countryName,
  countrySlug,
  fields,
}: {
  countryName: string;
  countrySlug: string;
  fields: CountryStudyField[];
}) {
  if (!fields.length) return null;

  return (
    <div className="py-12 md:py-16">
      <SectionKicker icon={<BookOpen className="size-3.5" />} text="What you can study here" />
      <SectionHeading>
        Study fields open to international students in {countryName}
      </SectionHeading>
      <SectionIntro>
        {fields.length > 1
          ? `${countryName} currently lists programs across ${fields.length} study fields. Tap a course to jump straight into the finder filtered for that combination.`
          : `Here is what's currently listed for ${countryName}. Tap a course to jump straight into the finder.`}
      </SectionIntro>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div
            key={field.stream}
            className="flex flex-col rounded-[1.6rem] border border-border/60 bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {getStreamIcon(field.stream)}
              </span>
              <div>
                <p className="font-display text-lg font-semibold leading-tight text-heading">
                  {getStreamLabel(field.stream)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {field.universityCount} {field.universityCount === 1 ? "university" : "universities"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-1 flex-col gap-2">
              {field.courses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/universities?country=${countrySlug}&course=${course.slug}`}
                  className="group flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-[#faf8f4] px-3.5 py-2.5 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground">
                      {course.shortName}
                    </span>
                    <span className="block text-[0.68rem] text-muted-foreground">
                      {formatProgramDuration(course.durationYears)} · {course.universityCount}{" "}
                      {course.universityCount === 1 ? "college" : "colleges"}
                    </span>
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
