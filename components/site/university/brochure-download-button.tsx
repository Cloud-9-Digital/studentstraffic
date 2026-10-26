"use client";

import { useRef, useState } from "react";
import { Download, LoaderCircle } from "lucide-react";

import type { LeadFormState } from "@/app/_actions/submit-lead";
import { CounsellingDialog } from "@/components/site/counselling-dialog";
import { Button } from "@/components/ui/button";
import { trackLeadFormSuccess } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const BROCHURE_CTA_VARIANT = "brochure_download";

type Status = "idle" | "loading" | "error";

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser (notably iOS Safari) time to start reading the blob.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Lead-gated brochure download. The first click asks the server; if the
 * student has not shared their details yet (401) the lead form opens, and a
 * successful submission sets the access cookie and starts the download
 * straight away. Later clicks anywhere on the site download directly.
 */
export function BrochureDownloadButton({
  universityName,
  universitySlug,
  countrySlug,
  courseSlug,
  className,
}: {
  universityName: string;
  universitySlug: string;
  countrySlug?: string;
  courseSlug?: string;
  className?: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fileName = `${universityName} brochure.pdf`;

  const download = async ({ afterLead = false } = {}) => {
    setStatus("loading");
    setMessage("Preparing your brochure…");

    try {
      const response = await fetch(`/api/brochures/${encodeURIComponent(universitySlug)}`, {
        credentials: "same-origin",
        cache: "no-store",
      });

      if (response.status === 401 && !afterLead) {
        setStatus("idle");
        setMessage("");
        setDialogOpen(true);
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setMessage(
          afterLead
            ? "Thanks, we have your details. The download could not start, so our team will share the brochure with you."
            : "The brochure is unavailable right now. Please try again in a moment.",
        );
        return;
      }

      saveBlob(await response.blob(), fileName);
      setStatus("idle");
      setMessage("Your brochure download has started.");
    } catch {
      setStatus("error");
      setMessage("The download could not start. Please check your connection and try again.");
    }
  };

  const onLeadSuccess = (state: LeadFormState) => {
    trackLeadFormSuccess(
      {
        source_path: typeof window !== "undefined" ? window.location.pathname : undefined,
        interest: universitySlug,
        variant: BROCHURE_CTA_VARIANT,
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      },
      state.eventId,
    );
    setDialogOpen(false);
    void download({ afterLead: true });
  };

  const isLoading = status === "loading";

  return (
    <>
      <Button
        ref={buttonRef}
        type="button"
        size="default"
        className={cn(
          "border border-white/20 bg-white/8 !text-white hover:bg-white/15 hover:!text-white",
          className,
        )}
        aria-haspopup="dialog"
        aria-busy={isLoading}
        disabled={isLoading}
        onClick={() => void download()}
      >
        {isLoading ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="size-4" aria-hidden="true" />
        )}
        Download brochure
      </Button>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "w-full text-xs leading-5",
          status === "error" ? "text-[#ffb38a]" : "text-white/60",
          !message && "sr-only",
        )}
      >
        {message}
      </p>

      <CounsellingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        returnFocusRef={buttonRef}
        title={`Get the ${universityName} brochure`}
        description="Share your details and the brochure will download straight away. An admissions specialist may follow up to help with your application."
        submitLabel="Download brochure"
        ctaVariant={BROCHURE_CTA_VARIANT}
        universitySlug={universitySlug}
        countrySlug={countrySlug}
        courseSlug={courseSlug}
        notes={`Brochure download: ${universityName}`}
        onLeadSuccess={onLeadSuccess}
        lockInterest
      />
    </>
  );
}
