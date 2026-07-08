"use client";

import { CounsellingDialog } from "@/components/site/counselling-dialog";

type CounsellingCtaButtonProps = {
  label: string;
  title?: string;
  description?: string;
  className?: string;
  countrySlug?: string;
  courseSlug?: string;
  ctaVariant?: string;
};

export function CounsellingCtaButton({
  label,
  title = "Request your admissions counselling call",
  description = "Leave your number and we will call you with guidance on countries, universities, scholarships, and the next admission step that fits your profile.",
  className = "rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-muted",
  countrySlug,
  courseSlug,
  ctaVariant = "page-cta",
}: CounsellingCtaButtonProps) {
  return (
    <CounsellingDialog
      triggerContent={label}
      triggerClassName={className}
      plainTrigger
      title={title}
      description={description}
      submitLabel="Request callback"
      ctaVariant={ctaVariant}
      countrySlug={countrySlug}
      courseSlug={courseSlug}
    />
  );
}
