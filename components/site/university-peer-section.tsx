import { Badge } from "@/components/ui/badge";
import { PeerRequestForm } from "@/components/site/peer-request-form";
import { getUniversityPeerAvailability } from "@/lib/university-community";

const TOPICS = [
  "How classes and teaching feel in practice",
  "What daily life in the city is actually like",
  "Hostel, food, commute, and settling in",
  "What they wish they knew before choosing",
] as const;

export async function UniversityPeerSection({
  universitySlug,
  universityName,
}: {
  universitySlug: string;
  universityName: string;
}) {
  const availability = await getUniversityPeerAvailability(universitySlug);

  return (
    <div id="talk-to-peers" className="deferred-render space-y-6 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Talk to peers
        </h2>
        {availability.hasPeers ? (
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-accent">
            Student conversations available
          </Badge>
        ) : null}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(380px,1.2fr)]">
        <div className="section-tint rounded-[1.75rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent/80">
            Student perspective
          </p>
          <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-heading">
            Ask questions you can&apos;t get from brochures.
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            If you want a first-hand view of student life at {universityName},
            this is the place to ask about academics, daily routine, city
            adjustment, and living experience.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {TOPICS.map((topic) => (
              <div
                key={topic}
                className="rounded-2xl border border-border/70 bg-white/75 px-4 py-3 text-sm text-foreground shadow-sm"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>

        <PeerRequestForm
          sourcePath={`/universities/${universitySlug}`}
          universitySlug={universitySlug}
          universityName={universityName}
        />
      </div>
    </div>
  );
}
