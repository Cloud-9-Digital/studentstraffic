"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import type { ManagePeerState } from "@/app/_actions/manage-peer";

type University = { id: number; name: string };

type Props = {
  action: (state: ManagePeerState, formData: FormData) => Promise<ManagePeerState>;
  universities: University[];
  defaultValues?: {
    universityId?: number;
    fullName?: string;
    photoUrl?: string;
    courseName?: string;
    currentYearOrBatch?: string;
    contactPhone?: string;
    contactEmail?: string;
  };
  submitLabel?: string;
  cancelHref?: string;
};

const initialState: ManagePeerState = {};

export function PeerForm({
  action,
  universities,
  defaultValues,
  submitLabel = "Save",
  cancelHref = "/admin/peers",
}: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-semibold text-emerald-700">Saved successfully!</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/admin/peers"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="universityId">University</Label>
        <div className="relative">
          <select
            id="universityId"
            name="universityId"
            required
            defaultValue={defaultValues?.universityId ?? ""}
            className="h-11 w-full appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="" disabled>Select university</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="e.g. Rahul Sharma"
          defaultValue={defaultValues?.fullName}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="photoUrl">
          Profile photo URL{" "}
          <span className="font-normal text-muted-foreground">(optional — paste an image link)</span>
        </Label>
        <Input
          id="photoUrl"
          name="photoUrl"
          type="url"
          placeholder="https://example.com/photo.jpg"
          defaultValue={defaultValues?.photoUrl}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="courseName">Course</Label>
          <Input
            id="courseName"
            name="courseName"
            placeholder="e.g. MBBS"
            defaultValue={defaultValues?.courseName}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currentYearOrBatch">Year / Batch</Label>
          <Input
            id="currentYearOrBatch"
            name="currentYearOrBatch"
            placeholder="e.g. 3rd Year"
            defaultValue={defaultValues?.currentYearOrBatch}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contactPhone">
          WhatsApp number{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <PhoneInputField
          id="contactPhone"
          name="contactPhone"
          defaultCountry="IN"
          defaultValue={defaultValues?.contactPhone}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contactEmail">
          Email{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          placeholder="student@email.com"
          defaultValue={defaultValues?.contactEmail}
        />
      </div>

      {state.error && (
        <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saving…" : submitLabel}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
