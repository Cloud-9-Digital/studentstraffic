"use client";

import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";

import { LeadFormSkeleton } from "@/components/site/lead-form-skeleton";
import type { LeadFormProps } from "@/components/site/lead-form";

export function DeferredLeadForm(props: LeadFormProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [LeadFormComponent, setLeadFormComponent] =
    useState<ComponentType<LeadFormProps> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "320px 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || LeadFormComponent) return;

    let cancelled = false;

    import("@/components/site/lead-form").then((mod) => {
      if (!cancelled) {
        setLeadFormComponent(() => mod.LeadForm);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [LeadFormComponent, shouldLoad]);

  return (
    <div ref={containerRef}>
      {LeadFormComponent ? (
        <LeadFormComponent {...props} />
      ) : (
        <LeadFormSkeleton
          embedded={props.embedded}
          title={props.title}
          description={props.description}
        />
      )}
    </div>
  );
}
