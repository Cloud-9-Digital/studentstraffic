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
            Free counselling
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-heading">
            Need more clarity on {universityName}?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            Talk to one of our counsellors — free, no obligations.
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
