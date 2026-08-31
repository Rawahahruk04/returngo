import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { RevealList } from "@/components/motion/reveal-list";
import { Button } from "@/components/ui/button";
import { runMatchEngine } from "@/features/matching/engine/match-engine";
import type { MatchRequest } from "@/features/matching/types";
import { ImpactCard } from "@/features/matching/components/impact-card";
import { MatchResultCard } from "@/features/matching/components/match-result-card";

export const metadata: Metadata = {
  title: "Match Engine",
  description: "How ReturnGo's rule-based match engine ranked this route — every recommendation, scored and explained.",
};

/**
 * Deliberately the Match Engine's own `journeyType` vocabulary
 * (`MatchRequest["journeyType"]`), not the Book Taxi passenger flow's
 * `JourneyType` — this page is the engine-reasoning showcase and can
 * still exercise the engine's "rental" candidate tier even though
 * Book Taxi itself no longer sends a "rental" purpose.
 */
function parseJourneyType(value: string | undefined): MatchRequest["journeyType"] {
  if (value === "airport" || value === "hospital" || value === "intercity" || value === "rental") {
    return value;
  }
  return "intercity";
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function MatchEnginePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const originId = firstValue(params.from) ?? "bhatkal";
  const destinationId = firstValue(params.to) ?? "mangalore-airport";
  const date = firstValue(params.date) ?? "";
  const time = firstValue(params.time) ?? "08:00";
  const passengers = Number(firstValue(params.passengers) ?? "1") || 1;
  const journeyType = parseJourneyType(firstValue(params.type));
  const flexible = firstValue(params.flexible) === "true";

  const origin = getLocation(originId);
  const destination = getLocation(destinationId);

  const engineOutput = runMatchEngine({
    originId,
    destinationId,
    date,
    time,
    passengers,
    journeyType,
    flexibleDeparture: flexible,
  });

  const queryString = new URLSearchParams({
    from: originId,
    to: destinationId,
    date,
    time,
    passengers: String(passengers),
    type: journeyType,
  }).toString();

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <Link
        href={`/matches?${queryString}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to matches
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-widest text-secondary">
          <Sparkles className="size-3.5" /> ReturnGo Match Engine
        </span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        {origin?.name} to {destination?.name}
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Every candidate below is generated and ranked by an explainable, rule-based engine — not a black box. No
        machine learning, no randomness: the same request always produces the same ranked list.
      </p>

      <h2 className="sr-only">Match Engine results</h2>
      <div className="mt-8">
        <ImpactCard impact={engineOutput.regionalImpact} title="Regional impact of this route" />
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <RevealList>
          {engineOutput.results.map((result) => (
            <MatchResultCard key={result.id} result={result} />
          ))}
        </RevealList>
      </div>

      <div className="mt-10 rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
        Ranking order follows ReturnGo&apos;s fixed match priority — return journeys first, then shared, nearby
        flexible, direct, and rental — with the weighted Match Score breaking ties inside each tier.{" "}
        <Button asChild variant="link" className="text-sm">
          <Link href="/plan">Adjust your journey details</Link>
        </Button>
      </div>
    </section>
  );
}
