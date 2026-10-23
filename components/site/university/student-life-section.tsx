import Image from "next/image";
import {
  BedDouble,
  HeartHandshake,
  ShieldCheck,
  Trees,
  UtensilsCrossed,
} from "lucide-react";

import type { University } from "@/lib/data/types";

import { SectionLabel } from "./shared";

type LivingCard = {
  id: string;
  icon: React.ReactNode;
  label: string;
  body: string;
  image?: {
    url: string;
    altText: string;
  };
};

function StudentLivingCard({ id, icon, label, body, image }: LivingCard) {
  return (
    <section
      id={id}
      className="h-full scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card"
    >
      {image ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={image.url}
            alt={image.altText}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent [&_svg]:size-4"
            aria-hidden="true"
          >
            {icon}
          </span>
          <h3 className="font-display text-lg font-semibold text-heading">
            {label}
          </h3>
        </div>
        <p className="mt-4 break-words text-sm leading-7 text-muted-foreground">
          {body}
        </p>
      </div>
    </section>
  );
}

function cardSpan(index: number, total: number) {
  const lastOddCard = total % 2 === 1 && index === total - 1;
  const desktopSpan = total === 5
    ? index < 2 ? "lg:col-span-3" : "lg:col-span-2"
    : lastOddCard ? "lg:col-span-6" : "lg:col-span-3";
  return `${lastOddCard ? "md:col-span-2" : ""} ${desktopSpan}`;
}

export function UniversityStudentLifeSection({
  university,
}: {
  university: University;
}) {
  const studentLifeImages = university.mediaAttribution?.studentLife;
  const cards: LivingCard[] = [
    {
      id: "campus-environment",
      icon: <Trees />,
      label: "Campus environment",
      body: university.campusLifestyle,
      image: studentLifeImages?.campusEnvironment,
    },
    {
      id: "accommodation",
      icon: <BedDouble />,
      label: "Accommodation",
      body: university.hostelOverview,
      image: studentLifeImages?.accommodation,
    },
    {
      id: "daily-living-support",
      icon: <UtensilsCrossed />,
      label: "Food & daily living",
      body: university.dietarySupport,
      image: studentLifeImages?.dailyLiving,
    },
    {
      id: "safety-and-support",
      icon: <ShieldCheck />,
      label: "Safety",
      body: university.safetyOverview,
      image: studentLifeImages?.safetySupport,
    },
    {
      id: "student-support",
      icon: <HeartHandshake />,
      label: "Student support",
      body: university.studentSupport,
    },
  ].filter((card) => card.body.trim().length > 0);

  if (!cards.length) return null;

  return (
    <div id="living" className="deferred-render scroll-mt-24 space-y-5 py-10">
      <SectionLabel>Student living</SectionLabel>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={cardSpan(index, cards.length)}
          >
            <StudentLivingCard {...card} />
          </div>
        ))}
      </div>
    </div>
  );
}
