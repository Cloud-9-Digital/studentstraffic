"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { ChevronDown, Upload, X, FileText, Camera, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { submitPeerApplicationAction } from "@/app/_actions/submit-peer-application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";

type University = { id: number; name: string };

const STEPS = [
  { key: "photo", label: "Uploading profile photo" },
  { key: "proof", label: "Uploading proof of enrollment" },
  { key: "saving", label: "Saving your application" },
];

function LoadingDialog({ step }: { step: number }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Animated ring */}
          <div className="relative mb-6 size-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#155e53]/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#155e53]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-6 text-[#155e53] animate-spin" style={{ animationDuration: "1.5s" }} />
            </div>
          </div>

          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Submitting your application
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Please don&apos;t close this page
          </p>

          {/* Steps */}
          <div className="w-full space-y-3">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div
                  key={s.key}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    active
                      ? "bg-[#155e53]/8 border border-[#155e53]/20"
                      : done
                      ? "opacity-60"
                      : "opacity-30"
                  }`}
                >
                  <div className="shrink-0">
                    {done ? (
                      <CheckCircle className="size-4 text-emerald-500" />
                    ) : active ? (
                      <Loader2 className="size-4 text-[#155e53] animate-spin" />
                    ) : (
                      <div className="size-4 rounded-full border-2 border-slate-300" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      active ? "text-[#155e53]" : done ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
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

export function JoinForm({ universities }: { universities: University[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [proofName, setProofName] = useState<string | null>(null);
  const [proofIsImage, setProofIsImage] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);

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
    setPhotoPreview(null);
    setPhotoName(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function clearProof() {
    setProofPreview(null);
    setProofName(null);
    setProofIsImage(false);
    if (proofInputRef.current) proofInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const hasPhoto = (formData.get("photoFile") as File)?.size > 0;

    setIsLoading(true);
    setLoadingStep(hasPhoto ? 0 : 1); // skip photo step if no photo

    // Advance steps visually while upload happens server-side
    const t1 = setTimeout(() => setLoadingStep(hasPhoto ? 1 : 2), hasPhoto ? 1200 : 0);
    const t2 = setTimeout(() => setLoadingStep(2), hasPhoto ? 3500 : 1800);

    try {
      const result = await submitPeerApplicationAction({}, formData);

      clearTimeout(t1);
      clearTimeout(t2);
      setIsLoading(false);

      if (result.success) {
        router.push("/join/thank-you");
      } else {
        toast.error(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      {isLoading && <LoadingDialog step={loadingStep} />}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
        />

        {/* University */}
        <div className="space-y-1.5">
          <Label htmlFor="universityId">University you study / studied at</Label>
          <div className="relative">
            <select
              id="universityId"
              name="universityId"
              required
              defaultValue=""
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

        {/* Enrollment status */}
        <div className="space-y-1.5">
          <Label htmlFor="enrollmentStatus">Your status</Label>
          <div className="relative">
            <select
              id="enrollmentStatus"
              name="enrollmentStatus"
              required
              defaultValue=""
              className="h-11 w-full appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="" disabled>Select status</option>
              <option value="current_student">Currently studying there</option>
              <option value="alumnus">Alumnus / graduated</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Course / Year */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="courseName">Course</Label>
            <div className="relative">
              <select
                id="courseName"
                name="courseName"
                defaultValue=""
                className="h-11 w-full appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
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
            <Label htmlFor="currentYearOrBatch">Year</Label>
            <div className="relative">
              <select
                id="currentYearOrBatch"
                name="currentYearOrBatch"
                defaultValue=""
                className="h-11 w-full appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
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

        {/* Full name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Your full name</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="As it appears on your ID card"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" placeholder="your@email.com" required />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone">WhatsApp number</Label>
          <PhoneInputField id="phone" name="phone" defaultCountry="IN" required />
        </div>

        {/* Profile photo */}
        <div className="space-y-1.5">
          <Label>
            Profile photo{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
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
                <p className="text-xs text-muted-foreground">Profile photo selected</p>
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
        </div>

        {/* Proof of enrollment */}
        <div className="space-y-1.5">
          <Label>
            Proof of enrollment{" "}
            <span className="font-normal text-muted-foreground">(required)</span>
          </Label>
          <input
            ref={proofInputRef}
            type="file"
            name="proofFile"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={handleProofChange}
          />
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
                <p className="text-sm font-medium text-foreground truncate">{proofName}</p>
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
                <p className="font-medium text-foreground">Upload student ID, enrolment letter or marksheet</p>
                <p className="text-xs">JPG, PNG or PDF · Max 10 MB</p>
              </div>
            </button>
          )}
        </div>

        {/* Optional message */}
        <div className="space-y-1.5">
          <Label htmlFor="message">
            Anything else?{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Tell us a bit about your experience or why you want to help..."
            className="w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          Submit application
        </Button>
      </form>
    </>
  );
}
