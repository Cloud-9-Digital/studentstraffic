"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, GraduationCap, ChevronDown } from "lucide-react";

import { CountryFlag } from "@/components/site/country-flag";
import { useNavCountries } from "@/components/app/nav-countries-client-provider";
import { useNavCourses } from "@/components/app/nav-courses-client-provider";
import { cn } from "@/lib/utils";

export function HeroSearch() {
  const router = useRouter();
  const navCountries = useNavCountries();
  const navCourses = useNavCourses();
  const [country, setCountry] = useState("");
  const [course, setCourse] = useState("");
  const [courseQuery, setCourseQuery] = useState("");
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
              <ChevronDown className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform duration-200", activeField === "country" && "rotate-180")} />
            </button>

            {/* Destination dropdown */}
            {activeField === "country" && (
              <div className="absolute left-0 top-full z-50 w-full min-w-[280px] rounded-b-xl border border-border bg-white p-3 shadow-xl sm:w-[340px]">
                <div className="grid grid-cols-2 gap-1">
                  {navCountries.map((dest) => (
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
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-border sm:h-auto sm:w-px" />

          {/* Course */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setActiveField(activeField === "course" ? null : "course");
                setCourseQuery("");
              }}
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
              <div className="absolute left-0 top-full z-50 w-full min-w-[280px] rounded-b-xl border border-border bg-white p-3 shadow-xl sm:w-[380px]">
                <label className="flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-2">
                  <Search className="size-3.5 shrink-0 text-muted-foreground" />
                  <input
                    autoFocus
                    value={courseQuery}
                    onChange={(event) => setCourseQuery(event.target.value)}
                    placeholder="Search programs"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </label>
                <div className="mt-2 max-h-72 space-y-0.5 overflow-y-auto pr-1">
                  {matchingCourses.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => { setCourse(c.slug); setCourseQuery(""); setActiveField(null); }}
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
