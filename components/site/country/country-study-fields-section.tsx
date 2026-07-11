import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

import { SectionHeading, SectionIntro, SectionKicker, getStreamIcon, getStreamLabel } from "@/components/site/country/shared";
import { formatProgramDuration } from "@/lib/utils";

export type CountryStudyField = {
  stream: string;
  universityCount: number;
  courses: Array<{ slug: string; shortName: string; durationYears: number; universityCount: number }>;
};

export function CountryStudyFieldsSection({ countryName, countrySlug, fields }: { countryName: string; countrySlug: string; fields: CountryStudyField[] }) {
  if (!fields.length) return null;

  return (
    <section id="study-fields" className="py-14 md:py-20">
      <SectionKicker icon={<BookOpen className="size-3.5" />} text="Study routes" />
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <SectionHeading>Choose a programme and university.</SectionHeading>
          <SectionIntro>Compare the programmes and universities available in {countryName} based on your goals, budget and eligibility.</SectionIntro>
        </div>

        <div className="border-t border-border/70">
          {fields.map((field) => (
            <div key={field.stream} className="grid gap-4 border-b border-border/70 py-5 sm:grid-cols-[0.7fr_1.3fr] sm:gap-8">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">{getStreamIcon(field.stream)}</span>
                <div>
                  <p className="font-display text-xl font-semibold text-heading">{getStreamLabel(field.stream)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Available programmes</p>
                </div>
              </div>
              <div className="grid gap-2">
                {field.courses.map((course) => (
                  <Link key={course.slug} href={`/universities?country=${countrySlug}&course=${course.slug}`} className="group flex items-center justify-between gap-4 rounded-xl bg-[#f7f7f3] px-4 py-3 transition-colors hover:bg-primary hover:text-white">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{course.shortName}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground group-hover:text-white/70">{formatProgramDuration(course.durationYears)} · Compare universities</span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-white" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
