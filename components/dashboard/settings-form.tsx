"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { updateProfileAction, type ProfileState } from "@/app/_actions/update-profile";
import { PhoneInputField } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";

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

  function toggleCountry(country: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(country)) next.delete(country);
      else next.add(country);
      return next;
    });
  }

  return (
    <form action={action} className="space-y-8">
      {/* Hidden field for preferred countries */}
      <input type="hidden" name="preferredCountries" value={[...selected].join(",")} />

      {/* Feedback banner */}
      {state.status === "success" && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <CheckCircle2 className="size-4 shrink-0 text-green-600" />
          <p className="text-sm font-medium text-green-700">{state.message}</p>
        </div>
      )}
      {state.status === "error" && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="size-4 shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-600">{state.message}</p>
        </div>
      )}

      {/* Personal info */}
      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold text-[#0f1f1c]">Personal information</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-semibold text-[#374151]">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={name ?? ""}
              required
              className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5 text-sm text-[#0f1f1c] outline-none transition focus:border-[#0f3d37] focus:bg-white focus:ring-2 focus:ring-[#0f3d37]/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#374151]">
              Email address
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-[#e5e7eb] bg-[#f3f4f6] px-3.5 py-2.5 text-sm text-[#9ca3af]"
            />
            <p className="text-[10px] text-[#9ca3af]">Email cannot be changed.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#374151]">
              Phone number
            </label>
            <PhoneInputField
              name="phone"
              defaultValue={phone ?? ""}
            />
          </div>
        </div>
      </section>

      {/* Study preferences */}
      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-[#0f1f1c]">Study preferences</h2>
        <p className="mb-5 text-xs text-[#6b7280]">Help us personalise recommendations for you.</p>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="neetScore" className="block text-xs font-semibold text-[#374151]">
              NEET score
            </label>
            <input
              id="neetScore"
              name="neetScore"
              type="number"
              min={0}
              max={720}
              defaultValue={neetScore ?? ""}
              placeholder="e.g. 540"
              className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5 text-sm text-[#0f1f1c] outline-none transition focus:border-[#0f3d37] focus:bg-white focus:ring-2 focus:ring-[#0f3d37]/10"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="budgetUsd" className="block text-xs font-semibold text-[#374151]">
              Total budget
            </label>
            <select
              id="budgetUsd"
              name="budgetUsd"
              defaultValue={budgetUsd?.toString() ?? ""}
              className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5 text-sm text-[#0f1f1c] outline-none transition focus:border-[#0f3d37] focus:bg-white focus:ring-2 focus:ring-[#0f3d37]/10"
            >
              <option value="">Select a range</option>
              {BUDGET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="block text-xs font-semibold text-[#374151]">
              Preferred countries
            </label>
            <div className="flex flex-wrap gap-2">
              {COUNTRY_OPTIONS.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => toggleCountry(country)}
                  className={cn(
                    "rounded-xl border px-3 py-1.5 text-xs font-medium transition",
                    selected.has(country)
                      ? "border-[#0f3d37]/40 bg-[#f0f7f5] text-[#0f3d37]"
                      : "border-[#e5e7eb] bg-[#f9fafb] text-[#374151] hover:border-[#0f3d37]/20 hover:bg-[#f5faf9]"
                  )}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0f3d37] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184a43] disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
