import { Check } from "lucide-react";

import { CounsellingDialog } from "@/components/site/counselling-dialog";

export function UniversityCounsellingSection({
  universityName,
  countrySlug,
  courseSlug,
}: {
  universityName: string;
  countrySlug: string;
  courseSlug?: string;
}) {
  return (
    <div className="section-tint rounded-[1.75rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent/80">
            Admissions support
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading">
            Build a clear application plan for {universityName}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            Get focused help with your application, documents and visa process. We will turn the information on this page into a practical next-step plan.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-foreground">
            {['Application planning', 'Document review', 'Visa support'].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="shrink-0">
          <CounsellingDialog
            triggerContent="Get my application plan"
            triggerVariant="default"
            triggerSize="lg"
            triggerClassName="w-full sm:w-auto"
            countrySlug={countrySlug}
            courseSlug={courseSlug}
            title={`Plan your application to ${universityName}`}
            description="Share your details and an admissions specialist will help you plan the next steps."
            ctaVariant="university_application_plan"
          />
        </div>
      </div>
    </div>
  );
}
