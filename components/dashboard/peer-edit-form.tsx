"use client";

import { useRef, useState, useEffect, useActionState, useTransition, type FormEvent } from "react";
import { Camera, ChevronDown, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { updatePeerProfileAction, type UpdatePeerProfileState } from "@/app/_actions/update-peer-profile";
import { getCitiesForState } from "@/lib/data/india-cities";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
  "Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
  "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const YEAR_OPTIONS = [
  "1st Year","2nd Year","3rd Year","4th Year","5th Year",
  "6th Year","Intern","House Surgeon","Alumni",
];

const LANGUAGE_OPTIONS = [
  "Hindi","English","Telugu","Tamil","Kannada","Malayalam",
  "Marathi","Bengali","Gujarati","Punjabi","Odia","Urdu",
];

type Peer = {
  fullName: string;
  photoUrl: string | null;
  courseName: string | null;
  currentYearOrBatch: string | null;
  homeState: string | null;
  homeCity: string | null;
  languages: string[] | null;
  universityName: string;
};

const initialState: UpdatePeerProfileState = { status: "idle" };

const fieldClass =
  "w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5 text-sm text-[#0f1f1c] placeholder-[#9ca3af] outline-none transition focus:border-[#0f3d37] focus:bg-white focus:ring-2 focus:ring-[#0f3d37]/10";

const selectClass = `${fieldClass} appearance-none pr-9`;

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={selectClass} {...props}>{children}</select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#9ca3af]" />
    </div>
  );
}

export function PeerEditForm({ peer }: { peer: Peer }) {
  const [state, formAction] = useActionState(updatePeerProfileAction, initialState);
  const [isPending, startTransition] = useTransition();

  const [homeState, setHomeState] = useState(peer.homeState ?? "");
  const [homeCity, setHomeCity] = useState(peer.homeCity ?? "");
  const [languages, setLanguages] = useState<string[]>(peer.languages ?? []);
  const [photoPreview, setPhotoPreview] = useState<string | null>(peer.photoUrl);
  const [hasNewPhoto, setHasNewPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const cities = homeState ? getCitiesForState(homeState) : [];

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (state.status === "success") toast.success(state.message ?? "Profile updated.");
    if (state.status === "error") toast.error(state.message ?? "Something went wrong.");
  }, [state]);

  function toggleLanguage(lang: string) {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setHasNewPhoto(true);
  }

  function removePhoto() {
    setPhotoPreview(peer.photoUrl);
    setHasNewPhoto(false);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("languages", languages.join(","));
    startTransition(() => formAction(fd));
  }

  return (
    <form onSubmit={handleSubmit} className="divide-y divide-[#eaeaea]">

      {/* Photo row */}
      <div className="flex items-center gap-4 py-5">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#0f3d37] text-xl font-bold text-white overflow-hidden">
          {photoPreview
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={photoPreview} alt="Preview" className="size-16 object-cover" />
            : peer.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#0f1f1c]">{peer.fullName}</p>
          <p className="mt-0.5 text-xs text-[#9ca3af] truncate">{peer.universityName}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] transition"
          >
            <Camera className="size-3.5" />
            {hasNewPhoto ? "Change" : "Upload photo"}
          </button>
          {hasNewPhoto && (
            <button
              type="button"
              onClick={removePhoto}
              className="flex items-center justify-center rounded-lg border border-[#e5e7eb] p-1.5 text-[#9ca3af] hover:text-red-500 hover:border-red-200 transition"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <input
          ref={photoInputRef}
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      {/* Study details */}
      <div className="py-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">Study details</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#374151]">Course</label>
            <input
              name="courseName"
              defaultValue={peer.courseName ?? ""}
              placeholder="e.g. MBBS, MD"
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#374151]">Year / Batch</label>
            <Select name="currentYearOrBatch" defaultValue={peer.currentYearOrBatch ?? ""}>
              <option value="">Select year</option>
              {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
            </Select>
          </div>
        </div>
      </div>

      {/* Home location */}
      <div className="py-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">Home in India</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#374151]">State</label>
            <Select
              name="homeState"
              value={homeState}
              onChange={(e) => { setHomeState(e.target.value); setHomeCity(""); }}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#374151]">City</label>
            <Select
              name="homeCity"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              disabled={!homeState || cities.length === 0}
            >
              <option value="">{homeState ? "Select city" : "Select state first"}</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="py-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">Languages you speak</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => {
            const active = languages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  active
                    ? "bg-[#0f3d37] text-white"
                    : "bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]"
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="py-5 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-[#0f3d37] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#184a43] transition disabled:opacity-60"
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Save changes
        </button>
      </div>
    </form>
  );
}
