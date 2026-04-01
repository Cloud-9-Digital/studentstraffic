"use client";

import { useActionState, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  type PeerRequestFormState,
  submitPeerRequestAction,
} from "@/app/_actions/submit-peer-request";
import { syncLeadTrackingFields } from "@/components/site/lead-tracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { getCitiesForState } from "@/lib/data/india-cities";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const initialState: PeerRequestFormState = {};

export function PeerRequestForm({
  sourcePath,
  universitySlug,
  universityName,
}: {
  sourcePath: string;
  universitySlug: string;
  universityName: string;
}) {
  const [state, formAction, isPending] = useActionState(
    submitPeerRequestAction,
    initialState
  );
  const [selectedState, setSelectedState] = useState("");
  const cities = getCitiesForState(selectedState);
  const formRef = useRef<HTMLFormElement | null>(null);
  const startedAtInputRef = useRef<HTMLInputElement | null>(null);

  const armStartedAt = () => {
    syncLeadTrackingFields(formRef.current);

    if (startedAtInputRef.current && startedAtInputRef.current.value === "0") {
      startedAtInputRef.current.value = String(Date.now());
    }
  };

  return (
    <form
          ref={formRef}
          action={formAction}
          className="space-y-3"
          onFocusCapture={armStartedAt}
          onPointerDownCapture={armStartedAt}
          onKeyDownCapture={armStartedAt}
          onSubmitCapture={armStartedAt}
        >
          <input type="hidden" name="sourcePath" value={sourcePath} />
          <input type="hidden" name="universitySlug" value={universitySlug} />
          <input type="hidden" name="sourceUrl" />
          <input type="hidden" name="sourceQuery" defaultValue="{}" />
          <input type="hidden" name="pageTitle" />
          <input type="hidden" name="documentReferrer" />
          <input type="hidden" name="clientContext" defaultValue="{}" />
          <input
            ref={startedAtInputRef}
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

          <div className="field-grid field-grid--two">
            <div className="space-y-2">
              <Label htmlFor="peer-name">Full name</Label>
              <Input id="peer-name" name="fullName" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peer-phone">Phone number</Label>
              <PhoneInputField id="peer-phone" name="phone" required />
            </div>
          </div>

          <div className="field-grid field-grid--two">
            <div className="space-y-2">
              <Label htmlFor="peer-email">
                Email <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="peer-email"
                name="email"
                type="email"
                placeholder="you@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peer-state">State</Label>
              <div className="relative">
                <select
                  id="peer-state"
                  name="userState"
                  required
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="h-11 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled className="text-muted-foreground">
                    Select state
                  </option>
                  {INDIAN_STATES.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="field-grid field-grid--two">
            <div className="space-y-2">
              <Label htmlFor="peer-district">
                City <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <div className="relative">
                <select
                  id="peer-district"
                  name="userCity"
                  disabled={cities.length === 0}
                  defaultValue=""
                  className="h-11 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{selectedState ? "Select city" : "Select state first"}</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="peer-language">
                Language preference <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <div className="relative">
                <select
                  id="peer-language"
                  name="languagePreference"
                  defaultValue=""
                  className="h-11 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">No preference</option>
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
          </div>

          {state.error && (
            <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <Button type="submit" size="lg" className={cn("w-full")} disabled={isPending}>
            {isPending ? "Sending request..." : "Request a student conversation"}
          </Button>
        </form>
  );
}
