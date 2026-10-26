"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";

import type { LeadFormState } from "@/app/_actions/submit-lead";
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
  universitySlug,
  notes,
  lockInterest = false,
  open: controlledOpen,
  onOpenChange,
  onLeadSuccess,
  returnFocusRef,
}: {
  /** Omit (with `open`/`onOpenChange`) when the caller renders its own trigger. */
  triggerContent?: React.ReactNode;
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
  /** Attributes the lead to a specific university (stored on leads.university_slug). */
  universitySlug?: string;
  notes?: string;
  /** Replaces the course/country selects with hidden inputs — see LeadForm. */
  lockInterest?: boolean;
  /** Controlled open state, for callers that open the dialog themselves. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** In-page variants (brochure downloads) get the result instead of a redirect. */
  onLeadSuccess?: (state: LeadFormState) => void;
  /** Element to focus when the dialog closes (e.g. a caller-owned trigger). */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const contentId = useId();

  const openDialog = () => {
    onTriggerClick?.();
    setOpen(true);
  };

  const trigger = triggerContent == null ? null : plainTrigger ? (
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#092c28]/55 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content
          id={contentId}
          className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[48rem] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.5rem] border border-primary/10 bg-background shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200 sm:max-h-[calc(100dvh-3rem)]"
          onOpenAutoFocus={(event) => {
            // Radix auto-focuses the first form field on open by default, which
            // arms the form's anti-bot "startedAt" timer before the user has
            // actually interacted -- fast fillers (autofill, quick typers) then
            // trip the "submitted too fast" rejection. Let focus land on the
            // dialog container instead; the timer arms on real user input.
            event.preventDefault();
          }}
          onCloseAutoFocus={(event) => {
            if (returnFocusRef?.current) {
              event.preventDefault();
              returnFocusRef.current.focus();
            }
          }}
        >
          <Dialog.Close className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-8 sm:top-8">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <div className="bg-primary px-6 pb-7 pt-7 pr-20 text-white sm:px-10 sm:pb-7 sm:pt-7 sm:pr-20">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
              <span className="h-0.5 w-6 rounded-full bg-[#ef9a62]" aria-hidden="true" />
              Students Traffic
            </div>
            <Dialog.Title className="max-w-[22ch] font-display text-[2rem] font-semibold leading-[1.12] tracking-tight text-white sm:text-[2.25rem]">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mt-3 max-w-[48ch] text-[0.95rem] leading-6 text-white/75">
              {description}
            </Dialog.Description>
          </div>

          <div className="px-6 py-7 sm:px-10 sm:py-7">
            <DialogLeadForm
              key={`${ctaVariant}:${countrySlug ?? ""}:${courseSlug ?? ""}:${universitySlug ?? ""}`}
              ctaVariant={ctaVariant}
              submitLabel={submitLabel}
              countrySlug={countrySlug}
              courseSlug={courseSlug}
              universitySlug={universitySlug}
              notes={notes}
              lockInterest={lockInterest}
              onSuccess={onLeadSuccess}
              embedded
              emailRequired
              hidePlaceholders
              floatingCountryPicker
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
