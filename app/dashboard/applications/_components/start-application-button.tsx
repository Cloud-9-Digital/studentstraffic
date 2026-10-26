"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useId, useState } from "react";

import { startApplicationAction, type ApplicationActionState } from "@/app/dashboard/applications/actions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dashboardButton } from "@/components/dashboard/ui";
import { UNDECIDED_PROGRAMME_SLUG, type ProgrammeOption } from "@/lib/dashboard/application-model";
import { cn } from "@/lib/utils";

const initialState: ApplicationActionState = { error: null };

/**
 * "Start application" → small dialog to pick one of the university's
 * programmes (or "Not sure yet") → creates a draft and opens it.
 */
export function StartApplicationButton({
  universitySlug,
  universityName,
  programmes,
  className,
}: {
  universitySlug: string;
  universityName: string;
  programmes: ProgrammeOption[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(startApplicationAction, initialState);
  const [selected, setSelected] = useState(programmes.length === 1 ? programmes[0].slug : "");
  const groupId = useId();

  return (
    <>
      <button type="button" className={cn(dashboardButton.primary, className)} onClick={() => setOpen(true)}>
        Start application
      </button>
      <Dialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
        <DialogContent className="p-5 sm:max-w-md">
          <form action={formAction} className="space-y-4">
            <DialogHeader className="pr-8">
              <DialogTitle>Apply to {universityName}</DialogTitle>
              <DialogDescription>
                Pick the programme you want. This saves a draft; nothing is sent to the university.
              </DialogDescription>
            </DialogHeader>

            <input type="hidden" name="universitySlug" value={universitySlug} />
            <fieldset aria-labelledby={`${groupId}-legend`} className="space-y-2">
              <legend id={`${groupId}-legend`} className="sr-only">Programme</legend>
              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {programmes.map((programme) => (
                  <ProgrammeRadio
                    key={programme.slug}
                    name="programmeSlug"
                    value={programme.slug}
                    label={programme.title}
                    checked={selected === programme.slug}
                    onSelect={setSelected}
                  />
                ))}
                <ProgrammeRadio
                  name="programmeSlug"
                  value={UNDECIDED_PROGRAMME_SLUG}
                  label="Not sure yet"
                  hint="A counsellor will help you choose."
                  checked={selected === UNDECIDED_PROGRAMME_SLUG}
                  onSelect={setSelected}
                />
              </div>
            </fieldset>

            {state.error ? <p role="alert" className="text-sm text-red-600">{state.error}</p> : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className={dashboardButton.secondary} onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </button>
              <button type="submit" className={dashboardButton.primary} disabled={pending || !selected}>
                {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                Start application
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProgrammeRadio({
  name,
  value,
  label,
  hint,
  checked,
  onSelect,
}: {
  name: string;
  value: string;
  label: string;
  hint?: string;
  checked: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition",
        checked ? "border-[#0f3d37] bg-[#f0f5f4]" : "border-[#e5e7eb] hover:bg-[#f9fafb]",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="mt-0.5 accent-[#0f3d37]"
        required
      />
      <span className="min-w-0">
        <span className="block font-medium text-[#0f1f1c]">{label}</span>
        {hint ? <span className="block text-xs text-[#6b7280]">{hint}</span> : null}
      </span>
    </label>
  );
}
