import Image from "next/image";
import {
  ArrowRight,
  BedDouble,
  HeartHandshake,
  ShieldCheck,
  Trees,
  UtensilsCrossed,
} from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";
import type { University } from "@/lib/data/types";

import { SectionLabel } from "./shared";

type LivingTopic = {
  id: string;
  icon: React.ReactNode;
  label: string;
  body: string;
  image?: { url: string; altText: string };
};

function TopicHeading({ icon, label }: Pick<LivingTopic, "icon" | "label">) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent [&_svg]:size-4"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="font-display text-lg font-semibold text-heading">{label}</h3>
    </div>
  );
}

function PhotoTopic({ id, icon, label, body, image }: LivingTopic) {
  return (
    <section id={id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card">
      {image ? (
        <div className="relative aspect-[16/7] overflow-hidden bg-muted sm:aspect-[16/8]">
          <Image
            src={image.url}
            alt={image.altText}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="p-5 sm:p-6">
        <TopicHeading icon={icon} label={label} />
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
      </div>
    </section>
  );
}

function removeDirectContacts(value: string) {
  return value
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !/@|\+?\d[\d\s()-]{7,}\d/.test(sentence))
    .join(" ");
}

export function UniversityStudentLifeSection({ university }: { university: University }) {
  const images = university.mediaAttribution?.studentLife;
  const photoTopics: LivingTopic[] = [
    {
      id: "campus-environment",
      icon: <Trees />,
      label: "Campus environment",
      body: university.campusLifestyle,
      image: images?.campusEnvironment,
    },
    {
      id: "accommodation",
      icon: <BedDouble />,
      label: "Accommodation",
      body: university.hostelOverview,
      image: images?.accommodation,
    },
  ].filter((topic) => topic.body.trim());
  const compactTopics: LivingTopic[] = [
    {
      id: "daily-living-support",
      icon: <UtensilsCrossed />,
      label: "Food & daily living",
      body: university.dietarySupport,
    },
    {
      id: "safety-and-support",
      icon: <ShieldCheck />,
      label: "Safety",
      body: university.safetyOverview,
    },
    {
      id: "student-support",
      icon: <HeartHandshake />,
      label: "Student support",
      body: removeDirectContacts(university.studentSupport),
    },
  ].filter((topic) => topic.body.trim());

  if (!photoTopics.length && !compactTopics.length) return null;

  return (
    <div id="living" className="deferred-render scroll-mt-24 space-y-5 py-10">
      <SectionLabel>Student living</SectionLabel>

      {photoTopics.length > 0 ? (
        <div className={`grid gap-4 ${photoTopics.length > 1 ? "md:grid-cols-2" : ""}`}>
          {photoTopics.map((topic) => <PhotoTopic key={topic.id} {...topic} />)}
        </div>
      ) : null}

      {compactTopics.length > 0 ? (
        <div className={`grid overflow-hidden rounded-2xl border border-border bg-card md:divide-x md:divide-border ${
          compactTopics.length === 3 ? "md:grid-cols-3" : compactTopics.length === 2 ? "md:grid-cols-2" : ""
        }`}>
          {compactTopics.map((topic) => (
            <section
              id={topic.id}
              key={topic.id}
              className="scroll-mt-24 border-b border-border p-5 last:border-b-0 md:border-b-0 sm:p-6"
            >
              <TopicHeading icon={topic.icon} label={topic.label} />
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{topic.body}</p>
              {topic.id === "student-support" ? (
                <CounsellingDialog
                  plainTrigger
                  triggerClassName="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                  triggerContent={<>Get guidance from us <ArrowRight className="size-4" /></>}
                  universitySlug={university.slug}
                  countrySlug={university.countrySlug}
                  title={`Get guidance for ${university.name}`}
                  description="Share your details and our counsellor will help you plan your next steps."
                  ctaVariant="university_student_living"
                  notes={`Student living enquiry: ${university.name}`}
                  lockInterest
                />
              ) : null}
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
}
