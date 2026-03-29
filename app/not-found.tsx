import Link from "next/link";
import { MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-[88vh] overflow-hidden bg-background">

      {/* Dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.35,
        }}
      />

      {/* Accent slash */}
      <div
        className="pointer-events-none absolute -right-32 top-0 h-full w-72 bg-accent/4 -skew-x-6"
        aria-hidden
      />

      <div className="container-shell relative z-10 flex min-h-[88vh] flex-col justify-center py-24">


        {/* Main content */}
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left — typography */}
          <div>
            {/* Oversized 404 */}
            <div className="relative">
              <p
                className="font-display select-none text-[10rem] font-semibold leading-none tracking-tighter text-heading/[0.06] sm:text-[14rem] lg:text-[16rem]"
                aria-hidden
              >
                404
              </p>
            </div>

            <div className="mt-2">
              <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-heading sm:text-4xl">
                Wrong destination.
              </h1>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
                This page doesn&apos;t exist — but the right university for
                your MBBS journey does. Let&apos;s get you back on track.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="default">
                  <Link href="/">
                    Go home
                    <MoveRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default">
                  <Link href="/universities">Find universities</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right — decorative card stack */}
          <div className="hidden lg:block">
            <div className="relative mx-auto w-72">
              {/* Card 3 (back) */}
              <div className="absolute -right-4 -top-4 h-40 w-full rounded-2xl border border-border bg-muted/60" />
              {/* Card 2 (mid) */}
              <div className="absolute -right-2 -top-2 h-40 w-full rounded-2xl border border-border bg-muted/80" />
              {/* Card 1 (front) */}
              <div className="relative rounded-2xl border border-border bg-background p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-accent/10" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-32 rounded-full bg-muted" />
                    <div className="h-2 w-20 rounded-full bg-muted" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-muted" />
                  <div className="h-2 w-4/5 rounded-full bg-muted" />
                  <div className="h-2 w-3/5 rounded-full bg-muted" />
                </div>
                <div className="mt-5 flex gap-2">
                  <div className="h-7 w-20 rounded-full bg-accent/15" />
                  <div className="h-7 w-16 rounded-full bg-muted" />
                </div>
                {/* "Not found" stamp */}
                <div className="absolute right-4 top-4 rotate-12 rounded border-2 border-accent/40 px-2 py-0.5">
                  <span className="text-[0.6rem] font-bold uppercase tracking-widest text-accent/60">
                    Not found
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>


      </div>
    </div>
  );
}
