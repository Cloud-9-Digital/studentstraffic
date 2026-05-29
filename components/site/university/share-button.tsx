"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const fullUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this university"
      title={copied ? "Link copied!" : "Share"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/8 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
    </button>
  );
}
