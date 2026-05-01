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
            Ready for the next step?
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading">
            Get guidance for {universityName}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            Our counsellors help with the full admissions process, including application, documents, and visa support. Request a call and we&apos;ll walk you through the next steps clearly.
          </p>
        </div>
        <div className="shrink-0">
          <CounsellingDialog
            triggerContent="Talk to a counsellor"
            triggerVariant="default"
            triggerSize="lg"
            triggerClassName="w-full sm:w-auto"
            countrySlug={countrySlug}
            courseSlug={courseSlug}
          />
        </div>
      </div>
    </div>
  );
}
