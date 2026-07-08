import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, UtensilsCrossed, Users } from "lucide-react";

import { ResearchSlotNote, SectionHeading, SectionIntro, SectionKicker } from "@/components/site/country/shared";

const GENERAL_LIFE_POINTS = [
  {
    icon: <Users className="size-4" />,
    title: "An existing Indian student community",
    body: "Most of our partner destinations already have an active base of Indian students — a practical head start on food, festivals, and settling in.",
  },
  {
    icon: <UtensilsCrossed className="size-4" />,
    title: "Food and daily routines",
    body: "Availability of Indian groceries and vegetarian options varies by city, not just by country — we factor this into which city we recommend.",
  },
  {
    icon: <ShieldCheck className="size-4" />,
    title: "Safety and support systems",
    body: "University international offices, local emergency numbers, and peer networks are the first line of support once you land.",
  },
  {
    icon: <MessageCircle className="size-4" />,
    title: "Talk to someone who's already there",
    body: "Hearing from a current student is often more useful than any guide — we can connect you with peers once you shortlist a university.",
  },
];

export function CountryStudentLifeSection({ countryName }: { countryName: string }) {
  return (
    <div className="deferred-render py-12 md:py-16">
      <SectionKicker icon={<Users className="size-3.5" />} text="Student life" />
      <SectionHeading>Settling in as an international student</SectionHeading>
      <SectionIntro>
        Life outside the classroom shapes the experience as much as the degree does. Here is the
        general picture — the specifics depend heavily on the city and university you choose.
      </SectionIntro>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {GENERAL_LIFE_POINTS.map((point) => (
          <div key={point.title} className="flex gap-3 rounded-[1.1rem] border border-border/60 bg-[#faf8f4] px-4 py-4">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {point.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{point.title}</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">{point.body}</p>
            </div>
          </div>
        ))}
      </div>

      <ResearchSlotNote>
        City-by-city detail on student life in {countryName} — mess options, community size, local
        transport — is being researched and will be layered in here over time.
      </ResearchSlotNote>

      <div className="mt-6">
        <Link
          href="/students"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Meet students already studying abroad
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
