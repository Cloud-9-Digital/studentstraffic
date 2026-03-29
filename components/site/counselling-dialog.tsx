"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";

import { LeadForm } from "@/components/site/lead-form";
import { Button } from "@/components/ui/button";

export function CounsellingDialog({
  triggerContent,
  triggerClassName,
  triggerVariant = "accent",
  triggerSize = "default",
  plainTrigger = false,
  onTriggerClick,
  title = "Free Counselling",
  description = "Share your details and our counsellors will reach out to guide you through your options and handle your admissions.",
  submitLabel,
  ctaVariant = "header_dialog",
  countrySlug,
  courseSlug,
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
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
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
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-6 shadow-dialog outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold text-heading">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-black/6 hover:text-foreground">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <LeadForm
            sourcePath={pathname}
            ctaVariant={ctaVariant}
            submitLabel={submitLabel}
            countrySlug={countrySlug}
            courseSlug={courseSlug}
            embedded
            stacked
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
