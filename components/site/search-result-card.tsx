import Link from "next/link";
import { ArrowUpRight, CircleDollarSign, SearchCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SearchDocumentType, SearchResult } from "@/lib/data/types";
import { formatCurrencyUsd } from "@/lib/utils";

function getTypeLabel(documentType: SearchDocumentType) {
  switch (documentType) {
    case "country":
      return "Country";
    case "course":
      return "Course";
    case "university":
      return "University";
    case "program":
      return "Program";
    case "landing_page":
      return "Landing Page";
    default:
      return "Result";
  }
}

export function SearchResultCard({ result }: { result: SearchResult }) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge>{getTypeLabel(result.documentType)}</Badge>
          {result.countrySlug ? (
            <Badge variant="outline" className="bg-muted/50">
              {result.countrySlug}
            </Badge>
          ) : null}
          {result.courseSlug ? (
            <Badge variant="outline" className="bg-muted/50">
              {result.courseSlug}
            </Badge>
          ) : null}
        </div>
        <div className="space-y-2">
          <CardTitle>{result.title}</CardTitle>
          {result.subtitle ? <CardDescription>{result.subtitle}</CardDescription> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-muted-foreground">
          {result.summary}
        </p>

        <div className="flex flex-wrap gap-2">
          {result.highlights.slice(0, 4).map((highlight) => (
            <span
              key={highlight}
              className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground"
            >
              {highlight}
            </span>
          ))}
        </div>

        {(result.annualTuitionUsd || result.medium) ? (
          <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            {result.annualTuitionUsd ? (
              <div className="rounded-xl border border-border bg-muted/60 p-3">
                <CircleDollarSign className="mb-2 h-4 w-4 text-accent" />
                <p className="font-semibold text-foreground">
                  {formatCurrencyUsd(result.annualTuitionUsd)}
                </p>
                <p>Annual tuition</p>
              </div>
            ) : null}

            {result.medium ? (
              <div className="rounded-xl border border-border bg-muted/60 p-3">
                <SearchCheck className="mb-2 h-4 w-4 text-accent" />
                <p className="font-semibold text-foreground">
                  {result.medium}
                </p>
                <p>Medium</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Link
          href={result.path}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          Open result
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
