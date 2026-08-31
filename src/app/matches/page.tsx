import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, HeartPulse, MapPin, Plane, Route as RouteIcon, Sparkles } from "lucide-react";

import { getLocation } from "@/features/journey/data/locations";
import { getMatchesForQuery } from "@/features/journey/data/matches";
import type { JourneyType, TripType } from "@/features/journey/types";
import { MatchCard } from "@/features/journey/components/match-card";
import { RevealList } from "@/components/motion/reveal-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Smart Matches",
  description: "Ranked journeys for your route, including any driver already making the trip as an empty return leg.",
};

const JOURNEY_TYPE_META: Record<JourneyType, { label: string; icon: typeof Plane; note: string }> = {
  airport: { label: "Airport journey", icon: Plane, note: "Matches are ranked with buffer time before scheduled departures." },
  hospital: { label: "Hospital visit", icon: HeartPulse, note: "Matches are ranked with buffer time before appointment slots." },
  intercity: { label: "Intercity trip", icon: RouteIcon, note: "Ranked by how well each journey overlaps with your route." },
  local: { label: "Local trip", icon: MapPin, note: "Ranked by how well each journey overlaps with your route." },
};

function parseJourneyType(value: string | undefined): JourneyType {
  if (value === "airport" || value === "hospital" || value === "intercity" || value === "local") {
    return value;
  }
  return "intercity";
}

function parseTripType(value: string | undefined): TripType {
  return value === "entire" ? "entire" : "share";
}

export default async function SmartMatchesPage({
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
  const tripType = parseTripType(firstValue(params.tripType));
  const flexible = firstValue(params.flexible) === "true";

  const origin = getLocation(originId);
  const destination = getLocation(destinationId);
  const typeMeta = JOURNEY_TYPE_META[journeyType];
  const TypeIcon = typeMeta.icon;

  const allMatches = getMatchesForQuery({
    originId,
    destinationId,
    date,
    time,
    passengers,
    journeyType,
    tripType,
    flexible,
  });

  // Book Taxi never mixes in Rental, and Trip Type narrows results to
  // exactly the dedicated-vehicle vs. shared-seat kind the passenger chose.
  const matches = allMatches.filter((match) => {
    if (match.kind === "rental") return false;
    return tripType === "entire" ? match.kind === "direct" : match.kind === "return" || match.kind === "shared";
  });

  const queryString = new URLSearchParams({
    from: originId,
    to: destinationId,
    date,
    time,
    passengers: String(passengers),
    type: journeyType,
    tripType,
  }).toString();

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
      <Link
        href="/plan"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Change journey
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-widest text-secondary">
          <TypeIcon className="size-3.5" /> {typeMeta.label}
        </span>
        <Badge variant="neutral">{tripType === "entire" ? "Entire Taxi" : "Share Seat"}</Badge>
        <span className="text-xs text-muted-foreground">Step 2 of 3</span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        {origin?.name} to {destination?.name}
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        {tripType === "entire"
          ? "Here's a dedicated vehicle for your trip — no coordination with other passengers."
          : matches.some((match) => match.kind === "return")
            ? "Good news — a driver is already making this exact return leg. That match is ranked first below."
            : "No empty return leg matches this route yet, but here's what's available now."}{" "}
        {typeMeta.note}
      </p>

      <h2 className="sr-only">Ranked matches for this journey</h2>
      <div className="mt-8 flex flex-col gap-4">
        <RevealList>
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} query={queryString} />
          ))}
        </RevealList>
      </div>

      <Link
        href={`/matches/engine?${queryString}`}
        className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-secondary/40 bg-secondary/5 p-5 text-left transition-colors hover:bg-secondary/10"
      >
        <span>
          <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-secondary">
            <Sparkles className="size-3.5" /> See the Match Engine&apos;s reasoning
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Every score, explanation, and regional impact figure behind these matches — ranked and explainable.
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-secondary" />
      </Link>

      <div className="mt-10 rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
        None of these fit your schedule?{" "}
        <Button asChild variant="link" className="text-sm">
          <Link href="/plan">Adjust your journey details</Link>
        </Button>{" "}
        and we&apos;ll check again.
      </div>
    </section>
  );
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
