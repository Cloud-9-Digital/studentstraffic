"use client";

import { useId, useState } from "react";
import Image from "next/image";
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
  title = "Speak to a study abroad counsellor",
  description = "Share your details and we will call you with the next steps.",
  submitLabel,
  ctaVariant = "header_dialog",
  countrySlug,
  courseSlug,
  notes,
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
  countrySlug?: string;
  courseSlug?: string;
  notes?: string;
}) {
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
          className="fixed left-1/2 top-1/2 z-50 max-h-[min(92vh,820px)] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.75rem] border border-primary/15 bg-background shadow-dialog outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
          onOpenAutoFocus={(event) => {
            // Radix auto-focuses the first form field on open by default, which
            // arms the form's anti-bot "startedAt" timer before the user has
            // actually interacted -- fast fillers (autofill, quick typers) then
            // trip the "submitted too fast" rejection. Let focus land on the
            // dialog container instead; the timer arms on real user input.
            event.preventDefault();
          }}
        >
          <Dialog.Close className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/90 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <div className="grid md:grid-cols-[0.78fr_1.22fr]">
            <div className="relative flex min-h-[25rem] flex-col overflow-hidden bg-gradient-to-br from-primary via-primary to-accent p-5 text-white sm:p-8 md:min-h-0">
              <Dialog.Title className="relative z-10 max-w-[18ch] font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {title}
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                {description}
              </Dialog.Description>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
                <Image
                  src="/images/counselling/study-abroad-enquiry-illustration.png"
                  alt="Indian student preparing to study abroad"
                  width={1085}
                  height={1450}
                  sizes="(max-width: 767px) 15rem, 20rem"
                  className="h-auto w-[78%] max-w-[13rem] object-contain sm:max-w-[15rem] md:w-[108%] md:max-w-none"
                />
              </div>
            </div>

            <div className="border-t border-border p-6 sm:p-8 md:border-l md:border-t-0">
              <DialogLeadForm
                key={`${ctaVariant}:${countrySlug ?? ""}:${courseSlug ?? ""}`}
                ctaVariant={ctaVariant}
                submitLabel={submitLabel}
                countrySlug={countrySlug}
                courseSlug={courseSlug}
                notes={notes}
                embedded
                stacked
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
