"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, GraduationCap, ChevronDown } from "lucide-react";

import { navDestinations, navCourses } from "@/lib/constants";
import { CountryFlag } from "@/components/site/country-flag";
import { cn } from "@/lib/utils";

export function HeroSearch() {
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [course, setCourse] = useState("");
  const [activeField, setActiveField] = useState<"country" | "course" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch() {
    const params = new URLSearchParams();
    if (country) params.set("country", country);
    if (course) params.set("course", course);
    router.push(`/universities${params.size ? `?${params}` : ""}`);
  }

  const selectedDestination = navDestinations.find(
    (d) => d.href.split("/").pop() === country
  );
  const selectedCourse = navCourses.find(
    (c) => c.href.split("/").pop() === course
  );

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-border bg-white shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1px_1fr_1px_auto]">

          {/* Destination */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveField(activeField === "country" ? null : "country")}
              className={cn(
                "flex w-full items-center gap-3 rounded-tl-2xl rounded-tr-2xl px-5 py-4 text-left transition-colors hover:bg-muted/40 sm:rounded-tr-none",
                activeField === "country" && "bg-muted/40"
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
                      countryCode={selectedDestination.countryCode}
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
              <ChevronDown className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform duration-200", activeField === "country" && "rotate-180")} />
            </button>

            {/* Destination dropdown */}
            {activeField === "country" && (
              <div className="absolute left-0 top-full z-50 w-full min-w-[280px] rounded-b-xl border border-border bg-white p-3 shadow-xl sm:w-[340px]">
                <div className="grid grid-cols-2 gap-1">
                  {navDestinations.map((dest) => (
                    <button
                      key={dest.href}
                      type="button"
                      onClick={() => { setCountry(dest.href.split("/").pop()!); setActiveField(null); }}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-left transition-colors hover:bg-muted",
                        country === dest.href.split("/").pop() && "bg-primary/8 font-medium text-primary"
                      )}
                    >
                      <CountryFlag
                        countryCode={dest.countryCode}
                        alt={dest.name}
                        width={20}
                        height={15}
                        className="shrink-0 rounded-sm shadow-flag"
                      />
                      <span className="truncate">{dest.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-border sm:h-auto sm:w-px" />

          {/* Course */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveField(activeField === "course" ? null : "course")}
              className={cn(
                "flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40",
                activeField === "course" && "bg-muted/40"
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
              <ChevronDown className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform duration-200", activeField === "course" && "rotate-180")} />
            </button>

            {/* Course dropdown */}
            {activeField === "course" && (
              <div className="absolute left-0 top-full z-50 w-full min-w-[260px] rounded-b-xl border border-border bg-white p-3 shadow-xl">
                <div className="grid grid-cols-2 gap-1">
                  {navCourses.map((c) => (
                    <button
                      key={c.href}
                      type="button"
                      onClick={() => { setCourse(c.href.split("/").pop()!); setActiveField(null); }}
                      className={cn(
                        "flex flex-col rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted",
                        course === c.href.split("/").pop() && "bg-primary/8 text-primary"
                      )}
                    >
                      <span className="text-sm font-semibold">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

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
    </div>
  );
}
