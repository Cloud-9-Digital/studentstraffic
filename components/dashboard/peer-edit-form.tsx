"use client";

import { useActionState, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera, ChevronDown, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { updatePeerProfileAction, type UpdatePeerProfileState } from "@/app/_actions/update-peer-profile";
import { Section, dashboardButton } from "@/components/dashboard/ui";
import { StudentCard } from "@/components/site/student-card";
import { getCitiesForState } from "@/lib/data/india-cities";
import { containsPeerContactDetails } from "@/lib/peer-contact-policy";
import type { PeerWithUniversity } from "@/lib/university-community";
import { cn } from "@/lib/utils";

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

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const COURSE_MAX = 80;

/** Profile fields plus what the public card preview needs. */
export type PeerEditProfile = Omit<PeerWithUniversity, "acceptingRequests"> & {
  acceptingRequests: boolean;
};

const initialState: UpdatePeerProfileState = { status: "idle" };

const fieldClass =
  "w-full rounded-lg border border-[#e5e7eb] bg-white px-3.5 py-2.5 text-sm text-[#0f1f1c] placeholder-[#9ca3af] outline-none transition focus:border-[#0f3d37] focus:ring-2 focus:ring-[#0f3d37]/10 disabled:bg-[#f9fafb] disabled:text-[#9ca3af] aria-[invalid=true]:border-red-300";

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(fieldClass, "appearance-none pr-9")} {...props}>{children}</select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string | null }) {
  if (!message) return null;
  return <p id={id} role="alert" className="text-xs text-red-600">{message}</p>;
}

export function PeerEditForm({ peer, voiceCallsEnabled }: { peer: PeerEditProfile; voiceCallsEnabled: boolean }) {
  const router = useRouter();
  const [state, formAction] = useActionState(updatePeerProfileAction, initialState);
  const [isPending, startTransition] = useTransition();

  const [accepting, setAccepting] = useState(peer.acceptingRequests);
  const [courseName, setCourseName] = useState(peer.courseName ?? "");
  const [year, setYear] = useState(peer.currentYearOrBatch ?? "");
  const [homeState, setHomeState] = useState(peer.homeState ?? "");
  const [homeCity, setHomeCity] = useState(peer.homeCity ?? "");
  const [languages, setLanguages] = useState<string[]>(peer.languages ?? []);
  const [photoPreview, setPhotoPreview] = useState<string | null>(peer.photoUrl);
  const [hasNewPhoto, setHasNewPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const cities = homeState ? getCitiesForState(homeState) : [];

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (state.status === "success") {
      toast.success(state.message ?? "Profile saved.");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset after the server confirmed the save
      setDirty(false);
      setHasNewPhoto(false);
      router.refresh();
    }
    if (state.status === "error") toast.error(state.message ?? "Something went wrong. Please try again.");
  }, [state, router]);

  function markDirty() {
    setDirty(true);
  }

  function toggleLanguage(lang: string) {
    setLanguages((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]));
    markDirty();
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      setPhotoError("Choose a JPG, PNG or WebP image.");
      e.target.value = "";
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      setPhotoError("Photo must be under 5 MB.");
      e.target.value = "";
      return;
    }
    setPhotoError(null);
    setPhotoPreview(URL.createObjectURL(file));
    setHasNewPhoto(true);
    markDirty();
  }

  function removePhoto() {
    setPhotoPreview(peer.photoUrl);
    setHasNewPhoto(false);
    setPhotoError(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function validateCourse(value: string) {
    if (value.length > COURSE_MAX) return `Keep the course under ${COURSE_MAX} characters.`;
    if (value && containsPeerContactDetails(value)) return "Remove contact details (phone, email, links) from the course name.";
    return null;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const error = validateCourse(courseName.trim());
    setCourseError(error);
    if (error || photoError) {
      toast.error("Fix the highlighted fields before saving.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    fd.set("languages", languages.join(","));
    startTransition(() => formAction(fd));
  }

  const preview: PeerWithUniversity = {
    ...peer,
    acceptingRequests: accepting,
    courseName: courseName.trim() || null,
    currentYearOrBatch: year || null,
    homeState: homeState || null,
    homeCity: homeCity || null,
    languages,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <form onSubmit={handleSubmit} onChange={markDirty} className="min-w-0 space-y-5" noValidate>
        <Section title="Availability" className="scroll-mt-24">
          <div id="availability" className="scroll-mt-24">
            <label className="flex cursor-pointer items-start justify-between gap-4">
              <span>
                <span className="block text-sm font-medium text-[#0f1f1c]">Accept new requests</span>
                <span className="mt-0.5 block text-xs text-[#6b7280]">
                  Turn off when you are busy. Students you already accepted can still message and call you.
                </span>
              </span>
              <span className="relative mt-0.5 inline-flex shrink-0">
                <input
                  type="checkbox"
                  name="acceptingRequests"
                  checked={accepting}
                  onChange={(e) => setAccepting(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-[#d1d5db] transition peer-checked:bg-[#0f3d37] peer-focus-visible:ring-2 peer-focus-visible:ring-[#0f3d37]/30" />
                <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
              </span>
            </label>
          </div>
        </Section>

        <Section title="Photo" description="A clear, friendly face photo gets more requests. JPG, PNG or WebP, under 5 MB.">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0f3d37] text-xl font-bold text-white">
              {photoPreview
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={photoPreview} alt="Your profile photo" className="size-16 object-cover" />
                : peer.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => photoInputRef.current?.click()} className={dashboardButton.secondary}>
                <Camera className="size-4" />
                {photoPreview ? "Change photo" : "Upload photo"}
              </button>
              {hasNewPhoto ? (
                <button type="button" onClick={removePhoto} className={dashboardButton.secondary} aria-label="Undo photo change">
                  <X className="size-4" />
                </button>
              ) : null}
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
          <div className="mt-2">
            <FieldError id="photo-error" message={photoError} />
          </div>
        </Section>

        <Section title="Study details" description={`Shown under your name at ${peer.universityName}.`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="courseName" className="text-xs font-medium text-[#374151]">Course</label>
              <input
                id="courseName"
                name="courseName"
                value={courseName}
                onChange={(e) => { setCourseName(e.target.value); if (courseError) setCourseError(validateCourse(e.target.value.trim())); }}
                onBlur={(e) => setCourseError(validateCourse(e.target.value.trim()))}
                placeholder="e.g. MBBS"
                maxLength={COURSE_MAX + 20}
                aria-invalid={courseError ? true : undefined}
                aria-describedby={courseError ? "course-error" : undefined}
                className={fieldClass}
              />
              <FieldError id="course-error" message={courseError} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="currentYearOrBatch" className="text-xs font-medium text-[#374151]">Year / batch</label>
              <Select id="currentYearOrBatch" name="currentYearOrBatch" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Select year</option>
                {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
              </Select>
            </div>
          </div>
        </Section>

        <Section title="Home in India" description="Students often look for a guide from their own state.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="homeState" className="text-xs font-medium text-[#374151]">State</label>
              <Select
                id="homeState"
                name="homeState"
                value={homeState}
                onChange={(e) => { setHomeState(e.target.value); setHomeCity(""); }}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="homeCity" className="text-xs font-medium text-[#374151]">City</label>
              <Select
                id="homeCity"
                name="homeCity"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                disabled={!homeState || cities.length === 0}
              >
                <option value="">{homeState ? "Select city" : "Select a state first"}</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
          </div>
        </Section>

        <Section title="Languages you speak" description="Pick every language you are comfortable talking in.">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Languages">
            {LANGUAGE_OPTIONS.map((lang) => {
              const active = languages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleLanguage(lang)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition",
                    active ? "bg-[#0f3d37] text-white" : "bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]",
                  )}
                >
                  {lang}
                </button>
              );
            })}
          </div>
          {languages.length === 0 ? (
            <p className="mt-2 text-xs text-amber-700">Add at least one language so students know they can talk to you.</p>
          ) : null}
        </Section>

        <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 flex items-center justify-between gap-3 rounded-xl border border-[#eaeaea] bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:bottom-4">
          <p className="text-xs text-[#6b7280]" aria-live="polite">
            {isPending ? "Saving…" : dirty ? "You have unsaved changes." : "All changes saved."}
          </p>
          <button type="submit" disabled={isPending || !dirty} className={dashboardButton.primary}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save changes
          </button>
        </div>
      </form>

      <aside className="hidden lg:block">
        <div className="sticky top-6 space-y-2">
          <p className="text-xs font-semibold text-[#6b7280]">How students see you</p>
          {/* Preview only: inert so the card's call button and dialog do nothing here. */}
          <div inert className="select-none">
            <StudentCard peer={preview} voiceCallsEnabled={voiceCallsEnabled} />
          </div>
          {hasNewPhoto ? <p className="text-xs text-[#9ca3af]">Your new photo shows here after you save.</p> : null}
        </div>
      </aside>
    </div>
  );
}
