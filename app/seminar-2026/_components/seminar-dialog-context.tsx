"use client";

import { createContext, useContext, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SeminarLeadForm } from "./seminar-lead-form";

type SeminarDialogContextValue = {
  open: (preselectedEvent?: string) => void;
};

const SeminarDialogContext = createContext<SeminarDialogContextValue | null>(null);

export function useSeminarDialog() {
  const ctx = useContext(SeminarDialogContext);
  if (!ctx) throw new Error("useSeminarDialog must be used inside SeminarDialogProvider");
  return ctx;
}

export function SeminarDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedEvent, setPreselectedEvent] = useState<string | undefined>();

  const open = (event?: string) => {
    setPreselectedEvent(event);
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setPreselectedEvent(undefined);
  };

  return (
    <SeminarDialogContext.Provider value={{ open }}>
      {children}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader className="mb-4">
            <DialogTitle
              className="text-xl font-semibold text-heading"
              style={{ fontFamily: "var(--font-sem), sans-serif" }}
            >
              {preselectedEvent
                ? `Register for ${preselectedEvent.split(" — ")[0]}`
                : "Reserve your free seat"}
            </DialogTitle>
            <DialogDescription>
              We&apos;ll WhatsApp you the venue details and timing.
            </DialogDescription>
          </DialogHeader>

          <SeminarLeadForm
            key={preselectedEvent ?? "__none__"}
            sourcePath="/seminar-2026"
            ctaVariant="seminar-2026-popup"
            submitLabel="Reserve my free seat →"
            defaultEvent={preselectedEvent}
          />
        </DialogContent>
      </Dialog>
    </SeminarDialogContext.Provider>
  );
}
