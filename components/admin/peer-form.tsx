"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { Camera, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import type { ManagePeerState } from "@/app/_actions/manage-peer";
import { getCitiesForState } from "@/lib/data/india-cities";

type University = { id: number; name: string };

type Props = {
  action: (state: ManagePeerState, formData: FormData) => Promise<ManagePeerState>;
  universities: University[];
  defaultValues?: {
    universityId?: number;
    fullName?: string;
    existingPhotoUrl?: string;
    courseName?: string;
    currentYearOrBatch?: string;
    contactPhone?: string;
    contactEmail?: string;
    homeState?: string;
    homeCity?: string;
    languages?: string;
  };
  submitLabel?: string;
  cancelHref?: string;
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const initialState: ManagePeerState = {};

export function PeerForm({
  action,
  universities,
  defaultValues,
  submitLabel = "Save",
  cancelHref = "/admin/peers",
}: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [selectedState, setSelectedState] = useState(defaultValues?.homeState ?? "");
  const cities = getCitiesForState(selectedState);
  const photoInputRef = useRef<HTMLInputElement>(null);
  // photoPreview: null = no photo, string = data URL (new file) or existing URL
  const [photoPreview, setPhotoPreview] = useState<string | null>(defaultValues?.existingPhotoUrl ?? null);
  const [photoName, setPhotoName] = useState<string | null>(defaultValues?.existingPhotoUrl ? "Current photo" : null);
  const [isExistingPhoto, setIsExistingPhoto] = useState(!!defaultValues?.existingPhotoUrl);
  const [cleared, setCleared] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    setIsExistingPhoto(false);
    setCleared(false);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function clearPhoto() {
    setPhotoPreview(null);
    setPhotoName(null);
    setIsExistingPhoto(false);
    setCleared(true);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

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
        <Label>
          Profile photo <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <input
          ref={photoInputRef}
          type="file"
          name="photoFile"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhotoChange}
        />
        {photoPreview ? (
          <div className="flex items-center gap-3 rounded-xl border border-input bg-slate-50 px-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoPreview} alt="Preview" className="size-12 rounded-full object-cover border border-border" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{photoName}</p>
              <p className="text-xs text-muted-foreground">{isExistingPhoto ? "Current photo" : "New photo selected"}</p>
            </div>
            <button type="button" onClick={clearPhoto} className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-slate-200">
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-xl border border-dashed border-input bg-transparent px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-ring hover:bg-slate-50"
          >
            <Camera className="size-5 shrink-0 text-slate-400" />
            <div className="text-left">
              <p className="font-medium text-foreground">Upload a photo</p>
              <p className="text-xs">JPG, PNG or WebP · Max 5 MB</p>
            </div>
          </button>
        )}
        {cleared && <input type="hidden" name="clearPhoto" value="1" />}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="homeState">Home state</Label>
          <div className="relative">
            <select
              id="homeState"
              name="homeState"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="homeCity">City</Label>
          <div className="relative">
            <select
              id="homeCity"
              name="homeCity"
              defaultValue={defaultValues?.homeCity ?? ""}
              disabled={cities.length === 0}
              className="h-11 w-full appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
            >
              <option value="">{selectedState ? "Select city" : "Select state first"}</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="languages">
          Languages spoken{" "}
          <span className="font-normal text-muted-foreground">(comma-separated, e.g. Hindi, English, Tamil)</span>
        </Label>
        <Input
          id="languages"
          name="languages"
          placeholder="e.g. Hindi, English"
          defaultValue={defaultValues?.languages}
        />
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
