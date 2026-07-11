import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, UtensilsCrossed, Users } from "lucide-react";

import { CountryImagePlaceholder, SectionHeading, SectionIntro, SectionKicker } from "@/components/site/country/shared";

const GENERAL_LIFE_POINTS = [
  { icon: <Users className="size-4" />, title: "An existing international community", body: "A strong student network can make the first weeks easier, from finding practical help to building a routine." },
  { icon: <UtensilsCrossed className="size-4" />, title: "Food and daily routines", body: "Food, groceries and everyday convenience vary by city, so compare the location alongside the university." },
  { icon: <ShieldCheck className="size-4" />, title: "Safety and support systems", body: "International offices, emergency contacts and peer networks are central to settling in well." },
  { icon: <MessageCircle className="size-4" />, title: "A real student perspective", body: "Current students can explain the practical details that are difficult to judge from a university brochure." },
];

export function CountryStudentLifeSection({ countryName }: { countryName: string }) {
  return (
    <section className="deferred-render py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-16">
        <div>
          <SectionKicker icon={<Users className="size-3.5" />} text="Student life" />
          <SectionHeading>What is student life like?</SectionHeading>
          <SectionIntro>Your city and university will affect your daily life, costs, food, safety and support.</SectionIntro>
          <div className="mt-8">
            <CountryImagePlaceholder label={`Life around ${countryName}`} aspect="portrait" />
          </div>
        </div>

        <div className="divide-y divide-border/60 border-t border-border/60">
          {GENERAL_LIFE_POINTS.map((point) => (
            <div key={point.title} className="flex gap-4 py-5">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">{point.icon}</span>
              <div>
                <p className="font-display text-lg font-semibold text-heading">{point.title}</p>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">{point.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Link href="/students" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent">
          Meet students already studying abroad
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
