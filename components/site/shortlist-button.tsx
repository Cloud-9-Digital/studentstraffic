"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { addShortlistAction, removeShortlistAction } from "@/app/_actions/shortlist";
import { AuthGateModal } from "@/components/site/auth-gate-modal";
import { useShortlist } from "@/lib/shortlist-context";

export function ShortlistButton({ slug, name }: { slug: string; name: string }) {
  const { data: session, status } = useSession();
  const { isShortlisted, add, remove } = useShortlist();
  const shortlisted = isShortlisted(slug);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pending, setPending] = useState(false);

  async function doAdd() {
    setPending(true);
    try {
      const result = await addShortlistAction(slug);
      if ("success" in result) {
        add(slug);
        toast.success(`${name} added to shortlist`, {
          description: "View your shortlists in the dashboard.",
          action: { label: "View", onClick: () => { window.location.href = "/dashboard/shortlists"; } },
        });
      } else {
        toast.error("Could not save shortlist. Please try again.");
      }
    } finally {
      setPending(false);
    }
  }

  async function doRemove() {
    setPending(true);
    try {
      const result = await removeShortlistAction(slug);
      if ("success" in result) {
        remove(slug);
        toast(`${name} removed from shortlist`);
      } else {
        toast.error("Could not update shortlist. Please try again.");
      }
    } finally {
      setPending(false);
    }
  }

  async function handleShortlistAfterAuth() {
    setShowAuthModal(false);
    await doAdd();
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (pending || status === "loading") return;

    if (!session?.user) {
      setShowAuthModal(true);
      return;
    }

    if (shortlisted) {
      doRemove();
    } else {
      doAdd();
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={shortlisted ? `Remove ${name} from shortlist` : `Shortlist ${name}`}
        aria-pressed={shortlisted}
        disabled={pending || status === "loading"}
        onClick={handleClick}
        className={[
          "flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition-all duration-150",
          shortlisted
            ? "border-[#0f3d37]/30 bg-[#0f3d37] text-white shadow-sm"
            : "border-border bg-muted text-muted-foreground hover:border-[#0f3d37]/40 hover:bg-[#f0f7f5] hover:text-[#0f3d37]",
        ].join(" ")}
      >
        {pending ? (
          <Loader2 className="size-3 shrink-0 animate-spin" />
        ) : shortlisted ? (
          <BookmarkCheck className="size-3 shrink-0" strokeWidth={2.5} />
        ) : (
          <Bookmark className="size-3 shrink-0" strokeWidth={2.5} />
        )}
        <span>{shortlisted ? "Shortlisted" : "Shortlist"}</span>
      </button>

      <AuthGateModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={handleShortlistAfterAuth}
        universityName={name}
      />
    </>
  );
}
