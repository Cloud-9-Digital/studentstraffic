"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction, type ProfileState } from "@/app/_actions/update-profile";
import { PhoneInputField } from "@/components/ui/phone-input";
import { Section, dashboardButton } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";

const labelClass = "block text-sm font-medium text-[#374151]";
const inputClass =
  "w-full rounded-lg border border-[#e5e7eb] bg-white px-3.5 py-2.5 text-sm text-[#0f1f1c] outline-none transition focus:border-[#0f3d37] focus:ring-2 focus:ring-[#0f3d37]/10";

const COUNTRY_OPTIONS = [
  "Russia", "Kazakhstan", "Kyrgyzstan", "Georgia", "Philippines",
  "Bangladesh", "Nepal", "China", "Egypt", "Ukraine",
];

const BUDGET_OPTIONS = [
  { label: "Under $20,000", value: "20000" },
  { label: "$20,000 – $30,000", value: "30000" },
  { label: "$30,000 – $50,000", value: "50000" },
  { label: "$50,000 – $80,000", value: "80000" },
  { label: "Over $80,000", value: "100000" },
];

interface Props {
  name: string | null;
  email: string;
  phone: string | null;
  neetScore: number | null;
  budgetUsd: number | null;
  preferredCountries: string[] | null;
}

export function SettingsForm({ name, email, phone, neetScore, budgetUsd, preferredCountries }: Props) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfileAction, { status: "idle" });
  const [selected, setSelected] = useState<Set<string>>(new Set(preferredCountries ?? []));
  // The action result the user last edited after: a new result (save finished)
  // clears "unsaved" without setting state in an effect. Errors keep it.
  const [editedAfter, setEditedAfter] = useState<ProfileState | null>(null);
  const dirty = editedAfter !== null && (editedAfter === state || state.status === "error");
  const markDirty = () => setEditedAfter(state);

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (state.status === "success") toast.success(state.message ?? "Profile updated.");
    if (state.status === "error") toast.error(state.message ?? "Something went wrong.");
  }, [state]);

  function toggleCountry(country: string) {
    markDirty();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(country)) next.delete(country);
      else next.add(country);
      return next;
    });
  }

  return (
    <form
      action={action}
      onChange={markDirty}
      className="space-y-6"
    >
      {/* Hidden field for preferred countries */}
      <input type="hidden" name="preferredCountries" value={[...selected].join(",")} />

      <Section title="Profile" description="How guides and our counsellors will know you.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="name" className={labelClass}>
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              defaultValue={name ?? ""}
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className={labelClass}>
              Phone number
            </label>
            <PhoneInputField id="phone" name="phone" defaultValue={phone ?? ""} />
          </div>
        </div>
      </Section>

      <Section title="Study preferences" description="We use these to suggest universities that fit your score and budget.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="neetScore" className={labelClass}>
              NEET score
            </label>
            <input
              id="neetScore"
              name="neetScore"
              type="number"
              inputMode="numeric"
              min={0}
              max={720}
              defaultValue={neetScore ?? ""}
              placeholder="e.g. 540"
              className={inputClass}
            />
            <p className="text-xs text-[#6b7280]">Out of 720. Leave blank if you haven&apos;t taken it yet.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="budgetUsd" className={labelClass}>
              Total budget
            </label>
            <div className="relative">
              <select
                id="budgetUsd"
                name="budgetUsd"
                defaultValue={budgetUsd?.toString() ?? ""}
                className={cn(inputClass, "appearance-none pr-9")}
              >
                <option value="">Select a range</option>
                {BUDGET_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
            <p className="text-xs text-[#6b7280]">For the whole course, including tuition and living costs.</p>
          </div>

          <fieldset className="space-y-2 sm:col-span-2">
            <legend className={labelClass}>Preferred countries</legend>
            <div className="flex flex-wrap gap-2">
              {COUNTRY_OPTIONS.map((country) => {
                const isSelected = selected.has(country);
                return (
                  <button
                    key={country}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleCountry(country)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition",
                      isSelected
                        ? "border-[#0f3d37]/40 bg-[#f0f5f4] text-[#0f3d37]"
                        : "border-[#e5e7eb] bg-white text-[#374151] hover:border-[#0f3d37]/20 hover:bg-[#f9fafb]"
                    )}
                  >
                    {isSelected && <Check className="size-3.5" />}
                    {country}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#6b7280]">
              {selected.size === 0 ? "Pick as many as you like." : `${selected.size} selected`}
            </p>
          </fieldset>
        </div>
      </Section>

      <Section title="Account">
        <div className="space-y-1.5 sm:max-w-sm">
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border border-[#e5e7eb] bg-[#f3f4f6] px-3.5 py-2.5 text-sm text-[#6b7280]"
          />
          <p className="text-xs text-[#6b7280]">You sign in with this email. It can&apos;t be changed here.</p>
        </div>
      </Section>

      {/* Save bar: sticks above the mobile bottom nav, and to the bottom of the viewport on desktop */}
      <div className="sticky bottom-[calc(4.5rem_+_env(safe-area-inset-bottom))] z-20 flex items-center justify-between gap-3 rounded-xl border border-[#eaeaea] bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:bottom-4">
        <p className="min-w-0 text-xs text-[#6b7280]" aria-live="polite">
          {pending ? "Saving your changes…" : dirty ? "You have unsaved changes." : "All changes saved."}
        </p>
        <button type="submit" disabled={pending} className={dashboardButton.primary}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
