"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Search, MapPin, GraduationCap, ChevronDown, X } from "lucide-react";

import { CountryFlag } from "@/components/site/country-flag";
import { useNavCountries } from "@/components/app/nav-countries-client-provider";
import { useNavCourses } from "@/components/app/nav-courses-client-provider";
import { cn } from "@/lib/utils";

// A bottom sheet on mobile (full-width, slides up from the bottom, feels
// like a native app picker) that becomes a small centered popup at sm+.
function FieldPicker({
  open,
  onOpenChange,
  title,
  filter,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  filter?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col rounded-t-3xl border-t border-border shadow-2xl outline-none",
            "bg-[radial-gradient(circle_at_top_left,rgba(240,138,75,0.22),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(15,61,55,0.18),transparent_48%),linear-gradient(180deg,#f7f9f8_0%,#ffffff_60%)]",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=closed]:duration-200",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=open]:duration-300",
            "sm:inset-x-auto sm:inset-y-auto sm:left-1/2 sm:top-1/2 sm:h-[70vh] sm:w-[min(26rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border",
            "sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95",
          )}
        >
          <div className="flex justify-center pt-2.5 sm:hidden">
            <span className="h-1.5 w-10 rounded-full bg-border" aria-hidden />
          </div>
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-4">
            <DialogPrimitive.Title className="text-base font-semibold text-foreground">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
          {filter && (
            <div className="shrink-0 border-b border-border px-3 py-3">
              {filter}
            </div>
          )}
          <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function HeroSearch() {
  const router = useRouter();
  const navCountries = useNavCountries();
  const navCourses = useNavCourses();
  const [country, setCountry] = useState("");
  const [course, setCourse] = useState("");
  const [courseQuery, setCourseQuery] = useState("");
  const [openField, setOpenField] = useState<"country" | "course" | null>(null);

  function handleSearch() {
    const params = new URLSearchParams();
    if (country) params.set("country", country);
    if (course) params.set("course", course);
    router.push(`/universities${params.size ? `?${params}` : ""}`);
  }

  const selectedDestination = navCountries.find(
    (d) => d.href.split("/").pop() === country
  );
  const selectedCourse = navCourses.find((item) => item.slug === course);
  const matchingCourses = useMemo(() => {
    const query = courseQuery.trim().toLocaleLowerCase();
    const source = query
      ? navCourses.filter((item) => `${item.name} ${item.shortName}`.toLocaleLowerCase().includes(query))
      : navCourses;

    return source.slice(0, query ? 60 : 18);
  }, [courseQuery, navCourses]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-border bg-white shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1px_1fr_1px_auto]">

          {/* Destination */}
          <button
            type="button"
            onClick={() => setOpenField("country")}
            className={cn(
              "flex w-full items-center gap-3 rounded-tl-2xl rounded-tr-2xl px-5 py-4 text-left transition-colors hover:bg-muted/40 sm:rounded-tr-none",
              openField === "country" && "bg-muted/40",
            )}
          >
            <MapPin className="size-4 shrink-0 text-accent" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Destination
              </p>
              <div className="flex items-center gap-1.5">
                {selectedDestination && (
                  <CountryFlag
                    countryCode={selectedDestination.isoCode}
                    alt={selectedDestination.name}
                    width={16}
                    height={12}
                    className="rounded-sm shadow-flag"
                  />
                )}
                <p className={cn("truncate text-sm font-medium", selectedDestination ? "text-foreground" : "text-muted-foreground")}>
                  {selectedDestination ? selectedDestination.name : "Where to study?"}
                </p>
              </div>
            </div>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>

          {/* Divider */}
          <div className="h-px bg-border sm:h-auto sm:w-px" />

          {/* Course */}
          <button
            type="button"
            onClick={() => {
              setOpenField("course");
              setCourseQuery("");
            }}
            className={cn(
              "flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40",
              openField === "course" && "bg-muted/40",
            )}
          >
            <GraduationCap className="size-4 shrink-0 text-accent" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Course
              </p>
              <p className={cn("truncate text-sm font-medium", selectedCourse ? "text-foreground" : "text-muted-foreground")}>
                {selectedCourse ? selectedCourse.name : "What to study?"}
              </p>
            </div>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>

          {/* Divider */}
          <div className="h-px bg-border sm:h-auto sm:w-px" />

          {/* Search button */}
          <div className="flex items-center p-2.5">
            <button
              type="button"
              onClick={handleSearch}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90 sm:w-auto"
            >
              <Search className="size-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      <FieldPicker
        open={openField === "country"}
        onOpenChange={(open) => setOpenField(open ? "country" : null)}
        title="Where do you want to study?"
      >
        <div className="grid grid-cols-2 gap-1">
          {navCountries.map((dest) => (
            <button
              key={dest.href}
              type="button"
              onClick={() => { setCountry(dest.href.split("/").pop()!); setOpenField(null); }}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-left transition-colors hover:bg-muted",
                country === dest.href.split("/").pop() && "bg-primary/8 font-medium text-primary"
              )}
            >
              <CountryFlag
                countryCode={dest.isoCode}
                alt={dest.name}
                width={20}
                height={15}
                className="shrink-0 rounded-sm shadow-flag"
              />
              <span className="truncate">{dest.name}</span>
            </button>
          ))}
        </div>
      </FieldPicker>

      <FieldPicker
        open={openField === "course"}
        onOpenChange={(open) => {
          setOpenField(open ? "course" : null);
          if (!open) setCourseQuery("");
        }}
        title="What do you want to study?"
        filter={
          <label className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={courseQuery}
              onChange={(event) => setCourseQuery(event.target.value)}
              placeholder="Search programs"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
        }
      >
        <div className="space-y-0.5">
          {matchingCourses.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => { setCourse(c.slug); setCourseQuery(""); setOpenField(null); }}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted",
                course === c.slug && "bg-primary/8 text-primary"
              )}
            >
              <span className="min-w-0 text-sm font-semibold">{c.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{c.shortName}</span>
            </button>
          ))}
          {matchingCourses.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No published program matches that search.
            </p>
          ) : null}
          {!courseQuery && navCourses.length > matchingCourses.length ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              Showing the first {matchingCourses.length}. Search by program name to see the rest.
            </p>
          ) : null}
        </div>
      </FieldPicker>
    </div>
  );
}
