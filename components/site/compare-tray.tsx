"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { ArrowRight, GitCompare, Plus, Trash2, X } from "lucide-react";

import { type CompareItem, useCompare } from "@/lib/compare-context";

function CompareManagerItem({ item, onRemove }: { item: CompareItem; onRemove: () => void }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/20 px-3 py-2.5">
      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
        {item.logoUrl ? (
          <Image
            src={item.logoUrl}
            alt=""
            width={36}
            height={36}
            className="size-full object-contain p-0.5"
          />
        ) : (
          <span className="text-xs font-bold text-primary">{item.name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{item.name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label={`Remove ${item.name} from comparison`}
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}

export function CompareTray() {
  const { items, clear, toggle } = useCompare();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const count = items.length;
  const isReady = count >= 2;

  function openComparison() {
    if (!isReady) {
      setOpen(false);
      router.push("/universities");
      return;
    }

    const keys = ["a", "b", "c", "d"] as const;
    const query = items
      .slice(0, 4)
      .map((item, index) => `${keys[index]}=${item.slug}`)
      .join("&");

    setOpen(false);
    startTransition(() => {
      router.push(`/compare/live?${query}`);
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div
        aria-live="polite"
        className={[
          "fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-3 z-[45] transition-all duration-300 md:bottom-5 md:right-6",
          count > 0 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        ].join(" ")}
      >
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="flex min-h-11 items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:bg-primary/95 active:scale-[0.97]"
            aria-label={`Manage ${count} selected ${count === 1 ? "university" : "universities"} for comparison`}
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-white/15">
              <GitCompare className="size-3.5" aria-hidden />
            </span>
            <span>{count} selected</span>
          </button>
        </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 z-50 max-h-[min(78vh,40rem)] overflow-y-auto rounded-t-[1.75rem] border border-border bg-background p-5 shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(30rem,calc(100%-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.75rem]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Your comparison
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                Manage up to four universities, then compare them side by side.
              </Dialog.Description>
            </div>
            <Dialog.Close className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X className="size-4" />
              <span className="sr-only">Close comparison manager</span>
            </Dialog.Close>
          </div>

          <ul className="mt-5 space-y-2">
            {items.map((item) => (
              <CompareManagerItem
                key={item.slug}
                item={item}
                onRemove={() => {
                  toggle(item);
                  if (count === 1) setOpen(false);
                }}
              />
            ))}
          </ul>

          <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/universities");
              }}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-primary/20 px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              <Plus className="size-4" />
              Add university
            </button>
            <button
              type="button"
              onClick={openComparison}
              disabled={isPending}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-3 text-sm font-semibold text-white shadow-sm shadow-accent/25 transition-colors hover:bg-accent-strong disabled:opacity-60"
            >
              {isReady ? "Compare now" : "Add one more"}
              <ArrowRight className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              clear();
              setOpen(false);
            }}
            className="mx-auto mt-3 block text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
          >
            Clear comparison
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
