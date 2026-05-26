"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Upload,
  X,
  FileText,
  Camera,
  CheckCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

import { joinAsPeerAction } from "@/app/_actions/join-as-peer";
import { PhoneInputField } from "@/components/ui/phone-input";
import { getCitiesForState } from "@/lib/data/india-cities";

type University = { id: number; name: string; countryId: number; countryName: string };

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
  "Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
  "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const UPLOAD_STEPS = [
  { key: "photo",  label: "Uploading your photo" },
  { key: "proof",  label: "Uploading your college ID" },
  { key: "saving", label: "Saving your application" },
];

function LoadingDialog({ step }: { step: number }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6 size-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#155e53]/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#155e53]" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">Submitting your application</h3>
          <p className="text-sm text-slate-500 mb-6">Please don&apos;t close this page</p>
          <div className="w-full space-y-3">
            {UPLOAD_STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div
                  key={s.key}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    active ? "bg-[#155e53]/8 border border-[#155e53]/20" : done ? "opacity-60" : "opacity-30"
                  }`}
                >
                  <div className="shrink-0">
                    {done
                      ? <CheckCircle className="size-4 text-emerald-500" />
                      : active
                      ? <Loader2 className="size-4 text-[#155e53] animate-spin" />
                      : <div className="size-4 rounded-full border-2 border-slate-300" />}
                  </div>
                  <span className={`text-sm font-medium ${active ? "text-[#155e53]" : done ? "text-slate-500" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

const selectClass =
  "h-11 w-full appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

const STEP_LABELS = ["Where you study", "Documents"];

export function JoinFlow({
  universities,
  hasPhone,
}: {
  universities: University[];
  hasPhone: boolean;
}) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Step 1 state
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [currentYearOrBatch, setCurrentYearOrBatch] = useState("");
  const [enrollmentStatus, setEnrollmentStatus] = useState("");
  const [homeState, setHomeState] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [languages, setLanguages] = useState("");
  const [phone, setPhone] = useState("");
  const cities = getCitiesForState(homeState);

  // Derived: unique countries with valid data
  const countryOptions = Array.from(
    new Map(
      universities
        .filter((u) => u.countryId && u.countryName)
        .map((u) => [u.countryId, { id: u.countryId, name: u.countryName }])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Universities filtered by selected country
  const filteredUniversities = selectedCountryId
    ? universities.filter((u) => u.countryId === Number(selectedCountryId))
    : [];

  // Step 2 state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [proofName, setProofName] = useState<string | null>(null);
  const [proofIsImage, setProofIsImage] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);

  // ── file handlers ────────────────────────────────────────────────────────

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleProofChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofName(file.name);
    const isImg = file.type.startsWith("image/");
    setProofIsImage(isImg);
    if (isImg) {
      const reader = new FileReader();
      reader.onload = (ev) => setProofPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setProofPreview(null);
    }
  }

  function clearPhoto() {
    setPhotoPreview(null); setPhotoName(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }
  function clearProof() {
    setProofPreview(null); setProofName(null); setProofIsImage(false);
    if (proofInputRef.current) proofInputRef.current.value = "";
  }

  // ── step 1 → advance ────────────────────────────────────────────────────

  function validateStep1(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedCountryId) { toast.error("Please select your country.");                              return; }
    if (!universityId)      { toast.error("Please select your university.");                           return; }
    if (!enrollmentStatus)  { toast.error("Please tell us if you are still studying or graduated.");   return; }
    if (!homeState)        { toast.error("Please select your home state.");                         return; }
    if (!languages)        { toast.error("Please select your main language.");                      return; }
    if (!hasPhone) {
      const fd = new FormData(e.currentTarget);
      const phoneVal = fd.get("phoneDisplay") as string;
      if (!phoneVal?.trim()) { toast.error("Please enter your WhatsApp number."); return; }
      setPhone(phoneVal);
    }
    setStep(2);
  }

  // ── final submit ─────────────────────────────────────────────────────────

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const hasPhoto = (photoInputRef.current?.files?.[0]?.size ?? 0) > 0;
    const hasProof = (proofInputRef.current?.files?.[0]?.size ?? 0) > 0;

    if (!hasProof) { toast.error("Please upload your college ID or admission letter."); return; }

    const fd = new FormData();
    fd.append("universityId", universityId);
    if (courseName)         fd.append("courseName", courseName);
    if (currentYearOrBatch) fd.append("currentYearOrBatch", currentYearOrBatch);
    fd.append("enrollmentStatus", enrollmentStatus);
    if (homeState) fd.append("homeState", homeState);
    if (homeCity)  fd.append("homeCity", homeCity);
    if (languages) fd.append("languages", languages);
    if (!hasPhone && phone) fd.append("phone", phone);

    const msgEl = e.currentTarget.elements.namedItem("message") as HTMLTextAreaElement | null;
    if (msgEl?.value) fd.append("message", msgEl.value);

    if (hasPhoto && photoInputRef.current?.files?.[0]) fd.append("photoFile", photoInputRef.current.files[0]);
    if (proofInputRef.current?.files?.[0])             fd.append("proofFile", proofInputRef.current.files[0]);

    setIsLoading(true);
    setLoadingStep(hasPhoto ? 0 : 1);
    const t1 = setTimeout(() => setLoadingStep(hasPhoto ? 1 : 2), hasPhoto ? 1200 : 0);
    const t2 = setTimeout(() => setLoadingStep(2), hasPhoto ? 3500 : 1800);

    try {
      const result = await joinAsPeerAction(fd);
      clearTimeout(t1); clearTimeout(t2);
      setIsLoading(false);
      if (result.success) {
        router.push("/join/thank-you");
      } else {
        toast.error(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      clearTimeout(t1); clearTimeout(t2);
      setIsLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  }

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <>
      {isLoading && <LoadingDialog step={loadingStep} />}

      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center">
        {STEP_LABELS.map((label, i) => {
          const s = i + 1;
          const done = s < step;
          const active = s === step;
          return (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5 w-24">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  active
                    ? "bg-[#155e53] text-white ring-4 ring-[#155e53]/20"
                    : done
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
                }`}>
                  {done ? <CheckCircle className="size-4" /> : s}
                </div>
                <span className={`text-xs font-medium text-center leading-tight ${active ? "text-[#155e53]" : done ? "text-slate-500" : "text-slate-400"}`}>
                  {label}
                </span>
              </div>
              {s < 2 && (
                <div className={`h-px w-12 mb-5 shrink-0 transition-colors ${done ? "bg-emerald-300" : "bg-slate-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Where you study ── */}
      {step === 1 && (
        <form onSubmit={validateStep1} className="space-y-5">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

          {/* WhatsApp number — only if not already saved on account */}
          {!hasPhone && (
            <div className="space-y-1.5">
              <label className={labelClass}>Your WhatsApp number</label>
              <PhoneInputField name="phoneDisplay" defaultCountry="IN" required />
              <p className="text-xs text-slate-400">We will save this to your account so students can reach you.</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="countryId" className={labelClass}>Which country are you studying in?</label>
            <div className="relative">
              <select
                id="countryId"
                required
                value={selectedCountryId}
                onChange={(e) => {
                  setSelectedCountryId(e.target.value);
                  setUniversityId(""); // reset university when country changes
                }}
                className={selectClass}
              >
                <option value="" disabled>Select country</option>
                {countryOptions.map((c) => (
                  <option key={String(c.id)} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="universityId" className={labelClass}>Which university are you from?</label>
            <div className="relative">
              <select
                id="universityId"
                required
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                disabled={!selectedCountryId}
                className={selectClass}
              >
                <option value="" disabled>
                  {selectedCountryId ? "Select university" : "Select country first"}
                </option>
                {filteredUniversities.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="enrollmentStatus" className={labelClass}>Are you still studying there or have you graduated?</label>
            <div className="relative">
              <select
                id="enrollmentStatus"
                required
                value={enrollmentStatus}
                onChange={(e) => setEnrollmentStatus(e.target.value)}
                className={selectClass}
              >
                <option value="" disabled>Select one</option>
                <option value="current_student">I am currently studying there</option>
                <option value="alumnus">I have already graduated</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="courseName" className={labelClass}>Course</label>
              <div className="relative">
                <select id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} className={selectClass}>
                  <option value="">Select course</option>
                  <option value="MBBS">MBBS</option>
                  <option value="BDS">BDS</option>
                  <option value="MD">MD</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="currentYearOrBatch" className={labelClass}>Which year are you in?</label>
              <div className="relative">
                <select id="currentYearOrBatch" value={currentYearOrBatch} onChange={(e) => setCurrentYearOrBatch(e.target.value)} className={selectClass}>
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="6th Year">6th Year</option>
                  <option value="Intern">Intern</option>
                  <option value="Graduated">Graduated</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="homeState" className={labelClass}>Home state</label>
              <div className="relative">
                <select
                  id="homeState"
                  required
                  value={homeState}
                  onChange={(e) => { setHomeState(e.target.value); setHomeCity(""); }}
                  className={selectClass}
                >
                  <option value="" disabled>Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="homeCity" className={labelClass}>
                City <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <div className="relative">
                <select
                  id="homeCity"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  disabled={cities.length === 0}
                  className={selectClass}
                >
                  <option value="">{homeState ? "Select city" : "Select state first"}</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="languages" className={labelClass}>Main language you speak</label>
            <div className="relative">
              <select
                id="languages"
                required
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className={selectClass}
              >
                <option value="" disabled>Select language</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Marathi">Marathi</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Bengali">Bengali</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Odia">Odia</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#155e53] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f4a40] active:scale-[0.99]"
          >
            Continue <ArrowRight className="size-4" />
          </button>
        </form>
      )}

      {/* ── Step 2: Documents ── */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile photo */}
          <div className="space-y-1.5">
            <label className={labelClass}>
              Your photo{" "}
              <span className="font-normal text-slate-400">(optional — helps students trust you)</span>
            </label>
            <input ref={photoInputRef} type="file" name="photoFile" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
            {photoPreview ? (
              <div className="flex items-center gap-3 rounded-xl border border-input bg-slate-50 px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="Preview" className="size-12 rounded-full object-cover border border-border" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{photoName}</p>
                  <p className="text-xs text-muted-foreground">Photo selected</p>
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
                  <p className="font-medium text-foreground">Upload a photo of yourself</p>
                  <p className="text-xs">JPG, PNG or WebP · Max 5 MB</p>
                </div>
              </button>
            )}
          </div>

          {/* College ID */}
          <div className="space-y-1.5">
            <label className={labelClass}>
              College ID or admission letter{" "}
              <span className="font-normal text-slate-400">(required — kept private)</span>
            </label>
            <input ref={proofInputRef} type="file" name="proofFile" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={handleProofChange} />
            {proofName ? (
              <div className="flex items-center gap-3 rounded-xl border border-input bg-slate-50 px-4 py-3">
                {proofIsImage && proofPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={proofPreview} alt="Preview" className="size-12 rounded-lg object-cover border border-border" />
                ) : (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-rose-100">
                    <FileText className="size-6 text-rose-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{proofName}</p>
                  <p className="text-xs text-muted-foreground">{proofIsImage ? "Image selected" : "PDF selected"}</p>
                </div>
                <button type="button" onClick={clearProof} className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-slate-200">
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => proofInputRef.current?.click()}
                className="flex w-full items-center gap-3 rounded-xl border border-dashed border-input bg-transparent px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-ring hover:bg-slate-50"
              >
                <Upload className="size-5 shrink-0 text-slate-400" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Upload college ID or admission letter</p>
                  <p className="text-xs">JPG, PNG or PDF · Max 10 MB</p>
                </div>
              </button>
            )}
            <p className="text-xs text-slate-400">
              Only used to verify you are a real student — never shown publicly.
            </p>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label htmlFor="message" className={labelClass}>
              Anything you want to say?{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Tell students a bit about your experience and how you can help them..."
              className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#155e53] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f4a40] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              Submit application
            </button>
          </div>
        </form>
      )}
    </>
  );
}
