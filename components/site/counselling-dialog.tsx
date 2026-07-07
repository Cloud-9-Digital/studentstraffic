"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";

import type { LeadFormProps } from "@/components/site/lead-form";
import { LeadForm } from "@/components/site/lead-form";
import { Button } from "@/components/ui/button";

// Reads pathname at the moment the dialog opens (client-only) so the
// usePathname() call never runs during static prerendering.
function DialogLeadForm(props: Omit<LeadFormProps, "sourcePath">) {
  const pathname = usePathname();
  return <LeadForm sourcePath={pathname} {...props} />;
}

export function CounsellingDialog({
  triggerContent,
  triggerClassName,
  triggerVariant = "accent",
  triggerSize = "default",
  plainTrigger = false,
  onTriggerClick,
  title = "Request your admissions counselling call",
  description = "Leave your number and we will call you with guidance on countries, universities, scholarships, and the next admission step that fits your profile. Parents are welcome on the call.",
  submitLabel,
  ctaVariant = "header_dialog",
  formVariant = "mbbs",
  countrySlug,
  courseSlug,
  notes,
  showInterestSelects = false,
}: {
  triggerContent: React.ReactNode;
  triggerClassName?: string;
  triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  triggerSize?: React.ComponentProps<typeof Button>["size"];
  plainTrigger?: boolean;
  onTriggerClick?: () => void;
  title?: string;
  description?: string;
  submitLabel?: string;
  ctaVariant?: string;
  formVariant?: "mbbs" | "scholarship";
  countrySlug?: string;
  courseSlug?: string;
  notes?: string;
  /**
   * When true, the form shows "Interested course" and "Interested country"
   * selects (in place of the NEET field) that map to courseSlug/countrySlug.
   * Because NEET is then not collected, the form is submitted with the
   * non-mbbs variant so the server action does not require a NEET score.
   */
  showInterestSelects?: boolean;
}) {
  // With interest selects, NEET is not collected — submit as the non-mbbs
  // variant so submitLeadAction does not require a NEET score. Callers that
  // rely on the NEET (mbbs) flow simply leave showInterestSelects off.
  const effectiveFormVariant = showInterestSelects ? "scholarship" : formVariant;
  const [open, setOpen] = useState(false);
  const contentId = useId();

  const openDialog = () => {
    onTriggerClick?.();
    setOpen(true);
  };

  const trigger = plainTrigger ? (
    <button
      type="button"
      className={triggerClassName}
      aria-controls={contentId}
      aria-expanded={open}
      aria-haspopup="dialog"
      data-state={open ? "open" : "closed"}
      onClick={openDialog}
    >
      {triggerContent}
    </button>
  ) : (
    <Button
      type="button"
      variant={triggerVariant}
      size={triggerSize}
      className={triggerClassName}
      aria-controls={contentId}
      aria-expanded={open}
      aria-haspopup="dialog"
      data-state={open ? "open" : "closed"}
      onClick={openDialog}
    >
      {triggerContent}
    </Button>
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {trigger}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content
          id={contentId}
          className="fixed left-1/2 top-1/2 z-50 max-h-[min(92vh,780px)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-background shadow-dialog outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200 lg:max-w-lg"
        >
          <Dialog.Close className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-black/6 hover:text-foreground">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <div className="p-6 sm:p-7">
            <div className="mb-6 flex flex-col gap-1.5 border-b border-border pb-5 pr-8">
              <Dialog.Title className="text-xl font-semibold text-heading">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </Dialog.Description>
            </div>

            <DialogLeadForm
              key={`${ctaVariant}:${effectiveFormVariant}:${countrySlug ?? ""}:${courseSlug ?? ""}`}
              ctaVariant={ctaVariant}
              submitLabel={submitLabel}
              countrySlug={countrySlug}
              courseSlug={courseSlug}
              formVariant={effectiveFormVariant}
              notes={notes}
              showInterestSelects={showInterestSelects}
              embedded
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
