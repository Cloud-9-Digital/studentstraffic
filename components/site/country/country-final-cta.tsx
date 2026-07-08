import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DeferredLeadForm } from "@/components/site/deferred-lead-form";
import { Button } from "@/components/ui/button";
import { SectionHeading, SectionKicker } from "@/components/site/country/shared";

export function CountryFinalCta({
  countryName,
  countrySlug,
  courseSlug,
  primaryHref,
}: {
  countryName: string;
  countrySlug: string;
  courseSlug?: string;
  primaryHref: string;
}) {
  return (
    <div className="deferred-render py-12 md:py-16">
      <SectionKicker text="Next step" />
      <SectionHeading>Need help narrowing down {countryName}?</SectionHeading>
      <p className="mt-5 max-w-2xl text-[0.95rem] leading-7 text-muted-foreground md:text-base md:leading-8">
        Share your details if you want help comparing universities, estimating realistic costs, or
        understanding the next admissions step for studying in {countryName}.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={primaryHref}>Explore colleges</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">
              Talk to our team
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <DeferredLeadForm
          sourcePath={`/countries/${countrySlug}`}
          ctaVariant="country_final_cta"
          title={`Apply to study in ${countryName}`}
          description="Leave your number and our counsellors will call you with college options in this country that fit your budget and priorities."
          countrySlug={countrySlug}
          courseSlug={courseSlug}
        />
      </div>
    </div>
  );
}
