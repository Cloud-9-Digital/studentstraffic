"use client";

import { createContext, useContext, useState } from "react";
import { X } from "lucide-react";
import { Dialog } from "radix-ui";

import { LeadForm } from "@/components/site/lead-form";

type LpDialogContextValue = { open: () => void };

const LpDialogContext = createContext<LpDialogContextValue | null>(null);

export function useLpDialog() {
  const ctx = useContext(LpDialogContext);
  if (!ctx) throw new Error("useLpDialog must be used inside LpDialogProvider");
  return ctx;
}

export function LpDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LpDialogContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 duration-200" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <Dialog.Title className="text-lg font-bold" style={{ color: "#0f3d37" }}>
                  Book a Free Counselling Call
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs text-gray-400">
                  We call you back and tell you exactly where to apply.
                </Dialog.Description>
              </div>
              <Dialog.Close className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                <X className="size-4" />
              </Dialog.Close>
            </div>

            {/* Form */}
            <div className="p-6">
              <LeadForm
                sourcePath="/mbbs-abroad"
                ctaVariant="mbbs-abroad-dialog"
                submitLabel="Book My Free Call →"
                stacked
                embedded
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </LpDialogContext.Provider>
  );
}
