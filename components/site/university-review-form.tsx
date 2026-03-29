"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Film, PencilLine, Star } from "lucide-react";

import {
  submitUniversityReviewAction,
  type UniversityReviewFormState,
} from "@/app/_actions/submit-university-review";
import { syncLeadTrackingFields } from "@/components/site/lead-tracking";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const initialState: UniversityReviewFormState = {};

type ReviewType = "text" | "youtube_video";

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star === value ? 0 : star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-muted-foreground transition-colors hover:text-yellow-400"
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              "size-6 transition-colors",
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-muted-foreground/40"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function UniversityReviewForm({
  sourcePath,
  universitySlug,
  universityName,
}: {
  sourcePath: string;
  universitySlug: string;
  universityName: string;
}) {
  const [reviewType, setReviewType] = useState<ReviewType>("text");
  const [starRating, setStarRating] = useState(0);
  const [state, formAction, isPending] = useActionState(
    submitUniversityReviewAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement | null>(null);
  const startedAtInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    formRef.current?.reset();
    setStarRating(0);

    if (startedAtInputRef.current) {
      startedAtInputRef.current.value = "0";
    }
  }, [state.success]);

  const armStartedAt = () => {
    syncLeadTrackingFields(formRef.current);

    if (startedAtInputRef.current && startedAtInputRef.current.value === "0") {
      startedAtInputRef.current.value = String(Date.now());
    }
  };

  return (
    <Card className="border-border/80 bg-card/95 shadow-lg">
      <CardHeader className="space-y-3">
        <div className="space-y-1">
          <CardTitle className="font-display text-2xl tracking-tight text-heading">
            Add a review
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            Share your perspective on {universityName} with either a written
            review or a YouTube video review.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form
          ref={formRef}
          action={formAction}
          className="space-y-4"
          onFocusCapture={armStartedAt}
          onPointerDownCapture={armStartedAt}
          onKeyDownCapture={armStartedAt}
          onSubmitCapture={armStartedAt}
        >
          <input type="hidden" name="sourcePath" value={sourcePath} />
          <input type="hidden" name="universitySlug" value={universitySlug} />
          <input type="hidden" name="reviewType" value={reviewType} />
          <input
            ref={startedAtInputRef}
            type="hidden"
            name="startedAt"
            defaultValue="0"
          />
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />
          {reviewType === "text" && starRating > 0 ? (
            <input type="hidden" name="starRating" value={starRating} />
          ) : null}

          <div className="grid gap-2">
            <Label>Review type</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setReviewType("text")}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                  reviewType === "text"
                    ? "border-accent bg-accent/8 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                )}
              >
                <PencilLine className="size-4 shrink-0" />
                <span className="text-sm font-medium">Text review</span>
              </button>
              <button
                type="button"
                onClick={() => setReviewType("youtube_video")}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                  reviewType === "youtube_video"
                    ? "border-accent bg-accent/8 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                )}
              >
                <Film className="size-4 shrink-0" />
                <span className="text-sm font-medium">YouTube video review</span>
              </button>
            </div>
          </div>

          <div className="field-grid field-grid--two">
            <div className="space-y-2">
              <Label htmlFor="review-name">Your name</Label>
              <Input id="review-name" name="reviewerName" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-email">
                Email <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="review-email"
                name="reviewerEmail"
                type="email"
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-context">
              Course / batch / context <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="review-context"
              name="reviewerContext"
              placeholder="MBBS, 3rd year, graduate, parent..."
            />
          </div>

          {reviewType === "text" ? (
            <>
              <div className="space-y-2">
                <Label>Rating <span className="font-normal text-muted-foreground">(optional)</span></Label>
                <StarSelector value={starRating} onChange={setStarRating} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-body">Your review</Label>
                <Textarea
                  id="review-body"
                  name="reviewBody"
                  rows={6}
                  placeholder="Share what stood out about academics, faculty support, city life, hostel experience, campus environment, or overall student life."
                  required
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="review-youtube">YouTube video URL</Label>
              <Input
                id="review-youtube"
                name="youtubeUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
          )}

          {state.error && (
            <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </p>
          )}

          {state.success && (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {state.success}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending ? "Publishing..." : "Publish review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
