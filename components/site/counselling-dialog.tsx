"use client";

import { useActionState, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { X, ArrowRight } from "lucide-react";

import {
  type LeadFormState,
  submitLeadAction,
} from "@/app/_actions/submit-lead";
import { syncLeadTrackingFields } from "@/components/site/lead-tracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";

const initialState: LeadFormState = {};

export function CounsellingDialog({
  triggerContent,
  triggerClassName,
  triggerVariant = "accent",
  triggerSize = "default",
  plainTrigger = false,
  onTriggerClick,
}: {
  triggerContent: React.ReactNode;
  triggerClassName?: string;
  triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  triggerSize?: React.ComponentProps<typeof Button>["size"];
  plainTrigger?: boolean;
  onTriggerClick?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const contentId = useId();
  const [state, formAction, isPending] = useActionState(
    submitLeadAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  const armStartedAt = () => {
    syncLeadTrackingFields(formRef.current);

    if (startedAtRef.current && startedAtRef.current.value === "0") {
      startedAtRef.current.value = String(Date.now());
    }
  };

  const openDialog = () => {
    syncLeadTrackingFields(formRef.current);
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
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold text-heading">
                Free Counselling
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Share your details and we&apos;ll help you shortlist the right
                universities for your goals.
              </Dialog.Description>
            </div>
            <Dialog.Close className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-black/6 hover:text-foreground">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            action={formAction}
            onFocusCapture={armStartedAt}
            onPointerDownCapture={armStartedAt}
            onKeyDownCapture={armStartedAt}
            onSubmitCapture={armStartedAt}
            className="space-y-4"
          >
            <input type="hidden" name="sourcePath" value={pathname} />
            <input type="hidden" name="ctaVariant" value="header_dialog" />
            <input type="hidden" name="sourceUrl" />
            <input type="hidden" name="sourceQuery" defaultValue="{}" />
            <input type="hidden" name="pageTitle" />
            <input type="hidden" name="documentReferrer" />
            <input type="hidden" name="clientContext" defaultValue="{}" />
            <input
              ref={startedAtRef}
              type="hidden"
              name="startedAt"
              defaultValue="0"
            />
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />

            <div className="space-y-1.5">
              <Label htmlFor="cd-name">Full name</Label>
              <Input
                id="cd-name"
                name="fullName"
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cd-phone">Phone number</Label>
              <PhoneInputField id="cd-phone" name="phone" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cd-email">
                Email{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="cd-email"
                name="email"
                type="email"
                placeholder="you@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cd-state">State</Label>
              <Input
                id="cd-state"
                name="userState"
                placeholder="Your state"
                autoComplete="address-level1"
                required
              />
            </div>

            {state.error && (
              <p className="rounded-xl border border-destructive/20 bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
                {state.error}
              </p>
            )}

            <Button
              type="submit"
              variant="accent"
              disabled={isPending}
              className="w-full gap-2 shadow-cta hover:shadow-cta-hover"
            >
              {isPending ? "Sending…" : "Request Free Counselling"}
              {!isPending && <ArrowRight className="size-4" />}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
