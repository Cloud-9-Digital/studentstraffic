"use client";

import { useActionState, useRef } from "react";
import { ChevronDown, MessagesSquare } from "lucide-react";

import {
  type PeerRequestFormState,
  submitPeerRequestAction,
} from "@/app/_actions/submit-peer-request";
import { syncLeadTrackingFields } from "@/components/site/lead-tracking";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
  const formRef = useRef<HTMLFormElement | null>(null);
  const startedAtInputRef = useRef<HTMLInputElement | null>(null);

  const armStartedAt = () => {
    syncLeadTrackingFields(formRef.current);

    if (startedAtInputRef.current && startedAtInputRef.current.value === "0") {
      startedAtInputRef.current.value = String(Date.now());
    }
  };

  return (
    <Card className="border-border/80 bg-card/95 shadow-lg">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <MessagesSquare className="size-5" />
          </div>
          <div>
            <CardTitle className="font-display text-2xl tracking-tight text-heading">
              Talk to peers
            </CardTitle>
            <CardDescription className="mt-1 text-sm leading-6">
              Share what you want to know about {universityName}, and we&apos;ll
              help you request a student conversation.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form
          ref={formRef}
          action={formAction}
          className="space-y-4"
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
                  defaultValue=""
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
              <Label htmlFor="peer-course">
                Course interest <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="peer-course"
                name="courseInterest"
                placeholder="MBBS, BDS, MD / MS..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peer-contact-mode">
                Preferred contact mode <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <div className="relative">
                <select
                  id="peer-contact-mode"
                  name="preferredContactMode"
                  defaultValue=""
                  className="h-11 w-full min-w-0 appearance-none rounded-xl border border-input bg-transparent px-4 py-3 pr-9 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">No preference</option>
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Either">Either</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="peer-message">
              Questions you want to ask <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="peer-message"
              name="message"
              rows={5}
              placeholder="Ask about classes, hostel life, city adjustment, safety, teaching style, or day-to-day student experience."
            />
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
      </CardContent>
    </Card>
  );
}
