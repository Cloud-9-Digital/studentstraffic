import Image from "next/image";
import {
  BedDouble,
  ImageIcon,
  ShieldCheck,
  UtensilsCrossed,
  Trees,
} from "lucide-react";

import type { Country, FinderProgram, University } from "@/lib/data/types";

import { SectionLabel } from "./shared";

type Cell = {
  icon: React.ReactNode;
  label: string;
  body: string;
  index: number;
  image?: {
    url: string;
    altText: string;
  };
};

function LifeCell({ icon, label, body, index, image }: Cell) {
  const sectionId = label.toLowerCase().replaceAll(" ", "-");
  const imageOnLeft = index % 2 === 1;
  const sectionBackground = index % 2 === 0 ? "bg-card" : "bg-primary/[0.035]";

  return (
    <section
      id={sectionId}
      className={`scroll-mt-24 overflow-hidden rounded-2xl border border-border ${sectionBackground}`}
    >
      <div className="grid lg:grid-cols-2 lg:items-stretch">
        <div
          className={`min-h-52 border-b border-border bg-muted/45 lg:min-h-80 lg:border-b-0 ${
            imageOnLeft ? "lg:border-r" : "lg:order-2 lg:border-l"
          }`}
        >
          {image ? (
            <div className="relative h-full min-h-52 lg:min-h-80">
              <Image
                src={image.url}
                alt={image.altText}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-full min-h-52 flex-col items-center justify-center gap-3 px-6 py-10 text-center text-muted-foreground lg:min-h-80">
              <span className="flex size-12 items-center justify-center rounded-full border border-border bg-card/80 text-primary">
                <ImageIcon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{label} image</p>
                <p className="mt-1 text-xs">Image placeholder</p>
              </div>
            </div>
          )}
        </div>

        <div className={`flex flex-col justify-center px-5 py-7 sm:px-8 sm:py-9 ${imageOnLeft ? "" : "lg:order-1"}`}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent [&_svg]:size-4">
              {icon}
            </span>
            <h3 className="font-display text-xl font-semibold text-heading sm:text-2xl">
              {label}
            </h3>
          </div>
          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}

export function UniversityStudentLifeSection({
  university,
  country,
  primaryProgram,
}: {
  university: University;
  country?: Country;
  primaryProgram?: FinderProgram;
}) {
  const safetyBody = `${university.safetyOverview} ${university.studentSupport}`.trim();
  const studentLifeImages = university.mediaAttribution?.studentLife;
  const course = primaryProgram?.course.shortName ?? "this program";
  const countryName = country?.name ?? "the country";

  return (
    <div id="living" className="deferred-render scroll-mt-24 space-y-6 py-10">
      <SectionLabel>Student living</SectionLabel>

      <div className="space-y-3">
        <h2 className="font-display text-2xl font-semibold text-heading">
          Student life at {university.name}
        </h2>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground">
          Practical information about day-to-day life while pursuing {course} at{" "}
          {university.name} in {university.city}, {countryName}. This covers
          the campus environment, accommodation, daily living and available
          safety and student-support services.
        </p>
      </div>

      <div className="space-y-4">
        <LifeCell
          index={0}
          image={studentLifeImages?.campusEnvironment}
          icon={<Trees />}
          label="Campus environment"
          body={university.campusLifestyle}
        />
        <LifeCell
          index={1}
          image={studentLifeImages?.accommodation}
          icon={<BedDouble />}
          label="Accommodation"
          body={university.hostelOverview}
        />
        <LifeCell
          index={2}
          image={studentLifeImages?.dailyLiving}
          icon={<UtensilsCrossed />}
          label="Daily living support"
          body={university.dietarySupport}
        />
        <LifeCell
          index={3}
          image={studentLifeImages?.safetySupport}
          icon={<ShieldCheck />}
          label="Safety and support"
          body={safetyBody}
        />
      </div>
    </div>
  );
}
